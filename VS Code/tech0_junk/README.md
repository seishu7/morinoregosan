# 面談管理アプリ

## 概要
外部との面談記録を管理するWebアプリケーションです。

## 技術スタック
- **フロントエンド**: Next.js 14 + TypeScript + Tailwind CSS
- **バックエンド**: FastAPI + Python
- **データベース**: PostgreSQL (Supabase)
- **認証**: JWT
- **AI機能**: OpenAI GPT-3.5-turbo（要約機能）

## 主な機能
- ユーザー認証・ログイン
- 面談記録の作成・編集・削除
- 担当者・同席者の管理
- AI要約機能（OpenAI API）
- 検索機能
- 下書き・完了済みの管理

## セットアップ

### 1. 環境変数の設定

#### バックエンド (.env)
```bash
# データベース設定
DATABASE_URL=postgresql://username:password@hostname:port/database_name

# JWT設定
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# OpenAI API設定
OPENAI_API_KEY=your_openai_api_key_here
```

#### フロントエンド (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 2. バックエンドの起動

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windowsの場合: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 3. フロントエンドの起動

```bash
cd frontend
npm install
npm run dev
```

### 4. OpenAI機能のテスト

```bash
cd backend
python test_openai.py
```

## API仕様

### 認証
- `POST /api/auth/login` - ログイン
- `POST /api/auth/logout` - ログアウト

### 面談記録
- `POST /api/contacts/` - 面談記録作成
- `PUT /api/contacts/{id}` - 面談記録更新
- `GET /api/contacts/{id}` - 面談記録取得
- `DELETE /api/contacts/{id}` - 面談記録削除
- `GET /api/contacts/drafts` - 下書き一覧
- `GET /api/contacts/history` - 作成履歴一覧
- `POST /api/contacts/search` - 面談記録検索
- `POST /api/contacts/summarize` - AI要約生成

### その他
- `GET /api/business-cards/` - 名刺一覧
- `GET /api/coworkers/` - 社内メンバー一覧

## データベーススキーマ

### テーブル構成
- `contacts` - 面談記録
- `business_cards` - 外部担当者（名刺）
- `coworkers` - 社内メンバー
- `auth_users` - 認証情報
- `contact_person` - 面談-担当者関連
- `contact_companions` - 面談-同席者関連

## デプロイ

### Render.com へのデプロイ
1. GitHubリポジトリを作成
2. Render.comでWebサービスを作成
3. 環境変数を設定
4. データベース（PostgreSQL）を作成

## 要約機能について

### OpenAI API設定
1. OpenAIのAPIキーを取得
2. `.env`ファイルに`OPENAI_API_KEY`を設定
3. 使用モデル: `gpt-3.5-turbo`

### 制限事項
- 入力テキスト: 最大10,000文字
- 要約出力: 約300文字以内
- API利用制限に注意

### エラーハンドリング
- APIキー未設定/無効
- 利用制限/課金問題
- レート制限
- ネットワークエラー