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
        utils = evaluate readFile("jenkins/utils.groovy")
        println(utils)
    }

    stage("Yarn Install") {
        utils.runInDocker(nodeDockerImage, "yarn install")
    }

    stage("Prettier") {
        utils.runInDocker(nodeDockerImage, "yarn prettier")
    }

    def serverImage
    def judgeImage

    evaluate readFile("jenkins/build.groovy")

//     if (env.BRANCH_NAME == 'main') {
//         def version
//
//         stage("Parse Version") {
//             final regex = '^.*"version": "([^"]+)".*$'
//             version = sh(
//                 script: "grep -E '${regex}' package.json | sed -E 's/${regex}/\\1/'",
//                 returnStdout: true
//             ).trim()
//         }
//
//         docker.withRegistry('', 'docker') {
//             parallel(
//                 "Publish Server": {
//                     stage("Publish Server") {
//                         serverImage.push(version)
//                         serverImage.push("latest")
//                     }
//                 },
//                 "Publish Judge": {
//                     stage("Publish Judge") {
//                         judgeImage.push(version)
//                         judgeImage.push("latest")
//                     }
//                 }
//             )
//         }
//     }

    jiraSendBuildInfo site: 'tun-judge.atlassian.net'
}
