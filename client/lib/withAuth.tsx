"use client";

import { useEffect, ComponentType } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Role } from "@/api/authApi";
import { Loader2, Truck } from "lucide-react";

interface WithAuthOptions {
    allowedRoles?: Role[];
    redirectTo?: string;
    loadingComponent?: ComponentType;
}

// Default loading component
function DefaultLoadingComponent() {
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

/**
 * Higher-Order Component for role-based route protection.
 * 
 * @example
 * // Protect a page for authenticated users only
 * export default withAuth(DashboardPage);
 * 
 * @example
 * // Protect a page for specific roles
 * export default withAuth(AdminPage, { allowedRoles: ["ADMIN"] });
 * 
 * @example
 * // Custom redirect path
 * export default withAuth(CustomerPage, { 
 *   allowedRoles: ["CUSTOMER"], 
 *   redirectTo: "/login" 
 * });
 */
export function withAuth<P extends object>(
    WrappedComponent: ComponentType<P>,
    options: WithAuthOptions = {}
) {
    const {
        allowedRoles,
        redirectTo = "/",
        loadingComponent: LoadingComponent = DefaultLoadingComponent,
    } = options;

    function WithAuthComponent(props: P) {
        const { user, isLoading, isAuthenticated } = useAuth();
        const router = useRouter();

        useEffect(() => {
            // Wait until loading is complete before redirecting
            if (isLoading) return;

            // Not authenticated - redirect to login/home
            if (!isAuthenticated) {
                router.replace(redirectTo);
                return;
            }

            // Check role-based access if allowedRoles is specified
            if (allowedRoles && allowedRoles.length > 0 && user) {
                const userRole = user.role as Role;
                if (!allowedRoles.includes(userRole)) {
                    // User doesn't have required role - redirect based on their role
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
        }, [isLoading, isAuthenticated, user, router]);

        // Show loading while checking auth
        if (isLoading) {
            return <LoadingComponent />;
        }

        // Not authenticated
        if (!isAuthenticated) {
            return <LoadingComponent />;
        }

        // Check role access
        if (allowedRoles && allowedRoles.length > 0 && user) {
            const userRole = user.role as Role;
            if (!allowedRoles.includes(userRole)) {
                return <LoadingComponent />;
            }
        }

        // Authorized - render the component
        return <WrappedComponent {...props} />;
    }

    // Set display name for debugging
    WithAuthComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

    return WithAuthComponent;
}

/**
 * Pre-configured HOC for customer-only routes
 */
export function withCustomerAuth<P extends object>(WrappedComponent: ComponentType<P>) {
    return withAuth(WrappedComponent, {
        allowedRoles: ["CUSTOMER"],
        redirectTo: "/",
    });
}

/**
 * Pre-configured HOC for admin-only routes
 */
export function withAdminAuth<P extends object>(WrappedComponent: ComponentType<P>) {
    return withAuth(WrappedComponent, {
        allowedRoles: ["ADMIN"],
        redirectTo: "/",
    });
}

/**
 * Pre-configured HOC for driver-only routes
 */
export function withDriverAuth<P extends object>(WrappedComponent: ComponentType<P>) {
    return withAuth(WrappedComponent, {
        allowedRoles: ["DRIVER"],
        redirectTo: "/",
    });
}

export default withAuth;
