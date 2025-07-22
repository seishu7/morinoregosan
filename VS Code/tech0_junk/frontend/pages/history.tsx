import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { contactAPI } from '@/utils/api';
import { Contact } from '@/types';

const HistoryPage: React.FC = () => {
  const router = useRouter();
  const [history, setHistory] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const perPage = 10;

  useEffect(() => {
    fetchHistory();
  }, [currentPage]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await contactAPI.getHistory(currentPage, perPage);
      setHistory(response.data);
      // Note: API doesn't return pagination info, so we estimate
      setTotalPages(response.data.length === perPage ? currentPage + 1 : currentPage);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (contactId: number) => {
    try {
      const response = await contactAPI.get(contactId);
      setSelectedContact(response.data);
    } catch (error) {
      console.error('Failed to fetch contact details:', error);
      alert('面談記録の取得に失敗しました');
    }
  };

  const handleDiscard = async (contactId: number) => {
    if (window.confirm('この面談記録を破棄しますか？')) {
      try {
        await contactAPI.delete(contactId);
        fetchHistory(); // Refresh the list
        alert('面談記録を破棄しました');
      } catch (error) {
        console.error('Failed to discard contact:', error);
        alert('破棄に失敗しました');
      }
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '日付未設定';
    return new Date(dateString).toLocaleDateString('ja-JP');
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('ja-JP');
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-700 mb-2">作成履歴</h1>
          <p className="text-gray-600">作成完了した面談記録を確認できます</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            <span className="ml-3 text-gray-600">読み込み中...</span>
          </div>
        ) : history.length === 0 ? (
          <div className="card p-8 text-center">
            <div className="text-gray-500 mb-4">
              <span className="text-4xl">📚</span>
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">作成履歴がありません</h3>
            <p className="text-gray-500 mb-4">面談記録を作成・保存してください</p>
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">
                        作成日時
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-primary-700 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {history.map((contact) => (
                      <tr key={contact.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(contact.contact_date)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {contact.title || '(タイトル未設定)'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {contact.location || '(場所未設定)'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {contact.persons?.length || 0}名
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDateTime(contact.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleView(contact.id)}
                            className="secondary-button text-xs px-3 py-1"
                          >
                            参照
                          </button>
                          <button
                            onClick={() => handleDiscard(contact.id)}
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

        {/* 詳細モーダル */}
        {selectedContact && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-soft max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-primary-700">面談記録詳細</h2>
                  <button
                    onClick={() => setSelectedContact(null)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">日時</label>
                      <p className="text-sm text-gray-900">{formatDate(selectedContact.contact_date)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">場所</label>
                      <p className="text-sm text-gray-900">{selectedContact.location || '未設定'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">タイトル</label>
                    <p className="text-sm text-gray-900">{selectedContact.title || '未設定'}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">担当者</label>
                    <div className="space-y-1">
                      {selectedContact.persons.map((person) => (
                        <p key={person.id} className="text-sm text-gray-900">
                          {person.name} ({person.company})
                        </p>
                      ))}
                    </div>
                  </div>
                  
                  {selectedContact.companions.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">同席</label>
                      <div className="space-y-1">
                        {selectedContact.companions.map((companion) => (
                          <p key={companion.id} className="text-sm text-gray-900">
                            {companion.name}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedContact.summary_text && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">要約</label>
                      <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedContact.summary_text}</p>
                    </div>
                  )}
                  
                  {selectedContact.raw_text && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">詳細内容</label>
                      <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedContact.raw_text}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200">
                <button
                  onClick={() => setSelectedContact(null)}
                  className="secondary-button"
                >
                  閉じる
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default HistoryPage;