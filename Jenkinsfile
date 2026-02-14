


pipeline {
    agent any
    

    environment {
        SCANNER_HOME = tool 'sonar-scanner'
        SONAR_TOKEN = credentials('SONAR_TOKEN')
        SONAR_ORGANIZATION = 'santo '
        SONAR_PROJECT_KEY = 'santo_santo'
    }

    stages {
        
        stage('Code-Analysis') {
            steps {
                withSonarQubeEnv('sonarcloud') {
                    sh '''$SCANNER_HOME/bin/sonar-scanner \
 -Dsonar.organization=santo \
  -Dsonar.projectKey=santo_santo
  -Dsonar.sources=. \
  -Dsonar.host.url=https://sonarcloud.io '''
                }
            }
        }
       
        
      
       stage('Docker Build And Push') {
            steps {
                script {
                    docker.withRegistry('', 'docker-cred') {
                        def buildNumber = env.BUILD_NUMBER ?: '1'
                        def image = docker.build("pekker123/crud-123:latest")
                        image.push()
                    }
                }
            }
        }
    
       
        stage('Deploy To EC2') {
            steps {
                script {
                        sh 'docker rm -f $(docker ps -q) || true'
                        sh 'docker run -d -p 3000:3000 pekker123/crud-123:latest'
                        
                    
                }
            }
        }
        
}
}
