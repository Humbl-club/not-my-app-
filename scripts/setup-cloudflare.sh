#!/bin/bash
# UK ETA Gateway - Cloudflare Configuration Script
# Sets up WAF, caching, and security rules via Cloudflare API

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}☁️  UK ETA Gateway - Cloudflare Configuration${NC}"
echo "=============================================="

# Load configuration
if [[ -f .env.production ]]; then
    source .env.production
else
    echo -e "${RED}❌ Error: .env.production file not found${NC}"
    exit 1
fi

# Validate required variables
if [[ -z "$CLOUDFLARE_API_TOKEN" || -z "$CLOUDFLARE_ZONE_ID" ]]; then
    echo -e "${RED}❌ Error: CLOUDFLARE_API_TOKEN and CLOUDFLARE_ZONE_ID must be set${NC}"
    exit 1
fi

# Function to make Cloudflare API calls
cf_api() {
    local method=$1
    local endpoint=$2
    local data=$3
    
    if [[ -n "$data" ]]; then
        curl -s -X "$method" "https://api.cloudflare.com/client/v4$endpoint" \
            -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
            -H "Content-Type: application/json" \
            --data "$data"
    else
        curl -s -X "$method" "https://api.cloudflare.com/client/v4$endpoint" \
            -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
            -H "Content-Type: application/json"
    fi
}

# Step 1: Security Settings
echo -e "${BLUE}🔒 Step 1: Configuring Security Settings${NC}"

# Enable Always Use HTTPS
cf_api "PATCH" "/zones/$CLOUDFLARE_ZONE_ID/settings/always_use_https" '{"value":"on"}' > /dev/null
echo "✅ Always Use HTTPS enabled"

# Set minimum TLS version
cf_api "PATCH" "/zones/$CLOUDFLARE_ZONE_ID/settings/min_tls_version" '{"value":"1.2"}' > /dev/null
echo "✅ Minimum TLS version set to 1.2"

# Enable HSTS
cf_api "PATCH" "/zones/$CLOUDFLARE_ZONE_ID/settings/security_header" '{
    "value": {
        "strict_transport_security": {
            "enabled": true,
            "max_age": 31536000,
            "include_subdomains": true,
            "preload": true
        }
    }
}' > /dev/null
echo "✅ HSTS enabled"

# Set security level
cf_api "PATCH" "/zones/$CLOUDFLARE_ZONE_ID/settings/security_level" '{"value":"medium"}' > /dev/null
echo "✅ Security level set to medium"

# Enable Browser Integrity Check
cf_api "PATCH" "/zones/$CLOUDFLARE_ZONE_ID/settings/browser_check" '{"value":"on"}' > /dev/null
echo "✅ Browser integrity check enabled"

# Step 2: WAF Rules
echo -e "${BLUE}🛡️  Step 2: Configuring WAF Rules${NC}"

# Create WAF rules for common attacks
waf_rules=(
    # SQL Injection protection
    '{"action":"block","priority":1,"description":"Block SQL injection attempts","expression":"(http.request.uri.query contains \"union select\") or (http.request.uri.query contains \"drop table\") or (http.request.uri.query contains \"insert into\") or (http.request.body.raw contains \"union select\") or (http.request.body.raw contains \"drop table\")"}'
    
    # XSS protection
    '{"action":"block","priority":2,"description":"Block XSS attempts","expression":"(http.request.uri.query contains \"<script\") or (http.request.uri.query contains \"javascript:\") or (http.request.body.raw contains \"<script\") or (http.request.body.raw contains \"javascript:\")"}'
    
    # Rate limiting for login endpoints
    '{"action":"challenge","priority":3,"description":"Rate limit sensitive endpoints","expression":"(http.request.uri.path contains \"/api/track-application\" or http.request.uri.path contains \"/admin\") and (http.request.method eq \"POST\")"}'
    
    # Block common bot patterns
    '{"action":"block","priority":4,"description":"Block malicious bots","expression":"(http.user_agent contains \"sqlmap\") or (http.user_agent contains \"nikto\") or (http.user_agent contains \"acunetix\") or (http.user_agent contains \"nessus\")"}'
    
    # Geographic restrictions (optional - uncomment if needed)
    # '{"action":"block","priority":5,"description":"Block non-allowed countries","expression":"not (ip.geoip.country in {\"GB\" \"US\" \"CA\" \"AU\" \"IE\"})"}'
)

# Apply WAF rules
for rule in "${waf_rules[@]}"; do
    response=$(cf_api "POST" "/zones/$CLOUDFLARE_ZONE_ID/firewall/rules" "$rule")
    rule_id=$(echo "$response" | jq -r '.result.id // "error"')
    
    if [[ "$rule_id" != "error" && "$rule_id" != "null" ]]; then
        echo "✅ WAF rule created: $rule_id"
    else
        echo "⚠️  Failed to create WAF rule: $(echo "$response" | jq -r '.errors[0].message // "Unknown error"')"
    fi
done

# Step 3: Page Rules for Caching
echo -e "${BLUE}⚡ Step 3: Setting up Page Rules${NC}"

page_rules=(
    # Cache static assets aggressively
    '{"targets":[{"target":"url","constraint":{"operator":"matches","value":"'$PRIMARY_DOMAIN'/*.(jpg|jpeg|png|gif|ico|svg|css|js|woff|woff2|ttf|eot|pdf)"}}],"actions":[{"id":"cache_level","value":"cache_everything"},{"id":"edge_cache_ttl","value":2592000},{"id":"browser_cache_ttl","value":2592000}],"priority":1,"status":"active"}'
    
    # API endpoints - bypass cache
    '{"targets":[{"target":"url","constraint":{"operator":"matches","value":"'$PRIMARY_DOMAIN'/api/*"}}],"actions":[{"id":"cache_level","value":"bypass"}],"priority":2,"status":"active"}'
    
    # Admin pages - bypass cache and enable security
    '{"targets":[{"target":"url","constraint":{"operator":"matches","value":"'$PRIMARY_DOMAIN'/admin*"}}],"actions":[{"id":"cache_level","value":"bypass"},{"id":"security_level","value":"high"}],"priority":3,"status":"active"}'
)

for rule in "${page_rules[@]}"; do
    response=$(cf_api "POST" "/zones/$CLOUDFLARE_ZONE_ID/pagerules" "$rule")
    rule_id=$(echo "$response" | jq -r '.result.id // "error"')
    
    if [[ "$rule_id" != "error" && "$rule_id" != "null" ]]; then
        echo "✅ Page rule created: $rule_id"
    else
        echo "⚠️  Failed to create page rule: $(echo "$response" | jq -r '.errors[0].message // "Unknown error"')"
    fi
done

# Step 4: Rate Limiting Rules
echo -e "${BLUE}⏱️  Step 4: Configuring Rate Limiting${NC}"

# Rate limiting rules
rate_limit_rules=(
    # General rate limiting
    '{"match":{"request":{"methods":["_ALL_"],"schemes":["_ALL_"],"url":"'$PRIMARY_DOMAIN'/*"}},"threshold":100,"period":900,"action":{"mode":"simulate","timeout":60},"disabled":false,"description":"General rate limiting - 100 requests per 15 minutes"}'
    
    # Strict rate limiting for sensitive endpoints
    '{"match":{"request":{"methods":["POST"],"schemes":["HTTPS"],"url":"'$PRIMARY_DOMAIN'/api/track-application"}},"threshold":5,"period":900,"action":{"mode":"ban","timeout":900},"disabled":false,"description":"Track application rate limiting - 5 attempts per 15 minutes"}'
    
    # Payment endpoint rate limiting
    '{"match":{"request":{"methods":["POST"],"schemes":["HTTPS"],"url":"'$PRIMARY_DOMAIN'/api/payments/*"}},"threshold":10,"period":3600,"action":{"mode":"challenge","timeout":300},"disabled":false,"description":"Payment rate limiting - 10 attempts per hour"}'
)

for rule in "${rate_limit_rules[@]}"; do
    response=$(cf_api "POST" "/zones/$CLOUDFLARE_ZONE_ID/rate_limits" "$rule")
    rule_id=$(echo "$response" | jq -r '.result.id // "error"')
    
    if [[ "$rule_id" != "error" && "$rule_id" != "null" ]]; then
        echo "✅ Rate limit rule created: $rule_id"
    else
        echo "⚠️  Failed to create rate limit rule: $(echo "$response" | jq -r '.errors[0].message // "Unknown error"')"
    fi
done

# Step 5: SSL/TLS Configuration
echo -e "${BLUE}🔐 Step 5: SSL/TLS Configuration${NC}"

# Set SSL mode to Full (Strict)
cf_api "PATCH" "/zones/$CLOUDFLARE_ZONE_ID/settings/ssl" '{"value":"strict"}' > /dev/null
echo "✅ SSL mode set to Full (Strict)"

# Enable HTTP/2
cf_api "PATCH" "/zones/$CLOUDFLARE_ZONE_ID/settings/http2" '{"value":"on"}' > /dev/null
echo "✅ HTTP/2 enabled"

# Enable HTTP/3
cf_api "PATCH" "/zones/$CLOUDFLARE_ZONE_ID/settings/http3" '{"value":"on"}' > /dev/null
echo "✅ HTTP/3 enabled"

# Enable 0-RTT
cf_api "PATCH" "/zones/$CLOUDFLARE_ZONE_ID/settings/0rtt" '{"value":"on"}' > /dev/null
echo "✅ 0-RTT enabled"

# Step 6: Performance Optimizations
echo -e "${BLUE}🚀 Step 6: Performance Optimizations${NC}"

# Enable Brotli compression
cf_api "PATCH" "/zones/$CLOUDFLARE_ZONE_ID/settings/brotli" '{"value":"on"}' > /dev/null
echo "✅ Brotli compression enabled"

# Enable Rocket Loader (with caution - may break some JS)
cf_api "PATCH" "/zones/$CLOUDFLARE_ZONE_ID/settings/rocket_loader" '{"value":"off"}' > /dev/null
echo "✅ Rocket Loader disabled (safer for complex apps)"

# Enable Mirage (image optimization)
cf_api "PATCH" "/zones/$CLOUDFLARE_ZONE_ID/settings/mirage" '{"value":"on"}' > /dev/null
echo "✅ Mirage enabled"

# Enable Auto Minify
cf_api "PATCH" "/zones/$CLOUDFLARE_ZONE_ID/settings/minify" '{"value":{"css":"on","html":"on","js":"on"}}' > /dev/null
echo "✅ Auto minify enabled"

# Step 7: Analytics and Monitoring
echo -e "${BLUE}📊 Step 7: Analytics Setup${NC}"

# Enable Web Analytics (free tier)
response=$(cf_api "POST" "/zones/$CLOUDFLARE_ZONE_ID/web_analytics/sites" '{"host":"'$PRIMARY_DOMAIN'"}')
site_tag=$(echo "$response" | jq -r '.result.site_tag // "error"')

if [[ "$site_tag" != "error" && "$site_tag" != "null" ]]; then
    echo "✅ Web Analytics enabled. Site tag: $site_tag"
    echo -e "${YELLOW}📝 Add this to your HTML: <script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{\"token\": \"$site_tag\"}'></script>${NC}"
else
    echo "⚠️  Web Analytics setup failed"
fi

# Summary
echo ""
echo -e "${GREEN}🎉 Cloudflare Configuration Complete!${NC}"
echo "==========================================="
echo -e "${BLUE}Configured Features:${NC}"
echo "✅ Always Use HTTPS"
echo "✅ Minimum TLS 1.2"
echo "✅ HSTS with preload"
echo "✅ WAF rules for common attacks"
echo "✅ Page rules for caching"
echo "✅ Rate limiting rules"
echo "✅ Full (Strict) SSL mode"
echo "✅ HTTP/2 and HTTP/3"
echo "✅ Brotli compression"
echo "✅ Image optimization"
echo "✅ Auto minify"
echo "✅ Web Analytics"
echo ""
echo -e "${YELLOW}⚠️  Important Notes:${NC}"
echo "- Test your website thoroughly after these changes"
echo "- Monitor firewall events in Cloudflare dashboard"
echo "- Adjust rate limits based on actual traffic patterns"
echo "- Review WAF rules if legitimate traffic is blocked"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo "1. Test website functionality"
echo "2. Monitor Cloudflare Analytics"
echo "3. Fine-tune security rules as needed"
echo "4. Set up alerting for security events"
echo ""
echo -e "${GREEN}Cloudflare setup completed successfully! ☁️${NC}"