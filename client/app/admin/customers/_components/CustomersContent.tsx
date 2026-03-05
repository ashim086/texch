"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllCustomers, Customer } from "@/api/customerApi";
import {
    Search,
    Users,
    Mail,
    Phone,
    Calendar,
    Package,
    ChevronRight,
    UserCircle,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-AU", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

// ─── Skeleton Loader ──────────────────────────────────────────────────────────

function CustomerCardSkeleton() {
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-start gap-4">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="w-16 h-6 rounded-full" />
            </div>
            <div className="mt-4 pt-4 border-t border-gray-50 flex gap-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
            </div>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function CustomersContent() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

    // Fetch customers
    const { data: customers, isLoading, error } = useQuery({
        queryKey: ["customers"],
        queryFn: getAllCustomers,
    });

    // Filter customers based on search
    const filteredCustomers = customers?.filter(
        (customer) =>
            customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    // Filter only customers (not admins/drivers)
    const customersList = filteredCustomers.filter(c => c.role === "CUSTOMER");

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <p className="text-red-600 font-medium">Failed to load customers</p>
                    <p className="text-gray-500 text-sm mt-1">Please try again later</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
                    <p className="text-gray-500 mt-1">
                        {customersList.length} registered customer{customersList.length !== 1 ? "s" : ""}
                    </p>
                </div>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search customers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
            </div>

            {/* Loading State */}
            {isLoading ? (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <CustomerCardSkeleton key={i} />
                    ))}
                </div>
            ) : customersList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-gray-100">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                        <Users className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600 font-medium">No customers found</p>
                    <p className="text-gray-400 text-sm mt-1">
                        {searchQuery ? "Try a different search term" : "Customers will appear here when they sign up"}
                    </p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {customersList.map((customer) => (
                        <CustomerCard
                            key={customer.id}
                            customer={customer}
                            isSelected={selectedCustomer?.id === customer.id}
                            onClick={() => setSelectedCustomer(
                                selectedCustomer?.id === customer.id ? null : customer
                            )}
                        />
                    ))}
                </div>
            )}

            {/* Customer Details Panel */}
            {selectedCustomer && (
                <CustomerDetailsPanel
                    customer={selectedCustomer}
                    onClose={() => setSelectedCustomer(null)}
                />
            )}
        </div>
    );
}

// ─── Customer Card ────────────────────────────────────────────────────────────

interface CustomerCardProps {
    customer: Customer;
    isSelected: boolean;
    onClick: () => void;
}

function CustomerCard({ customer, isSelected, onClick }: CustomerCardProps) {
    return (
        <div
            onClick={onClick}
            className={`bg-white rounded-xl border p-5 cursor-pointer transition-all duration-200 hover:shadow-md ${isSelected ? "border-primary ring-2 ring-primary/20" : "border-gray-100"
                }`}
        >
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <UserCircle className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{customer.name}</h3>
                    <p className="text-sm text-gray-500 truncate">{customer.email}</p>
                </div>
                <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${isSelected ? "rotate-90" : ""}`} />
            </div>

            <div className="mt-4 pt-4 border-t border-gray-50 flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1.5 text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {formatDate(customer.createdAt)}</span>
                </div>
                {customer._count && (
                    <div className="flex items-center gap-1.5 text-gray-500">
                        <Package className="w-4 h-4" />
                        <span>{customer._count.bookings} booking{customer._count.bookings !== 1 ? "s" : ""}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Customer Details Panel ───────────────────────────────────────────────────

interface CustomerDetailsPanelProps {
    customer: Customer;
    onClose: () => void;
}

function CustomerDetailsPanel({ customer, onClose }: CustomerDetailsPanelProps) {
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div
                className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <UserCircle className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{customer.name}</h2>
                        <p className="text-gray-500">Customer</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <div>
                            <p className="text-xs text-gray-400">Email</p>
                            <p className="text-gray-900">{customer.email}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <div>
                            <p className="text-xs text-gray-400">Phone</p>
                            <p className="text-gray-900">{customer.phone || "Not provided"}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <div>
                            <p className="text-xs text-gray-400">Member Since</p>
                            <p className="text-gray-900">{formatDate(customer.createdAt)}</p>
                        </div>
                    </div>

                    {customer._count && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                            <Package className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-400">Total Bookings</p>
                                <p className="text-gray-900">{customer._count.bookings}</p>
                            </div>
                        </div>
                    )}
                </div>

                <button
                    onClick={onClose}
                    className="mt-6 w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                    Close
                </button>
            </div>
        </div>
    );
}
