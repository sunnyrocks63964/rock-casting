'use client'

import React, { useState } from 'react'
import Link from 'next/link'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* ロゴ */}
          <Link href="/" className="text-2xl font-bold text-white hover:text-gray-300 transition-colors">
            ROCK CASTING
          </Link>

          {/* デスクトップナビゲーション */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#about" className="text-white hover:text-gray-300 transition-colors">
              料金
            </Link>
            <Link href="#casts" className="text-white hover:text-gray-300 transition-colors">
              キャスト一覧
            </Link>
            <Link href="#contact" className="text-white hover:text-gray-300 transition-colors">
              お問い合わせ
            </Link>
          </nav>

          {/* ログイン・登録ボタン */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/login" 
              className="text-white hover:text-gray-300 transition-colors"
            >
              ログイン
            </Link>
            <Link 
              href="/register/cast" 
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              仕事を受ける
            </Link>
            <Link 
              href="/register/company" 
              className="bg-white hover:bg-gray-200 text-black px-4 py-2 rounded-md transition-colors"
            >
              仕事を依頼する
            </Link>
          </div>

          {/* モバイルメニューボタン */}
          <button
            className="md:hidden text-white hover:text-gray-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* モバイルメニュー */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-800">
            <nav className="flex flex-col space-y-4">
              <Link href="#about" className="text-white hover:text-gray-300 transition-colors">
                料金
              </Link>
              <Link href="#casts" className="text-white hover:text-gray-300 transition-colors">
                キャスト一覧
              </Link>
              <Link href="#contact" className="text-white hover:text-gray-300 transition-colors">
                お問い合わせ
              </Link>
              <Link href="/login" className="text-white hover:text-gray-300 transition-colors">
                ログイン
              </Link>
              <Link 
                href="/register/cast" 
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors text-center"
              >
                仕事を受ける
              </Link>
              <Link 
                href="/register/company" 
                className="bg-white hover:bg-gray-200 text-black px-4 py-2 rounded-md transition-colors text-center"
              >
                仕事を依頼する
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
