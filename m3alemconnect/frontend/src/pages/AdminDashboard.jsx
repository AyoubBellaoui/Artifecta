import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  adminDeleteReview,
  adminFetchQuotes,
  adminFetchReviews,
  adminListUsers,
  adminSetUserActive,
  adminStats,
  adminVerifyArtisan,
} from '../services/data';
import { useI18n } from '../i18n/I18nProvider';
import { errorMessage } from '../i18n/helpers';
import Avatar from '../components/Avatar';
import Icon from '../components/Icon';
import StarRating from '../components/StarRating';
import { EmptyState, ListSkeleton, PageLoader, StatCard, StatusBadge, Tabs } from '../components/ui';

const TAB_IDS = ['overview', 'users', 'artisans', 'reviews', 'quotes'];

const th = 'px-4 py-3 text-start font-semibold';
const td = 'px-4 py-3 align-middle';

export default function AdminDashboard() {
  const { t, formatDate, formatNumber, cityName } = useI18n();
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [roleFilter, setRoleFilter] = useState('');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    adminStats()
      .then((data) => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (tab === 'users' || tab === 'artisans') {
      setUsersLoading(true);
      adminListUsers({ role: tab === 'artisans' ? 'artisan' : roleFilter, search: debouncedSearch })
        .then((rows) => setUsers(rows || []))
        .catch(() => setUsers([]))
        .finally(() => setUsersLoading(false));
    }
    if (tab === 'reviews') adminFetchReviews().then((rows) => setReviews(rows || [])).catch(() => {});
    if (tab === 'quotes') adminFetchQuotes().then((rows) => setQuotes(rows || [])).catch(() => {});
  }, [tab, roleFilter, debouncedSearch]);

  const toggleUser = async (user) => {
    try {
      await adminSetUserActive(user.id, !user.is_active);
      setUsers((list) => list.map((item) => (item.id === user.id ? { ...item, is_active: !item.is_active } : item)));
      toast.success(t('admin.statusUpdated'));
    } catch (error) {
      toast.error(errorMessage(error, t));
    }
  };

  const verifyArtisan = async (userId) => {
    try {
      await adminVerifyArtisan(userId);
      setUsers((list) => list.map((item) => (item.id === userId ? { ...item, is_verified: true } : item)));
      toast.success(t('admin.artisanVerified'));
    } catch (error) {
      toast.error(errorMessage(error, t));
    }
  };

  const deleteReview = async (reviewId) => {
    if (!window.confirm(t('admin.confirmDeleteReview'))) return;
    try {
      await adminDeleteReview(reviewId);
      setReviews((list) => list.filter((review) => review.id !== reviewId));
      toast.success(t('admin.reviewDeleted'));
    } catch (error) {
      toast.error(errorMessage(error, t));
    }
  };

  if (loading) return <PageLoader />;

  const statCards = [
    ['users', 'users'],
    ['artisans', 'briefcase'],
    ['clients', 'user'],
    ['quotes', 'file'],
    ['reviews', 'star'],
    ['premium', 'award'],
  ];

  const shortDate = (value) => formatDate(value, { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <>
      <div className="border-b border-sand-200 bg-white">
        <div className="container-page pt-8">
          <h1 className="text-2xl font-semibold tracking-tight text-navy-900 sm:text-3xl">{t('admin.title')}</h1>
          <p className="mt-1.5 text-sand-600">{t('admin.subtitle')}</p>
          <div className="mt-8">
            <Tabs
              tabs={TAB_IDS.map((id) => ({ id, label: t(`admin.tabs.${id}`) }))}
              value={tab}
              onChange={(id) => {
                setTab(id);
                setSearch('');
                setRoleFilter('');
              }}
              bordered={false}
            />
          </div>
        </div>
      </div>

      <div className="container-page py-8">
        {tab === 'overview' && (
          <div className="space-y-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {statCards.map(([key, icon]) => (
                <StatCard key={key} label={t(`admin.stats.${key}`)} value={formatNumber(stats?.[key])} icon={icon} />
              ))}
            </div>

            <section className="card overflow-hidden">
              <h2 className="border-b border-sand-200 px-5 py-4 text-sm font-semibold text-navy-900">{t('admin.recentUsers')}</h2>
              {stats?.recentUsers?.length ? (
                <ul className="divide-y divide-sand-200">
                  {stats.recentUsers.map((u) => (
                    <li key={u.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5">
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar size="sm" firstName={u.first_name} lastName={u.last_name} />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-navy-900"><bdi>{u.first_name} {u.last_name}</bdi></p>
                          <p className="truncate text-xs text-sand-600"><bdi>{u.email}</bdi></p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={u.role === 'artisan' ? 'chip-premium' : 'chip-info'}>{t(`roles.${u.role}`)}</span>
                        <span className="text-xs text-sand-500">{shortDate(u.created_at)}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-5 py-8 text-center text-sm text-sand-600">{t('admin.noRecent')}</p>
              )}
            </section>
          </div>
        )}

        {(tab === 'users' || tab === 'artisans') && (
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <div className="relative w-full sm:w-80">
                <Icon name="search" className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sand-500" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t('admin.searchPlaceholder')}
                  aria-label={t('admin.searchPlaceholder')}
                  className="input h-10 ps-9"
                />
              </div>
              {tab === 'users' && (
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  aria-label={t('admin.columns.role')}
                  className="select h-10 w-auto min-w-[10rem]"
                >
                  <option value="">{t('admin.allRoles')}</option>
                  <option value="client">{t('roles.client')}</option>
                  <option value="artisan">{t('roles.artisan')}</option>
                </select>
              )}
              <span className="text-sm text-sand-600">{t('admin.results', { count: users.length })}</span>
            </div>

            {usersLoading && users.length === 0 ? (
              <ListSkeleton />
            ) : users.length === 0 ? (
              <EmptyState icon="users" text={t('admin.noUsers')} />
            ) : (
              <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-sm">
                    <thead className="border-b border-sand-200 bg-sand-50 text-xs text-sand-600">
                      <tr>
                        <th className={th}>{t('admin.columns.user')}</th>
                        <th className={th}>{t('admin.columns.role')}</th>
                        <th className={th}>{t('admin.columns.city')}</th>
                        <th className={th}>{t('admin.columns.joined')}</th>
                        <th className={th}>{t('admin.columns.status')}</th>
                        <th className={`${th} text-end`}>{t('admin.columns.actions')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sand-200">
                      {users.map((u) => (
                        <tr key={u.id} className="hover:bg-sand-50">
                          <td className={td}>
                            <div className="flex items-center gap-3">
                              <Avatar size="sm" firstName={u.first_name} lastName={u.last_name} />
                              <div className="min-w-0">
                                <p className="font-medium text-navy-900"><bdi>{u.first_name} {u.last_name}</bdi></p>
                                <p className="truncate text-xs text-sand-600"><bdi>{u.email}</bdi></p>
                              </div>
                            </div>
                          </td>
                          <td className={td}>
                            <span className={u.role === 'artisan' ? 'chip-premium' : 'chip-info'}>{t(`roles.${u.role}`)}</span>
                          </td>
                          <td className={`${td} text-sand-700`}>{u.city ? cityName(u.city) : '—'}</td>
                          <td className={`${td} text-sand-600`}>{shortDate(u.created_at)}</td>
                          <td className={td}>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${u.is_active ? 'text-emerald-700' : 'text-red-700'}`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${u.is_active ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                {u.is_active ? t('admin.active') : t('admin.inactive')}
                              </span>
                              {u.role === 'artisan' && u.is_verified ? <span className="chip-verified">{t('admin.verified')}</span> : null}
                            </div>
                          </td>
                          <td className={td}>
                            <div className="flex justify-end gap-2">
                              {u.role === 'artisan' && !u.is_verified && (
                                <button type="button" onClick={() => verifyArtisan(u.id)} className="btn btn-secondary btn-sm">
                                  <Icon name="shieldCheck" className="h-4 w-4" />
                                  {t('admin.verify')}
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => toggleUser(u)}
                                className={`btn btn-sm ${u.is_active ? 'btn-danger' : 'btn-secondary'}`}
                              >
                                {u.is_active ? t('admin.deactivate') : t('admin.activate')}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'reviews' && (
          <section>
            <h2 className="text-lg font-semibold text-navy-900">{t('admin.reviewsTitle')}</h2>
            <div className="mt-4">
              {reviews.length === 0 ? (
                <EmptyState icon="star" text={t('admin.noReviews')} />
              ) : (
                <ul className="space-y-3">
                  {reviews.map((review) => (
                    <li key={review.id} className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 text-sm">
                          <span className="font-medium text-navy-900">
                            <bdi>{review.client_first_name} {review.client_last_name}</bdi>
                          </span>
                          <Icon name="arrowRight" className="h-3.5 w-3.5 text-sand-400" flipInRtl />
                          <span className="text-sand-700">
                            <bdi>{review.artisan_first_name} {review.artisan_last_name}</bdi>
                          </span>
                        </div>
                        <div className="mt-1.5 flex items-center gap-3">
                          <StarRating rating={review.rating} size="xs" />
                          <span className="text-xs text-sand-500">{shortDate(review.created_at)}</span>
                        </div>
                        {review.comment && <p dir="auto" className="mt-2 text-sm leading-relaxed text-sand-700">{review.comment}</p>}
                      </div>
                      <button type="button" onClick={() => deleteReview(review.id)} className="btn btn-danger btn-sm shrink-0">
                        <Icon name="trash" className="h-4 w-4" />
                        {t('admin.deleteReview')}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}

        {tab === 'quotes' && (
          <section>
            <h2 className="text-lg font-semibold text-navy-900">{t('admin.quotesTitle')}</h2>
            <div className="mt-4">
              {quotes.length === 0 ? (
                <EmptyState icon="file" text={t('admin.noQuotes')} />
              ) : (
                <div className="card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] text-sm">
                      <thead className="border-b border-sand-200 bg-sand-50 text-xs text-sand-600">
                        <tr>
                          <th className={th}>{t('admin.columns.client')}</th>
                          <th className={th}>{t('admin.columns.artisan')}</th>
                          <th className={th}>{t('admin.columns.request')}</th>
                          <th className={th}>{t('admin.columns.status')}</th>
                          <th className={th}>{t('admin.columns.date')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-sand-200">
                        {quotes.map((quote) => (
                          <tr key={quote.id} className="hover:bg-sand-50">
                            <td className={`${td} font-medium text-navy-900`}>
                              <bdi>{quote.client_first_name} {quote.client_last_name}</bdi>
                            </td>
                            <td className={`${td} text-sand-700`}>
                              <bdi>{quote.artisan_first_name} {quote.artisan_last_name}</bdi>
                            </td>
                            <td className={`${td} max-w-xs`}>
                              <p dir="auto" className="truncate text-sand-700">{quote.description}</p>
                            </td>
                            <td className={td}><StatusBadge status={quote.status} /></td>
                            <td className={`${td} whitespace-nowrap text-sand-600`}>{shortDate(quote.created_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
