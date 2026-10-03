variable "environment" {
  description = "Deployment environment (staging or production)"
  type        = string
  default     = "staging"
}

variable "aws_region" {
  description = "AWS region for financial workloads"
  type        = string
  default     = "eu-west-1"
}

variable "vpc_cidr" {
  description = "VPC CIDR block"
  type        = string
  default     = "10.0.0.0/16"
}

variable "db_instance_class" {
  description = "RDS PostgreSQL Instance Class"
  type        = string
  default     = "db.t4g.medium"
}
