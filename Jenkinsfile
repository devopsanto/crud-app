pipeline {
    agent any

    environment {
        // Ensure 'sonar-scanner' matches the name in Manage Jenkins -> Global Tool Configuration
        SCANNER_HOME = tool 'sonar-scanner'
        SONAR_TOKEN = credentials('SONAR_TOKEN')
    }

    stages {
        stage('SonarQube Analysis') {
            steps {
                script {
                    // This "SonarCloud" name MUST match exactly what you named the server 
                    // in Manage Jenkins -> System -> SonarQube servers
                    withSonarQubeEnv('SonarCloud') { 
                        sh """
                            ${SCANNER_HOME}/bin/sonar-scanner \
                            -Dsonar.organization=santo \
                            -Dsonar.projectKey=santo_santo \
                            -Dsonar.sources=. \
                            -Dsonar.host.url=https://sonarcloud.io """
                    }
                }
            }
        }

        stage('Docker Build And Push') {
            steps {
                script {
                    // Use 'docker-cred' for DockerHub authentication
                    docker.withRegistry('', 'docker-cred') {
                        def image = docker.build("pekker123/crud-123:latest")
                        image.push()
                    }
                }
            }
        }

        stage('Deploy To EC2') {
            steps {
                script {
                    // Clean up old containers and run the new one
                    sh 'docker rm -f $(docker ps -aq) || true'
                    sh 'docker run -d -p 3000:3000 pekker123/crud-123:latest'
                }
            }
        }
    }
}
