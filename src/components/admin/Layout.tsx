import React, { useState } from 'react';
import { useRouter } from 'next/router';
import {
  LayoutDashboard,
  Users,
  Vote,
  Award,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();

  const menuItems = [
    {
      name: 'Tableau de Bord',
      icon: LayoutDashboard,
      href: '/admin/dashboard',
      active: router.pathname === '/admin/dashboard'
    },
    {
      name: 'Candidates',
      icon: Users,
      href: '/admin/candidates',
      active: router.pathname.startsWith('/admin/candidates')
    },
    {
      name: 'Votes',
      icon: Vote,
      href: '/admin/votes',
      active: router.pathname.startsWith('/admin/votes')
    },
    {
      name: 'Jury',
      icon: Award,
      href: '/admin/jury',
      active: router.pathname.startsWith('/admin/jury')
    },
    {
      name: 'Paramètres',
      icon: Settings,
      href: '/admin/settings',
      active: router.pathname === '/admin/settings'
    }
  ];

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Sidebar Toggle Button (Mobile) */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gold rounded-md"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-900">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8 p-4">
            <img
              src="/assets/images/logopageant.png"
              alt="Miss Orangina Admin"
              className="h-12"
            />
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  item.active
                    ? 'bg-gold text-black'
                    : 'text-gray-300 hover:bg-gold hover:bg-opacity-20'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span>{item.name}</span>
              </a>
            ))}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-gray-300 hover:bg-red-500 hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span>Déconnexion</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`transition-all ${
          sidebarOpen ? 'lg:ml-64' : ''
        } min-h-screen bg-black`}
      >
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}