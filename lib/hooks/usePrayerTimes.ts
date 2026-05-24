"use client";

import { useEffect, useState } from "react";
import type { PrayerTimes } from "@/lib/prayer";

const LS_LAT = "fc_user_lat";
const LS_LNG = "fc_user_lng";
const LS_METHOD = "fc_prayer_method";
const LS_DENIED = "fc_geo_denied";

export interface PrayerCoords {
  latitude: number;
  longitude: number;
}

export interface UsePrayerTimes {
  coords: PrayerCoords | null;
  times: PrayerTimes | null;
  loading: boolean;
  error: string | null;
  /** True if we asked for geolocation and the user denied. */
  denied: boolean;
  requestLocation: () => void;
  setManualCoords: (coords: PrayerCoords) => void;
  method: number;
  setMethod: (m: number) => void;
}

function readStored(): PrayerCoords | null {
  if (typeof window === "undefined") return null;
  const lat = Number(localStorage.getItem(LS_LAT));
  const lng = Number(localStorage.getItem(LS_LNG));
  if (Number.isFinite(lat) && Number.isFinite(lng) && (lat !== 0 || lng !== 0)) {
    return { latitude: lat, longitude: lng };
  }
  return null;
}

function writeStored(coords: PrayerCoords) {
  localStorage.setItem(LS_LAT, String(coords.latitude));
  localStorage.setItem(LS_LNG, String(coords.longitude));
}

export function usePrayerTimes(): UsePrayerTimes {
  const [coords, setCoords] = useState<PrayerCoords | null>(null);
  const [times, setTimes] = useState<PrayerTimes | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [denied, setDenied] = useState(false);
  const [method, setMethodState] = useState<number>(3);

  useEffect(() => {
    const stored = readStored();
    if (stored) setCoords(stored);
    const m = Number(localStorage.getItem(LS_METHOD));
    if (Number.isFinite(m) && m > 0) setMethodState(m);
    if (localStorage.getItem(LS_DENIED) === "1") setDenied(true);
  }, []);

  useEffect(() => {
    if (!coords) return;
    let aborted = false;
    setLoading(true);
    setError(null);
    fetch(`/api/prayer?lat=${coords.latitude}&lng=${coords.longitude}&method=${method}`)
      .then(async (r) => {
        if (!r.ok) throw new Error("Failed to fetch prayer times");
        return (await r.json()) as PrayerTimes;
      })
      .then((data) => {
        if (aborted) return;
        setTimes(data);
      })
      .catch((err: unknown) => {
        if (aborted) return;
        setError(err instanceof Error ? err.message : "Unknown error");
      })
      .finally(() => {
        if (!aborted) setLoading(false);
      });
    return () => {
      aborted = true;
    };
  }, [coords, method]);

  function requestLocation() {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setError("Geolocation not supported in this browser");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const next = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
        writeStored(next);
        localStorage.removeItem(LS_DENIED);
        setDenied(false);
        setCoords(next);
      },
      () => {
        localStorage.setItem(LS_DENIED, "1");
        setDenied(true);
        setLoading(false);
        setError("Location permission denied");
      },
      { enableHighAccuracy: false, maximumAge: 60 * 60 * 1000, timeout: 10_000 },
    );
  }

  function setManualCoords(next: PrayerCoords) {
    writeStored(next);
    setDenied(false);
    localStorage.removeItem(LS_DENIED);
    setCoords(next);
  }

  function setMethod(m: number) {
    localStorage.setItem(LS_METHOD, String(m));
    setMethodState(m);
  }

  return {
    coords,
    times,
    loading,
    error,
    denied,
    requestLocation,
    setManualCoords,
    method,
    setMethod,
  };
}
