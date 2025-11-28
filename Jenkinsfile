pipeline {
    agent any

    tools {
        maven 'M2_HOME'
    }

    environment {
        // Your Docker Hub Image Name
        IMAGE_NAME = 'zehim/devops-project:latest'
        // The ID you created in Step 2
        DOCKER_CREDENTIALS_ID = 'docker-hub-credentials'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/MZahii/Devops.git'
            }
        }

        stage('Build') {
            steps {
                sh 'mvn clean compile'
            }
        }

        stage('Test') {
            steps {
                // If this fails, the Docker stages will NOT run.
                // If you want to force it, use: sh 'mvn test -Dmaven.test.failure.ignore=true'
                sh 'mvn test'
            }
        }

        stage('Package') {
            steps {
                sh 'mvn package -DskipTests'
                archiveArtifacts artifacts: 'target/*.jar', fingerprint: true
            }
        }

        stage('Docker Build') {
            steps {
                echo '🐳 Building Docker Image...'
                sh 'docker build -t $IMAGE_NAME .'
            }
        }

        stage('Docker Push') {
            steps {
                echo '🚀 Pushing to Docker Hub...'
                withCredentials([usernamePassword(credentialsId: "$DOCKER_CREDENTIALS_ID", usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    // Login to Docker Hub inside the pipeline
                    sh 'echo $PASS | docker login -u $USER --password-stdin'
                    // Push the image
                    sh 'docker push $IMAGE_NAME'
                }
            }
        }
    }

    post {
        success {
            echo "✅ SUCCÈS ! Image disponible sur: https://hub.docker.com/r/zehim/devops-project"
        }
        failure {
            echo "❌ ÉCHEC - Vérifiez la console."
        }
        cleanup {
            // Remove the image from the Jenkins server to save space
            sh 'docker rmi $IMAGE_NAME || true' 
        }
    }
}
