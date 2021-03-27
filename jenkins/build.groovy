parallel(
    "Build Server": {
        stage("Build Server") {
            serverImage = docker.build("tunjudge/server", "-f docker/Dockerfile.server .")
        }
    },
    "Build Judge": {
        stage("Build Judge") {
            judgeImage = docker.build("tunjudge/judge", "-f docker/Dockerfile.judge .")
        }
    }
)
