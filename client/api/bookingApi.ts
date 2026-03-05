import { api } from ".";

// ─── Enums ────────────────────────────────────────────────────────────────────

export type HouseSize = "ONE_BHK" | "TWO_BHK" | "THREE_BHK" | "OFFICE";

export type BookingStatus =
    | "REQUESTED"
    | "CONFIRMED"
    | "ASSIGNED"
    | "IN_TRANSIT"
    | "COMPLETED"
    | "CANCELLED";

// ─── Models 

export interface BookingUser {
    id: number;
    name: string;
    email: string;
    phone: string | null;
}

export interface BookingDriver {
    id: string;
    vehicleType: string;
    user: { name: string; phone: string | null };
}

export interface Booking {
    id: string;
    userId: number | null;
    driverId: string | null;
    fromAddress: string;
    toAddress: string;
    distanceKm: number;
    moveDate: string;
    houseSize: HouseSize;
    phone: string;
    status: BookingStatus;
    price: number;
    createdAt: string;
    updatedAt: string;
    user?: BookingUser | null;
    driver?: BookingDriver | null;
}

// ─── Payloads

export interface CreateBookingPayload {
    fromAddress: string;
    toAddress: string;
    distanceKm: number;
    moveDate: string; // ISO string
    houseSize: HouseSize;
    phone: string;
    price: number;
}

export interface GetAllBookingsParams {
    status?: BookingStatus;
    houseSize?: HouseSize;
    page?: number;
    limit?: number;
}

// ─── Responses ────────────────────────────────────────────────────────────────

export interface BookingResponse {
    success: boolean;
    message: string;
    data: Booking;
}

export interface PaginatedBookingsResponse {
    success: boolean;
    message: string;
    data: {
        bookings: Booking[];
        total: number;
        page: number;
        limit: number;
    };
}

export interface PaginatedQuotesResponse {
    success: boolean;
    message: string;
    data: {
        quotes: Booking[];
        total: number;
        page: number;
        limit: number;
    };
}

// ─── Customer API ─────────────────────────────────────────────────────────────

/** POST /bookings — public (guest or logged-in) */
export const createBooking = async (
    payload: CreateBookingPayload
): Promise<BookingResponse> => {
    const { data } = await api.post<BookingResponse>("/bookings", payload);
    return data;
};

/** GET /bookings/my — authenticated customer's own bookings */
export const getMyBookings = async (): Promise<Booking[]> => {
    const { data } = await api.get("/bookings/my");
    return data.data ?? [];
};

/** GET /bookings/:id — single booking (customers see only their own) */
export const getBookingById = async (id: string): Promise<Booking> => {
    const { data } = await api.get(`/bookings/${id}`);
    return data.data;
};

/** PATCH /bookings/:id/cancel — cancel own booking */
export const cancelBooking = async (id: string): Promise<BookingResponse> => {
    const { data } = await api.patch<BookingResponse>(`/bookings/${id}/cancel`);
    return data;
};

// ─── Admin API ────────────────────────────────────────────────────────────────

/** GET /bookings — all bookings with optional filters + pagination */
export const getAllBookings = async (
    params: GetAllBookingsParams = {}
): Promise<PaginatedBookingsResponse["data"]> => {
    const { data } = await api.get<PaginatedBookingsResponse>("/bookings", { params });
    return data.data;
};

/** GET /bookings/quotes — all REQUESTED quote submissions */
export const getAllQuotes = async (
    page = 1,
    limit = 20
): Promise<PaginatedQuotesResponse["data"]> => {
    const { data } = await api.get<PaginatedQuotesResponse>("/bookings/quotes", {
        params: { page, limit },
    });
    return data.data;
};

/** PATCH /bookings/:id/status — update booking status */
export const updateBookingStatus = async (
    id: string,
    status: BookingStatus
): Promise<BookingResponse> => {
    const { data } = await api.patch<BookingResponse>(`/bookings/${id}/status`, { status });
    return data;
};

/** PATCH /bookings/:id/assign-driver — assign driver to booking */
export const assignDriver = async (
    id: string,
    driverId: string
): Promise<BookingResponse> => {
    const { data } = await api.patch<BookingResponse>(`/bookings/${id}/assign-driver`, { driverId });
    return data;
};
