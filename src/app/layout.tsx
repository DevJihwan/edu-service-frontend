import './styles/globals.css';
import { ReactNode } from 'react';

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
        </header>
        <main className="container mx-auto p-4">
          {children}
        </main>
        <footer className="bg-gray-800 text-white p-4 text-center">
          <p>현재 서울시 백화점 문화센터 정보만 제공하고 있습니다.</p>
          <p>2024.10.10 서울 이마트 문화센터 정보가 추가되었습니다.</p>
        </footer>
      </body>
    </html>
  );
}
