pipeline {
    agent any


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
