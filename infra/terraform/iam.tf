resource "aws_iam_group" "xreach_admins" {
  name = "x-reach-admins"
}

data "aws_iam_policy" "xreach_secrets" {
  name = "x-reach-secrets-policy"
}
data "aws_iam_policy" "xreach_remediation" {
  name = "x-reach-remediation-policy"
}
data "aws_iam_policy" "xreach_build" {
  name = "x-reach-build-policy"
}
data "aws_iam_policy" "xreach_monitoring" {
  name = "x-reach-monitoring-policy"
}
data "aws_iam_policy" "xreach_audit" {
  name = "x-reach-audit-policy"
}

resource "aws_iam_group_policy_attachment" "policy_attach" {
  for_each = {
    secrets     = data.aws_iam_policy.xreach_secrets.arn
    remediation = data.aws_iam_policy.xreach_remediation.arn
    build       = data.aws_iam_policy.xreach_build.arn
    monitoring  = data.aws_iam_policy.xreach_monitoring.arn
    audit       = data.aws_iam_policy.xreach_audit.arn
  }
  group      = aws_iam_group.xreach_admins.name
  policy_arn = each.value
}
