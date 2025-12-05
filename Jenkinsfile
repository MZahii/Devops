pipeline {
    agent any

    tools {
        maven 'M2_HOME'
    }

    // PDF Requirement: Timeout
    options {
        timeout(time: 10, unit: 'MINUTES')
    }

    environment {
        IMAGE_NAME = 'zehim/devops-project:latest'
        DOCKER_CREDENTIALS_ID = 'docker-hub-credentials'
    }

    stages {
        stage('Code Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/MZahii/Devops.git'
            }
        }

        // STAGE 1: Unit Tests
        // We run tests here to generate the surefire-reports and JaCoCo data
        stage('Unit Tests') {
            steps {
                sh 'mvn clean test'
            }
        }

        // STAGE 2: SonarQube Analysis
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonar-server') {
                    // FIX: Changed port back to 9000 because your working file used 9000.
                    // Kept the coverage exclusions for entities.
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

        // STAGE 4: Package (Build)
        // PDF Requirement: Use -Dmaven.test.skip=true
        stage('Code Build') {
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

    // PDF Requirement: Post Actions
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