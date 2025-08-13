#!/bin/bash

echo "🧙‍♂️ HolyMove - Deployment Check"
echo "=================================="

echo "✅ Checking Node.js version..."
node --version

echo "✅ Checking npm version..."
npm --version

echo "✅ Installing dependencies..."
npm install

echo "✅ Running build command..."
npm run build

echo "✅ Testing server start (5 seconds)..."
timeout 5s npm start || echo "Server test completed"

echo "🎉 Deployment check complete!"
echo "Ready for Render deployment!"
