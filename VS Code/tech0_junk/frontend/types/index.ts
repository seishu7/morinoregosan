// 基本的な型定義
export interface BusinessCard {
  id: number;
  name: string;
  company: string;
  department?: string;
  position?: string;
  memo?: string;
}

export interface Coworker {
  id: number;
  name: string;
  position?: string;
  email: string;
  sso_id?: string;
  department_id?: number;
}

export interface Contact {
  id: number;
  contact_date?: string;
  location?: string;
  title?: string;
  summary_text?: string;
  raw_text?: string;
  details?: string;
  status: number;
  department_id?: number;
  coworker_id?: number;
  created_at: string;
  persons: BusinessCard[];
  companions: Coworker[];
  creator?: Coworker;
}

// API関連の型
export interface LoginRequest {
  user_id: number;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: Coworker;
}

export interface SearchRequest {
  keyword: string;
  page: number;
  per_page: number;
}

export interface SearchResponse {
  items: any[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface SummaryRequest {
  text: string;
}

export interface SummaryResponse {
  summary: string;
}

// フォーム関連の型
export interface ContactFormData {
  contact_date?: string;
  location?: string;
  title?: string;
  summary_text?: string;
  raw_text?: string;
  details?: string;
  status: number;
  person_ids: number[];
  companion_ids: number[];
}