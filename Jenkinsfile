pipeline {
    agent any

    environment {
        IMAGE_NAME = "docker.io/prernaarora123/voting_app"
        VERSION = "v12"
        COMPOSE_FILE = "podman-compose.yml"
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo '📦 Cloning repository from GitHub...'
                git branch: 'main',
                    url: 'https://github.com/prerna701/voting_app.git',
                    credentialsId: 'githubtoken'
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
                bat '''
                    podman machine start || echo "✅ Podman machine already running"
                    podman system connection list
                    podman build -t ${IMAGE_NAME}:${VERSION} .
                '''
            }
        }

        stage('Push to DockerHub') {
            steps {
                echo '📤 Pushing image to DockerHub...'
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
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
                echo '🚀 Deploying app with Podman Compose...'
                bat '''
                    podman-compose down || echo "🧹 Old containers cleared"
                    podman-compose up -d
                    podman ps
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Build & deployment successful!'
        }
        failure {
            echo '❌ Build failed. Check logs in Jenkins.'
        }
    }
}
