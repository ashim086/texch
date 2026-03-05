"use client";

import Link from "next/link";
import {
    Plus,
    MessageCircle,
    FileText,
    MapPin,
    ArrowRight,
    Sparkles
} from "lucide-react";

const quickActions = [
    {
        label: "New Booking",
        description: "Schedule a new move",
        icon: Plus,
        href: "/dashboard/services",
        color: "bg-primary hover:bg-primary/90",
        textColor: "text-white",
        primary: true,
    },
    {
        label: "Chat Support",
        description: "Talk to our team",
        icon: MessageCircle,
        href: "/dashboard/chat",
        color: "bg-blue-50 hover:bg-blue-100",
        textColor: "text-blue-600",
    },
    {
        label: "Get Quote",
        description: "Instant price estimate",
        icon: FileText,
        href: "/?quote=true",
        color: "bg-purple-50 hover:bg-purple-100",
        textColor: "text-purple-600",
    },
    {
        label: "Track Move",
        description: "Live location updates",
        icon: MapPin,
        href: "/dashboard/bookings",
        color: "bg-orange-50 hover:bg-orange-100",
        textColor: "text-orange-600",
    },
];

export function QuickActions() {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                <h3 className="font-semibold text-gray-900">Quick Actions</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action) => (
                    <Link
                        key={action.label}
                        href={action.href}
                        className={`group flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-200 ${action.color}`}
                    >
                        <div className={`p-2 rounded-lg ${action.primary ? 'bg-white/20' : 'bg-white'}`}>
                            <action.icon className={`w-5 h-5 ${action.primary ? 'text-white' : action.textColor}`} />
                        </div>
                        <div className="text-center">
                            <p className={`text-sm font-medium ${action.primary ? 'text-white' : 'text-gray-900'}`}>
                                {action.label}
                            </p>
                            <p className={`text-xs ${action.primary ? 'text-white/70' : 'text-gray-500'}`}>
                                {action.description}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
