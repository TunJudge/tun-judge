#include <algorithm>
#include <cmath>
#include <cstdint>
#include <cstring>
#include <fstream>
#include <future>
#include <iostream>
#include <iterator>
#include <limits>
#include <sstream>
#include <string>
#include <vector>

#include <fcntl.h>
#include <signal.h>
#include <sys/mman.h>
#include <sys/stat.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <unistd.h>

#define STDIN 0
#define STDOUT 1
#define STDERR 2

using namespace std;

/**
 * Function Prototypes.
 */
bool createProcess(pid_t &, sigset_t &);
void setupIoRedirection(const std::string &, const std::string &);
int runProcess(pid_t, sigset_t, const string &, int, int, int &, int &);
char **getCommandArgs(const string &commandLine);
int getMaxUsedMemory(pid_t, int);
int getCurrentUsedMemory(pid_t);
long long getMillisecondsNow();
int killProcess(pid_t &);

int main(int argc, char **argv) {
  if (argc != 6) {
    cerr << "Run the guard with: ./guard {timeLimit} {memoryLimit} "
            "'{runScriptWithArgs}' {inputFile} {outputFile}"
         << endl;
    return -1;
  }

  ofstream result("guard.json");

  int timeLimit = stol(string(argv[1]));
  int memoryLimit = stol(string(argv[2]));
  string commandLine = string(argv[3]);
  string inputFilePath = string(argv[4]);
  string outputFilePath = string(argv[5]);

  int usedTime = 0;
  int usedMemory = 0;
  int exitCode = 127;

  pid_t pid = -1;
  sigset_t sigset;
  if (!createProcess(pid, sigset)) {
    cerr << "[ERROR] Failed to fork a process." << endl;
    return -1;
  }

  // Setup I/O Redirection for Child Process
  if (pid == 0) {
    setupIoRedirection(inputFilePath, outputFilePath);
  }
  exitCode = runProcess(pid, sigset, commandLine, timeLimit, memoryLimit,
                        usedTime, usedMemory);

  result << "{";
  result << "\"usedTime\": " << usedTime << ", ";
  result << "\"usedMemory\": " << usedMemory << ", ";
  result << "\"exitCode\": " << exitCode;
  result << "}";
  result.close();
  return 0;
}

/**
 * Create process.
 * @param  pid    - Process ID
 * @param  sigset - Process marking
 * @return Run creation status(-1 means it was not successfully created, 0 means
 * child process)
 */
bool createProcess(pid_t &pid, sigset_t &sigset) {
  sigset_t originalSigset;
  sigemptyset(&sigset);
  sigaddset(&sigset, SIGCHLD);
  if (sigprocmask(SIG_BLOCK, &sigset, &originalSigset) < 0) {
    return false;
  }

  pid = fork();
  if (pid == -1) {
    return false;
  }
  return true;
}

/**
 * Run the process.
 * @param pid           -child process ID
 * @param sigset        -mark of the process
 * @param commandLine   -command line
 * @param timeLimit     -runtime time limit (ms)
 * @param memoryLimit   -runtime space limit (KB)
 * @param UsedTime      -Runtime used time (ms)
 * @param UsedMemory     -Runtime space occupied (ms)
 * @return process exit status
 */
int runProcess(pid_t pid, sigset_t sigset, const string &commandLine,
               int timeLimit, int memoryLimit, int &UsedTime, int &UsedMemory) {
  char **argv = getCommandArgs(commandLine);
  long long startTime = 0;
  long long endTime = 0;
  int exitCode = 0;
  future<int> feature;

  // Setup Monitor in Parent Process
  if (pid > 0) {
    // Memory Monitor
    feature = async(launch::async, getMaxUsedMemory, pid, memoryLimit);

    // Time Monitor
    struct timespec timeout;
    timeout.tv_sec = timeLimit / 1000;
    timeout.tv_nsec = timeLimit % 1000 * 1000000;

    startTime = getMillisecondsNow();
    do {
      if (sigtimedwait(&sigset, NULL, &timeout) < 0) {
        if (errno == EINTR) {
          /* Interrupted by a signal other than SIGCHLD. */
          continue;
        } else if (errno == EAGAIN) {
          killProcess(pid);
        } else {
          return 127;
        }
      }
      break;
    } while (true);
  }
  // Run Child Process
  if (pid == 0) {
    _exit(execvp(argv[0], argv));
  }

  // Collect information in Parent Process
  waitpid(pid, &exitCode, 0);
  endTime = getMillisecondsNow();
  UsedTime = endTime - startTime;
  UsedMemory = feature.get();

  return exitCode;
}

/**
 * Set up program I/O redirection.
 * @param inputFilePath    -the path of the input file when executing the
 * program (can be NULL)
 * @param outputFilePath   -the output file path after executing the program
 * (can be NULL)
 */
void setupIoRedirection(const std::string &inputFilePath,
                        const std::string &outputFilePath) {
  if (inputFilePath != "") {
    int inputFileDescriptor = open(inputFilePath.c_str(), O_RDONLY);
    dup2(inputFileDescriptor, STDIN);
    close(inputFileDescriptor);
  }
  if (outputFilePath != "") {
    int outputFileDescriptor = open(outputFilePath.c_str(), O_CREAT | O_WRONLY);
    chmod(outputFilePath.c_str(), S_IRUSR | S_IWUSR | S_IRGRP | S_IROTH);
    dup2(outputFileDescriptor, STDOUT);
    dup2(outputFileDescriptor, STDERR);
    close(outputFileDescriptor);
  }
}

/**
 * Get a list of command line parameters.
 * @param commandLine  -command line
 * @return command line parameter list
 */
char **getCommandArgs(const string &commandLine) {
  istringstream iss(commandLine);
  vector<string> args = {istream_iterator<string>{iss},
                         istream_iterator<string>{}};

  size_t numberOfArguments = args.size();
  char **argv = new char *[numberOfArguments + 1]();

  for (size_t i = 0; i < numberOfArguments; ++i) {
    char *arg = new char[args[i].size() + 1];
    strcpy(arg, args[i].c_str());
    argv[i] = arg;
  }
  argv[numberOfArguments] = nullptr;

  return argv;
}

/**
 * Whether to ignore the currently obtained memory usage value.
 * Due to the actual running process, the program may get the memory usage in
 * the JVM environment. In this case, we should ignore this value.
 * @param currentUsedMemory     -the currently acquired memory usage
 * @return Whether to ignore the currently acquired memory usage
 */
bool isCurrentUsedMemoryIgnored(int currentUsedMemory) {
  int jvmUsedMemory = getCurrentUsedMemory(getpid());
  if (currentUsedMemory >= jvmUsedMemory / 2 &&
      currentUsedMemory <= jvmUsedMemory * 2) {
    return true;
  }
  return false;
}

/**
 * Get the maximum memory usage at runtime
 * @param pid          -process ID
 * @param memoryLimit  -runtime space limit (KB)
 * @return Maximum memory usage during runtime
 */
int getMaxUsedMemory(pid_t pid, int memoryLimit) {
  int maxUsedMemory = 0, currentUsedMemory = 0;
  do {
    currentUsedMemory = getCurrentUsedMemory(pid);
    if (currentUsedMemory > maxUsedMemory &&
        !isCurrentUsedMemoryIgnored(currentUsedMemory)) {
      maxUsedMemory = currentUsedMemory;
    }
    if (memoryLimit != 0 && maxUsedMemory > memoryLimit) {
      killProcess(pid);
    }
    usleep(500);
  } while (currentUsedMemory != 0);

  return maxUsedMemory;
}

/**
 * Get memory usage.
 * @param pid  -process ID
 * @return Current physical memory usage (KB)
 */
int getCurrentUsedMemory(pid_t pid) {
  int currentUsedMemory = 0;
  long residentSetSize = 0L;

  std::string filePath("/proc/");
  filePath += std::to_string(pid) + "/statm";
  const char *cFilePath = filePath.c_str();

  FILE *fp = fopen(cFilePath, "r");
  if (fp != NULL) {
    if (fscanf(fp, "%*s%ld", &residentSetSize) == 1) {
      currentUsedMemory =
          (int)residentSetSize * (int)sysconf(_SC_PAGESIZE) >> 10;
      if (currentUsedMemory < 0) {
        currentUsedMemory = std::numeric_limits<int32_t>::max() >> 10;
      }
    }
    fclose(fp);
  }
  return currentUsedMemory;
}

/**
 * Get the current system time.
 * Used to count the running time of the program.
 * @return current system time (in milliseconds)
 */
long long getMillisecondsNow() {
  long milliseconds;
  time_t seconds;
  struct timespec spec;

  clock_gettime(CLOCK_REALTIME, &spec);
  seconds = spec.tv_sec;
  milliseconds = round(spec.tv_nsec / 1.0e6);
  long long currentTime = seconds * 1000 + milliseconds;

  return currentTime;
}

/**
 * Forced destruction process (when threshold is triggered).
 * @param pid  -process ID
 * @return 0, which means that the process was successfully terminated.
 */
int killProcess(pid_t &pid) { return kill(pid, SIGKILL); }
