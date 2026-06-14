/** Equipment usage hours with thousands separators (e.g. 1240 -> "1.240"). */
export function formatHours(hours: number) {
  return hours.toLocaleString("es-ES")
}
