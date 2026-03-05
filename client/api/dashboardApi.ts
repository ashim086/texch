import { api } from ".";
import { Booking } from "./bookingApi";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UserDashboardStats {
    totalBookings: number;
    completedBookings: number;
    upcomingBookings: number;
    cancelledBookings: number;
    totalSpent: number;
    recentActivity: number;
}

export interface AdminDashboardStats {
    totalBookings: number;
    pendingQuotes: number;
    confirmedBookings: number;
    inProgressBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    totalRevenue: number;
    monthlyRevenue: number;
    totalCustomers: number;
    totalDrivers: number;
    activeDrivers: number;
    averageBookingValue: number;
}

// ─── API Responses ────────────────────────────────────────────────────────────

interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

// ─── User Dashboard API ───────────────────────────────────────────────────────

export async function getUserStats(): Promise<UserDashboardStats> {
    const response = await api.get<ApiResponse<UserDashboardStats>>("/dashboard/stats");
    return response.data.data;
}

export async function getRecentBookings(): Promise<Booking[]> {
    const response = await api.get<ApiResponse<Booking[]>>("/dashboard/recent-bookings");
    return response.data.data;
}

export async function getUpcomingMoves(): Promise<Booking[]> {
    const response = await api.get<ApiResponse<Booking[]>>("/dashboard/upcoming-moves");
    return response.data.data;
}

// ─── Admin Dashboard API ──────────────────────────────────────────────────────

export async function getAdminStats(): Promise<AdminDashboardStats> {
    const response = await api.get<ApiResponse<AdminDashboardStats>>("/dashboard/admin/stats");
    return response.data.data;
}

export async function getAdminRecentBookings(): Promise<Booking[]> {
    const response = await api.get<ApiResponse<Booking[]>>("/dashboard/admin/recent-bookings");
    return response.data.data;
}

export async function getAdminPendingQuotes(): Promise<Booking[]> {
    const response = await api.get<ApiResponse<Booking[]>>("/dashboard/admin/pending-quotes");
    return response.data.data;
}

export async function getAdminAllBookings(): Promise<Booking[]> {
    const response = await api.get<ApiResponse<Booking[]>>("/dashboard/admin/bookings");
    return response.data.data;
}
