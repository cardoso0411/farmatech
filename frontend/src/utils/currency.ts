import currency from 'currency.js';

const brlOptions = {
  symbol: 'R$ ',
  separator: '.',
  decimal: ',',
  precision: 2,
};

export function money(value: number | string) {
  return currency(value, brlOptions);
}

export function formatMoney(value: number | string) {
  return money(value).format();
}
