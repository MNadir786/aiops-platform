🌐 AIOps Platform – DevOps Intelligence as a Service
🚀 Overview

The AIOps Platform demonstrates how DevOps and AI (AIOps) can converge to create secure, intelligent, and self-optimizing cloud systems.

This project showcases:

⚙️ Automated CI/CD pipelines with GitHub Actions & Trivy.

☁️ AWS-native infrastructure (EKS, ECR, RDS, S3) provisioned via Terraform.

🔒 Security-first design with OIDC authentication, Trivy scans, and AWS Secrets Manager.

🤖 AI modules for predictive pipeline analysis and log triage.

📊 Observability stack with Prometheus & Grafana dashboards.

🏗️ Architecture (Conceptual Flow)

👨‍💻 Developer pushes code to GitHub.

⚙️ GitHub Actions runs CI/CD workflows:

Build & test

Security scans (Trivy)

Terraform plan/apply

☁️ AWS Infrastructure (via Terraform):

EKS – deploys backend (FastAPI) & frontend (React).

ECR – container registry.

RDS – database.

S3 – object storage.

🔑 Secrets Manager – secure credential storage.

🤖 AI Modules – predict pipeline failures & summarize logs.

📊 Monitoring Stack – Prometheus metrics & Grafana dashboards.

⚡ Key Features

✅ Enterprise-grade CI/CD – build, scan, test, deploy.

✅ Cloud-native infrastructure – AWS EKS, RDS, ECR, S3 with Terraform.

✅ Security baked in – OIDC, Trivy, Secrets Manager.

✅ Full observability – Prometheus + Grafana integration.

✅ AI-powered insights – anomaly detection & log triage.

▶️ Quick Start (Local Demo)

Spin up locally with Docker Compose:

docker-compose up --build


🌐 Backend → http://localhost:8000/health

💻 Frontend → http://localhost:3000

🚀 Deployment to AWS

Copy example variables:

cp infra/terraform/terraform.tfvars.example infra/terraform/terraform.tfvars


Update:

aws_region

aws_account_id

project_name

Provision infrastructure:

cd infra/terraform
terraform init
terraform apply -var-file=terraform.tfvars


Update kubeconfig:

aws eks update-kubeconfig --region <region> --name aiops-platform-eks


Deploy workloads:

kubectl apply -f infra/k8s/

📊 Roadmap
✅ Phase 1 – Foundation (Delivered)

 CI/CD pipelines with GitHub Actions

 Security scanning with Trivy

 Terraform AWS infra (EKS, ECR, RDS, S3)

 Basic FastAPI backend + React frontend

🚧 Phase 2 – Intelligence (In Progress)

 AI pipeline analyzer → predict build/test failures

 AI log summarizer → accelerate incident triage

 Prometheus + Grafana monitoring stack

🔮 Phase 3 – Advanced Capabilities (Planned)

 HuggingFace/OpenAI integration for richer AI insights

 Cost-optimization recommender for AWS workloads

 Automated remediation workflows

 Expanded Grafana dashboards with predictive analytics

📜 License

This project is open-source and licensed under the MIT License