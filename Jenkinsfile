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
    def utils

    stage("Checkout") {
        checkout scm
        utils = load "jenkins/utils.groovy"
    }

    stage("Yarn Install") {
        utils.runInDocker(nodeDockerImage, "yarn install")
    }

    stage("Prettier") {
        utils.runInDocker(nodeDockerImage, "yarn prettier")
    }

    load "jenkins/build.groovy"

    jiraSendBuildInfo site: 'tun-judge.atlassian.net'
}
