/**
 * Format a date to a relative time string (e.g., "Earlier this year", "Today", "Yesterday")
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    return "Aujourd'hui";
  } else if (diffInDays === 1) {
    return 'Hier';
  } else if (diffInDays < 7) {
    return 'Cette semaine';
  } else if (diffInDays < 30) {
    return 'Ce mois-ci';
  } else {
    const currentYear = now.getFullYear();
    const itemYear = date.getFullYear();
    if (currentYear === itemYear) {
      return "Plus tôt cette année";
    } else {
      return 'Il y a plus d\'un an';
    }
  }
}

/**
 * Format a date to a readable string (e.g., "17 avr. 2025 11:38")
 */
export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

/**
 * Group dates by time period
 */
export function groupByTimePeriod<T extends { date: Date | string }>(
  items: T[],
): Array<{ period: string; items: T[] }> {
  const groups: Map<string, T[]> = new Map();

  items.forEach((item) => {
    const date = typeof item.date === 'string' ? new Date(item.date) : item.date;
    const period = formatRelativeTime(date);
    
    if (!groups.has(period)) {
      groups.set(period, []);
    }
    groups.get(period)!.push(item);
  });

  // Sort periods: Today first, then Yesterday, then others
  const periodOrder = ["Aujourd'hui", 'Hier', 'Cette semaine', 'Ce mois-ci', "Plus tôt cette année", 'Il y a plus d\'un an'];
  
  return Array.from(groups.entries())
    .sort(([a], [b]) => {
      const indexA = periodOrder.indexOf(a);
      const indexB = periodOrder.indexOf(b);
      if (indexA === -1 && indexB === -1) return 0;
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    })
    .map(([period, items]) => ({ period, items }));
}

