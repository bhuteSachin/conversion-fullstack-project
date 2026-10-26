# Bhasha Helm chart

This chart deploys the React frontend and Java backend into an existing Kubernetes cluster. It expects the backend secrets to exist as a Kubernetes Secret named `bhasha-app-secrets` by default. The required keys are `MONGODB_URI`, `JWT_SECRET`, and `GEMINI_API_KEY`.

## Validate and render

```sh
helm lint ./helm/bhasha
helm template bhasha ./helm/bhasha --namespace bhasha --values ./helm/bhasha/values-dev.yaml
```

## Install in dev

Create the `bhasha-app-secrets` Secret through the approved secret-management process, then run:

```sh
helm upgrade --install bhasha ./helm/bhasha \
  --namespace bhasha --create-namespace \
  --values ./helm/bhasha/values-dev.yaml \
  --set frontend.image.repository=<account>.dkr.ecr.<region>.amazonaws.com/bhasha-frontend-dev \
  --set frontend.image.tag=<immutable-tag> \
  --set backend.image.repository=<account>.dkr.ecr.<region>.amazonaws.com/bhasha-backend-dev \
  --set backend.image.tag=<immutable-tag> \
  --wait --timeout 10m
```

For an internet-facing AWS deployment, enable the ALB ingress and provide a real DNS name and ACM certificate ARN in a protected environment values file. The AWS Load Balancer Controller must already be installed in EKS.

## Jenkins prerequisites

- A multibranch Jenkins job with Pipeline, SonarQube Scanner, and SonarQube plugins.
- A configured SonarQube server named `SonarQube` and scanner tool named `SonarScanner`.
- An agent with Node.js/npm, Java 21/Maven, Docker, AWS CLI, Helm, and Trivy installed.
- AWS credentials on the agent through an instance profile or an approved credential provider. The role needs ECR push access, EKS describe access, and Kubernetes authorization for the target namespace.
- Terraform must have created the dev ECR repositories and EKS cluster. The backend Kubernetes Secret must be provisioned before deployment.
- Set `DEPLOY_TO_EKS` only after the agent can reach the cluster and the target environment is ready.

The pipeline scans built images with Trivy and blocks on unfixed HIGH or CRITICAL vulnerabilities. It deploys only from `main`, and EKS deployment is manually gated by the `DEPLOY_TO_EKS` parameter.
