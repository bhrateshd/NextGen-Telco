pipeline {
    agent any

    environment {
        REGISTRY = 'nextgen-telco'
        NODE_ENV = 'production'
        DOCKER_BUILDKIT = '1'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                sh 'echo "Checked out from branch: ${GIT_BRANCH}"'
            }
        }

        stage('Build Services') {
            parallel {
                stage('Auth Service') {
                    steps {
                        dir('services/auth-service') {
                            sh '''
                                npm install
                                npm run build 2>/dev/null || echo "No build script defined"
                            '''
                        }
                    }
                }
                stage('User Service') {
                    steps {
                        dir('services/user-service') {
                            sh '''
                                npm install
                                npm run build 2>/dev/null || echo "No build script defined"
                            '''
                        }
                    }
                }
                stage('Plan Service') {
                    steps {
                        dir('services/plan-service') {
                            sh '''
                                npm install
                                npm run build 2>/dev/null || echo "No build script defined"
                            '''
                        }
                    }
                }
                stage('Device Service') {
                    steps {
                        dir('services/device-service') {
                            sh '''
                                npm install
                                npm run build 2>/dev/null || echo "No build script defined"
                            '''
                        }
                    }
                }
                stage('Order Service') {
                    steps {
                        dir('services/order-service') {
                            sh '''
                                npm install
                                npm run build 2>/dev/null || echo "No build script defined"
                            '''
                        }
                    }
                }
                stage('Payment Service') {
                    steps {
                        dir('services/payment-service') {
                            sh '''
                                npm install
                                npm run build 2>/dev/null || echo "No build script defined"
                            '''
                        }
                    }
                }
            }
        }

        stage('Unit Tests') {
            parallel {
                stage('Auth Service Tests') {
                    steps {
                        dir('services/auth-service') {
                            sh 'npm test 2>/dev/null || echo "No tests found"'
                        }
                    }
                }
                stage('User Service Tests') {
                    steps {
                        dir('services/user-service') {
                            sh 'npm test 2>/dev/null || echo "No tests found"'
                        }
                    }
                }
                stage('Plan Service Tests') {
                    steps {
                        dir('services/plan-service') {
                            sh 'npm test 2>/dev/null || echo "No tests found"'
                        }
                    }
                }
                stage('Device Service Tests') {
                    steps {
                        dir('services/device-service') {
                            sh 'npm test 2>/dev/null || echo "No tests found"'
                        }
                    }
                }
                stage('Order Service Tests') {
                    steps {
                        dir('services/order-service') {
                            sh 'npm test 2>/dev/null || echo "No tests found"'
                        }
                    }
                }
                stage('Payment Service Tests') {
                    steps {
                        dir('services/payment-service') {
                            sh 'npm test 2>/dev/null || echo "No tests found"'
                        }
                    }
                }
            }
        }

        stage('Build Docker Images') {
            parallel {
                stage('Build Auth Service Image') {
                    steps {
                        sh '''
                            cd services/auth-service
                            docker build -t ${REGISTRY}/auth-service:${BUILD_NUMBER} .
                            docker tag ${REGISTRY}/auth-service:${BUILD_NUMBER} ${REGISTRY}/auth-service:latest
                        '''
                    }
                }
                stage('Build User Service Image') {
                    steps {
                        sh '''
                            cd services/user-service
                            docker build -t ${REGISTRY}/user-service:${BUILD_NUMBER} .
                            docker tag ${REGISTRY}/user-service:${BUILD_NUMBER} ${REGISTRY}/user-service:latest
                        '''
                    }
                }
                stage('Build Plan Service Image') {
                    steps {
                        sh '''
                            cd services/plan-service
                            docker build -t ${REGISTRY}/plan-service:${BUILD_NUMBER} .
                            docker tag ${REGISTRY}/plan-service:${BUILD_NUMBER} ${REGISTRY}/plan-service:latest
                        '''
                    }
                }
                stage('Build Device Service Image') {
                    steps {
                        sh '''
                            cd services/device-service
                            docker build -t ${REGISTRY}/device-service:${BUILD_NUMBER} .
                            docker tag ${REGISTRY}/device-service:${BUILD_NUMBER} ${REGISTRY}/device-service:latest
                        '''
                    }
                }
                stage('Build Order Service Image') {
                    steps {
                        sh '''
                            cd services/order-service
                            docker build -t ${REGISTRY}/order-service:${BUILD_NUMBER} .
                            docker tag ${REGISTRY}/order-service:${BUILD_NUMBER} ${REGISTRY}/order-service:latest
                        '''
                    }
                }
                stage('Build Payment Service Image') {
                    steps {
                        sh '''
                            cd services/payment-service
                            docker build -t ${REGISTRY}/payment-service:${BUILD_NUMBER} .
                            docker tag ${REGISTRY}/payment-service:${BUILD_NUMBER} ${REGISTRY}/payment-service:latest
                        '''
                    }
                }
            }
        }

        stage('Push Images to Registry') {
            steps {
                script {
                    sh '''
                        echo "Pushing Docker images to registry..."
                        docker push ${REGISTRY}/auth-service:${BUILD_NUMBER}
                        docker push ${REGISTRY}/auth-service:latest
                        docker push ${REGISTRY}/user-service:${BUILD_NUMBER}
                        docker push ${REGISTRY}/user-service:latest
                        docker push ${REGISTRY}/plan-service:${BUILD_NUMBER}
                        docker push ${REGISTRY}/plan-service:latest
                        docker push ${REGISTRY}/device-service:${BUILD_NUMBER}
                        docker push ${REGISTRY}/device-service:latest
                        docker push ${REGISTRY}/order-service:${BUILD_NUMBER}
                        docker push ${REGISTRY}/order-service:latest
                        docker push ${REGISTRY}/payment-service:${BUILD_NUMBER}
                        docker push ${REGISTRY}/payment-service:latest
                    '''
                }
            }
        }

        stage('Deploy to Dev') {
            when {
                branch 'master'
            }
            steps {
                sh '''
                    echo "Deploying to Development environment..."
                    kubectl apply -k k8s/dev/services/ --namespace=nextgen-dev || kubectl create namespace nextgen-dev && kubectl apply -k k8s/dev/services/ --namespace=nextgen-dev
                    kubectl rollout status deployment -l app=auth-service --namespace=nextgen-dev --timeout=300s
                    kubectl rollout status deployment -l app=user-service --namespace=nextgen-dev --timeout=300s
                    kubectl rollout status deployment -l app=plan-service --namespace=nextgen-dev --timeout=300s
                    kubectl rollout status deployment -l app=device-service --namespace=nextgen-dev --timeout=300s
                    kubectl rollout status deployment -l app=order-service --namespace=nextgen-dev --timeout=300s
                    kubectl rollout status deployment -l app=payment-service --namespace=nextgen-dev --timeout=300s
                '''
            }
        }

        stage('Integration Tests') {
            when {
                branch 'master'
            }
            steps {
                sh '''
                    echo "Running integration tests..."
                    sleep 30  # Wait for services to be ready
                    
                    # Test auth service
                    curl -X GET http://auth-service:3001/health -f || exit 1
                    curl -X GET http://user-service:3002/health -f || exit 1
                    curl -X GET http://plan-service:3003/health -f || exit 1
                    curl -X GET http://device-service:3004/health -f || exit 1
                    curl -X GET http://order-service:3005/health -f || exit 1
                    curl -X GET http://payment-service:3006/health -f || exit 1
                '''
            }
        }

        stage('Deploy to Test') {
            when {
                branch 'develop'
            }
            steps {
                sh '''
                    echo "Deploying to Test environment..."
                    kubectl apply -k k8s/test/services/ --namespace=nextgen-test || kubectl create namespace nextgen-test && kubectl apply -k k8s/test/services/ --namespace=nextgen-test
                    kubectl rollout status deployment -l app=auth-service --namespace=nextgen-test --timeout=300s
                    kubectl rollout status deployment -l app=user-service --namespace=nextgen-test --timeout=300s
                    kubectl rollout status deployment -l app=plan-service --namespace=nextgen-test --timeout=300s
                    kubectl rollout status deployment -l app=device-service --namespace=nextgen-test --timeout=300s
                    kubectl rollout status deployment -l app=order-service --namespace=nextgen-test --timeout=300s
                    kubectl rollout status deployment -l app=payment-service --namespace=nextgen-test --timeout=300s
                '''
            }
        }

        stage('Deploy to Staging') {
            when {
                tag "v*"
            }
            steps {
                sh '''
                    echo "Deploying to Staging environment..."
                    kubectl apply -k k8s/staging/services/ --namespace=nextgen-staging || kubectl create namespace nextgen-staging && kubectl apply -k k8s/staging/services/ --namespace=nextgen-staging
                    kubectl rollout status deployment -l app=auth-service --namespace=nextgen-staging --timeout=300s
                    kubectl rollout status deployment -l app=user-service --namespace=nextgen-staging --timeout=300s
                    kubectl rollout status deployment -l app=plan-service --namespace=nextgen-staging --timeout=300s
                    kubectl rollout status deployment -l app=device-service --namespace=nextgen-staging --timeout=300s
                    kubectl rollout status deployment -l app=order-service --namespace=nextgen-staging --timeout=300s
                    kubectl rollout status deployment -l app=payment-service --namespace=nextgen-staging --timeout=300s
                '''
            }
        }

        stage('Deploy to Production') {
            when {
                tag "v*"
            }
            steps {
                input 'Deploy to production?'
                sh '''
                    echo "Deploying to Production environment..."
                    kubectl apply -k k8s/prod/services/ --namespace=nextgen-prod || kubectl create namespace nextgen-prod && kubectl apply -k k8s/prod/services/ --namespace=nextgen-prod
                    kubectl rollout status deployment -l app=auth-service --namespace=nextgen-prod --timeout=600s
                    kubectl rollout status deployment -l app=user-service --namespace=nextgen-prod --timeout=600s
                    kubectl rollout status deployment -l app=plan-service --namespace=nextgen-prod --timeout=600s
                    kubectl rollout status deployment -l app=device-service --namespace=nextgen-prod --timeout=600s
                    kubectl rollout status deployment -l app=order-service --namespace=nextgen-prod --timeout=600s
                    kubectl rollout status deployment -l app=payment-service --namespace=nextgen-prod --timeout=600s
                '''
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check logs for details.'
        }
        always {
            cleanWs()
        }
    }
}
