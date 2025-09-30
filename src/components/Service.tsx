'use client'

import React from 'react'

const Service = () => {
  return (
    <section className="py-20 bg-gray-800">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          SERVICE
        </h2>
        <p className="text-lg text-gray-300 mb-16">優良サービス</p>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg p-8 md:p-12 text-black">
            <div className="flex items-baseline justify-center mb-6">
              <span className="text-lg font-medium mr-4">依頼料金</span>
              <span className="text-6xl md:text-7xl font-bold text-red-600">10,000</span>
              <span className="text-lg font-medium ml-4">円から</span>
            </div>
            
            <div className="mt-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">精鋭キャスト</h3>
              <p className="text-gray-600 leading-relaxed">
                モデル・カメラマン・スタイリスト・ヘアメイク・クリエイター<br />
                ご予算に応じて最適な人材がすべて揃います
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Service
