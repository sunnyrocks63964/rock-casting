'use client'

import React from 'react'

const Function = () => {
  const functions = [
    {
      title: '安心サポート',
      description: 'お客様とメールフォームからお問い合わせいただく会社と、経理・タスクフォーム管理・スピーディーな対応でご案内いたします。',
      image: '/api/placeholder/300/200',
      accent: 'blue'
    },
    {
      title: 'オファーテンプレート',
      description: '用途に合わせて簡単にオファーを作成することができます。',
      image: '/api/placeholder/300/200',
      accent: 'gray'
    },
    {
      title: '充実の検索機能',
      description: 'お客様が探したいキャストの特徴や実績などで条件を絞って弊社で営業する優良の人材を発掘でき、契約することができます。',
      image: '/api/placeholder/300/200',
      accent: 'gray'
    }
  ]

  return (
    <section className="py-20 bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            FUNCTION
          </h2>
          <p className="text-lg text-gray-300">3つの特徴</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {functions.map((func, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-lg overflow-hidden ${
                func.accent === 'blue' ? 'border-4 border-blue-500' : ''
              }`}
            >
              <div className="h-48 bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {func.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {func.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Function
