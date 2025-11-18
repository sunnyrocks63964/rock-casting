"use client";

import React, { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc/client";

const MobileUserRegister = () => {
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
  }, [email, emailConfirm, password, passwordConfirm, registrationType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || registerMutation.isPending) return;

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
        paddingTop: "70px",
        paddingBottom: "0",
        minHeight: "100vh",
      }}
    >
      {/* ページタイトル */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <h1
          style={{
            fontFamily: "RocknRoll One",
            fontSize: "28px",
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
            fontSize: "12px",
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
            padding: "24px",
            marginLeft: "16px",
            marginRight: "16px",
            marginBottom: "30px",
          }}
        >
          {/* メールアドレス */}
          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                fontFamily: "Noto Sans JP",
                fontSize: "14px",
                fontWeight: "bold",
                color: "black",
                marginBottom: "8px",
              }}
            >
              メールアドレス
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="メールアドレスを入力してください"
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "1px solid black",
                borderRadius: "30px",
                fontSize: "12px",
                fontFamily: "Noto Sans JP",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* メールアドレス（確認用） */}
          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                fontFamily: "Noto Sans JP",
                fontSize: "14px",
                fontWeight: "bold",
                color: "black",
                marginBottom: "8px",
              }}
            >
              メールアドレス（確認用）
            </label>
            <input
              type="email"
              value={emailConfirm}
              onChange={(e) => setEmailConfirm(e.target.value)}
              placeholder="メールアドレスを入力してください"
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "1px solid black",
                borderRadius: "30px",
                fontSize: "12px",
                fontFamily: "Noto Sans JP",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* パスワード */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontFamily: "Noto Sans JP",
                fontSize: "14px",
                fontWeight: "bold",
                color: "black",
                marginBottom: "8px",
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
                padding: "12px 16px",
                border: "1px solid black",
                borderRadius: "30px",
                fontSize: "12px",
                fontFamily: "Noto Sans JP",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* パスワード（確認用） */}
          <div>
            <label
              style={{
                display: "block",
                fontFamily: "Noto Sans JP",
                fontSize: "14px",
                fontWeight: "bold",
                color: "black",
                marginBottom: "8px",
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
                padding: "12px 16px",
                border: "1px solid black",
                borderRadius: "30px",
                fontSize: "12px",
                fontFamily: "Noto Sans JP",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>

        {/* 登録形態選択セクション */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "30px",
            padding: "24px",
            marginLeft: "16px",
            marginRight: "16px",
            marginBottom: "30px",
          }}
        >
          {/* 登録形態を選択 */}
          <div style={{ marginBottom: registrationType ? "24px" : "0" }}>
            <h2
              style={{
                fontFamily: "Noto Sans JP",
                fontSize: "14px",
                fontWeight: "bold",
                color: "black",
                marginBottom: "16px",
              }}
            >
              登録形態を選択
            </h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
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
                    fontSize: "12px",
                    color: "black",
                  }}
                >
                  <div
                    style={{
                      width: "18px",
                      height: "18px",
                      marginRight: "10px",
                      border: "1px solid black",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      backgroundColor: "white",
                    }}
                  >
                    {registrationType === type.id && (
                      <span
                        style={{
                          fontSize: "24px",
                          fontWeight: "bold",
                          lineHeight: "1",
                          color: "black",
                        }}
                      >
                        ✓
                      </span>
                    )}
                  </div>
                  <input
                    type="checkbox"
                    checked={registrationType === type.id}
                    onChange={() =>
                      setRegistrationType(
                        registrationType === type.id ? "" : type.id
                      )
                    }
                    style={{ display: "none" }}
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
                  <div style={{ marginBottom: "24px" }}>
                    <label
                      style={{
                        display: "block",
                        fontFamily: "Noto Sans JP",
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: "black",
                        marginBottom: "8px",
                      }}
                    >
                      会社名 <span style={{ color: "red" }}>（必須）</span>
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="会社名を入力してください"
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "1px solid black",
                        borderRadius: "30px",
                        fontSize: "12px",
                        fontFamily: "Noto Sans JP",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  {/* 業種 */}
                  <div style={{ marginBottom: "24px" }}>
                    <label
                      style={{
                        display: "block",
                        fontFamily: "Noto Sans JP",
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: "black",
                        marginBottom: "8px",
                      }}
                    >
                      業種 <span style={{ color: "red" }}>（必須）</span>
                    </label>
                    <input
                      type="text"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      placeholder="業種を入力してください"
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "1px solid black",
                        borderRadius: "30px",
                        fontSize: "12px",
                        fontFamily: "Noto Sans JP",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  {/* 会社概要 */}
                  <div style={{ marginBottom: "24px" }}>
                    <label
                      style={{
                        display: "block",
                        fontFamily: "Noto Sans JP",
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: "black",
                        marginBottom: "8px",
                      }}
                    >
                      会社概要 <span style={{ color: "red" }}>（必須）</span>
                    </label>
                    <input
                      type="text"
                      value={companyAddress}
                      onChange={(e) => setCompanyAddress(e.target.value)}
                      placeholder="会社概要を入力してください"
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "1px solid black",
                        borderRadius: "30px",
                        fontSize: "12px",
                        fontFamily: "Noto Sans JP",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  {/* ウェブサイトURL */}
                  <div style={{ marginBottom: "24px" }}>
                    <label
                      style={{
                        display: "block",
                        fontFamily: "Noto Sans JP",
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: "black",
                        marginBottom: "8px",
                      }}
                    >
                      ウェブサイトURL
                    </label>
                    <input
                      type="url"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      placeholder="ウェブサイトURLを入力してください"
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "1px solid black",
                        borderRadius: "30px",
                        fontSize: "12px",
                        fontFamily: "Noto Sans JP",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  {/* キャスト側への希望稼働エリア */}
                  <div style={{ marginBottom: "24px" }}>
                    <label
                      style={{
                        display: "block",
                        fontFamily: "Noto Sans JP",
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: "black",
                        marginBottom: "8px",
                      }}
                    >
                      キャスト側への希望稼働エリア{" "}
                      <span style={{ color: "red" }}>（必須）</span>
                    </label>
                    {registrationAreas.map((area, index) => (
                      <div key={index} style={{ marginBottom: "8px" }}>
                        <div style={{ position: "relative" }}>
                          <input
                            type="text"
                            value={area}
                            onChange={(e) =>
                              updateRegistrationArea(index, e.target.value)
                            }
                            placeholder="キャスト側への希望稼働エリアを選択してください"
                            style={{
                              width: "100%",
                              padding: "12px 16px",
                              border: "1px solid black",
                              borderRadius: "30px",
                              fontSize: "12px",
                              fontFamily: "Noto Sans JP",
                              outline: "none",
                              boxSizing: "border-box",
                            }}
                          />
                          <span
                            style={{
                              position: "absolute",
                              right: "20px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              fontSize: "16px",
                              fontWeight: "bold",
                              color: "lightgrey",
                              pointerEvents: "none",
                            }}
                          >
                            ▼
                          </span>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addRegistrationArea}
                      style={{
                        fontFamily: "Noto Sans JP",
                        fontSize: "13px",
                        color: "black",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        display: "block",
                        marginLeft: "auto",
                        marginRight: "auto",
                        marginTop: "8px",
                      }}
                    >
                      ＋　エリアを追加する
                    </button>
                  </div>

                  {/* 求めている職種 */}
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontFamily: "Noto Sans JP",
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: "black",
                        marginBottom: "8px",
                      }}
                    >
                      求めている職種{" "}
                      <span style={{ color: "red" }}>（必須）</span>
                    </label>
                    {targetBudgets.map((budget, index) => (
                      <div key={index} style={{ marginBottom: "8px" }}>
                        <div style={{ position: "relative" }}>
                          <input
                            type="text"
                            value={budget}
                            onChange={(e) =>
                              updateTargetBudget(index, e.target.value)
                            }
                            placeholder="求めている職種を選択してください"
                            style={{
                              width: "100%",
                              padding: "12px 16px",
                              border: "1px solid black",
                              borderRadius: "30px",
                              fontSize: "12px",
                              fontFamily: "Noto Sans JP",
                              outline: "none",
                              boxSizing: "border-box",
                            }}
                          />
                          <span
                            style={{
                              position: "absolute",
                              right: "20px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              fontSize: "16px",
                              fontWeight: "bold",
                              color: "lightgrey",
                              pointerEvents: "none",
                            }}
                          >
                            ▼
                          </span>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addTargetBudget}
                      style={{
                        fontFamily: "Noto Sans JP",
                        fontSize: "13px",
                        color: "black",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        display: "block",
                        marginLeft: "auto",
                        marginRight: "auto",
                        marginTop: "8px",
                      }}
                    >
                      ＋　エリアを追加する
                    </button>
                  </div>
                </>
              )}

              {/* 企業として受注したい方 */}
              {registrationType === "company-receive" && (
                <>
                  {/* 会社名 */}
                  <div style={{ marginBottom: "24px" }}>
                    <label
                      style={{
                        display: "block",
                        fontFamily: "Noto Sans JP",
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: "black",
                        marginBottom: "8px",
                      }}
                    >
                      会社名 <span style={{ color: "red" }}>（必須）</span>
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="会社名を入力してください"
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "1px solid black",
                        borderRadius: "30px",
                        fontSize: "12px",
                        fontFamily: "Noto Sans JP",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  {/* 業種 */}
                  <div style={{ marginBottom: "24px" }}>
                    <label
                      style={{
                        display: "block",
                        fontFamily: "Noto Sans JP",
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: "black",
                        marginBottom: "8px",
                      }}
                    >
                      業種 <span style={{ color: "red" }}>（必須）</span>
                    </label>
                    <input
                      type="text"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      placeholder="業種を入力してください"
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "1px solid black",
                        borderRadius: "30px",
                        fontSize: "12px",
                        fontFamily: "Noto Sans JP",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  {/* 会社概要 */}
                  <div style={{ marginBottom: "24px" }}>
                    <label
                      style={{
                        display: "block",
                        fontFamily: "Noto Sans JP",
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: "black",
                        marginBottom: "8px",
                      }}
                    >
                      会社概要 <span style={{ color: "red" }}>（必須）</span>
                    </label>
                    <input
                      type="text"
                      value={companyAddress}
                      onChange={(e) => setCompanyAddress(e.target.value)}
                      placeholder="会社概要を入力してください"
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "1px solid black",
                        borderRadius: "30px",
                        fontSize: "12px",
                        fontFamily: "Noto Sans JP",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  {/* ウェブサイトURL */}
                  <div style={{ marginBottom: "24px" }}>
                    <label
                      style={{
                        display: "block",
                        fontFamily: "Noto Sans JP",
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: "black",
                        marginBottom: "8px",
                      }}
                    >
                      ウェブサイトURL
                    </label>
                    <input
                      type="url"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      placeholder="ウェブサイトURLを入力してください"
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "1px solid black",
                        borderRadius: "30px",
                        fontSize: "12px",
                        fontFamily: "Noto Sans JP",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  {/* 希望稼働エリア */}
                  <div style={{ marginBottom: "24px" }}>
                    <label
                      style={{
                        display: "block",
                        fontFamily: "Noto Sans JP",
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: "black",
                        marginBottom: "8px",
                      }}
                    >
                      希望稼働エリア{" "}
                      <span style={{ color: "red" }}>（必須）</span>
                    </label>
                    {registrationAreas.map((area, index) => (
                      <div key={index} style={{ marginBottom: "8px" }}>
                        <div style={{ position: "relative" }}>
                          <input
                            type="text"
                            value={area}
                            onChange={(e) =>
                              updateRegistrationArea(index, e.target.value)
                            }
                            placeholder="希望稼働エリアを選択してください"
                            style={{
                              width: "100%",
                              padding: "12px 16px",
                              border: "1px solid black",
                              borderRadius: "30px",
                              fontSize: "12px",
                              fontFamily: "Noto Sans JP",
                              outline: "none",
                              boxSizing: "border-box",
                            }}
                          />
                          <span
                            style={{
                              position: "absolute",
                              right: "20px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              fontSize: "16px",
                              fontWeight: "bold",
                              color: "lightgrey",
                              pointerEvents: "none",
                            }}
                          >
                            ▼
                          </span>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addRegistrationArea}
                      style={{
                        fontFamily: "Noto Sans JP",
                        fontSize: "13px",
                        color: "black",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        display: "block",
                        marginLeft: "auto",
                        marginRight: "auto",
                        marginTop: "8px",
                      }}
                    >
                      ＋　エリアを追加する
                    </button>
                  </div>

                  {/* 職種 */}
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontFamily: "Noto Sans JP",
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: "black",
                        marginBottom: "8px",
                      }}
                    >
                      職種 <span style={{ color: "red" }}>（必須）</span>
                    </label>
                    {targetBudgets.map((budget, index) => (
                      <div key={index} style={{ marginBottom: "8px" }}>
                        <div style={{ position: "relative" }}>
                          <input
                            type="text"
                            value={budget}
                            onChange={(e) =>
                              updateTargetBudget(index, e.target.value)
                            }
                            placeholder="職種を選択してください"
                            style={{
                              width: "100%",
                              padding: "12px 16px",
                              border: "1px solid black",
                              borderRadius: "30px",
                              fontSize: "12px",
                              fontFamily: "Noto Sans JP",
                              outline: "none",
                              boxSizing: "border-box",
                            }}
                          />
                          <span
                            style={{
                              position: "absolute",
                              right: "20px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              fontSize: "16px",
                              fontWeight: "bold",
                              color: "lightgrey",
                              pointerEvents: "none",
                            }}
                          >
                            ▼
                          </span>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addTargetBudget}
                      style={{
                        fontFamily: "Noto Sans JP",
                        fontSize: "13px",
                        color: "black",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        display: "block",
                        marginLeft: "auto",
                        marginRight: "auto",
                        marginTop: "8px",
                      }}
                    >
                      ＋　エリアを追加する
                    </button>
                  </div>
                </>
              )}

              {/* 個人として受注したい方 */}
              {registrationType === "individual-receive" && (
                <>
                  {/* 希望稼働エリア */}
                  <div style={{ marginBottom: "24px" }}>
                    <label
                      style={{
                        display: "block",
                        fontFamily: "Noto Sans JP",
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: "black",
                        marginBottom: "8px",
                      }}
                    >
                      希望稼働エリア{" "}
                      <span style={{ color: "red" }}>（必須）</span>
                    </label>
                    {registrationAreas.map((area, index) => (
                      <div key={index} style={{ marginBottom: "8px" }}>
                        <div style={{ position: "relative" }}>
                          <input
                            type="text"
                            value={area}
                            onChange={(e) =>
                              updateRegistrationArea(index, e.target.value)
                            }
                            placeholder="希望稼働エリアを選択してください"
                            style={{
                              width: "100%",
                              padding: "12px 16px",
                              border: "1px solid black",
                              borderRadius: "30px",
                              fontSize: "12px",
                              fontFamily: "Noto Sans JP",
                              outline: "none",
                              boxSizing: "border-box",
                            }}
                          />
                          <span
                            style={{
                              position: "absolute",
                              right: "20px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              fontSize: "16px",
                              fontWeight: "bold",
                              color: "lightgrey",
                              pointerEvents: "none",
                            }}
                          >
                            ▼
                          </span>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addRegistrationArea}
                      style={{
                        fontFamily: "Noto Sans JP",
                        fontSize: "13px",
                        color: "black",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        display: "block",
                        marginLeft: "auto",
                        marginRight: "auto",
                        marginTop: "8px",
                      }}
                    >
                      ＋　エリアを追加する
                    </button>
                  </div>

                  {/* 職種 */}
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontFamily: "Noto Sans JP",
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: "black",
                        marginBottom: "8px",
                      }}
                    >
                      職種 <span style={{ color: "red" }}>（必須）</span>
                    </label>
                    {targetBudgets.map((budget, index) => (
                      <div key={index} style={{ marginBottom: "8px" }}>
                        <div style={{ position: "relative" }}>
                          <input
                            type="text"
                            value={budget}
                            onChange={(e) =>
                              updateTargetBudget(index, e.target.value)
                            }
                            placeholder="職種を選択してください"
                            style={{
                              width: "100%",
                              padding: "12px 16px",
                              border: "1px solid black",
                              borderRadius: "30px",
                              fontSize: "12px",
                              fontFamily: "Noto Sans JP",
                              outline: "none",
                              boxSizing: "border-box",
                            }}
                          />
                          <span
                            style={{
                              position: "absolute",
                              right: "20px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              fontSize: "16px",
                              fontWeight: "bold",
                              color: "lightgrey",
                              pointerEvents: "none",
                            }}
                          >
                            ▼
                          </span>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addTargetBudget}
                      style={{
                        fontFamily: "Noto Sans JP",
                        fontSize: "13px",
                        color: "black",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        display: "block",
                        marginLeft: "auto",
                        marginRight: "auto",
                        marginTop: "8px",
                      }}
                    >
                      ＋　エリアを追加する
                    </button>
                  </div>
                </>
              )}

              {/* 個人として発注したい方 */}
              {registrationType === "individual-order" && (
                <>
                  {/* 関連ウェブサイトURL */}
                  <div style={{ marginBottom: "24px" }}>
                    <label
                      style={{
                        display: "block",
                        fontFamily: "Noto Sans JP",
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: "black",
                        marginBottom: "8px",
                      }}
                    >
                      関連ウェブサイトURL
                    </label>
                    <input
                      type="url"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      placeholder="ウェブサイトURLを入力してください"
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "1px solid black",
                        borderRadius: "30px",
                        fontSize: "12px",
                        fontFamily: "Noto Sans JP",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  {/* キャスト側への希望稼働エリア */}
                  <div style={{ marginBottom: "24px" }}>
                    <label
                      style={{
                        display: "block",
                        fontFamily: "Noto Sans JP",
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: "black",
                        marginBottom: "8px",
                      }}
                    >
                      キャスト側への希望稼働エリア{" "}
                      <span style={{ color: "red" }}>（必須）</span>
                    </label>
                    {registrationAreas.map((area, index) => (
                      <div key={index} style={{ marginBottom: "8px" }}>
                        <div style={{ position: "relative" }}>
                          <input
                            type="text"
                            value={area}
                            onChange={(e) =>
                              updateRegistrationArea(index, e.target.value)
                            }
                            placeholder="キャスト側への希望稼働エリアを選択してください"
                            style={{
                              width: "100%",
                              padding: "12px 16px",
                              border: "1px solid black",
                              borderRadius: "30px",
                              fontSize: "12px",
                              fontFamily: "Noto Sans JP",
                              outline: "none",
                              boxSizing: "border-box",
                            }}
                          />
                          <span
                            style={{
                              position: "absolute",
                              right: "20px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              fontSize: "16px",
                              fontWeight: "bold",
                              color: "lightgrey",
                              pointerEvents: "none",
                            }}
                          >
                            ▼
                          </span>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addRegistrationArea}
                      style={{
                        fontFamily: "Noto Sans JP",
                        fontSize: "13px",
                        color: "black",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        display: "block",
                        marginLeft: "auto",
                        marginRight: "auto",
                        marginTop: "8px",
                      }}
                    >
                      ＋　エリアを追加する
                    </button>
                  </div>

                  {/* 求めている職種 */}
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontFamily: "Noto Sans JP",
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: "black",
                        marginBottom: "8px",
                      }}
                    >
                      求めている職種{" "}
                      <span style={{ color: "red" }}>（必須）</span>
                    </label>
                    {targetBudgets.map((budget, index) => (
                      <div key={index} style={{ marginBottom: "8px" }}>
                        <div style={{ position: "relative" }}>
                          <input
                            type="text"
                            value={budget}
                            onChange={(e) =>
                              updateTargetBudget(index, e.target.value)
                            }
                            placeholder="求めている職種を選択してください"
                            style={{
                              width: "100%",
                              padding: "12px 16px",
                              border: "1px solid black",
                              borderRadius: "30px",
                              fontSize: "12px",
                              fontFamily: "Noto Sans JP",
                              outline: "none",
                              boxSizing: "border-box",
                            }}
                          />
                          <span
                            style={{
                              position: "absolute",
                              right: "20px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              fontSize: "16px",
                              fontWeight: "bold",
                              color: "lightgrey",
                              pointerEvents: "none",
                            }}
                          >
                            ▼
                          </span>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addTargetBudget}
                      style={{
                        fontFamily: "Noto Sans JP",
                        fontSize: "13px",
                        color: "black",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        display: "block",
                        marginLeft: "auto",
                        marginRight: "auto",
                        marginTop: "8px",
                      }}
                    >
                      ＋　エリアを追加する
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {/* 送信ボタン */}
        <div style={{ textAlign: "center", padding: "0 16px 32px" }}>
          <button
            type="submit"
            disabled={!isFormValid || registerMutation.isPending}
            style={{
              backgroundColor: isFormValid && !registerMutation.isPending ? "#dc2626" : "#e99797",
              color: "white",
              padding: "12px 0",
              borderRadius: "90px",
              fontSize: "14px",
              fontWeight: "bold",
              fontFamily: "Noto Sans JP",
              border: "none",
              cursor: isFormValid && !registerMutation.isPending ? "pointer" : "not-allowed",
              transition: "all 0.3s ease",
              width: "100%",
              maxWidth: "295px",
            }}
          >
            {registerMutation.isPending ? "登録中..." : "新規登録をする"}
          </button>
          {registerMutation.error && (
            <div
              style={{
                marginTop: "12px",
                color: "#dc2626",
                fontFamily: "Noto Sans JP",
                fontSize: "12px",
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

export default MobileUserRegister;

