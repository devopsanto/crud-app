pipeline {
    agent any

    environment {
        SCANNER_HOME = tool 'sonar-scanner'
        SONAR_TOKEN  = credentials('SONAR_TOKEN')

        DOCKER_IMAGE = "santodass/crud-123"
        EC2_HOST     = "13.200.40.76"
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

        stage('Docker Build And Push') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'docker-cred') {
                        def image = docker.build("santodass/crud-123:latest")
                        image.push("latest")
                    }
                }
            }
        }

        stage('Deploy To EC2') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'mac',
                                                   keyFileVariable: 'SSH_KEY',
                                                   usernameVariable: 'SSH_USER')]) {
                    sh """
                    chmod 600 $SSH_KEY

                    ssh -o StrictHostKeyChecking=no -i mac ubuntu@13.200.40.76 '
                        docker pull santodass/crud-123:latest &&
                        docker rm -f crud-app || true &&
                        docker run -d --name crud-app -p 3000:3000 santodass/crud-123:latest
                    '
                    """
                }
            }
        }
    }
}
