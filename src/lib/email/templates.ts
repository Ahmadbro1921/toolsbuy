export function getWelcomeEmailHtml(name: string, appUrl: string): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #0f172a; color: #f8fafc; border-radius: 12px; border: 1px solid #1e293b;">
      <div style="margin-bottom: 24px; text-align: center;">
        <span style="display: inline-block; padding: 8px 16px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 9999px; font-weight: bold; font-size: 16px; color: white;">AI Hub</span>
      </div>
      <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 16px; color: #ffffff;">Welcome to AI Hub, ${name}!</h1>
      <p style="font-size: 16px; line-height: 1.6; color: #94a3b8; margin-bottom: 24px;">
        You've joined the premier directory of curated and verified artificial intelligence tools. Start discovering, saving your favorites, and tracking the latest models shaping technology.
      </p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${appUrl}/tools" style="background: #6366f1; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; display: inline-block;">Explore AI Tools</a>
      </div>
      <p style="font-size: 14px; color: #64748b; border-top: 1px solid #1e293b; padding-top: 20px; text-align: center;">
        © ${new Date().getFullYear()} AI Hub Inc. All rights reserved.
      </p>
    </div>
  `;
}

export function getActivationRequestAdminEmailHtml(userName: string, userEmail: string, adminUrl: string): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #0f172a; color: #f8fafc; border-radius: 12px; border: 1px solid #1e293b;">
      <h2 style="font-size: 20px; font-weight: 700; color: #f59e0b; margin-bottom: 12px;">Pending Account Activation Request</h2>
      <p style="color: #94a3b8; line-height: 1.5;">A new user requires administrator approval before their account is activated:</p>
      <ul style="background: #1e293b; padding: 16px 24px; border-radius: 8px; list-style: none; margin: 20px 0; color: #e2e8f0;">
        <li><strong>Name:</strong> ${userName}</li>
        <li><strong>Email:</strong> ${userEmail}</li>
        <li><strong>Submitted:</strong> ${new Date().toLocaleString()}</li>
      </ul>
      <div style="text-align: center; margin: 24px 0;">
        <a href="${adminUrl}/admin/users" style="background: #3b82f6; color: white; padding: 10px 24px; border-radius: 6px; text-decoration: none; font-weight: 600;">Review in Admin Panel</a>
      </div>
    </div>
  `;
}

export function getAccountApprovedEmailHtml(name: string, loginUrl: string): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #0f172a; color: #f8fafc; border-radius: 12px; border: 1px solid #1e293b;">
      <h2 style="font-size: 22px; font-weight: 700; color: #10b981; margin-bottom: 12px;">Account Approved!</h2>
      <p style="color: #94a3b8; line-height: 1.6;">Hello ${name}, your AI Hub account has been reviewed and approved by our team. You now have full access to personalized bookmarks, history, and community features.</p>
      <div style="text-align: center; margin: 28px 0;">
        <a href="${loginUrl}/dashboard" style="background: #10b981; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600;">Go to Dashboard</a>
      </div>
    </div>
  `;
}

export function getAccountSuspendedEmailHtml(name: string, reason?: string): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #0f172a; color: #f8fafc; border-radius: 12px; border: 1px solid #1e293b;">
      <h2 style="font-size: 22px; font-weight: 700; color: #ef4444; margin-bottom: 12px;">Account Status Notification</h2>
      <p style="color: #94a3b8; line-height: 1.6;">Hello ${name}, your AI Hub account access has been temporarily suspended.</p>
      ${reason ? `<div style="background: #1e293b; padding: 12px 16px; border-radius: 6px; margin: 16px 0; color: #fca5a5;">Reason: ${reason}</div>` : ""}
      <p style="color: #64748b; font-size: 14px;">If you believe this was done in error, please contact support.</p>
    </div>
  `;
}
