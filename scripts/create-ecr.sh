#!/usr/bin/env bash
set -euo pipefail
AWS_REGION=${AWS_REGION:-us-east-2}
aws ecr describe-repositories --repository-names devops-challenge-frontend --region "$AWS_REGION" || aws ecr create-repository --repository-name devops-challenge-frontend --region "$AWS_REGION"
aws ecr describe-repositories --repository-names devops-challenge-backend --region "$AWS_REGION" || aws ecr create-repository --repository-name devops-challenge-backend --region "$AWS_REGION"
