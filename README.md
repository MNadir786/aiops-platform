# 🌐 AIOps Platform – DevOps Intelligence as a Service  

## 🚀 Overview  
The **AIOps Platform** blends **DevOps practices with AI (AIOps)** to showcase how modern engineering teams can:  

- ⚙️ **Automate** builds, tests, and deployments with GitHub Actions.  
- 🔒 **Embed security** at every stage with Trivy image scanning, OIDC authentication, and AWS Secrets Manager.  
- ☁️ **Provision AWS-native infrastructure** (EKS, ECR, RDS, S3) using Terraform.  
- 🤖 **Leverage AI modules** to predict pipeline failures and summarize incident logs.  
- 📊 **Gain observability** with Prometheus + Grafana dashboards.  

This project is designed as both a **portfolio showcase** and a **blueprint for real-world AIOps adoption**.  

---

## 🏗️ Architecture  

```mermaid
flowchart TD
    Dev[👨‍💻 Developer] --> GH[📂 GitHub]
    GH --> GHA[⚙️ GitHub Actions]
    GHA --> ECR[📦 AWS ECR]
    GHA --> EKS[☸️ AWS EKS: FastAPI & React]
    GHA --> Trivy[🛡️ Trivy Security Scans]
    GHA --> TF[📜 Terraform IaC]
    TF --> AWS[(☁️ AWS Infra: EKS, RDS, S3)]
    GHA --> SM[🔑 AWS Secrets Manager]
    GHA --> AI[🤖 AI Modules: Anomaly Detection & Log Triage]
<!-- ASCII fallback (uncomment if Mermaid fails on GitHub) --> <!-- Developer ─▶ GitHub ─▶ GitHub Actions ─▶ AWS ECR ─▶ AWS EKS (FastAPI / React) ├─▶ Trivy (Security Scans) ├─▶ Terraform (IaC) ─▶ AWS (EKS, RDS, S3) ├─▶ AWS Secrets Manager └─▶ AI Modules (Anomaly Detection / Log Triage) -->
⚡ Features
✅ Enterprise-grade CI/CD – build, test, scan, and deploy pipelines.

✅ AWS-native infrastructure – provisioned with Terraform (EKS, RDS, S3, ECR).

✅ Security-first design – GitHub OIDC, Trivy scans, and Secrets Manager.

✅ Observability stack – Prometheus + Grafana dashboards.

✅ AI-powered insights – predictive analysis & log triage modules.

▶️ Quick Start (Local Demo)
Run everything locally with Docker Compose:

bash
Copy code
docker-compose up --build
🌐 Backend → http://localhost:8000/health

💻 Frontend → http://localhost:3000

🚀 Deployment to AWS
Copy variables:

bash
Copy code
cp infra/terraform/terraform.tfvars.example infra/terraform/terraform.tfvars
Update values for:

aws_region

aws_account_id

project_name

Provision infrastructure:

bash
Copy code
cd infra/terraform
terraform init
terraform apply -var-file=terraform.tfvars
Update kubeconfig:

bash
Copy code
aws eks update-kubeconfig --region <region> --name aiops-platform-eks
Deploy workloads:

bash
Copy code
kubectl apply -f infra/k8s/
📊 Roadmap
🔜 Replace AI placeholders with HuggingFace/OpenAI integrations.

🔜 Expand Grafana dashboards with predictive analytics.

🔜 Add cost-optimization recommender for AWS workloads.

🔜 Extend AI modules for automated incident remediation.

📜 License
This project is open-source and available under the MIT License.