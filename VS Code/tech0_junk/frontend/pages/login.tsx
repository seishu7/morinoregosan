import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import Layout from '@/components/Layout';
import { authAPI } from '@/utils/api';
import { setToken, setUser } from '@/utils/auth';
import { LoginRequest } from '@/types';

interface LoginFormData {
  user_id: number;
  password: string;
}

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const loginData: LoginRequest = {
        user_id: Number(data.user_id),
        password: data.password,
      };

      const response = await authAPI.login(loginData);
      const { access_token, user } = response.data;

      // トークンとユーザー情報を保存
      setToken(access_token);
      setUser(user);

      // トップメニューページにリダイレクト
      router.push('/menu');
    } catch (err: any) {
      console.error('Login error:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      
      const errorMessage = err.response?.data?.detail || 'ログインできませんでした';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout showSidebar={false}>
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-primary-700 mb-2">面談アプリ</h2>
            <p className="text-gray-600">ログインしてください</p>
          </div>

          <div className="card p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="user_id" className="block text-sm font-medium text-gray-700 mb-2">
                  ID（数字）
                </label>
                <input
                  id="user_id"
                  type="number"
                  {...register('user_id', {
                    required: 'IDは必須です',
                    min: { value: 1, message: '有効なIDを入力してください' },
                  })}
                  className="input-field"
                  placeholder="1"
                />
                {errors.user_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.user_id.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  パスワード
                </label>
                <input
                  id="password"
                  type="password"
                  {...register('password', {
                    required: 'パスワードは必須です',
                    minLength: { value: 1, message: 'パスワードを入力してください' },
                  })}
                  className="input-field"
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-soft p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full primary-button ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'ログイン中...' : 'ログイン'}
              </button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 rounded-soft">
              <h3 className="text-sm font-medium text-blue-800 mb-2">テスト用アカウント</h3>
              <div className="text-sm text-blue-700">
                <p>ID: 1, パスワード: password (山田太郎)</p>
                <p>ID: 2, パスワード: password (佐藤花子)</p>
                <p>ID: 3, パスワード: password (田中一郎)</p>
                <p>ID: 4, パスワード: password (鈴木美咲)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;