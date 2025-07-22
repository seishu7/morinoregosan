import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { contactAPI } from '@/utils/api';
import { Contact } from '@/types';

const DraftsPage: React.FC = () => {
  const router = useRouter();
  const [drafts, setDrafts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 10;

  useEffect(() => {
    fetchDrafts();
  }, [currentPage]);

  const fetchDrafts = async () => {
    setLoading(true);
    try {
      const response = await contactAPI.getDrafts(currentPage, perPage);
      setDrafts(response.data);
      // Note: API doesn't return pagination info, so we estimate
      setTotalPages(response.data.length === perPage ? currentPage + 1 : currentPage);
    } catch (error) {
      console.error('Failed to fetch drafts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (contactId: number) => {
    router.push(`/edit-contact/${contactId}`);
  };

  const handleDiscard = async (contactId: number) => {
    if (window.confirm('この下書きを破棄しますか？')) {
      try {
        await contactAPI.delete(contactId);
        fetchDrafts(); // Refresh the list
        alert('下書きを破棄しました');
      } catch (error) {
        console.error('Failed to discard draft:', error);
        alert('破棄に失敗しました');
      }
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '日付未設定';
    return new Date(dateString).toLocaleDateString('ja-JP');
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-700 mb-2">下書き一覧</h1>
          <p className="text-gray-600">保存した下書きを確認・編集できます</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            <span className="ml-3 text-gray-600">読み込み中...</span>
          </div>
        ) : drafts.length === 0 ? (
          <div className="card p-8 text-center">
            <div className="text-gray-500 mb-4">
              <span className="text-4xl">📄</span>
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">下書きがありません</h3>
            <p className="text-gray-500 mb-4">面談記録を作成して下書き保存してください</p>
            <button
              onClick={() => router.push('/new-contact')}
              className="primary-button"
            >
              新規作成
            </button>
          </div>
        ) : (
          <>
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-primary-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">
                        面談日
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">
                        タイトル
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">
                        場所
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">
                        担当者数
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-primary-700 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {drafts.map((draft) => (
                      <tr key={draft.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(draft.contact_date)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {draft.title || '(タイトル未設定)'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {draft.location || '(場所未設定)'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {draft.persons?.length || 0}名
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleEdit(draft.id)}
                            className="secondary-button text-xs px-3 py-1"
                          >
                            編集
                          </button>
                          <button
                            onClick={() => handleDiscard(draft.id)}
                            className="danger-button text-xs px-3 py-1"
                          >
                            破棄
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ページネーション */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4 mt-8">
                <button
                  onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                  disabled={currentPage === 1}
                  className="secondary-button disabled:opacity-50"
                >
                  前へ
                </button>
                <span className="text-sm text-gray-600">
                  ページ {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
                  disabled={currentPage === totalPages}
                  className="secondary-button disabled:opacity-50"
                >
                  次へ
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default DraftsPage;