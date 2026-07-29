export const formatMonthToApiDate = (month: string): string => {
  const [year, monthNumber] = month.split("-");

  return `${year}-${monthNumber}-01`;
};