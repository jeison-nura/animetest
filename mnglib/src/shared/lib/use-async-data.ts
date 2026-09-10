"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type AsyncData<TData> = {
  data: TData | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
};

export function useAsyncData<TData>(
  fetcher: () => Promise<TData>
): AsyncData<TData> {
  const [data, setData] = useState<TData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const refetch = useCallback(() => {
    setReloadToken((token) => token + 1);
  }, []);

  useEffect(() => {
    let isCancelled = false;

    setIsLoading(true);
    setError(null);

    fetcherRef
      .current()
      .then((result) => {
        if (!isCancelled) {
          setData(result);
        }
      })
      .catch((cause: unknown) => {
        if (!isCancelled) {
          setError(cause instanceof Error ? cause : new Error(String(cause)));
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [reloadToken]);

  return { data, isLoading, error, refetch };
}
