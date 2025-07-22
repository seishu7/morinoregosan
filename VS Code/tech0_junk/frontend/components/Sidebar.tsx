import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { logout } from '@/utils/auth';

const Sidebar: React.FC = () => {
  const router = useRouter();

  const handleLogout = () => {
    logout();
  };

  const menuItems = [
    { href: '/new-contact', label: '+ 新規作成', icon: '📝' },
    { href: '/drafts', label: '下書き', icon: '📄' },
    { href: '/history', label: '作成履歴', icon: '📚' },
    { href: '/search', label: '検索', icon: '🔍' },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 sidebar p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary-700">面談アプリ</h1>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block w-full text-left px-4 py-3 rounded-soft transition-colors duration-200 ${
              router.pathname === item.href
                ? 'bg-primary-200 text-primary-800'
                : 'text-primary-700 hover:bg-primary-100'
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </Link>
        ))}
        
        <hr className="my-4 border-primary-200" />
        
        <button
          onClick={handleLogout}
          className="block w-full text-left px-4 py-3 rounded-soft text-red-600 hover:bg-red-50 transition-colors duration-200"
        >
          <span className="mr-3">🚪</span>
          ログアウト
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;