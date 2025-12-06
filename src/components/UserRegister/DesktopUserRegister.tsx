"use client";

import React, { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc/client";

const DesktopUserRegister = () => {
  // tRPC mutation
  const registerMutation = trpc.auth.register.useMutation();

  // フォームの状態
  const [email, setEmail] = useState("");
  const [emailConfirm, setEmailConfirm] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  // 登録形態の選択
  const [registrationType, setRegistrationType] = useState<string>("");

  // 企業情報
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [registrationAreas, setRegistrationAreas] = useState<string[]>([""]);
  const [targetBudgets, setTargetBudgets] = useState<string[]>([""]);

  // ボタンの有効/無効状態
  const [isFormValid, setIsFormValid] = useState(false);

  // 登録形態の選択肢
  const registrationTypes = [
    { id: "company-order", label: "企業として発注したい方はこちら" },
    { id: "individual-order", label: "個人として発注したい方はこちら" },
    { id: "company-receive", label: "企業として受注したい方はこちら" },
    { id: "individual-receive", label: "個人として受注したい方はこちら" },
  ];

  // エリアを追加
  const addRegistrationArea = () => {
    setRegistrationAreas([...registrationAreas, ""]);
  };

  // 単価を追加
  const addTargetBudget = () => {
    setTargetBudgets([...targetBudgets, ""]);
  };

  // エリアを更新
  const updateRegistrationArea = (index: number, value: string) => {
    const newAreas = [...registrationAreas];
    newAreas[index] = value;
    setRegistrationAreas(newAreas);
  };

  // 単価を更新
  const updateTargetBudget = (index: number, value: string) => {
    const newBudgets = [...targetBudgets];
    newBudgets[index] = value;
    setTargetBudgets(newBudgets);
  };

  // フォームのバリデーション
  useEffect(() => {
    const isBasicInfoValid =
      email.trim() !== "" &&
      emailConfirm.trim() !== "" &&
      email === emailConfirm &&
      password.trim() !== "" &&
      passwordConfirm.trim() !== "" &&
      password === passwordConfirm &&
      registrationType !== "";

    setIsFormValid(isBasicInfoValid);
  }, [
    email,
    emailConfirm,
    password,
    passwordConfirm,
    registrationType,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // バリデーションを再チェック
    const isBasicInfoValid =
      email.trim() !== "" &&
      emailConfirm.trim() !== "" &&
      email === emailConfirm &&
      password.trim() !== "" &&
      passwordConfirm.trim() !== "" &&
      password === passwordConfirm &&
      registrationType !== "";
    
    if (!isBasicInfoValid || registerMutation.isPending) {
      return;
    }

    // 登録形態に応じてroleを決定
    let role: "caster" | "orderer" | "both" = "orderer";
    
    if (registrationType === "individual-order") {
      role = "orderer";
    } else if (registrationType === "individual-receive") {
      role = "caster";
    } else if (registrationType === "company-order" || registrationType === "company-receive") {
      // 企業側は後で実装
      alert("企業側の登録は現在準備中です");
      return;
    }

    // tRPCで登録APIを呼び出し
    registerMutation.mutate(
      {
        email,
        password,
        passwordConfirm,
        role,
      },
      {
        onSuccess: (result) => {
          if (result.success) {
            alert("登録が完了しました！");
            // フォームをリセット
            setEmail("");
            setEmailConfirm("");
            setPassword("");
            setPasswordConfirm("");
            setRegistrationType("");
          }
        },
        onError: (error) => {
          // エラーは既にregisterMutation.errorに設定される
          console.error("登録エラー:", error);
        },
      }
    );
  };

  return (
    <main
      style={{
        paddingTop: "120px",
        paddingBottom: "80px",
        maxWidth: "960px",
        margin: "0 auto",
        padding: "120px 20px 80px",
      }}
    >
      {/* ページタイトル */}
      <div style={{ textAlign: "center", marginBottom: "60px" }}>
        <h1
          style={{
            fontFamily: "RocknRoll One",
            fontSize: "48px",
            fontWeight: "normal",
            color: "white",
            marginBottom: "10px",
          }}
        >
          New registration
        </h1>
        <p
          style={{
            fontFamily: "Noto Sans JP",
            fontSize: "20px",
            color: "white",
          }}
        >
          新規登録
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* 基本情報セクション */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "30px",
            padding: "60px",
            marginBottom: "40px",
          }}
        >
          {/* メールアドレス */}
          <div style={{ marginBottom: "30px" }}>
            <label
              style={{
                display: "block",
                fontFamily: "Noto Sans JP",
                fontSize: "16px",
                fontWeight: "bold",
                color: "black",
                marginBottom: "10px",
              }}
            >
              メールアドレス <span style={{ color: "#dc2626" }}>（必須）</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="メールアドレスを入力してください"
              style={{
                width: "100%",
                padding: "15px 20px",
                border: "1px solid #d1d5db",
                borderRadius: "30px",
                fontSize: "16px",
                fontFamily: "Noto Sans JP",
                outline: "none",
              }}
            />
          </div>

          {/* メールアドレス（確認用） */}
          <div style={{ marginBottom: "30px" }}>
            <label
              style={{
                display: "block",
                fontFamily: "Noto Sans JP",
                fontSize: "16px",
                fontWeight: "bold",
                color: "black",
                marginBottom: "10px",
              }}
            >
              メールアドレス（確認用） <span style={{ color: "#dc2626" }}>（必須）</span>
            </label>
            <input
              type="email"
              value={emailConfirm}
              onChange={(e) => setEmailConfirm(e.target.value)}
              placeholder="もう一度入力してください"
              style={{
                width: "100%",
                padding: "15px 20px",
                border: "1px solid #d1d5db",
                borderRadius: "30px",
                fontSize: "16px",
                fontFamily: "Noto Sans JP",
                outline: "none",
              }}
            />
          </div>

          {/* パスワード */}
          <div style={{ marginBottom: "30px" }}>
            <label
              style={{
                display: "block",
                fontFamily: "Noto Sans JP",
                fontSize: "16px",
                fontWeight: "bold",
                color: "black",
                marginBottom: "10px",
              }}
            >
              パスワード <span style={{ color: "#dc2626" }}>（必須）</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="パスワードを入力してください"
              style={{
                width: "100%",
                padding: "15px 20px",
                border: "1px solid #d1d5db",
                borderRadius: "30px",
                fontSize: "16px",
                fontFamily: "Noto Sans JP",
                outline: "none",
              }}
            />
          </div>

          {/* パスワード（確認用） */}
          <div>
            <label
              style={{
                display: "block",
                fontFamily: "Noto Sans JP",
                fontSize: "16px",
                fontWeight: "bold",
                color: "black",
                marginBottom: "10px",
              }}
            >
              パスワード（確認用） <span style={{ color: "#dc2626" }}>（必須）</span>
            </label>
            <input
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="もう一度パスワードを入力してください"
              style={{
                width: "100%",
                padding: "15px 20px",
                border: "1px solid #d1d5db",
                borderRadius: "30px",
                fontSize: "16px",
                fontFamily: "Noto Sans JP",
                outline: "none",
              }}
            />
          </div>
        </div>

        {/* 登録形態選択セクション */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "30px",
            padding: "60px",
            marginBottom: "40px",
          }}
        >
          {/* 登録形態を選択 */}
          <div style={{ marginBottom: "40px" }}>
            <h2
              style={{
                fontFamily: "Noto Sans JP",
                fontSize: "16px",
                fontWeight: "500",
                color: "black",
                marginBottom: "20px",
              }}
            >
              登録形態を選択
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "15px",
              }}
            >
              {registrationTypes.map((type) => (
                <label
                  key={type.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    fontFamily: "Noto Sans JP",
                    fontSize: "16px",
                    color: "black",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={registrationType === type.id}
                    onChange={() =>
                      setRegistrationType(
                        registrationType === type.id ? "" : type.id
                      )
                    }
                    style={{
                      width: "26px",
                      height: "25px",
                      marginRight: "10px",
                      cursor: "pointer",
                      border: "1px solid black",
                      flexShrink: 0,
                    }}
                  />
                  <span>{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 登録形態が選択されたらフォームを表示 */}
          {registrationType && (
            <>
              {/* 企業として発注したい方 */}
              {registrationType === "company-order" && (
                <>
                  {/* 会社名 */}
                  <div style={{ marginBottom: "30px" }}>
                    <label
                      style={{
                        display: "block",
                        fontFamily: "Noto Sans JP",
                        fontSize: "16px",
                        fontWeight: "bold",
                        color: "black",
                        marginBottom: "10px",
                      }}
                    >
                      会社名
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="会社名を入力してください"
                      style={{
                        width: "100%",
                        padding: "15px 20px",
                        border: "1px solid #d1d5db",
                        borderRadius: "30px",
                        fontSize: "16px",
                        fontFamily: "Noto Sans JP",
                        outline: "none",
                      }}
                    />
                  </div>

                  {/* 業種 */}
                  <div style={{ marginBottom: "30px" }}>
                    <label
                      style={{
                        display: "block",
                        fontFamily: "Noto Sans JP",
                        fontSize: "16px",
                        fontWeight: "bold",
                        color: "black",
                        marginBottom: "10px",
                      }}
                    >
                      業種
                    </label>
                    <input
                      type="text"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      placeholder="業種を入力してください"
                      style={{
                        width: "100%",
                        padding: "15px 20px",
                        border: "1px solid #d1d5db",
                        borderRadius: "30px",
                        fontSize: "16px",
                        fontFamily: "Noto Sans JP",
                        outline: "none",
                      }}
                    />
                  </div>

                  {/* 会社概要 */}
                  <div style={{ marginBottom: "30px" }}>
                    <label
                      style={{
                        display: "block",
                        fontFamily: "Noto Sans JP",
                        fontSize: "16px",
                        fontWeight: "bold",
                        color: "black",
                        marginBottom: "10px",
                      }}
                    >
                      会社概要
                    </label>
                    <input
                      type="text"
                      value={companyAddress}
                      onChange={(e) => setCompanyAddress(e.target.value)}
                      placeholder="会社概要を入力してください"
                      style={{
                        width: "100%",
                        padding: "15px 20px",
                        border: "1px solid #d1d5db",
                        borderRadius: "30px",
                        fontSize: "16px",
                        fontFamily: "Noto Sans JP",
                        outline: "none",
                      }}
                    />
                  </div>

                  {/* ウェブサイトURL */}
                  <div style={{ marginBottom: "30px" }}>
                    <label
                      style={{
                        display: "block",
                        fontFamily: "Noto Sans JP",
                        fontSize: "16px",
                        fontWeight: "bold",
                        color: "black",
                        marginBottom: "10px",
                      }}
                    >
                      ウェブサイトURL
                    </label>
                    <input
                      type="url"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      placeholder="https://example.com"
                      style={{
                        width: "100%",
                        padding: "15px 20px",
                        border: "1px solid #d1d5db",
                        borderRadius: "30px",
                        fontSize: "16px",
                        fontFamily: "Noto Sans JP",
                        outline: "none",
                      }}
                    />
                  </div>

                  {/* キャスト側への希望稼働エリア */}
                  <div style={{ marginBottom: "30px" }}>
                    <label
                      style={{
                        display: "block",
                        fontFamily: "Noto Sans JP",
                        fontSize: "16px",
                        fontWeight: "bold",
                        color: "black",
                        marginBottom: "10px",
                      }}
                    >
                      キャスト側への希望稼働エリア
                    </label>
                    {registrationAreas.map((area, index) => (
                      <input
                        key={index}
                        type="text"
                        value={area}
                        onChange={(e) => updateRegistrationArea(index, e.target.value)}
                        placeholder="キャスト側への希望稼働エリアを入力してください"
                        style={{
                          width: "100%",
                          padding: "15px 20px",
                          border: "1px solid #d1d5db",
                          borderRadius: "30px",
                          fontSize: "16px",
                          fontFamily: "Noto Sans JP",
                          outline: "none",
                          marginBottom: "10px",
                        }}
                      />
                    ))}
                    <button
                      type="button"
                      onClick={addRegistrationArea}
                      style={{
                        fontFamily: "Noto Sans JP",
                        fontSize: "14px",
                        color: "#3b82f6",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      + エリアを追加する
                    </button>
                  </div>

                  {/* 求めている職種 */}
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontFamily: "Noto Sans JP",
                        fontSize: "16px",
                        fontWeight: "bold",
                        color: "black",
                        marginBottom: "10px",
                      }}
                    >
                      求めている職種
                    </label>
                    {targetBudgets.map((budget, index) => (
                      <input
                        key={index}
                        type="text"
                        value={budget}
                        onChange={(e) => updateTargetBudget(index, e.target.value)}
                        placeholder="求めている職種を入力してください"
                        style={{
                          width: "100%",
                          padding: "15px 20px",
                          border: "1px solid #d1d5db",
                          borderRadius: "30px",
                          fontSize: "16px",
                          fontFamily: "Noto Sans JP",
                          outline: "none",
                          marginBottom: "10px",
                        }}
                      />
                    ))}
                    <button
                      type="button"
                      onClick={addTargetBudget}
                      style={{
                        fontFamily: "Noto Sans JP",
                        fontSize: "14px",
                        color: "#3b82f6",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      + 職種を追加する
                    </button>
                  </div>
                </>
              )}

              {/* 企業として受注したい方 */}
              {registrationType === "company-receive" && (
                <>
                  {/* 会社名 */}
                  <div style={{ marginBottom: "30px" }}>
                    <label
                      style={{
                        display: "block",
                        fontFamily: "Noto Sans JP",
                        fontSize: "16px",
                        fontWeight: "bold",
                        color: "black",
                        marginBottom: "10px",
                      }}
                    >
                      会社名
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="会社名を入力してください"
                      style={{
                        width: "100%",
                        padding: "15px 20px",
                        border: "1px solid #d1d5db",
                        borderRadius: "30px",
                        fontSize: "16px",
                        fontFamily: "Noto Sans JP",
                        outline: "none",
                      }}
                    />
                  </div>

                  {/* 業種 */}
                  <div style={{ marginBottom: "30px" }}>
                    <label
                      style={{
                        display: "block",
                        fontFamily: "Noto Sans JP",
                        fontSize: "16px",
                        fontWeight: "bold",
                        color: "black",
                        marginBottom: "10px",
                      }}
                    >
                      業種
                    </label>
                    <input
                      type="text"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      placeholder="業種を入力してください"
                      style={{
                        width: "100%",
                        padding: "15px 20px",
                        border: "1px solid #d1d5db",
                        borderRadius: "30px",
                        fontSize: "16px",
                        fontFamily: "Noto Sans JP",
                        outline: "none",
                      }}
                    />
                  </div>

                  {/* 会社概要 */}
                  <div style={{ marginBottom: "30px" }}>
                    <label
                      style={{
                        display: "block",
                        fontFamily: "Noto Sans JP",
                        fontSize: "16px",
                        fontWeight: "bold",
                        color: "black",
                        marginBottom: "10px",
                      }}
                    >
                      会社概要
                    </label>
                    <input
                      type="text"
                      value={companyAddress}
                      onChange={(e) => setCompanyAddress(e.target.value)}
                      placeholder="会社概要を入力してください"
                      style={{
                        width: "100%",
                        padding: "15px 20px",
                        border: "1px solid #d1d5db",
                        borderRadius: "30px",
                        fontSize: "16px",
                        fontFamily: "Noto Sans JP",
                        outline: "none",
                      }}
                    />
                  </div>

                  {/* ウェブサイトURL */}
                  <div style={{ marginBottom: "30px" }}>
                    <label
                      style={{
                        display: "block",
                        fontFamily: "Noto Sans JP",
                        fontSize: "16px",
                        fontWeight: "bold",
                        color: "black",
                        marginBottom: "10px",
                      }}
                    >
                      ウェブサイトURL
                    </label>
                    <input
                      type="url"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      placeholder="https://example.com"
                      style={{
                        width: "100%",
                        padding: "15px 20px",
                        border: "1px solid #d1d5db",
                        borderRadius: "30px",
                        fontSize: "16px",
                        fontFamily: "Noto Sans JP",
                        outline: "none",
                      }}
                    />
                  </div>

                  {/* 希望稼働エリア */}
                  <div style={{ marginBottom: "30px" }}>
                    <label
                      style={{
                        display: "block",
                        fontFamily: "Noto Sans JP",
                        fontSize: "16px",
                        fontWeight: "bold",
                        color: "black",
                        marginBottom: "10px",
                      }}
                    >
                      希望稼働エリア
                    </label>
                    {registrationAreas.map((area, index) => (
                      <input
                        key={index}
                        type="text"
                        value={area}
                        onChange={(e) => updateRegistrationArea(index, e.target.value)}
                        placeholder="希望稼働エリアを入力してください"
                        style={{
                          width: "100%",
                          padding: "15px 20px",
                          border: "1px solid #d1d5db",
                          borderRadius: "30px",
                          fontSize: "16px",
                          fontFamily: "Noto Sans JP",
                          outline: "none",
                          marginBottom: "10px",
                        }}
                      />
                    ))}
                    <button
                      type="button"
                      onClick={addRegistrationArea}
                      style={{
                        fontFamily: "Noto Sans JP",
                        fontSize: "14px",
                        color: "#3b82f6",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      + エリアを追加する
                    </button>
                  </div>

                  {/* 職種 */}
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontFamily: "Noto Sans JP",
                        fontSize: "16px",
                        fontWeight: "bold",
                        color: "black",
                        marginBottom: "10px",
                      }}
                    >
                      職種
                    </label>
                    {targetBudgets.map((budget, index) => (
                      <input
                        key={index}
                        type="text"
                        value={budget}
                        onChange={(e) => updateTargetBudget(index, e.target.value)}
                        placeholder="職種を入力してください"
                        style={{
                          width: "100%",
                          padding: "15px 20px",
                          border: "1px solid #d1d5db",
                          borderRadius: "30px",
                          fontSize: "16px",
                          fontFamily: "Noto Sans JP",
                          outline: "none",
                          marginBottom: "10px",
                        }}
                      />
                    ))}
                    <button
                      type="button"
                      onClick={addTargetBudget}
                      style={{
                        fontFamily: "Noto Sans JP",
                        fontSize: "14px",
                        color: "#3b82f6",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      + 職種を追加する
                    </button>
                  </div>
                </>
              )}

              {/* 個人として受注したい方 */}
              {registrationType === "individual-receive" && (
                <>
                  {/* 希望稼働エリア */}
                  <div style={{ marginBottom: "30px" }}>
                    <label
                      style={{
                        display: "block",
                        fontFamily: "Noto Sans JP",
                        fontSize: "16px",
                        fontWeight: "bold",
                        color: "black",
                        marginBottom: "10px",
                      }}
                    >
                      希望稼働エリア
                    </label>
                    {registrationAreas.map((area, index) => (
                      <input
                        key={index}
                        type="text"
                        value={area}
                        onChange={(e) => updateRegistrationArea(index, e.target.value)}
                        placeholder="希望稼働エリアを入力してください"
                        style={{
                          width: "100%",
                          padding: "15px 20px",
                          border: "1px solid #d1d5db",
                          borderRadius: "30px",
                          fontSize: "16px",
                          fontFamily: "Noto Sans JP",
                          outline: "none",
                          marginBottom: "10px",
                        }}
                      />
                    ))}
                    <button
                      type="button"
                      onClick={addRegistrationArea}
                      style={{
                        fontFamily: "Noto Sans JP",
                        fontSize: "14px",
                        color: "#3b82f6",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      + エリアを追加する
                    </button>
                  </div>

                  {/* 職種 */}
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontFamily: "Noto Sans JP",
                        fontSize: "16px",
                        fontWeight: "bold",
                        color: "black",
                        marginBottom: "10px",
                      }}
                    >
                      職種
                    </label>
                    {targetBudgets.map((budget, index) => (
                      <input
                        key={index}
                        type="text"
                        value={budget}
                        onChange={(e) => updateTargetBudget(index, e.target.value)}
                        placeholder="職種を入力してください"
                        style={{
                          width: "100%",
                          padding: "15px 20px",
                          border: "1px solid #d1d5db",
                          borderRadius: "30px",
                          fontSize: "16px",
                          fontFamily: "Noto Sans JP",
                          outline: "none",
                          marginBottom: "10px",
                        }}
                      />
                    ))}
                    <button
                      type="button"
                      onClick={addTargetBudget}
                      style={{
                        fontFamily: "Noto Sans JP",
                        fontSize: "14px",
                        color: "#3b82f6",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      + 職種を追加する
                    </button>
                  </div>
                </>
              )}

              {/* 個人として発注したい方 */}
              {registrationType === "individual-order" && (
                <>
                  {/* 関連ウェブサイトURL */}
                  <div style={{ marginBottom: "30px" }}>
                    <label
                      style={{
                        display: "block",
                        fontFamily: "Noto Sans JP",
                        fontSize: "16px",
                        fontWeight: "bold",
                        color: "black",
                        marginBottom: "10px",
                      }}
                    >
                      関連ウェブサイトURL
                    </label>
                    <input
                      type="url"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      placeholder="https://example.com"
                      style={{
                        width: "100%",
                        padding: "15px 20px",
                        border: "1px solid #d1d5db",
                        borderRadius: "30px",
                        fontSize: "16px",
                        fontFamily: "Noto Sans JP",
                        outline: "none",
                      }}
                    />
                  </div>

                  {/* キャスト側への希望稼働エリア */}
                  <div style={{ marginBottom: "30px" }}>
                    <label
                      style={{
                        display: "block",
                        fontFamily: "Noto Sans JP",
                        fontSize: "16px",
                        fontWeight: "bold",
                        color: "black",
                        marginBottom: "10px",
                      }}
                    >
                      キャスト側への希望稼働エリア
                    </label>
                    {registrationAreas.map((area, index) => (
                      <input
                        key={index}
                        type="text"
                        value={area}
                        onChange={(e) => updateRegistrationArea(index, e.target.value)}
                        placeholder="キャスト側への希望稼働エリアを入力してください"
                        style={{
                          width: "100%",
                          padding: "15px 20px",
                          border: "1px solid #d1d5db",
                          borderRadius: "30px",
                          fontSize: "16px",
                          fontFamily: "Noto Sans JP",
                          outline: "none",
                          marginBottom: "10px",
                        }}
                      />
                    ))}
                    <button
                      type="button"
                      onClick={addRegistrationArea}
                      style={{
                        fontFamily: "Noto Sans JP",
                        fontSize: "14px",
                        color: "#3b82f6",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      + エリアを追加する
                    </button>
                  </div>

                  {/* 求めている職種 */}
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontFamily: "Noto Sans JP",
                        fontSize: "16px",
                        fontWeight: "bold",
                        color: "black",
                        marginBottom: "10px",
                      }}
                    >
                      求めている職種
                    </label>
                    {targetBudgets.map((budget, index) => (
                      <input
                        key={index}
                        type="text"
                        value={budget}
                        onChange={(e) => updateTargetBudget(index, e.target.value)}
                        placeholder="求めている職種を入力してください"
                        style={{
                          width: "100%",
                          padding: "15px 20px",
                          border: "1px solid #d1d5db",
                          borderRadius: "30px",
                          fontSize: "16px",
                          fontFamily: "Noto Sans JP",
                          outline: "none",
                          marginBottom: "10px",
                        }}
                      />
                    ))}
                    <button
                      type="button"
                      onClick={addTargetBudget}
                      style={{
                        fontFamily: "Noto Sans JP",
                        fontSize: "14px",
                        color: "#3b82f6",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      + 職種を追加する
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {/* 送信ボタン */}
        <div style={{ textAlign: "center" }}>
          <button
            type="submit"
            disabled={!isFormValid || registerMutation.isPending}
            style={{
              backgroundColor: isFormValid && !registerMutation.isPending ? "#dc2626" : "#fca5a5",
              color: "white",
              padding: "20px 60px",
              borderRadius: "90px",
              fontSize: "20px",
              fontWeight: "bold",
              fontFamily: "Noto Sans JP",
              border: "none",
              cursor: isFormValid && !registerMutation.isPending ? "pointer" : "not-allowed",
              transition: "all 0.3s ease",
              opacity: isFormValid && !registerMutation.isPending ? 1 : 0.6,
            }}
          >
            {registerMutation.isPending
              ? "登録中..."
              : registrationType === "individual-receive" || registrationType === "company-receive"
              ? "キャストとして新規登録"
              : registrationType === "individual-order" || registrationType === "company-order"
              ? "発注者として新規登録"
              : "新規登録をする"}
          </button>
          {registerMutation.error && (
            <div
              style={{
                marginTop: "20px",
                color: "#dc2626",
                fontFamily: "Noto Sans JP",
                fontSize: "14px",
              }}
            >
              {registerMutation.error.message}
            </div>
          )}
        </div>
      </form>
    </main>
  );
};

export default DesktopUserRegister;

