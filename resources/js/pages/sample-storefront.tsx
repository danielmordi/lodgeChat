'use client'

import { useState, createContext, useContext } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
    Lock,
    ExternalLink,
} from 'lucide-react'

interface StorefrontConfig {
    hotelName: string
    logoUrl: string | null
    primaryColor: string
    theme: 'minimalist' | 'modern' | 'classic'
    amenities: string[]
    address: string
    whatsappNumber: string
    instagram: string
}

const StorefrontContext = createContext<{
    config: StorefrontConfig
    updateConfig: (key: keyof StorefrontConfig, value: any) => void
    userRole: 'owner' | 'staff'
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
    },
    updateConfig: () => { },
    userRole: 'owner',
})

function useStorefront() {
    return useContext(StorefrontContext)
}

const amenityOptions = [
    { id: 'wifi', label: 'Wi-Fi', icon: Wifi },
    { id: 'pool', label: 'Pool', icon: Waves },
    { id: 'gym', label: 'Gym', icon: Dumbbell },
    { id: 'restaurant', label: 'Restaurant', icon: UtensilsCrossed },
    { id: 'parking', label: 'Parking', icon: ParkingCircle },
    { id: 'pets', label: 'Pet Friendly', icon: PawPrint },
]

const themes = [
    {
        id: 'minimalist',
        name: 'Minimalist Boutique',
        description: 'Serif fonts, elegant white space',
        fontClass: 'font-serif',
        bgColor: 'bg-white',
    },
    {
        id: 'modern',
        name: 'Modern Resort',
        description: 'Bold sans-serif, vibrant actions',
        fontClass: 'font-sans',
        bgColor: 'bg-slate-900',
    },
    {
        id: 'classic',
        name: 'Classic Hospitality',
        description: 'Traditional layout, warm tones',
        fontClass: 'font-serif',
        bgColor: 'bg-amber-50',
    },
]

function MobilePreview() {
    const { config, userRole } = useStorefront()
    const theme = themes.find((t) => t.id === config.theme)!

    const themeStyles = {
        minimalist: {
            bg: 'bg-white',
            text: 'text-gray-900',
            accent: 'text-gray-700',
            button: 'bg-gray-900 text-white hover:bg-gray-800',
        },
        modern: {
            bg: 'bg-gradient-to-b from-slate-900 to-slate-800',
            text: 'text-white',
            accent: 'text-gray-300',
            button: 'bg-cyan-500 text-white hover:bg-cyan-600',
        },
        classic: {
            bg: 'bg-amber-50',
            text: 'text-amber-900',
            accent: 'text-amber-700',
            button: 'bg-amber-700 text-white hover:bg-amber-800',
        },
    }

    const styles = themeStyles[config.theme]

    return (
        <div className="flex flex-col items-center justify-center p-4">
            {/* Phone Frame */}
            <div className="relative w-full max-w-xs">
                {/* Phone Bezel */}
                <div className="bg-black rounded-3xl p-2 shadow-2xl">
                    <div className={`rounded-2xl overflow-hidden ${styles.bg}`}>
                        {/* Notch */}
                        <div className="h-6 bg-black flex items-center justify-center text-xs text-white">
                            <span>9:41</span>
                        </div>

                        {/* Content */}
                        <div className="h-96 overflow-y-auto flex flex-col">
                            {/* Hero */}
                            <div className={`${styles.bg} p-6 text-center flex-shrink-0`}>
                                {config.logoUrl ? (
                                    <div className="h-12 w-12 bg-white/20 rounded-lg mx-auto mb-3"></div>
                                ) : (
                                    <div className="h-12 w-12 bg-white/10 rounded-lg mx-auto mb-3"></div>
                                )}
                                <h1
                                    className={`text-xl font-bold ${styles.text} ${theme?.fontClass} truncate`}
                                >
                                    {config.hotelName}
                                </h1>
                                <p className={`text-xs ${styles.accent} mt-2`}>
                                    Premium Accommodation
                                </p>
                            </div>

                            {/* Amenities */}
                            <div className={`${styles.bg} px-6 py-4 flex-shrink-0`}>
                                <div className={`text-xs font-semibold ${styles.text} mb-3`}>
                                    Amenities
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    {config.amenities.map((amenityId) => {
                                        const amenity = amenityOptions.find(
                                            (a) => a.id === amenityId
                                        )
                                        if (!amenity) return null
                                        const Icon = amenity.icon
                                        return (
                                            <div
                                                key={amenityId}
                                                className={`flex flex-col items-center p-2 rounded ${styles.accent}/20`}
                                            >
                                                <Icon className={`h-5 w-5 ${styles.text} mb-1`} />
                                                <span className={`text-xs ${styles.accent}`}>
                                                    {amenity.label}
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className={`${styles.bg} px-6 py-4 flex-shrink-0`}>
                                <div className={`text-xs font-semibold ${styles.text} mb-2`}>
                                    Contact
                                </div>
                                <p className={`text-xs ${styles.accent} mb-2 truncate`}>
                                    📍 {config.address}
                                </p>
                                <p className={`text-xs ${styles.accent}`}>
                                    📱 {config.whatsappNumber}
                                </p>
                            </div>

                            {/* Spacer */}
                            <div className="flex-1"></div>
                        </div>

                        {/* Sticky Button */}
                        <div className={`${styles.bg} p-3 border-t border-white/10`}>
                            <button
                                className={`w-full py-2 px-4 rounded-lg ${styles.button} text-sm font-semibold transition-colors flex items-center justify-center gap-2`}
                            >
                                <MessageCircle className="h-4 w-4" />
                                Book via WhatsApp
                            </button>
                        </div>
                    </div>
                </div>

                {/* Phone Home Indicator */}
                <div className="h-1 bg-black rounded-full mx-auto mt-1 w-24"></div>
            </div>
        </div>
    )
}

function BrandingStep() {
    const { config, updateConfig, userRole } = useStorefront()
    const isDisabled = userRole === 'staff'

    const colors = ['#195E7E', '#00A3CC', '#2D8F8F', '#E67E22']
    const [showCustomColor, setShowCustomColor] = useState(false)

    return (
        <div className="space-y-6">
            <div>
                <Label className="text-base font-semibold">Hotel Name</Label>
                <Input
                    value={config.hotelName}
                    onChange={(e) => updateConfig('hotelName', e.target.value)}
                    disabled={isDisabled}
                    placeholder="Enter hotel name"
                    className="mt-2"
                />
            </div>

            <div>
                <Label className="text-base font-semibold">Logo</Label>
                <div
                    className={`mt-2 h-32 bg-secondary/10 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-border ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-secondary/20'
                        }`}
                >
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                        {isDisabled ? 'View only' : 'Upload logo (PNG/JPG)'}
                    </p>
                </div>
            </div>

            <div>
                <Label className="text-base font-semibold mb-3 block">Primary Brand Color</Label>
                <div className="space-y-3">
                    {/* Preset Colors */}
                    <div className="flex gap-3 flex-wrap">
                        {colors.map((color) => (
                            <button
                                key={color}
                                onClick={() => !isDisabled && updateConfig('primaryColor', color)}
                                disabled={isDisabled}
                                className={`h-12 w-12 rounded-lg transition-all ${config.primaryColor === color
                                        ? 'ring-2 ring-offset-2 ring-primary'
                                        : 'hover:ring-2 hover:ring-offset-2 hover:ring-primary/50'
                                    } ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                style={{ backgroundColor: color }}
                                title={color}
                            />
                        ))}

                        {/* Custom Color Button */}
                        {!isDisabled && (
                            <button
                                onClick={() => setShowCustomColor(!showCustomColor)}
                                className={`h-12 w-12 rounded-lg border-2 border-dashed flex items-center justify-center transition-all ${showCustomColor
                                        ? 'border-primary bg-primary/10'
                                        : 'border-border hover:border-primary/50'
                                    }`}
                            >
                                <span className="text-lg">+</span>
                            </button>
                        )}
                    </div>

                    {/* Custom Color Picker */}
                    {showCustomColor && !isDisabled && (
                        <div className="flex items-center gap-3 p-3 bg-secondary/5 rounded-lg border border-border">
                            <input
                                type="color"
                                value={config.primaryColor}
                                onChange={(e) => updateConfig('primaryColor', e.target.value)}
                                className="h-10 w-10 rounded cursor-pointer"
                            />
                            <div className="flex-1">
                                <Input
                                    type="text"
                                    value={config.primaryColor}
                                    onChange={(e) => {
                                        const value = e.target.value
                                        if (/^#[0-9A-F]{6}$/i.test(value) || value === '') {
                                            updateConfig('primaryColor', value)
                                        }
                                    }}
                                    placeholder="#000000"
                                    className="font-mono text-sm"
                                />
                            </div>
                            <p className="text-xs text-muted-foreground whitespace-nowrap">
                                Hex code
                            </p>
                        </div>
                    )}

                    {/* Current Color Display */}
                    <div className="flex items-center gap-2">
                        <div
                            className="h-10 w-10 rounded-lg border-2 border-border"
                            style={{ backgroundColor: config.primaryColor }}
                        />
                        <span className="text-sm text-muted-foreground font-mono">
                            Current: {config.primaryColor}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ThemeStep() {
    const { config, updateConfig, userRole } = useStorefront()
    const isDisabled = userRole === 'staff'

    return (
        <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
                Choose a design theme for your storefront
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {themes.map((theme) => (
                    <Card
                        key={theme.id}
                        onClick={() => !isDisabled && updateConfig('theme', theme.id)}
                        className={`p-4 cursor-pointer transition-all ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                            } ${config.theme === theme.id
                                ? 'border-primary border-2 ring-2 ring-primary/20'
                                : 'border-border hover:border-primary/50'
                            }`}
                    >
                        <div
                            className={`h-24 ${theme.bgColor} rounded-lg mb-3 flex items-center justify-center`}
                        >
                            <div
                                className={`text-center ${theme.fontClass}`}
                            >
                                <div className="text-sm font-bold text-gray-700">Preview</div>
                            </div>
                        </div>
                        <h4 className="font-semibold text-foreground">{theme.name}</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                            {theme.description}
                        </p>
                    </Card>
                ))}
            </div>
        </div>
    )
}

function AmenitiesStep() {
    const { config, updateConfig, userRole } = useStorefront()
    const isDisabled = userRole === 'staff'

    const toggleAmenity = (amenityId: string) => {
        if (isDisabled) return
        const updated = config.amenities.includes(amenityId)
            ? config.amenities.filter((a) => a !== amenityId)
            : [...config.amenities, amenityId]
        updateConfig('amenities', updated)
    }

    return (
        <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
                Select amenities to highlight on your storefront
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {amenityOptions.map((amenity) => {
                    const Icon = amenity.icon
                    const isSelected = config.amenities.includes(amenity.id)
                    return (
                        <button
                            key={amenity.id}
                            onClick={() => toggleAmenity(amenity.id)}
                            disabled={isDisabled}
                            className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                } ${isSelected
                                    ? 'border-primary bg-primary/10'
                                    : 'border-border hover:border-primary/50'
                                }`}
                        >
                            <Icon className="h-6 w-6" />
                            <span className="text-xs font-medium text-center">{amenity.label}</span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

function ContactStep() {
    const { config, updateConfig, userRole } = useStorefront()
    const isDisabled = userRole === 'staff'

    return (
        <div className="space-y-4">
            <div>
                <Label className="text-base font-semibold">Address</Label>
                <Input
                    value={config.address}
                    onChange={(e) => updateConfig('address', e.target.value)}
                    disabled={isDisabled}
                    placeholder="Hotel address"
                    className="mt-2"
                />
            </div>

            <div>
                <Label className="text-base font-semibold">WhatsApp Number</Label>
                <Input
                    value={config.whatsappNumber}
                    onChange={(e) => updateConfig('whatsappNumber', e.target.value)}
                    disabled={isDisabled}
                    placeholder="+1-555-0000"
                    className="mt-2"
                />
            </div>

            <div>
                <Label className="text-base font-semibold">Instagram Handle</Label>
                <Input
                    value={config.instagram}
                    onChange={(e) => updateConfig('instagram', e.target.value)}
                    disabled={isDisabled}
                    placeholder="@yourhotel"
                    className="mt-2"
                />
            </div>
        </div>
    )
}

export function Storefront({ userRole = 'owner' }: { userRole: 'owner' | 'staff' }) {
    const [currentStep, setCurrentStep] = useState<'branding' | 'theme' | 'amenities' | 'contact'>(
        'branding'
    )
    const [config, setConfig] = useState<StorefrontConfig>({
        hotelName: 'The Grand Plaza Hotel',
        logoUrl: null,
        primaryColor: '#195E7E',
        theme: 'modern',
        amenities: ['wifi', 'restaurant', 'pool'],
        address: '123 Ocean Avenue, Beach City',
        whatsappNumber: '+1-555-0123',
        instagram: '@grandplazahotel',
    })
    const [lastPublished] = useState<string>('2 hours ago')

    const updateConfig = (key: keyof StorefrontConfig, value: any) => {
        setConfig((prev) => ({ ...prev, [key]: value }))
    }

    const steps = [
        { id: 'branding' as const, label: 'Branding' },
        { id: 'theme' as const, label: 'Theme' },
        { id: 'amenities' as const, label: 'Amenities' },
        { id: 'contact' as const, label: 'Contact' },
    ]

    const currentStepIndex = steps.findIndex((s) => s.id === currentStep)
    const isLastStep = currentStepIndex === steps.length - 1

    return (
        <StorefrontContext.Provider
            value={{ config, updateConfig, userRole }}
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                {/* Configuration Panel */}
                <div className="lg:col-span-2 flex flex-col">
                    {/* Step Tabs */}
                    <Tabs
                        value={currentStep}
                        onValueChange={(value) =>
                            setCurrentStep(value as 'branding' | 'theme' | 'amenities' | 'contact')
                        }
                        className="w-full"
                    >
                        <TabsList className="grid w-full grid-cols-4 mb-6">
                            {steps.map((step, index) => (
                                <TabsTrigger
                                    key={step.id}
                                    value={step.id}
                                    disabled={userRole === 'staff'}
                                >
                                    <span className="text-xs sm:text-sm">{step.label}</span>
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        <Card className="flex-1 p-6 mb-6 overflow-y-auto">
                            <TabsContent value="branding" className="mt-0">
                                <BrandingStep />
                            </TabsContent>
                            <TabsContent value="theme" className="mt-0">
                                <ThemeStep />
                            </TabsContent>
                            <TabsContent value="amenities" className="mt-0">
                                <AmenitiesStep />
                            </TabsContent>
                            <TabsContent value="contact" className="mt-0">
                                <ContactStep />
                            </TabsContent>
                        </Card>
                    </Tabs>

                    {/* Navigation Buttons */}
                    <div className="flex gap-3 justify-between">
                        <Button
                            variant="outline"
                            onClick={() => {
                                const newIndex = Math.max(0, currentStepIndex - 1)
                                setCurrentStep(steps[newIndex].id)
                            }}
                            disabled={currentStepIndex === 0 || userRole === 'staff'}
                        >
                            Previous
                        </Button>

                        <div className="flex gap-2">
                            {userRole === 'owner' ? (
                                <>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            // Save without publishing
                                        }}
                                    >
                                        Save Draft
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            // Publish changes
                                        }}
                                        disabled={isLastStep === false}
                                        className="bg-primary hover:bg-primary/90"
                                    >
                                        Publish Changes
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    variant="outline"
                                    className="gap-2 bg-transparent"
                                    asChild
                                >
                                    <a href="#" target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="h-4 w-4" />
                                        View Live Storefront
                                    </a>
                                </Button>
                            )}
                        </div>

                        <Button
                            onClick={() => {
                                const newIndex = Math.min(steps.length - 1, currentStepIndex + 1)
                                setCurrentStep(steps[newIndex].id)
                            }}
                            disabled={isLastStep || userRole === 'staff'}
                            className="bg-primary hover:bg-primary/90"
                        >
                            Next
                        </Button>
                    </div>

                    {/* Last Published Info */}
                    {userRole === 'owner' && (
                        <div className="mt-4 text-xs text-muted-foreground text-center">
                            Last published: {lastPublished}
                        </div>
                    )}
                </div>

                {/* Mobile Preview Panel */}
                <div className="hidden lg:flex flex-col">
                    <Card className="flex-1 p-4 bg-secondary/5 flex items-center justify-center">
                        <div className="sticky top-4">
                            <p className="text-xs text-muted-foreground text-center mb-4">
                                Mobile Preview
                            </p>
                            <MobilePreview />
                        </div>
                    </Card>
                </div>
            </div>
        </StorefrontContext.Provider>
    )
}
