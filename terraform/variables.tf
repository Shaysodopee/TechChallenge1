variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-2"
}

variable "project_name" {
  description = "Project prefix"
  type        = string
  default     = "devops-challenge"
}

variable "frontend_image" {
  description = "Frontend Docker image URI in ECR"
  type        = string
}

variable "backend_image" {
  description = "Backend Docker image URI in ECR"
  type        = string
}

variable "vpc_cidr" {
  type    = string
  default = "10.0.0.0/16"
}
