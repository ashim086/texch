"use client";

import { useState } from "react";
import { LogOut, Loader2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

interface LogoutConfirmDialogProps {
    collapsed?: boolean;
    variant?: "user" | "admin";
}

export function LogoutConfirmDialog({ collapsed = false, variant = "user" }: LogoutConfirmDialogProps) {
    const { logout, logoutMutation } = useAuth();
    const [open, setOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const isLoading = logoutMutation.isPending;

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <button
                    className={cn(
                        "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200",
                        variant === "admin"
                            ? "text-red-400 hover:bg-red-500/10"
                            : "text-red-600 hover:bg-red-50"
                    )}
                >
                    <LogOut className="w-5 h-5 shrink-0" />
                    {!collapsed && <span className="font-medium">Logout</span>}
                </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to logout? You will need to login again to access your account.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleLogout}
                        disabled={isLoading}
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Logging out...
                            </>
                        ) : (
                            <>
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </>
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
