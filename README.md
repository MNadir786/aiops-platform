# 🌐 AIOps Platform – DevOps Intelligence as a Service  

---  

## 🚀 Overview  

The **AIOps Platform** demonstrates how modern engineering teams can blend **DevOps** and **AI (AIOps)** to create secure, intelligent, and self-optimizing systems.  

It showcases:  
- ⚙️ CI/CD pipelines with GitHub Actions and integrated security scanning.  
- ☁️ AWS-native infrastructure provisioned via Terraform (EKS, ECR, RDS, S3).  
- 🔒 Security-first practices with OIDC authentication and AWS Secrets Manager.  
- 🤖 AI-assisted anomaly detection and log summarization.  
- 📊 Full observability using Prometheus and Grafana.  

---

## 📊 Key Deliverables  

| Area | Deliverable | Outcome |
|------|-------------|---------|
| 🚀 **Automation** | CI/CD pipelines with GitHub Actions | Streamlined, repeatable, and fully automated deployments. |
| 🛡️ **Security** | Trivy-integrated image scanning | Security embedded directly into the development lifecycle (shift-left). |
| ☁️ **Infrastructure** | AWS EKS, ECR, RDS, S3 via Terraform | Cloud-native, scalable, and reproducible infrastructure as code. |
| ⚡ **Application** | FastAPI backend + React frontend | Modular, containerized, and cloud-ready application stack. |
| 🤖 **AIOps** | AI-assisted anomaly detection & log summarization | Reduced MTTR and predictive insights into pipeline reliability. |
| 📊 **Observability** | Prometheus + Grafana dashboards | Real-time visibility into infrastructure and application health. |

---

## 🏗️ Architecture (Conceptual Flow)  

| Step | Description |
|------|-------------|
| 👨‍💻 **Developer** | Pushes code to GitHub. |
| ⚙️ **GitHub Actions** | Executes CI/CD workflows: build, test, scan, deploy. |
| ☁️ **Terraform (IaC)** | Provisions AWS resources: EKS, ECR, RDS, S3. |
| 🔑 **AWS Secrets Manager** | Manages credentials and sensitive configs. |
| 🤖 **AI Modules** | Analyze pipeline results & summarize logs. |
| 📊 **Monitoring Stack** | Prometheus & Grafana dashboards for observability. |

---

## ▶️ Quick Start (Local Demo)  

| Command | Purpose |
|---------|---------|
| `docker-compose up --build` | Start backend + frontend locally. |
| 🌐 **Backend** → [http://localhost:8000/health](http://localhost:8000/health) | API health check. |
| 💻 **Frontend** → [http://localhost:3000](http://localhost:3000) | Web dashboard. |

---

## 🚀 Deployment to AWS  

| Step | Command | Purpose |
|------|---------|---------|
| **1. Copy Variables** | `cp infra/terraform/terraform.tfvars.example infra/terraform/terraform.tfvars` | Set project variables (`aws_region`, `aws_account_id`, `project_name`). |
| **2. Provision Infrastructure** | `cd infra/terraform && terraform init && terraform apply -var-file=terraform.tfvars` | Deploy AWS infra (EKS, ECR, RDS, S3). |
| **3. Update Kubeconfig** | `aws eks update-kubeconfig --region <region> --name aiops-platform-eks` | Connect local kubectl to the EKS cluster. |
| **4. Deploy Workloads** | `kubectl apply -f infra/k8s/` | Deploy backend + frontend workloads. |

---

## 📜 License  

This project is licensed under the **MIT License**. 