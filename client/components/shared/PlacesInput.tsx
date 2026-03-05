"use client";

import { useState, useId } from "react";
import { Loader2, MapPin } from "lucide-react";
import { usePlacesAutocomplete, PlacePrediction } from "@/hooks/usePlacesAutocomplete";
import { cn } from "@/lib/utils";

interface PlacesInputProps {
    value: string;
    onChange: (value: string) => void;
    /** Called when user clicks a suggestion — receives full prediction with coords */
    onSelect?: (prediction: PlacePrediction) => void;
    placeholder?: string;
    /** "glass" = frosted hero style, "default" = normal shadcn-style */
    variant?: "glass" | "default";
    className?: string;
    id?: string;
    hasError?: boolean;
}

export default function PlacesInput({
    value,
    onChange,
    onSelect,
    placeholder,
    variant = "default",
    className,
    id,
    hasError,
}: PlacesInputProps) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const [focused, setFocused] = useState(false);

    const { suggestions, loading } = usePlacesAutocomplete(focused ? value : "");

    const showDropdown = focused && (loading || suggestions.length > 0);

    return (
        <div className={cn("relative", className)}>
            <input
                id={inputId}
                type="text"
                autoComplete="off"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 150)}
                placeholder={placeholder}
                className={cn(
                    variant === "glass"
                        ? "w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2.5 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 transition"
                        : cn(
                            "w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition",
                            hasError ? "border-red-400" : "border-input"
                        )
                )}
            />

            {/* Spinner */}
            {loading && (
                <Loader2
                    className={cn(
                        "absolute right-3 top-1/2 -translate-y-1/2 size-3.5 animate-spin",
                        variant === "glass" ? "text-white/50" : "text-muted-foreground"
                    )}
                />
            )}

            {/* Dropdown */}
            {showDropdown && (
                <ul
                    className={cn(
                        "absolute top-[calc(100%+4px)] left-0 right-0 z-50 max-h-56 overflow-y-auto rounded-xl shadow-2xl border",
                        variant === "glass"
                            ? "bg-gray-900/95 backdrop-blur-xl border-white/15"
                            : "bg-background border-border"
                    )}
                >
                    {loading && suggestions.length === 0 && (
                        <li
                            className={cn(
                                "px-4 py-2.5 text-sm",
                                variant === "glass" ? "text-white/50" : "text-muted-foreground"
                            )}
                        >
                            Searching…
                        </li>
                    )}

                    {suggestions.map((s) => (
                        <li
                            key={s.placeId}
                            onMouseDown={(e) => {
                                e.preventDefault(); // keep focus, avoid blur race
                                onChange(s.description);
                                onSelect?.(s);
                                setFocused(false);
                            }}
                            className={cn(
                                "flex items-start gap-2.5 px-3 py-2.5 cursor-pointer text-sm select-none",
                                variant === "glass"
                                    ? "text-white/90 hover:bg-white/10"
                                    : "hover:bg-accent"
                            )}
                        >
                            <MapPin
                                className={cn(
                                    "size-3.5 shrink-0 mt-0.5",
                                    variant === "glass" ? "text-emerald-400" : "text-primary"
                                )}
                            />
                            <div className="min-w-0">
                                <div className="font-medium truncate">{s.mainText}</div>
                                <div
                                    className={cn(
                                        "text-xs truncate",
                                        variant === "glass"
                                            ? "text-white/50"
                                            : "text-muted-foreground"
                                    )}
                                >
                                    {s.secondaryText}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
