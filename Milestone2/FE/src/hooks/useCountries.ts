import { useEffect, useState } from 'react';
import axios from 'axios';

export interface CountryOption {
  code: string;
  name: string;
}

type RestCountry = {
  cca2?: string;
  name?: {
    common?: string;
  };
};

type RestCountryWithFields = {
  cca2: string;
  name: {
    common: string;
  };
};

let cachedCountries: CountryOption[] | null = null;
let inFlight: Promise<CountryOption[]> | null = null;

async function fetchCountriesOnce(): Promise<CountryOption[]> {
  if (cachedCountries) return cachedCountries;
  if (inFlight) return inFlight;

  inFlight = axios
    .get('https://restcountries.com/v3.1/all?fields=name,cca2')
    .then((res) => {
      const raw = res.data as RestCountry[];
      const data: CountryOption[] = raw
        .filter(
          (c): c is RestCountryWithFields =>
            typeof c.cca2 === 'string' &&
            typeof c.name?.common === 'string' &&
            c.cca2.length > 0 &&
            c.name.common.length > 0
        )
        .map((c) => ({
          name: c.name.common,
          code: c.cca2,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

      cachedCountries = data;
      return data;
    })
    .finally(() => {
      inFlight = null;
    });

  return inFlight;
}

export function useCountries() {
  const [countries, setCountries] = useState<CountryOption[]>(
    cachedCountries ?? []
  );
  const [loading, setLoading] = useState(!cachedCountries);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (cachedCountries) return;

    fetchCountriesOnce()
      .then((data) => {
        if (!isMounted) return;
        setCountries(data);
        setError(null);
      })
      .catch(() => {
        if (!isMounted) return;
        setError('Failed to load countries');
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { countries, loading, error };
}
