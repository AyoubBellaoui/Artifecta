// POST /api/contact — the Artifecta contact form.
// On Vercel this runs as a serverless function: there is no server to start, and no
// file to write to, so the message is simply e-mailed through Resend.
// Required environment variables: RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL.

const GENERIC_ERROR = 'Une erreur est survenue lors de l’envoi de votre message. Veuillez réessayer.';

function parseBody(body) {
  if (!body) return {};
  if (typeof body !== 'string') return body;
  try {
    return JSON.parse(body);
  } catch {
    return {};
  }
}

function validate(submission) {
  const errors = [];
  if (!submission.name?.trim()) errors.push('Le nom est requis.');
  if (!submission.email?.trim()) errors.push('L’adresse e-mail est requise.');
  if (!submission.projectType?.trim()) errors.push('Le type de projet est requis.');
  if (!submission.message?.trim()) errors.push('Le message est requis.');
  return errors;
}

// The message is written by a visitor, so it must not be trusted inside the e-mail HTML.
function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (character) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]
  ));
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Méthode non autorisée.' });
  }

  const body = parseBody(request.body);
  const errors = validate(body);
  if (errors.length > 0) {
    return response.status(400).json({ error: errors[0] });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    console.error('Contact form: RESEND_API_KEY, CONTACT_TO_EMAIL or CONTACT_FROM_EMAIL is missing.');
    return response.status(500).json({ error: GENERIC_ERROR });
  }

  const submission = {
    name: body.name.trim(),
    email: body.email.trim(),
    projectType: body.projectType.trim(),
    message: body.message.trim(),
    receivedAt: new Date().toISOString(),
  };

  const html = `
    <h2>Nouveau message via le formulaire de contact</h2>
    <p><strong>Nom :</strong> ${escapeHtml(submission.name)}</p>
    <p><strong>E-mail :</strong> ${escapeHtml(submission.email)}</p>
    <p><strong>Type de projet :</strong> ${escapeHtml(submission.projectType)}</p>
    <p><strong>Message :</strong></p>
    <p>${escapeHtml(submission.message).replace(/\n/g, '<br />')}</p>
    <hr />
    <p><strong>Reçu le :</strong> ${submission.receivedAt}</p>
  `;

  const text = [
    'Nouveau message via le formulaire de contact',
    `Nom : ${submission.name}`,
    `E-mail : ${submission.email}`,
    `Type de projet : ${submission.projectType}`,
    'Message :',
    submission.message,
    `Reçu le : ${submission.receivedAt}`,
  ].join('\n');

  try {
    const result = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `Nouveau message de ${submission.name} via le site`,
        html,
        text,
        reply_to: submission.email,
      }),
    });

    const payload = await result.json().catch(() => ({}));
    if (!result.ok) {
      throw new Error(payload.message || payload.error || 'Resend refused the message.');
    }

    return response.status(200).json({ message: 'Merci, votre message a bien été envoyé.' });
  } catch (error) {
    // Details stay in the Vercel logs; the visitor sees a plain message.
    console.error('Contact form failed:', error);
    return response.status(500).json({ error: GENERIC_ERROR });
  }
}
