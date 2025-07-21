# 面談アプリ セットアップガイド

## 前提条件
- Python 3.8+
- Node.js 18+
- PostgreSQL データベース（Supabase推奨）

## バックエンドのセットアップ

1. **仮想環境の作成（推奨）**
```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
```

2. **依存関係のインストール**
```bash
pip install -r requirements.txt
```

3. **環境変数の設定**
`.env`ファイルを作成し、以下を設定:
```
DATABASE_URL=postgresql://username:password@localhost:5432/meeting_app
OPENAI_API_KEY=your_openai_api_key
JWT_SECRET_KEY=your_secret_key_here
```

4. **データベースのセットアップ**
- Supabaseでプロジェクトを作成
- `database/schema.sql`をSQL Editorで実行

5. **サーバーの起動**
```bash
uvicorn main:app --reload
```

## フロントエンドのセットアップ

1. **依存関係のインストール**
```bash
cd frontend
npm install
```

2. **環境変数の設定**
`.env.local`ファイルを作成:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

3. **開発サーバーの起動**
```bash
npm run dev
```

## アクセス方法

- フロントエンド: http://localhost:3000
- バックエンドAPI: http://localhost:8000
- API ドキュメント: http://localhost:8000/docs

## テストアカウント

データベースを設定後、以下のアカウントでログイン可能:
- ID: 1, パスワード: password (山田太郎)
- ID: 2, パスワード: password (佐藤花子)
- ID: 3, パスワード: password (田中一郎)
- ID: 4, パスワード: password (鈴木美咲)

## トラブルシューティング

### ログインできない場合
1. バックエンドサーバーが起動していることを確認
2. データベースに接続できることを確認
3. 環境変数が正しく設定されていることを確認
4. ブラウザのDevToolsでネットワークエラーを確認

### CORS エラーが発生する場合
- `backend/main.py`のCORS設定でフロントエンドのURLが許可されていることを確認

### データベース接続エラーの場合
- DATABASE_URLが正しく設定されていることを確認
- PostgreSQLサーバーが起動していることを確認