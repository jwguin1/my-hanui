"use client";
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import pages from '@/data/analytics-pages.json';
import { analyticsPath, consultationEvent, sourceOrigin } from '@/lib/analytics-policy';

// Public measurement ID, not a credential. Advertising and automatic form/search tracking are off.
export const ANALYTICS_ID = 'G-0BE2S5TH5K';
type AnalyticsWindow = Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void; clinicAnalyticsPage?: string; [key: `ga-disable-${string}`]: boolean | undefined };

export default function SiteAnalytics() {
  const pathname = usePathname();
  useEffect(() => {
    const w = window as unknown as AnalyticsWindow;
    const page = analyticsPath(location.hostname, pathname, pages);
    let optedOut = navigator.doNotTrack === '1';
    try { optedOut ||= localStorage.getItem('clinic-analytics-optout') === '1'; } catch { optedOut = true; }
    w[`ga-disable-${ANALYTICS_ID}`] = !page || optedOut;
    if (!page || optedOut) { w.clinicAnalyticsPage = undefined; return; }
    const pageLocation = location.origin + (location.hostname === 'research.ilsanhan.com' ? page.replace(/^\/research/, '') || '/' : page);
    if (!w.gtag) {
      w.dataLayer = w.dataLayer || [];
      w.gtag = (...args: unknown[]) => { w.dataLayer!.push(args); };
      w.gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
      w.gtag('js',new Date());
      w.gtag('config',ANALYTICS_ID,{send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false,cookie_expires:2592000,cookie_update:false,cookie_flags:'SameSite=Lax;Secure',page_location:pageLocation,page_title:page,page_referrer:sourceOrigin(document.referrer)});
      const script = document.createElement('script');
      script.async = true; script.referrerPolicy = 'origin'; script.id = 'clinic-analytics';
      script.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_ID}`;
      document.head.appendChild(script);
    }
    // Override defaults on every navigation; never send query strings, search text or form fields.
    w.gtag('set',{page_location:pageLocation,page_title:page,page_referrer:sourceOrigin(document.referrer)});
    if (w.clinicAnalyticsPage !== pageLocation) {
      w.gtag('event','page_view',{page_location:pageLocation,page_title:page,page_referrer:sourceOrigin(document.referrer)});
      w.clinicAnalyticsPage = pageLocation;
    }
    const onClick = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest('a') : null;
      const name = link && consultationEvent(link.href);
      if (name) w.gtag?.('event',name,{page_location:pageLocation,page_title:page,transport_type:'beacon'});
    };
    document.addEventListener('click',onClick);
    return () => { document.removeEventListener('click',onClick); w[`ga-disable-${ANALYTICS_ID}`] = true; };
  }, [pathname]);
  return null;
}
