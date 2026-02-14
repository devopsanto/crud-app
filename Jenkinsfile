pipeline {
    agent any

    environment {
        // Ensure 'sonar-scanner' is configured in Global Tool Configuration
        SCANNER_HOME = tool 'sonar-scanner'
        // Ensure 'SONAR_TOKEN' is a 'Secret Text' credential ID
        SONAR_TOKEN = credentials('SONAR_TOKEN')
        SONAR_ORGANIZATION = 'santo'
        SONAR_PROJECT_KEY = 'santo_santo'
    }

    stages {
        stage('Code-Analysis') {
            steps {
                // 'sonarcloud' must match the name in Manage Jenkins > System
                withSonarQubeEnv('sonarcloud') {
                    sh """${SCANNER_HOME}/bin/sonar-scanner \
                        -Dsonar.organization=${SONAR_ORGANIZATION} \
                        -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                        -Dsonar.sources=. \
                        -Dsonar.host.url=https://sonarcloud.io \
                        -Dsonar.login=${SONAR_TOKEN}"""
                }
            }
        }

        stage('Docker Build And Push') {
            steps {
                script {
                    // 'docker-cred' must be Username/Password credentials
                    docker.withRegistry('', 'docker-cred') {
                        def image = docker.build("pekker123/crud-123:latest")
                        image.push()
                        // Optional: push with build number
                        image.push("${env.BUILD_NUMBER}")
                    }
                }
            }
        }

        stage('Deploy To EC2') {
            steps {
                script {
                    // Cleanup existing containers and run new one
                    // Note: This works if Jenkins is running on the target EC2
                    sh 'docker rm -f crud-app-container || true'
                    sh 'docker run -d --name crud-app-container -p 3000:3000 pekker123/crud-123:latest'
                }
            }
        }
    }
}
