pipeline {
    agent any

    tools {
        maven 'M2_HOME'
    }

    // PDF Requirement: Timeout option
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

        // STAGE 1: Run Tests & Generate Coverage (No packaging yet)
        stage('Test') {
            steps {
                sh 'mvn clean test'
            }
        }

        // STAGE 2: SonarQube
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonar-server') {
                    // 1. Restored localhost:9000 (It worked in your old file)
                    // 2. Added exclusions for entities/models
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

        // STAGE 3: Quality Gate
        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        // STAGE 4: Package (Build JAR, skip tests because we did them in Stage 1)
        stage('Package') {
            steps {
                // Using the syntax from your PDF
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

    // PDF Requirement: Post block
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