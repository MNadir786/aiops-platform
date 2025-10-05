# -----------------------------------------
# X-Reach Secure Secret Placeholders
# -----------------------------------------
# Terraform only creates the secret container; actual value comes later
# via AWS CLI or app bootstrap.

resource "aws_secretsmanager_secret" "prometheus_admin" {
  name        = "xreach/prometheus/admin_password"
  description = "Grafana/Prometheus admin password (value stored via runtime)"
  recovery_window_in_days = 0

  tags = {
    Project     = "X-Reach-AIOps"
    Environment = "production"
    ManagedBy   = "Terraform"
  }
}

resource "aws_secretsmanager_secret" "grafana_admin" {
  name        = "xreach/grafana/admin_password"
  description = "Grafana admin password (rotated externally)"
  recovery_window_in_days = 0
}

# Example secret reference used by your backend secret_service.py
resource "aws_ssm_parameter" "backend_mode" {
  name        = "/xreach/backend/metrics_mode"
  type        = "String"
  value       = "prometheus"
}

# Export ARNs for FastAPI use (secure runtime fetch)
output "prometheus_secret_arn" {
  description = "ARN for the Prometheus admin secret"
  value       = aws_secretsmanager_secret.prometheus_admin.arn
}

output "grafana_secret_arn" {
  description = "ARN for the Grafana admin secret"
  value       = aws_secretsmanager_secret.grafana_admin.arn
}
