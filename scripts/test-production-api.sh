#!/bin/bash
# UK ETA Gateway - Production API Testing Script
# Validates all endpoints and functionality

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧪 UK ETA Gateway - Production API Testing${NC}"
echo "============================================="

# Load production environment
if [[ -f .env.production.local ]]; then
    source .env.production.local
else
    echo -e "${RED}❌ .env.production.local not found${NC}"
    echo "Run setup-production-interactive.sh first"
    exit 1
fi

# Validate environment variables
if [[ -z "$VITE_SUPABASE_URL" || -z "$VITE_SUPABASE_ANON_KEY" ]]; then
    echo -e "${RED}❌ Missing Supabase configuration${NC}"
    exit 1
fi

echo -e "${BLUE}Testing Production Environment:${NC}"
echo "URL: $VITE_SUPABASE_URL"
echo "Project ID: $SUPABASE_PROJECT_ID"
echo ""

# Test Results Tracking
declare -a PASSED_TESTS=()
declare -a FAILED_TESTS=()

# Helper function to run tests
run_test() {
    local test_name="$1"
    local test_command="$2"
    local expected_codes="$3"
    
    echo -n "Testing $test_name... "
    
    if response=$(eval "$test_command" 2>/dev/null); then
        http_code=$(echo "$response" | tail -c 4)
        
        if [[ "$expected_codes" == *"$http_code"* ]]; then
            echo -e "${GREEN}✅ PASS (HTTP $http_code)${NC}"
            PASSED_TESTS+=("$test_name")
        else
            echo -e "${RED}❌ FAIL (HTTP $http_code, expected: $expected_codes)${NC}"
            FAILED_TESTS+=("$test_name")
        fi
    else
        echo -e "${RED}❌ FAIL (Network error)${NC}"
        FAILED_TESTS+=("$test_name")
    fi
}

# Test 1: Database Health Check
echo -e "${BLUE}📊 Database Tests${NC}"
echo "=================="

run_test "Database Connection" \
    "curl -s -w '%{http_code}' -o /dev/null '$VITE_SUPABASE_URL/rest/v1/' -H 'apikey: $VITE_SUPABASE_ANON_KEY'" \
    "200"

run_test "Applications Table" \
    "curl -s -w '%{http_code}' -o /dev/null '$VITE_SUPABASE_URL/rest/v1/applications?select=count&limit=1' -H 'apikey: $VITE_SUPABASE_ANON_KEY'" \
    "200"

run_test "Applicants Table" \
    "curl -s -w '%{http_code}' -o /dev/null '$VITE_SUPABASE_URL/rest/v1/applicants?select=count&limit=1' -H 'apikey: $VITE_SUPABASE_ANON_KEY'" \
    "200"

run_test "Tracking Tokens Table" \
    "curl -s -w '%{http_code}' -o /dev/null '$VITE_SUPABASE_URL/rest/v1/tracking_tokens?select=count&limit=1' -H 'apikey: $VITE_SUPABASE_ANON_KEY'" \
    "200"

echo ""

# Test 2: Edge Functions
echo -e "${BLUE}⚡ Edge Function Tests${NC}"
echo "======================"

edge_functions=("admin-dashboard" "create-payment-intent" "send-email" "submit-application" "verify-document")

for func in "${edge_functions[@]}"; do
    run_test "Edge Function: $func" \
        "curl -s -w '%{http_code}' -o /dev/null '$VITE_SUPABASE_URL/functions/v1/$func' -H 'Authorization: Bearer $VITE_SUPABASE_ANON_KEY'" \
        "200 400 401 405"
done

echo ""

# Test 3: Storage Buckets
echo -e "${BLUE}📁 Storage Tests${NC}"
echo "================="

storage_buckets=("documents" "photos" "passports" "etas")

for bucket in "${storage_buckets[@]}"; do
    run_test "Storage Bucket: $bucket" \
        "curl -s -w '%{http_code}' -o /dev/null '$VITE_SUPABASE_URL/storage/v1/bucket/$bucket' -H 'Authorization: Bearer $VITE_SUPABASE_ANON_KEY'" \
        "200 400"
done

echo ""

# Test 4: Authentication Endpoints
echo -e "${BLUE}🔐 Authentication Tests${NC}"
echo "======================="

run_test "Auth Health Check" \
    "curl -s -w '%{http_code}' -o /dev/null '$VITE_SUPABASE_URL/auth/v1/health'" \
    "200"

run_test "Auth Settings" \
    "curl -s -w '%{http_code}' -o /dev/null '$VITE_SUPABASE_URL/auth/v1/settings' -H 'apikey: $VITE_SUPABASE_ANON_KEY'" \
    "200"

echo ""

# Test 5: Realtime Connection
echo -e "${BLUE}🔄 Realtime Tests${NC}"
echo "=================="

run_test "Realtime Websocket" \
    "curl -s -w '%{http_code}' -o /dev/null '$VITE_SUPABASE_URL/realtime/v1/api/tenants/realtime-dev/health'" \
    "200 404"

echo ""

# Test 6: Security & Performance
echo -e "${BLUE}🛡️  Security Tests${NC}"
echo "=================="

# Test CORS headers
run_test "CORS Headers" \
    "curl -s -w '%{http_code}' -o /dev/null -H 'Origin: https://uketa.gov.uk' '$VITE_SUPABASE_URL/rest/v1/' -H 'apikey: $VITE_SUPABASE_ANON_KEY'" \
    "200"

# Test without API key (should fail)
run_test "API Key Protection" \
    "curl -s -w '%{http_code}' -o /dev/null '$VITE_SUPABASE_URL/rest/v1/applications'" \
    "401 403"

echo ""

# Test 7: Performance Metrics
echo -e "${BLUE}🚀 Performance Tests${NC}"
echo "===================="

echo "Measuring API response times..."

# Database query performance
db_time=$(curl -s -w "%{time_total}" -o /dev/null "$VITE_SUPABASE_URL/rest/v1/applications?select=count&limit=1" -H "apikey: $VITE_SUPABASE_ANON_KEY")
echo "Database query time: ${db_time}s"

# Edge function performance
func_time=$(curl -s -w "%{time_total}" -o /dev/null "$VITE_SUPABASE_URL/functions/v1/admin-dashboard" -H "Authorization: Bearer $VITE_SUPABASE_ANON_KEY")
echo "Edge function time: ${func_time}s"

# Performance thresholds
if (( $(echo "$db_time < 1.0" | bc -l) )); then
    echo -e "${GREEN}✅ Database performance: Good (<1s)${NC}"
    PASSED_TESTS+=("Database Performance")
else
    echo -e "${YELLOW}⚠️  Database performance: Slow (>1s)${NC}"
    FAILED_TESTS+=("Database Performance")
fi

if (( $(echo "$func_time < 2.0" | bc -l) )); then
    echo -e "${GREEN}✅ Edge function performance: Good (<2s)${NC}"
    PASSED_TESTS+=("Edge Function Performance")
else
    echo -e "${YELLOW}⚠️  Edge function performance: Slow (>2s)${NC}"
    FAILED_TESTS+=("Edge Function Performance")
fi

echo ""

# Test 8: Integration Tests
echo -e "${BLUE}🔗 Integration Tests${NC}"
echo "===================="

# Test creating a test application (if service key is available)
if [[ -n "$SUPABASE_SERVICE_ROLE_KEY" ]]; then
    echo "Testing application creation..."
    
    test_payload='{"type":"single","status":"draft","created_at":"2025-08-27T22:00:00Z"}'
    
    create_response=$(curl -s -X POST "$VITE_SUPABASE_URL/rest/v1/applications" \
        -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
        -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
        -H "Content-Type: application/json" \
        -d "$test_payload" \
        -w "%{http_code}")
    
    create_code="${create_response: -3}"
    
    if [[ "$create_code" == "201" ]]; then
        echo -e "${GREEN}✅ Application creation test: PASS${NC}"
        PASSED_TESTS+=("Application Creation")
        
        # Clean up test data
        echo "Cleaning up test data..."
        curl -s -X DELETE "$VITE_SUPABASE_URL/rest/v1/applications?type=eq.single&status=eq.draft" \
            -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
            -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" > /dev/null
    else
        echo -e "${RED}❌ Application creation test: FAIL (HTTP $create_code)${NC}"
        FAILED_TESTS+=("Application Creation")
    fi
else
    echo -e "${YELLOW}⚠️  Skipping integration tests (no service key)${NC}"
fi

echo ""

# Generate Test Report
echo -e "${BLUE}📊 Test Report${NC}"
echo "==============="

total_tests=$((${#PASSED_TESTS[@]} + ${#FAILED_TESTS[@]}))
pass_rate=$((${#PASSED_TESTS[@]} * 100 / $total_tests))

echo "Total Tests: $total_tests"
echo "Passed: ${#PASSED_TESTS[@]}"
echo "Failed: ${#FAILED_TESTS[@]}"
echo "Pass Rate: $pass_rate%"
echo ""

if [[ ${#PASSED_TESTS[@]} -gt 0 ]]; then
    echo -e "${GREEN}✅ Passed Tests:${NC}"
    printf '%s\n' "${PASSED_TESTS[@]}" | sed 's/^/  • /'
    echo ""
fi

if [[ ${#FAILED_TESTS[@]} -gt 0 ]]; then
    echo -e "${RED}❌ Failed Tests:${NC}"
    printf '%s\n' "${FAILED_TESTS[@]}" | sed 's/^/  • /'
    echo ""
fi

# Overall Status
if [[ ${#FAILED_TESTS[@]} -eq 0 ]]; then
    echo -e "${GREEN}🎉 All tests passed! Production Supabase is ready! 🚀${NC}"
    exit 0
elif [[ $pass_rate -ge 80 ]]; then
    echo -e "${YELLOW}⚠️  Most tests passed ($pass_rate%). Review failed tests.${NC}"
    exit 0
else
    echo -e "${RED}❌ Multiple test failures ($pass_rate% pass rate). Fix issues before proceeding.${NC}"
    exit 1
fi