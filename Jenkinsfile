pipeline {
    agent any

    stages{
        stage("build"){
            steps{
                sh 'npm install'
            }
        }
        stage("test"){
            steps{
               echo "test"
            }
        }
        stage("deploy"){
            steps{
                sh 'npm run start'
            }
        }
    }
}