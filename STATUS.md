# NBA Tip-Off Time

- フェーズ: 運用 / 26-27シーズン対応
- 状態: 作業中
- 概要: NBA全30チームの日程を日本時間で表示し、カレンダー追加できるWebサイト（https://nba-tipoff-time.vercel.app）

## 完了
- [x] Next.js でサイト構築（トップ・チーム別日程・週間スケジュール・使い方ページ）
- [x] NBA公式CDNからの日程取得（1時間キャッシュ）
- [x] Googleカレンダー追加リンク / .ics ダウンロード
- [x] お気に入りチーム・テーマ切り替え
- [x] Vercel デプロイ

## 作業中
- [ ] 26-27シーズン対応（変更計画を提示済み・承認待ち）

## 次にやること
- [ ] MonthFilter.js の月ラベルを年固定ではなくキーから自動生成にする
- [ ] calendar.js の「NBA 2025-26 シーズン」を試合日から自動判定にする
- [ ] layout.tsx / team/[slug]/page.tsx のSEO説明文を 2026-27 に更新
- [ ] 本番サイトで26-27のデータが表示されるか確認

## メモ
- 試合データはCDN（scheduleLeagueV2.json）から自動取得のため、シーズンが切り替わればデータは自動で反映される。直す必要があるのは固定表記のみ
- ローカル（この環境）からはCDNが「Access Denied」になる。動作確認は本番サイトかブラウザで行う
- GitHub: https://github.com/m1gawar1/NBA-Schedule
