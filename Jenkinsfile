pipeline {

    agent any

    environment {
        IMAGE_NAME = "bhrateshd/nextgen-frontend"
    }

    stages {

        stage('Clone Repo') {
            steps {
                git 'https://github.com/bhrateshd/NextGen-Telco.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME:latest ./frontend'
            }
        }

        stage('DockerHub Login') {
            steps {
                withCredentials([usernamePassword(
                credentialsId: 'dockerhub-creds',
                usernameVariable: 'USER',
                passwordVariable: 'PASS'
                )]) {
                    sh 'echo $PASS | docker login -u $USER --password-stdin'
                }
            }
        }

        stage('Push Image') {
            steps {
                sh 'docker push $IMAGE_NAME:latest'
            }
        }

        stage('Deploy Container') {
            steps {
                sh 'docker rm -f nextgen-frontend || true'
                sh 'docker run -d -p 8081:80 --name nextgen-frontend $IMAGE_NAME:latest'
            }
        }

    }
}