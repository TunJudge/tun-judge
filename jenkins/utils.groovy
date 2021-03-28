def runInDocker(imageTag, command, returnStdout = false) {
    return sh(
        script: "docker run --rm -v '${env.WORKSPACE}:/app' -w /app ${imageTag} ${command}",
        returnStdout: returnStdout
    )
}

def getReleaseTags(imageTag, isLatest = false) {
    def currentVersion = runInDocker(imageTag, "yarn --silent version:current", true).trim()
    def versionParts = currentVersion.tokenize(".")

    def tags = isLatest ? ["latest"] : []
    tags << versionParts[0]
    tags << versionParts[0] + "." + versionParts[1]
    tags << currentVersion

    return tags
}

return this
