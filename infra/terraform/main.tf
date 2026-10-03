terraform {
  required_version = ">= 1.7.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.40"
    }
  }
  backend "s3" {
    bucket         = "enako-moneyflow-tfstate"
    key            = "moneyflow/terraform.tfstate"
    region         = "eu-west-1"
    encrypt        = true
    dynamodb_table = "enako-moneyflow-tflocks"
  }
}

provider "aws" {
  region = var.aws_region
  default_tags {
    tags = {
      Project     = "E-NAKO MoneyFlow"
      Environment = var.environment
      ManagedBy   = "Terraform"
      Compliance  = "PCI-DSS-CEMAC"
    }
  }
}

# ========================================================
# HIGH-AVAILABILITY MULTI-AZ VPC
# ========================================================
resource "aws_vpc" "moneyflow_vpc" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "enako-moneyflow-${var.environment}-vpc"
  }
}

# ========================================================
# PRODUCTION RDS POSTGRESQL 16 CLUSTER (Encrypted, Multi-AZ)
# ========================================================
resource "aws_db_instance" "moneyflow_postgres" {
  identifier                  = "enako-moneyflow-${var.environment}-db"
  allocated_storage           = 100
  max_allocated_storage       = 500
  engine                      = "postgres"
  engine_version              = "16.2"
  instance_class              = var.db_instance_class
  storage_type                = "gp3"
  storage_encrypted           = true
  multi_az                    = var.environment == "production" ? true : false
  auto_minor_version_upgrade  = false
  backup_retention_period     = 30
  deletion_protection         = var.environment == "production" ? true : false
  skip_final_snapshot         = var.environment == "production" ? false : true
  final_snapshot_identifier   = "enako-moneyflow-${var.environment}-final-snapshot"
  username                    = "enako_admin"
  manage_master_user_password = true

  tags = {
    Name = "enako-moneyflow-${var.environment}-db"
  }
}

# ========================================================
# ECS FARGATE WORKLOAD CLUSTER (Backend Engine)
# ========================================================
resource "aws_ecs_cluster" "moneyflow_cluster" {
  name = "enako-moneyflow-${var.environment}-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

# ========================================================
# S3 & CLOUDFRONT CDN (Static Frontends)
# ========================================================
resource "aws_s3_bucket" "frontend_bucket" {
  bucket = "enako-moneyflow-${var.environment}-web"
}

resource "aws_cloudfront_distribution" "frontend_cdn" {
  enabled             = true
  default_root_object = "index.html"

  origin {
    domain_name = aws_s3_bucket.frontend_bucket.bucket_regional_domain_name
    origin_id   = "S3-enako-moneyflow-${var.environment}"
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-enako-moneyflow-${var.environment}"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}
