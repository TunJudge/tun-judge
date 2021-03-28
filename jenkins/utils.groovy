def runInDocker(imageTag, command) {
    return sh(
        script: "docker run --rm -v '${env.WORKSPACE}:/app' -w /app ${imageTag} ${command}",
        returnStdout: true
    ).trim()
}

def getReleaseTags(imageTag, isLatest = false) {
    def currentVersion = runInDocker(imageTag, "yarn --silent version:current")
    def versionParts = currentVersion.split(".")

    def tags = isLatest ? ["latest"] : []
    tags << versionParts[0]
    tags << versionParts[0] + "." + versionParts[1]
    tags << currentVersion

    return tags
}

return this