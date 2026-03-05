import { Role } from "../generated/prisma"

export type IPayload = {
    id: number
    email: string
    name: string
    role: Role
}
