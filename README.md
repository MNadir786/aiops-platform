# 🌐 AIOps Platform – DevOps Intelligence as a Service  

---

## 🚀 Overview  

The **AIOps Platform** blends **DevOps** and **AI (AIOps)** to create a secure, intelligent, and self-optimizing cloud system.  

| Capability | Description |
|------------|-------------|
| ⚙️ **CI/CD Automation** | GitHub Actions pipeline with Trivy scans at every stage. |
| ☁️ **AWS Infrastructure** | Provisioned via Terraform: EKS, ECR, RDS, S3. |
| 🔒 **Security-First Design** | OIDC authentication, Trivy image scanning, and AWS Secrets Manager. |
| 🤖 **AI Modules** | Predictive pipeline analysis and log summarization. |
| 📊 **Observability** | Monitoring with Prometheus + Grafana dashboards. |

---

## 📊 Key Deliverables  

| Deliverable | Status |
|-------------|--------|
| Automated CI/CD pipelines with GitHub Actions | ✅ Complete |
| Security scanning with Trivy | ✅ Complete |
| AWS infra via Terraform (EKS, ECR, RDS, S3) | ✅ Complete |
| FastAPI backend + React frontend | ✅ Complete |
| AI-assisted log summarization & anomaly detection | ✅ Complete |
| Monitoring & observability (Prometheus + Grafana) | ✅ Complete |

---

## 🏗️ Architecture (Conceptual Flow)  

| Step | Description |
|------|-------------|
| 👨‍💻 **Developer** | Pushes code to GitHub. |
| ⚙️ **GitHub Actions** | Executes CI/CD workflows: build, test, scan, deploy. |
| ☁️ **Terraform (IaC)** | Provisions AWS: EKS, ECR, RDS, S3. |
| 🔑 **AWS Secrets Manager** | Manages credentials and sensitive configs. |
| 🤖 **AI Modules** | Analyze pipeline results & summarize logs. |
| 📊 **Monitoring Stack** | Prometheus & Grafana dashboards for visibility. |

---

## ▶️ Quick Start (Local Demo)  

| Command | Description |
|---------|-------------|
| `docker-compose up --build` | Start backend + frontend locally. |
| 🌐 **Backend** | [http://localhost:8000/health](http://localhost:8000/health) |
| 💻 **Frontend** | [http://localhost:3000](http://localhost:3000) |

---

## 🚀 Deployment to AWS  

| Step | Command | Notes |
|------|---------|-------|
| **1. Copy Variables** | `cp infra/terraform/terraform.tfvars.example infra/terraform/terraform.tfvars` | Update `aws_region`, `aws_account_id`, `project_name`. |
| **2. Provision Infra** | `cd infra/terraform && terraform init && terraform apply -var-file=terraform.tfvars` | Deploys EKS, ECR, RDS, S3. |
| **3. Update kubeconfig** | `aws eks update-kubeconfig --region <region> --name aiops-platform-eks` | Connect kubectl to EKS cluster. |
| **4. Deploy Workloads** | `kubectl apply -f infra/k8s/` | Deploy backend & frontend apps. |

---

## 📜 License  

Licensed under the **MIT License**.