"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    MapPin,
    Calendar,
    Home,
    Phone,
    TruckIcon,
    CheckCircle2,
    Navigation2,
    Tag,
    Handshake,
    X,
    ChevronRight,
} from "lucide-react";
import { CreateBookingPayload, HouseSize } from "@/api/bookingApi";
import { useCreateBooking } from "@/hooks/useBookings";
import { cn } from "@/lib/utils";
import PlacesInput from "@/components/shared/PlacesInput";
import { haversineKm } from "@/lib/googleMaps";
import { PlacePrediction } from "@/hooks/usePlacesAutocomplete";

// --- Constants ---

const HOUSE_SIZE_OPTIONS: { value: HouseSize; label: string; description: string }[] = [
    { value: "ONE_BHK", label: "1 BHK", description: "1 Bedroom" },
    { value: "TWO_BHK", label: "2 BHK", description: "2 Bedrooms" },
    { value: "THREE_BHK", label: "3 BHK", description: "3 Bedrooms" },
    { value: "OFFICE", label: "Office", description: "Commercial Space" },
];

/** Base loading fee + per-km rate — base rate $3/km scaled by property size */
const RATES: Record<HouseSize, { base: number; perKm: number }> = {
    ONE_BHK: { base: 50, perKm: 3.0 },
    TWO_BHK: { base: 75, perKm: 3.6 },
    THREE_BHK: { base: 100, perKm: 4.2 },
    OFFICE: { base: 150, perKm: 5.4 },
};

function calcPrice(distanceKm: number, houseSize: HouseSize): number {
    if (!distanceKm || distanceKm <= 0) return 0;
    const { base, perKm } = RATES[houseSize];
    return Math.round(base + perKm * distanceKm);
}

// --- Types ---

interface Coords { lat: number; lng: number }

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialFromAddress?: string;
    initialToAddress?: string;
}

// --- Component ---

export default function BookingModal({
    isOpen,
    onClose,
    initialFromAddress = "",
    initialToAddress = "",
}: BookingModalProps) {
    const [submitted, setSubmitted] = useState(false);

    const [fromAddr, setFromAddr] = useState(initialFromAddress);
    const [toAddr, setToAddr] = useState(initialToAddress);
    const [fromCoords, setFromCoords] = useState<Coords | null>(null);
    const [toCoords, setToCoords] = useState<Coords | null>(null);
    const [distanceKm, setDistanceKm] = useState<number>(0);
    const [bargainMode, setBargainMode] = useState(false);
    const [bargainPrice, setBargainPrice] = useState<string>("");

    const {
        register,
        handleSubmit,
        watch,
        reset,
        setValue,
        formState: { errors },
    } = useForm<CreateBookingPayload>({
        defaultValues: {
            fromAddress: initialFromAddress,
            toAddress: initialToAddress,
            distanceKm: 0,
            moveDate: "",
            houseSize: "ONE_BHK",
            phone: "",
            price: 0,
        },
    });

    const watchedHouseSize = watch("houseSize") ?? "ONE_BHK";

    // Auto-calculate distance when both coords are known
    useEffect(() => {
        if (fromCoords && toCoords) {
            const d =
                Math.round(haversineKm(fromCoords.lat, fromCoords.lng, toCoords.lat, toCoords.lng) * 10) / 10;
            setDistanceKm(d);
            setValue("distanceKm", d);
        }
    }, [fromCoords, toCoords, setValue]);

    const computedPrice = calcPrice(distanceKm, watchedHouseSize);
    const bargainValue = parseFloat(bargainPrice);
    const effectivePrice =
        bargainMode && !isNaN(bargainValue) && bargainValue > 0 ? bargainValue : computedPrice;

    // Keep RHF in sync
    useEffect(() => { setValue("fromAddress", fromAddr, { shouldValidate: !!fromAddr }); }, [fromAddr, setValue]);
    useEffect(() => { setValue("toAddress", toAddr, { shouldValidate: !!toAddr }); }, [toAddr, setValue]);
    useEffect(() => { setValue("price", effectivePrice); }, [effectivePrice, setValue]);

    // Re-populate when hero pre-fills addresses
    useEffect(() => {
        if (isOpen) {
            setFromAddr(initialFromAddress);
            setToAddr(initialToAddress);
            setValue("fromAddress", initialFromAddress);
            setValue("toAddress", initialToAddress);
            setFromCoords(null);
            setToCoords(null);
            setDistanceKm(0);
        }
    }, [isOpen, initialFromAddress, initialToAddress, setValue]);

    const bookingMutation = useCreateBooking();

    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                reset();
                setFromAddr("");
                setToAddr("");
                setFromCoords(null);
                setToCoords(null);
                setDistanceKm(0);
                setBargainMode(false);
                setBargainPrice("");
                setSubmitted(false);
                bookingMutation.reset();
            }, 300);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    const onSubmit = (data: CreateBookingPayload) => {
        bookingMutation.mutate(
            {
                ...data,
                distanceKm,
                moveDate: new Date(data.moveDate).toISOString(),
                price: effectivePrice,
            },
            { onSuccess: () => setSubmitted(true) }
        );
    };

    const handleSelectFrom = (p: PlacePrediction) => setFromCoords({ lat: p.lat, lng: p.lng });
    const handleSelectTo = (p: PlacePrediction) => setToCoords({ lat: p.lat, lng: p.lng });
    const handleFromChange = (v: string) => { setFromAddr(v); if (fromCoords) setFromCoords(null); };
    const handleToChange = (v: string) => { setToAddr(v); if (toCoords) setToCoords(null); };

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split("T")[0];

    const { base, perKm } = RATES[watchedHouseSize];

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-135 max-h-[90vh] overflow-y-auto">

                {submitted ? (
                    // Success
                    <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
                        <CheckCircle2 className="size-16 text-green-500" />
                        <DialogTitle className="text-2xl font-bold">Booking Requested!</DialogTitle>
                        <p className="text-muted-foreground text-sm max-w-xs">
                            Your removal has been submitted. We&apos;ll confirm your booking shortly.
                        </p>
                        <div className="w-full rounded-xl bg-muted p-4 text-sm space-y-1.5 text-left">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Distance</span>
                                <span className="font-medium">{distanceKm.toFixed(1)} km</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    {bargainMode && !isNaN(bargainValue) && bargainValue > 0 ? "Your Offer" : "Calculated Price"}
                                </span>
                                <span className="font-bold text-primary text-base">${effectivePrice.toLocaleString()}</span>
                            </div>
                        </div>
                        <Button className="mt-2 w-full" onClick={onClose}>Done</Button>
                    </div>

                ) : (
                    // Form
                    <>
                        <DialogHeader>
                            <div className="flex items-center gap-2">
                                <TruckIcon className="size-5 text-primary" />
                                <DialogTitle className="text-2xl font-bold">Book a Removal</DialogTitle>
                            </div>
                            <DialogDescription>
                                Fill in the details and we&apos;ll get your move sorted.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-1">

                            {bookingMutation.error && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                                    {(bookingMutation.error as any)?.response?.data?.message || "Something went wrong."}
                                </div>
                            )}

                            {/* From Address */}
                            <div className="space-y-1.5">
                                <Label className="flex items-center gap-1.5">
                                    <MapPin className="size-3.5 text-muted-foreground" /> From Address
                                </Label>
                                <PlacesInput
                                    value={fromAddr}
                                    onChange={handleFromChange}
                                    onSelect={handleSelectFrom}
                                    placeholder="e.g. 123 Old Street, London"
                                    hasError={!!errors.fromAddress}
                                />
                                <input type="hidden" {...register("fromAddress", {
                                    required: "From address is required",
                                    minLength: { value: 5, message: "Please enter a valid address" },
                                    validate: (v) => (v && v.trim().length >= 5) || "From address is required",
                                })} />
                                {errors.fromAddress && <p className="text-xs text-red-500">{errors.fromAddress.message}</p>}
                            </div>

                            {/* To Address */}
                            <div className="space-y-1.5">
                                <Label className="flex items-center gap-1.5">
                                    <MapPin className="size-3.5 text-primary" /> To Address
                                </Label>
                                <PlacesInput
                                    value={toAddr}
                                    onChange={handleToChange}
                                    onSelect={handleSelectTo}
                                    placeholder="e.g. 456 New Road, Manchester"
                                    hasError={!!errors.toAddress}
                                />
                                <input type="hidden" {...register("toAddress", {
                                    required: "To address is required",
                                    minLength: { value: 5, message: "Please enter a valid address" },
                                    validate: (v) => (v && v.trim().length >= 5) || "To address is required",
                                })} />
                                {errors.toAddress && <p className="text-xs text-red-500">{errors.toAddress.message}</p>}
                            </div>

                            {/* Auto-calculated distance badge */}
                            {errors.distanceKm && !distanceKm && (
                                <p className="text-xs text-red-500">{errors.distanceKm.message}</p>
                            )}
                            {distanceKm > 0 ? (
                                <div className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-2.5 text-sm text-emerald-800">
                                    <Navigation2 className="size-3.5 shrink-0" />
                                    Distance calculated: <strong className="ml-1">{distanceKm.toFixed(1)} km</strong>
                                </div>
                            ) : (fromAddr.length > 4 && toAddr.length > 4) ? (
                                <p className="text-xs text-muted-foreground pl-1">
                                    Pick addresses from the suggestions to auto-calculate distance.
                                </p>
                            ) : null}
                            <input type="hidden" {...register("distanceKm", {
                                validate: (v) => Number(v) > 0 || "Please select both addresses from the dropdown to calculate distance",
                            })} />

                            {/* Move Date */}
                            <div className="space-y-1.5">
                                <Label htmlFor="moveDate" className="flex items-center gap-1.5">
                                    <Calendar className="size-3.5 text-muted-foreground" /> Move Date
                                </Label>
                                <Input
                                    id="moveDate"
                                    type="date"
                                    min={minDate}
                                    {...register("moveDate", { required: "Move date is required" })}
                                    className={cn(errors.moveDate && "border-red-400")}
                                />
                                {errors.moveDate && <p className="text-xs text-red-500">{errors.moveDate.message}</p>}
                            </div>

                            {/* Phone */}
                            <div className="space-y-1.5">
                                <Label htmlFor="phone" className="flex items-center gap-1.5">
                                    <Phone className="size-3.5 text-muted-foreground" /> Contact Phone
                                </Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="e.g. +44 7700 900123"
                                    {...register("phone", {
                                        required: "Phone number is required",
                                        minLength: { value: 7, message: "Enter a valid phone number" },
                                    })}
                                    className={cn(errors.phone && "border-red-400")}
                                />
                                {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
                            </div>

                            {/* House Size */}
                            <div className="space-y-2">
                                <Label className="flex items-center gap-1.5">
                                    <Home className="size-3.5 text-muted-foreground" /> Property Size
                                </Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {HOUSE_SIZE_OPTIONS.map((opt) => {
                                        const isSelected = watchedHouseSize === opt.value;
                                        return (
                                            <label key={opt.value} className={cn(
                                                "flex flex-col gap-0.5 rounded-lg border p-3 cursor-pointer transition-colors",
                                                isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                                            )}>
                                                <input type="radio" value={opt.value} className="sr-only"
                                                    {...register("houseSize", { required: true })} />
                                                <span className="font-semibold text-sm">{opt.label}</span>
                                                <span className="text-xs text-muted-foreground">{opt.description}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* ── Price Section ── */}
                            <div className="rounded-xl border bg-muted/40 overflow-hidden">

                                <div className="flex items-center gap-2 px-4 py-2.5 border-b bg-muted/60">
                                    <Tag className="size-3.5 text-muted-foreground" />
                                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                        Price Breakdown
                                    </span>
                                </div>

                                <div className="px-4 py-3 space-y-1.5 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Base loading fee</span>
                                        <span>${base}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Rate — ${perKm.toFixed(2)}/km</span>
                                        <span>{distanceKm > 0 ? `$${(perKm * distanceKm).toFixed(2)}` : "—"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Distance</span>
                                        <span>{distanceKm > 0 ? `${distanceKm.toFixed(1)} km` : "—"}</span>
                                    </div>
                                    <div className="border-t pt-2 mt-1 flex justify-between items-center">
                                        <span className="font-semibold">
                                            {bargainMode && !isNaN(bargainValue) && bargainValue > 0 ? "Your Offer" : "Estimated Total"}
                                        </span>
                                        <span className="text-lg font-bold text-primary">
                                            {effectivePrice > 0
                                                ? `$${effectivePrice.toLocaleString()}`
                                                : distanceKm === 0 ? "Pick both addresses" : "—"}
                                        </span>
                                    </div>
                                </div>

                                {/* Bargain */}
                                <div className="border-t px-4 py-3">
                                    {!bargainMode ? (
                                        <button type="button"
                                            onClick={() => { setBargainMode(true); setBargainPrice(computedPrice > 0 ? String(computedPrice) : ""); }}
                                            className="flex items-center gap-2 text-sm text-emerald-700 hover:text-emerald-800 font-medium transition">
                                            <Handshake className="size-4" />
                                            Make an Offer / Bargain
                                            <ChevronRight className="size-3.5" />
                                        </button>
                                    ) : (
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label className="flex items-center gap-1.5 text-sm">
                                                    <Handshake className="size-3.5 text-emerald-600" /> Your Offer Price ($)
                                                </Label>
                                                <button type="button"
                                                    onClick={() => { setBargainMode(false); setBargainPrice(""); }}
                                                    className="text-muted-foreground hover:text-foreground transition">
                                                    <X className="size-4" />
                                                </button>
                                            </div>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                                                <Input
                                                    type="number" min="1" step="1"
                                                    placeholder={computedPrice > 0 ? String(computedPrice) : "Enter your price"}
                                                    value={bargainPrice}
                                                    onChange={(e) => setBargainPrice(e.target.value)}
                                                    className="pl-7"
                                                />
                                            </div>
                                            {computedPrice > 0 && !isNaN(bargainValue) && bargainValue > 0 && bargainValue < computedPrice && (
                                                <p className="text-xs text-amber-600">
                                                    ${(computedPrice - bargainValue).toLocaleString()} below our estimate — we&apos;ll review it.
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <input type="hidden" {...register("price", {
                                validate: (v) => Number(v) > 0 || "Could not calculate price — please pick both addresses",
                            })} />

                            <Button type="submit" className="w-full" disabled={bookingMutation.isPending}>
                                {bookingMutation.isPending ? "Submitting…" : "Request Removal"}
                            </Button>

                        </form>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
