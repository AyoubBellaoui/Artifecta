export function normalizeKey(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

export function cleanPhone(value = '') {
  return String(value).replace(/[\s.()-]/g, '');
}

export function budgetText(quote, t, formatNumber) {
  const min = Number(quote.budget_min) || 0;
  const max = Number(quote.budget_max) || 0;
  if (min && max) return t('artisanDash.budgetRange', { min: formatNumber(min), max: formatNumber(max) });
  if (min) return t('artisanDash.budgetFrom', { min: formatNumber(min) });
  if (max) return t('artisanDash.budgetUpTo', { max: formatNumber(max) });
  return '';
}

export function planKey(plan) {
  const code = normalizeKey(plan?.code || plan?.plan_code);
  if (code === 'free' || code === 'pro' || code === 'premium') return code;
  const name = normalizeKey(plan?.name || plan?.plan_name);
  if (name === 'pro') return 'pro';
  if (name === 'premium') return 'premium';
  if (name === 'gratuit' || name === 'free' || Number(plan?.price) === 0) return 'free';
  return null;
}

export function planName(plan, t) {
  const key = planKey(plan);
  return key ? t(`plans.${key}.name`) : plan?.name || plan?.plan_name || '';
}

// Supabase Auth reports failures with a code.
const AUTH_CODES = {
  invalid_credentials: 'errors.invalidCredentials',
  email_not_confirmed: 'errors.emailNotConfirmed',
  user_already_exists: 'errors.emailTaken',
  email_exists: 'errors.emailTaken',
  weak_password: 'errors.weakPassword',
  over_email_send_rate_limit: 'errors.rateLimit',
  over_request_rate_limit: 'errors.rateLimit',
  signup_disabled: 'errors.signupDisabled',
  email_address_invalid: 'auth.emailInvalid',
  validation_failed: 'errors.invalidData',
};

// The SQL functions raise these short identifiers instead of a language-specific sentence.
const DATABASE_MESSAGES = {
  artisan_category_required: 'errors.categoryRequired',
  quote_not_available: 'errors.quoteNotAvailable',
  response_too_short: 'errors.responseTooShort',
  invalid_decision: 'errors.invalidData',
  invalid_price: 'errors.invalidData',
  account_disabled: 'errors.accountDisabled',
  artisans_only: 'errors.forbidden',
  forbidden: 'errors.forbidden',
  cannot_target_self: 'errors.cannotTargetSelf',
  plan_not_found: 'errors.generic',
  user_not_found: 'errors.generic',
};

export function errorMessage(error, t, fallbackKey = 'errors.generic') {
  if (!error) return t(fallbackKey);
  const message = String(error.message || '');

  if (error.code === 'not_configured') return t('errors.notConfigured');
  if (error.code && AUTH_CODES[error.code]) return t(AUTH_CODES[error.code]);
  if (/invalid login credentials/i.test(message)) return t('errors.invalidCredentials');
  if (/already registered/i.test(message)) return t('errors.emailTaken');

  const databaseKey = Object.keys(DATABASE_MESSAGES).find((key) => message.includes(key));
  if (databaseKey) return t(DATABASE_MESSAGES[databaseKey]);

  if (error.code === '23505') return t('errors.alreadyReviewed');
  if (error.code === '23514') return t('errors.invalidData');
  if (error.code === '42501' || /row-level security/i.test(message)) return t('errors.forbidden');
  if (error.code === 'PGRST205' || /schema cache/i.test(message)) return t('errors.databaseNotReady');
  if (error.name === 'AuthRetryableFetchError' || /failed to fetch|network|fetch failed/i.test(message)) {
    return t('errors.network');
  }
  if (/payload too large|exceeded the maximum allowed size/i.test(message)) return t('errors.fileTooLarge');
  if (/mime type/i.test(message)) return t('errors.fileType');

  return t(fallbackKey);
}
