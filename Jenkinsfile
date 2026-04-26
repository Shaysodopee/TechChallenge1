pipeline {
  agent any

  environment {
    AWS_REGION = 'us-east-2'
    AWS_ACCOUNT_ID = credentials('aws-account-id')
    ECR_FRONTEND = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/devops-challenge-frontend"
    ECR_BACKEND  = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/devops-challenge-backend"
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('AWS Login') {
      steps {
        sh '''
          aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
          aws ecr describe-repositories --repository-names devops-challenge-frontend --region $AWS_REGION || aws ecr create-repository --repository-name devops-challenge-frontend --region $AWS_REGION
          aws ecr describe-repositories --repository-names devops-challenge-backend --region $AWS_REGION || aws ecr create-repository --repository-name devops-challenge-backend --region $AWS_REGION
        '''
      }
    }

    stage('Build Images') {
      steps {
        sh '''
          docker build -t $ECR_BACKEND:$BUILD_NUMBER -t $ECR_BACKEND:latest ./backend
          docker build -t $ECR_FRONTEND:$BUILD_NUMBER -t $ECR_FRONTEND:latest ./frontend
        '''
      }
    }

    stage('Push Images') {
      steps {
        sh '''
          docker push $ECR_BACKEND:$BUILD_NUMBER
          docker push $ECR_BACKEND:latest
          docker push $ECR_FRONTEND:$BUILD_NUMBER
          docker push $ECR_FRONTEND:latest
        '''
      }
    }

    stage('Terraform Apply') {
      steps {
        dir('terraform') {
          sh '''
            terraform init
            terraform apply -auto-approve \
              -var="aws_region=$AWS_REGION" \
              -var="frontend_image=$ECR_FRONTEND:latest" \
              -var="backend_image=$ECR_BACKEND:latest"
          '''
        }
      }
    }

    stage('Force ECS Redeploy') {
      steps {
        sh '''
          CLUSTER=devops-challenge-cluster
          aws ecs update-service --cluster $CLUSTER --service devops-challenge-frontend-service --force-new-deployment --region $AWS_REGION
          aws ecs update-service --cluster $CLUSTER --service devops-challenge-backend-service --force-new-deployment --region $AWS_REGION
        '''
      }
    }
  }
}
