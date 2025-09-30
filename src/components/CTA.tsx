'use client'

import React from 'react'
import Link from 'next/link'

const CTA = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-gray-800 to-gray-600 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between bg-gradient-to-r from-gray-700 to-gray-500 rounded-lg p-8 md:p-12">
          <div className="flex-1">
            <div className="text-2xl md:text-3xl font-bold mb-2">ROCK CASTING</div>
            <div className="text-yellow-400 text-lg mb-4">\ 今すぐ無料登録！ /</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              必要なキャストがすぐに揃います
            </h2>
          </div>
          
          <div className="ml-8">
            <Link 
              href="/register" 
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 inline-block"
            >
              新規登録はこちら
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTA
