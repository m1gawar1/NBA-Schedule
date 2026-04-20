import type { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "使い方 | NBA Tip-Off Time",
  description: "NBA Tip-Off Time の使い方ガイド",
};

export default function HowToPage() {
  return (
    <div className="container">
      <div className={styles.header}>
        <p className={styles.eyebrow}>GUIDE</p>
        <h1 className={styles.title}>使い方</h1>
      </div>

      <div className={styles.sections}>

        {/* 1. 日程を確認する */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.num}>01</span>
            <h2 className={styles.sectionTitle}>日程を確認する</h2>
          </div>
          <div className={styles.body}>
            <p>トップページでは、選択した日の全チームの試合を<strong>日本時間</strong>で確認できます。</p>
            <ul className={styles.list}>
              <li><kbd>&lt;</kbd> <kbd>&gt;</kbd> ボタンで前後の日に移動できます。</li>
              <li>日付部分をクリックするとカレンダーが表示され、任意の日にジャンプできます。</li>
              <li>今日以外の日を表示しているときは「今日に戻る」ボタンが表示されます。</li>
            </ul>
          </div>
        </section>

        {/* 2. チームごとの日程 */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.num}>02</span>
            <h2 className={styles.sectionTitle}>チームごとの日程を見る</h2>
          </div>
          <div className={styles.body}>
            <p>トップページ下部のチーム一覧から、見たいチームをクリックするとそのチームのシーズン全日程ページに移動します。</p>
            <ul className={styles.list}>
              <li>月別タブでフィルタリングができます（10月〜4月 / プレーオフ）。</li>
              <li>終了した試合はスコアが表示されます。</li>
              <li>★ボタンでお気に入り登録ができます（ブラウザに保存）。</li>
            </ul>
          </div>
        </section>

        {/* 3. Googleカレンダーに追加 */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.num}>03</span>
            <h2 className={styles.sectionTitle}>Googleカレンダーに追加する</h2>
          </div>
          <div className={styles.body}>
            <p>各試合カードの「Googleカレンダーに追加」ボタンを押すと、Googleカレンダーのイベント作成画面が開きます。</p>
            <ul className={styles.list}>
              <li>ログイン不要・OAuth認証不要でそのまま追加できます。</li>
              <li>試合時間は日本時間で自動設定されます。</li>
              <li>試合時間は2.5時間で設定されています。</li>
            </ul>
          </div>
        </section>

        {/* 4. .icsダウンロード */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.num}>04</span>
            <h2 className={styles.sectionTitle}>.ics ファイルをダウンロードする</h2>
          </div>
          <div className={styles.body}>
            <p>チームページの「全試合 .ics ダウンロード」ボタンから、シーズン全試合をまとめてカレンダーアプリに取り込めます。<strong>PC のみ対応</strong>しています。</p>
            <ul className={styles.list}>
              <li>月フィルターで絞り込んだ試合だけをダウンロードすることも可能です。</li>
            </ul>
            <p className={styles.guideLabel}>各アプリへの取り込み方：</p>
            <ul className={styles.list}>
              <li>
                <a href="https://support.google.com/calendar/answer/37118?hl=ja&co=GENIE.Platform%3DDesktop" target="_blank" rel="noopener noreferrer" className={styles.link}>
                  Google カレンダーへの取り込み方
                </a>
              </li>
              <li>
                <a href="https://support.microsoft.com/ja-jp/office/outlook-%E3%81%AB%E4%BA%88%E5%AE%9A%E8%A1%A8%E3%82%92%E3%82%A4%E3%83%B3%E3%83%9D%E3%83%BC%E3%83%88%E3%81%99%E3%82%8B-8e8364e1-400e-4c0f-a573-fe76b5a2d379" target="_blank" rel="noopener noreferrer" className={styles.link}>
                  Outlook への取り込み方
                </a>
              </li>
              <li>
                <a href="https://support.apple.com/ja-jp/guide/calendar/icl1023/mac" target="_blank" rel="noopener noreferrer" className={styles.link}>
                  Apple カレンダーへの取り込み方
                </a>
              </li>
            </ul>
          </div>
        </section>

        {/* 5. ダーク / ライト切り替え */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.num}>05</span>
            <h2 className={styles.sectionTitle}>テーマを切り替える</h2>
          </div>
          <div className={styles.body}>
            <p>ヘッダー右上の ☀ / ☽ ボタンでダークモードとライトモードを切り替えられます。設定はブラウザに保存されます。</p>
          </div>
        </section>

        {/* データについて */}
        <section className={`${styles.section} ${styles.note}`}>
          <div className={styles.sectionHeader}>
            <span className={styles.num}>※</span>
            <h2 className={styles.sectionTitle}>データについて</h2>
          </div>
          <div className={styles.body}>
            <p>試合データはNBA公式CDNから取得しており、1時間ごとに更新されます。プレーオフの時間未定（TBD）試合は翌日（日本時間）に仮表示されます。</p>
          </div>
        </section>

      </div>
    </div>
  );
}
