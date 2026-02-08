import { useState, createContext, useContext } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Wifi,
    Waves,
    Dumbbell,
    UtensilsCrossed,
    ParkingCircle,
    PawPrint,
    Upload,
    MessageCircle,
    Eye,
    Check,
    Lock,
    ExternalLink,
    ChevronRight,
    Palette,
    Settings2,
    Sparkles,
    Instagram,
    MapPin,
    Phone,
    BedDouble,
} from 'lucide-react';
import { dashboard, storefront } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { cn } from '@/lib/utils';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard.url() },
    { title: 'Storefront', href: storefront.url() },
];

interface RoomTypePreview {
    id: string;
    name: string;
    price: string;
}

interface StorefrontConfig {
    hotelName: string;
    logoUrl: string | null;
    primaryColor: string;
    theme: 'minimalist' | 'modern' | 'classic';
    amenities: string[];
    address: string;
    whatsappNumber: string;
    instagram: string;
    roomTypes: RoomTypePreview[];
}

const StorefrontContext = createContext<{
    config: StorefrontConfig;
    updateConfig: (key: keyof StorefrontConfig, value: any) => void;
    userRole: 'owner' | 'staff';
}>({
    config: {
        hotelName: 'The Grand Plaza Hotel',
        logoUrl: null,
        primaryColor: '#195E7E',
        theme: 'modern',
        amenities: ['wifi', 'restaurant'],
        address: '123 Ocean Avenue, Beach City',
        whatsappNumber: '+1-555-0123',
        instagram: '@grandplazahotel',
        roomTypes: [
            { id: '1', name: 'Deluxe Ocean Suite', price: '₦150,000' },
            { id: '2', name: 'Standard King Room', price: '₦85,000' },
        ],
    },
    updateConfig: () => { },
    userRole: 'owner',
});

function useStorefront() {
    return useContext(StorefrontContext);
}

const amenityOptions = [
    { id: 'wifi', label: 'Wi-Fi', icon: Wifi },
    { id: 'pool', label: 'Pool', icon: Waves },
    { id: 'gym', label: 'Gym', icon: Dumbbell },
    { id: 'restaurant', label: 'Restaurant', icon: UtensilsCrossed },
    { id: 'parking', label: 'Parking', icon: ParkingCircle },
    { id: 'pets', label: 'Pet Friendly', icon: PawPrint },
];

const themes = [
    {
        id: 'minimalist',
        name: 'The Pure',
        description: 'Understated elegance, airy compositions',
        fontClass: 'font-inter',
        bgColor: 'bg-[#F9F9F9]',
        accentBg: 'bg-white',
    },
    {
        id: 'modern',
        name: 'Noir Luxe',
        description: 'Sophisticated charcoal with gold accents',
        fontClass: 'font-serif',
        bgColor: 'bg-[#1A1A1A]',
        accentBg: 'bg-[#252525]',
    },
    {
        id: 'classic',
        name: 'Heritage Estate',
        description: 'Rich forest tones and cream warmth',
        fontClass: 'font-serif',
        bgColor: 'bg-[#FDFCF0]',
        accentBg: 'bg-[#F2EFE0]',
    },
] as const;

const themeStyles: Record<'minimalist' | 'modern' | 'classic', { bg: string; card: string; text: string; accent: string; separator: string; button: string }> = {
    minimalist: {
        bg: 'bg-white',
        card: 'bg-[#F9F9F9]',
        text: 'text-stone-900',
        accent: 'text-stone-400',
        separator: 'bg-stone-100',
        button: 'bg-stone-900 text-white hover:bg-stone-800',
    },
    modern: {
        bg: 'bg-[#1A1A1A]',
        card: 'bg-[#252525]',
        text: 'text-stone-50',
        accent: 'text-[#D4AF37]',
        separator: 'bg-stone-800',
        button: 'bg-[#D4AF37] text-stone-950 hover:bg-[#C5A028]',
    },
    classic: {
        bg: 'bg-[#FDFCF0]',
        card: 'bg-white',
        text: 'text-[#1B3022]',
        accent: 'text-[#1B3022]/70',
        separator: 'bg-[#1B3022]/10',
        button: 'bg-[#1B3022] text-white hover:bg-[#2C4A35]',
    },
};

function ModernLayout({ config, styles, theme }: { config: StorefrontConfig, styles: any, theme: any }) {
    const selectedAmenities = amenityOptions.filter(a => config.amenities.includes(a.id));

    return (
        <div className="h-[700px] overflow-y-auto scrollbar-hide flex flex-col relative bg-[#1A1A1A]">
            {/* Hero with Photo */}
            <div className="relative h-48 flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/20 to-transparent z-10" />
                <img
                    src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800"
                    alt="Luxury Hotel"
                    className="w-full h-full object-cover grayscale-[0.2] contrast-[1.1]"
                />
                <div className="absolute bottom-6 left-6 z-20 space-y-2">
                    <div className="h-10 w-10 rounded-lg bg-stone-50/10 backdrop-blur-md border border-stone-50/20 flex items-center justify-center">
                        {config.logoUrl ? (
                            <img src={config.logoUrl} alt="Logo" className="h-6 w-6 object-contain" />
                        ) : (
                            <Sparkles className="h-5 w-5 text-[#D4AF37]" />
                        )}
                    </div>
                </div>
            </div>

            <div className="px-6 pb-32 -mt-2 relative z-20 space-y-10">
                <div className="space-y-1">
                    <h1 className="text-3xl font-serif text-stone-50 leading-tight tracking-tight">
                        {config.hotelName}
                    </h1>
                    <div className="flex items-center gap-2">
                        <div className="h-px w-6 bg-[#D4AF37]" />
                        <p className="text-[9px] uppercase tracking-[0.3em] font-medium text-[#D4AF37]">Exclusivity Redefined</p>
                    </div>
                </div>

                {/* Amenities - Modern Row */}
                <div className="flex flex-wrap gap-4">
                    {selectedAmenities.map((amenity) => {
                        const Icon = amenity.icon;
                        return (
                            <div key={amenity.id} className="flex items-center gap-2 group">
                                <Icon className="h-3 w-3 text-[#D4AF37] opacity-60 group-hover:opacity-100 transition-opacity" />
                                <span className="text-[9px] text-stone-400 uppercase tracking-widest">{amenity.label}</span>
                            </div>
                        );
                    })}
                </div>

                {/* Accomodation Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-stone-500">Selection</span>
                        <div className="h-px flex-1 bg-stone-800 ml-4" />
                    </div>
                    <div className="space-y-3">
                        {config.roomTypes?.map((room) => (
                            <div key={room.id} className="group cursor-pointer">
                                <div className="flex items-center justify-between p-4 rounded-xl bg-stone-900/50 border border-stone-800 hover:border-[#D4AF37]/30 transition-all duration-500">
                                    <div className="space-y-1">
                                        <p className="text-sm font-serif text-stone-50">{room.name}</p>
                                        <p className="text-[10px] text-stone-500">Curated stay experience</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-[#D4AF37]">{room.price}</p>
                                        <p className="text-[8px] text-stone-600 uppercase">per night</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6 pt-4">
                    <div className="flex items-start gap-4 text-stone-500">
                        <MapPin className="h-3 w-3 text-[#D4AF37] mt-0.5" />
                        <p className="text-[10px] leading-relaxed italic">{config.address}</p>
                    </div>
                    {config.instagram && (
                        <div className="flex items-center gap-3 text-[#D4AF37] group cursor-pointer">
                            <Instagram className="h-3 w-3" />
                            <span className="text-[9px] font-bold tracking-widest group-hover:underline">{config.instagram}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="absolute bottom-6 left-6 right-6 z-30">
                <button className="w-full py-4 rounded-full bg-[#D4AF37] text-stone-950 text-[11px] font-bold uppercase tracking-[0.2em] shadow-2xl shadow-[#D4AF37]/10 active:scale-95 transition-all">
                    Inquire Reservation
                </button>
            </div>
        </div>
    );
}

function MinimalistLayout({ config, styles }: { config: StorefrontConfig, styles: any }) {
    const selectedAmenities = amenityOptions.filter(a => config.amenities.includes(a.id));

    return (
        <div className="h-[700px] overflow-y-auto scrollbar-hide flex flex-col bg-white">
            <div className="p-8 space-y-12">
                {/* Minimal Header */}
                <div className="space-y-6">
                    <div className="h-8 w-8 flex items-center justify-center border border-stone-100 rounded-sm">
                        {config.logoUrl ? (
                            <img src={config.logoUrl} alt="Logo" className="h-4 w-4 object-contain grayscale" />
                        ) : (
                            <div className="h-1.5 w-1.5 bg-stone-900 rounded-full" />
                        )}
                    </div>
                    <div className="space-y-3">
                        <h1 className="text-2xl font-light tracking-tighter text-stone-900">
                            {config.hotelName}
                        </h1>
                        <p className="text-[10px] text-stone-400 font-medium uppercase tracking-[0.1em]">Boutique Hospitality</p>
                    </div>
                </div>

                {/* Minimalist Amenities */}
                <div className="space-y-3">
                    <p className="text-[8px] text-stone-300 uppercase tracking-widest font-bold">Offerings</p>
                    <div className="flex flex-wrap gap-y-2 gap-x-4">
                        {selectedAmenities.map(a => (
                            <span key={a.id} className="text-[10px] text-stone-500 lowercase font-serif italic">{a.label}</span>
                        ))}
                    </div>
                </div>

                {/* Simple Listing */}
                <div className="space-y-8">
                    {config.roomTypes?.map((room) => (
                        <div key={room.id} className="space-y-3 group cursor-pointer">
                            <div className="aspect-[16/9] bg-stone-50 rounded-sm overflow-hidden border border-stone-100/50">
                                <img
                                    src="https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&q=80&w=800"
                                    className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                                    alt={room.name}
                                />
                            </div>
                            <div className="flex items-end justify-between border-b border-stone-100 pb-2">
                                <span className="text-xs font-medium text-stone-800 tracking-tight">{room.name}</span>
                                <span className="text-[10px] text-stone-400">{room.price}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pt-8 space-y-6 pb-12">
                    <div className="space-y-2">
                        <p className="text-[10px] text-stone-400 font-medium leading-relaxed max-w-[200px]">
                            {config.address}
                        </p>
                        {config.instagram && <p className="text-[9px] text-stone-300">ig: {config.instagram.replace('@', '')}</p>}
                    </div>
                    <button className="w-full py-3 border border-stone-900 text-stone-900 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-stone-900 hover:text-white transition-all">
                        Connect with us
                    </button>
                </div>
            </div>
        </div>
    );
}

function ClassicLayout({ config, styles, theme }: { config: StorefrontConfig, styles: any, theme: any }) {
    const selectedAmenities = amenityOptions.filter(a => config.amenities.includes(a.id));

    return (
        <div className="h-[700px] overflow-y-auto scrollbar-hide flex flex-col bg-[#FDFCF0]">
            <div className="pt-12 pb-8 flex flex-col items-center space-y-6 px-8">
                <div className="h-14 w-14 rounded-full border border-[#1B3022]/10 p-1 flex items-center justify-center">
                    <div className="h-full w-full rounded-full border border-[#1B3022]/40 flex items-center justify-center bg-white shadow-sm">
                        {config.logoUrl ? (
                            <img src={config.logoUrl} alt="Logo" className="h-6 w-6 object-contain" />
                        ) : (
                            <BedDouble className="h-5 w-5 text-[#1B3022]/60" />
                        )}
                    </div>
                </div>
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-serif text-[#1B3022] leading-tight">
                        {config.hotelName}
                    </h1>
                    <div className="flex items-center justify-center gap-3">
                        <div className="h-[0.5px] w-4 bg-[#1B3022]/20" />
                        <span className="text-[9px] uppercase tracking-widest text-[#1B3022]/60 font-medium">Established Estate</span>
                        <div className="h-[0.5px] w-4 bg-[#1B3022]/20" />
                    </div>
                </div>
            </div>

            <div className="px-8 pb-12 space-y-12">
                {/* Traditional Amenities Grid */}
                <div className="grid grid-cols-3 gap-y-4">
                    {selectedAmenities.slice(0, 6).map(a => {
                        const Icon = a.icon;
                        return (
                            <div key={a.id} className="flex flex-col items-center gap-1.5">
                                <Icon className="h-3 w-3 text-[#1B3022]/40" />
                                <span className="text-[8px] text-[#1B3022]/60 uppercase text-center">{a.label}</span>
                            </div>
                        );
                    })}
                </div>

                <div className="space-y-2">
                    <h3 className="text-center text-[9px] uppercase tracking-[0.2em] text-[#1B3022]/50 font-bold">Suite Selection</h3>
                    <div className="space-y-px bg-[#1B3022]/10 border border-[#1B3022]/10 rounded-sm overflow-hidden">
                        {config.roomTypes?.map((room) => (
                            <div key={room.id} className="flex items-center justify-between p-4 bg-white hover:bg-[#FDFCF0] transition-colors cursor-pointer group">
                                <div className="space-y-0.5">
                                    <p className="text-xs font-serif text-[#1B3022]">{room.name}</p>
                                    <p className="text-[9px] text-stone-400 italic">Complimentary breakfast included</p>
                                </div>
                                <span className="text-[10px] font-bold text-[#1B3022]">{room.price}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col items-center gap-6">
                    <div className="flex flex-col items-center gap-2 opacity-60">
                        <MapPin className="h-3 w-3 text-[#1B3022]" />
                        <p className="text-[9px] font-serif text-center max-w-[160px] leading-relaxed">
                            {config.address}
                        </p>
                    </div>
                    {config.instagram && (
                        <div className="flex items-center gap-2 text-[#1B3022]/60 text-[9px] italic">
                            <Instagram className="h-3 w-3" />
                            <span>{config.instagram}</span>
                        </div>
                    )}
                    <button className="px-10 py-3 rounded-sm bg-[#1B3022] text-white text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg shadow-[#1B3022]/10 hover:shadow-[#1B3022]/20 transition-all">
                        Reserve a Stay
                    </button>
                </div>
            </div>
        </div>
    );
}

function MobilePreview() {
    const { config } = useStorefront();
    const theme = themes.find((t) => t.id === config.theme)!;
    const styles = themeStyles[config.theme];

    const renderLayout = () => {
        switch (config.theme) {
            case 'modern':
                return <ModernLayout config={config} styles={styles} theme={theme} />;
            case 'minimalist':
                return <MinimalistLayout config={config} styles={styles} />;
            case 'classic':
                return <ClassicLayout config={config} styles={styles} theme={theme} />;
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="relative w-full max-w-[340px]">
                {/* iPhone 14 Pro Max Frame (Scaled) */}
                <div className="bg-slate-950 rounded-[3.5rem] p-3 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.5)] ring-1 ring-white/10 relative overflow-hidden">
                    {/* Glass Shine */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none z-50" />

                    {/* Screen */}
                    <div className={cn("rounded-[2.8rem] overflow-hidden flex flex-col relative", styles.bg)}>
                        {/* Dynamic Island */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-10 z-[60] flex items-center justify-between px-8">
                            <span className="text-[12px] font-bold text-current">9:41</span>

                            {/* The Island */}
                            <div className="h-6 w-24 bg-black rounded-full shadow-inner ring-1 ring-white/5" />

                            <div className="flex items-center gap-1 grayscale scale-90">
                                <Wifi className="h-3 w-3" />
                                <div className="h-2 w-3.5 rounded-[1px] border border-current opacity-40 px-0.5 py-[1px] relative">
                                    <div className="h-full w-full bg-current rounded-[0.5px]" />
                                    <div className="absolute -right-0.5 top-1/2 -translate-y-1/2 h-0.5 w-0.5 bg-current rounded-full" />
                                </div>
                            </div>
                        </div>

                        {/* Theme Specific Layout - Margin Top for status bar */}
                        <div className="pt-10">
                            {renderLayout()}
                        </div>

                        {/* Bottom Home Indicator */}
                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-24 h-1 bg-current opacity-20 rounded-full z-[60]" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function Stepper({ currentStep, steps, onStepClick }: { currentStep: string, steps: { id: string, label: string, icon: any }[], onStepClick: (id: any) => void }) {
    const currentIndex = steps.findIndex(s => s.id === currentStep);

    return (
        <div className="flex items-center justify-between w-full mb-6 sm:mb-8 relative px-4">
            {/* Progress Line */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -translate-y-1/2 z-0 rounded-full" />
            <div
                className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 transition-all duration-500 rounded-full"
                style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
            />

            {steps.map((step, index) => {
                const isCompleted = index < currentIndex;
                const isActive = index === currentIndex;
                const Icon = step.icon;

                return (
                    <button
                        key={step.id}
                        onClick={() => onStepClick(step.id)}
                        className="group relative flex flex-col items-center gap-3 z-10"
                    >
                        <div className={cn(
                            "h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300 border-2",
                            isCompleted ? "bg-primary border-primary text-white" :
                                isActive ? "bg-background border-primary text-primary shadow-[0_0_15px_rgba(var(--primary),0.2)]" :
                                    "bg-muted border-muted text-muted-foreground group-hover:border-primary/50"
                        )}>
                            {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                        </div>
                        <span className={cn(
                            "text-[10px] sm:text-xs font-bold tracking-tight absolute -bottom-6 w-max transition-colors hidden sm:block",
                            isActive ? "text-primary" : "text-muted-foreground"
                        )}>
                            {step.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}

function BrandingStep() {
    const { config, updateConfig, userRole } = useStorefront();
    const isDisabled = userRole === 'staff';
    const colors = ['#195E7E', '#00A3CC', '#2D8F8F', '#E67E22', '#6366F1', '#8B5CF6', '#EC4899'];
    const [showCustomColor, setShowCustomColor] = useState(false);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">General Info</Label>
                    <div className="h-px flex-1 bg-muted" />
                </div>
                <div>
                    <Label className="text-base font-semibold">Storefront Name</Label>
                    <Input
                        value={config.hotelName}
                        onChange={(e) => updateConfig('hotelName', e.target.value)}
                        disabled={isDisabled}
                        placeholder="e.g. The Grand Plaza Hotel"
                        className="mt-2 h-12 bg-muted/30 focus:bg-background transition-colors"
                    />
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Visual Identity</Label>
                    <div className="h-px flex-1 bg-muted" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label className="text-base font-semibold">Brand Logo</Label>
                        <div className={cn(
                            "h-40 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all",
                            isDisabled ? "opacity-50 cursor-not-allowed bg-muted/10 border-muted" : "cursor-pointer bg-muted/20 border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/30"
                        )}>
                            <div className="h-10 w-10 rounded-xl bg-background shadow-sm border flex items-center justify-center">
                                <Upload className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-semibold">Click to upload</p>
                                <p className="text-xs text-muted-foreground">PNG, JPG or SVG (max 2MB)</p>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <Label className="text-base font-semibold">Primary Theme Color</Label>
                        <div className="flex flex-wrap gap-2.5">
                            {colors.map((color) => (
                                <button
                                    key={color}
                                    onClick={() => !isDisabled && updateConfig('primaryColor', color)}
                                    disabled={isDisabled}
                                    className={cn(
                                        "h-9 w-9 rounded-full transition-all ring-offset-2 ring-primary relative",
                                        config.primaryColor === color ? "ring-2 scale-110" : "hover:scale-105"
                                    )}
                                    style={{ backgroundColor: color }}
                                >
                                    {config.primaryColor === color && <Check className="h-4 w-4 text-white absolute inset-0 m-auto" />}
                                </button>
                            ))}
                            {!isDisabled && (
                                <button
                                    onClick={() => setShowCustomColor(!showCustomColor)}
                                    className={cn(
                                        "h-9 w-9 rounded-full border-2 border-dashed flex items-center justify-center bg-muted/30 transition-all",
                                        showCustomColor ? "border-primary text-primary" : "hover:border-primary/50"
                                    )}
                                >
                                    <Sparkles className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                        {showCustomColor && !isDisabled && (
                            <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-xl border border-muted animate-in zoom-in-95">
                                <input
                                    type="color"
                                    value={config.primaryColor}
                                    onChange={(e) => updateConfig('primaryColor', e.target.value)}
                                    className="h-8 w-8 rounded-lg cursor-pointer border-0 p-0 overflow-hidden"
                                />
                                <Input
                                    value={config.primaryColor}
                                    onChange={(e) => updateConfig('primaryColor', e.target.value)}
                                    className="h-9 font-mono text-xs"
                                    placeholder="#HEXCODE"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function ThemeStep() {
    const { config, updateConfig, userRole } = useStorefront();
    const isDisabled = userRole === 'staff';

    return (
        <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <div className="space-y-1">
                <h3 className="text-lg font-bold">Design Theme</h3>
                <p className="text-sm text-muted-foreground">Select a layout that best represents your hospitality style.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {themes.map((theme) => {
                    const isSelected = config.theme === theme.id;
                    return (
                        <button
                            key={theme.id}
                            onClick={() => !isDisabled && updateConfig('theme', theme.id)}
                            disabled={isDisabled}
                            className={cn(
                                "group relative flex flex-col p-4 rounded-2xl border-2 text-left transition-all duration-300",
                                isSelected ? "border-primary bg-primary/5 shadow-lg shadow-primary/5" : "border-muted bg-card hover:border-primary/30"
                            )}
                        >
                            <div className={cn("h-32 w-full rounded-xl mb-4 overflow-hidden border relative flex items-center justify-center", theme.bgColor)}>
                                <div className={cn("w-2/3 h-1/2 rounded shadow-sm border absolute top-4 left-4", theme.accentBg)} />
                                <div className={cn("w-1/3 h-1/4 rounded shadow-sm border absolute bottom-4 right-4", theme.accentBg)} />
                                <div className={cn("h-4 w-12 rounded bg-primary/20 absolute -bottom-10 opacity-0 group-hover:bottom-4 group-hover:opacity-100 transition-all", isSelected && "bottom-4 opacity-100")} />
                            </div>

                            <h4 className="font-bold text-sm sm:text-base flex items-center justify-between">
                                {theme.name}
                                {isSelected && <Badge variant="secondary" className="bg-primary/10 text-primary text-[9px] px-1.5 h-4">Active</Badge>}
                            </h4>
                            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1.5 leading-relaxed">{theme.description}</p>
                        </button>
                    )
                })}
            </div>
        </div>
    );
}

function AmenitiesStep() {
    const { config, updateConfig, userRole } = useStorefront();
    const isDisabled = userRole === 'staff';

    const toggleAmenity = (id: string) => {
        if (isDisabled) return;
        const newAmenities = config.amenities.includes(id)
            ? config.amenities.filter(a => a !== id)
            : [...config.amenities, id];
        updateConfig('amenities', newAmenities);
    };

    return (
        <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <div className="space-y-1">
                <h3 className="text-lg font-bold">Featured Amenities</h3>
                <p className="text-sm text-muted-foreground">These will be highlighted in your storefront's quick facts section.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {amenityOptions.map((amenity) => {
                    const Icon = amenity.icon;
                    const isSelected = config.amenities.includes(amenity.id);
                    return (
                        <button
                            key={amenity.id}
                            onClick={() => toggleAmenity(amenity.id)}
                            disabled={isDisabled}
                            className={cn(
                                "flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl border-2 transition-all duration-200 text-left group",
                                isSelected ? "border-primary bg-primary/5 shadow-sm" : "border-muted bg-card hover:border-primary/20"
                            )}
                        >
                            <div className={cn(
                                "h-10 w-10 sm:h-11 sm:w-11 rounded-xl flex items-center justify-center transition-colors shadow-sm border",
                                isSelected ? "bg-primary text-white border-primary" : "bg-muted/50 text-muted-foreground"
                            )}>
                                <Icon className="h-5 w-5" />
                            </div>
                            <div className="space-y-0.5">
                                <p className={cn("text-xs sm:text-sm font-bold", isSelected ? "text-primary" : "text-foreground")}>
                                    {amenity.label}
                                </p>
                                <p className="text-[9px] sm:text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">Guest Favorite</p>
                            </div>
                            <div className={cn(
                                "ml-auto h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all",
                                isSelected ? "bg-primary border-primary scale-100" : "border-muted scale-75 opacity-0 group-hover:opacity-100"
                            )}>
                                <Check className="h-3 w-3 text-white" />
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

function ContactStep() {
    const { config, updateConfig, userRole } = useStorefront();
    const isDisabled = userRole === 'staff';

    return (
        <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-2">
            <div className="space-y-1">
                <h3 className="text-lg font-bold">Contact & Socials</h3>
                <p className="text-sm text-muted-foreground">Make it easy for guests to reach you and follow your news.</p>
            </div>

            <Card className="p-4 sm:p-6 bg-muted/10 border-muted">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-orange-100 flex items-center justify-center">
                                    <MapPin className="h-4 w-4 text-orange-600" />
                                </div>
                                <Label className="text-sm font-bold">Location</Label>
                            </div>
                            <Input
                                value={config.address}
                                onChange={(e) => updateConfig('address', e.target.value)}
                                disabled={isDisabled}
                                placeholder="Full address"
                                className="h-11 bg-background"
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                                    <MessageCircle className="h-4 w-4 text-green-600" />
                                </div>
                                <Label className="text-sm font-bold">WhatsApp Business</Label>
                            </div>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-bold">+</span>
                                <Input
                                    value={config.whatsappNumber.replace('+', '')}
                                    onChange={(e) => updateConfig('whatsappNumber', `+${e.target.value}`)}
                                    disabled={isDisabled}
                                    placeholder="1 555 000 000"
                                    className="h-11 pl-7 bg-background"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-pink-100 flex items-center justify-center">
                                    <Instagram className="h-4 w-4 text-pink-600" />
                                </div>
                                <Label className="text-sm font-bold">Instagram Handle</Label>
                            </div>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-bold">@</span>
                                <Input
                                    value={config.instagram.replace('@', '')}
                                    onChange={(e) => updateConfig('instagram', `@${e.target.value}`)}
                                    disabled={isDisabled}
                                    placeholder="yourhotel"
                                    className="h-11 pl-8 bg-background"
                                />
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-start gap-4">
                            <div className="mt-1">
                                <Sparkles className="h-5 w-5 text-primary" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold">Quick Tip</p>
                                <p className="text-[11px] text-muted-foreground leading-relaxed">
                                    Linking your high-quality Instagram photos boosts conversion by up to <strong>40%</strong>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}

export default function Storefront({ userRole = 'owner' }: { userRole?: 'owner' | 'staff' }) {
    const [currentStep, setCurrentStep] = useState<'branding' | 'theme' | 'amenities' | 'contact'>('branding');
    const [config, setConfig] = useState<StorefrontConfig>({
        hotelName: 'The Grand Plaza Hotel',
        logoUrl: null,
        primaryColor: '#195E7E',
        theme: 'modern',
        amenities: ['wifi', 'restaurant', 'pool'],
        address: '123 Ocean Avenue, Beach City',
        whatsappNumber: '+1 555 0123',
        instagram: '@grandplazahotel',
        roomTypes: [
            { id: '1', name: 'Deluxe Ocean Suite', price: '₦150,000' },
            { id: '2', name: 'Standard King Room', price: '₦85,000' },
        ],
    });

    const updateConfig = (key: keyof StorefrontConfig, value: any) => {
        setConfig((prev) => ({ ...prev, [key]: value }));
    };

    const steps = [
        { id: 'branding' as const, label: 'Identity', icon: Palette },
        { id: 'theme' as const, label: 'Theme', icon: Sparkles },
        { id: 'amenities' as const, label: 'Amenities', icon: Settings2 },
        { id: 'contact' as const, label: 'Social', icon: MessageCircle },
    ];

    const currentStepIndex = steps.findIndex((s) => s.id === currentStep);
    const isLastStep = currentStepIndex === steps.length - 1;

    const renderContent = () => {
        switch (currentStep) {
            case 'branding': return <BrandingStep />;
            case 'theme': return <ThemeStep />;
            case 'amenities': return <AmenitiesStep />;
            case 'contact': return <ContactStep />;
            default: return null;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Storefront Design" />
            <StorefrontContext.Provider value={{ config, updateConfig, userRole }}>
                <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6 sm:space-y-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div className="space-y-1">
                            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Storefront Design</h1>
                            <p className="text-xs sm:text-sm text-muted-foreground">Customize your digital gateway to provide a premium guest experience.</p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                            <Button variant="outline" className="h-11 shadow-sm px-5 w-full sm:w-auto" asChild>
                                <a href="#" target="_blank"><Eye className="h-4 w-4 mr-2" /> View Live</a>
                            </Button>
                            {userRole === 'owner' && (
                                <Button className="h-11 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 px-6 font-bold w-full sm:w-auto">
                                    Publish Updates
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Editor Section */}
                        <div className="lg:col-span-8 space-y-8">
                            <Stepper
                                currentStep={currentStep}
                                steps={steps}
                                onStepClick={setCurrentStep}
                            />

                            <Card className="p-1 min-h-[auto] sm:min-h-[500px] border-muted overflow-hidden bg-card/50 backdrop-blur-sm">
                                <div className="p-4 sm:p-6 md:p-10">
                                    {renderContent()}
                                </div>

                                <div className="p-4 sm:p-6 md:p-8 bg-muted/30 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
                                    <Button
                                        variant="ghost"
                                        className="h-11 px-6 font-bold hover:bg-muted/50 w-full sm:w-auto order-2 sm:order-1"
                                        onClick={() => {
                                            const newIndex = Math.max(0, currentStepIndex - 1);
                                            setCurrentStep(steps[newIndex].id);
                                        }}
                                        disabled={currentStepIndex === 0}
                                    >
                                        Back
                                    </Button>

                                    {!isLastStep ? (
                                        <Button
                                            className="h-11 px-8 gap-2 bg-primary hover:bg-primary/90 font-bold w-full sm:w-auto order-1 sm:order-2"
                                            onClick={() => {
                                                const newIndex = Math.min(steps.length - 1, currentStepIndex + 1);
                                                setCurrentStep(steps[newIndex].id);
                                            }}
                                        >
                                            Continue <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    ) : (
                                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto order-1 sm:order-2">
                                            <Button variant="outline" className="h-11 font-bold w-full sm:w-auto">Save Draft</Button>
                                            <Button className="h-11 px-8 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 font-bold w-full sm:w-auto">Complete Design</Button>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </div>

                        {/* Preview Section */}
                        <div className="lg:col-span-4 lg:sticky lg:top-8 order-first lg:order-last">
                            <div className="space-y-4">
                                <div className="flex items-center justify-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider bg-muted/40 py-2 rounded-full">
                                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                                    Live Mobile Preview
                                </div>
                                <MobilePreview />
                                <Card className="p-4 border-muted/50 bg-gradient-to-br from-primary/5 to-transparent">
                                    <p className="text-[11px] text-muted-foreground leading-relaxed text-center font-medium italic">
                                        "Automated booking management is active. Your storefront is currently synced with your hotel availability."
                                    </p>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </StorefrontContext.Provider>
        </AppLayout>
    );
}

