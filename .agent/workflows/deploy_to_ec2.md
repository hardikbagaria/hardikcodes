---
description: Deploy Next.js App to AWS EC2
---

# Deploying to AWS EC2

Since I cannot access your AWS console directly, you will need to provision the server. Once the server is running, I can help you configure it if you provide SSH access, or you can follow these steps.

## Phase 1: Provisioning (AWS Console)

1.  **Launch Instance**:
    *   Go to AWS EC2 Dashboard -> Launch Instance.
    *   **OS**: Ubuntu Server 22.04 LTS (recommended).
    *   **Instance Type**: `t2.micro` (free tier) or `t3.small` (recommended for Next.js builds).
    *   **Key Pair**: Create a new key pair (e.g., `hardik-key.pem`) and download it. **Keep this safe!**
    *   **Security Group**: Allow SSH (22), HTTP (80), and HTTPS (443).

2.  **Connect to Instance**:
    *   Open your terminal (PowerShell or Git Bash).
    *   Run: `ssh -i "path\to\hardik-key.pem" ubuntu@<YOUR_INSTANCE_PUBLIC_IP>`

## Phase 2: Server Setup (Run on EC2)

Run these commands one by one on your Ubuntu server:

```bash
# 1. Update system
sudo apt update && sudo apt upgrade -y

# 2. Install Node.js 18+ (using NodeSource)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 3. Install PM2 (Process Manager) and Nginx (Web Server)
sudo npm install -g pm2
sudo apt install -y nginx
```

## Phase 3: Deploy Code

You have two options: **Git** (Recommended) or **SCP** (Copy files).

### Option A: Using Git (Recommended)
1.  Push your code to a GitHub repository.
2.  On EC2: `git clone https://github.com/your-username/hardikcodes.git`
3.  `cd hardikcodes`
4.  `npm install`
5.  **Environment Variables**:
    *   Create `.env.local`: `nano .env.local`
    *   Paste your Supabase URL, Key, etc.
    *   Save: `Ctrl+O`, `Enter`, `Ctrl+X`.
6.  `npm run build`

## Phase 4: Run Application

1.  **Start with PM2**:
    ```bash
    pm2 start npm --name "nextjs-app" -- start
    pm2 save
    pm2 startup
    ```
    *(Run the command output by `pm2 startup` if instructed)*

2.  **Check Config**:
    `curl http://localhost:3000` (Should return HTML)

## Phase 5: Configure Nginx (Reverse Proxy)

1.  Open config: `sudo nano /etc/nginx/sites-available/default`
2.  Replace contents with:
    ```nginx
    server {
        listen 80;
        server_name your-domain.com; # OR your public IP

        location / {
            proxy_pass http://localhost:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```
3.  Restart Nginx: `sudo systemctl restart nginx`

## Phase 6: SSL (Optional but Recommended)

If you have a domain pointing to this IP:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx
```
