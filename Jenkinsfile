pipeline {
    agent any

    environment {
        // Environment variables
        APP_NAME = "voting_app"
        IMAGE_NAME = "voting_app"
        VERSION = "${BUILD_NUMBER}"
        SLACK_WEBHOOK_URL = credentials('slack_webhook')  // Add this credential in Jenkins
    }

    stages {
        stage('Pull Code from GitHub') {
            steps {
                echo '📥 Pulling code from GitHub...'
                git branch: 'main', url: 'https://github.com/<your-username>/<your-repo>.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo '📦 Running npm install...'
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                echo '🧪 Running tests...'
                // You can add real tests later (e.g., Jest/Mocha)
                sh 'echo "No tests yet. Skipping..."'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "🐳 Building Docker image with version ${VERSION}..."
                sh "docker build -t ${IMAGE_NAME}:${VERSION} ."
                sh "docker tag ${IMAGE_NAME}:${VERSION} ${IMAGE_NAME}:latest"
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                echo '🚀 Deploying app using Docker Compose...'
                sh 'docker-compose down || true'
                sh 'docker-compose up -d --build'
            }
        }

        stage('Slack Notification') {
            steps {
                echo '💬 Sending Slack notification...'
                script {
                    def message = "✅ *Build Successful!* \nApp: ${APP_NAME}\nVersion: ${VERSION}\nBuild URL: ${env.BUILD_URL}"
                    sh """
                    curl -X POST -H 'Content-type: application/json' \
                    --data '{"text":"${message}"}' ${SLACK_WEBHOOK_URL}
                    """
                }
            }
        }
    }

    post {
        failure {
            script {
                def message = "❌ *Build Failed!* \nApp: ${APP_NAME}\nBuild URL: ${env.BUILD_URL}"
                sh """
                curl -X POST -H 'Content-type: application/json' \
                --data '{"text":"${message}"}' ${SLACK_WEBHOOK_URL}
                """
            }
        }
    }
}
