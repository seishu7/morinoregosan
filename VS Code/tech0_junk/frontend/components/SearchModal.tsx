import React, { useState, useEffect } from 'react';
import { businessCardAPI, coworkerAPI } from '@/utils/api';
import { BusinessCard, Coworker, SearchRequest } from '@/types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: BusinessCard | Coworker) => void;
  type: 'external' | 'internal'; // 外部担当者 or 社内メンバー
  title: string;
}

const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  type,
  title,
}) => {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const searchItems = async (page = 1) => {
    if (!keyword.trim()) return;

    setLoading(true);
    try {
      const searchData: SearchRequest = {
        keyword: keyword.trim(),
        page,
        per_page: 5,
      };

      let response;
      if (type === 'external') {
        response = await businessCardAPI.search(searchData);
      } else {
        response = await coworkerAPI.search(searchData);
      }

      const { items, total_pages } = response.data;
      setResults(items);
      setTotalPages(total_pages);
      setCurrentPage(page);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchItems(1);
  };

  const handleSelect = async (item: any) => {
    const confirmMessage = type === 'external' 
      ? `${item.name}（${item.company}）を選択しますか？`
      : `${item.name}を選択しますか？`;
    
    if (window.confirm(confirmMessage)) {
      // 詳細情報を取得
      try {
        let response;
        if (type === 'external') {
          response = await businessCardAPI.get(item.id);
        } else {
          response = await coworkerAPI.get(item.id);
        }
        onSelect(response.data);
        onClose();
      } catch (error) {
        console.error('Failed to get item details:', error);
      }
    }
  };

  const handlePageChange = (page: number) => {
    searchItems(page);
  };

  useEffect(() => {
    if (!isOpen) {
      setKeyword('');
      setResults([]);
      setCurrentPage(1);
      setTotalPages(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-soft max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-primary-700">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex space-x-2">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="検索キーワードを入力"
                className="flex-1 input-field"
              />
              <button
                type="submit"
                disabled={loading || !keyword.trim()}
                className="primary-button"
              >
                検索
              </button>
            </div>
          </form>

          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">検索中...</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-3">
              {results.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-soft hover:bg-gray-50"
                >
                  <div>
                    <div className="font-medium text-gray-900">{item.name}</div>
                    <div className="text-sm text-gray-600">
                      {type === 'external' ? item.company : item.department}
                    </div>
                    {item.position && (
                      <div className="text-sm text-gray-500">{item.position}</div>
                    )}
                  </div>
                  <button
                    onClick={() => handleSelect(item)}
                    className="secondary-button"
                  >
                    選択
                  </button>
                </div>
              ))}

              {/* ページネーション */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-6">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="secondary-button disabled:opacity-50"
                  >
                    前へ
                  </button>
                  <span className="text-sm text-gray-600">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="secondary-button disabled:opacity-50"
                  >
                    次へ
                  </button>
                </div>
              )}
            </div>
          )}

          {results.length === 0 && keyword && !loading && (
            <div className="text-center py-8 text-gray-600">
              検索結果が見つかりませんでした。
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;