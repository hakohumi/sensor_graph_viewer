# Sensor graph viewer

センサーからのデータを受け取ってグラフで表示するサーバー

## Front-End

- Deno + nvo + Vue3で構築する

### TODO

- [ ] グラフを表示する
- [ ] バックエンドからデータを取得できる

## Back-End

Deno + Orkで構築する

### TODO

- [x] REST API のサンプルコードを実装する
  - <https://zenn.dev/azukiazusa/articles/804439f5afabe7>を参考に作成する
- [x] sqlite3を使えるようにする
  - <https://zenn.dev/tkithrta/articles/ceb1c662ce7d75>を参考に作成する
- [x] REST API サーバーとして動作する
- [x] sqlite3で受け取ったデータを保存する
- [x] 機器に応じてデータベース？テーブル？を分ける
- [ ] sqlのテープル構造をクラスと同じにする
- [ ] OpenAPIで記述する
