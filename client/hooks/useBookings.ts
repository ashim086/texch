import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    createBooking,
    cancelBooking,
    getMyBookings,
    getBookingById,
    getAllBookings,
    getAllQuotes,
    updateBookingStatus,
    assignDriver,
    CreateBookingPayload,
    BookingStatus,
    GetAllBookingsParams,
} from "@/api/bookingApi";

// ─── Query keys ───────────────────────────────────────────────────────────────

export const bookingKeys = {
    all: ["bookings"] as const,
    myBookings: () => [...bookingKeys.all, "my"] as const,
    detail: (id: string) => [...bookingKeys.all, "detail", id] as const,
    admin: {
        all: (params?: GetAllBookingsParams) => [...bookingKeys.all, "admin", "all", params] as const,
        quotes: (page?: number, limit?: number) => [...bookingKeys.all, "admin", "quotes", page, limit] as const,
    },
};

// ─── Customer hooks ───────────────────────────────────────────────────────────

/** Submit a new booking / quote request */
export function useCreateBooking() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateBookingPayload) => createBooking(payload),
        onSuccess: () => {
            // User side: Refetch the user's own booking list and stats
            queryClient.invalidateQueries({ queryKey: bookingKeys.myBookings() });
            queryClient.invalidateQueries({ queryKey: ["userStats"] });
            queryClient.invalidateQueries({ queryKey: ["userDashboardStats"] });
            queryClient.invalidateQueries({ queryKey: ["recentBookings"] });
            queryClient.invalidateQueries({ queryKey: ["userBookings"] });
            // Admin side: Refresh admin dashboard data
            queryClient.invalidateQueries({ queryKey: ["adminAllBookings"] });
            queryClient.invalidateQueries({ queryKey: ["adminStats"] });
            queryClient.invalidateQueries({ queryKey: ["adminRecentBookings"] });
        },
    });
}

/** Fetch all bookings for the currently logged-in customer */
export function useMyBookings(enabled = true) {
    return useQuery({
        queryKey: bookingKeys.myBookings(),
        queryFn: getMyBookings,
        enabled,
    });
}

/** Fetch a single booking by UUID */
export function useBooking(id: string, enabled = true) {
    return useQuery({
        queryKey: bookingKeys.detail(id),
        queryFn: () => getBookingById(id),
        enabled: enabled && !!id,
    });
}

/** Cancel a booking — customers can cancel their own */
export function useCancelBooking() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => cancelBooking(id),
        onSuccess: (_data, id) => {
            // User side invalidations
            queryClient.invalidateQueries({ queryKey: bookingKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: bookingKeys.myBookings() });
            queryClient.invalidateQueries({ queryKey: ["userStats"] });
            queryClient.invalidateQueries({ queryKey: ["userDashboardStats"] });
            queryClient.invalidateQueries({ queryKey: ["recentBookings"] });
            queryClient.invalidateQueries({ queryKey: ["userBookings"] });
            // Admin side invalidations
            queryClient.invalidateQueries({ queryKey: ["adminAllBookings"] });
            queryClient.invalidateQueries({ queryKey: ["adminStats"] });
            queryClient.invalidateQueries({ queryKey: ["adminRecentBookings"] });
        },
    });
}

// ─── Admin hooks ──────────────────────────────────────────────────────────────

/** Fetch all bookings with optional status/houseSize/pagination filters */
export function useAllBookings(params: GetAllBookingsParams = {}) {
    return useQuery({
        queryKey: bookingKeys.admin.all(params),
        queryFn: () => getAllBookings(params),
    });
}

/** Fetch all REQUESTED quotes (admin dashboard) */
export function useAllQuotes(page = 1, limit = 20) {
    return useQuery({
        queryKey: bookingKeys.admin.quotes(page, limit),
        queryFn: () => getAllQuotes(page, limit),
    });
}

/** Update the status of a booking */
export function useUpdateBookingStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: BookingStatus }) =>
            updateBookingStatus(id, status),
        onSuccess: (_data, { id }) => {
            queryClient.invalidateQueries({ queryKey: bookingKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: bookingKeys.all });
            // User side invalidations
            queryClient.invalidateQueries({ queryKey: ["userStats"] });
            queryClient.invalidateQueries({ queryKey: ["userDashboardStats"] });
            queryClient.invalidateQueries({ queryKey: ["recentBookings"] });
            queryClient.invalidateQueries({ queryKey: ["userBookings"] });
            // Admin side invalidations
            queryClient.invalidateQueries({ queryKey: ["adminAllBookings"] });
            queryClient.invalidateQueries({ queryKey: ["adminStats"] });
            queryClient.invalidateQueries({ queryKey: ["adminRecentBookings"] });
        },
    });
}

/** Assign a driver to a booking */
export function useAssignDriver() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, driverId }: { id: string; driverId: string }) =>
            assignDriver(id, driverId),
        onSuccess: (_data, { id }) => {
            queryClient.invalidateQueries({ queryKey: bookingKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: bookingKeys.all });
            // User side invalidations
            queryClient.invalidateQueries({ queryKey: ["userStats"] });
            queryClient.invalidateQueries({ queryKey: ["userDashboardStats"] });
            queryClient.invalidateQueries({ queryKey: ["recentBookings"] });
            queryClient.invalidateQueries({ queryKey: ["userBookings"] });
            // Admin side invalidations
            queryClient.invalidateQueries({ queryKey: ["adminAllBookings"] });
            queryClient.invalidateQueries({ queryKey: ["adminStats"] });
            queryClient.invalidateQueries({ queryKey: ["adminRecentBookings"] });
        },
    });
}
