import { PrismaClient } from "../generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("🌱 Seeding database...");

    // Seed Users
    await prisma.user.createMany({
        data: [
            {
                name: "Alice",
                email: "alice@example.com",
                password: "hey",
                role: "CUSTOMER",
                phone: "9800000001",
                avatar: null,
                provider: "local",
            },
            {
                name: "Bob",
                email: "bob@example.com",
                password: "hey",
                role: "ADMIN",
                phone: "9800000002",
                avatar: null,
                provider: "local",
            },
            {
                name: "Charlie",
                email: "charlie@example.com",
                password: "hey",
                role: "DRIVER",
                phone: "9800000003",
                avatar: null,
                provider: "local",
            },
            {
                name: "Diana",
                email: "diana@example.com",
                password: "hey",
                role: "CUSTOMER",
                provider: "local",
            },
            {
                name: "Eve",
                email: "eve@example.com",
                password: "hey",
                role: "CUSTOMER",
                provider: "local",
            },
        ],
        skipDuplicates: true,
    });

    // Seed Services
    await prisma.service.createMany({
        data: [
            {
                name: "Home Removals",
                description: "Full house moving service with professional packers and movers. We handle everything from start to finish.",
                icon: "Home",
                basePrice: 150,
                pricePerKm: 1.5,
                features: [
                    "Professional packing",
                    "Furniture disassembly",
                    "Loading & unloading",
                    "Furniture reassembly",
                    "Insurance included",
                ],
            },
            {
                name: "Office Relocations",
                description: "Specialized office moving service with minimal downtime. Weekend and after-hours moving available.",
                icon: "Building",
                basePrice: 300,
                pricePerKm: 2.0,
                features: [
                    "IT equipment handling",
                    "Minimal business disruption",
                    "Weekend availability",
                    "Workstation setup",
                    "Document security",
                ],
            },
            {
                name: "Student Moves",
                description: "Affordable moving solution for students. Perfect for university accommodation and flat shares.",
                icon: "GraduationCap",
                basePrice: 75,
                pricePerKm: 1.0,
                features: [
                    "Budget-friendly",
                    "Flexible scheduling",
                    "Small van option",
                    "Quick turnaround",
                    "Student discount",
                ],
            },
            {
                name: "Single Item Delivery",
                description: "Need to move just one large item? We've got you covered with our single item delivery service.",
                icon: "Package",
                basePrice: 50,
                pricePerKm: 0.75,
                features: [
                    "Same-day delivery",
                    "Furniture items",
                    "Appliances",
                    "Real-time tracking",
                    "Careful handling",
                ],
            },
            {
                name: "Long Distance Moving",
                description: "Cross-country and international moving services with full logistics support.",
                icon: "Truck",
                basePrice: 500,
                pricePerKm: 1.25,
                features: [
                    "UK-wide coverage",
                    "International options",
                    "Storage solutions",
                    "Full insurance",
                    "Dedicated coordinator",
                ],
            },
            {
                name: "Packing Services",
                description: "Let our experts pack your belongings professionally. Materials included.",
                icon: "Box",
                basePrice: 100,
                pricePerKm: 0,
                features: [
                    "Quality materials",
                    "Fragile item handling",
                    "Labeling system",
                    "Unpacking option",
                    "Eco-friendly options",
                ],
            },
        ],
        skipDuplicates: true,
    });

    const userCount = await prisma.user.count();
    const serviceCount = await prisma.service.count();
    console.log(`✅ Seeding complete. Users: ${userCount}, Services: ${serviceCount}`);
}

main()
    .catch((e) => {
        console.error("❌ Seed failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
