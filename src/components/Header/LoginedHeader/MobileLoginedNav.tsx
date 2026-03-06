"use client";

import React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { supabase } from "@/lib/supabase";
import userPicture from "../images/user_picture.png";
import notificationBell from "../images/notification_bell.png";
import { useEffect, useState } from "react";

interface MobileLoginedNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileLoginedNav = ({ isOpen, onClose }: MobileLoginedNavProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [userId, setUserId] = useState<string | null>(null);
  const [messageListPath, setMessageListPath] = useState("/order/message_list");
  const [contractListPath, setContractListPath] = useState("/order/contracts");

  // ユーザーIDを取得
  useEffect(() => {
    const getUserId = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
      }
    };
    getUserId();
  }, []);

  // 現在のユーザー情報を取得
  const { data: userData } = trpc.auth.getCurrentUser.useQuery(
    { userId: userId! },
    {
      enabled: !!userId,
      retry: false,
    }
  );

  // キャストプロフィールを取得
  const { data: casterProfileData } = trpc.profile.getCasterProfile.useQuery(
    { userId: userId! },
    {
      enabled: !!userId && (userData?.hasCasterProfile ?? false),
      retry: false,
    }
  );

  // 発注者プロフィールを取得
  const { data: ordererProfileData } = trpc.profile.getOrdererProfile.useQuery(
    { userId: userId! },
    {
      enabled: !!userId && (userData?.hasOrdererProfile ?? false),
      retry: false,
    }
  );

  // メッセージ一覧のパスを決定
  useEffect(() => {
    // パスベースの判定（優先度：高）
    if (pathname.startsWith("/caster") || pathname.startsWith("/top/caster")) {
      setMessageListPath("/caster/message_list");
      setContractListPath("/caster/contracts");
      return;
    }
    if (pathname.startsWith("/order") || pathname.startsWith("/top/order")) {
      setMessageListPath("/order/message_list");
      setContractListPath("/order/contracts");
      return;
    }

    // ユーザーデータベースの判定（フォールバック）
    if (userData) {
      if (userData.hasCasterProfile && !userData.hasOrdererProfile) {
        setMessageListPath("/caster/message_list");
        setContractListPath("/caster/contracts");
      } else if (userData.hasOrdererProfile && !userData.hasCasterProfile) {
        setMessageListPath("/order/message_list");
        setContractListPath("/order/contracts");
      } else if (userData.hasCasterProfile && userData.hasOrdererProfile) {
        // 両方持っている場合は、パスに基づいて判定（デフォルトはorder）
        setMessageListPath("/order/message_list");
        setContractListPath("/order/contracts");
      }
    }
  }, [pathname, userData]);

  // orderとしてログインしているかどうかを判定
  const isOrderer = userData?.hasOrdererProfile ?? false;
  // casterとしてログインしているかどうかを判定
  const isCaster = userData?.hasCasterProfile ?? false;

  // お気に入りページのパスを決定
  const favoritePath = isCaster ? "/caster/favorite" : "/order/favorite";

  // マイページへの遷移先を決定
  const getMyPagePath = (): string => {
    // パスベースの判定（優先度：高）
    if (pathname.startsWith("/caster") || pathname.startsWith("/top/caster")) {
      return "/caster/mypage";
    }
    if (pathname.startsWith("/order") || pathname.startsWith("/top/order")) {
      return "/order/mypage";
    }

    // ユーザーデータベースの判定（フォールバック）
    if (userData) {
      if (userData.hasCasterProfile && !userData.hasOrdererProfile) {
        return "/caster/mypage";
      }
      if (userData.hasOrdererProfile && !userData.hasCasterProfile) {
        return "/order/mypage";
      }
      if (userData.hasCasterProfile && userData.hasOrdererProfile) {
        // 両方持っている場合は、パスに基づいて判定（デフォルトはorder）
        return "/order/mypage";
      }
    }

    // デフォルト
    return "/order/mypage";
  };

  // 表示する画像を決定（メイン画像があればそれを使用、なければデフォルト画像）
  const casterMainProfileImage = casterProfileData && "mainProfileImage" in casterProfileData 
    ? (casterProfileData.mainProfileImage as string | null | undefined)
    : null;
  const ordererMainProfileImage = ordererProfileData && "mainProfileImage" in ordererProfileData
    ? (ordererProfileData.mainProfileImage as string | null | undefined)
    : null;
  
  // 現在のパスに応じて適切なプロフィール画像を選択
  const mainProfileImage = (pathname.startsWith("/caster") || pathname.startsWith("/top/caster"))
    ? casterMainProfileImage
    : ordererMainProfileImage || casterMainProfileImage;
  
  const displayImage: string = (mainProfileImage && typeof mainProfileImage === "string")
    ? mainProfileImage
    : userPicture.src;

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      router.push("/login");
    },
    onError: (error) => {
      console.error("ログアウトエラー:", error);
    },
  });

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    onClose();
  };

  const handleMyPageClick = () => {
    router.push(getMyPagePath());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "60px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "343px",
        height: "auto",
        maxHeight: "80vh",
        background: "rgba(0, 0, 0, 0.90)",
        borderRadius: "10px",
        zIndex: 40,
        padding: "30px",
        boxSizing: "border-box",
        overflowY: "auto",
      }}
    >
      {/* 閉じるボタン */}
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "0",
        }}
        aria-label="閉じる"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 23 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line
            x1="0.707107"
            y1="1.29289"
            x2="21.9203"
            y2="22.5061"
            stroke="white"
            strokeWidth="2"
          />
          <line
            x1="21.9203"
            y1="1.70711"
            x2="0.707107"
            y2="22.9203"
            stroke="white"
            strokeWidth="2"
          />
        </svg>
      </button>

      {/* メニュー項目 */}
      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          marginTop: "60px",
          alignItems: "center",
        }}
      >
        <Link
          href="/usage_guide"
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          style={{
            color: "white",
            fontSize: "12px",
            fontFamily: "Noto Sans JP",
            fontWeight: "700",
            textDecoration: "none",
            paddingBottom: "15px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
            textAlign: "center",
            width: "100%",
          }}
        >
          料金
        </Link>
        <Link
          href="/top#casts"
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          style={{
            color: "white",
            fontSize: "12px",
            fontFamily: "Noto Sans JP",
            fontWeight: "700",
            textDecoration: "none",
            paddingBottom: "15px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
            textAlign: "center",
            width: "100%",
          }}
        >
          キャスト一覧
        </Link>
        <Link
          href="/receive-work"
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          style={{
            color: "white",
            fontSize: "12px",
            fontFamily: "Noto Sans JP",
            fontWeight: "500",
            textDecoration: "none",
            paddingBottom: "15px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
            textAlign: "center",
            width: "100%",
          }}
        >
          仕事を受ける
        </Link>
        <Link
          href="/order-work"
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          style={{
            color: "white",
            fontSize: "12px",
            fontFamily: "Noto Sans JP",
            fontWeight: "500",
            textDecoration: "none",
            paddingBottom: "15px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
            textAlign: "center",
            width: "100%",
          }}
        >
          仕事を発注する
        </Link>

        {/* 新しい仕事を依頼（isOrdererの場合のみ） */}
        {isOrderer && (
          <Link
            href="/order/add_project"
            rel="noopener noreferrer"
            onClick={onClose}
            style={{
              color: "#ff6d00",
              fontSize: "12px",
              fontFamily: "Noto Sans JP",
              fontWeight: "500",
              textDecoration: "none",
              paddingBottom: "15px",
              borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
              textAlign: "center",
              width: "100%",
            }}
          >
            新しい仕事を依頼
          </Link>
        )}

        {/* キャスト検索（isOrdererの場合のみ） */}
        {isOrderer && (
          <Link
            href="/top/order"
            rel="noopener noreferrer"
            onClick={onClose}
            style={{
              color: "#ff6d00",
              fontSize: "12px",
              fontFamily: "Noto Sans JP",
              fontWeight: "500",
              textDecoration: "none",
              paddingBottom: "15px",
              borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
              textAlign: "center",
              width: "100%",
            }}
          >
            キャスト検索
          </Link>
        )}

        {/* メッセージ */}
        <Link
          href={messageListPath}
          rel="noopener noreferrer"
          onClick={onClose}
          style={{
            color: "#ff6d00",
            fontSize: "12px",
            fontFamily: "Noto Sans JP",
            fontWeight: "500",
            textDecoration: "none",
            paddingBottom: "15px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
            textAlign: "center",
            width: "100%",
          }}
        >
          メッセージ
        </Link>

        {/* 契約一覧 */}
        <Link
          href={contractListPath}
          rel="noopener noreferrer"
          onClick={onClose}
          style={{
            color: "#ff6d00",
            fontSize: "12px",
            fontFamily: "Noto Sans JP",
            fontWeight: "500",
            textDecoration: "none",
            paddingBottom: "15px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
            textAlign: "center",
            width: "100%",
          }}
        >
          契約一覧
        </Link>

        {/* パッケージ予約 */}
        <Link
          href="/order/package_reservate"
          rel="noopener noreferrer"
          onClick={onClose}
          style={{
            color: "#ff6d00",
            fontSize: "12px",
            fontFamily: "Noto Sans JP",
            fontWeight: "500",
            textDecoration: "none",
            paddingBottom: "15px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
            textAlign: "center",
            width: "100%",
          }}
        >
          パッケージ予約
        </Link>

        {/* お気に入り */}
        <Link
          href={favoritePath}
          rel="noopener noreferrer"
          onClick={onClose}
          style={{
            color: "#ff6d00",
            fontSize: "12px",
            fontFamily: "Noto Sans JP",
            fontWeight: "500",
            textDecoration: "none",
            paddingBottom: "15px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
            textAlign: "center",
            width: "100%",
          }}
        >
          お気に入り
        </Link>

        {/* 通知 */}
        <div
          onClick={onClose}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: "15px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
            width: "100%",
            cursor: "pointer",
          }}
        >
          <img
            src={notificationBell.src}
            alt="通知"
            style={{
              width: "25px",
              height: "25px",
            }}
          />
        </div>

        {/* マイページ */}
        <div
          onClick={handleMyPageClick}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            paddingBottom: "15px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
            width: "100%",
            cursor: "pointer",
            justifyContent: "center",
          }}
        >
          <img
            src={displayImage}
            alt="ユーザーアイコン"
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
          <span
            style={{
              color: "white",
              fontSize: "12px",
              fontFamily: "Noto Sans JP",
              fontWeight: "500",
            }}
          >
            マイページ
          </span>
        </div>

        {/* ログアウトボタン */}
        <button
          onClick={handleLogout}
          style={{
            marginTop: "10px",
            width: "218px",
            height: "38px",
            background: "white",
            borderRadius: "90px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "black",
            fontSize: "14px",
            fontFamily: "Noto Sans JP",
            fontWeight: "500",
            border: "none",
            cursor: "pointer",
          }}
        >
          ログアウト
        </button>
      </nav>
    </div>
  );
};

export default MobileLoginedNav;
