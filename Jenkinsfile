pipeline {


    agent any


    environment {
        IMAGE = "bhrateshd/nextgen-frontend"
        TAG = "${BUILD_NUMBER}"
    }


    stages {


        stage('Checkout') {
            steps {
                checkout scm
            }
        }


        stage('Build Image') {
            steps {
                sh "docker build -t ${IMAGE}:${TAG} ./frontend"
                sh "docker tag ${IMAGE}:${TAG} ${IMAGE}:latest"
            }
        }


        stage('Push Image') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub',
                        usernameVariable: 'DOCKERHUB_USER',
                        passwordVariable: '[Credentials]'
                    )
                ]) {
                    sh """
                    echo ${DOCKERHUB_PWD} | docker login -u ${DOCKERHUB_USER} --password-stdin
                    docker push ${IMAGE}:${TAG}
                    docker push ${IMAGE}:latest
                    """
                }
            }
        }


        stage('Deploy Container') {
            steps {
                sh 'docker rm -f nextgen-frontend || true'
                sh "docker run -d -p 8081:80 --name nextgen-frontend ${IMAGE}:latest"
            }
        }


    }
}

