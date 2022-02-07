pipeline {
    agent any

    stages{
        stage("build"){
            steps{
                npm build
            }
        }
        stage("test"){
            steps{
               echo "test"
            }
        }
        stage("deploy"){
            steps{
                npm run start
            }
        }
    }
}