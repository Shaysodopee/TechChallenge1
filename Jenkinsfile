pipeline {
    agent any

    environment {
        AWS_REGION = "us-east-2"
        ACCOUNT_ID = "398664673556"
        BACKEND_REPO = "techchallenge1-backend"
        FRONTEND_REPO = "techchallenge1-frontend"
    }

    stages {

        stage('Clone Repo') {
            steps {
                git branch: 'main', url: 'https://github.com/Shaysodopee/TechChallenge1.git'
            }
        }

        stage('Build Docker Images') {
            steps {
                sh '''
                docker build -t backend-app ./backend
                docker build -t frontend-app ./frontend
                '''
            }
        }

        stage('Login to ECR') {
            steps {
                sh '''
                aws ecr get-login-password --region $AWS_REGION | \
                docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
                '''
            }
        }

        stage('Tag & Push Images') {
            steps {
                sh '''
                docker tag backend-app:latest $ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$BACKEND_REPO:latest
                docker push $ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$BACKEND_REPO:latest

                docker tag frontend-app:latest $ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$FRONTEND_REPO:latest
                docker push $ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$FRONTEND_REPO:latest
                '''
            }
        }

        stage('Deploy to ECS') {
            steps {
                sh '''
                aws ecs update-service \
                --cluster devops-challenge-cluster \
                --service devops-challenge-backend-service \
                --force-new-deployment \
                --region $AWS_REGION

                aws ecs update-service \
                --cluster devops-challenge-cluster \
                --service devops-challenge-frontend-service \
                --force-new-deployment \
                --region $AWS_REGION
                '''
            }
        }
    }
}