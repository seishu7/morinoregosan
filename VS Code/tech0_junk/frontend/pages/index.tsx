import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { getUser } from '@/utils/auth';

const HomePage: React.FC = () => {
  const router = useRouter();
  const user = getUser();

  useEffect(() => {
    // ログイン後はトップメニューページにリダイレクト
    router.push('/menu');
  }, [router]);

  return (
    <Layout>
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-lg text-primary-600">読み込み中...</p>
          {user && <p className="text-sm text-gray-500">ようこそ、{user.name}さん</p>}
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;