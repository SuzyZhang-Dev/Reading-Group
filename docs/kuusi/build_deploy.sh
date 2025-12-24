#!/bin/bash

# 1. Restore dev environment (point index.html to source)
cp index.dev.html index.html

# 2. Run Vite build
npm run build

# 3. Deploy artifacts
# Copy the built html to the root index.html
cp dist/index.html index.html
# Clean old assets and copy new ones
rm -rf assets
cp -r dist/assets assets

echo "Build and Deployment Complete! 🎄"
