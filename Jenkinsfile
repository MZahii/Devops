pipeline {
    agent any

    tools {
        maven 'M2_HOME'
    }

    options {
        timeout(time: 10, unit: 'MINUTES')
    }

    environment {
        IMAGE_NAME = 'zehim/devops-project:latest'
        DOCKER_CREDENTIALS_ID = 'docker-hub-credentials'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/MZahii/Devops.git'
            }
        }

        stage('Test') {
            steps {
                sh 'mvn clean test'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                // IMPORTANT: If this fails, check "Manage Jenkins -> System -> SonarQube Servers"
                withSonarQubeEnv('sonar-server') {
                    // I have reset this to localhost:9000 matching your "working" file
                    sh '''
                      mvn sonar:sonar \
                      -Dsonar.projectKey=student-management \
                      -Dsonar.projectName="Student Management" \
                      -Dsonar.host.url=http://localhost:9000 \
                      -Dsonar.coverage.exclusions=**/model/**,**/entity/**,**/dto/**
                    '''
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Package') {
            steps {
                sh 'mvn package -Dmaven.test.skip=true'
            }
        }

        stage('Docker Build') {
            steps {
                sh "docker build -t ${IMAGE_NAME} ."
            }
        }

        stage('Docker Push') {
             steps {
                withCredentials([usernamePassword(credentialsId: "$DOCKER_CREDENTIALS_ID", usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh "docker login -u ${USER} -p ${PASS}"
                    sh "docker push ${IMAGE_NAME}"
                }
            }
        }
    }

    post {
        always {
            junit '**/target/surefire-reports/*.xml'
            echo "======always======"
        }
        success {
            echo "=====pipeline executed successfully ====="
        }
        failure {
            echo "======pipeline execution failed======"
        }
    }
}