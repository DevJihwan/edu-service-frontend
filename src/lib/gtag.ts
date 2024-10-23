// src/lib/gtag.ts

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID || 'G-L46YDFSP56';

// 페이지뷰 추적 함수
export const pageview = (url: string) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};

// 이벤트 추적 함수
export const event = (action: string, params: Record<string, any>) => {
  window.gtag('event', action, params);
};
