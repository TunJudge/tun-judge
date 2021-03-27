def runInDocker(imageTag, command) {
    sh "docker run --rm -v '${env.WORKSPACE}:/app' -w /app ${imageTag} ${command}"
}

return this