import { format } from "date-fns";
import { ja } from "date-fns/locale";

/** 2025-09-17 -> 2025年09月17日 の日本語表記 */
export function formatJa(dateStr: string) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return format(d, "yyyy年MM月dd日", { locale: ja });
}

/**
 * 読了時間の概算（分）
 * - HTMLをテキスト化して文字数を数える
 * - 日本語前提で「500文字 = 1分」として丸め
 * - 最低1分
 */
export function estimateReadingMinutes(html: string, charsPerMin = 500): number {
  if (!html) return 1;
  // HTMLタグ除去
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const chars = [...text].length; // サロゲートペアも考慮
  return Math.max(1, Math.round(chars / Math.max(1, charsPerMin)));
}
