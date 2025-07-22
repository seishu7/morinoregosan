import axios, { AxiosResponse } from 'axios';
import { LoginRequest, LoginResponse, Contact, ContactFormData, BusinessCard, Coworker, SearchRequest, SearchResponse, SummaryRequest, SummaryResponse } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Axiosインスタンスの作成
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// リクエストインターセプター（認証トークンの追加）
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// レスポンスインターセプター（エラーハンドリング）
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 認証API
export const authAPI = {
  login: (data: LoginRequest): Promise<AxiosResponse<LoginResponse>> => 
    api.post('/api/auth/login', data),
  
  logout: (): Promise<AxiosResponse> => 
    api.post('/api/auth/logout'),
};

// 面談記録API
export const contactAPI = {
  create: (data: ContactFormData): Promise<AxiosResponse<Contact>> => 
    api.post('/api/contacts/', data),
  
  update: (id: number, data: ContactFormData): Promise<AxiosResponse<Contact>> => 
    api.put(`/api/contacts/${id}`, data),
  
  get: (id: number): Promise<AxiosResponse<Contact>> => 
    api.get(`/api/contacts/${id}`),
  
  getDrafts: (page = 1, per_page = 10): Promise<AxiosResponse<Contact[]>> => 
    api.get(`/api/contacts/drafts?page=${page}&per_page=${per_page}`),
  
  getHistory: (page = 1, per_page = 10): Promise<AxiosResponse<Contact[]>> => 
    api.get(`/api/contacts/history?page=${page}&per_page=${per_page}`),
  
  search: (keyword: string, page = 1, per_page = 10): Promise<AxiosResponse<SearchResponse>> => 
    api.post('/api/contacts/search', { keyword, page, per_page }),
  
  delete: (id: number): Promise<AxiosResponse> => 
    api.delete(`/api/contacts/${id}`),
  
  summarize: (data: SummaryRequest): Promise<AxiosResponse<SummaryResponse>> => 
    api.post('/api/contacts/summarize', data),
};

// 名刺API
export const businessCardAPI = {
  create: (data: Partial<BusinessCard>): Promise<AxiosResponse<BusinessCard>> => 
    api.post('/api/business-cards/', data),
  
  getAll: (skip = 0, limit = 100): Promise<AxiosResponse<BusinessCard[]>> => 
    api.get(`/api/business-cards/?skip=${skip}&limit=${limit}`),
  
  get: (id: number): Promise<AxiosResponse<BusinessCard>> => 
    api.get(`/api/business-cards/${id}`),
  
  search: (data: SearchRequest): Promise<AxiosResponse<SearchResponse>> => 
    api.post('/api/business-cards/search', data),
};

// 社内メンバーAPI
export const coworkerAPI = {
  create: (data: Partial<Coworker>): Promise<AxiosResponse<Coworker>> => 
    api.post('/api/coworkers/', data),
  
  getAll: (skip = 0, limit = 100): Promise<AxiosResponse<Coworker[]>> => 
    api.get(`/api/coworkers/?skip=${skip}&limit=${limit}`),
  
  get: (id: number): Promise<AxiosResponse<Coworker>> => 
    api.get(`/api/coworkers/${id}`),
  
  search: (data: SearchRequest): Promise<AxiosResponse<SearchResponse>> => 
    api.post('/api/coworkers/search', data),
};