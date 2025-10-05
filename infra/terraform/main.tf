terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "x-reach-terraform-state"
    key            = "aiops/global.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "x-reach-terraform-locks"
  }
}

provider "aws" {
  region  = var.aws_region
  profile = var.aws_profile
}

module "iam" {
  source = "./iam.tf"
}

module "s3" {
  source = "./s3.tf"
}

module "oidc" {
  source = "./oidc.tf"
}

module "secrets" {
  source = "./secrets.tf"
}
