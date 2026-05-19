const { google } = require('googleapis');
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Load environment variables from .env.local
const envPath = path.join(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
} else {
  console.error('\x1b[31mError: .env.local file not found at the project root!\x1b[0m');
  process.exit(1);
}

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000';

if (!clientId || !clientSecret) {
  console.log('\n\x1b[31m[Error] Missing Google Credentials in .env.local!\x1b[0m');
  console.log('Please make sure these variables are filled in your .env.local file:');
  console.log('  GOOGLE_CLIENT_ID=...');
  console.log('  GOOGLE_CLIENT_SECRET=...\n');
  process.exit(1);
}

// Extract port from redirect URI (default to 3000 if http://localhost:3000 or http://localhost)
let port = 3000;
try {
  const parsedUri = new url.URL(redirectUri);
  port = parsedUri.port ? parseInt(parsedUri.port, 10) : (parsedUri.protocol === 'https:' ? 443 : 80);
} catch (e) {
  console.warn('\x1b[33mWarning: Could not parse process.env.GOOGLE_REDIRECT_URI, defaulting to port 3000\x1b[0m');
}

const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

// Generate OAuth URL
const scopes = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events'
];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  prompt: 'consent', // Forces Google to provide a refresh token every time
  scope: scopes
});

console.log('\x1b[36m========================================================\x1b[0m');
console.log('\x1b[1m🔮 GOOGLE REFRESH TOKEN GENERATOR 🔮\x1b[0m');
console.log('\x1b[36m========================================================\x1b[0m');
console.log('\nWe will help you obtain your GOOGLE_REFRESH_TOKEN.\n');

function updateEnvFile(refreshToken) {
  try {
    let envContent = fs.readFileSync(envPath, 'utf8');
    const tokenRegex = /^GOOGLE_REFRESH_TOKEN=.*$/m;

    if (tokenRegex.test(envContent)) {
      envContent = envContent.replace(tokenRegex, `GOOGLE_REFRESH_TOKEN=${refreshToken}`);
    } else {
      // Append if it doesn't exist
      envContent += `\nGOOGLE_REFRESH_TOKEN=${refreshToken}`;
    }

    fs.writeFileSync(envPath, envContent, 'utf8');
    console.log('\n\x1b[32m✅ Successfully saved the Refresh Token directly into your .env.local file!\x1b[0m');
  } catch (err) {
    console.error('\n\x1b[31m❌ Could not automatically write to .env.local:\x1b[0m', err.message);
    console.log('\nPlease copy the token manually and paste it into your .env.local file:');
    console.log(`GOOGLE_REFRESH_TOKEN=${refreshToken}`);
  }
}

async function exchangeCodeForTokens(code) {
  try {
    console.log('\nExchanging authorization code for tokens...');
    const { tokens } = await oauth2Client.getToken(code);
    
    if (!tokens.refresh_token) {
      console.log('\n\x1b[31m🚨 Warning: No Refresh Token was returned by Google!\x1b[0m');
      console.log('This usually happens if you already authorized this application before.');
      console.log('To fix this, go to your Google Account Security Settings, remove access for your app, and run this script again.');
      console.log('Alternatively, you can use the access token (expires soon) or reset prompt=consent.');
      if (tokens.access_token) {
        console.log('\nAccess Token received successfully.');
      }
    } else {
      console.log('\n\x1b[32m🎉 Success! Refresh Token Received!\x1b[0m');
      console.log('\x1b[35m' + tokens.refresh_token + '\x1b[0m');
      updateEnvFile(tokens.refresh_token);
    }
  } catch (err) {
    console.error('\n\x1b[31m❌ Error exchanging code for tokens:\x1b[0m', err.message);
  }
  process.exit(0);
}

// Setup a fallback input reader in case server port is blocked
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function promptManualInput() {
  console.log('\n\x1b[33m💡 Manual Flow:\x1b[0m');
  console.log('1. Open the following URL in your browser:');
  console.log(`\n\x1b[4m\x1b[34m${authUrl}\x1b[0m\n`);
  console.log('2. Sign in with your Google Account and approve the permissions.');
  console.log('3. Your browser will redirect to a page that may not load (e.g. http://localhost:3000/?code=...)');
  console.log('4. Copy the entire redirect URL (or just the "code" query parameter) from the browser address bar.');
  
  rl.question('\n👉 Paste the redirect URL or authorization code here: ', (input) => {
    rl.close();
    let code = input.trim();
    if (code.includes('code=')) {
      try {
        const parsed = url.parse(code, true);
        code = parsed.query.code;
      } catch (e) {
        // use original
      }
    }
    
    if (!code) {
      console.log('\x1b[31mInvalid code input. Exiting.\x1b[0m');
      process.exit(1);
    }
    exchangeCodeForTokens(code);
  });
}

// Attempt to start a temporary server to automate the redirect capture
const server = http.createServer(async (req, res) => {
  const reqUrl = url.parse(req.url, true);
  if (reqUrl.pathname === '/') {
    const code = reqUrl.query.code;
    if (code) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`
        <html>
          <body style="font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background-color: #0f172a; color: #f8fafc; margin: 0;">
            <div style="text-align: center; max-width: 500px; padding: 2rem; border-radius: 1rem; background-color: #1e293b; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);">
              <span style="font-size: 4rem;">⚡</span>
              <h1 style="color: #10b981; margin-top: 1rem; margin-bottom: 0.5rem;">Authentication Successful!</h1>
              <p style="color: #94a3b8; font-size: 1.1rem; line-height: 1.5;">You can close this tab now and return to your terminal. The script is saving your refresh token.</p>
            </div>
          </body>
        </html>
      `);
      server.close();
      await exchangeCodeForTokens(code);
    } else {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Authorization code missing in request.');
    }
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`\x1b[33m[Notice] Port ${port} is currently in use (perhaps by Next.js or another service).\x1b[0m`);
    console.log('No problem! We will proceed with the manual flow.');
    promptManualInput();
  } else {
    console.error('Server error:', err.message);
    promptManualInput();
  }
});

server.listen(port, () => {
  console.log(`\x1b[32m🚀 Temporary authorization listener started successfully on port ${port}!\x1b[0m`);
  console.log('\n👉 Please open the following URL in your browser to authorize access:');
  console.log(`\n\x1b[4m\x1b[34m${authUrl}\x1b[0m\n`);
  console.log('Once you approve the permissions, this script will capture the token automatically!\n');
  console.log('(Alternatively, press Ctrl+C to cancel and use manual configuration)');
});
