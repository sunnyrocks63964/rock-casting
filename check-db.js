/**
 * データベースのテーブル存在確認スクリプト
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkTables() {
  try {
    console.log('🔍 データベース接続を確認中...\n');

    // Userテーブルから1件取得してみる（存在確認）
    const userCount = await prisma.$queryRaw`
      SELECT COUNT(*) as count FROM users;
    `;
    
    console.log('✅ Userテーブル: 存在します');
    console.log(`   レコード数: ${userCount[0].count}\n`);

    // CasterProfileテーブル確認
    const casterCount = await prisma.$queryRaw`
      SELECT COUNT(*) as count FROM caster_profiles;
    `;
    console.log('✅ CasterProfileテーブル: 存在します');
    console.log(`   レコード数: ${casterCount[0].count}\n`);

    // OrdererProfileテーブル確認
    const ordererCount = await prisma.$queryRaw`
      SELECT COUNT(*) as count FROM orderer_profiles;
    `;
    console.log('✅ OrdererProfileテーブル: 存在します');
    console.log(`   レコード数: ${ordererCount[0].count}\n`);

    // テーブル一覧を取得
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `;
    
    console.log('📋 作成されているテーブル一覧:');
    tables.forEach((table) => {
      console.log(`   - ${table.table_name}`);
    });

  } catch (error) {
    console.error('❌ エラーが発生しました:', error.message);
    if (error.message.includes('does not exist')) {
      console.error('   テーブルが存在しない可能性があります');
    }
  } finally {
    await prisma.$disconnect();
  }
}

checkTables();

