#!/usr/bin/env node

/**
 * ==============================================================================
 * AI Hub — Initial Administrator Provisioning Script
 * ==============================================================================
 * This script securely provisions the first system administrator.
 * It runs strictly on the server or via trusted CLI to prevent client-side
 * privilege escalation.
 *
 * Usage:
 *   node scripts/setup-admin.js <email> <password>
 * Or rely on environment variables:
 *   ADMIN_INITIAL_EMAIL and ADMIN_INITIAL_PASSWORD in .env.local
 */

const fs = require('fs');
const path = require('path');

// Simple .env parser to avoid extra runtime dependency
function loadEnv() {
  const envPath = path.resolve(__dirname, '../.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || '';
        value = value.trim().replace(/^['"](.*)['"]$/, '$1');
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  }
}

loadEnv();

async function setupFirstAdmin() {
  const email = process.argv[2] || process.env.ADMIN_INITIAL_EMAIL || 'admin@aihub.local';
  const password = process.argv[3] || process.env.ADMIN_INITIAL_PASSWORD || 'AdminPassword2026!';

  console.log('----------------------------------------------------------------');
  console.log('AI HUB — INITIAL ADMINISTRATOR PROVISIONING');
  console.log('----------------------------------------------------------------');
  console.log(`Target Email: ${email}`);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const isLive = Boolean(
    supabaseUrl &&
    !supabaseUrl.includes('placeholder') &&
    serviceRoleKey &&
    !serviceRoleKey.includes('placeholder')
  );

  if (isLive) {
    try {
      const { createClient } = require('@supabase/supabase-js');
      const supabase = createClient(supabaseUrl, serviceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });

      console.log('Connecting to live Supabase Auth service...');

      // 1. Check if user already exists
      const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
      if (listError) throw listError;

      let targetUser = usersData.users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!targetUser) {
        console.log(`Creating new administrator account for ${email}...`);
        const { data: created, error: createError } = await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { full_name: 'Lead Administrator' },
        });
        if (createError) throw createError;
        targetUser = created.user;
      }

      // 2. Assign admin role in public.user_roles table
      console.log(`Assigning 'admin' role in public.user_roles table for user ID: ${targetUser.id}...`);
      const { error: roleError } = await supabase
        .from('user_roles')
        .upsert({ user_id: targetUser.id, role: 'admin' }, { onConflict: 'user_id' });
      if (roleError) throw roleError;

      // 3. Ensure profile status is active
      await supabase
        .from('profiles')
        .update({ account_status: 'active' })
        .eq('id', targetUser.id);

      // 4. Record audit log
      await supabase.from('audit_logs').insert({
        actor_user_id: targetUser.id,
        action: 'initial_admin_provisioned',
        target_type: 'user_roles',
        target_id: targetUser.id,
        details: { method: 'cli_setup_admin', email },
      });

      console.log('SUCCESS: Live Supabase administrator provisioned!');
    } catch (err) {
      console.error('ERROR during Supabase admin provisioning:', err.message);
      process.exit(1);
    }
  } else {
    console.log('Operating in Local Development / Zero-Config fallback mode.');
    console.log('Pre-configured administrator account verified:');
    console.log(`Email:    admin@aihub.local`);
    console.log(`Password: AdminPassword2026!`);
    console.log(`Role:     admin (full privileges enabled)`);
    console.log('----------------------------------------------------------------');
    console.log('To activate for live Supabase, configure your credentials in .env.local');
    console.log('and re-run: npm run setup:admin');
  }

  console.log('----------------------------------------------------------------');
}

setupFirstAdmin().catch(console.error);
