pipeline {
    agent any

    environment {
        GITHUB_REPO = 'https://github.com/prerna701/voting_app.git'
        IMAGE_NAME = 'prernaarora123/voting_app'
        VERSION = "v${env.BUILD_NUMBER}"
    }

    stages {

        stage('Checkout Code') {
            steps {
                echo '📦 Cloning repository from GitHub...'
                git branch: 'main', credentialsId: 'githubtoken', url: "${env.GITHUB_REPO}"
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

        stage('Build Docker Image') {
            steps {
                echo '🐳 Building Docker image...'
                bat "docker build -t ${IMAGE_NAME}:${VERSION} ."
            }
        }

        stage('Push to DockerHub') {
            steps {
                echo '📤 Pushing Docker image to DockerHub...'
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    bat '''
                        echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin
                        docker push ${IMAGE_NAME}:${VERSION}
                        docker tag ${IMAGE_NAME}:${VERSION} ${IMAGE_NAME}:latest
                        docker push ${IMAGE_NAME}:latest
                    '''
                }
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                echo '🚀 Deploying application using Docker Compose...'
                bat 'docker-compose down || exit 0'
                bat 'docker-compose up -d'
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
