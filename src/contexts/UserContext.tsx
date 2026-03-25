"use client";

/**
 * UserContext
 *
 * アプリ起動時に一度だけ getSession() を呼び、その結果をアプリ全体で共有する。
 * これにより「ページ遷移ごとに getSession → getCurrentUser を直列実行する」
 * ウォーターフォールを解消し、遷移を即座に体感できるようにする。
 *
 * フロー:
 *   1. AppMount → getSession() (1回のみ)
 *   2. userId 確定 → trpc.auth.getCurrentUser (React Query でキャッシュ・5分間有効)
 *   3. 各ページは useUser() で即座に { userId, hasCasterProfile, hasOrdererProfile } を取得
 */

import React, { createContext, useContext, useEffect, useState } from "react";
import { trpc } from "@/lib/trpc/client";

type UserContextValue = {
  userId: string | null;
  isLoading: boolean;
  hasCasterProfile: boolean;
  hasOrdererProfile: boolean;
};

const UserContext = createContext<UserContextValue>({
  userId: null,
  isLoading: true,
  hasCasterProfile: false,
  hasOrdererProfile: false,
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let unsubscribe: (() => void) | null = null;

    const initSession = async () => {
      const { supabase } = await import("@/lib/supabase");
      if (!isMounted) return;

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!isMounted) return;
      setUserId(session?.user?.id ?? null);
      setIsLoadingSession(false);

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, newSession) => {
        if (!isMounted) return;
        setUserId(newSession?.user?.id ?? null);
      });

      unsubscribe = () => subscription.unsubscribe();
    };

    initSession();

    return () => {
      isMounted = false;
      unsubscribe?.();
    };
  }, []);

  // userId が確定したら getCurrentUser を取得 (React Query でキャッシュ)
  const { data: userData, isLoading: isLoadingUser } =
    trpc.auth.getCurrentUser.useQuery(
      { userId: userId! },
      {
        enabled: !!userId && !isLoadingSession,
        staleTime: 5 * 60 * 1000, // 5分間キャッシュ: 再ナビゲーション時は即時
        retry: false,
      }
    );

  const value: UserContextValue = {
    userId,
    isLoading: isLoadingSession || (!!userId && isLoadingUser),
    hasCasterProfile: userData?.hasCasterProfile ?? false,
    hasOrdererProfile: userData?.hasOrdererProfile ?? false,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export const useUser = () => useContext(UserContext);
