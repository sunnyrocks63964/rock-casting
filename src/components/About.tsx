'use client'

import React from 'react'
import Link from 'next/link'

const About = () => {
  const features = [
    {
      title: '厳選されたクリエイターのみ所属',
      description: 'いったん弊社でクリエイターのオーディションを開催し、実績・コーディング・技術のヒアリングを行い担当者で社内会議を設定しているので、クオリティクリエイターのみを受け持ち、品質を確保していきます。',
      image: '/api/placeholder/300/200'
    },
    {
      title: 'ご予算に応じた最適なマッチング',
      description: 'ベンチャー・スタートアップから名刺者・マーケティング・医療・タオルス・クライアントの業界とクリエイターをマッチングします。',
      image: '/api/placeholder/300/200'
    },
    {
      title: '満足保証・無料でやり直しマッチング',
      description: 'サービスに満足いただけなかった場合でも、追加料金なくクリエイターを再マッチングいたします。',
      image: '/api/placeholder/300/200'
    }
  ]

  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            ABOUT
          </h2>
          <p className="text-lg text-gray-300">わたしたちが選ばれる理由</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link 
            href="/register" 
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 rock-border inline-block"
          >
            新規登録はこちら
          </Link>
        </div>
      </div>
    </section>
  )
}

export default About
