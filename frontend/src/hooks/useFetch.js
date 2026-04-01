import { useState, useEffect } from 'react';

export default function useFetch(fetchFn, fallback = []) {
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchFn()
      .then((res) => { if (!cancelled) setData(res?.length ? res : fallback); })
      .catch((err) => console.error('Fetch error:', err))
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return { data, loading };
}
