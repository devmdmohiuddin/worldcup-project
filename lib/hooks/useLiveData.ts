"use client";

import { useEffect, useRef, useState } from "react";

interface Options<T> {
  url: string;
  intervalMs: number;
  /** Pause polling when the document is hidden. Defaults to true. */
  pauseWhenHidden?: boolean;
  /** Optional transform run on the raw JSON before storing. */
  select?: (raw: unknown) => T;
}

interface State<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

export function useLiveData<T>({
  url,
  intervalMs,
  pauseWhenHidden = true,
  select,
}: Options<T>): State<T> {
  const [state, setState] = useState<State<T>>({ data: null, error: null, loading: true });
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let aborted = false;

    const tick = async () => {
      try {
        const res = await fetch(url, { cache: "no-store" });
        const json = (await res.json()) as unknown;
        if (aborted || !mountedRef.current) return;
        const data = select ? select(json) : (json as T);
        setState({ data, error: null, loading: false });
      } catch (err) {
        if (aborted || !mountedRef.current) return;
        const message = err instanceof Error ? err.message : "Network error";
        setState((s) => ({ ...s, error: message, loading: false }));
      }
      if (aborted) return;
      const visible = !pauseWhenHidden || (typeof document !== "undefined" && !document.hidden);
      timer = setTimeout(tick, visible ? intervalMs : intervalMs * 4);
    };

    tick();

    const onVisibility = () => {
      if (document.hidden) return;
      if (timer) clearTimeout(timer);
      tick();
    };
    if (pauseWhenHidden && typeof document !== "undefined") {
      document.addEventListener("visibilitychange", onVisibility);
    }

    return () => {
      aborted = true;
      mountedRef.current = false;
      if (timer) clearTimeout(timer);
      if (pauseWhenHidden && typeof document !== "undefined") {
        document.removeEventListener("visibilitychange", onVisibility);
      }
    };
  }, [url, intervalMs, pauseWhenHidden, select]);

  return state;
}
