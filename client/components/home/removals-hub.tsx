"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
    Truck,
    PackageOpen,
    Briefcase,
    Wrench,
    Home,
    Building2,
    MapPin,
    ArrowLeftRight,
    Package,
    Sofa,
    Piano,
    Archive,
    ShoppingCart,
    Boxes,
    BookOpen,
    Monitor,
} from "lucide-react";

const tabs = [
    {
        value: "moving-home",
        label: "MOVING HOME",
        items: [
            { icon: Truck, label: "Man and Van" },
            { icon: Home, label: "House Removals" },
            { icon: Building2, label: "Flat Removals" },
            { icon: MapPin, label: "Long-Distance" },
            { icon: ArrowLeftRight, label: "Same Day Move" },
            { icon: Archive, label: "Storage & Move" },
            { icon: Boxes, label: "Packing Service" },
            { icon: PackageOpen, label: "Student Moves" },
        ],
    },
    {
        value: "moving-items",
        label: "MOVING ITEMS",
        items: [
            { icon: Sofa, label: "Furniture Delivery" },
            { icon: Piano, label: "Piano Moving" },
            { icon: Monitor, label: "Appliance Move" },
            { icon: ShoppingCart, label: "Single Items" },
            { icon: Package, label: "Parcel Delivery" },
            { icon: Boxes, label: "Bulk Items" },
            { icon: Archive, label: "Antiques" },
            { icon: BookOpen, label: "Art & Fragile" },
        ],
    },
    {
        value: "business",
        label: "BUSINESS",
        items: [
            { icon: Briefcase, label: "Office Moves" },
            { icon: Building2, label: "Commercial Move" },
            { icon: Archive, label: "Document Storage" },
            { icon: Boxes, label: "Warehouse Move" },
            { icon: Monitor, label: "IT Relocation" },
            { icon: Package, label: "Retail Moves" },
            { icon: Truck, label: "Fleet Delivery" },
            { icon: MapPin, label: "Interstate B2B" },
        ],
    },
    {
        value: "additional",
        label: "ADDITIONAL",
        items: [
            { icon: Wrench, label: "Assembly Service" },
            { icon: PackageOpen, label: "Packing Supplies" },
            { icon: Archive, label: "Self Storage" },
            { icon: Boxes, label: "Junk Removal" },
            { icon: Home, label: "End of Tenancy" },
            { icon: Sofa, label: "Furniture Disposal" },
            { icon: ShoppingCart, label: "Charity Donation" },
            { icon: Truck, label: "Van Hire" },
        ],
    },
];

export default function RemovalsHub() {
    return (
        <section
            className="relative py-9 px-6 overflow-hidden"
            style={{
                backgroundImage: "url('/bg.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <div className="absolute inset-0 bg-[#0d1b2e]/90" />

            <div className="relative z-10 mx-auto max-w-5xl">
                {/* Heading */}
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white text-center mb-10">
                    Removals Hub –{" "}
                    <span className="text-emerald-400">All Services</span>
                </h2>

                <Tabs defaultValue="moving-home">
                    {/* Tab triggers */}
                    <TabsList className="grid grid-cols-4 w-full rounded-none bg-transparent border-b border-white/15 mb-8 h-auto p-0 gap-0">
                        {tabs.map((tab) => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className="w-full flex justify-center items-center text-center border-b-2 border-transparent data-[state=active]:border-emerald-400 data-[state=active]:text-white text-white/50 bg-transparent px-2 pb-3 pt-0 text-xs font-bold tracking-widest uppercase transition-colors hover:text-white/80 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                            >
                                {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {/* Tab content */}
                    {tabs.map((tab) => (
                        <TabsContent key={tab.value} value={tab.value}>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {tab.items.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <button
                                            key={item.label}
                                            className="flex flex-col items-center justify-center gap-4 rounded-xl border border-white/10 bg-white/5 px-4 py-8 text-white/80 hover:bg-white/10 hover:border-emerald-400/40 hover:text-white transition-all group"
                                        >
                                            <Icon
                                                className="h-10 w-10 text-emerald-400/70 group-hover:text-emerald-400 transition-colors"
                                                strokeWidth={1.2}
                                            />
                                            <span className="text-sm font-medium text-center leading-snug">
                                                {item.label}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </section>
    );
}
