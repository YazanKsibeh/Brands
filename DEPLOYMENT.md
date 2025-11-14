# Deployment Instructions

## Push to GitHub

Follow these steps to push your project to GitHub:

1. Open your terminal/command prompt in the project directory
2. Initialize git repository:
   ```bash
   git init
   ```

3. Add all files:
   ```bash
   git add .
   ```

4. Commit the changes:
   ```bash
   git commit -m "Initial commit: LocalStyle Brand Management Dashboard"
   ```

5. Add your GitHub repository as remote:
   ```bash
   git remote add origin https://github.com/YazanKsibeh/Brands.git
   ```

6. Push to GitHub:
   ```bash
   git branch -M main
   git push -u origin main
   ```

## Notes
- The .gitignore file ensures node_modules and other unnecessary files are not pushed
- Make sure you have git installed on your system
- If you encounter any authentication issues, you might need to use GitHub CLI or set up SSH keys