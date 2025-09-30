'use client'

import React from 'react'

const Voice = () => {
  const voices = [
    {
      category: 'マッチングした業種：スクールカメラマン',
      name: '費用：1案件3万円',
      content: '弊社は年間17の業種を受託しており、大利益を上げてきました。そのクライアント側（私たちでいう外注）',
      profileColor: 'from-pink-400 to-pink-600',
      accent: 'blue'
    },
    {
      category: 'マッチングした業種：広告カメラマン、モデル',
      name: '費用：1案件10万円',
      content: '現実率の高さという依頼者頻度の高さをコミットしてきました。実績と売上高の高いカメラマンを紹介していただく内容で、大変取りこぼしもありません。数多くのクリエイターとお仕事させていただく。大変魅力と実力を感じています。これからもよろしくお願いします。弊社の業務拡大に向けて今度ともお手伝いください。',
      profileColor: 'from-blue-400 to-blue-600',
      accent: 'default'
    },
    {
      category: 'マッチングした業種：カメラマン・ヘアメイク、スタイリスト',
      name: '費用：1案件20万円',
      content: '写真業界での経営に大きな影響があり、スタイリスト、ヘアメイクとしてプロジェクトの成功に貢献できることができました。ROCK CASTINGということを活用させていただいて、新しくサイワイ方式でより良い実施を行うことができました。継続的にサービスを活用し続けると思います。',
      profileColor: 'from-green-400 to-green-600',
      accent: 'default'
    }
  ]

  return (
    <section className="py-20 bg-white text-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            VOICE
          </h2>
          <p className="text-lg text-gray-600">お客様の声</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {voices.map((voice, index) => (
            <div 
              key={index} 
              className={`bg-white border-2 rounded-lg overflow-hidden ${
                voice.accent === 'blue' ? 'border-blue-500' : 'border-gray-200'
              }`}
            >
              <div className="bg-black text-white p-4">
                <h3 className="font-bold text-sm mb-1">{voice.category}</h3>
                <p className="text-sm">{voice.name}</p>
              </div>
              
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${voice.profileColor} flex items-center justify-center flex-shrink-0`}>
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {voice.content}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Voice
