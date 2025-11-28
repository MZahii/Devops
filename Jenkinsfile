    pipeline {
       agent any

       tools {
           maven 'M2_HOME'
           jdk 'jdk17'
       }

       environment {
           IMAGE_NAME = 'zehim/devops-project:latest'
           // Assure-toi d'avoir une credential avec cet ID exact dans Jenkins
            DOCKER_CREDENTIALS_ID = 'c85ad107-c988-416f-b3d7-7d25ce9599e0'
           // Récupère l'outil scanner configuré dans l'étape 3
           SCANNER_HOME = tool 'sonar-scanner'
       }

       stages {
           stage('Checkout') {
               steps {
                   git branch: 'main', url: 'https://github.com/MZahii/Devops.git'
               }
           }

           stage('Build & Test & Coverage') {
               steps {
                   // Lance les tests et crée le rapport jacoco.xml
                   sh 'mvn clean verify -DskipTests=false'
               }
           }

           stage('SonarQube Analysis') {
               steps {
                   withSonarQubeEnv('sonar-server') {
                       sh """
                           ${SCANNER_HOME}/bin/sonar-scanner \
                           -Dsonar.projectKey=student-management \
                           -Dsonar.projectName="Student Management" \
                           -Dsonar.sources=src/main/java \
                           -Dsonar.java.binaries=target/classes \
                           -Dsonar.coverage.jacoco.xmlReportPaths=target/site/jacoco/jacoco.xml
                       """
                   }
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
   }