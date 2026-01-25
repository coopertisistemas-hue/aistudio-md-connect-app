# Supabase Credential Rotation Checklist

**Date:** January 25, 2026  
**Project:** MD Connect App  
**Supabase Project ID:** `drjfqugmdimvqjticsqu`

---

## ✅ Completed Steps

- [x] `.env` file removed from Git history (all 133 commits rewritten)
- [x] Git history force-pushed to remote repository
- [x] Pre-commit hooks installed to prevent future `.env` commits
- [x] Supabase ANON key rotated (confirmed by user)

---

## 🔐 Credential Rotation - Verification Steps

### 1. Verify New Credentials in Supabase Dashboard

**Action:** Confirm new ANON key is active

1. Go to: https://supabase.com/dashboard/project/drjfqugmdimvqjticsqu
2. Navigate to: **Settings → API**
3. Verify:
   - [ ] New `anon` (public) key is displayed
   - [ ] Key was rotated on: _________________ (date/time)
   - [ ] Old key is no longer listed/valid

**Expected Result:** New ANON key visible, old key invalidated

---

### 2. Update Local Development Environment

**Action:** Update `.env` file with new credentials

```bash
# File: .env (local only - NOT committed)

VITE_SUPABASE_URL=https://drjfqugmdimvqjticsqu.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci... # NEW KEY HERE
```

**Verification:**
- [ ] `.env` file updated with new ANON key
- [ ] `.env` file is NOT staged for commit
- [ ] Pre-commit hook blocks if accidentally staged

---

### 3. Update Hosting Platform Environment Variables

**Action:** Update production environment variables

Choose your hosting platform:

#### Option A: Vercel

```bash
# Install Vercel CLI if needed
npm i -g vercel

# Update environment variables
vercel env rm VITE_SUPABASE_ANON_KEY production
vercel env add VITE_SUPABASE_ANON_KEY production
# Paste new key when prompted

# Verify
vercel env ls
```

**Or via Dashboard:**
1. Go to: https://vercel.com/[your-team]/aistudio-md-connect-app
2. Navigate to: **Settings → Environment Variables**
3. Find: `VITE_SUPABASE_ANON_KEY`
4. Click **Edit** → Enter new value → **Save**
5. **Redeploy** the application

#### Option B: Netlify

**Via Dashboard:**
1. Go to: https://app.netlify.com/sites/[your-site]/settings
2. Navigate to: **Build & deploy → Environment**
3. Find: `VITE_SUPABASE_ANON_KEY`
4. Click **Edit** → Enter new value → **Save**
5. **Trigger new deploy**

**Via CLI:**
```bash
# Install Netlify CLI if needed
npm i -g netlify-cli

# Update environment variable
netlify env:set VITE_SUPABASE_ANON_KEY "your-new-key-here"

# Trigger deploy
netlify deploy --prod
```

#### Option C: Other Platforms

Update environment variables according to your platform's documentation:
- AWS Amplify: Console → App Settings → Environment Variables
- Railway: Project → Variables → Edit
- Render: Dashboard → Environment → Add Variable

**Verification:**
- [ ] Production environment variable updated
- [ ] New deployment triggered with updated credentials
- [ ] Deployment successful

---

### 4. Test Application Functionality

**Action:** Verify application works with new credentials

#### Local Testing:

```bash
# Install dependencies
pnpm install

# Build application
pnpm build

# Run development server
pnpm dev
```

**Test Cases:**
- [ ] Application starts without errors
- [ ] Supabase client initializes successfully
- [ ] Authentication works (login/logout)
- [ ] Database queries execute successfully
- [ ] Edge Functions can be invoked

**Expected Result:** All functionality works with new credentials

#### Production Testing:

1. Visit production URL
2. Test critical paths:
   - [ ] User authentication
   - [ ] Data fetching (Bible, Content, Feed APIs)
   - [ ] Prayer requests (create/read)
   - [ ] No console errors related to authentication

**Expected Result:** Production app fully functional

---

### 5. Verify Old Credentials Are Invalid

**Action:** Confirm old ANON key no longer works

**Test:**
```javascript
// In browser console on production site:
const oldKey = "eyJhbGci..."; // OLD KEY (first few chars only for verification)
const { createClient } = supabase;
const testClient = createClient(
  "https://drjfqugmdimvqjticsqu.supabase.co",
  oldKey
);

// Try to query
const { data, error } = await testClient.from('any_table').select('*').limit(1);
console.log(error); // Should show authentication error
```

**Expected Result:** Old key returns authentication error

**Verification:**
- [ ] Old ANON key rejected by Supabase
- [ ] Error message indicates invalid/expired key

---

### 6. Update Team Members

**Action:** Ensure all team members have new credentials

**Communication:**
- [ ] Team notified via email/Slack about credential rotation
- [ ] `SECURITY_REMEDIATION_NOTICE.md` shared with team
- [ ] New credentials provided to authorized team members only
- [ ] Confirmed all team members re-cloned repository

**Security Notes:**
- Only share new credentials through secure channels (password managers, encrypted messages)
- Do not post credentials in Slack/email/tickets
- Use `.env.example` template for setup instructions

---

### 7. Monitor Supabase Logs

**Action:** Check for suspicious activity after rotation

1. Go to: Supabase Dashboard → **Logs**
2. Review API logs for:
   - [ ] No requests using old ANON key (should be rejected)
   - [ ] All legitimate requests using new ANON key
   - [ ] No unusual authentication failures
   - [ ] No unexpected API usage patterns

**Time Period to Monitor:** 24-48 hours after rotation

---

### 8. Document Rotation in Security Log

**Action:** Record this security incident

**Template:**

```
Date: January 25, 2026
Incident: Accidental .env commit to Git history
Affected Credentials: Supabase ANON key (project: drjfqugmdimvqjticsqu)
Commits Affected: 2 (Dec 16-18, 2025)
Exposure Duration: ~40 days
Actions Taken:
  - Git history rewritten (133 commits)
  - Force-pushed to remote
  - Credentials rotated
  - Team notified
  - Pre-commit hooks installed
Status: Resolved
Impact: Low (ANON key has limited permissions, rotated promptly)
```

**Verification:**
- [ ] Incident documented in security log
- [ ] Lessons learned identified
- [ ] Prevention measures noted

---

## 🛡️ Security Best Practices

### Going Forward:

1. **Never Commit Secrets**
   - Use `.env` for local development only
   - Always check `.gitignore` includes `.env*`
   - Use environment variables on hosting platforms

2. **Pre-commit Hook Active**
   - Installed in: `.git/hooks/pre-commit`
   - Blocks commits containing `.env` files
   - Test: `git add .env` should fail with error

3. **Credential Management**
   - Store production secrets in hosting platform
   - Use password manager for team credential sharing
   - Rotate credentials quarterly or when compromised

4. **Regular Audits**
   - Review `.gitignore` monthly
   - Audit Git history for secrets: `git log -S "ANON_KEY"`
   - Check Supabase logs for anomalies

---

## 📋 Final Verification Checklist

Before marking this incident as closed:

- [ ] New Supabase ANON key confirmed active in dashboard
- [ ] Old ANON key confirmed invalid/revoked
- [ ] Local `.env` updated with new credentials
- [ ] Production environment variables updated
- [ ] Production deployment successful with new credentials
- [ ] Application tested and fully functional
- [ ] Team members notified and re-cloned repository
- [ ] All team members have new credentials
- [ ] Pre-commit hooks installed and tested
- [ ] Security incident documented
- [ ] Git history verified clean (no `.env` files)
- [ ] Supabase logs monitored (no suspicious activity)

---

## 🆘 Rollback Plan (If Issues Arise)

If new credentials cause issues:

1. **DO NOT** revert to old credentials (they are compromised)
2. Generate another new ANON key in Supabase dashboard
3. Update all environments with the newest key
4. Verify functionality again

**Note:** The old credentials are permanently invalid and cannot be restored.

---

## 📞 Support Contacts

- **Supabase Support:** https://supabase.com/support
- **Project Lead:** [Contact info]
- **Security Team:** [Contact info]

---

**Status:** ✅ Credential rotation complete  
**Next Review:** Quarterly (April 25, 2026)  
**Last Updated:** January 25, 2026
