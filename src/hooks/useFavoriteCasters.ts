import { useState, useMemo, useCallback } from "react";
import { trpc } from "@/lib/trpc/client";

interface UseFavoriteCastersProps {
    ordererId: string | null;
}

export const useFavoriteCasters = ({ ordererId }: UseFavoriteCastersProps) => {
    const [addingFavorites, setAddingFavorites] = useState<Set<string>>(new Set());
    const [removingFavorites, setRemovingFavorites] = useState<Set<string>>(new Set());

    // お気に入り一覧を取得（APIの最大値100件まで）
    const { data: favoriteCastersData, refetch: refetchFavorites } = trpc.favorite.getFavoriteCasters.useQuery(
        {
            ordererId: ordererId!,
            page: 1,
            limit: 100, // APIの最大値
        },
        {
            enabled: !!ordererId,
        }
    );

    // お気に入り追加のmutation
    const addFavoriteMutation = trpc.favorite.addFavorite.useMutation({
        onSuccess: () => {
            void refetchFavorites();
        },
    });

    // お気に入り削除のmutation
    const removeFavoriteMutation = trpc.favorite.removeFavorite.useMutation({
        onSuccess: () => {
            void refetchFavorites();
        },
    });

    // お気に入りIDのセットを作成
    const favoriteCasterIds = useMemo(
        () => new Set(favoriteCastersData?.casters.map((caster) => caster.id) || []),
        [favoriteCastersData?.casters]
    );

    // お気に入り登録されているかチェック
    const isFavorite = useCallback(
        (casterId: string): boolean => {
            return favoriteCasterIds.has(casterId);
        },
        [favoriteCasterIds]
    );

    // お気に入り追加処理
    const addFavorite = useCallback(
        async (casterId: string) => {
            if (!ordererId) {
                return;
            }

            setAddingFavorites((prev) => new Set(prev).add(casterId));

            try {
                await addFavoriteMutation.mutateAsync({
                    ordererId,
                    casterId,
                });
            } catch (error) {
                console.error("お気に入り追加エラー:", error);
                throw error;
            } finally {
                setAddingFavorites((prev) => {
                    const newSet = new Set(prev);
                    newSet.delete(casterId);
                    return newSet;
                });
            }
        },
        [ordererId, addFavoriteMutation]
    );

    // お気に入り削除処理
    const removeFavorite = useCallback(
        async (casterId: string) => {
            if (!ordererId) {
                return;
            }

            setRemovingFavorites((prev) => new Set(prev).add(casterId));

            try {
                await removeFavoriteMutation.mutateAsync({
                    ordererId,
                    casterId,
                });
            } catch (error) {
                console.error("お気に入り削除エラー:", error);
                throw error;
            } finally {
                setRemovingFavorites((prev) => {
                    const newSet = new Set(prev);
                    newSet.delete(casterId);
                    return newSet;
                });
            }
        },
        [ordererId, removeFavoriteMutation]
    );

    // お気に入り追加中かチェック
    const isAdding = useCallback(
        (casterId: string): boolean => {
            return addingFavorites.has(casterId);
        },
        [addingFavorites]
    );

    // お気に入り削除中かチェック
    const isRemoving = useCallback(
        (casterId: string): boolean => {
            return removingFavorites.has(casterId);
        },
        [removingFavorites]
    );

    return {
        favoriteCasters: favoriteCastersData?.casters || [],
        favoriteCasterIds,
        isFavorite,
        addFavorite,
        removeFavorite,
        isAdding,
        isRemoving,
        isLoading: !favoriteCastersData && !!ordererId,
    };
};
