"use client";

import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-black border-t border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* サービス */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">サービス</h3>
            <nav className="flex flex-col space-y-2">
              <Link
                href="/"
                className="text-gray-300 hover:text-white transition-colors"
              >
                トップページ
              </Link>
              <Link
                href="/register/cast"
                className="text-gray-300 hover:text-white transition-colors"
              >
                仕事を受ける
              </Link>
              <Link
                href="/casts"
                className="text-gray-300 hover:text-white transition-colors"
              >
                キャスト一覧
              </Link>
              <Link
                href="/register/company"
                className="text-gray-300 hover:text-white transition-colors"
              >
                仕事を依頼する
              </Link>
              <Link
                href="/login"
                className="text-gray-300 hover:text-white transition-colors"
              >
                ログイン
              </Link>
              <Link
                href="/password-reset"
                className="text-gray-300 hover:text-white transition-colors"
              >
                パスワード再設定
              </Link>
            </nav>
          </div>

          {/* 規約・運営・その他 */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              規約・運営・その他
            </h3>
            <nav className="flex flex-col space-y-2">
              <Link
                href="/terms"
                className="text-gray-300 hover:text-white transition-colors"
              >
                利用規約
              </Link>
              <Link
                href="/trademark"
                className="text-gray-300 hover:text-white transition-colors"
              >
                商標・特許
              </Link>
              <Link
                href="/privacy"
                className="text-gray-300 hover:text-white transition-colors"
              >
                プライバシーポリシー
              </Link>
              <Link
                href="/security"
                className="text-gray-300 hover:text-white transition-colors"
              >
                情報セキュリティーポリシー
              </Link>
              <Link
                href="/external-transmission"
                className="text-gray-300 hover:text-white transition-colors"
              >
                外部送信規律に関する公表事項
              </Link>
              <Link
                href="/commercial-law"
                className="text-gray-300 hover:text-white transition-colors"
              >
                特定商取引法に基づく表示
              </Link>
              <Link
                href="/company"
                className="text-gray-300 hover:text-white transition-colors"
              >
                企業情報
              </Link>
              <Link
                href="/environment"
                className="text-gray-300 hover:text-white transition-colors"
              >
                サービス利用環境
              </Link>
            </nav>
          </div>

          {/* 空白 */}
          <div></div>

          {/* お問い合わせ */}
          <div className="text-right">
            <div className="mb-4">
              <Link
                href="/contact"
                className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition-colors inline-block"
              >
                お問い合わせはこちら
              </Link>
            </div>
            <div>
              <Link
                href="/help"
                className="bg-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-600 transition-colors inline-block"
              >
                ヘルプ・ご利用ガイド
              </Link>
            </div>
          </div>
        </div>

        {/* 区切り線 */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 SUNNY ROCKS. All rights reserved.
            </p>

            {/* ソーシャルリンク（将来的に追加） */}
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2c-2.236 0-2.513.01-3.39.048-.874.04-1.47.18-1.99.384A4.018 4.018 0 002.525 4.525 4.018 4.018 0 002.048 6.61C2.01 7.487 2 7.764 2 10s.01 2.513.048 3.39c.04.874.18 1.47.384 1.99a4.018 4.018 0 001.093 1.093c.52.204 1.116.344 1.99.384.877.038 1.154.048 3.39.048s2.513-.01 3.39-.048c.874-.04 1.47-.18 1.99-.384a4.018 4.018 0 001.093-1.093c.204-.52.344-1.116.384-1.99.038-.877.048-1.154.048-3.39s-.01-2.513-.048-3.39c-.04-.874-.18-1.47-.384-1.99A4.018 4.018 0 0015.475 2.525 4.018 4.018 0 0013.39 2.048C12.513 2.01 12.236 2 10 2zM10 4.865c2.202 0 2.463.009 3.332.048.804.037 1.24.171 1.532.284.385.15.66.329.948.617.288.288.467.563.617.948.113.292.247.728.284 1.532.039.869.048 1.13.048 3.332s-.009 2.463-.048 3.332c-.037.804-.171 1.24-.284 1.532-.15.385-.329.66-.617.948-.288.288-.563.467-.948.617-.292.113-.728.247-1.532.284-.869.039-1.13.048-3.332.048s-2.463-.009-3.332-.048c-.804-.037-1.24-.171-1.532-.284a2.553 2.553 0 01-.948-.617 2.553 2.553 0 01-.617-.948c-.113-.292-.247-.728-.284-1.532C4.874 12.463 4.865 12.202 4.865 10s.009-2.463.048-3.332c.037-.804.171-1.24.284-1.532.15-.385.329-.66.617-.948.288-.288.563-.467.948-.617.292-.113.728-.247 1.532-.284C7.537 4.874 7.798 4.865 10 4.865zM10 13.5a3.5 3.5 0 110-7 3.5 3.5 0 010 7zm0-8.865a5.365 5.365 0 100 10.73 5.365 5.365 0 000-10.73zm6.832-.203a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
