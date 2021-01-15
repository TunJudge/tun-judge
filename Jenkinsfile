#!groovy

properties properties: [
    disableConcurrentBuilds(),
    [$class: 'BuildDiscarderProperty', strategy:
        [$class: 'LogRotator', artifactDaysToKeepStr: '7', artifactNumToKeepStr: '10', daysToKeepStr: '7', numToKeepStr: '10']
    ]
]

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
}
