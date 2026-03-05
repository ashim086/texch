import { api } from ".";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Service {
    id: string;
    name: string;
    description: string;
    icon: string;
    basePrice: number;
    pricePerKm: number;
    features: string[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateServicePayload {
    name: string;
    description: string;
    icon: string;
    basePrice: number;
    pricePerKm: number;
    features?: string[];
}

export interface UpdateServicePayload {
    name?: string;
    description?: string;
    icon?: string;
    basePrice?: number;
    pricePerKm?: number;
    features?: string[];
    isActive?: boolean;
}

// ─── API Responses ────────────────────────────────────────────────────────────

interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function getAllServices(): Promise<Service[]> {
    const response = await api.get<ApiResponse<Service[]>>("/services");
    return response.data.data;
}

export async function getServiceById(id: string): Promise<Service> {
    const response = await api.get<ApiResponse<Service>>(`/services/${id}`);
    return response.data.data;
}

// ─── Admin API ────────────────────────────────────────────────────────────────

export async function getAllServicesAdmin(): Promise<Service[]> {
    const response = await api.get<ApiResponse<Service[]>>("/services/admin/all");
    return response.data.data;
}

export async function createService(data: CreateServicePayload): Promise<Service> {
    const response = await api.post<ApiResponse<Service>>("/services", data);
    return response.data.data;
}

export async function updateService(id: string, data: UpdateServicePayload): Promise<Service> {
    const response = await api.put<ApiResponse<Service>>(`/services/${id}`, data);
    return response.data.data;
}

export async function deleteService(id: string): Promise<void> {
    await api.delete(`/services/${id}`);
}
