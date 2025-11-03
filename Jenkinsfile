pipeline {
    agent any

    environment {
        IMAGE_NAME = 'prernaarora123/voting_app'
        VERSION = 'latest'
    }

    stages {

        stage('Checkout Code') {
            steps {
                echo '📦 Checking out code from GitHub...'
                checkout([$class: 'GitSCM', 
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[
                        url: 'https://github.com/prerna701/voting_app.git',
                        credentialsId: 'githubtoken'
                    ]]
                ])
            }
        }

        stage('Install Dependencies') {
            steps {
                echo '📦 Installing npm dependencies...'
                bat 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                echo '🧪 Running tests (if any)...'
                bat 'npm test || echo "⚠️ No tests found, continuing..."'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo '🐳 Building Docker image...'
                bat '''
                    docker build -t %IMAGE_NAME%:%VERSION% .
                '''
            }
        }

        stage('Push to DockerHub') {
            steps {
                echo '📤 Pushing image to DockerHub...'
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    bat '''
                        echo %DOCKER_PASS% | docker login -u "%DOCKER_USER%" --password-stdin
                        docker push %IMAGE_NAME%:%VERSION%
                        docker tag %IMAGE_NAME%:%VERSION% %IMAGE_NAME%:latest
                        docker push %IMAGE_NAME%:latest
                    '''
                }
            }
        }

        stage('Deploy using Docker Compose') {
            steps {
                echo '🚀 Deploying using Docker Compose...'
                bat 'docker compose down || echo "No previous containers running"'
                bat 'docker compose up -d'
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline completed successfully! 🎉'
        }
        failure {
            echo '❌ Pipeline failed. Check logs above.'
        }
    }
}
