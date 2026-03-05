"use client";

import { useState } from "react";
import { Phone, MessageCircle } from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const categories = [
    "Getting Started",
    "Services",
    "Booking",
    "Safety & Insurance",
    "Pricing",
    "Technology",
    "Coverage",
];

const faqs: Record<string, { q: string; a: string }[]> = {
    "Getting Started": [
        {
            q: "How do I find removal companies near me?",
            a: "NNR covers all of Australia. Enter your postcode in our quote form to see available services and instant pricing. We operate in all major cities and towns across NSW, VIC, QLD, WA, SA, and beyond.",
        },
        {
            q: "What's the difference between man and van and house removals?",
            a: "Man and van is best for smaller moves — single items, student moves, or studio/1-bed flats. House removals are full-service moves for larger homes with 2+ bedrooms, involving a bigger truck and more movers.",
        },
        {
            q: "Can I get a same-day removal?",
            a: "Yes! Subject to availability, we offer same-day bookings. Simply enter your details in the app or website and check for available slots in your area.",
        },
        {
            q: "What services does NNR offer?",
            a: "We offer man and van, house removals, flat removals, long-distance moves, office relocations, furniture delivery, packing services, storage solutions, and more.",
        },
        {
            q: "Are your services insured?",
            a: "Absolutely. All NNR moves are fully insured. We are AFRA registered and carry comprehensive goods-in-transit and public liability insurance on every job.",
        },
    ],
    Services: [
        {
            q: "Do you offer packing services?",
            a: "Yes, we offer full and partial packing services. Our team brings all the materials needed and ensures your belongings are packed safely.",
        },
        {
            q: "Can you move a piano or heavy items?",
            a: "Yes, we have specialist equipment and trained staff for pianos, safes, antiques, and other heavy or fragile items.",
        },
        {
            q: "Do you offer storage solutions?",
            a: "We partner with storage facilities Australia-wide. Ask us about short or long-term storage when booking your move.",
        },
    ],
    Booking: [
        {
            q: "How do I book a removal?",
            a: "You can book instantly through our website or app. Enter your postcodes, select the service, choose a date, and pay securely online — all in under 60 seconds.",
        },
        {
            q: "Can I change or cancel my booking?",
            a: "Yes. You can modify or cancel your booking up to 24 hours before the job with no fee through your account dashboard.",
        },
    ],
    "Safety & Insurance": [
        {
            q: "Are your movers background checked?",
            a: "All NNR movers go through a thorough background and identity verification process before joining our platform.",
        },
        {
            q: "What happens if something is damaged?",
            a: "All moves include goods-in-transit insurance. Simply report any damage within 48 hours through the app and our team will handle your claim promptly.",
        },
    ],
    Pricing: [
        {
            q: "How is the price calculated?",
            a: "Pricing is based on distance, volume of items, number of movers required, and any additional services like packing. You'll see an instant fixed price before you book.",
        },
        {
            q: "Are there any hidden fees?",
            a: "No. The price you see is the price you pay. Congestion charges, tolls, and stairs are factored in upfront where applicable.",
        },
    ],
    Technology: [
        {
            q: "Is there an app I can use?",
            a: "Yes! The NNR app is available on iOS and Android. You can book, track your mover in real-time, and manage your account all from the app.",
        },
        {
            q: "Can I track my mover in real-time?",
            a: "Yes. Once your mover is on their way, you'll receive live GPS tracking so you always know exactly where they are.",
        },
    ],
    Coverage: [
        {
            q: "Which cities do you cover?",
            a: "We cover Sydney, Melbourne, Brisbane, Perth, Adelaide, Canberra, Hobart, Darwin, and hundreds of regional towns across Australia.",
        },
        {
            q: "Do you offer interstate moves?",
            a: "Yes. We specialise in interstate removals across all Australian states and territories with fixed, upfront pricing.",
        },
    ],
};

export default function FAQ() {
    const [activeCategory, setActiveCategory] = useState("Getting Started");

    return (
        <section className="py-20 px-6 bg-white/45">
            <div className="mx-auto max-w-5xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left */}
                    <div className="flex flex-col gap-8">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 leading-tight mb-4">
                                Frequently Asked Questions
                            </h2>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Got questions? We&apos;ve got answers. Can&apos;t find what you&apos;re looking for?{" "}
                                <a href="#contact" className="underline text-gray-700 hover:text-emerald-600 transition">
                                    Contact us
                                </a>
                            </p>
                        </div>

                        {/* Contact card */}
                        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6 flex flex-col items-center text-center gap-3">
                            <MessageCircle className="h-8 w-8 text-emerald-500" />
                            <p className="font-semibold text-gray-900">Still have questions?</p>
                            <p className="text-sm text-gray-500">Our friendly team is here to help you 24/7</p>
                            <div className="flex flex-wrap gap-2 mt-1 justify-center">
                                <button className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600 transition">
                                    <Phone className="h-4 w-4" />
                                    Call 1300 627 627
                                </button>
                                <button className="inline-flex items-center gap-2 rounded-full border-2 border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:border-gray-300 transition">
                                    <MessageCircle className="h-4 w-4" />
                                    Live Chat
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right */}
                    <div className="lg:col-span-2 flex flex-col gap-4">
                        {/* Category pills */}
                        <div className="flex flex-wrap gap-2 mb-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${activeCategory === cat
                                            ? "bg-emerald-500 text-white"
                                            : "border border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-gray-900"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Accordion */}
                        <Accordion type="single" collapsible defaultValue="item-0">
                            {(faqs[activeCategory] ?? []).map((faq, i) => (
                                <AccordionItem
                                    key={i}
                                    value={`item-${i}`}
                                    className="border border-gray-200 rounded-xl mb-3 px-5 data-[state=open]:bg-emerald-50/60 data-[state=open]:border-emerald-200"
                                >
                                    <AccordionTrigger className="text-sm font-medium text-gray-900 hover:no-underline hover:text-emerald-600 py-4">
                                        {faq.q}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-sm text-gray-500 leading-relaxed pb-4">
                                        {faq.a}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </div>
        </section>
    );
}
