'use client'

import React, { useState } from 'react'

const Cast = () => {
  const [activeTab, setActiveTab] = useState('photographer')

  const tabs = [
    { id: 'photographer', label: 'フォトグラファー' },
    { id: 'model', label: 'モデル' },
    { id: 'artist', label: 'アーティスト' },
    { id: 'creator', label: 'クリエイター' }
  ]

  const casts = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: `名前名前`,
    description: 'モデル歴14年のフリーモデル。室内から外まで対応します。年間200本以上を撮影いたします。広告の仕事を上達継続していい、広告やポートレイト',
    image: '/api/placeholder/200/200'
  }))

  return (
    <section className="py-20 bg-white text-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            CAST
          </h2>
          <p className="text-lg text-gray-600">キャスト</p>
        </div>

        {/* タブナビゲーション */}
        <div className="flex flex-wrap justify-center mb-12 border-b-2 border-blue-500">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 mx-2 mb-2 font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* キャストグリッド */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {casts.map((cast) => (
            <div key={cast.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg">
              <div className="h-48 bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{cast.name}</h3>
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">
                  {cast.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            もっと見る
          </button>
        </div>
      </div>
    </section>
  )
}

export default Cast
