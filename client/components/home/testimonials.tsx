"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
    {
        quote: "Searched for man with van near me and found NNR. Best decision. The driver was professional, careful with my furniture, and made the whole experience stress-free.",
        name: "Sarah Mitchell",
        role: "Sydney, NSW",
        avatar: "https://i.pravatar.cc/150?img=12",
    },
    {
        quote: "Booked a house removal from Melbourne to Brisbane. The team was punctual, efficient and nothing was damaged. Highly recommended!",
        name: "James Nguyen",
        role: "Melbourne, VIC",
        avatar: "https://i.pravatar.cc/150?img=53",
    },
    {
        quote: "As a startup founder relocating our office, I needed a reliable team. NNR delivered exactly that — fast, careful and great value.",
        name: "Priya Sharma",
        role: "Perth, WA",
        avatar: "https://i.pravatar.cc/150?img=47",
    },
    {
        quote: "Incredible service from start to finish. The app made booking so easy and the movers arrived right on time. Will use again!",
        name: "Tom Brennan",
        role: "Brisbane, QLD",
        avatar: "https://i.pravatar.cc/150?img=33",
    },
    {
        quote: "Had to move my piano interstate and was nervous about it. The NNR team handled it with such care. Absolutely worth every cent.",
        name: "Emma Clarke",
        role: "Adelaide, SA",
        avatar: "https://i.pravatar.cc/150?img=9",
    },
    {
        quote: "Student move from uni accommodation — fast, affordable and the guys were super friendly. Exactly what I needed!",
        name: "Liam Chen",
        role: "Canberra, ACT",
        avatar: "https://i.pravatar.cc/150?img=60",
    },
];

const VISIBLE = 3;

export default function Testimonials() {
    const [start, setStart] = useState(0);

    const prev = () => setStart((s) => Math.max(0, s - 1));
    const next = () => setStart((s) => Math.min(testimonials.length - VISIBLE, s + 1));

    const visible = testimonials.slice(start, start + VISIBLE);

    return (
        <section className="py-20 px-6">
            <div className="mx-auto max-w-5xl">
                {/* Heading */}
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">
                    What our customers say
                </h2>

                {/* Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
                    {visible.map((t, i) => (
                        <Card key={i} className="border-gray-200 shadow-sm flex flex-col justify-between">
                            <CardContent className="p-6 flex flex-col gap-4 h-full">
                                {/* Stars */}
                                <div className="flex gap-0.5">
                                    {Array.from({ length: 5 }).map((_, s) => (
                                        <Star key={s} className="h-5 w-5 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>

                                {/* Quote */}
                                <p className="text-gray-600 text-sm leading-relaxed flex-1">
                                    &ldquo;{t.quote}&rdquo;
                                </p>

                                {/* Author */}
                                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                                        <p className="text-xs text-gray-400">{t.role}</p>
                                    </div>
                                    <img
                                        src={t.avatar}
                                        alt={t.name}
                                        className="h-14 w-14 rounded-lg object-cover"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-center gap-3">
                    <button
                        onClick={prev}
                        disabled={start === 0}
                        className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-300 text-gray-500 hover:border-gray-400 disabled:opacity-30 transition"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                        onClick={next}
                        disabled={start >= testimonials.length - VISIBLE}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-30 transition"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </section>
    );
}
