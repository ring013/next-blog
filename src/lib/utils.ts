import { format } from "date-fns";
import { ja } from "date-fns/locale";

export function formatJa(dateIso: string) {
  return format(new Date(dateIso), "yyyy年MM月dd日", { locale: ja });
}
