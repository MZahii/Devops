pipeline {
    agent any
    tools { maven 'M2_HOME' }
    environment {
        DOCKER_CREDENTIALS_ID = 'docker-hub-credentials'
    }
    stages {
        stage('Build & Test Backend') {
            steps {
                sh 'mvn clean package -DskipTests'
            }
        }
        stage('Build Frontend') {
            steps {
                // We build inside a Docker container to avoid node/npm issues on the Jenkins agent
                sh 'docker run --rm -v "$(pwd)/frontend":/app node:22-alpine /bin/sh -c "cd /app && npm install && npm run build"'
            }
        }
        stage('Build & Push Docker Images') {
            steps {
                withCredentials([usernamePassword(credentialsId: "$DOCKER_CREDENTIALS_ID", usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh "docker login -u ${USER} -p ${PASS}"

                    // Build and Push Backend
                    echo "--- Building Backend Image ---"
                    sh 'docker build -t zehim/devops-project:latest .'
                    echo "--- Pushing Backend Image ---"
                    sh 'docker push zehim/devops-project:latest'

                    // Build and Push Frontend
                    echo "--- Building Frontend Image ---"
                    sh 'docker build -t zehim/devops-frontend:latest ./frontend'
                    echo "--- Pushing Frontend Image ---"
                    sh 'docker push zehim/devops-frontend:latest'
                }
            }
        }
        stage('Deploy to Kubernetes') {
            steps {
                sh 'kubectl apply -f k8s-mysql.yaml'
                sh 'kubectl apply -f k8s-spring.yaml'
                sh 'kubectl apply -f k8s-frontend.yaml'
                sh 'kubectl rollout restart deployment/spring-app -n devops'
                sh 'kubectl rollout restart deployment/frontend -n devops'
            }
        }
    }
}