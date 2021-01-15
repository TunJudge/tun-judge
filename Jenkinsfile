#!groovy

node("main") {
    stage("Checkout") {
        checkout([
            $class: 'GitSCM',
            branches: [[name: "*/${env.BRANCH_NAME}"]],
            doGenerateSubmoduleConfigurations: false,
            submoduleCfg: [],
            userRemoteConfigs: scm.userRemoteConfigs
        ])
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
