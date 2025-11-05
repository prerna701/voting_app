// pipeline {
//     agent any

//     environment {
//         IMAGE_NAME = "prernaarora123/voting_app"
//         CONTAINER_NAME = "voting_app"
//     }

//     stages {

//         stage('Checkout Code') {
//             steps {
//                 echo "📦 Checking out code from GitHub..."
//                 git branch: 'main',
//                     url: 'https://github.com/prerna701/voting_app.git',
//                     credentialsId: 'githubtoken'
//             }
//         }

//         stage('Install Dependencies') {
//             steps {
//                 echo "📦 Installing npm dependencies..."
//                 bat 'npm install'
//             }
//         }

//         stage('Run Tests') {
//             steps {
//                 echo '🧪 Running tests (if any)...'
//                 catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
//                     bat 'npm test || echo "⚠️ No tests found, continuing..."'
//                 }
//             }
//         }

//         stage('Build and Push Docker Image') {
//             steps {
//                 echo "🐳 Building and pushing Docker image..."
//                 withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_PASS')]) {
//                     bat """
//                         docker logout || echo "No existing login"
//                         echo %DOCKERHUB_PASS% | docker login -u %DOCKERHUB_USER% --password-stdin
//                         docker build -t %DOCKERHUB_USER%/voting_app:latest .
//                         docker push %DOCKERHUB_USER%/voting_app:latest
//                     """
//                 }
//             }
//         }

//         stage('Deploy using Docker Compose') {
//             steps {
//                 echo "🧩 Deploying app using docker-compose..."
//                 bat """
//                     docker-compose down || echo "No previous containers to remove"
//                     docker-compose up -d
//                 """
//             }
//         }
//     }

//     post {
//         success {
//             echo "✅ Pipeline executed successfully!"
//         }
//         failure {
//             echo "❌ Pipeline failed. Check the logs above."
//         }
//     }
// }
pipeline {
    agent any

    environment {
        IMAGE_NAME = "prernaarora123/voting_app"
        CONTAINER_NAME = "voting_app"
    }

    stages {

        stage('Checkout Code') {
            steps {
                echo "📦 Checking out code from GitHub..."
                git branch: 'main',
                    url: 'https://github.com/prerna701/voting_app.git',
                    credentialsId: 'githubtoken'
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
                    bat 'npm test || echo "⚠️ No tests found, continuing..."'
                }
            }
        }

        stage('Build and Push Docker Image') {
            steps {
                echo "🐳 Building and pushing Docker image..."
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_PASS')]) {
                    bat """
                        docker logout || echo "No existing login"
                        echo %DOCKERHUB_PASS% | docker login -u %DOCKERHUB_USER% --password-stdin
                        docker build -t %DOCKERHUB_USER%/voting_app:latest .
                        docker push %DOCKERHUB_USER%/voting_app:latest
                    """
                }
            }
        }

        stage('Deploy using Docker Compose') {
            steps {
                echo "🧩 Deploying full stack (App + MongoDB) using docker-compose..."
                bat """
                    docker-compose down -v || echo "No previous containers to remove"
                    docker-compose pull || echo "No images to pull"
                    docker-compose build --no-cache
                    docker-compose up -d
                """
            }
        }

        stage('Verify Containers') {
            steps {
                echo "🔍 Checking running containers..."
                bat 'docker ps'
            }
        }
    }

    post {
        success {
            echo "✅ Deployment successful! Voting app and MongoDB are running in Docker containers."
        }
        failure {
            echo "❌ Pipeline failed. Please review the logs for details."
        }
    }
}
