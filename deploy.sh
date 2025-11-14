#!/bin/bash

# LocalStyle Deployment Script
# This script helps deploy the project to GitHub

echo "🚀 Starting LocalStyle deployment to GitHub..."

# Check if git is installed
if ! command -v git &> /dev/null
then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Initialize git repository if not already initialized
if [ ! -d ".git" ]; then
    echo "🔧 Initializing git repository..."
    git init
else
    echo "✅ Git repository already initialized"
fi

# Check if remote origin is already set
if git remote get-url origin &> /dev/null; then
    echo "✅ Remote origin already set"
    echo "Current remote: $(git remote get-url origin)"
else
    echo "🔗 Setting remote origin to GitHub repository..."
    git remote add origin https://github.com/YazanKsibeh/Brands.git
fi

# Add all files
echo "📦 Adding all files to git..."
git add .

# Check if there are changes to commit
if ! git diff-index --quiet HEAD --; then
    echo "📝 Committing changes..."
    git commit -m "Deploy LocalStyle Brand Management Dashboard"
else
    echo "✅ No changes to commit"
fi

# Set main branch and push
echo "📤 Pushing to GitHub..."
git branch -M main
git push -u origin main

echo "✅ Deployment complete! Your project has been pushed to GitHub."
echo "🔗 Repository URL: https://github.com/YazanKsibeh/Brands"