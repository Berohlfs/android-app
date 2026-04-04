import { z } from 'zod';

const RateSchema = z.object({
  date: z.string(),
  base: z.string(),
  quote: z.string(),
  rate: z.number(),
});

const RatesResponseSchema = z.array(RateSchema);

export type CurrencyRate = z.infer<typeof RateSchema>;

const QUOTES = [
  'AUD',
  'BRL',
  'CAD',
  'CHF',
  'CNY',
  'EUR',
  'GBP',
  'HKD',
  'INR',
  'JPY',
  'KRW',
  'MXN',
  'NZD',
  'SGD',
];

const API_URL = `https://api.frankfurter.dev/v2/rates?base=USD&quotes=${QUOTES.join(',')}`;

class Currencies {
  async getCurrencies(): Promise<CurrencyRate[] | false> {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      const result = RatesResponseSchema.safeParse(data);

      if (!result.success) {
        return false;
      }

      return result.data;
    } catch {
      return false;
    }
  }
}

export default new Currencies();
