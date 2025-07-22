import React from 'react';
import Layout from '@/components/Layout';
import { getUser } from '@/utils/auth';

const MenuPage: React.FC = () => {
  const user = getUser();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-700 mb-2">トップメニュー</h1>
          {user && (
            <p className="text-gray-600">ようこそ、{user.name}さん</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 新規作成 */}
          <div className="card p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">📝</span>
              <h2 className="text-xl font-semibold text-primary-700">新規作成</h2>
            </div>
            <p className="text-gray-600 mb-4">新しい面談記録を作成します。</p>
            <a
              href="/new-contact"
              className="inline-block primary-button"
            >
              作成開始
            </a>
          </div>

          {/* 下書き */}
          <div className="card p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">📄</span>
              <h2 className="text-xl font-semibold text-primary-700">下書き</h2>
            </div>
            <p className="text-gray-600 mb-4">保存した下書きを確認・編集します。</p>
            <a
              href="/drafts"
              className="inline-block secondary-button"
            >
              下書き一覧
            </a>
          </div>

          {/* 作成履歴 */}
          <div className="card p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">📚</span>
              <h2 className="text-xl font-semibold text-primary-700">作成履歴</h2>
            </div>
            <p className="text-gray-600 mb-4">過去に作成した面談記録を確認します。</p>
            <a
              href="/history"
              className="inline-block secondary-button"
            >
              履歴一覧
            </a>
          </div>

          {/* 検索 */}
          <div className="card p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">🔍</span>
              <h2 className="text-xl font-semibold text-primary-700">検索</h2>
            </div>
            <p className="text-gray-600 mb-4">面談記録を検索します。</p>
            <a
              href="/search"
              className="inline-block secondary-button"
            >
              検索開始
            </a>
          </div>
        </div>

        {/* 統計情報（オプション） */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-primary-700 mb-6">概要</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card p-4 text-center">
              <div className="text-2xl font-bold text-primary-600">-</div>
              <div className="text-sm text-gray-600">今月の面談数</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-2xl font-bold text-primary-600">-</div>
              <div className="text-sm text-gray-600">下書き数</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-2xl font-bold text-primary-600">-</div>
              <div className="text-sm text-gray-600">総面談記録数</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MenuPage;