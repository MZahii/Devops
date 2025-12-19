pipeline {
    agent any
    tools { maven 'M2_HOME' }
    
    environment {
        DOCKER_USER = 'zehim'
        BACKEND_IMG = "${DOCKER_USER}/devops-project:latest"
        FRONTEND_IMG = "${DOCKER_USER}/devops-frontend:latest"
    }
    
    stages {
        stage('Clean & Build Backend') {
            steps {
                sh 'mvn clean package -DskipTests'
            }
        }
        
        stage('Build Frontend Artifacts') {
            steps {
                dir('frontend') {
                    sh 'npm install && npm run build'
                }
            }
        }
        
        stage('Build & Push Images') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh "docker login -u $USER -p $PASS"
                    
                    // Backend
                    sh "docker build -t ${BACKEND_IMG} ."
                    sh "docker push ${BACKEND_IMG}"
                    
                    // Frontend
                    sh "docker build -t ${FRONTEND_IMG} ./frontend"
                    sh "docker push ${FRONTEND_IMG}"
                }
            }
        }
        
        stage('Deploy to Kubernetes') {
            steps {
                sh 'kubectl apply -f k8s-mysql.yaml'
                sh 'kubectl apply -f k8s-spring.yaml'
                sh 'kubectl apply -f k8s-frontend.yaml'
                sh 'kubectl apply -f k8s-monitoring.yaml'
                
                // Forcer le redémarrage pour prendre les nouvelles images
                sh 'kubectl rollout restart deployment/spring-app -n devops'
                sh 'kubectl rollout restart deployment/frontend -n devops'
            }
        }
    }
}