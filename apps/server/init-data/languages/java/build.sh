#!/bin/sh

# Java compile wrapper-script for 'compile.sh'.
# See that script for syntax and more info.
#
# This script byte-compiles with the javac compiler and generates
# a shell script to run it with the java interpreter later.
#
# NOTICE: this compiler script cannot be used with the USE_CHROOT
# configuration option turned on, unless proper pre-configuration of
# the chroot environment has been taken care of!

FILE_PATH="$1"
shift
BIN_PATH="$1"
shift
MEMORY_LIMIT="$1"

# Stack size in the JVM in KB. Note that this will be deducted from
# the total memory made available for the heap.
MEM_STACK=65536

# Amount of memory reserved for the Java virtual machine in KB. The
# default below is just above the maximum memory usage of current
# versions of the jvm, but might need increasing in some cases.
MEM_JVM=65536

MEM_RESERVED=$((MEM_STACK + MEM_JVM))

# Calculate Java program memory limit as MEM_LIMIT_JAVA - max. JVM memory usage:
MEM_LIMIT_JAVA=$((MEMORY_LIMIT - MEM_RESERVED))

if [ $MEM_LIMIT_JAVA -le 0 ]; then
  echo "internal-error: total memory $MEM_LIMIT_JAVA KiB <= $MEM_JVM + $MEM_STACK = $MEM_RESERVED KiB reserved for JVM and stack leaves none for heap."
  exit 1
fi

MAIN_FILE=$(basename "$FILE_PATH" .java)

# Byte-compile:
javac -encoding UTF-8 -sourcepath . -d . "$FILE_PATH"
EXIT_CODE=$?
[ "$EXIT_CODE" -ne 0 ] && exit $EXIT_CODE

# Check if entry point is valid
javap "$MAIN_FILE" >/dev/null
EXIT_CODE=$?
[ "$EXIT_CODE" -ne 0 ] && exit $EXIT_CODE

# Write executing script:
# Executes java byte-code interpreter with following options
# -Xmx: maximum size of memory allocation pool
# -Xms: initial size of memory, improves runtime stability
# -XX:+UseSerialGC: Serialized garbage collector improves runtime stability
# -Xss${MEM_STACK}k: stack size as configured above
# -Dfile.encoding=UTF-8: set file encoding to UTF-8
cat >"$BIN_PATH" <<EOF
#!/bin/sh
# Generated shell-script to execute java interpreter on source.

exec java -Dfile.encoding=UTF-8 -XX:+UseSerialGC -Xss${MEM_STACK}k -Xms${MEM_LIMIT_JAVA}k -Xmx${MEM_LIMIT_JAVA}k '$MAIN_FILE' "\$@"
EOF

chmod a+x "$BIN_PATH"

exit 0
