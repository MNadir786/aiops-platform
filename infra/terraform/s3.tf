# Terraform State bucket
resource "aws_s3_bucket" "terraform_state" {
  bucket = "x-reach-terraform-state"
  acl    = "private"

  versioning { enabled = true }

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "aws:kms"
      }
    }
  }

  lifecycle_rule {
    id      = "state-retention"
    enabled = true
    noncurrent_version_expiration { days = 90 }
  }

  tags = {
    Project     = "X-Reach-AIOps"
    Environment = "infra"
  }
}

# DynamoDB table for locking
resource "aws_dynamodb_table" "terraform_locks" {
  name           = "x-reach-terraform-locks"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }

  tags = {
    Project     = "X-Reach-AIOps"
    Environment = "infra"
  }
}
