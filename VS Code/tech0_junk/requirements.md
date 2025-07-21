
「面談アプリ」の作成

社外の担当者とのミーティングを登録するアプリを構築します。
必要となる設計、プログラムの作成をお願いします。

# フレームワーク
・フロントはNEXT.js、バックはFastAPIを前提に構築してください。
・データベースはSupabase、デプロイはRenderにて構築してください。
・前提とするソフトウェア情報（pip install fastapi uvicorn requests sqlalchemy pandas numpy graphene python-dotenv pymysql openai psycopg2-binary ）

#画面イメージ
1.構成
画面左側にメニューボタンを配置

2.デザイン
・柔らかい色使い水色を基本とし、色の強弱は付けるが同系色で作成する。
・オブジェクトの角は少しだけ丸みを入れる。

# 画面毎のアプリ機能
1.ログイン画面
	入力項目：id：数字、パスワード（*マスク表示）
	ログインボタン処理：
	・入力されたパスワードをハッシュ化し、auth_usersのpassword_hashと比較
				OK：auth_usersの最終ログイン日時を更新して、2.トップメニューを表示
				NG：エラーメッセージ「ログインできませんでした」を表示しリフレッシュ

2.トップメニュー
	左側メニューに以下のボタンを配置
	・【+新規作成】、【下書き】、【作成履歴】、【検索】、【ログアウト】
	・ボタンクリック時にそれぞれの画面を起動する

3.+新規作成画面
	入力項目は以下の通り
		・日時：選択入力
		・場所：直接入力
		・担当者：クリック時に3-1.検索画面を表示。検索画面の結果から値をセット。
		・企業名：担当者と同様の処理
		（担当者、企業名は複数セット入力可能とし、+ボタンで追加、×ボタンで当該セットを削除可能とする）
		・同席：クリック時に3-2.検索画面を表示。
		（同席は複数入力可能とし、+ボタンで追加、×ボタンで当該同席を削除可能とする）
		・タイトル：直接入力
		・打ち合わせ内容：直接入力（改行可）
		（要約ボタンクリック時に「打ち合わせ内容」をChatGPTに要約させ「打ち合わせサマリー」に表示）
		・打ち合わせサマリー：要約結果を表示。変更可能。
	
	画面上部に以下の3つボタンを配置
			
	○【保存】ボタン：
		contactsテーブル、contact_personテーブル、contact_companionsテーブルに保存
		（contact_person、contact_companionsは削除・追加）
		
		contactsテーブル
			contacts.idのデータがない場合はデータinsert
			contacts.idのデータがある場合はデータupdate
			更新項目
				contacts. contact_date（日時）
				contacts.created_at（現在日時）
				contacts.summary_text（打ち合わせ内容要約）
				contacts.raw_text（打ち合わせ内容）
				contacts.title（タイトル）
				statusに1をセット
				ログイン画面で入力したidでcoworkersテーブルのidで検索してヒットしたデータのdepartment_idをセット

				contacts. coworker_id（同席）
				
		contact_companionsテーブル
				contacts.idと同じcontact_companions. contact_idのデータを削除
			追加項目
				contact_companions. contact_id（contacts.id）
				contact_companions.coworker_id

		contact_personテーブル
				contacts.idと同じcontact_person. idのデータを削除
			追加項目
				contact_person. contact_id（contacts.id）
				contact_person.business_card_id

		トップメニューにもどる
		
	○【下書き】ボタン：
			更新項目
				contacts. contact_date（日時）
				contacts.created_at（現在日時）
				contacts.summary_text（打ち合わせ内容要約）
				contacts.raw_text（打ち合わせ内容）
				contacts.title（タイトル）
				statusに0をセット
				ログイン画面で入力したidでcoworkersテーブルのidで検索してヒットしたデータのdepartment_idをセット
				
		contact_companionsテーブル
				contacts.idと同じcontact_companions. contact_idのデータを削除
			追加項目
				contact_companions. contact_id（contacts.id）
				contact_companions.coworker_id（同席）

		contact_personテーブル
				contacts.idと同じcontact_person. idのデータを削除
			追加項目
				contact_person. contact_id（contacts.id）
				contact_person.business_card_id（担当者）

			トップメニューにもどる

	○【破棄】ボタン：
		statusは9をセット
		トップメニューにもどる

	3-1.検索画面（外部）
		入力項目：
			検索キーワード

		検索ボタン：business_cardsテーブルのcompanyかnameから部分一致検索を行い、検索結果を一覧で表示する。
		一覧表示：
		・検索結果を5件ずつ表示し「次へ」マークで次ページ、「前へ」マークで前ページに遷移
		・表示項目は氏名（business_cards.name）、会社名（business_cards. company）とその左横にそれぞれ選択ボタンをセット
		・内部的にはbusiness_card_idもセット
			
		選択ボタン：「メッセージBOX」で確認（OK,NG）後OKであれば、氏名を新規作成画面の担当者に、会社名を新規作成画面の企業名にセットして+新規作成画面に戻る。

	3-2.検索画面（内部）
		入力項目：
			検索キーワード
		検索ボタン：coworkersテーブルのnameから部分一致検索を行い、検索結果を一覧で表示する。
		一覧表示：
		・検索結果を5件ずつ表示し「次へ」マークで次ページ、「前へ」マークで前ページに遷移
		・表示項目は氏名(coworkers. name)、部署名（coworkers.department）その左横にそれぞれ選択ボタンをセット

		選択ボタン：「メッセージBOX」で確認（OK,NG）後OKであれば、氏名を新規作成画面の担当者にセットして+新規作成画面に戻る。
		
4.下書き一覧画面
	表示対象：
		contacts.coworker_idがログインした自分のIDであるものかつ
		statusが0であるもの。
	表示項目：
		面談日：contacts.contact_date
		打ち合わせタイトル：contacts.tiitle
	
	・検索結果を10件ずつ表示し「次へ」マークで次ページ、「前へ」マークで前ページに遷移
・表示項目その右横にそれぞれ【編集】ボタンと【破棄】ボタンをセット

	【編集】ボタンクリック時
		・当該contacts.id、contact_companions. contact_id、contact_person. contact_idのデータから「+新規作成画面」を作成して表示。

	【破棄】ボタンクリック時
		・当該contacts.idのデータのstatusに9をセット
		・下書き一覧画面を再表示
		
5.作成履歴画面
	表示対象：
		contacts.coworker_idがログインした自分のIDであるものかつ
		statusが1であるもの。
	表示項目：
		面談日：contacts.contact_date
		打ち合わせタイトル：contacts.tiitle
	
	・検索結果を10件ずつ表示し「次へ」マークで次ページ、「前へ」マークで前ページに遷移
・表示項目その右横にそれぞれ【参照】ボタンと【破棄】ボタンをセット

	【参照】ボタンクリック時
		・当該contacts.id、contact_companions. contact_id、contact_person. contact_idのデータから「参照画面」を作成して表示。

	【破棄】ボタンクリック時
		・当該contacts.idのデータのstatusに9をセット
		・作成履歴画面を再表示
		
	○作成履歴参照画面
		表示項目
			・日時
			・場所
			・担当者（複数セット）
			・企業名（複数セット）
			・同席（複数セット）
			・タイトル
			・打ち合わせ内容要約
			・打ち合わせ内容
		作成者本人の場合は【編集】ボタンを表示し、クリック後は編集可とし【保存】ボタンで保存し作成履歴結果に戻る。
		【閉じる】ボタンで作成履歴結果に戻る。

6.検索画面
	入力項目：
		検索ワード
	検索ボタン
		検索ボタンクリック時に以下の通り検索結果を表示する
		
	表示対象：
		contacts.department_idがログイン者のdepartment_idであるもの、かつ
		担当者もしくはタイトルに検索ワードが含まれるももの、かつ
		statusが1であるもの。
	表示項目：
		作成者
		面談日
		打ち合わせタイトル
		
	・検索結果を10件ずつ表示し「次へ」マークで次ページ、「前へ」マークで前ページに遷移
	・面談日の降順で表示
	・各表示項目の右横にそれぞれ【参照】ボタンをセットし、参照ボタンクリック時に参照画面を表示

	○参照画面
		表示項目
			・日時
			・場所
			・担当者（複数セット）
			・企業名（複数セット）
			・同席（複数セット）
			・タイトル
			・打ち合わせ内容要約
		【閉じる】ボタンで検索画面に戻る。
		
# データベース
Table business_cards {
  id int [pk, increment]
  name varchar(255) [not null, note: '担当']
  company varchar(255) [not null, note: '企業名']
  department varchar(255) [note: '所属部署']
  position varchar(255) [note: '役職']
  memo text [note: '名刺自体に紐づく簡易メモ']
}

Table contacts {
  id int [pk, increment]
  contact_date date [note: '面談実施日']
  created_at datetime [default: `CURRENT_TIMESTAMP`, note: '記録日時']
  title varchar(255) [note: 'タイトル']
  summary_text text [note: '打ち合わせ内容の要約']
  raw_text text [note: '打ち合わせ内容']
  details text [note: '面談の詳細']
  status int ['1保存完了、0時保存、9破棄']
  department_id int ['部署コード']
}

Table contact_person {
  contact_id int [ref: > contacts.id, not null]
  business_card_id int [ref: > business_cards.id, not null ,note: '担当のid']
  indexes {
    (contact_id, business_card_id) [pk]
  }
}

Table contact_companions {
  contact_id int [ref: > contacts.id, not null]
  coworker_id int [ref: > coworkers.id, not null, note: '同行した社内メンバーID']
  indexes {
    (contact_id, coworker_id) [pk]
  }
}

Table coworkers {
  id int [pk, increment]
  name varchar(255) [not null, note: '社内メンバー氏名']
  position varchar(255) [note: '役職']
  email varchar(255) [not null, unique, note: '社内メールアドレス']
  sso_id varchar(255) [unique, note: 'SSO識別情報（外部連携用）']
  department_id int ['部署コード']
}

Table auth_users {
  id int [pk, increment]
  coworker_id int [ref: > coworkers.id, not null, unique, note: 'ログイン対象の社内メンバーID']
  password_hash varchar(255) [not null, note: 'ハッシュ化されたログインパスワード']
  last_login datetime [note: '最終ログイン日時']
}

