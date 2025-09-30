# AIOps Platform – DevOps Intelligence as a Service

## 🚀 Overview
This project blends **DevOps + AI (AIOps)** to showcase:
- CI/CD pipelines with GitHub Actions & Trivy
- AWS-native infra with Terraform (EKS, ECR, RDS, S3)
- AI-assisted pipeline anomaly detection & log triage
- Monitoring with Prometheus & Grafana

## 📂 Architecture
```
Dev -> GitHub -> GitHub Actions -> AWS ECR -> EKS -> FastAPI/React
                                 |-> Trivy
                                 |-> Terraform -> AWS infra
                                 |-> Secrets Manager -> RDS
                                 |-> AI modules (predict/summarize)
```

## ⚡ Features
- ✅ Enterprise-grade CI/CD
- ✅ AWS-native infrastructure
- ✅ Security-first (OIDC, Secrets Manager, Trivy)
- ✅ Observability stack
- ✅ AI-powered insights

## ▶️ Quick Start
```bash
docker-compose up --build
```
- Backend → http://localhost:8000/health
- Frontend → http://localhost:3000

## 🚀 Deployment to AWS
1. Copy `terraform.tfvars.example` → `terraform.tfvars` and set values.
2. Run `terraform init && terraform apply` in `infra/terraform`.
3. Update kubeconfig with `aws eks update-kubeconfig`.
4. Deploy manifests in `infra/k8s/`.

## 🎤 Demo Script
- Show pipelines auto-build in GitHub Actions.
- Highlight Trivy security scans.
- Open dashboard and show AI placeholder outputs.
- Talk about AWS-native design (EKS, ECR, Secrets Manager).
