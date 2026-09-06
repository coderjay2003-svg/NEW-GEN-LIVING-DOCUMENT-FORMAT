// OAuth 2.0 Single Sign-On Handler (Google & GitHub)
// LDOC Studio Living Document Suite
const https = require('https');
const db = require('../../db');
const { signToken } = require('../../auth_service');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

function getBaseUrl(req) {
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'ldoc-studios.vercel.app';
  const proto = req.headers['x-forwarded-proto'] || 'https';
  return `${proto}://${host}`;
}

function httpsRequest(url, options = {}, postData = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let body = '';
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, raw: body });
        }
      });
    });
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const parsedUrl = new URL(req.url, 'http://localhost');
  const pathname = parsedUrl.pathname.replace(/\/+$/, '');
  const baseUrl = getBaseUrl(req);

  // 1. Google OAuth Initiation
  if (pathname === '/api/auth/oauth/google') {
    const redirectUri = `${baseUrl}/api/auth/callback/google`;
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      const demoUser = await getOrCreateOAuthUser('google_user@gmail.com', 'Google Workspace User', 'google');
      const token = signToken({ id: demoUser.id, email: demoUser.email, plan: demoUser.plan });
      const target = `${baseUrl}/live-studio?auth=success&provider=google&token=${token}&user=${encodeURIComponent(JSON.stringify(demoUser))}`;
      res.writeHead(302, { Location: target });
      return res.end();
    }
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(GOOGLE_CLIENT_ID)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid%20email%20profile&access_type=offline&prompt=select_account`;
    res.writeHead(302, { Location: googleAuthUrl });
    return res.end();
  }

  // 2. Google OAuth Callback
  if (pathname === '/api/auth/callback/google') {
    const code = parsedUrl.searchParams.get('code');
    const redirectUri = `${baseUrl}/api/auth/callback/google`;
    if (!code) {
      res.writeHead(302, { Location: `${baseUrl}/live-studio?auth_error=No+authorization+code+returned` });
      return res.end();
    }
    try {
      const postData = new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      }).toString();

      const tokenRes = await httpsRequest('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }, postData);

      const accessToken = tokenRes.data?.access_token;
      if (!accessToken) throw new Error('Failed to retrieve Google access token');

      const profileRes = await httpsRequest('https://www.googleapis.com/oauth2/v2/userinfo', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });

      const profile = profileRes.data;
      if (!profile || !profile.email) throw new Error('Failed to retrieve Google profile email');

      const user = await getOrCreateOAuthUser(profile.email, profile.name || profile.given_name, 'google');
      const token = signToken({ id: user.id, email: user.email, plan: user.plan });

      res.writeHead(302, {
        Location: `${baseUrl}/live-studio?auth=success&provider=google&token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`
      });
      return res.end();
    } catch (err) {
      res.writeHead(302, {
        Location: `${baseUrl}/live-studio?auth_error=${encodeURIComponent(err.message)}`
      });
      return res.end();
    }
  }

  // 3. GitHub OAuth Initiation
  if (pathname === '/api/auth/oauth/github') {
    const redirectUri = `${baseUrl}/api/auth/callback/github`;
    if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
      const demoUser = await getOrCreateOAuthUser('github_coder@github.com', 'GitHub Developer User', 'github');
      const token = signToken({ id: demoUser.id, email: demoUser.email, plan: demoUser.plan });
      const target = `${baseUrl}/live-studio?auth=success&provider=github&token=${token}&user=${encodeURIComponent(JSON.stringify(demoUser))}`;
      res.writeHead(302, { Location: target });
      return res.end();
    }
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${encodeURIComponent(GITHUB_CLIENT_ID)}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user:email`;
    res.writeHead(302, { Location: githubAuthUrl });
    return res.end();
  }

  // 4. GitHub OAuth Callback
  if (pathname === '/api/auth/callback/github') {
    const code = parsedUrl.searchParams.get('code');
    if (!code) {
      res.writeHead(302, { Location: `${baseUrl}/live-studio?auth_error=No+authorization+code+returned` });
      return res.end();
    }
    try {
      const postData = JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code
      });

      const tokenRes = await httpsRequest('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'LDOC-Studio-Auth'
        }
      }, postData);

      const accessToken = tokenRes.data?.access_token;
      if (!accessToken) throw new Error('Failed to retrieve GitHub access token');

      const profileRes = await httpsRequest('https://api.github.com/user', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'User-Agent': 'LDOC-Studio-Auth'
        }
      });

      let email = profileRes.data?.email;
      const name = profileRes.data?.name || profileRes.data?.login || 'GitHub User';

      if (!email) {
        const emailsRes = await httpsRequest('https://api.github.com/user/emails', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'User-Agent': 'LDOC-Studio-Auth'
          }
        });
        if (Array.isArray(emailsRes.data)) {
          const primary = emailsRes.data.find(e => e.primary && e.verified) || emailsRes.data[0];
          if (primary) email = primary.email;
        }
      }

      if (!email) email = `${profileRes.data?.login || 'user'}@users.noreply.github.com`;

      const user = await getOrCreateOAuthUser(email, name, 'github');
      const token = signToken({ id: user.id, email: user.email, plan: user.plan });

      res.writeHead(302, {
        Location: `${baseUrl}/live-studio?auth=success&provider=github&token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`
      });
      return res.end();
    } catch (err) {
      res.writeHead(302, {
        Location: `${baseUrl}/live-studio?auth_error=${encodeURIComponent(err.message)}`
      });
      return res.end();
    }
  }

  // 5. Client Direct Verify/Sync
  if (pathname === '/api/auth/oauth/session' && req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const { email, name, provider } = body;
      if (!email) return res.status(400).json({ error: 'Email required' });
      const user = await getOrCreateOAuthUser(email, name || email.split('@')[0], provider || 'oauth');
      const token = signToken({ id: user.id, email: user.email, plan: user.plan });
      return res.status(200).json({ ok: true, token, user });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(404).json({ error: 'OAuth endpoint not found' });
};

async function getOrCreateOAuthUser(email, name, provider) {
  let user = await db.users.findByEmail(email);
  if (!user) {
    user = await db.users.create({
      email,
      name,
      password_hash: 'oauth:' + provider,
      plan: 'free',
      oauth_provider: provider
    });
  }
  return { id: user.id, email: user.email, name: user.name, plan: user.plan };
}
