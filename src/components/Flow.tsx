'use client'

import React from 'react'

const Flow = () => {
  const steps = [
    {
      number: '1',
      title: '新規アカウント登録・ログイン',
      description: 'まずはアカウント登録をし、プラットフォームに登録することができます。',
      image: '/api/placeholder/200/150'
    },
    {
      number: '2',
      title: 'お仕事依頼（オファー作成）',
      description: 'ご希望、プロの候補に応じた依頼をすることができます。候補者一覧からお仕事をリクエストができます',
      image: '/api/placeholder/200/150'
    },
    {
      number: '3',
      title: '事務局審査',
      description: '利用審査の審査通過後、仕事のスムーズな受託について当社で審査を行います。',
      image: '/api/placeholder/200/150'
    },
    {
      number: '4',
      title: 'キャストとの調整',
      description: '品質のある方面ではコピー、お客さまとキャスト間でのやり取りが可能です。',
      image: '/api/placeholder/200/150'
    },
    {
      number: '5',
      title: 'お支払い',
      description: 'すべての作業は事前審査に一率で明確にですぞ、オファー内でお時効を支払することができます。',
      image: '/api/placeholder/200/150'
    },
    {
      number: '6',
      title: 'キャスティング成立',
      description: '審査的な契約の成立はキャストと合作書してできたぞ、お気に入りをお願いできます。\n\nオファー作成の迅速な対応で、すべて審査にお任せいただいたことと思います。',
      image: '/api/placeholder/200/150'
    }
  ]

  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            FLOW
          </h2>
          <p className="text-lg text-gray-300">お仕事成約の流れ</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* ステップ番号 */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-lg z-10">
                {step.number}
              </div>
              
              {/* カード */}
              <div className="bg-white text-black rounded-lg overflow-hidden pt-8">
                <div className="h-40 bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                </div>
                
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-3">{step.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
              
              {/* 矢印（最後以外） */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-gray-500">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Flow
