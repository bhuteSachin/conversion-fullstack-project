pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '20'))
    }

    parameters {
        booleanParam(name: 'DEPLOY_TO_EKS', defaultValue: false, description: 'Deploy this verified build to the configured EKS cluster')
    }

    environment {
        AWS_REGION = 'us-east-1'
        EKS_CLUSTER = 'bhasha-cluster-dev'
        ECR_REPOSITORY_FRONTEND = 'bhasha-frontend-dev'
        ECR_REPOSITORY_BACKEND = 'bhasha-backend-dev'
        HELM_RELEASE = 'bhasha'
        K8S_NAMESPACE = 'bhasha'
        IMAGE_TAG = "sha-${env.GIT_COMMIT}"
    }

    stages {
        stage('Frontend lint and build') {
            steps {
                dir('client') {
                    sh 'npm ci --legacy-peer-deps'
                    sh 'npm run lint'
                    sh 'npm run build'
                }
            }
        }

        stage('Backend build') {
            steps {
                dir('server-java') {
                    sh 'chmod +x mvnw'
                    sh './mvnw -B -DskipTests clean package'
                }
            }
        }

        stage('SonarQube analysis') {
            steps {
                script {
                    def scannerHome = tool 'SonarScanner'
                    withSonarQubeEnv('SonarQube') {
                        sh "${scannerHome}/bin/sonar-scanner"
                    }
                }
            }
        }

        stage('SonarQube quality gate') {
            steps {
                timeout(time: 10, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Build and scan images') {
            steps {
                script {
                    env.ECR_REGISTRY = sh(script: 'aws sts get-caller-identity --query Account --output text', returnStdout: true).trim() + ".dkr.ecr.${env.AWS_REGION}.amazonaws.com"
                    env.FRONTEND_IMAGE = "${env.ECR_REGISTRY}/${env.ECR_REPOSITORY_FRONTEND}:${env.IMAGE_TAG}"
                    env.BACKEND_IMAGE = "${env.ECR_REGISTRY}/${env.ECR_REPOSITORY_BACKEND}:${env.IMAGE_TAG}"
                }
                sh 'docker build -t "$FRONTEND_IMAGE" ./client'
                sh 'docker build -t "$BACKEND_IMAGE" ./server-java'
                sh 'trivy image --exit-code 1 --severity HIGH,CRITICAL --ignore-unfixed "$FRONTEND_IMAGE"'
                sh 'trivy image --exit-code 1 --severity HIGH,CRITICAL --ignore-unfixed "$BACKEND_IMAGE"'
            }
        }

        stage('Publish images') {
            when {
                branch 'main'
            }
            steps {
                sh 'aws ecr get-login-password --region "$AWS_REGION" | docker login --username AWS --password-stdin "$ECR_REGISTRY"'
                sh 'docker push "$FRONTEND_IMAGE"'
                sh 'docker push "$BACKEND_IMAGE"'
            }
        }

        stage('Deploy to EKS') {
            when {
                allOf {
                    branch 'main'
                    expression { params.DEPLOY_TO_EKS }
                }
            }
            steps {
                sh 'aws eks update-kubeconfig --region "$AWS_REGION" --name "$EKS_CLUSTER"'
                sh 'helm upgrade --install "$HELM_RELEASE" ./helm/bhasha --namespace "$K8S_NAMESPACE" --create-namespace --values ./helm/bhasha/values-dev.yaml --set frontend.image.repository="$ECR_REGISTRY/$ECR_REPOSITORY_FRONTEND" --set frontend.image.tag="$IMAGE_TAG" --set backend.image.repository="$ECR_REGISTRY/$ECR_REPOSITORY_BACKEND" --set backend.image.tag="$IMAGE_TAG" --wait --timeout 10m'
            }
        }
    }

    post {
        always {
            sh 'docker image prune -f || true'
        }
    }
}
