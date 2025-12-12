pipeline {
    agent any

    tools {
        maven 'M2_HOME'
    }

    options {
        timeout(time: 15, unit: 'MINUTES')
    }

    environment {
        APP_ENV = "DEV"
        IMAGE_NAME = 'zehim/devops-project:latest'
        FRONTEND_IMAGE = 'zehim/devops-frontend:latest'
        DOCKER_CREDENTIALS_ID = 'docker-hub-credentials'
    }

    stages {
        // --- STAGE 1: CHECKOUT ---
        stage('Git Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/MZahii/Devops.git'
            }
        }

        // --- PRE-REQUISITES ---
        stage('Unit Tests') {
            steps {
                sh 'mvn clean test'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonar-server') {
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
                script {
                    echo "Skipping strict Quality Gate for lab..."
                    sleep 5
                }
            }
        }

        // --- STAGE 2: BUILD BACKEND ---
        stage('Build') {
            steps {
                sh 'mvn package -Dmaven.test.skip=true'
            }
        }

        // --- STAGE 3: DOCKER BACKEND ---
        stage('Docker Build & Push (Backend)') {
            steps {
                sh "docker build -t ${IMAGE_NAME} ."
                
                withCredentials([usernamePassword(credentialsId: "$DOCKER_CREDENTIALS_ID", usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh "docker login -u ${USER} -p ${PASS}"
                    sh "docker push ${IMAGE_NAME}"
                }
            }
        }

        // --- STAGE 4: DOCKER FRONTEND (NEW) ---
        stage('Docker Build & Push (Frontend)') {
            steps {
                script {
                    // Build frontend from the 'frontend' folder
                    sh "docker build -t ${FRONTEND_IMAGE} ./frontend"
                    
                    // Push
                    withCredentials([usernamePassword(credentialsId: "$DOCKER_CREDENTIALS_ID", usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                        sh "docker login -u ${USER} -p ${PASS}"
                        sh "docker push ${FRONTEND_IMAGE}"
                    }
                }
            }
        }

        // --- STAGE 5: KUBERNETES SETUP ---
        stage('Kubernetes Deploy') {
            steps {
                script {
                    sh 'kubectl create namespace devops || true'
                }
            }
        }

        // --- STAGE 6: DEPLOY ALL APPS ---
        stage('Deploy Apps on K8s') {
            steps {
                script {
                    // Database & Backend
                    sh 'kubectl apply -f k8s-mysql.yaml -n devops'
                    sh 'kubectl apply -f k8s-spring.yaml -n devops'
                    
                    // Frontend (New)
                    sh 'kubectl apply -f k8s-frontend.yaml -n devops'
                    
                    // Restart to pull new images
                    sh 'kubectl rollout restart deployment/spring-app -n devops'
                    sh 'kubectl rollout restart deployment/frontend -n devops'
                }
            }
        }
    }

    post {
        always {
            junit '**/target/surefire-reports/*.xml'
            echo "====== Pipeline Finished ======"
        }
    }
}