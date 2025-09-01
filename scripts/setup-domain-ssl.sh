#!/bin/bash
# UK ETA Gateway - Domain & SSL Setup Script
# This script sets up production domain and SSL certificates

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 UK ETA Gateway - Domain & SSL Setup${NC}"
echo "======================================"

# Load configuration
source .env.production 2>/dev/null || {
    echo -e "${RED}❌ Error: .env.production file not found${NC}"
    echo "Please create .env.production with your configuration"
    exit 1
}

# Validate required variables
required_vars=(
    "PRIMARY_DOMAIN"
    "CLOUDFLARE_API_TOKEN"
    "CLOUDFLARE_ZONE_ID"
    "CLOUDFLARE_EMAIL"
)

for var in "${required_vars[@]}"; do
    if [[ -z "${!var}" ]]; then
        echo -e "${RED}❌ Error: $var is not set in .env.production${NC}"
        exit 1
    fi
done

echo -e "${YELLOW}📋 Configuration Summary:${NC}"
echo "Primary Domain: $PRIMARY_DOMAIN"
echo "WWW Domain: $WWW_DOMAIN"
echo "API Domain: $API_DOMAIN"
echo "CDN Domain: $CDN_DOMAIN"
echo ""

# Confirm before proceeding
read -p "Continue with domain and SSL setup? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Setup cancelled."
    exit 1
fi

# Step 1: DNS Configuration
echo -e "${BLUE}🌐 Step 1: Configuring DNS Records${NC}"

# Function to create/update DNS record
update_dns_record() {
    local name=$1
    local content=$2
    local type=${3:-A}
    
    echo "Updating $type record for $name -> $content"
    
    # Check if record exists
    record_id=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/dns_records?name=$name&type=$type" \
        -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
        -H "Content-Type: application/json" | \
        jq -r '.result[0].id // empty')
    
    if [[ -n "$record_id" && "$record_id" != "null" ]]; then
        # Update existing record
        curl -s -X PUT "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/dns_records/$record_id" \
            -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
            -H "Content-Type: application/json" \
            --data "{\"type\":\"$type\",\"name\":\"$name\",\"content\":\"$content\",\"ttl\":300}" > /dev/null
    else
        # Create new record
        curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/dns_records" \
            -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
            -H "Content-Type: application/json" \
            --data "{\"type\":\"$type\",\"name\":\"$name\",\"content\":\"$content\",\"ttl\":300}" > /dev/null
    fi
    
    echo "✅ $name DNS record updated"
}

# Get server IP (you'll need to set this to your actual server IP)
if [[ -z "$SERVER_IP" ]]; then
    echo -e "${YELLOW}⚠️  SERVER_IP not set in environment. Please enter your server IP:${NC}"
    read -p "Server IP: " SERVER_IP
fi

# Update DNS records
update_dns_record "$PRIMARY_DOMAIN" "$SERVER_IP"
update_dns_record "$WWW_DOMAIN" "$PRIMARY_DOMAIN" "CNAME"
update_dns_record "$API_DOMAIN" "$SERVER_IP"
update_dns_record "$CDN_DOMAIN" "$SERVER_IP"

echo -e "${GREEN}✅ DNS configuration completed${NC}"

# Step 2: SSL Certificate Setup
echo -e "${BLUE}🔒 Step 2: Setting up SSL Certificates${NC}"

# Install certbot if not present
if ! command -v certbot &> /dev/null; then
    echo "Installing certbot..."
    if command -v apt-get &> /dev/null; then
        sudo apt-get update
        sudo apt-get install -y certbot python3-certbot-nginx
    elif command -v yum &> /dev/null; then
        sudo yum install -y certbot python3-certbot-nginx
    else
        echo -e "${RED}❌ Package manager not supported. Please install certbot manually.${NC}"
        exit 1
    fi
fi

# Wait for DNS propagation
echo "⏳ Waiting 60 seconds for DNS propagation..."
sleep 60

# Generate SSL certificates
domains=(
    "$PRIMARY_DOMAIN"
    "$WWW_DOMAIN"
    "$API_DOMAIN"
    "$CDN_DOMAIN"
)

# Build certbot domain arguments
domain_args=""
for domain in "${domains[@]}"; do
    domain_args="$domain_args -d $domain"
done

echo "Generating SSL certificates for: ${domains[*]}"

# Request certificates
sudo certbot certonly \
    --nginx \
    --email "$CLOUDFLARE_EMAIL" \
    --agree-tos \
    --no-eff-email \
    --expand \
    $domain_args

if [[ $? -eq 0 ]]; then
    echo -e "${GREEN}✅ SSL certificates generated successfully${NC}"
else
    echo -e "${RED}❌ SSL certificate generation failed${NC}"
    exit 1
fi

# Step 3: Configure Nginx
echo -e "${BLUE}⚙️  Step 3: Configuring Nginx${NC}"

# Create Nginx configuration
nginx_config="/etc/nginx/sites-available/uketa"
sudo tee "$nginx_config" > /dev/null <<EOF
# UK ETA Gateway - Production Configuration
server {
    listen 80;
    server_name $PRIMARY_DOMAIN $WWW_DOMAIN;
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name $PRIMARY_DOMAIN;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/$PRIMARY_DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$PRIMARY_DOMAIN/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_dhparam /etc/ssl/certs/dhparam.pem;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; img-src 'self' data: blob: https:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://*.supabase.co https://api.stripe.com; frame-src https://js.stripe.com https://www.google.com; frame-ancestors 'none'; form-action 'self'; base-uri 'self'; object-src 'none';" always;
    
    # Document root
    root /var/www/uketa/dist;
    index index.html;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Main location
    location / {
        try_files \$uri \$uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # API proxy (if needed)
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}

# WWW redirect
server {
    listen 443 ssl http2;
    server_name $WWW_DOMAIN;
    
    ssl_certificate /etc/letsencrypt/live/$PRIMARY_DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$PRIMARY_DOMAIN/privkey.pem;
    
    return 301 https://$PRIMARY_DOMAIN\$request_uri;
}

# API subdomain
server {
    listen 443 ssl http2;
    server_name $API_DOMAIN;
    
    ssl_certificate /etc/letsencrypt/live/$PRIMARY_DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$PRIMARY_DOMAIN/privkey.pem;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Generate DH parameters if not exists
if [[ ! -f /etc/ssl/certs/dhparam.pem ]]; then
    echo "Generating DH parameters..."
    sudo openssl dhparam -out /etc/ssl/certs/dhparam.pem 2048
fi

# Enable the site
sudo ln -sf "$nginx_config" /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

echo -e "${GREEN}✅ Nginx configuration completed${NC}"

# Step 4: Setup SSL renewal
echo -e "${BLUE}🔄 Step 4: Setting up SSL certificate renewal${NC}"

# Create renewal script
renewal_script="/usr/local/bin/renew-uketa-ssl"
sudo tee "$renewal_script" > /dev/null <<EOF
#!/bin/bash
certbot renew --quiet --nginx
systemctl reload nginx
EOF

sudo chmod +x "$renewal_script"

# Setup crontab for automatic renewal
(sudo crontab -l 2>/dev/null; echo "0 3 * * * $renewal_script") | sudo crontab -

echo -e "${GREEN}✅ SSL renewal configured${NC}"

# Step 5: Test SSL configuration
echo -e "${BLUE}🧪 Step 5: Testing SSL configuration${NC}"

echo "Testing SSL certificate..."
openssl s_client -connect "$PRIMARY_DOMAIN:443" -servername "$PRIMARY_DOMAIN" < /dev/null 2>/dev/null | openssl x509 -checkend 864000

if [[ $? -eq 0 ]]; then
    echo -e "${GREEN}✅ SSL certificate is valid${NC}"
else
    echo -e "${YELLOW}⚠️  SSL certificate test failed${NC}"
fi

# Step 6: Test website access
echo -e "${BLUE}🌐 Step 6: Testing website access${NC}"

for domain in "${domains[@]}"; do
    echo "Testing https://$domain..."
    response=$(curl -s -o /dev/null -w "%{http_code}" "https://$domain" || echo "000")
    
    if [[ "$response" == "200" ]]; then
        echo -e "${GREEN}✅ https://$domain is accessible${NC}"
    else
        echo -e "${YELLOW}⚠️  https://$domain returned HTTP $response${NC}"
    fi
done

# Summary
echo ""
echo -e "${GREEN}🎉 Domain & SSL Setup Complete!${NC}"
echo "======================================"
echo -e "${BLUE}Next Steps:${NC}"
echo "1. Update your .env.production file with actual values"
echo "2. Deploy your application to /var/www/uketa/dist"
echo "3. Set up Supabase production project"
echo "4. Configure Stripe live keys"
echo "5. Test the complete application flow"
echo ""
echo -e "${BLUE}Important URLs:${NC}"
echo "Primary: https://$PRIMARY_DOMAIN"
echo "API: https://$API_DOMAIN"
echo "CDN: https://$CDN_DOMAIN"
echo ""
echo -e "${YELLOW}⚠️  Don't forget to:${NC}"
echo "- Update DNS records if server IP changes"
echo "- Monitor certificate expiration"
echo "- Test SSL renewal process"
echo "- Set up monitoring and alerts"
echo ""
echo -e "${GREEN}Setup completed successfully! 🚀${NC}"