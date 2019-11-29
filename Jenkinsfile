#!/usr/bin/env groovy
def now = new Date()
env.DATE = now.format("yyyyMMdd_HHmmss")
env.NAME = "documentation/slate"
prBranchRegex = /(pr|PR)-\d+$/

pipeline {
	agent any
	stages {
		stage('Checkout project...') {
            steps {
                checkout scm
            }
        }

        stage('Building PR') {
            when {
                expression {
                    env.BRANCH_NAME =~ prBranchRegex
                }
            }

            steps {
               script {
                 image = docker.build("docker.appdirect.tools/${env.NAME}:${env.BRANCH_NAME}")
               }
            }
        }

        stage('Building Release') {
            when {
                expression {
                    env.BRANCH_NAME == 'master'
                }
            }

            steps {
               script {
                 image = docker.build("docker.appdirect.tools/${env.NAME}:${env.DATE}")
               }
            }
        }

        stage('Test') {
            steps {
                script {
                    if (env.BRANCH_NAME == 'master') {
                        dockerVersion = env.DATE
                    } else {
                        dockerVersion = env.BRANCH_NAME
                    }
                    sh "${env.WORKSPACE}/slate-extract.sh ${dockerVersion}"
                }
            }
        }

        stage('Publishing PR') {
            when {
               expression {
                   env.BRANCH_NAME =~ prBranchRegex
               }
            }

            steps {
                script {
                  docker.withRegistry('https://docker.appdirect.tools', 'docker-rw') {
                     image.push("${env.BRANCH_NAME}")
                  }
                }
             }
        }

        stage('Publishing Release') {
            when {
                expression {
                    env.BRANCH_NAME == 'master'
                }
            }

            steps {
                script {
                  docker.withRegistry('https://docker.appdirect.tools', 'docker-rw') {
                     image.push("${env.DATE}")
                     image.push("latest")
                  }
                }
            }
        }

        stage('Tagging Release') {
            when {
                expression {
                    env.BRANCH_NAME == 'master'
                }
            }
            steps {
                sshagent(credentials: ['jenkins-github']) {
                    script {
                      sh "git tag '${env.DATE}'"
                      sh "git push origin '${env.DATE}'"
                    }
                }
             }
        }
        
        stage('Trigger build api-documentation') {
            when {
                expression {
                    env.BRANCH_NAME == 'master'
                }
            }
            steps {
                build job: '/api-documentation-pipeline/master', wait: false
            }
        }
    }
}
