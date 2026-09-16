// Every database call the website makes. Security is enforced by Supabase row level
// security and by the SQL functions, never by this file.
import { PORTFOLIO_BUCKET, supabase } from './supabase';

class NotConfiguredError extends Error {
  constructor() {
    super('Supabase is not configured');
    this.code = 'not_configured';
  }
}

function client() {
  if (!supabase) throw new NotConfiguredError();
  return supabase;
}

function unwrap({ data, error }) {
  if (error) throw error;
  return data;
}

export function photoUrl(storagePath) {
  if (!storagePath || !supabase) return '';
  return supabase.storage.from(PORTFOLIO_BUCKET).getPublicUrl(storagePath).data.publicUrl;
}

function withPhotoUrl(photo) {
  return { ...photo, photo_url: photoUrl(photo.storage_path) };
}

/* ---------------------------------------------------------------- public */

export async function fetchCategories() {
  return unwrap(
    await client()
      .from('categories_with_counts')
      .select('id, slug, name_fr, name_ar, artisan_count')
      .order('sort_order'),
  );
}

export async function searchArtisans({
  search = '',
  city = '',
  category = '',
  minRating = '',
  available = '',
  sort = 'rating',
  page = 1,
  limit = 12,
} = {}) {
  const data = unwrap(
    await client().rpc('search_artisans', {
      p_search: search || null,
      p_city: city || null,
      p_category: category || null,
      p_min_rating: minRating ? Number(minRating) : null,
      p_available: available === 'true' ? true : null,
      p_sort: sort,
      p_limit: limit,
      p_offset: Math.max(0, (page - 1) * limit),
    }),
  );
  const total = Number(data?.total) || 0;
  return { artisans: data?.artisans || [], total, pages: Math.max(1, Math.ceil(total / limit)) };
}

export async function fetchArtisan(artisanId) {
  const data = unwrap(await client().rpc('get_artisan_profile', { p_artisan_id: artisanId }));
  if (!data) return null;
  return { ...data, photos: (data.photos || []).map(withPhotoUrl) };
}

export async function recordProfileView(artisanId) {
  if (!supabase) return;
  await supabase.rpc('record_profile_view', { p_artisan_id: artisanId });
}

export async function fetchPlans() {
  return unwrap(
    await client()
      .from('subscription_plans')
      .select('id, code, name, price, duration_days, features')
      .eq('is_active', true)
      .order('sort_order'),
  );
}

/* ------------------------------------------------------------------ auth */

export async function signIn(email, password) {
  const { data, error } = await client().auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signUp({ email, password, ...metadata }) {
  const { data, error } = await client().auth.signUp({ email, password, options: { data: metadata } });
  if (error) throw error;
  return data;
}

export async function signOut() {
  if (supabase) await supabase.auth.signOut();
}

export async function fetchMyProfile() {
  return unwrap(await client().rpc('get_my_profile'));
}

/* --------------------------------------------------------------- profile */

export async function updateMyProfile(userId, { first_name, last_name, city, phone }) {
  unwrap(
    await client()
      .from('profiles')
      .update({ first_name, last_name, city: city || null })
      .eq('id', userId),
  );

  if (phone === undefined) return;
  // Only the phone column may be updated, so upsert is done in two explicit steps.
  const updated = unwrap(
    await client()
      .from('contact_details')
      .update({ phone: phone || null })
      .eq('user_id', userId)
      .select('user_id'),
  );
  if (!updated?.length) {
    unwrap(await client().from('contact_details').insert({ user_id: userId, phone: phone || null }).select('user_id'));
  }
}

export async function updateArtisanProfile(userId, values) {
  unwrap(await client().from('artisan_profiles').update(values).eq('user_id', userId));
}

/* ---------------------------------------------------------------- quotes */

export async function createQuote({ artisanId, clientId, description, city, budgetMin, budgetMax }) {
  return unwrap(
    await client()
      .from('quotes')
      .insert({
        artisan_id: artisanId,
        client_id: clientId,
        description,
        city: city || null,
        budget_min: budgetMin ?? null,
        budget_max: budgetMax ?? null,
      })
      .select('id')
      .single(),
  );
}

export async function fetchMyQuotes(clientId) {
  return unwrap(
    await client().from('quote_details').select('*').eq('client_id', clientId).order('created_at', { ascending: false }),
  );
}

export async function fetchInbox(artisanId) {
  const quotes = unwrap(
    await client().from('quote_details').select('*').eq('artisan_id', artisanId).order('created_at', { ascending: false }),
  );
  // Read like a mailbox: the rows above keep their "new" badge, the next visit shows them as read.
  await client().rpc('mark_quotes_viewed');
  return quotes;
}

export async function respondToQuote(quoteId, { response, price, decision = 'responded' }) {
  return unwrap(
    await client().rpc('respond_to_quote', {
      p_quote_id: quoteId,
      p_response: response,
      p_price: price === '' || price === undefined ? null : Number(price),
      p_decision: decision,
    }),
  );
}

export async function acceptQuote(quoteId) {
  return unwrap(await client().rpc('accept_quote', { p_quote_id: quoteId }));
}

export async function completeQuote(quoteId) {
  return unwrap(await client().rpc('complete_quote', { p_quote_id: quoteId }));
}

/* --------------------------------------------------------------- reviews */

export async function canReviewArtisan(artisanId) {
  if (!supabase) return false;
  const { data, error } = await supabase.rpc('can_review_artisan', { p_artisan_id: artisanId });
  if (error) return false;
  return Boolean(data);
}

export async function createReview({ artisanId, clientId, rating, comment }) {
  return unwrap(
    await client()
      .from('reviews')
      .insert({ artisan_id: artisanId, client_id: clientId, rating, comment: comment || null })
      .select('id')
      .single(),
  );
}

/* ---------------------------------------------------------------- photos */

export async function fetchMyPhotos(artisanId) {
  const photos = unwrap(
    await client()
      .from('portfolio_photos')
      .select('id, storage_path, caption, created_at')
      .eq('artisan_id', artisanId)
      .order('created_at', { ascending: false }),
  );
  return photos.map(withPhotoUrl);
}

export async function uploadPortfolioPhoto(artisanId, file) {
  const extension = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
  const storagePath = `${artisanId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;

  const { error: uploadError } = await client()
    .storage.from(PORTFOLIO_BUCKET)
    .upload(storagePath, file, { contentType: file.type, upsert: false });
  if (uploadError) throw uploadError;

  try {
    const photo = unwrap(
      await client()
        .from('portfolio_photos')
        .insert({ artisan_id: artisanId, storage_path: storagePath })
        .select('id, storage_path, caption, created_at')
        .single(),
    );
    return withPhotoUrl(photo);
  } catch (error) {
    // Never leave a file behind without its database row.
    await client().storage.from(PORTFOLIO_BUCKET).remove([storagePath]);
    throw error;
  }
}

export async function deletePortfolioPhoto(photo) {
  unwrap(await client().from('portfolio_photos').delete().eq('id', photo.id));
  if (photo.storage_path) {
    await client().storage.from(PORTFOLIO_BUCKET).remove([photo.storage_path]);
  }
}

/* --------------------------------------------------------- subscriptions */

export async function subscribeToPlan(planId) {
  return unwrap(await client().rpc('subscribe_to_plan', { p_plan_id: planId }));
}

/* ----------------------------------------------------------------- admin */

export async function adminStats() {
  return unwrap(await client().rpc('admin_stats'));
}

export async function adminListUsers({ role = '', search = '' } = {}) {
  return unwrap(await client().rpc('admin_list_users', { p_role: role || null, p_search: search || null }));
}

export async function adminSetUserActive(userId, isActive) {
  return unwrap(await client().rpc('admin_set_user_active', { p_user_id: userId, p_active: isActive }));
}

export async function adminVerifyArtisan(userId) {
  return unwrap(await client().rpc('admin_verify_artisan', { p_user_id: userId }));
}

export async function adminFetchReviews() {
  return unwrap(await client().from('review_details').select('*').order('created_at', { ascending: false }).limit(50));
}

export async function adminDeleteReview(reviewId) {
  unwrap(await client().from('reviews').delete().eq('id', reviewId));
}

export async function adminFetchQuotes() {
  return unwrap(await client().from('quote_details').select('*').order('created_at', { ascending: false }).limit(50));
}
