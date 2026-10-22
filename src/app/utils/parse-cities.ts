// "Bratislava, Trnava,, Vienna" to ['Bratislava','Trnava','Vienna']
export const parseCities = (query: string): string[] => {
  const seen = new Set<string>();
  return query
    .split(',')
    .map((c) => c.trim())
    .filter((c) => {
      const key = c.toLowerCase();
      if (!c || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
};