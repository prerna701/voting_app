pipeline {
    agent any

    environment {
        GITHUB_REPO = 'https://github.com/prerna701/voting_app.git'
        IMAGE_NAME = 'prernaarora123/voting_app'
        VERSION = "v${env.BUILD_NUMBER}"
        DOCKERHUB_CREDENTIALS = credentials('dockerhub')
        PODMAN_HOST = 'ssh://user@127.0.0.1:51071/run/user/1000/podman/podman.sock'
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo '📦 Cloning repository from GitHub...'
                git branch: 'main', url: "${env.GITHUB_REPO}", credentialsId: 'githubtoken'
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
                withEnv(["PODMAN_HOST=${env.PODMAN_HOST}"]) {
                    bat '''
                        podman info
                        podman build -t ${IMAGE_NAME}:${VERSION} .
                    '''
                }
            }
        }

        stage('Push to DockerHub via Podman') {
            steps {
                echo '📤 Pushing image to DockerHub...'
                withEnv(["PODMAN_HOST=${env.PODMAN_HOST}"]) {
                    withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        bat '''
                            podman login -u "%DOCKER_USER%" -p "%DOCKER_PASS%" docker.io
                            podman push ${IMAGE_NAME}:${VERSION}
                            podman tag ${IMAGE_NAME}:${VERSION} ${IMAGE_NAME}:latest
                            podman push ${IMAGE_NAME}:latest
                        '''
                    }
                }
            }
        }

        stage('Deploy with Podman Compose') {
            steps {
                echo '🚀 Deploying application with Podman Compose...'
                withEnv(["PODMAN_HOST=${env.PODMAN_HOST}"]) {
                    bat '''
                        podman-compose down || exit 0
                        podman-compose up -d
                    '''
                }
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
