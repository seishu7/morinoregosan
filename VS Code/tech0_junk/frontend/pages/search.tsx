import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { contactAPI } from '@/utils/api';
import { Contact } from '@/types';

const SearchPage: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 10;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setHasSearched(true);
    setCurrentPage(1);
    try {
      const response = await contactAPI.search(searchQuery, 1, perPage);
      setResults(response.data);
      // Note: API doesn't return pagination info, so we estimate
      setTotalPages(response.data.length === perPage ? 2 : 1);
    } catch (error) {
      console.error('Failed to search contacts:', error);
      setResults([]);
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return '日付未設定';
    return new Date(dateString).toLocaleDateString('ja-JP');
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('ja-JP');
  };

  // Handle page changes
  useEffect(() => {
    if (hasSearched && searchQuery.trim() && currentPage > 1) {
      performSearch();
    }
  }, [currentPage]);

  const performSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const response = await contactAPI.search(searchQuery, currentPage, perPage);
      setResults(response.data);
      setTotalPages(response.data.length === perPage ? currentPage + 1 : currentPage);
    } catch (error) {
      console.error('Failed to search contacts:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-700 mb-2">検索</h1>
          <p className="text-gray-600">面談記録を検索できます</p>
        </div>

        {/* 検索フォーム */}
        <div className="card mb-8">
          <form onSubmit={handleSearch}>
            <div className="space-y-4">
              <div>
                <label htmlFor="searchQuery" className="block text-sm font-medium text-gray-700 mb-2">
                  検索ワード
                </label>
                <input
                  type="text"
                  id="searchQuery"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field"
                  placeholder="担当者名またはタイトルを入力..."
                  required
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading || !searchQuery.trim()}
                  className="primary-button disabled:opacity-50"
                >
                  {loading ? '検索中...' : '検索'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* 検索結果 */}
        {hasSearched && (
          <>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                <span className="ml-3 text-gray-600">検索中...</span>
              </div>
            ) : results.length === 0 ? (
              <div className="card p-8 text-center">
                <div className="text-gray-500 mb-4">
                  <span className="text-4xl">🔍</span>
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">検索結果がありません</h3>
                <p className="text-gray-500">別のキーワードで検索してみてください</p>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    {results.length}件の結果が見つかりました
                  </p>
                </div>

                <div className="card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-primary-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">
                            作成者
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">
                            面談日
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">
                            打ち合わせタイトル
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-primary-700 uppercase tracking-wider">
                            操作
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {results.map((contact) => (
                          <tr key={contact.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {contact.coworker?.name || '不明'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatDate(contact.contact_date)}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {contact.title || '(タイトル未設定)'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => handleView(contact.id)}
                                className="secondary-button text-xs px-3 py-1"
                              >
                                参照
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

export default SearchPage;