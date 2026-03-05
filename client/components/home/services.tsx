"use client";

import { Truck, Home, Clock, Users, ShieldCheck, Check } from "lucide-react";
import {
    Card,
    CardContent,
} from "@/components/ui/card";

const services = [
    {
        badge: "MOST POPULAR",
        badgeColor: "bg-emerald-500",
        image: "/manvan.jpg",
        icon: Truck,
        title: "Man and Van",
        description: "Our most popular service. Perfect for smaller moves and quick deliveries.",
        features: [
            "Studio/1-bed moves",
            "Single furniture items",
            "Student moves",
            "Small deliveries",
        ],
        meta: [
            { icon: Clock, label: "From 1 hour" },
            { icon: Users, label: "1-2 movers" },
            { icon: ShieldCheck, label: "Insured" },
        ],
    },
    {
        badge: "FULL SERVICE",
        badgeColor: "bg-slate-700",
        image: "/houserremoval.jpg",
        icon: Home,
        title: "House Removals",
        description: "Our most popular service. Perfect for smaller moves and quick deliveries.",
        features: [
            "2-bed flats & houses",
            "3-bed family homes",
            "4+ bed properties",
            "Long-distance moves",
        ],
        meta: [
            { icon: Clock, label: "Full day" },
            { icon: Users, label: "2-4 movers" },
            { icon: ShieldCheck, label: "Insured" },
        ],
    },
];

export default function Services() {
    return (
        <section className=" py-20 px-6">
            <div className="mx-auto max-w-5xl">
                {/* Heading */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        Choose Your{" "}
                        <span className="text-emerald-500">Perfect Service</span>
                    </h2>
                    <p className="text-gray-500 text-base">
                        From single items to full house moves, we&apos;ve got the right solution for you
                    </p>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {services.map((svc) => {
                        const Icon = svc.icon;
                        return (
                            <Card
                                key={svc.title}
                                className="overflow-hidden border-gray-100 shadow-sm hover:shadow-md transition-shadow py-0 gap-0"
                            >
                                {/* Image */}
                                <div className="relative h-56 w-full overflow-hidden">
                                    <img
                                        src={svc.image}
                                        alt={svc.title}
                                        className="h-full w-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
                                    <span
                                        className={`absolute top-4 left-4 ${svc.badgeColor} text-white text-xs font-bold px-3 py-1.5 rounded-full tracking-wide`}
                                    >
                                        {svc.badge}
                                    </span>
                                </div>

                                <CardContent className="p-6">
                                    {/* Title */}
                                    <div className="flex items-center gap-2 mb-3">
                                        <Icon className="h-5 w-5 text-gray-700" strokeWidth={1.5} />
                                        <h3 className="text-xl font-bold text-gray-900">{svc.title}</h3>
                                    </div>

                                    {/* Description */}
                                    <p className="text-gray-500 text-sm mb-5 leading-relaxed">
                                        {svc.description}
                                    </p>

                                    {/* Perfect for */}
                                    <p className="text-sm font-bold text-gray-800 mb-3">✨ Perfect for:</p>
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-6">
                                        {svc.features.map((f) => (
                                            <div key={f} className="flex items-center gap-2 text-sm text-gray-600">
                                                <Check className="h-4 w-4 text-emerald-500 shrink-0" strokeWidth={2.5} />
                                                {f}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Meta */}
                                    <div className="flex items-center gap-5 mb-6 text-xs text-gray-500">
                                        {svc.meta.map((m) => {
                                            const MIcon = m.icon;
                                            return (
                                                <div key={m.label} className="flex items-center gap-1.5">
                                                    <MIcon className="h-3.5 w-3.5 text-gray-400" strokeWidth={1.5} />
                                                    {m.label}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex gap-3">
                                        <button className="flex-1 rounded-full bg-emerald-500 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600 transition">
                                            Get Quote
                                        </button>
                                        <button className="flex-1 rounded-full border-2 border-emerald-500 py-2.5 text-sm font-semibold text-emerald-600 hover:bg-emerald-50 transition">
                                            Learn more
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
