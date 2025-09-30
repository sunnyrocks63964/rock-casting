'use client'

import React from 'react'
import Link from 'next/link'

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center rock-gradient">
      {/* 背景のアクセント */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-32 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-red-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* メインコピー */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 rock-text-shadow">
            キャスト選びを「運任せ」にしない
            <br />
            <span className="text-red-500">クリエイター特化型</span>
            <br />
            人材マッチング
          </h1>
          
          <div className="text-3xl md:text-4xl font-semibold mb-8 text-gray-300">
            ROCK CASTING
          </div>

          {/* サブコピー */}
          <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            モデル・カメラマン・スタイリスト等のプロフェッショナルと企業を繋ぐ、
            次世代キャスティングプラットフォーム
          </p>

          {/* CTAボタン */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/register" 
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 rock-border"
            >
              新規登録はこちら
            </Link>
          </div>
        </div>

        {/* 右側のキャスト画像エリア */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden lg:block">
          <div className="h-full flex flex-col justify-center space-y-4 pr-8">
            {/* キャスト画像 1 */}
            <div className="w-64 h-32 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg rock-border flex items-center justify-center ml-auto">
              <div className="text-center">
                <div className="w-12 h-12 bg-white/10 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white/50" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-xs text-gray-400">モデル</p>
              </div>
            </div>
            
            {/* キャスト画像 2 */}
            <div className="w-64 h-32 bg-gradient-to-br from-blue-800 to-gray-900 rounded-lg rock-border flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 bg-white/10 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white/50" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                </div>
                <p className="text-xs text-gray-400">シンガー</p>
              </div>
            </div>
            
            {/* キャスト画像 3 */}
            <div className="w-64 h-32 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg rock-border flex items-center justify-center ml-auto">
              <div className="text-center">
                <div className="w-12 h-12 bg-white/10 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white/50" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-xs text-gray-400">モデル</p>
              </div>
            </div>
            
            {/* キャスト画像 4 */}
            <div className="w-64 h-32 bg-gradient-to-br from-yellow-700 to-gray-900 rounded-lg rock-border flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 bg-white/10 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white/50" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-xs text-gray-400">フォトグラファー</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
