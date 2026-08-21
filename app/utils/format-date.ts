import { format, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'

export function formatDate(date: string | null, fallback: string | null = null) {
  if (!date) return fallback
  return format(parseISO(date), 'd MMMM yyyy', { locale: ru })
}
