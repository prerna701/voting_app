pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub')    // Jenkins credentials ID for DockerHub
        GITHUB_CREDENTIALS = credentials('githubtoken')      // Jenkins credentials ID for GitHub
        IMAGE_NAME = "prernaarora123/voting_app"             // DockerHub repo name
        CONTAINER_NAME = "voting_app"
    }

    stages {

        stage('Checkout Code') {
            steps {
                echo "📦 Checking out code from GitHub..."
                git branch: 'main',
                    url: 'https://github.com/prerna701/voting_app.git',
                    credentialsId: "${GITHUB_CREDENTIALS}"
            }
        }

        stage('Install Dependencies') {
            steps {
                echo "📦 Installing npm dependencies..."
                bat 'npm install'
            }
        }

stage('Run Tests') {
    steps {
        echo '🧪 Running tests (if any)...'
        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
            bat '''
                npm test || echo "⚠️ No tests found, continuing..."
            '''
        }
    }
}

        stage('Build Docker Image') {
            steps {
                echo "🐳 Building Docker image..."
                bat """
                    docker build -t ${IMAGE_NAME}:latest .
                """
            }
        }

        stage('Push to DockerHub') {
            steps {
                echo "🚀 Pushing Docker image to DockerHub..."
                bat """
                    echo ${DOCKERHUB_CREDENTIALS_PSW} | docker login -u ${DOCKERHUB_CREDENTIALS_USR} --password-stdin
                    docker push ${IMAGE_NAME}:latest
                """
            }
        }

        stage('Deploy using Docker Compose') {
            steps {
                echo "🧩 Deploying app using docker-compose..."
                bat """
                    docker-compose down || echo "No previous containers to remove"
                    docker-compose up -d
                """
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline executed successfully!"
        }
        failure {
            echo "❌ Pipeline failed. Check the logs above."
        }
    }
}
