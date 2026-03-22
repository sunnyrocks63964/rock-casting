import { permanentRedirect } from "next/navigation";

/**
 * /top はルートURL（/）へリダイレクト
 * 正規URLを https://www.rock-casting.com/ に統一し、インデックス登録を促進
 */
export default function TopPage() {
  permanentRedirect("/");
}
