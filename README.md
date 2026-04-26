# DevOps Tech Challenge 1: Node.js Frontend and Backend on ECS Fargate

This repository contains a Dockerized React frontend, Express backend, Terraform infrastructure for AWS ECS Fargate, and a Jenkins pipeline to automate deployment.

## Architecture

- Jenkins server hosted on AWS EC2 and publicly accessible for pipeline execution
- Dockerized frontend and backend applications
- Amazon ECR repositories for frontend and backend container images
- Amazon ECS cluster using Fargate launch type
- ECS frontend service and backend service
- Application Load Balancer exposing the frontend publicly
- Auto Scaling for both services from 1 to 4 tasks
- CPU target tracking at 50% utilization
- Terraform-managed VPC, subnets, security groups, ALB, ECS cluster, task definitions, services, IAM execution role, CloudWatch logs, and scaling policies

## Required AWS Components for Jenkins

The Jenkins server infrastructure can be created manually. Recommended setup:

- EC2 instance running Amazon Linux 2023 or Ubuntu
- Security group allowing inbound TCP 8080 from your IP or approved public range
- IAM role attached to the Jenkins EC2 instance with permissions for ECR, ECS, CloudWatch Logs, IAM PassRole, Elastic Load Balancing, Application Auto Scaling, and Terraform-managed AWS resources
- Docker installed on Jenkins
- Terraform installed on Jenkins
- AWS CLI installed on Jenkins
- Jenkins credentials configured for AWS account ID as `aws-account-id`

## Local Application Test

### Backend

```bash
cd backend
npm ci
npm start
```

Backend should respond on:

```text
http://localhost:8080
```

### Frontend

```bash
cd frontend
npm ci
npm start
```

Frontend should respond on:

```text
http://localhost:3000
```

## Docker Build Test

```bash
docker build -t devops-backend ./backend
docker build -t devops-frontend ./frontend
```

## Terraform Deployment

Create a `terraform.tfvars` file from the example:

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
```

Update the image values:

```hcl
frontend_image = "ACCOUNT_ID.dkr.ecr.us-east-2.amazonaws.com/devops-challenge-frontend:latest"
backend_image  = "ACCOUNT_ID.dkr.ecr.us-east-2.amazonaws.com/devops-challenge-backend:latest"
```

Run Terraform:

```bash
terraform init
terraform plan
terraform apply
```

After deployment, get the frontend URL:

```bash
terraform output frontend_url
```

## Jenkins Pipeline Deployment

The included `Jenkinsfile` performs the following steps:

1. Checks out the GitHub repository.
2. Logs into Amazon ECR.
3. Creates ECR repositories if they do not exist.
4. Builds Docker images for frontend and backend.
5. Pushes images to ECR.
6. Runs Terraform to provision/update ECS infrastructure.
7. Forces ECS services to redeploy with the latest images.

## Jenkins Credentials

Create this credential in Jenkins:

| Credential ID | Type | Purpose |
| --- | --- | --- |
| `aws-account-id` | Secret text | Stores the AWS account ID used to build ECR image URIs |

If your Jenkins EC2 instance does not use an IAM role, configure AWS credentials with the AWS Credentials plugin or environment variables.

## ECS Requirements Implemented

| Requirement | Implementation |
| --- | --- |
| ECS launch type | Fargate |
| Frontend service | `devops-challenge-frontend-service` |
| Backend service | `devops-challenge-backend-service` |
| Minimum tasks | 1 |
| Desired tasks | 1 |
| Maximum tasks | 4 |
| CPU per task | 512 CPU units / 0.5 vCPU |
| Memory per task | 1024 MB / 1 GB |
| Auto Scaling | Target tracking at 50% CPU |
| Public frontend | Application Load Balancer |
| Infrastructure as Code | Terraform |

## Submission Checklist

- Push this project to a private GitHub repository.
- Make sure the repository includes this README.
- Share the private repository with `michaeltayo96@outlook.com`.
- Submit the Jenkins URL and credentials in the submission form.
- Submit the deployed frontend URL in the submission form.
- Confirm the frontend displays a successful backend connection message.

## Notes

The source challenge repository may require small application-level configuration updates, especially in `frontend/src/config.js` and `backend/config.js`, so the frontend points to the deployed backend URL and the backend CORS settings allow the deployed frontend origin.
