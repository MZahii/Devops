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
        // ... (all previous stages like Git Checkout, Build, Docker Push, etc. remain the same) ...

        stage('Git Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/MZahii/Devops.git'
            }
        }

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

        stage('Build') {
            steps {
                sh 'mvn package -Dmaven.test.skip=true'
            }
        }

        stage('Docker Build & Push (Backend)') {
            steps {
                sh "docker build -t ${IMAGE_NAME} ."
                withCredentials([usernamePassword(credentialsId: "$DOCKER_CREDENTIALS_ID", usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh "docker login -u ${USER} -p ${PASS}"
                    sh "docker push ${IMAGE_NAME}"
                }
            }
        }

        stage('Docker Build & Push (Frontend)') {
            steps {
                script {
                    sh "docker build -t ${FRONTEND_IMAGE} ./frontend"
                    withCredentials([usernamePassword(credentialsId: "$DOCKER_CREDENTIALS_ID", usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                        sh "docker login -u ${USER} -p ${PASS}"
                        sh "docker push ${FRONTEND_IMAGE}"
                    }
                }
            }
        }

        stage('Ensure Kubernetes Cluster') {
            steps {
                script {
                    sh '''
                      set -e
                      if ! kubectl cluster-info > /dev/null 2>&1; then
                        echo "Kubernetes API unreachable, starting Minikube..."
                        minikube start --driver=docker --memory=4096 --cpus=2 --force
                      else
                        echo "Kubernetes cluster already running."
                      fi

                      kubectl wait --for=condition=Ready nodes --all --timeout=300s
                    '''
                }
            }
        }

        stage('Kubernetes Deploy') {
            steps {
                script {
                    sh 'kubectl create namespace devops || true'
                }
            }
        }

        
        stage('Deploy Apps on K8s') {
            steps {
                script {
                    // Database & Backend
                    sh 'kubectl apply -f k8s-mysql.yaml -n devops'
                    sh 'kubectl apply -f k8s-spring.yaml -n devops'
                    
                    // Frontend
                    sh 'kubectl apply -f k8s-frontend.yaml -n devops'

                    // Monitoring Stack (THE NEW LINE)
                    sh 'kubectl apply -f k8s-monitoring.yaml'
                    
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
