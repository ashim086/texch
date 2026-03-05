"use client";

import { useState, useEffect, useRef } from "react";
import {
    Star,
    Download,
    Phone,
    ArrowUpRight,
    ShieldCheck,
    Landmark,
    ArrowRight,
    LocateFixed,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import PlacesInput from "@/components/shared/PlacesInput";
import { reverseGeocode } from "@/lib/googleMaps";

const navLinks = [
    { label: "Home", href: "#" },
    { label: "About us", href: "#about" },
    { label: "Our Services", href: "#services" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Contact us", href: "#contact" },
];

interface HeroProps {
    onLoginClick?: () => void;
    onGetQuote?: (from: string, to: string) => void;
}

const Hero = ({ onLoginClick, onGetQuote }: HeroProps) => {
    const [movingFrom, setMovingFrom] = useState("");
    const [movingTo, setMovingTo] = useState("");
    const [locating, setLocating] = useState(false);
    const [quoteError, setQuoteError] = useState("");
    const hasFetchedLocation = useRef(false);

    // ── Request geolocation once on mount ─────────────────────────────────
    useEffect(() => {
        if (hasFetchedLocation.current) return;
        hasFetchedLocation.current = true;

        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                setLocating(true);
                try {
                    const address = await reverseGeocode(
                        pos.coords.latitude,
                        pos.coords.longitude
                    );
                    setMovingFrom(address);
                } catch {
                    // silently ignore – user can type manually
                } finally {
                    setLocating(false);
                }
            },
            () => {
                // permission denied – user types manually
            }
        );
    }, []);

    const { isAuthenticated } = useAuth();
    const router = useRouter();

    const handleGetQuote = (e: React.FormEvent) => {
        e.preventDefault();
        if (!movingFrom.trim() || !movingTo.trim()) {
            setQuoteError("Please enter both pick-up and drop-off addresses.");
            return;
        }
        setQuoteError("");
        onGetQuote?.(movingFrom.trim(), movingTo.trim());
    };

    return (
        <section className="min-h-screen overflow-hidden">
            {/* ─── Navbar ─── */}
            <nav className="w-full">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
                    <a href="/" className="text-2xl font-bold text-gray-900 tracking-tight">
                        <span className="text-emerald-600">N</span>N<span className="text-emerald-600">R</span>
                    </a>

                    <ul className="hidden lg:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <li key={link.label}>
                                <a
                                    href={link.href}
                                    className="text-sm font-medium text-gray-600 hover:bg-emerald-600 hover:text-white rounded-full px-3 py-1.5 transition"
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>

                    {
                        isAuthenticated ?

                            <Button onClick={() => router.push("/dashboard")}>Dashboard <ArrowRight /></Button> : (
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={onLoginClick}
                                        className="hidden sm:inline-flex text-sm font-medium cursor-pointer rounded-full hover:bg-emerald-600 hover:text-white text-gray-700 transition px-4 py-2">
                                        Login
                                    </button>
                                    <a
                                        href="#get-started"
                                        className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-emerald-700 transition"
                                    >
                                        Get Started
                                        <ArrowUpRight className="h-4 w-4" />
                                    </a>
                                </div>
                            )
                    }

                </div>
            </nav>

            {/* ─── Hero Content ─── */}
            <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2 px-6 pt-8 lg:pt-12">
                {/* Left Column */}
                <div className="flex flex-col justify-center pb-16 lg:pb-24 lg:pr-12">
                    {/* Rating badge */}
                    <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-600">
                        <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                            ))}
                        </div>
                        <span>
                            Rated <strong className="text-gray-900">4.9/5</strong> by 3,000+ Aussie Customers
                        </span>
                        <span className="font-semibold text-gray-900">★ Google Reviews</span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-2xl sm:text-5xl lg:text-[2.3rem] font-bold leading-tight text-gray-900 mb-6">
                        Namaste Nepal
                        <br />
                        Australian Removals,{" "}
                        <span className="relative inline-block">
                            Simplified
                            <svg
                                className="absolute -bottom-2 left-0 w-full"
                                viewBox="0 0 286 10"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M2 8C50 2 236 -1 284 6" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
                            </svg>
                        </span>
                    </h1>

                    {/* Subtext */}
                    <p className="mb-8 max-w-lg text-gray-500 leading-relaxed">
                        Moving home? Need a man with van? Looking for removal companies near me? NNR makes it happen in 60 seconds.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-wrap items-center gap-4 mb-10">
                        <button className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-emerald-700 transition">
                            <Download className="h-4 w-4" />
                            Download Our Apps
                        </button>
                        <button className="inline-flex items-center gap-2 rounded-full border-2 border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:border-gray-300 transition">
                            <Phone className="h-4 w-4 text-emerald-600" />
                            Call 1300 627 627
                        </button>
                    </div>

                    {/* Trust Badges */}
                    <div className="flex flex-wrap items-center gap-6">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="flex items-center justify-center rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-bold text-emerald-700 shadow-sm">
                                AFRA
                            </span>
                            Registered
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <ShieldCheck className="h-5 w-5 text-emerald-600" />
                            Fully Insured
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Landmark className="h-5 w-5 text-emerald-600" />
                            Australia-Wide
                        </div>
                    </div>
                </div>

                {/* Right Column – Image + Quote form */}
                <div className="flex items-end justify-center lg:justify-end">
                    <div className="relative w-full max-w-xl rounded-t-3xl lg:rounded-3xl">
                        <img
                            src="/man.png"
                            alt="Removal workers loading a van"
                            className="h-120 w-full object-cover lg:h-140 rounded-t-3xl lg:rounded-3xl"
                        />
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-linear-to-t from-gray-900/80 via-gray-900/30 to-transparent rounded-t-3xl lg:rounded-3xl pointer-events-none" />
                        {/* Quote form */}
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                            <form
                                onSubmit={handleGetQuote}
                                className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-5"
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                                    {/* Moving from */}
                                    <div>
                                        <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-white/80">
                                            Moving from?
                                            {locating && (
                                                <span className="flex items-center gap-1 text-white/50">
                                                    <LocateFixed className="size-3 animate-pulse" />
                                                    Locating…
                                                </span>
                                            )}
                                        </label>
                                        <PlacesInput
                                            variant="glass"
                                            value={movingFrom}
                                            onChange={setMovingFrom}
                                            placeholder="e.g. Sydney 2000"
                                        />
                                    </div>

                                    {/* Moving to */}
                                    <div>
                                        <label className="mb-1.5 block text-xs font-medium text-white/80">
                                            Moving to?
                                        </label>
                                        <PlacesInput
                                            variant="glass"
                                            value={movingTo}
                                            onChange={setMovingTo}
                                            placeholder="e.g. Melbourne 3000"
                                        />
                                    </div>
                                </div>

                                {/* Validation error */}
                                {quoteError && (
                                    <p className="mb-2 text-xs text-red-300">{quoteError}</p>
                                )}

                                <button
                                    type="submit"
                                    className="w-full rounded-lg bg-emerald-500 py-3 text-sm font-semibold text-white shadow-lg hover:bg-emerald-600 transition"
                                >
                                    Get Your Instant Quote
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;