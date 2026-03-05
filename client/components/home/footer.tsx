"use client";

import {
    Zap,
    Clock,
    ShieldCheck,
    Star,
    CheckCircle,
    Download,
    Phone,
    ArrowRight,
    Landmark,
} from "lucide-react";

const features = [
    { icon: Zap, label: "Instant quotes online" },
    { icon: Clock, label: "Live driver tracking" },
    { icon: ShieldCheck, label: "Fully insured" },
    { icon: Star, label: "AFRA registered" },
    { icon: CheckCircle, label: "Australia-wide" },
    { icon: Download, label: "$20 off app" },
];

const footerLinks = [
    {
        heading: "Services",
        links: ["Man and Van", "House Removals", "Flat Removals", "Long-Distance", "Office Moves", "Storage"],
    },
    {
        heading: "Company",
        links: ["About Us", "How It Works", "Careers", "Press", "Blog", "Contact"],
    },
    {
        heading: "Legal",
        links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Insurance Info"],
    },
];

export default function Footer() {
    return (
        <footer
            className="relative overflow-hidden"
            style={{
                backgroundImage: "url('/bg.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <div className="absolute inset-0 bg-[#0d1b2e]/92" />

            <div className="relative z-10">
                {/* ── CTA Block ── */}
                <div className="mx-auto max-w-4xl px-6 py-6 flex flex-col items-center text-center">
                    {/* Badge */}
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white/70 tracking-widest uppercase mb-8">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        Ready to move?
                    </span>

                    <h2 className="text-4xl sm:text-5xl font-bold text-white mb-5 leading-tight">
                        Book Your Move Today
                    </h2>

                    <p className="text-slate-400 text-base mb-12 max-w-lg leading-relaxed">
                        Join thousands of satisfied customers. Get your instant quote in 60 seconds.
                    </p>

                    {/* Feature badges grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-2xl mb-12">
                        {features.map((f) => {
                            const Icon = f.icon;
                            return (
                                <div
                                    key={f.label}
                                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80"
                                >
                                    <Icon className="h-4 w-4 text-emerald-400 shrink-0" strokeWidth={1.5} />
                                    {f.label}
                                </div>
                            );
                        })}
                    </div>

                    {/* CTA buttons */}
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <button className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-7 py-3.5 text-sm font-semibold text-white hover:bg-emerald-600 transition shadow-lg">
                            <Zap className="h-4 w-4" />
                            Get Your Instant Quote
                            <ArrowRight className="h-4 w-4" />
                        </button>
                        <button className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition">
                            <Download className="h-4 w-4" />
                            Download App
                        </button>
                        <button className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition">
                            <Phone className="h-4 w-4" />
                            Call 1300 627 627
                        </button>
                    </div>
                </div>

                {/* ── Divider ── */}
                <div className="border-t border-white/10 mx-6" />

                {/* ── Footer links ── */}
                <div className="mx-auto max-w-5xl px-6 py-12 grid grid-cols-2 sm:grid-cols-4 gap-10">
                    {/* Brand column */}
                    <div className="col-span-2 sm:col-span-1 flex flex-col gap-4">
                        <span className="text-2xl font-bold text-white tracking-tight">
                            <span className="text-emerald-400">N</span>N<span className="text-emerald-400">R</span>
                        </span>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Australia&apos;s fastest removal booking platform. Instant quotes, trusted movers.
                        </p>
                        <div className="flex flex-col gap-1.5 text-xs text-slate-500 mt-1">
                            <span className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> Trustpilot 4.9/5</span>
                            <span className="flex items-center gap-1.5"><CheckCircle className="h-3.5 w-3.5 text-emerald-400" /> 3,000+ Reviews</span>
                            <span className="flex items-center gap-1.5"><Landmark className="h-3.5 w-3.5 text-emerald-400" /> AFRA Member</span>
                            <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Fully Insured</span>
                        </div>
                    </div>

                    {/* Link columns */}
                    {footerLinks.map((col) => (
                        <div key={col.heading} className="flex flex-col gap-3">
                            <p className="text-xs font-bold text-white/50 uppercase tracking-widest">{col.heading}</p>
                            {col.links.map((link) => (
                                <a
                                    key={link}
                                    href="#"
                                    className="text-sm text-slate-400 hover:text-white transition"
                                >
                                    {link}
                                </a>
                            ))}
                        </div>
                    ))}
                </div>

                {/* ── Bottom bar ── */}
                <div className="border-t border-white/10 mx-6" />
                <div className="mx-auto max-w-5xl px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
                    <p>NNR – Namaste Nepal Removals. Making moving easier for thousands of customers across Australia.</p>
                    <p>© {new Date().getFullYear()} NNR. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
