# 🌐 AIOps Platform – DevOps Intelligence as a Service  

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)  
![Security Scan](https://img.shields.io/badge/security-trivy%20scan%20clean-blue)  
![License](https://img.shields.io/badge/license-MIT-lightgrey)  

---

## 🚀 Overview  
The **AIOps Platform** demonstrates how **DevOps and AI (AIOps)** converge to create **self-optimizing, secure, and intelligent systems**.  

It showcases:  
- ⚙️ **CI/CD pipelines** with GitHub Actions & Trivy.  
- ☁️ **AWS-native infrastructure** (EKS, ECR, RDS, S3) via Terraform.  
- 🔒 **Security first** with OIDC, Trivy scans, and Secrets Manager.  
- 🤖 **AI modules** for predictive pipeline analysis & log triage.  
- 📊 **Observability** with Prometheus + Grafana.  

---

## 🏗️ Architecture  

![Architecture Diagram](./docs/architecture.png)  

*High-level flow: Developer → GitHub → Actions → AWS (ECR, EKS, RDS, S3) with AI and Security layers.*  

---

## ⚡ Features  
- ✅ **Enterprise-grade CI/CD** – build, test, scan, deploy pipelines.  
- ✅ **AWS-native infra** – provisioned with Terraform (EKS, RDS, S3, ECR).  
- ✅ **Security-by-design** – GitHub OIDC, Trivy scans, Secrets Manager.  
- ✅ **Observability stack** – Prometheus & Grafana dashboards.  
- ✅ **AI-powered insights** – anomaly detection & log summarization.  

---

## ▶️ Quick Start (Local Demo)  

```bash
docker-compose up --build
🌐 Backend → http://localhost:8000/health

💻 Frontend → http://localhost:3000

🚀 Deployment to AWS
Configure variables:

bash
Copy code
cp infra/terraform/terraform.tfvars.example infra/terraform/terraform.tfvars
Update: aws_region, aws_account_id, project_name.

Provision infra:

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
🔜 Replace AI placeholders with HuggingFace/OpenAI models.

🔜 Expand Grafana dashboards with predictive analytics.

🔜 Add cost-optimization recommender for AWS workloads.

🔜 Extend AI modules for automated incident remediation.

📜 License
This project is licensed under the MIT License.