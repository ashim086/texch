"use client";
// ─── Address autocomplete using Photon (OpenStreetMap / Komoot) ───────────────
// Completely free — no API key, no credit card required.
// Docs: https://photon.komoot.io

import { useState, useEffect, useRef } from "react";

export interface PlacePrediction {
    placeId: string; // "lon,lat" used as a stable key
    description: string;
    mainText: string;
    secondaryText: string;
    lat: number;
    lng: number;
}

interface PhotonFeature {
    type: string;
    geometry: { coordinates: [number, number] };
    properties: {
        name?: string;
        street?: string;
        housenumber?: string;
        city?: string;
        state?: string;
        country?: string;
        postcode?: string;
    };
}

function formatPrediction(f: PhotonFeature): PlacePrediction {
    const p = f.properties;
    const [lon, lat] = f.geometry.coordinates;

    const streetLine = [p.housenumber, p.street].filter(Boolean).join(" ");
    const mainText = streetLine || p.name || "";
    const secondary = [p.city, p.state, p.country].filter(Boolean).join(", ");
    const description = [mainText, secondary].filter(Boolean).join(", ");

    return {
        placeId: `${lon},${lat}`,
        description: description || secondary,
        mainText: mainText || secondary,
        secondaryText: secondary,
        lat,
        lng: lon,
    };
}

export function usePlacesAutocomplete(input: string, delay = 350) {
    const [suggestions, setSuggestions] = useState<PlacePrediction[]>([]);
    const [loading, setLoading] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const controllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        if (!input || input.length < 2) {
            setSuggestions([]);
            return;
        }

        clearTimeout(timerRef.current);

        timerRef.current = setTimeout(async () => {
            // Abort previous in-flight request
            controllerRef.current?.abort();
            controllerRef.current = new AbortController();

            setLoading(true);
            try {
                const url =
                    `https://photon.komoot.io/api/?q=${encodeURIComponent(input)}` +
                    `&limit=6&lang=en`;

                const res = await fetch(url, {
                    signal: controllerRef.current.signal,
                    headers: { Accept: "application/json" },
                });

                if (!res.ok) throw new Error("Photon API error");

                const data: { features: PhotonFeature[] } = await res.json();
                setSuggestions(data.features.map(formatPrediction));
            } catch (err: unknown) {
                // Ignore abort errors (user kept typing)
                if (err instanceof Error && err.name !== "AbortError") {
                    setSuggestions([]);
                }
            } finally {
                setLoading(false);
            }
        }, delay);

        return () => {
            clearTimeout(timerRef.current);
            controllerRef.current?.abort();
        };
    }, [input, delay]);

    return { suggestions, loading };
}
