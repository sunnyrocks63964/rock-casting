/**
 * データベース接続とテーブル確認スクリプト
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function verifyDatabase() {
  try {
    console.log('🔍 データベース接続を確認中...\n');

    // 1. 接続テスト
    await prisma.$connect();
    console.log('✅ データベース接続成功\n');

    // 2. Userテーブルの存在確認
    try {
      const userCount = await prisma.user.count();
      console.log(`✅ usersテーブル: 存在します (レコード数: ${userCount})`);
    } catch (error) {
      console.log('❌ usersテーブル: 存在しません');
      throw error;
    }

    // 3. CasterProfileテーブルの存在確認
    try {
      const casterCount = await prisma.casterProfile.count();
      console.log(`✅ caster_profilesテーブル: 存在します (レコード数: ${casterCount})`);
    } catch (error) {
      console.log('❌ caster_profilesテーブル: 存在しません');
    }

    // 4. OrdererProfileテーブルの存在確認
    try {
      const ordererCount = await prisma.ordererProfile.count();
      console.log(`✅ orderer_profilesテーブル: 存在します (レコード数: ${ordererCount})`);
    } catch (error) {
      console.log('❌ orderer_profilesテーブル: 存在しません');
    }

    // 5. テーブル構造の確認
    console.log('\n📋 usersテーブルの構造:');
    const sampleUser = await prisma.user.findFirst();
    if (sampleUser) {
      console.log('   サンプルデータ:', JSON.stringify(sampleUser, null, 2));
    } else {
      console.log('   (データなし)');
    }

    console.log('\n✅ データベース確認完了！');

  } catch (error) {
    console.error('\n❌ エラーが発生しました:');
    console.error('   メッセージ:', error.message);
    console.error('   詳細:', error);
  } finally {
    await prisma.$disconnect();
    console.log('\n🔌 データベース接続を閉じました');
  }
}

verifyDatabase();

