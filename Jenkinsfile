pipeline {
    agent any

    environment {
        SCANNER_HOME = tool 'sonar-scanner'
        SONAR_TOKEN  = credentials('SONAR_TOKEN')
        DOCKER_IMAGE = "santodass/crud-123"
        EC2_HOST     = "43.205.91.29"
        EC2_USER     = "ubuntu"   // change to ec2-user if Amazon Linux
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('SonarCloud Analysis') {
            steps {
                script {
                    withSonarQubeEnv('SonarCloud') {
                        sh """
                        ${SCANNER_HOME}/bin/sonar-scanner \
                        -Dsonar.organization=santo \
                        -Dsonar.projectKey=santo_santo \
                        -Dsonar.sources=. \
                        -Dsonar.host.url=https://sonarcloud.io \
                        -Dsonar.login=${SONAR_TOKEN}
                        """
                    }
                }
            }
        }

        stage('Docker Build & Push') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'docker-cred') {
                        def image = docker.build("santodass/crud-123")
                        image.push("latest")
                    }
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                sshagent(['ec2-key']) {
                    sh """
                    ssh -o StrictHostKeyChecking=no ubuntu@43.205.91.29 '
                        docker pull santodass/crud-123:latest &&
                        docker rm -f crud-app || true &&
                        docker run -d --name crud-app -p 3000:3000 santodass/crud-123:latest
                    '
                    """
                }
            }
        }
    }

    post {
        success {
            echo "✅ Deployment completed successfully!"
        }
        failure {
            echo "❌ Pipeline failed. Check logs."
        }
    }
}
