# Bhasha deployment roadmap

This plan moves the existing React/Vite and Spring Boot application toward a production deployment on AWS EKS. Complete each phase and review its output before moving to the next.

## Current inventory

- Frontend: React, TypeScript, Vite, ESLint, and a multi-stage Nginx Dockerfile already exist under `client/`.
- Backend: Spring Boot 4 / Java 21, MongoDB driver, environment-based MongoDB and API keys, and a Dockerfile already exist under `server-java/`.
- AWS: Terraform has VPC, EKS, IAM, and Secrets Manager modules with dev and prod environment directories.
- Added in the current setup: Helm chart, Jenkins pipeline, SonarQube project configuration, Trivy image scans, and dev/prod ECR repositories in Terraform.

## Phases

1. **Application deployment readiness** — establish which backend owns each UI feature and API route; align frontend URLs, Nginx proxy routes, backend health checks, CORS/authentication, and production configuration. The current UI calls both Java routes and routes that are not implemented in the Java service, so this needs resolution before a live deployment.
2. **Local build and image readiness** — make the frontend and backend reproducibly buildable, define image tags, and document required runtime settings without committing secrets.
3. **MongoDB and secrets** — choose MongoDB Atlas or another managed MongoDB-compatible service; set network access and credentials; store runtime secrets in AWS Secrets Manager and expose them to EKS using the existing IAM/IRSA direction.
4. **Kubernetes with Helm** — chart is in `helm/bhasha/`; it defines frontend/backend deployments, services, health probes, resource requests/limits, and optional ALB ingress. The backend Kubernetes Secret and AWS Load Balancer Controller still need to be provisioned.
5. **CI quality and security** — `Jenkinsfile` runs ESLint/build, backend packaging, SonarQube analysis, Trivy scans, ECR publishing, and a manually gated Helm deployment. Jenkins tools, AWS permissions, SonarQube, and Trivy must be available on the agent.
6. **AWS dev deployment** — validate Terraform plans and estimated costs, create/update dev AWS resources, deploy the chart, and verify health, logs, DNS, and TLS.
7. **Production launch** — after dev acceptance, configure production domain/secrets/backups/monitoring and promote the reviewed image/chart to prod.

## Decisions needed before cloud provisioning

- AWS account and target region, plus confirmation of the AWS account/profile to use.
- Domain name and DNS provider for HTTPS.
- MongoDB hosting choice (Atlas is the simplest starting point) and whether a MongoDB deployment already exists.
- Jenkins location and connectivity to AWS (self-hosted or an existing Jenkins server).
- Production budget/cost ceiling. EKS worker nodes and NAT gateways incur ongoing costs.

Do not run Terraform apply or publish the application until the AWS target, expected costs, domain, and required application secrets have been confirmed. Never put secret values in this document, source control, or container build arguments.
