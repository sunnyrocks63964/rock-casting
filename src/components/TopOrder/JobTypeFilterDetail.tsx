"use client";

import React from "react";

export type JobType = "photographer" | "model" | "artist" | "creator";

export interface FilterCategory {
    name: string;
    items: string[];
}

export interface JobTypeFilterData {
    [key: string]: FilterCategory;
}

// 職種ごとのフィルター項目データ
export const jobTypeFilterData: Record<JobType, JobTypeFilterData> = {
    photographer: {
        "撮影ジャンル": {
            name: "撮影ジャンル",
            items: [
                "ポートレート撮影",
                "ファッション撮影",
                "ブライダル撮影(挙式・披露宴)",
                "前撮り・フォトウェディング",
                "七五三撮影",
                "成人式撮影",
                "お宮参り・百日祝い",
                "入学・卒業式撮影",
                "マタニティフォト",
                "ニューボーンフォト",
                "家族写真",
                "プロフィール写真(ビジネス)",
                "宣材写真",
                "商品撮影(物撮り)",
                "料理・飲食撮影",
                "不動産撮影",
                "イベント撮影",
                "スポーツ撮影",
                "コンサート・ライブ撮影",
                "企業PR撮影",
                "建築・インテリア撮影",
                "風景・自然撮影",
                "ペット撮影",
                "学校行事撮影",
            ],
        },
        "撮影スタイル": {
            name: "撮影スタイル",
            items: [
                "スタジオ撮影",
                "ロケーション撮影",
                "自然光撮影",
                "ストロボライティング",
                "モノクロ撮影",
                "ドキュメンタリー風",
                "アーティスティック",
                "ナチュラル・カジュアル",
            ],
        },
        "使用機材": {
            name: "使用機材",
            items: [
                "フルサイズ一眼レフ",
                "ミラーレス一眼",
                "中判カメラ",
                "ドローン撮影可能",
                "ストロボ・照明機材保有",
                "レフ板・撮影小物保有",
            ],
        },
        "対応可能範囲": {
            name: "対応可能範囲",
            items: [
                "スタジオ保有",
                "出張撮影可能",
                "遠方出張可能(都道府県選択)",
                "早朝・深夜対応可能",
                "土日祝日対応可能",
                "当日納品可能",
                "データ納品対応",
                "アルバム制作対応",
                "レタッチ・修正対応",
            ],
        },
        "経験年数": {
            name: "経験年数",
            items: [
                "1年未満",
                "1年以上3年未満",
                "3年以上5年未満",
                "5年以上10年未満",
                "10年以上",
            ],
        },
        "料金帯(1時間あたり)": {
            name: "料金帯(1時間あたり)",
            items: [
                "5,000円未満",
                "5,000円〜10,000円",
                "10,000円〜20,000円",
                "20,000円〜30,000円",
                "30,000円〜50,000円",
                "50,000円以上",
            ],
        },
        "言語対応": {
            name: "言語対応",
            items: ["日本語", "英語", "中国語", "韓国語", "その他言語"],
        },
    },
    model: {
        "性別": {
            name: "性別",
            items: ["女性", "男性", "その他"],
        },
        "年齢": {
            name: "年齢",
            items: [
                "0歳〜3歳(ベビー)",
                "4歳〜12歳(キッズ)",
                "13歳〜19歳(ティーン)",
                "20代",
                "30代",
                "40代",
                "50代",
                "60代以上",
            ],
        },
        "身長": {
            name: "身長",
            items: [
                "140cm未満",
                "140cm〜150cm",
                "150cm〜160cm",
                "160cm〜165cm",
                "165cm〜170cm",
                "170cm〜175cm",
                "175cm〜180cm",
                "180cm以上",
            ],
        },
        "体型": {
            name: "体型",
            items: [
                "スリム",
                "細身",
                "標準",
                "グラマラス",
                "ぽっちゃり",
                "マッチョ・筋肉質",
                "アスリート体型",
            ],
        },
        "対応可能ジャンル": {
            name: "対応可能ジャンル",
            items: [
                "ファッションモデル",
                "広告モデル",
                "PRモデル",
                "カタログモデル",
                "ブライダルモデル",
                "パーツモデル",
                "フィットネスモデル",
                "下着・水着モデル",
                "ヘアモデル",
                "コンパニオンモデル",
                "サロンモデル",
                "読者モデル",
                "コスプレモデル",
                "シニアモデル",
                "ママモデル",
                "親子モデル",
            ],
        },
        "特技・スキル": {
            name: "特技・スキル",
            items: [
                "ウォーキング",
                "ポージング",
                "ダンス",
                "アクロバット",
                "ヨガ・ピラティス",
                "楽器演奏",
                "外国語対応可能",
                "表情表現力",
                "演技経験あり",
            ],
        },
        "髪色": {
            name: "髪色",
            items: [
                "黒髪",
                "茶髪(ブラウン)",
                "明るめブラウン",
                "ブロンド",
                "その他カラー",
            ],
        },
        "髪の長さ": {
            name: "髪の長さ",
            items: [
                "ベリーショート",
                "ショート",
                "ミディアム",
                "セミロング",
                "ロング",
            ],
        },
        "特徴": {
            name: "特徴",
            items: [
                "タトゥーあり",
                "ピアスOK",
                "メガネ着用可能",
                "コンタクト使用可能",
                "染髪・カラー変更可能",
                "カット可能",
                "肌の露出OK",
                "肌の露出NG",
            ],
        },
        "経験": {
            name: "経験",
            items: [
                "未経験",
                "1年未満",
                "1年以上3年未満",
                "3年以上5年未満",
                "5年以上",
            ],
        },
        "報酬希望額(1時間あたり)": {
            name: "報酬希望額(1時間あたり)",
            items: [
                "3,000円未満",
                "3,000円〜5,000円",
                "5,000円〜10,000円",
                "10,000円〜20,000円",
                "20,000円〜30,000円",
                "30,000円以上",
            ],
        },
        "活動可能日時": {
            name: "活動可能日時",
            items: [
                "平日のみ",
                "土日祝のみ",
                "平日・土日祝両方可能",
                "早朝対応可能",
                "深夜対応可能",
            ],
        },
    },
    artist: {
        "対応可能メイク": {
            name: "対応可能メイク",
            items: [
                "ナチュラルメイク",
                "ブライダルメイク",
                "成人式メイク",
                "舞台・ステージメイク",
                "特殊メイク",
                "和装メイク",
                "パーティーメイク",
                "撮影用メイク",
                "ビューティーメイク",
                "キャラクターメイク",
                "男性メイク",
                "キッズメイク",
                "シニアメイク",
                "コスプレメイク",
            ],
        },
        "対応可能ヘアスタイリング": {
            name: "対応可能ヘアスタイリング",
            items: [
                "アップスタイル",
                "ダウンスタイル",
                "編み込み・三つ編み",
                "和装ヘア(日本髪含む)",
                "ブライダルヘア",
                "パーティーヘア",
                "ヘアセット",
                "ウィッグセット",
                "エクステンション取付",
                "ヘアアレンジメント",
            ],
        },
        "対応シーン": {
            name: "対応シーン",
            items: [
                "撮影現場",
                "ブライダル",
                "成人式",
                "七五三",
                "卒業式",
                "パーティー・イベント",
                "舞台・ステージ",
                "CM・映像制作",
                "ファッションショー",
                "雑誌撮影",
                "カタログ撮影",
            ],
        },
        "保有資格": {
            name: "保有資格",
            items: [
                "美容師免許",
                "メイクアップ技術検定",
                "日本化粧品検定",
                "ネイリスト技能検定",
                "着付け技能士",
                "その他専門資格",
            ],
        },
        "得意分野": {
            name: "得意分野",
            items: [
                "ナチュラル系",
                "ゴージャス系",
                "クール系",
                "キュート系",
                "エレガント系",
                "モード系",
                "トレンドメイク",
                "年齢層別メイク",
            ],
        },
        "機材・道具": {
            name: "機材・道具",
            items: [
                "プロ用メイク道具一式保有",
                "ヘアアイロン・コテ保有",
                "ドライヤー保有",
                "ウィッグ保有",
                "衣装用小物保有",
            ],
        },
        "対応範囲": {
            name: "対応範囲",
            items: [
                "出張対応可能",
                "スタジオ常駐可能",
                "サロン保有",
                "早朝対応可能",
                "深夜対応可能",
                "複数名同時対応可能",
            ],
        },
        "経験年数": {
            name: "経験年数",
            items: [
                "1年未満",
                "1年以上3年未満",
                "3年以上5年未満",
                "5年以上10年未満",
                "10年以上",
            ],
        },
        "料金帯(1名あたり)": {
            name: "料金帯(1名あたり)",
            items: [
                "5,000円未満",
                "5,000円〜10,000円",
                "10,000円〜20,000円",
                "20,000円〜30,000円",
                "30,000円以上",
            ],
        },
        "言語対応": {
            name: "言語対応",
            items: ["日本語", "英語", "中国語", "韓国語", "その他言語"],
        },
        "スタイリスト - 対応可能スタイリング": {
            name: "スタイリスト - 対応可能スタイリング",
            items: [
                "ファッションスタイリング",
                "広告スタイリング",
                "雑誌スタイリング",
                "CM・映像スタイリング",
                "カタログスタイリング",
                "ブライダルスタイリング",
                "タレント・芸能人スタイリング",
                "個人向けパーソナルスタイリング",
                "イベントスタイリング",
                "ショーウィンドウスタイリング",
                "インテリアスタイリング",
                "フードスタイリング",
            ],
        },
        "スタイリスト - 得意ジャンル": {
            name: "スタイリスト - 得意ジャンル",
            items: [
                "メンズファッション",
                "レディースファッション",
                "キッズファッション",
                "ストリート系",
                "カジュアル系",
                "フォーマル系",
                "モード系",
                "コンサバ系",
                "ヴィンテージ系",
                "ハイブランド",
                "プチプラコーディネート",
            ],
        },
        "スタイリスト - 対応年齢層": {
            name: "スタイリスト - 対応年齢層",
            items: [
                "キッズ(0歳〜12歳)",
                "ティーン(13歳〜19歳)",
                "20代",
                "30代",
                "40代",
                "50代",
                "60代以上",
            ],
        },
        "スタイリスト - 対応シーン": {
            name: "スタイリスト - 対応シーン",
            items: [
                "撮影現場",
                "ファッションショー",
                "雑誌撮影",
                "CM撮影",
                "MV撮影",
                "カタログ撮影",
                "イベント",
                "プライベートコーディネート",
                "ブライダル",
                "ビジネスシーン",
            ],
        },
        "スタイリスト - 提供サービス": {
            name: "スタイリスト - 提供サービス",
            items: [
                "衣装レンタル可能",
                "衣装購入代行",
                "ショッピング同行",
                "ワードローブ診断",
                "パーソナルカラー診断",
                "骨格診断",
                "トータルコーディネート提案",
                "小物・アクセサリー手配",
            ],
        },
        "スタイリスト - 保有在庫": {
            name: "スタイリスト - 保有在庫",
            items: [
                "衣装ストック豊富",
                "アクセサリー多数保有",
                "シューズ各サイズ保有",
                "バッグ・小物保有",
                "ブランド品保有",
            ],
        },
        "スタイリスト - 経験・実績": {
            name: "スタイリスト - 経験・実績",
            items: [
                "1年未満",
                "1年以上3年未満",
                "3年以上5年未満",
                "5年以上10年未満",
                "10年以上",
                "雑誌掲載実績あり",
                "CM制作実績あり",
                "有名人スタイリング実績あり",
            ],
        },
        "スタイリスト - 対応範囲": {
            name: "スタイリスト - 対応範囲",
            items: [
                "出張対応可能",
                "スタジオ常駐可能",
                "ショールーム保有",
                "遠方出張可能",
                "海外ロケ対応可能",
                "複数名同時スタイリング可能",
            ],
        },
        "スタイリスト - 料金帯(1案件あたり)": {
            name: "スタイリスト - 料金帯(1案件あたり)",
            items: [
                "10,000円未満",
                "10,000円〜30,000円",
                "30,000円〜50,000円",
                "50,000円〜100,000円",
                "100,000円以上",
            ],
        },
        "スタイリスト - 言語対応": {
            name: "スタイリスト - 言語対応",
            items: ["日本語", "英語", "中国語", "韓国語", "その他言語"],
        },
    },
    creator: {
        "動画クリエイター - 対応可能ジャンル": {
            name: "動画クリエイター - 対応可能ジャンル",
            items: [
                "企業PR動画",
                "商品紹介動画",
                "サービス紹介動画",
                "ブランディング動画",
                "YouTube動画制作",
                "SNS動画(Instagram、TikTokなど)",
                "ウェディングムービー",
                "イベント撮影・編集",
                "MV(ミュージックビデオ)",
                "ドキュメンタリー",
                "アニメーション",
                "モーショングラフィックス",
                "インタビュー動画",
                "セミナー・講演撮影",
                "不動産紹介動画",
                "学校紹介動画",
                "採用動画",
                "研修・教育動画",
                "ライブ配信",
                "ドローン撮影",
            ],
        },
        "動画クリエイター - 編集スタイル": {
            name: "動画クリエイター - 編集スタイル",
            items: [
                "シンプル・ミニマル",
                "ダイナミック・スピーディー",
                "エモーショナル",
                "ドキュメンタリー風",
                "シネマティック",
                "ポップ・カジュアル",
                "コーポレート",
                "アート・クリエイティブ",
            ],
        },
        "動画クリエイター - 使用ソフト・スキル": {
            name: "動画クリエイター - 使用ソフト・スキル",
            items: [
                "Adobe Premiere Pro",
                "Final Cut Pro",
                "DaVinci Resolve",
                "After Effects(モーショングラフィックス)",
                "Cinema 4D(3DCG)",
                "Photoshop",
                "Illustrator",
                "カラーグレーディング",
                "サウンドデザイン",
                "アニメーション制作",
            ],
        },
        "動画クリエイター - 撮影機材": {
            name: "動画クリエイター - 撮影機材",
            items: [
                "一眼レフ・ミラーレスカメラ",
                "シネマカメラ",
                "ドローン",
                "ジンバル・スタビライザー",
                "プロ用オーディオ機材",
                "照明機材",
                "4K撮影対応",
                "8K撮影対応",
            ],
        },
        "動画クリエイター - 納品形式": {
            name: "動画クリエイター - 納品形式",
            items: [
                "MP4",
                "MOV",
                "AVI",
                "YouTube最適化",
                "Instagram最適化",
                "TikTok最適化",
                "各種SNS対応",
                "4K納品",
                "フルHD納品",
            ],
        },
        "動画クリエイター - 対応範囲": {
            name: "動画クリエイター - 対応範囲",
            items: [
                "企画・構成",
                "台本作成",
                "絵コンテ作成",
                "撮影",
                "編集",
                "カラーグレーディング",
                "MA(音声編集)",
                "テロップ・字幕挿入",
                "BGM・効果音選定",
                "ナレーション収録手配",
                "著作権フリー素材提供",
            ],
        },
        "動画クリエイター - 動画の長さ": {
            name: "動画クリエイター - 動画の長さ",
            items: [
                "15秒以内(SNS短尺)",
                "30秒〜1分",
                "1分〜3分",
                "3分〜5分",
                "5分〜10分",
                "10分〜30分",
                "30分以上",
            ],
        },
        "動画クリエイター - 納期対応": {
            name: "動画クリエイター - 納期対応",
            items: [
                "当日納品可能",
                "3日以内",
                "1週間以内",
                "2週間以内",
                "1ヶ月以内",
                "相談に応じる",
            ],
        },
        "動画クリエイター - 経験年数": {
            name: "動画クリエイター - 経験年数",
            items: [
                "1年未満",
                "1年以上3年未満",
                "3年以上5年未満",
                "5年以上10年未満",
                "10年以上",
            ],
        },
        "動画クリエイター - 料金帯(1本あたり)": {
            name: "動画クリエイター - 料金帯(1本あたり)",
            items: [
                "30,000円未満",
                "30,000円〜50,000円",
                "50,000円〜100,000円",
                "100,000円〜200,000円",
                "200,000円〜500,000円",
                "500,000円以上",
            ],
        },
        "動画クリエイター - 言語対応": {
            name: "動画クリエイター - 言語対応",
            items: [
                "日本語",
                "英語",
                "中国語",
                "韓国語",
                "多言語字幕対応",
                "その他言語",
            ],
        },
        "WEBデザイナー - 対応可能デザイン": {
            name: "WEBデザイナー - 対応可能デザイン",
            items: [
                "ロゴデザイン",
                "名刺デザイン",
                "チラシ・フライヤー",
                "ポスター",
                "パンフレット・カタログ",
                "会社案内",
                "Webサイトデザイン",
                "LP(ランディングページ)",
                "バナーデザイン",
                "SNSヘッダー・投稿画像",
                "パッケージデザイン",
                "商品ラベル",
                "ブックデザイン(装丁)",
                "雑誌・編集デザイン",
                "イラスト制作",
                "キャラクターデザイン",
                "アイコン・ピクトグラム",
                "インフォグラフィック",
                "プレゼン資料デザイン",
                "DM(ダイレクトメール)",
                "年賀状・挨拶状",
                "メニュー表",
                "看板・サインデザイン",
                "展示会ブースデザイン",
                "UIデザイン",
                "UXデザイン",
            ],
        },
        "WEBデザイナー - デザインスタイル": {
            name: "WEBデザイナー - デザインスタイル",
            items: [
                "ミニマル・シンプル",
                "モダン",
                "クラシック・エレガント",
                "ポップ・カジュアル",
                "レトロ・ヴィンテージ",
                "和風・和モダン",
                "ラグジュアリー",
                "ナチュラル・オーガニック",
                "インダストリアル",
                "スポーティ",
                "ガーリー・フェミニン",
                "クール・スタイリッシュ",
            ],
        },
        "WEBデザイナー - 使用ソフト・スキル": {
            name: "WEBデザイナー - 使用ソフト・スキル",
            items: [
                "Adobe Illustrator",
                "Adobe Photoshop",
                "Adobe InDesign",
                "Adobe XD",
                "Figma",
                "Sketch",
                "Canva Pro",
                "HTML/CSS",
                "WordPress",
                "タイポグラフィ",
                "レイアウトデザイン",
                "カラーコーディネート",
            ],
        },
        "WEBデザイナー - 対応業種": {
            name: "WEBデザイナー - 対応業種",
            items: [
                "飲食店",
                "美容・サロン",
                "アパレル・ファッション",
                "医療・クリニック",
                "不動産",
                "IT・テクノロジー",
                "教育・スクール",
                "士業(弁護士、税理士等)",
                "製造業",
                "小売・EC",
                "ホテル・宿泊施設",
                "イベント・エンタメ",
                "スポーツ・フィットネス",
                "金融",
                "公共機関",
            ],
        },
        "WEBデザイナー - 納品形式": {
            name: "WEBデザイナー - 納品形式",
            items: [
                "AI(Illustrator)",
                "PSD(Photoshop)",
                "PDF",
                "JPEG/PNG",
                "SVG",
                "EPS",
                "印刷用データ(入稿データ)",
                "Web用データ",
            ],
        },
        "WEBデザイナー - 提供サービス": {
            name: "WEBデザイナー - 提供サービス",
            items: [
                "ブランディング全体設計",
                "ロゴ使用ガイドライン作成",
                "印刷手配代行",
                "著作権譲渡対応",
                "修正回数無制限",
                "ストックフォト手配",
                "コピーライティング",
                "多言語対応デザイン",
            ],
        },
        "WEBデザイナー - 対応範囲": {
            name: "WEBデザイナー - 対応範囲",
            items: [
                "コンセプト設計",
                "ラフ案作成",
                "デザイン制作",
                "修正対応",
                "印刷入稿",
                "コーディング(Web)",
                "納品後サポート",
            ],
        },
        "WEBデザイナー - 経験・実績": {
            name: "WEBデザイナー - 経験・実績",
            items: [
                "1年未満",
                "1年以上3年未満",
                "3年以上5年未満",
                "5年以上10年未満",
                "10年以上",
                "受賞歴あり",
                "大手企業実績あり",
                "海外プロジェクト実績あり",
            ],
        },
        "WEBデザイナー - 納期対応": {
            name: "WEBデザイナー - 納期対応",
            items: [
                "即日対応可能",
                "3日以内",
                "1週間以内",
                "2週間以内",
                "1ヶ月以内",
                "相談に応じる",
            ],
        },
        "WEBデザイナー - 料金帯": {
            name: "WEBデザイナー - 料金帯",
            items: [
                "10,000円未満",
                "10,000円〜30,000円",
                "30,000円〜50,000円",
                "50,000円〜100,000円",
                "100,000円〜300,000円",
                "300,000円以上",
            ],
        },
        "WEBデザイナー - 言語対応": {
            name: "WEBデザイナー - 言語対応",
            items: ["日本語", "英語", "中国語", "韓国語", "その他言語"],
        },
    },
};

export interface JobTypeFilterDetailProps {
    jobType: JobType;
    selectedFilters: Record<string, string[]>;
    onFilterChange: (category: string, items: string[]) => void;
    onClose: () => void;
}

const JobTypeFilterDetail: React.FC<JobTypeFilterDetailProps> = ({
    jobType,
    selectedFilters,
    onFilterChange,
    onClose,
}) => {
    const jobTypeLabels: Record<JobType, string> = {
        photographer: "フォトグラファー",
        model: "モデル",
        artist: "アーティスト",
        creator: "クリエイター",
    };

    const filterData = jobTypeFilterData[jobType];
    const categories = Object.values(filterData);

    const handleSelectAll = (category: string, items: string[]) => {
        const currentSelected = selectedFilters[category] || [];
        const allSelected = currentSelected.length === items.length;
        
        if (allSelected) {
            // すべて選択されている場合はすべて解除
            onFilterChange(category, []);
        } else {
            // すべて選択されていない場合はすべて選択
            onFilterChange(category, [...items]);
        }
    };

    const handleItemToggle = (category: string, item: string) => {
        const currentSelected = selectedFilters[category] || [];
        const isSelected = currentSelected.includes(item);
        
        if (isSelected) {
            onFilterChange(
                category,
                currentSelected.filter((i) => i !== item)
            );
        } else {
            onFilterChange(category, [...currentSelected, item]);
        }
    };

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 1000,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
            }}
            onClick={onClose}
        >
            <div
                style={{
                    backgroundColor: "white",
                    borderRadius: "10px",
                    maxWidth: "800px",
                    width: "100%",
                    maxHeight: "90vh",
                    overflowY: "auto",
                    padding: "30px",
                    position: "relative",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* 閉じるボタン */}
                <button
                    onClick={onClose}
                    style={{
                        position: "absolute",
                        top: "20px",
                        right: "20px",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "0",
                        fontSize: "24px",
                        color: "black",
                    }}
                    aria-label="閉じる"
                >
                    ×
                </button>

                {/* タイトル */}
                <h2
                    style={{
                        fontSize: "20px",
                        fontWeight: "700",
                        color: "black",
                        marginBottom: "30px",
                        fontFamily: "'Noto Sans JP', sans-serif",
                    }}
                >
                    {jobTypeLabels[jobType]} 絞り込み
                </h2>

                {/* カテゴリごとのフィルター */}
                <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
                    {categories.map((category) => {
                        const categoryKey = category.name;
                        const selectedItems = selectedFilters[categoryKey] || [];
                        const allSelected = selectedItems.length === category.items.length;

                        return (
                            <div key={categoryKey}>
                                {/* カテゴリ名とすべて選択ボタン */}
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        marginBottom: "16px",
                                        paddingBottom: "12px",
                                        borderBottom: "1px solid #e5e5e5",
                                    }}
                                >
                                    <h3
                                        style={{
                                            fontSize: "16px",
                                            fontWeight: "700",
                                            color: "black",
                                            fontFamily: "'Noto Sans JP', sans-serif",
                                        }}
                                    >
                                        {category.name}
                                    </h3>
                                    <button
                                        onClick={() =>
                                            handleSelectAll(categoryKey, category.items)
                                        }
                                        style={{
                                            fontSize: "12px",
                                            color: "#d70202",
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                            fontFamily: "'Noto Sans JP', sans-serif",
                                            textDecoration: "underline",
                                        }}
                                    >
                                        {allSelected ? "すべて解除" : "すべて選択"}
                                    </button>
                                </div>

                                {/* チェックボックス項目 */}
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "12px",
                                    }}
                                >
                                    {category.items.map((item) => {
                                        const isSelected = selectedItems.includes(item);
                                        return (
                                            <label
                                                key={item}
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "8px",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        position: "relative",
                                                        width: "18px",
                                                        height: "18px",
                                                        borderRadius: "3px",
                                                        border: "1px solid black",
                                                        backgroundColor: isSelected ? "#d70202" : "white",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        flexShrink: 0,
                                                    }}
                                                >
                                                    {isSelected && (
                                                        <svg
                                                            width="12"
                                                            height="12"
                                                            viewBox="0 0 12 12"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                d="M2 6L5 9L10 2"
                                                                stroke="white"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                    )}
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() =>
                                                        handleItemToggle(categoryKey, item)
                                                    }
                                                    style={{
                                                        position: "absolute",
                                                        opacity: 0,
                                                        width: 0,
                                                        height: 0,
                                                    }}
                                                />
                                                <span
                                                    style={{
                                                        fontSize: "14px",
                                                        color: "black",
                                                        fontFamily: "'Noto Sans JP', sans-serif",
                                                    }}
                                                >
                                                    {item}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* 確定ボタン */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "30px",
                        gap: "12px",
                    }}
                >
                    <button
                        onClick={onClose}
                        style={{
                            backgroundColor: "#d70202",
                            color: "white",
                            border: "none",
                            borderRadius: "90px",
                            padding: "12px 40px",
                            fontSize: "16px",
                            fontWeight: "700",
                            fontFamily: "'Noto Sans JP', sans-serif",
                            cursor: "pointer",
                        }}
                    >
                        確定
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JobTypeFilterDetail;

