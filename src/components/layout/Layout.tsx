import React from 'react';
import Head from 'next/head';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title = 'Vote Miss Orangina 2025'
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Système de vote pour Miss Orangina 2025" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className="min-h-screen text-white font-sans">
        <main className="container mx-auto px-4">
          {children}
        </main>
      </div>
    </>
  );
};

export default Layout;