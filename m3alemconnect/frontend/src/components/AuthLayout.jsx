import { AUTH_IMAGE } from '../data/images';
import { useI18n } from '../i18n/I18nProvider';
import Icon from './Icon';
import { Reveal } from './motion';
import ZelligePattern from './ZelligePattern';

export default function AuthLayout({ title, subtitle, footer, children }) {
  const { t, tm } = useI18n();

  return (
    <div className="container-page py-10 sm:py-14">
      <Reveal y={16} amount={0} className="mx-auto grid max-w-5xl overflow-hidden rounded-xl border border-sand-200 bg-white shadow-card lg:grid-cols-[minmax(0,1fr)_minmax(0,0.78fr)]">
        <div className="p-6 sm:p-10">
          <h1 className="text-2xl font-semibold tracking-tight text-navy-900 sm:text-[28px]">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sand-600">{subtitle}</p>}
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-8 border-t border-sand-200 pt-6 text-sm text-sand-600">{footer}</div>}
        </div>

        {/* Side panel: stays in view while a long form scrolls. */}
        <aside className="relative hidden overflow-hidden bg-navy-900 text-white lg:block">
          {/* Lazy: the panel is hidden below lg, so phones never download the photo. */}
          <img
            src={AUTH_IMAGE}
            alt=""
            width={960}
            height={1280}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-900/70 via-navy-900/75 to-navy-950/95" aria-hidden="true" />
          <ZelligePattern className="text-white/[0.05]" />
          <div className="absolute inset-y-0 start-0 w-px bg-saffron-500/40" aria-hidden="true" />

          <div className="sticky top-20 flex flex-col gap-8 p-10">
            <div>
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-white">
                <img src="/brand/mark.png" alt="" className="h-8 w-auto" />
              </span>
              <p className="mt-7 text-[22px] font-semibold leading-snug tracking-tight">{t('auth.asideTitle')}</p>
            </div>

            <ul className="space-y-3.5">
              {tm('auth.asidePoints').map((point) => (
                <li key={point} className="flex items-start gap-3 text-[15px] leading-snug text-navy-100">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-saffron-500 text-navy-950">
                    <Icon name="check" className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </span>
                  {point}
                </li>
              ))}
            </ul>

            <dl className="grid grid-cols-3 gap-4 rounded-lg border border-white/10 bg-white/[0.04] p-5">
              {tm('home.hero.stats').map((stat) => (
                <div key={stat.label} className="flex flex-col-reverse justify-end">
                  <dt className="mt-1 text-[11px] leading-snug text-navy-200">{stat.label}</dt>
                  <dd className="text-lg font-semibold tracking-tight text-white">
                    <bdi dir="ltr">{stat.value}</bdi>
                  </dd>
                </div>
              ))}
            </dl>

            <p className="border-t border-white/10 pt-5 text-sm text-navy-300">{t('brand.tagline')}</p>
          </div>
        </aside>
      </Reveal>
    </div>
  );
}
