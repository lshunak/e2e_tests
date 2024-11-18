This repository contains a Playwright-based test suite designed for end-to-end testing of web applications

Before you begin, ensure that the following are installed on your local machine:

Node.js: Version 14 or higher. You can download it from Node.js official website. npm: The Node.js package manager (comes with Node.js). Verify installation with:

  node --version 
  npm --version

Steps:

1. Clone the repository to your local machine and change directory to it:
      git clone https://github.com/lshunak/e2e_tests.git
      cd e2e_tests


2 . Install Dependencies:
    
      npm install

3. Install Playwright Browsers, run:

      npx playwright install

4. Run Test:
   
      npx playwright test

Note:
If Playwright asks to install browsers, run:

      npx playwright install --with-deps


Troubleshooting
If you encounter issues during the npm install, refer to these tips:

Clear npm cache:

      npm cache clean --force

Ensure correct Node.js and npm versions:
Verify by running:

      node --version
      npm --version

Permission issues:
Reset npm's default directory:

      sudo chown -R $USER:$GROUP ~/.npm
