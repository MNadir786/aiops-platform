# 🌐 AIOps Platform – DevOps Intelligence as a Service  

---

## 🚀 Overview  
The **AIOps Platform** blends **DevOps** and **AI (AIOps)** to create a secure, intelligent, and self-optimizing cloud system.  

This project demonstrates:  
- ⚙️ CI/CD pipelines with GitHub Actions & Trivy.  
- ☁️ AWS-native infrastructure (EKS, ECR, RDS, S3) via Terraform.  
- 🔒 Security-first practices with OIDC, Trivy, and AWS Secrets Manager.  
- 🤖 AI-powered anomaly detection & log summarization.  
- 📊 Observability with Prometheus & Grafana dashboards.  

---

## ✨ Capabilities  
- ⚙️ **Automated CI/CD pipelines** with GitHub Actions & Trivy.  
- ☁️ **AWS-native infrastructure** provisioned via Terraform.  
- 🔒 **Security-first design** (OIDC authentication, Trivy scans, AWS Secrets Manager).  
- 🤖 **AI modules** for predictive pipeline analysis and log triage.  
- 📊 **Observability stack** with Prometheus + Grafana dashboards.  

---

## 🏗️ Architecture (Conceptual Flow)  

1. 👨‍💻 Developer pushes code → GitHub.  
2. ⚙️ GitHub Actions executes CI/CD (build, test, scan, deploy).  
3. ☁️ Terraform provisions AWS resources:  
   - EKS → FastAPI backend + React frontend.  
   - ECR → Container registry.  
   - RDS → Database.  
   - S3 → Object storage.  
4. 🔑 AWS Secrets Manager secures credentials.  
5. 🤖 AI modules analyze pipeline results & logs.  
6. 📊 Prometheus + Grafana provide monitoring & insights.  

---

## 📊 Key Deliverables  
- Automated CI/CD pipelines with GitHub Actions.  
- Security scanning with Trivy.  
- AWS infrastructure provisioned via Terraform (EKS, ECR, RDS, S3).  
- FastAPI backend + React frontend.  
- AI-assisted log summarization & anomaly detection.  
- Monitoring and observability stack (Prometheus + Grafana).  

---

## ▶️ Quick Start (Local Demo)  

```bash
docker-compose up --build
🌐 Backend → http://localhost:8000/health

💻 Frontend → http://localhost:3000

🚀 Deployment to AWS
Copy example variables:

bash
Copy code
cp infra/terraform/terraform.tfvars.example infra/terraform/terraform.tfvars
Update values for: aws_region, aws_account_id, project_name.

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
📜 License
Licensed under the MIT License.