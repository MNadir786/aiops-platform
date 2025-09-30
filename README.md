🌐 AIOps Platform – DevOps Intelligence as a Service
🚀 Overview

The AIOps Platform blends DevOps practices with AI (AIOps) to demonstrate how modern engineering teams can:

⚙️ Automate builds, tests, and deployments with GitHub Actions.

🔒 Embed security at every stage with Trivy image scanning, OIDC authentication, and AWS Secrets Manager.

☁️ Provision AWS-native infrastructure (EKS, ECR, RDS, S3) using Terraform.

🤖 Use AI modules to predict pipeline failures and summarize incident logs.

📊 Gain full visibility with Prometheus + Grafana dashboards.

This project is designed as a portfolio showcase and a blueprint for real-world AIOps adoption.

🏗️ Architecture
Developer → GitHub → GitHub Actions → AWS ECR → AWS EKS (FastAPI / React)
                                ↘ Trivy (Security Scans)
                                ↘ Terraform (IaC Provisioning)
                                ↘ AWS Secrets Manager (Secrets & Credentials)
                                ↘ AI Modules (Anomaly Detection / Log Triage)

⚡ Features

✅ Enterprise-grade CI/CD – Build, test, scan, deploy pipelines.

✅ Cloud-native AWS infra – EKS, ECR, RDS, S3 provisioned via Terraform.

✅ Security-first design – GitHub OIDC (no static keys), Trivy scans, Secrets Manager.

✅ Observability stack – Prometheus metrics & Grafana dashboards.

✅ AI-powered insights – Predictive pipeline analysis & log triage modules.

▶️ Quick Start (Local Demo)

Spin everything up locally with Docker Compose:

docker-compose up --build


🌐 Backend → http://localhost:8000/health

💻 Frontend → http://localhost:3000

🚀 Deployment to AWS

Copy example variables:

cp infra/terraform/terraform.tfvars.example infra/terraform/terraform.tfvars


Set your values for:

aws_region

aws_account_id

project_name

Provision infrastructure with Terraform:

cd infra/terraform
terraform init
terraform apply -var-file=terraform.tfvars


Update kubeconfig to connect with your cluster:

aws eks update-kubeconfig --region <region> --name aiops-platform-eks


Deploy workloads:

kubectl apply -f infra/k8s/

📊 Roadmap

🔜 Replace AI placeholders with HuggingFace/OpenAI integrations.

🔜 Expand Grafana dashboards with predictive analytics.

🔜 Add automated cost-optimization recommender for AWS workloads.

🔜 Extend AI modules for intelligent incident triage and remediation.