"use client";

import { useState } from "react";
import Hero from "@/components/home/hero";
import HowItWorks from "@/components/home/how-it-works";
import Services from "@/components/home/services";
import RemovalsHub from "@/components/home/removals-hub";
import Testimonials from "@/components/home/testimonials";
import FAQ from "@/components/home/faq";
import Footer from "@/components/home/footer";
import { LoginDialog } from "@/components/shared/LoginDialog";
import { SignupDialog } from "@/components/shared/SignupDialog";
import BookingModal from "@/components/booking/bookinModal";

const ROWS = 58;
const COLS = 58;
const TOTAL = ROWS * COLS;
const CELL_W = 1.6025 * 16;
const CELL_H = 1.5625 * 16;

function getNearbyRandom(idx: number): Set<number> {
    const nearby: number[] = [];
    const row = Math.floor(idx / COLS);
    const col = idx % COLS;
    const radius = 2;
    for (let r = Math.max(0, row - radius); r <= Math.min(ROWS - 1, row + radius); r++) {
        for (let c = Math.max(0, col - radius); c <= Math.min(COLS - 1, col + radius); c++) {
            nearby.push(r * COLS + c);
        }
    }
    for (let i = nearby.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [nearby[i], nearby[j]] = [nearby[j], nearby[i]];
    }
    return new Set(nearby.slice(0, 6));
}

const gridCells = Array.from({ length: TOTAL });

export default function DashboardHome() {
    const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
    const [isSignupDialogOpen, setIsSignupDialogOpen] = useState(false);
    const [highlighted, setHighlighted] = useState<Set<number>>(new Set());
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [bookingFrom, setBookingFrom] = useState("");
    const [bookingTo, setBookingTo] = useState("");

    const handleGetQuote = (from: string, to: string) => {
        setBookingFrom(from);
        setBookingTo(to);
        setIsBookingOpen(true);
    };

    const handleOpenLogin = () => {
        setIsSignupDialogOpen(false);
        setIsLoginDialogOpen(true);
    };

    const handleOpenSignup = () => {
        setIsLoginDialogOpen(false);
        setIsSignupDialogOpen(true);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const col = Math.floor(e.clientX / CELL_W);
        const row = Math.floor(e.clientY / CELL_H);
        if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return;
        setHighlighted(getNearbyRandom(row * COLS + col));
    };

    return (
        <div
            className="relative min-h-screen"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHighlighted(new Set())}
        >
            {/* Full-page grid — fixed, spans entire viewport across all sections */}
            <div className="fixed inset-0 hidden md:grid grid-cols-58 gap-0 pointer-events-none z-0">
                {gridCells.map((_, idx) => {
                    const isHighlighted = highlighted.has(idx);
                    return (
                        <div
                            key={idx}
                            className="w-[1.6025rem] h-6.25 border"
                            style={{
                                borderColor: isHighlighted ? "rgba(16,185,129,0.45)" : "rgba(0,0,0,0.05)",
                                backgroundColor: isHighlighted ? "rgba(16,185,129,0.06)" : "transparent",
                                transition: isHighlighted
                                    ? "border-color 0.1s ease-out, background-color 0.1s ease-out"
                                    : "border-color 2s ease, background-color 2s ease",
                            }}
                        />
                    );
                })}
            </div>

            {/* Mobile grid */}
            <div className="fixed inset-0 grid grid-cols-16 gap-0 md:hidden pointer-events-none z-0">
                {Array.from({ length: 550 }).map((_, idx) => (
                    <div key={idx} className="w-[1.6025rem] h-6.25 border border-[rgba(0,0,0,0.05)]" />
                ))}
            </div>

            {/* Page sections */}
            <div className="relative z-10">
                <Hero onLoginClick={handleOpenLogin} onGetQuote={handleGetQuote} />
                <HowItWorks />
                <Services />
                <RemovalsHub />
                <Testimonials />
                <FAQ />
                <Footer />
            </div>

            <LoginDialog
                isOpen={isLoginDialogOpen}
                onClose={() => setIsLoginDialogOpen(false)}
                onSignupClick={handleOpenSignup}
            />
            <SignupDialog
                isOpen={isSignupDialogOpen}
                onClose={() => setIsSignupDialogOpen(false)}
                onLoginClick={handleOpenLogin}
            />
            <BookingModal
                isOpen={isBookingOpen}
                onClose={() => setIsBookingOpen(false)}
                initialFromAddress={bookingFrom}
                initialToAddress={bookingTo}
            />
        </div>
    );
}

