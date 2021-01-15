#!groovy

ansiColor('GnomeTerminal') {
    timestamps {
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
        }
    }
}
