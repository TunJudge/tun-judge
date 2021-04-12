const { promisify } = require("util");
const { exec } = require("child_process");

const execAsync = promisify(exec);

if (process.argv.length !== 3) {
  console.error("Please give the image name!");
  process.exit(-1);
}

const image = process.argv.pop();

const { version } = require("../package.json");
const versionParts = version.split(".");
const tags = [
  version,
  `${versionParts[0]}.${versionParts[1]}`,
  versionParts[0],
  "latest",
];

(async () => {
  for (const tag of tags) {
    await execAsync(`docker tag ${image} ${image}:${tag}`);
    await execAsync(`docker push ${image}:${tag}`);
  }
})();
