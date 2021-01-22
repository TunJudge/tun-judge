#!groovy

properties properties: [
    disableConcurrentBuilds(),
    [
        $class: 'BuildDiscarderProperty',
        strategy: [
            $class: 'LogRotator',
            numToKeepStr: '10',
            daysToKeepStr: '7',
            artifactNumToKeepStr: '10',
            artifactDaysToKeepStr: '7'
        ]
    ]
]

final nodeDockerImage = "node:12.18.4-alpine"

node("main") {
    stage("Checkout") {
        checkout scm
    }

    stage("Yarn Install") {
        runInDocker(nodeDockerImage, "yarn install")
    }

    parallel(
        "Prettier Server": {
            stage("Prettier Server") {
                runInDocker(nodeDockerImage, "yarn prettier:server")
            }
        },
        "Prettier Client": {
            stage("Prettier Client") {
                runInDocker(nodeDockerImage, "yarn prettier:client")
            }
        },
        "Prettier Judge": {
            stage("Prettier Judge") {
                runInDocker(nodeDockerImage, "yarn prettier:judge")
            }
        }
    )

    def serverImage
    def judgeImage

    parallel(
        "Build Server": {
            stage("Build Server") {
                serverImage = docker.build("tunjudge/server:latest", "-f docker/Dockerfile.server .")
            }
        },
        "Build Judge": {
            stage("Build Judge") {
                judgeImage = docker.build("tunjudge/judge:latest", "-f docker/Dockerfile.judge .")
            }
        }
    )

    if (env.BRANCH_NAME == 'main') {
        docker.withRegistry('', 'docker') {
            parallel(
                "Publish Server": {
                    stage("Publish Server") {
                        serverImage.push()
                    }
                },
                "Publish Judge": {
                    stage("Publish Judge") {
                        judgeImage.push()
                    }
                }
            )
        }
    }
}

def runInDocker(imageTag, command) {
    sh "docker run -it --rm -v $PWD:/app -w /app ${imageTag} ${command}"
}
