const WEB3FORMS_KEY = process.env.WEB3FORMS_KEY || 'ca664321-0dd6-47ae-a872-5f4ca5b81175';

interface EmailData {
  subject: string;
  message: string;
  eventType: 'signup' | 'login' | 'link_created';
  metadata?: Record<string, any>;
}

export async function sendNotificationEmail(data: EmailData): Promise<boolean> {
  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject: `[Link Automator] ${data.subject}`,
        from_name: 'Link Automator',
        message: data.message,
        event_type: data.eventType,
        ...data.metadata
      })
    });

    const result = await response.json();
    console.log('Email notification sent:', result.success);
    return result.success;
  } catch (error) {
    console.error('Failed to send email notification:', error);
    return false;
  }
}

export function formatSignupEmail(user: { email?: string; firstName?: string; lastName?: string; clerkId: string }): EmailData {
  return {
    subject: 'משתמש חדש נרשם!',
    eventType: 'signup',
    message: `
משתמש חדש נרשם ל-Link Automator!

פרטי המשתמש:
- שם: ${user.firstName || ''} ${user.lastName || ''}
- אימייל: ${user.email || 'לא זמין'}
- Clerk ID: ${user.clerkId}
- זמן: ${new Date().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' })}
    `.trim(),
    metadata: {
      user_email: user.email,
      user_name: `${user.firstName || ''} ${user.lastName || ''}`.trim()
    }
  };
}

export function formatLoginEmail(userId: string, userEmail?: string): EmailData {
  return {
    subject: 'משתמש התחבר',
    eventType: 'login',
    message: `
משתמש התחבר ל-Link Automator!

- אימייל: ${userEmail || 'לא זמין'}
- User ID: ${userId}
- זמן: ${new Date().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' })}
    `.trim(),
    metadata: {
      user_email: userEmail
    }
  };
}

export function formatLinkCreatedEmail(link: { shortCode: string; targetUrl: string; title?: string; domain?: string }, userEmail?: string): EmailData {
  const shortUrl = link.domain 
    ? `https://${link.domain}/${link.shortCode}`
    : `https://linkautomator.justintime.co.il/${link.shortCode}`;
  
  return {
    subject: 'לינק חדש נוצר!',
    eventType: 'link_created',
    message: `
לינק חדש נוצר ב-Link Automator!

פרטי הלינק:
- כותרת: ${link.title || 'ללא כותרת'}
- לינק קצר: ${shortUrl}
- יעד: ${link.targetUrl}
- נוצר על ידי: ${userEmail || 'לא זמין'}
- זמן: ${new Date().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' })}
    `.trim(),
    metadata: {
      link_title: link.title,
      short_url: shortUrl,
      target_url: link.targetUrl
    }
  };
}
