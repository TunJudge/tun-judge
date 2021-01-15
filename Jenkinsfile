#!groovy

node("main") {
    stage("Checkout") {
        checkout scm
    }

    parallel("Build Server": {
        stage("Build Server") {
            sh "docker build -f docker/Dockerfile.server -t tunjudge/server ."
        }
    }, "Build Judge": {
        stage("Build Judge") {
            sh "docker build -f docker/Dockerfile.judge -t tunjudge/judge ."
        }
    })

    stage("List Docker images") {
        sh "docker images"
    }
}
