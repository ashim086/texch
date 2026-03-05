import { api } from ".";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    createdAt: string;
    role: "CUSTOMER" | "ADMIN" | "DRIVER";
    _count?: {
        bookings: number;
    };
}

export interface CustomerWithBookings extends Customer {
    bookings: {
        id: string;
        status: string;
        price: number;
        moveDate: string;
    }[];
}

// ─── API Responses ────────────────────────────────────────────────────────────

interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

// ─── Admin Customer API ───────────────────────────────────────────────────────

/**
 * Get all customers (Admin only)
 */
export async function getAllCustomers(): Promise<Customer[]> {
    const response = await api.get<ApiResponse<Customer[]>>("/users");
    return response.data.data;
}

/**
 * Get customer by ID with booking details (Admin only)
 */
export async function getCustomerById(id: number): Promise<CustomerWithBookings> {
    const response = await api.get<ApiResponse<CustomerWithBookings>>(`/users/${id}`);
    return response.data.data;
}

/**
 * Delete customer (Admin only)
 */
export async function deleteCustomer(id: number): Promise<void> {
    await api.delete(`/users/${id}`);
}
