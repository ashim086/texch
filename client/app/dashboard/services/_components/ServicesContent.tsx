"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    Home,
    Building2,
    GraduationCap,
    Sofa,
    Warehouse,
    Globe,
    Check,
    ArrowRight,
    Sparkles,
    AlertCircle,
} from "lucide-react";
import { getAllServices, Service } from "@/api/serviceApi";
import { Skeleton } from "@/components/ui/skeleton";
import BookingModal from "@/components/booking/bookinModal";

// Helper function
function formatPrice(amount: number): string {
    return new Intl.NumberFormat("en-AU", {
        style: "currency",
        currency: "AUD",
        minimumFractionDigits: 0,
    }).format(amount);
}

const iconMap: Record<string, React.ElementType> = {
    Home,
    Building: Building2,
    GraduationCap,
    Armchair: Sofa,
    Warehouse,
    Globe,
};

function ServiceCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="p-6 pb-4">
                <Skeleton className="w-12 h-12 rounded-xl mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3 mt-1" />
            </div>
            <div className="p-6 pt-4 border-t border-gray-100 bg-gray-50">
                <div className="flex items-center justify-between">
                    <div>
                        <Skeleton className="h-3 w-16 mb-1" />
                        <Skeleton className="h-8 w-20" />
                    </div>
                    <Skeleton className="h-10 w-24 rounded-xl" />
                </div>
            </div>
        </div>
    );
}

export function ServicesContent() {
    const [selectedService, setSelectedService] = useState<string | null>(null);
    const [bookingModalOpen, setBookingModalOpen] = useState(false);
    const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<string | null>(null);

    const { data: services, isLoading, isError, error } = useQuery({
        queryKey: ["services"],
        queryFn: getAllServices,
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-linear-to-r from-primary/10 via-emerald-50 to-teal-50 rounded-2xl p-6 border border-primary/10">
                <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm font-medium text-gray-600">Professional Services</span>
                </div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                    Our Removal Services
                </h1>
                <p className="text-gray-600 max-w-2xl">
                    Choose from our range of professional moving services. Whether you&apos;re moving homes,
                    relocating your office, or need storage solutions, we&apos;ve got you covered.
                </p>
            </div>

            {/* Services Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <ServiceCardSkeleton key={i} />
                    ))}
                </div>
            ) : isError ? (
                <div className="bg-white rounded-2xl border border-red-100 p-12 text-center">
                    <AlertCircle className="w-16 h-16 text-red-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Failed to load services</h3>
                    <p className="text-gray-500 mb-4">
                        {error instanceof Error ? error.message : "Something went wrong"}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
                    >
                        Try again
                    </button>
                </div>
            ) : !services || services.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                    <Warehouse className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">No services available</h3>
                    <p className="text-gray-500">
                        Please check back later for our available services.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service) => (
                        <ServiceCard
                            key={service.id}
                            service={service}
                            isSelected={selectedService === service.id}
                            onSelect={() => setSelectedService(selectedService === service.id ? null : service.id)}
                            onBookNow={() => {
                                setSelectedServiceForBooking(service.id);
                                setBookingModalOpen(true);
                            }}
                        />
                    ))}
                </div>
            )}

            {/* CTA Section */}
            <div className="bg-gray-900 rounded-2xl p-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Need a Custom Quote?</h2>
                <p className="text-gray-400 mb-6 max-w-lg mx-auto">
                    Every move is unique. Get a personalized quote tailored to your specific needs.
                </p>
                <Link
                    href="/?quote=true"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                >
                    Get Free Quote
                    <ArrowRight className="w-5 h-5" />
                </Link>
            </div>

            {/* Booking Modal */}
            <BookingModal
                isOpen={bookingModalOpen}
                onClose={() => {
                    setBookingModalOpen(false);
                    setSelectedServiceForBooking(null);
                }}
            />
        </div>
    );
}

interface ServiceCardProps {
    service: Service;
    isSelected: boolean;
    onSelect: () => void;
    onBookNow: () => void;
}

function ServiceCard({ service, isSelected, onSelect, onBookNow }: ServiceCardProps) {
    const Icon = iconMap[service.icon] || Home;

    return (
        <div
            onClick={onSelect}
            className={`relative bg-white rounded-2xl border overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg group ${isSelected ? "border-primary ring-2 ring-primary/20" : "border-gray-100"
                }`}
        >
            {/* Header */}
            <div className="p-6 pb-4">
                <div className={`inline-flex p-3 rounded-xl mb-4 transition-colors ${isSelected ? "bg-primary text-white" : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white"
                    }`}>
                    <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
                <p className="text-gray-500 text-sm line-clamp-2">{service.description}</p>
            </div>

            {/* Features */}
            <div className={`px-6 overflow-hidden transition-all duration-300 ${isSelected ? "max-h-96 pb-4" : "max-h-0"}`}>
                <div className="space-y-2">
                    {service.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                <Check className="w-3 h-3 text-green-600" />
                            </div>
                            <span className="text-sm text-gray-600">{feature}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="p-6 pt-4 border-t border-gray-100 bg-gray-50">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-500">Starting from</p>
                        <p className="text-2xl font-bold text-gray-900">{formatPrice(service.basePrice)}</p>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onBookNow();
                        }}
                        className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                        Book Now
                    </button>
                </div>
                {service.pricePerKm > 0 && (
                    <p className="text-xs text-gray-400 mt-2">
                        + {formatPrice(service.pricePerKm)}/km
                    </p>
                )}
            </div>
        </div>
    );
}
