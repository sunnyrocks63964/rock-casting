'use client'

import React from 'react'
// @ts-ignore
import functionBg from './images/function_bg.png'
// @ts-ignore
import function01 from './images/function_01.png'
// @ts-ignore
import function02 from './images/function_02.png'
// @ts-ignore
import function03 from './images/function_03.png'

const Function = () => {
  const functions = [
    {
      title: '安心サポート',
      description: 'お客様とメールフォームからお問い合わせいただく会社と、経理・タスクフォーム管理・スピーディーな対応でご案内いたします。',
      image: function01.src,
      accent: 'gray'
    },
    {
      title: 'オファーテンプレート',
      description: '用途に合わせて簡単にオファーを作成することができます。',
      image: function02.src,
      accent: 'gray'
    },
    {
      title: '充実の検索機能',
      description: 'お客様が探したいキャストの特徴や実績などで条件を絞って弊社で営業する優良の人材を発掘でき、契約することができます。',
      image: function03.src,
      accent: 'gray'
    }
  ]

  return (
    <section style={{ 
      padding: '80px 0', 
      backgroundImage: `url(${functionBg.src})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      position: 'relative'
    }}>
      {/* 背景オーバーレイ */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(63, 63, 63, 0.86)',
        zIndex: 1
      }}></div>
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px', position: 'relative', zIndex: 2 }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 style={{ 
            fontSize: 'clamp(2rem, 4vw, 3rem)', 
            color: 'white', 
            marginBottom: '16px',
            fontFamily: 'RocknRoll One'
          }}>
            FUNCTION
          </h2>
          <p style={{ fontSize: '18px', color: '#d1d5db' }}>3つの特徴</p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '32px' 
        }}>
          {functions.map((func, index) => (
            <div 
              key={index} 
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                overflow: 'hidden',
                border: func.accent === 'blue' ? '4px solid #3b82f6' : 'none'
              }}
            >
              <div style={{
                height: '192px',
                backgroundImage: `url(${func.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
              </div>
              <div style={{ padding: '24px' }}>
                <h3 style={{ 
                  fontSize: '20px', 
                  fontWeight: 'bold', 
                  color: '#1f2937', 
                  marginBottom: '12px' 
                }}>
                  {func.title}
                </h3>
                <p style={{ color: '#000000', lineHeight: '1.6' }}>
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
