import { useEffect, useState } from 'react';

import currencies, { CurrencyRate } from '@/providers/currencies';
import { Unit, UnitCategory } from '../types';

const CURRENCY_INFO: Record<string, { label: string }> = {
  USD: { label: 'US Dollar' },
  EUR: { label: 'Euro' },
  GBP: { label: 'British Pound' },
  JPY: { label: 'Japanese Yen' },
  CHF: { label: 'Swiss Franc' },
  CAD: { label: 'Canadian Dollar' },
  AUD: { label: 'Australian Dollar' },
  CNY: { label: 'Chinese Yuan' },
  HKD: { label: 'Hong Kong Dollar' },
  SGD: { label: 'Singapore Dollar' },
  NZD: { label: 'New Zealand Dollar' },
  BRL: { label: 'Brazilian Real' },
  MXN: { label: 'Mexican Peso' },
  INR: { label: 'Indian Rupee' },
  KRW: { label: 'South Korean Won' },
};

function buildUnits(rates: CurrencyRate[]): Unit[] {
  const rateMap = new Map(rates.map((r) => [r.quote, r.rate]));

  const units: Unit[] = [
    {
      key: 'USD',
      label: 'US Dollar',
      abbreviation: 'USD',
      toBase: (v) => v,
      fromBase: (v) => v,
    },
  ];

  for (const [code, info] of Object.entries(CURRENCY_INFO)) {
    if (code === 'USD') continue;
    const rate = rateMap.get(code);
    if (rate == null) continue;

    units.push({
      key: code,
      label: info.label,
      abbreviation: code,
      toBase: (v) => v / rate,
      fromBase: (v) => v * rate,
    });
  }

  return units;
}

type CurrencyCategoryState = {
  category: UnitCategory;
  loading: boolean;
  error: boolean;
};

export function useCurrencyCategory(): CurrencyCategoryState {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    currencies.getCurrencies().then((result) => {
      if (cancelled) return;

      if (result === false) {
        setError(true);
        setLoading(false);
        return;
      }

      setUnits(buildUnits(result));
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    category: {
      key: 'currency',
      label: 'Currency',
      icon: 'attach-money',
      units,
    },
    loading,
    error,
  };
}
