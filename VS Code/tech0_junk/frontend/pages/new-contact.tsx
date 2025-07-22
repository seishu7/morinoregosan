import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm, Controller } from 'react-hook-form';
import Layout from '@/components/Layout';
import SearchModal from '@/components/SearchModal';
import { contactAPI } from '@/utils/api';
import { ContactFormData, BusinessCard, Coworker } from '@/types';

interface FormData {
  contact_date: string;
  location: string;
  title: string;
  raw_text: string;
  summary_text: string;
}

const NewContactPage: React.FC = () => {
  const router = useRouter();
  const [selectedPersons, setSelectedPersons] = useState<BusinessCard[]>([]);
  const [selectedCompanions, setSelectedCompanions] = useState<Coworker[]>([]);
  const [searchModal, setSearchModal] = useState<{
    isOpen: boolean;
    type: 'external' | 'internal';
    title: string;
  }>({
    isOpen: false,
    type: 'external',
    title: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const rawText = watch('raw_text');

  const handlePersonSearch = () => {
    setSearchModal({
      isOpen: true,
      type: 'external',
      title: '外部担当者検索',
    });
  };

  const handleCompanionSearch = () => {
    setSearchModal({
      isOpen: true,
      type: 'internal',
      title: '社内メンバー検索',
    });
  };

  const handleSearchSelect = (item: BusinessCard | Coworker) => {
    if (searchModal.type === 'external') {
      const person = item as BusinessCard;
      if (!selectedPersons.find(p => p.id === person.id)) {
        setSelectedPersons([...selectedPersons, person]);
      }
    } else {
      const companion = item as Coworker;
      if (!selectedCompanions.find(c => c.id === companion.id)) {
        setSelectedCompanions([...selectedCompanions, companion]);
      }
    }
  };

  const removePerson = (id: number) => {
    setSelectedPersons(selectedPersons.filter(p => p.id !== id));
  };

  const removeCompanion = (id: number) => {
    setSelectedCompanions(selectedCompanions.filter(c => c.id !== id));
  };

  const handleSummarize = async () => {
    if (!rawText?.trim()) {
      alert('要約する内容を入力してください');
      return;
    }

    if (rawText.length > 10000) {
      alert('入力テキストが長すぎます（10,000文字以下にしてください）');
      return;
    }

    setIsSummarizing(true);
    try {
      const response = await contactAPI.summarize({ text: rawText });
      setValue('summary_text', response.data.summary);
      alert('要約を生成しました');
    } catch (error: any) {
      console.error('Summarization error:', error);
      
      let errorMessage = '要約の生成に失敗しました';
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response?.status === 400) {
        errorMessage = '入力内容に問題があります';
      } else if (error.response?.status === 500) {
        errorMessage = 'サーバーエラーが発生しました';
      } else if (!navigator.onLine) {
        errorMessage = 'インターネット接続を確認してください';
      }
      
      alert(errorMessage);
    } finally {
      setIsSummarizing(false);
    }
  };

  const onSubmit = async (data: FormData, status: number) => {
    if (selectedPersons.length === 0) {
      alert('担当者を選択してください');
      return;
    }

    setIsLoading(true);
    try {
      const contactData: ContactFormData = {
        contact_date: data.contact_date || undefined,
        location: data.location || undefined,
        title: data.title || undefined,
        raw_text: data.raw_text || undefined,
        summary_text: data.summary_text || undefined,
        status,
        person_ids: selectedPersons.map(p => p.id),
        companion_ids: selectedCompanions.map(c => c.id),
      };

      await contactAPI.create(contactData);
      
      const message = status === 1 ? '面談記録を保存しました' : '下書きを保存しました';
      alert(message);
      router.push('/menu');
    } catch (error) {
      console.error('Save error:', error);
      alert('保存に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = handleSubmit((data) => onSubmit(data, 1));
  const handleDraft = handleSubmit((data) => onSubmit(data, 0));
  const handleDiscard = () => {
    if (window.confirm('入力内容を破棄してトップメニューに戻りますか？')) {
      router.push('/menu');
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-700 mb-2">新規作成</h1>
          <p className="text-gray-600">面談記録を作成します</p>
        </div>

        <div className="card p-8">
          {/* 上部ボタン */}
          <div className="flex justify-end space-x-4 mb-8 pb-4 border-b border-gray-200">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="primary-button"
            >
              {isLoading ? '保存中...' : '保存'}
            </button>
            <button
              onClick={handleDraft}
              disabled={isLoading}
              className="secondary-button"
            >
              {isLoading ? '保存中...' : '下書き'}
            </button>
            <button
              onClick={handleDiscard}
              disabled={isLoading}
              className="danger-button"
            >
              破棄
            </button>
          </div>

          <form className="space-y-6">
            {/* 日時 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                日時
              </label>
              <input
                type="date"
                {...register('contact_date')}
                className="input-field max-w-xs"
              />
            </div>

            {/* 場所 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                場所
              </label>
              <input
                type="text"
                {...register('location')}
                placeholder="会議室名、住所など"
                className="input-field"
              />
            </div>

            {/* 担当者 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                担当者
              </label>
              <button
                type="button"
                onClick={handlePersonSearch}
                className="secondary-button mb-3"
              >
                担当者を検索
              </button>
              <div className="space-y-2">
                {selectedPersons.map((person) => (
                  <div key={person.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-soft">
                    <div>
                      <span className="font-medium">{person.name}</span>
                      <span className="text-gray-600 ml-2">({person.company})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removePerson(person.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 同席 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                同席
              </label>
              <button
                type="button"
                onClick={handleCompanionSearch}
                className="secondary-button mb-3"
              >
                同席者を検索
              </button>
              <div className="space-y-2">
                {selectedCompanions.map((companion) => (
                  <div key={companion.id} className="flex items-center justify-between p-3 bg-green-50 rounded-soft">
                    <div>
                      <span className="font-medium">{companion.name}</span>
                      {companion.department_id && (
                        <span className="text-gray-600 ml-2">(部署{companion.department_id})</span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCompanion(companion.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* タイトル */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                タイトル
              </label>
              <input
                type="text"
                {...register('title')}
                placeholder="面談のタイトル"
                className="input-field"
              />
            </div>

            {/* 打ち合わせ内容 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                打ち合わせ内容
              </label>
              <textarea
                {...register('raw_text')}
                rows={8}
                placeholder="面談の詳細内容を入力してください"
                className="input-field"
              />
              <button
                type="button"
                onClick={handleSummarize}
                disabled={isSummarizing || !rawText?.trim()}
                className="mt-2 secondary-button"
              >
                {isSummarizing ? '要約中...' : '要約'}
              </button>
            </div>

            {/* 打ち合わせサマリー */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                打ち合わせサマリー
              </label>
              <textarea
                {...register('summary_text')}
                rows={4}
                placeholder="要約結果が表示されます（編集可能）"
                className="input-field"
              />
            </div>
          </form>
        </div>

        {/* 検索モーダル */}
        <SearchModal
          isOpen={searchModal.isOpen}
          onClose={() => setSearchModal({ ...searchModal, isOpen: false })}
          onSelect={handleSearchSelect}
          type={searchModal.type}
          title={searchModal.title}
        />
      </div>
    </Layout>
  );
};

export default NewContactPage;