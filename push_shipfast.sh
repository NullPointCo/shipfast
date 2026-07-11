#!/bin/bash
TOKEN=*** ~/.env_nullpointco | grep GITHUB_TOKEN | cut -d= -f2)

# Create repo via API
curl -s -X POST "https://api.github.com/user/repos" \
  -H "Authorization: token $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"shipfast","description":"SaaS boilerplate generator - FastAPI + Stripe + Docker","has_issues":true}' > /dev/null

# Push
cd /home/hugo/workspace/products/shipfast
git init 2>/dev/null
git checkout -b main 2>/dev/null
git add -A
git commit -m "shipfast v1.0.0" 2>/dev/null
git remote add origin "https://oauth2:***@github.com/NullPointCo/shipfast.git"
git push -u origin main 2>&1
