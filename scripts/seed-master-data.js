/**
 * マスターデータ（Region, Prefecture, TokyoWard）をデータベースに挿入するスクリプト
 * 
 * 使用方法:
 *   node scripts/seed-master-data.js
 */

require("dotenv").config({ path: ".env" });
const { PrismaClient } = require("@prisma/client");

// 環境変数の確認
if (!process.env.DATABASE_URL && !process.env.DIRECT_DATABASE_URL) {
  console.error("❌ エラー: DATABASE_URLまたはDIRECT_DATABASE_URLが設定されていません");
  console.error("   .envファイルにDATABASE_URLを設定してください");
  process.exit(1);
}

// 直接接続を使用（Prisma Data Proxyを回避）
// DIRECT_DATABASE_URLが設定されている場合はそれを使用、なければDATABASE_URLを使用
const databaseUrl = process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("❌ エラー: データベースURLが取得できませんでした");
  process.exit(1);
}

console.log("🔗 データベース接続URL:", databaseUrl.replace(/:[^:@]+@/, ":****@")); // パスワードを隠す

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});

// 地域ブロックデータ
const REGIONS = [
  { code: 1, name: "北海道", nameKana: "ほっかいどう" },
  { code: 2, name: "東北", nameKana: "とうほく" },
  { code: 3, name: "関東", nameKana: "かんとう" },
  { code: 4, name: "中部", nameKana: "ちゅうぶ" },
  { code: 5, name: "近畿", nameKana: "きんき" },
  { code: 6, name: "中国", nameKana: "ちゅうごく" },
  { code: 7, name: "四国", nameKana: "しこく" },
  { code: 8, name: "九州・沖縄", nameKana: "きゅうしゅう・おきなわ" },
];

// 都道府県データ
const PREFECTURES = [
  // 北海道
  { code: 1, regionCode: 1, name: "北海道", nameKana: "ほっかいどう" },
  
  // 東北
  { code: 2, regionCode: 2, name: "青森県", nameKana: "あおもりけん" },
  { code: 3, regionCode: 2, name: "岩手県", nameKana: "いわてけん" },
  { code: 4, regionCode: 2, name: "宮城県", nameKana: "みやぎけん" },
  { code: 5, regionCode: 2, name: "秋田県", nameKana: "あきたけん" },
  { code: 6, regionCode: 2, name: "山形県", nameKana: "やまがたけん" },
  { code: 7, regionCode: 2, name: "福島県", nameKana: "ふくしまけん" },
  
  // 関東
  { code: 8, regionCode: 3, name: "茨城県", nameKana: "いばらきけん" },
  { code: 9, regionCode: 3, name: "栃木県", nameKana: "とちぎけん" },
  { code: 10, regionCode: 3, name: "群馬県", nameKana: "ぐんまけん" },
  { code: 11, regionCode: 3, name: "埼玉県", nameKana: "さいたまけん" },
  { code: 12, regionCode: 3, name: "千葉県", nameKana: "ちばけん" },
  { code: 13, regionCode: 3, name: "東京都", nameKana: "とうきょうと" },
  { code: 14, regionCode: 3, name: "神奈川県", nameKana: "かながわけん" },
  
  // 中部
  { code: 15, regionCode: 4, name: "新潟県", nameKana: "にいがたけん" },
  { code: 16, regionCode: 4, name: "富山県", nameKana: "とやまけん" },
  { code: 17, regionCode: 4, name: "石川県", nameKana: "いしかわけん" },
  { code: 18, regionCode: 4, name: "福井県", nameKana: "ふくいけん" },
  { code: 19, regionCode: 4, name: "山梨県", nameKana: "やまなしけん" },
  { code: 20, regionCode: 4, name: "長野県", nameKana: "ながのけん" },
  { code: 21, regionCode: 4, name: "岐阜県", nameKana: "ぎふけん" },
  { code: 22, regionCode: 4, name: "静岡県", nameKana: "しずおかけん" },
  { code: 23, regionCode: 4, name: "愛知県", nameKana: "あいちけん" },
  
  // 近畿
  { code: 24, regionCode: 5, name: "三重県", nameKana: "みえけん" },
  { code: 25, regionCode: 5, name: "滋賀県", nameKana: "しがけん" },
  { code: 26, regionCode: 5, name: "京都府", nameKana: "きょうとふ" },
  { code: 27, regionCode: 5, name: "大阪府", nameKana: "おおさかふ" },
  { code: 28, regionCode: 5, name: "兵庫県", nameKana: "ひょうごけん" },
  { code: 29, regionCode: 5, name: "奈良県", nameKana: "ならけん" },
  { code: 30, regionCode: 5, name: "和歌山県", nameKana: "わかやまけん" },
  
  // 中国
  { code: 31, regionCode: 6, name: "鳥取県", nameKana: "とっとりけん" },
  { code: 32, regionCode: 6, name: "島根県", nameKana: "しまねけん" },
  { code: 33, regionCode: 6, name: "岡山県", nameKana: "おかやまけん" },
  { code: 34, regionCode: 6, name: "広島県", nameKana: "ひろしまけん" },
  { code: 35, regionCode: 6, name: "山口県", nameKana: "やまぐちけん" },
  
  // 四国
  { code: 36, regionCode: 7, name: "徳島県", nameKana: "とくしまけん" },
  { code: 37, regionCode: 7, name: "香川県", nameKana: "かがわけん" },
  { code: 38, regionCode: 7, name: "愛媛県", nameKana: "えひめけん" },
  { code: 39, regionCode: 7, name: "高知県", nameKana: "こうちけん" },
  
  // 九州・沖縄
  { code: 40, regionCode: 8, name: "福岡県", nameKana: "ふくおかけん" },
  { code: 41, regionCode: 8, name: "佐賀県", nameKana: "さがけん" },
  { code: 42, regionCode: 8, name: "長崎県", nameKana: "ながさきけん" },
  { code: 43, regionCode: 8, name: "熊本県", nameKana: "くまもとけん" },
  { code: 44, regionCode: 8, name: "大分県", nameKana: "おおいたけん" },
  { code: 45, regionCode: 8, name: "宮崎県", nameKana: "みやざきけん" },
  { code: 46, regionCode: 8, name: "鹿児島県", nameKana: "かごしまけん" },
  { code: 47, regionCode: 8, name: "沖縄県", nameKana: "おきなわけん" },
];

// 東京23区データ
const TOKYO_WARDS = [
  { code: 1, name: "千代田区", nameKana: "ちよだく" },
  { code: 2, name: "中央区", nameKana: "ちゅうおうく" },
  { code: 3, name: "港区", nameKana: "みなとく" },
  { code: 4, name: "新宿区", nameKana: "しんじゅくく" },
  { code: 5, name: "文京区", nameKana: "ぶんきょうく" },
  { code: 6, name: "台東区", nameKana: "たいとうく" },
  { code: 7, name: "墨田区", nameKana: "すみだく" },
  { code: 8, name: "江東区", nameKana: "こうとうく" },
  { code: 9, name: "品川区", nameKana: "しながわく" },
  { code: 10, name: "目黒区", nameKana: "めぐろく" },
  { code: 11, name: "大田区", nameKana: "おおたく" },
  { code: 12, name: "世田谷区", nameKana: "せたがやく" },
  { code: 13, name: "渋谷区", nameKana: "しぶやく" },
  { code: 14, name: "中野区", nameKana: "なかのく" },
  { code: 15, name: "杉並区", nameKana: "すぎなみく" },
  { code: 16, name: "豊島区", nameKana: "としまく" },
  { code: 17, name: "北区", nameKana: "きたく" },
  { code: 18, name: "荒川区", nameKana: "あらかわく" },
  { code: 19, name: "板橋区", nameKana: "いたばしく" },
  { code: 20, name: "練馬区", nameKana: "ねりまく" },
  { code: 21, name: "足立区", nameKana: "あだちく" },
  { code: 22, name: "葛飾区", nameKana: "かつしかく" },
  { code: 23, name: "江戸川区", nameKana: "えどがわく" },
];

async function seedMasterData() {
  try {
    console.log("🌱 マスターデータの挿入を開始します...\n");

    // 1. Region（地域ブロック）の挿入
    console.log("📋 Region（地域ブロック）を挿入中...");
    const regionMap = new Map();
    
    for (const regionData of REGIONS) {
      const region = await prisma.region.upsert({
        where: { code: regionData.code },
        update: {
          name: regionData.name,
          nameKana: regionData.nameKana,
        },
        create: {
          code: regionData.code,
          name: regionData.name,
          nameKana: regionData.nameKana,
        },
      });
      regionMap.set(regionData.code, region.id);
      console.log(`  ✓ ${regionData.name} (code: ${regionData.code})`);
    }
    console.log(`✅ ${REGIONS.length}件のRegionを挿入しました\n`);

    // 2. Prefecture（都道府県）の挿入
    console.log("📋 Prefecture（都道府県）を挿入中...");
    const prefectureMap = new Map();
    
    for (const prefData of PREFECTURES) {
      const regionId = regionMap.get(prefData.regionCode);
      if (!regionId) {
        throw new Error(`Region code ${prefData.regionCode} not found`);
      }

      const prefecture = await prisma.prefecture.upsert({
        where: { code: prefData.code },
        update: {
          regionId: regionId,
          name: prefData.name,
          nameKana: prefData.nameKana,
        },
        create: {
          code: prefData.code,
          regionId: regionId,
          name: prefData.name,
          nameKana: prefData.nameKana,
        },
      });
      prefectureMap.set(prefData.code, prefecture.id);
      console.log(`  ✓ ${prefData.name} (code: ${prefData.code})`);
    }
    console.log(`✅ ${PREFECTURES.length}件のPrefectureを挿入しました\n`);

    // 3. TokyoWard（東京23区）の挿入
    console.log("📋 TokyoWard（東京23区）を挿入中...");
    
    for (const wardData of TOKYO_WARDS) {
      await prisma.tokyoWard.upsert({
        where: { code: wardData.code },
        update: {
          name: wardData.name,
          nameKana: wardData.nameKana,
        },
        create: {
          code: wardData.code,
          name: wardData.name,
          nameKana: wardData.nameKana,
        },
      });
      console.log(`  ✓ ${wardData.name} (code: ${wardData.code})`);
    }
    console.log(`✅ ${TOKYO_WARDS.length}件のTokyoWardを挿入しました\n`);

    console.log("🎉 マスターデータの挿入が完了しました！");
    console.log(`   - Region: ${REGIONS.length}件`);
    console.log(`   - Prefecture: ${PREFECTURES.length}件`);
    console.log(`   - TokyoWard: ${TOKYO_WARDS.length}件`);

  } catch (error) {
    console.error("❌ エラーが発生しました:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// スクリプトを実行
seedMasterData()
  .then(() => {
    console.log("\n✅ スクリプトが正常に完了しました");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ スクリプトの実行中にエラーが発生しました:", error);
    process.exit(1);
  });

