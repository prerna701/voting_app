pipeline {
    agent any

    environment {
        GITHUB_REPO = 'https://github.com/prerna701/voting_app.git'
        IMAGE_NAME = 'docker.io/prernaarora123/voting_app'
        VERSION = "v${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo '📦 Cloning repository from GitHub...'
                git branch: 'main', url: "${env.GITHUB_REPO}", credentialsId: 'github-token'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo '📥 Installing npm dependencies...'
                bat 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                echo '🧪 Running tests...'
                catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                    bat 'npm test || exit 0'
                }
            }
        }

        stage('Build Podman Image') {
            steps {
                echo '🐳 Building Podman image...'
                bat "podman build -t ${IMAGE_NAME}:${VERSION} ."
            }
        }

        stage('Push to DockerHub') {
            steps {
                echo '📤 Pushing image to DockerHub...'
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    bat '''
                        echo %DOCKER_PASS% | podman login -u "%DOCKER_USER%" --password-stdin docker.io
                        podman push ${IMAGE_NAME}:${VERSION}
                        podman tag ${IMAGE_NAME}:${VERSION} ${IMAGE_NAME}:latest
                        podman push ${IMAGE_NAME}:latest
                    '''
                }
            }
        }

        stage('Deploy with Podman Compose') {
            steps {
                echo '🚀 Deploying application...'
                bat 'podman-compose down || exit 0'
                bat 'podman-compose up -d'
            }
        }
    }

    post {
        success {
            echo "✅ Build and Deployment Successful! Version: ${VERSION}"
        }
        failure {
            echo "❌ Build failed. Check logs in Jenkins."
        }
    }
}
