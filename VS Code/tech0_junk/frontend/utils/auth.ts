import { Coworker } from '@/types';

// ローカルストレージからトークンを取得
export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
};

// ローカルストレージにトークンを保存
export const setToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', token);
  }
};

// ローカルストレージからトークンを削除
export const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
  }
};

// ローカルストレージからユーザー情報を取得
export const getUser = (): Coworker | null => {
  if (typeof window !== 'undefined') {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  }
  return null;
};

// ローカルストレージにユーザー情報を保存
export const setUser = (user: Coworker): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user));
  }
};

// ローカルストレージからユーザー情報を削除
export const removeUser = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
  }
};

// ログイン状態の確認
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

// ログアウト処理
export const logout = (): void => {
  removeToken();
  removeUser();
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};