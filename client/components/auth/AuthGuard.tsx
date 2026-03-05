"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Role } from "@/api/authApi";
import { Loader2, Truck } from "lucide-react";

interface AuthGuardProps {
    children: React.ReactNode;
    allowedRoles?: Role[];
    redirectTo?: string;
}

export function AuthGuard({
    children,
    allowedRoles,
    redirectTo = "/"
}: AuthGuardProps) {
    const { user, isLoading, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;

        if (!isAuthenticated) {
            router.replace(redirectTo);
            return;
        }

        if (allowedRoles && allowedRoles.length > 0 && user) {
            const userRole = user.role;
            if (!allowedRoles.includes(userRole)) {
                // Redirect based on role
                if (userRole === "ADMIN") {
                    router.replace("/admin");
                } else if (userRole === "CUSTOMER") {
                    router.replace("/dashboard");
                } else if (userRole === "DRIVER") {
                    router.replace("/driver");
                } else {
                    router.replace(redirectTo);
                }
            }
        }
    }, [isLoading, isAuthenticated, user, router, allowedRoles, redirectTo]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-primary to-emerald-600 flex items-center justify-center mx-auto mb-4">
                        <Truck className="w-10 h-10 text-white" />
                    </div>
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    if (allowedRoles && allowedRoles.length > 0 && user) {
        if (!allowedRoles.includes(user.role)) {
            return null;
        }
    }

    return <>{children}</>;
}
