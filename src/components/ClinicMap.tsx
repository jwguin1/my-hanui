"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
import { CLINIC, CLINIC_ADDRESS_STREET } from "@/lib/clinic";

const NAVER_PLACE_URL = "https://naver.me/IItclnGB";
const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID?.trim();

type MapInstance = { destroy: () => void };
type NaverMaps = {
  LatLng: new (latitude: number, longitude: number) => object;
  Map: new (element: HTMLElement, options: object) => MapInstance;
  Marker: new (options: object) => { setMap: (map: null) => void };
};

declare global {
  interface Window {
    naver?: { maps?: NaverMaps };
    navermap_authFailure?: () => void;
  }
}

export default function ClinicMap() {
  const container = useRef<HTMLDivElement>(null);
  const cleanup = useRef<(() => void) | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [ready, setReady] = useState(false);

  const stopTimer = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  }, []);

  const showDirections = useCallback(() => {
    stopTimer();
    cleanup.current?.();
    cleanup.current = null;
    setReady(false);
  }, [stopTimer]);

  const initialize = useCallback(() => {
    const maps = window.naver?.maps;
    if (!container.current || !maps?.Map || cleanup.current) return;

    try {
      const position = new maps.LatLng(CLINIC.geo.latitude, CLINIC.geo.longitude);
      const map = new maps.Map(container.current, {
        center: position,
        zoom: 17,
        zoomControl: true,
        scrollWheel: false,
      });
      cleanup.current = () => map.destroy();
      const marker = new maps.Marker({
        position,
        map,
        title: `${CLINIC.name} · ${CLINIC.building}`,
      });
      cleanup.current = () => {
        marker.setMap(null);
        map.destroy();
      };
      stopTimer();
      setReady(true);
    } catch {
      showDirections();
    }
  }, [showDirections, stopTimer]);

  useEffect(() => {
    if (!clientId) return;
    const previous = window.navermap_authFailure;
    window.navermap_authFailure = showDirections;
    timer.current = setTimeout(showDirections, 15000);
    // The SDK may already be cached after navigating away and back.
    initialize();
    return () => {
      stopTimer();
      cleanup.current?.();
      cleanup.current = null;
      window.navermap_authFailure = previous;
    };
  }, [initialize, showDirections, stopTimer]);

  return (
    <div className="overflow-hidden rounded-[10px] border border-border">
      <div className="relative h-[400px] bg-surface">
        <div
          ref={container}
          className="absolute inset-0"
          role="region"
          aria-label={`${CLINIC.name} 네이버 지도`}
          aria-hidden={!ready}
          style={{ visibility: ready ? "visible" : "hidden" }}
        />
        {!ready && (
          <div className="relative flex h-full flex-col items-center justify-center px-5 text-center">
            <p className="text-sm font-medium text-accent">위치 안내</p>
            <h2 className="mt-3 font-serif text-2xl font-semibold text-text">
              {CLINIC.building}
            </h2>
            <p className="mt-3 text-sm text-text-muted">{CLINIC_ADDRESS_STREET}</p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3 text-sm">
              <span className="rounded-md border border-border bg-white px-4 py-3">
                풍산역 2번 출구
              </span>
              <span className="text-accent">도보 1분 →</span>
              <span className="rounded-md border border-accent bg-white px-4 py-3 font-semibold text-accent">
                {CLINIC.name}
              </span>
            </div>
            <p className="mt-5 text-sm text-text-muted">{CLINIC.parkingDetail}</p>
            <a
              href={NAVER_PLACE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 rounded-md bg-[#03C75A] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              네이버 지도에서 위치·길찾기 보기 ↗
            </a>
          </div>
        )}
      </div>
      {ready && (
        <p className="border-t border-border px-5 py-3 text-center text-sm text-text-muted">
          {CLINIC.name} · {CLINIC.building}
        </p>
      )}
      {clientId && (
        <Script
          id="naver-maps-sdk"
          src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${encodeURIComponent(clientId)}`}
          strategy="afterInteractive"
          onReady={initialize}
          onError={showDirections}
        />
      )}
    </div>
  );
}
