export const dateFormatLg = (sbDate: string) => {
  return new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(sbDate));
};
export const formatCurrency = (
  amount: number,
  fiat?: string,
  local: string = "es-ES"
) => {
  const result = Intl.NumberFormat(local, {
    style: "currency",
    currency: fiat ? fiat : "EUR",
    minimumFractionDigits: 2,

    useGrouping: true,
    minimumIntegerDigits: 1,
    maximumFractionDigits: 2,
    currencyDisplay: "symbol",
    currencySign: "accounting",
  }).format(amount);
  return !result || result === "NaN" ? "0.00 €" : result;
};
