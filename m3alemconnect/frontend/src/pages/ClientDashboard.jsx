import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { acceptQuote, completeQuote, fetchMyQuotes } from '../services/data';
import { useAuth } from '../contexts/AuthContext';
import { useI18n } from '../i18n/I18nProvider';
import { budgetText, errorMessage } from '../i18n/helpers';
import Avatar from '../components/Avatar';
import Icon from '../components/Icon';
import { EmptyState, ListSkeleton, PageHeader, StatCard, StatusBadge } from '../components/ui';

function ClientQuote({ quote, onAccept, onComplete }) {
  const { t, formatDate, formatNumber, formatPrice, categoryName, cityName } = useI18n();
  const budget = budgetText(quote, t, formatNumber);
  const trade = categoryName({ slug: quote.category_slug, name_fr: quote.category_name_fr });

  return (
    <li className="card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar size="sm" firstName={quote.artisan_first_name} lastName={quote.artisan_last_name} src={quote.artisan_avatar_url} />
          <div>
            <p className="text-sm font-semibold text-navy-900">
              <bdi>{quote.artisan_first_name} {quote.artisan_last_name}</bdi>
            </p>
            <p className="text-xs text-sand-600">
              {[trade, t('client.sentOn', { date: formatDate(quote.created_at) })].filter(Boolean).join(' · ')}
            </p>
          </div>
        </div>
        <StatusBadge status={quote.status} />
      </div>

      <p dir="auto" className="mt-4 whitespace-pre-line text-sm leading-relaxed text-sand-700">{quote.description}</p>

      {(budget || quote.city) && (
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
          {quote.city && (
            <span className="inline-flex items-center gap-1.5 text-sand-600">
              <Icon name="mapPin" className="h-4 w-4" />
              {cityName(quote.city)}
            </span>
          )}
          {budget && (
            <span className="inline-flex items-center gap-1.5">
              <span className="text-sand-600">{t('client.budget')}</span>
              <span className="font-medium text-navy-900">{budget}</span>
            </span>
          )}
        </div>
      )}

      {quote.artisan_response && (
        <div className="mt-4 rounded-md border-s-2 border-emerald-500 bg-emerald-50/60 px-4 py-3">
          <p className="text-xs font-semibold text-emerald-800">{t('client.reply')}</p>
          <p dir="auto" className="mt-1 whitespace-pre-line text-sm text-navy-900">{quote.artisan_response}</p>
          {quote.artisan_price && (
            <p className="mt-2 flex flex-wrap items-baseline gap-2 text-sm">
              <span className="text-sand-600">{t('client.proposedPrice')}</span>
              <span className="font-semibold text-navy-900">{formatPrice(quote.artisan_price)}</span>
            </p>
          )}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-end gap-2 border-t border-sand-200 pt-4">
        <Link to={`/artisans/${quote.artisan_id}`} className="btn btn-secondary btn-sm">{t('client.viewProfile')}</Link>
        {quote.status === 'responded' && (
          <button type="button" onClick={() => onAccept(quote.id)} className="btn btn-primary btn-sm">
            <Icon name="check" className="h-4 w-4" />
            {t('client.acceptQuote')}
          </button>
        )}
        {quote.status === 'accepted' && (
          <button type="button" onClick={() => onComplete(quote.id)} className="btn btn-primary btn-sm">
            <Icon name="check" className="h-4 w-4" />
            {t('client.markCompleted')}
          </button>
        )}
      </div>
    </li>
  );
}

export default function ClientDashboard() {
  const { user } = useAuth();
  const { t, formatNumber } = useI18n();
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    fetchMyQuotes(user.id)
      .then((rows) => setQuotes(rows || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?.id]);

  const updateStatus = (quoteId, status) => {
    setQuotes((list) => list.map((quote) => (quote.id === quoteId ? { ...quote, status } : quote)));
  };

  const handleAccept = async (quoteId) => {
    try {
      await acceptQuote(quoteId);
      updateStatus(quoteId, 'accepted');
      toast.success(t('client.acceptedSuccess'));
    } catch (error) {
      toast.error(errorMessage(error, t));
    }
  };

  const handleComplete = async (quoteId) => {
    try {
      await completeQuote(quoteId);
      updateStatus(quoteId, 'completed');
      toast.success(t('client.completedSuccess'));
    } catch (error) {
      toast.error(errorMessage(error, t));
    }
  };

  const answered = quotes.filter((quote) => ['responded', 'accepted', 'completed'].includes(quote.status)).length;
  const completed = quotes.filter((quote) => quote.status === 'completed').length;

  return (
    <>
      <PageHeader
        title={t('client.greeting', { name: user?.first_name || '' })}
        subtitle={t('client.subtitle')}
        actions={
          <Link to="/artisans" className="btn btn-primary">
            <Icon name="search" className="h-4 w-4" />
            {t('client.findArtisan')}
          </Link>
        }
      />

      <div className="container-page space-y-8 py-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label={t('client.stats.sent')} value={formatNumber(quotes.length)} icon="file" />
          <StatCard label={t('client.stats.answered')} value={formatNumber(answered)} icon="message" />
          <StatCard label={t('client.stats.completed')} value={formatNumber(completed)} icon="check" />
        </div>

        <section>
          <h2 className="text-lg font-semibold text-navy-900">{t('client.requests')}</h2>
          <div className="mt-4">
            {loading ? (
              <ListSkeleton />
            ) : quotes.length === 0 ? (
              <EmptyState
                icon="file"
                title={t('client.emptyTitle')}
                text={t('client.emptyText')}
                action={<Link to="/artisans" className="btn btn-primary">{t('client.findArtisan')}</Link>}
              />
            ) : (
              <ul className="space-y-3">
                {quotes.map((quote) => (
                  <ClientQuote key={quote.id} quote={quote} onAccept={handleAccept} onComplete={handleComplete} />
                ))}
              </ul>
            )}
          </div>
        </section>

        {quotes.length > 0 && (
          <div className="flex flex-col gap-4 rounded-lg border border-sand-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-navy-900">{t('client.helpTitle')}</p>
              <p className="mt-1 text-sm text-sand-600">{t('client.helpText')}</p>
            </div>
            <Link to="/artisans" className="btn btn-secondary shrink-0">{t('client.findArtisan')}</Link>
          </div>
        )}
      </div>
    </>
  );
}
