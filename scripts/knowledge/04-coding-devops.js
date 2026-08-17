// 04-coding-devops.js - Docker, K8s, CI/CD, AWS, Azure, GCP, Nginx, Linux
module.exports = function(add) {

// Docker (8 entries)
add('docker_basics', `Docker Basics: FROM node:20-alpine. WORKDIR /app. COPY package*.json ./. RUN npm ci --production. COPY . . EXPOSE 3000. CMD ["node","server.js"]. docker build -t myapp . docker run -p 3000:3000 myapp. docker ps. docker logs container_id.`, 'coding');
add('docker_compose', `Docker Compose: version:"3.8". services: web: build:. ports:["3000:3000"]. depends_on:[db]. environment:[POSTGRES_DB=mydb]. volumes:[./data:/var/lib/postgresql/data]. networks:[app-net]. docker compose up -d. docker compose down. docker compose logs -f.`, 'coding');
add('docker_multi', `Multi-stage Docker: FROM node:20 AS builder. WORKDIR /app. COPY . . RUN npm run build. FROM node:20-alpine. COPY --from=builder /app/dist ./dist. COPY --from=builder /app/node_modules ./node_modules. Small production image.`, 'coding');
add('docker_network', `Docker Networking: bridge(default), host, overlay, none. docker network create mynet. docker run --network mynet --name api. Links: docker run --link db:postgres. Expose: EXPOSE 3000 docs. Port mapping: -p 8080:80. Volume: -v /host:/container.`, 'coding');
add('docker_volume', `Docker Volumes: docker volume create myvol. -v myvol:/app/data. --mount type=volume,src=myvol,dst=/data. Bind mount: -v /host/path:/container/path. docker volume ls. docker volume rm. Backup: docker run --rm -v myvol:/data -v /backup:/backup alpine tar czf /backup/vol.tar.gz -C /data .`, 'coding');
add('docker_health', `Docker Health: HEALTHCHECK --interval=30s --timeout=10s CMD curl -f http://localhost/health. docker inspect --format={{.State.Health.Status}}. unhealthy restart. Dockerfile best practices: .dockerignore, non-root USER, multi-stage, minimal base, layer caching.`, 'coding');
add('docker_security', `Docker Security: Do not run as root: USER node. Read-only: --read-only. No capabilities: --cap-drop ALL. Secrets: --env-file .env (not -e). Scan: docker scout cves. Sign: cosign. Minimal images: alpine/distroless. No .env in image.`, 'coding');

// Kubernetes (5 entries)
add('k8s_basics', `Kubernetes Basics: kubectl get pods. kubectl get svc. kubectl describe pod name. kubectl logs pod-name. kubectl exec -it pod-name -- sh. kubectl apply -f deploy.yaml. kubectl delete -f deploy.yaml. kubectl scale deployment myapp --replicas=3.`, 'coding');
add('k8s_deployment', `K8s Deployment: apiVersion:apps/v1 kind:Deployment metadata:{name:web} spec:{replicas:3 selector:{matchLabels:{app:web}} template:{metadata:{labels:{app:web}} spec:{containers:[{name:web,image:nginx:latest,ports:[{containerPort:80}]}]}}}. Rolling update strategy.`, 'coding');
add('k8s_service', `K8s Service: ClusterIP(default), NodePort, LoadBalancer, Ingress. apiVersion:v1 kind:Service spec:{type:LoadBalancer selector:{app:web} ports:[{port:80,targetPort:3000}]}. Ingress for HTTP routing. Ingress class nginx.`, 'coding');
add('k8s_configmap', `K8s ConfigMap & Secrets: ConfigMap: data:{DB_HOST:postgres}. kubectl create configmap mycfg --from-file=.env. Secret: stringData:{password:pass}. kubectl create secret generic mysecret --from-literal=password=pass. envFrom: configMapRef/secretRef.`, 'coding');
add('k8s_namespace', `K8s Namespaces: kubectl create namespace prod. kubectl get pods -n prod. metadata:{namespace:prod}. Resource limits: resources:{limits:{cpu:"500m",memory:"256Mi"}}. HPA: apiVersion:autoscaling/v2 HorizontalPodAutoscaler.`, 'coding');

// CI/CD (6 entries)
add('github_actions', `GitHub Actions: .github/workflows/deploy.yml. on:push:branches:[main]. jobs: build: runs-on:ubuntu-latest. steps:[{uses:actions/checkout@v4},{run:npm ci},{run:npm test},{run:npm run build}]. Secrets: \${{secrets.DEPLOY_KEY}}. Matrix strategy.`, 'coding');
add('github_actions_deploy', `GitHub Actions Deploy: deploy job needs build. ssh to server: appleboy/ssh-action@master. Docker deploy: docker compose pull && docker compose up -d. Railway: railway up. Vercel: vercel --prod --token $TOKEN. Environment variables per environment.`, 'coding');
add('cicd_pipeline', `CI/CD Pipeline: 1.Lint 2.Test 3.Build 4.Deploy. Branch protection: require PR review + status checks. Staging env for testing. Blue-green deploy: switch traffic. Canary: gradual rollout. Rollback: revert image tag. Feature flags for safe release.`, 'coding');
add('cicd_testing', `CI Testing: Unit tests (fastest, most). Integration tests (API, DB). E2E tests (slowest, most valuable). Test parallelization. Coverage thresholds: 80%+. Test artifacts: JUnit XML. Caching node_modules. Matrix: test on multiple Node versions.`, 'coding');

// AWS (6 entries)
add('aws_basics', `AWS Basics: EC2 instances, S3 buckets, RDS databases, Lambda functions, CloudFront CDN. IAM users/roles/policies. Region selection. AZ for HA. Security groups firewall. Key pairs SSH. Elastic IP static IP. EBS persistent disk.`, 'coding');
add('aws_s3', `AWS S3: aws s3 mb s3://mybucket. aws s3 cp file s3://bucket/ --acl public-read. Static website hosting. CloudFront distribution. Lifecycle: transition to Glacier after 90d. Versioning. CORS. Signed URLs. Transfer acceleration.`, 'coding');
add('aws_lambda', `AWS Lambda: exports.handler=async(event)=>{return{statusCode:200,body:JSON.stringify({ok:true})}}. Trigger: API Gateway, S3, SQS, DynamoDB streams. Memory 128MB-10GB. Timeout max 15min. Cold start optimization. Lambda@Edge. Step Functions.`, 'coding');
add('aws_rds', `AWS RDS: MySQL, PostgreSQL, Aurora, MariaDB. Multi-AZ for HA. Read replicas. Automated backups. Instance classes db.t3.micro to db.r5. Parameter groups. Security groups. RDS Proxy for connection pooling. Aurora Serverless v2.`, 'coding');
add('aws_ecs', `AWS ECS: Task definition (container config). Service (maintain count). Cluster (EC2 or Fargate). ALB load balancer. ECR container registry. Service discovery. Auto-scaling. Rolling deploy. Blue/green with CodeDeploy.`, 'coding');
add('aws_cloudfront', `AWS CloudFront: Distribution with origin S3/API Gateway. Behaviors for path routing. Cache invalidation: aws cloudfront create-invalidation. Custom SSL certificate. Lambda@Edge. Origin Access Control for private S3. Price class selection.`, 'coding');

// Azure & GCP (4 entries)
add('azure_basics', `Azure: Resource Groups organize. App Service hosting. Azure SQL Database. Blob Storage. Azure Functions serverless. Azure DevOps CI/CD. Azure Active Directory auth. Cosmos DB multi-model. Azure CDN. Resource Manager templates.`, 'coding');
add('gcp_basics', `GCP: Compute Engine VMs. Cloud Run containers. Cloud Functions. Cloud Storage buckets. Cloud SQL. BigQuery analytics. Firebase integration. IAM policies. Cloud Build CI/CD. App Engine PaaS. GKE Kubernetes.`, 'coding');

// Nginx (5 entries)
add('nginx_config', `Nginx: server{listen 80;server_name example.com;location /{proxy_pass http://localhost:3000;proxy_set_header Host $host;proxy_set_header X-Real-IP $remote_addr;proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;proxy_set_header X-Forwarded-Proto $scheme;}}. HTTPS with certbot.`, 'coding');
add('nginx_proxy', `Nginx Reverse Proxy: upstream backend{server 127.0.0.1:3000;server 127.0.0.1:3001;}. location /api/{proxy_pass http://backend;}. load-balance: least_conn or ip_hash. WebSocket: proxy_http_version 1.1;proxy_set_header Upgrade $http_upgrade;proxy_set_header Connection "upgrade".`, 'coding');
add('nginx_cache', `Nginx Caching: proxy_cache_path /tmp/cache levels=1:2 keys_zone=mycache:10m. location /{proxy_cache mycache;proxy_cache_valid 200 10m;add_header X-Cache-Status $upstream_cache_status;}. Static: location /static{root /var/www;expires 30d;add_header Cache-Control "public,immutable";}.`, 'coding');
add('nginx_ssl', `Nginx SSL: server{listen 443 ssl;ssl_certificate /etc/letsencrypt/live/x.com/fullchain.pem;ssl_certificate_key /etc/letsencrypt/live/x.com/privkey.pem;ssl_protocols TLSv1.2 TLSv1.3;ssl_prefer_server_ciphers on;}. Redirect HTTP: return 301 https://$host$request_uri;`, 'coding');

// Linux & Shell (8 entries)
add('linux_basics', `Linux Commands: ls -la, cd, pwd, mkdir -p dir, rm -rf dir, cp -r src dst, mv, cat, less, head -n 20, tail -f log.txt, grep -rn "pattern" ., find . -name "*.js" -mtime -1, chmod 755 file, chown user:group file.`, 'coding');
add('linux_text', `Text Processing: awk 'NR==1{print $1}' file. sed 's/old/new/g' file. sort -k2 -n. uniq -c count. cut -d"," -f1,2. tr "a" "A". wc -l lines. xargs -I {} cmd {}. grep -E "regex" file. paste -d"," file1 file2.`, 'coding');
add('linux_process', `Process Management: ps aux. top/htop. kill PID. kill -9 PID force. nohup cmd &. jobs/fg/bg. screen -S name / screen -r. tmux. nice -n 10 cmd. systemctl start/stop/restart/enable/status service. journalctl -u service -f.`, 'coding');
add('linux_network', `Network: curl -X POST -d '{}' -H "Content-Type: application/json" url. wget url. ss -tlnp ports. netstat -tlnp. ping. traceroute. dig/host DNS. ip addr show. ifconfig. iptables -A INPUT -p tcp --dport 80 -j ACCEPT. scp file user@host:/path.`, 'coding');
add('linux_disk', `Disk Management: df -h disk usage. du -sh dir. lsblk block devices. mount/umount. fdisk/parted partitions. lvm logical volumes. iostat IO stats. inode usage: df -i. Backup: tar czf backup.tar.gz dir. rsync -avz src dst.`, 'coding');
add('linux_bash', `Bash Scripting: #!/bin/bash. set -euo pipefail. for f in *.js; do echo $f; done. while read line; do echo $line; done < file. if [ -f file ]; then echo exists; fi. $1 first arg. $# args count. $? exit code. $(cmd) subshell. \${var:-default}. function name{}.`, 'coding');
add('linux_cron', `Cron Jobs: crontab -e. Format: minute hour day month weekday command. 0 2 * * * /scripts/backup.sh (daily 2AM). */5 * * * * /scripts/check.sh (every 5min). 0 0 * * 0 (weekly Sunday). Log: command >> /var/log/cron.log 2>&1. crontab -l list.`, 'coding');
add('linux_debug', `Debugging: strace cmd trace syscalls. lsof -i :8080 port usage. /var/log/syslog system log. dmesg kernel messages. free -h memory. vmstat 1 stats. uptime load average. lscpu CPU info. nproc CPU count. uname -a system info.`, 'coding');
};
