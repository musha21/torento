import { useLayoutEffect } from 'react';
import { absoluteUrl, defaultOgImageUrl, SITE_NAME } from '../../lib/seo/siteConfig';

export type SeoHeadProps = {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
};

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

const JSON_LD_ATTR = 'data-torento-jsonld';

export function SeoHead({
  title,
  description,
  path,
  image,
  type = 'website',
  noindex = false,
  jsonLd,
}: SeoHeadProps) {
  useLayoutEffect(() => {
    const canonical = absoluteUrl(path);
    const ogImage = image?.startsWith('http') ? image : absoluteUrl(image || '/brand/torento-logo.png');
    const resolvedImage = image ? ogImage : defaultOgImageUrl();

    document.title = title;

    upsertMeta('name', 'description', description);
    upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');
    upsertLink('canonical', canonical);

    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:type', type === 'product' ? 'product' : 'website');
    upsertMeta('property', 'og:url', canonical);
    upsertMeta('property', 'og:image', resolvedImage);
    upsertMeta('property', 'og:site_name', SITE_NAME);
    upsertMeta('property', 'og:locale', 'en_LK');

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', resolvedImage);

    document.querySelectorAll(`script[${JSON_LD_ATTR}]`).forEach((n) => n.remove());
    if (jsonLd) {
      const blocks = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      for (const block of blocks) {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute(JSON_LD_ATTR, 'true');
        script.text = JSON.stringify(block);
        document.head.appendChild(script);
      }
    }

    return () => {
      document.querySelectorAll(`script[${JSON_LD_ATTR}]`).forEach((n) => n.remove());
    };
  }, [title, description, path, image, type, noindex, jsonLd]);

  return null;
}
