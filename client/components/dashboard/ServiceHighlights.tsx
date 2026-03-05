"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
    Home,
    Building2,
    GraduationCap,
    Sofa,
    Warehouse,
    Globe,
    ArrowRight,
    Package,
    Truck,
    Box
} from "lucide-react";
import { Service, getAllServices } from "@/api/serviceApi";
import { ServiceHighlightsSkeleton } from "@/components/ui/skeleton";

const iconMap: Record<string, React.ElementType> = {
    Home,
    Building: Building2,
    GraduationCap,
    Armchair: Sofa,
    Warehouse,
    Globe,
    Package,
    Truck,
    Box,
};

function formatPrice(amount: number): string {
    return new Intl.NumberFormat("en-AU", {
        style: "currency",
        currency: "AUD",
        minimumFractionDigits: 0,
    }).format(amount);
}

export function ServiceHighlights() {
    const { data: services, isLoading, error } = useQuery({
        queryKey: ["services"],
        queryFn: getAllServices,
        staleTime: 5 * 60 * 1000, // 5 minutes - services don't change often
        retry: 1,
    });

    if (isLoading) {
        return <ServiceHighlightsSkeleton />;
    }

    const highlightedServices = (services || []).slice(0, 4);

    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div>
                    <h3 className="font-semibold text-gray-900">Our Services</h3>
                    <p className="text-sm text-gray-500">Professional moving solutions</p>
                </div>
                <Link
                    href="/dashboard/services"
                    className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                >
                    View all
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            {highlightedServices.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
                    {highlightedServices.map((service) => (
                        <ServiceCard key={service.id} service={service} />
                    ))}
                </div>
            ) : (
                <div className="p-8 text-center text-gray-500">
                    <Package className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                    <p>No services available</p>
                </div>
            )}
        </div>
    );
}

function ServiceCard({ service }: { service: Service }) {
    const Icon = iconMap[service.icon] || Home;

    return (
        <Link
            href={`/dashboard/services?service=${service.id}`}
            className="flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors group"
        >
            <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                    {service.name}
                </h4>
                <p className="text-sm text-gray-500 line-clamp-1 mt-0.5">{service.description}</p>
                <p className="text-sm text-primary font-medium mt-1">
                    From {formatPrice(service.basePrice)}
                </p>
            </div>
        </Link>
    );
}
