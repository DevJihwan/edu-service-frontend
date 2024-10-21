import './styles/globals.css';
import { ReactNode } from 'react';
import { Analytics } from "@vercel/analytics/react"
import Script from 'next/script';

export const metadata = {
  title: 'Edu Service',
  description: 'Find the best courses near you',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="bg-gray-800 text-white p-4">
          <h1 className="text-xl font-bold">우리동네 문화센터</h1>
          <meta name="google-adsense-account" content="ca-pub-5732243896870221"></meta>
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
            data-ad-client="ca-pub-YourAdClientID" // 자신의 AdSense Publisher ID로 교체
          ></script>          
        </header>
        <main className="container mx-auto p-4">
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-L46YDFSP56"></script>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-L46YDFSP56"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-L46YDFSP56');
          `}
        </Script>
          {children}
          <Analytics />
        </main>
        <footer className="bg-gray-800 text-white p-4 text-center">
          <p>현재 서울시 백화점 문화센터 3곳, 대형마트 2곳 정보를 제공하고 있습니다.</p>
          <p>2024.10.10 서울 이마트 문화센터 정보가 추가되었습니다.</p>
          <p>2024.10.15 서울 롯데마트 문화센터 정보가 추가되었습니다.</p>
        </footer>
      </body>
    </html>
  );
}
