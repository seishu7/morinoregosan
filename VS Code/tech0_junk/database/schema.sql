-- 面談アプリ データベーススキーマ（仕様書準拠版）
-- Supabase (PostgreSQL) 用

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 名刺テーブル（外部担当者情報）
CREATE TABLE business_cards (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL, -- 担当者名
    company VARCHAR(255) NOT NULL, -- 企業名
    department VARCHAR(255), -- 所属部署
    position VARCHAR(255), -- 役職
    memo TEXT -- 名刺自体に紐づく簡易メモ
);

-- 社内メンバーテーブル
CREATE TABLE coworkers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL, -- 社内メンバー氏名
    position VARCHAR(255), -- 役職
    email VARCHAR(255) NOT NULL UNIQUE, -- 社内メールアドレス
    sso_id VARCHAR(255) UNIQUE, -- SSO識別情報（外部連携用）
    department_id INTEGER -- 部署コード
);

-- 認証ユーザーテーブル
CREATE TABLE auth_users (
    id SERIAL PRIMARY KEY,
    coworker_id INTEGER NOT NULL UNIQUE REFERENCES coworkers(id) ON DELETE CASCADE,
    password_hash VARCHAR(255) NOT NULL, -- ハッシュ化されたログインパスワード
    last_login TIMESTAMP -- 最終ログイン日時
);

-- 面談記録テーブル（メイン）
CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    contact_date DATE, -- 面談実施日
    location VARCHAR(255), -- 面談場所
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 記録日時
    title VARCHAR(255), -- タイトル
    summary_text TEXT, -- 打ち合わせ内容の要約
    raw_text TEXT, -- 打ち合わせ内容
    details TEXT, -- 面談の詳細
    status INTEGER NOT NULL DEFAULT 0, -- 1:保存完了、0:一時保存、9:破棄
    department_id INTEGER, -- 部署コード
    coworker_id INTEGER REFERENCES coworkers(id) -- 作成者
);

-- 面談-担当者関連テーブル（多対多）
CREATE TABLE contact_person (
    contact_id INTEGER NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    business_card_id INTEGER NOT NULL REFERENCES business_cards(id) ON DELETE CASCADE,
    PRIMARY KEY (contact_id, business_card_id)
);

-- 面談-同席者関連テーブル（多対多）
CREATE TABLE contact_companions (
    contact_id INTEGER NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    coworker_id INTEGER NOT NULL REFERENCES coworkers(id) ON DELETE CASCADE,
    PRIMARY KEY (contact_id, coworker_id)
);

-- インデックスの作成
CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_contacts_department_id ON contacts(department_id);
CREATE INDEX idx_contacts_coworker_id ON contacts(coworker_id);
CREATE INDEX idx_contacts_contact_date ON contacts(contact_date DESC);
CREATE INDEX idx_business_cards_name ON business_cards(name);
CREATE INDEX idx_business_cards_company ON business_cards(company);
CREATE INDEX idx_coworkers_name ON coworkers(name);
CREATE INDEX idx_coworkers_department_id ON coworkers(department_id);

-- サンプルデータの挿入
-- 部署データ（サンプル）
INSERT INTO coworkers (name, position, email, department_id) VALUES
('山田太郎', '営業部長', 'yamada@company.com', 1),
('佐藤花子', '営業担当', 'sato@company.com', 1),
('田中一郎', '技術部長', 'tanaka@company.com', 2),
('鈴木美咲', '技術担当', 'suzuki@company.com', 2);

-- 認証ユーザー（パスワードは'password'をハッシュ化したもの）
INSERT INTO auth_users (coworker_id, password_hash) VALUES
(1, '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW'), -- password
(2, '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW'), -- password
(3, '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW'), -- password
(4, '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW'); -- password

-- 外部担当者データ（サンプル）
INSERT INTO business_cards (name, company, department, position) VALUES
('高橋健太', 'ABC商事株式会社', '営業部', '課長'),
('中村由美', 'XYZ技研', '開発部', '主任'),
('小林正雄', '123コンサルティング', '企画部', '部長'),
('松本あかり', 'DEFシステムズ', '営業部', '担当');