"use client";

import Image from "next/image";

export type AnimationType = "delivery" | "holiday";

interface LoadingAnimationProps {
    type?: AnimationType;
    size?: "sm" | "md" | "lg";
    message?: string;
    className?: string;
}

const animations: Record<AnimationType, string> = {
    delivery: "/Delivery car.gif",
    holiday: "/Summer Holiday.gif",
};

const sizes: Record<"sm" | "md" | "lg", { width: number; height: number }> = {
    sm: { width: 120, height: 120 },
    md: { width: 200, height: 200 },
    lg: { width: 300, height: 300 },
};

export function LoadingAnimation({
    type = "delivery",
    size = "md",
    message,
    className = "",
}: LoadingAnimationProps) {
    const { width, height } = sizes[size];

    return (
        <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
            <div className="relative">
                <Image
                    src={animations[type]}
                    alt="Loading..."
                    width={width}
                    height={height}
                    priority
                    unoptimized
                    className="object-contain"
                />
            </div>
            {message && (
                <p className="text-gray-500 text-sm font-medium animate-pulse">
                    {message}
                </p>
            )}
        </div>
    );
}

// Full page loading overlay
export function PageLoader({
    type = "delivery",
    message = "Loading...",
}: {
    type?: AnimationType;
    message?: string;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm">
            <LoadingAnimation type={type} size="lg" message={message} />
        </div>
    );
}

// Inline loader for sections
export function SectionLoader({
    type = "delivery",
    message,
    minHeight = "h-64",
}: {
    type?: AnimationType;
    message?: string;
    minHeight?: string;
}) {
    return (
        <div className={`flex items-center justify-center ${minHeight}`}>
            <LoadingAnimation type={type} size="md" message={message} />
        </div>
    );
}

// Card placeholder with animation
export function CardLoader({
    type = "delivery",
}: {
    type?: AnimationType;
}) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 flex items-center justify-center">
            <LoadingAnimation type={type} size="sm" />
        </div>
    );
}
