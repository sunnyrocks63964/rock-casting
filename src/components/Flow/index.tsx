'use client'

import React from 'react'
// @ts-ignore
import flowBg from './images/flow_bg.png'
// @ts-ignore
import flow01 from './images/flow_01.png'
// @ts-ignore
import flow02 from './images/flow_02.png'
// @ts-ignore
import flow03 from './images/flow_03.png'
// @ts-ignore
import flow04 from './images/flow_04.png'
// @ts-ignore
import flow05 from './images/flow_05.png'
// @ts-ignore
import flow06 from './images/flow_06.png'

const Flow = () => {
  const steps = [
    {
      number: '1',
      title: '新規アカウント登録・ログイン',
      description: 'まずはアカウント登録をし、プラットフォームに登録することができます。',
      image: flow01.src
    },
    {
      number: '2',
      title: 'お仕事依頼（オファー作成）',
      description: 'ご希望、プロの候補に応じた依頼をすることができます。候補者一覧からお仕事をリクエストができます',
      image: flow02.src
    },
    {
      number: '3',
      title: '事務局審査',
      description: '利用審査の審査通過後、仕事のスムーズな受託について当社で審査を行います。',
      image: flow03.src
    },
    {
      number: '4',
      title: 'キャストとの調整',
      description: '品質のある方面ではコピー、お客さまとキャスト間でのやり取りが可能です。',
      image: flow04.src
    },
    {
      number: '5',
      title: 'お支払い',
      description: 'すべての作業は事前審査に一率で明確にですぞ、オファー内でお時効を支払することができます。',
      image: flow05.src
    },
    {
      number: '6',
      title: 'キャスティング成立',
      description: '審査的な契約の成立はキャストと合作書してできたぞ、お気に入りをお願いできます。\n\nオファー作成の迅速な対応で、すべて審査にお任せいただいたことと思います。',
      image: flow06.src
    }
  ]

  return (
    <section style={{ 
      paddingTop: '5rem', 
      paddingBottom: '5rem', 
      backgroundImage: `url(${flowBg.src})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      position: 'relative',
      color: 'white' 
    }}>
      {/* 背景オーバーレイ */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1
      }}></div>
      
      <div style={{ maxWidth: '1600px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '1rem', paddingRight: '1rem', position: 'relative', zIndex: 2 }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.25rem', color: 'white', marginBottom: '1rem', fontFamily: 'RocknRoll One' }}>
            FLOW
          </h2>
          <p style={{ fontSize: '1.125rem', color: '#d1d5db' }}>お仕事成約の流れ</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '50px', justifyItems: 'center', margin: '0 50px' }}>
          {steps.map((step, index) => (
            <div key={index} style={{ position: 'relative', width: '100%', maxWidth: '480px' }}>
              
              {/* カード */}
              <div style={{ backgroundColor: 'white', color: 'black', borderRadius: '0.5rem', overflow: 'hidden', width: '100%' }}>
                <div style={{ 
                  width: '100%',
                  height: '235px',
                  backgroundImage: `url(${step.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  display: 'flex', 
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  padding: '1rem',
                  position: 'relative'
                }}>
                </div>
                
                <div style={{ padding: '20px' }}>
                  <h3 style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '0.75rem' }}>{step.title}</h3>
                  <p style={{ height: '70px', fontSize: '14px', color: '#4b5563', lineHeight: '1.625' }}>
                    {step.description}
                  </p>
                </div>
              </div>
              
              {/* 右向き矢印 */}
              {(index % 3 !== 2 && index < steps.length - 1) && (
                <div style={{ 
                  position: 'absolute', 
                  top: '50%', 
                  right: '-35px', 
                  transform: 'translateY(-50%)', 
                  color: 'white'
                }}>
                  <svg width="22" height="60" viewBox="0 0 44 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M44 60L11 111.962L11 8.03848L44 60Z" fill="white"/>
                  </svg>
                </div>
              )}
              
              {/* 4番目のステップの左側に右向き矢印 */}
              {index === 3 && (
                <div style={{ 
                  position: 'absolute', 
                  top: '50%', 
                  left: '-35px', 
                  transform: 'translateY(-50%)', 
                  color: 'white'
                }}>
                  <svg width="22" height="60" viewBox="0 0 44 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M44 60L11 111.962L11 8.03848L44 60Z" fill="white"/>
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
