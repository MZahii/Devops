pipeline {
    agent any

    tools {
        maven 'M2_HOME'
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

        stage('Build & Package') {
            steps {
                sh 'mvn clean package -DskipTests'
            }
        }

        stage('DEBUG: System Check') {
            steps {
                script {
                    echo "🔍 --- CHECKING FILES ---"
                    // List all files to see if Dockerfile exists
                    sh 'ls -la' 
                    
                    echo "👤 --- CHECKING USER ---"
                    // Check which user Jenkins is running as
                    sh 'whoami' 
                    sh 'id'

                    echo "🐳 --- CHECKING DOCKER PERMISSIONS ---"
                    // Check if Jenkins can talk to Docker
                    sh 'docker info' 
                }
            }
        }

        stage('Docker Build') {
            steps {
                echo '🔨 Building...'
                // Using double quotes for better variable safety
                sh "docker build -t ${IMAGE_NAME} ."
            }
        }
        
        stage('Docker Push') {
             steps {
                withCredentials([usernamePassword(credentialsId: "$DOCKER_CREDENTIALS_ID", usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh 'echo $PASS | docker login -u $USER --password-stdin'
                    sh "docker push ${IMAGE_NAME}"
                }
            }
        }
    }
}
