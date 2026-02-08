import { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
    ChevronDown,
    Plus,
    Eye,
    Calendar,
    User,
    MessageSquare,
    Filter,
} from 'lucide-react';
import { dashboard, bookings } from '@/routes';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard.url() },
    { title: 'Bookings', href: bookings.url() },
];

interface Booking {
    id: string;
    guestName: string;
    room: string;
    checkIn: string;
    checkOut: string;
    status: 'pending' | 'held' | 'confirmed' | 'cancelled';
    nights: number;
    total: number;
    phone: string;
}

const mockBookings: Booking[] = [
    {
        id: '1',
        guestName: 'Sarah Johnson',
        room: '305',
        checkIn: '2024-02-08',
        checkOut: '2024-02-10',
        status: 'confirmed',
        nights: 2,
        total: 450,
        phone: '+1 (555) 123-4567',
    },
    {
        id: '2',
        guestName: 'Michael Chen',
        room: '201',
        checkIn: '2024-02-07',
        checkOut: '2024-02-09',
        status: 'confirmed',
        nights: 2,
        total: 380,
        phone: '+1 (555) 234-5678',
    },
    {
        id: '3',
        guestName: 'David Martinez',
        room: '502',
        checkIn: '2024-02-09',
        checkOut: '2024-02-11',
        status: 'pending',
        nights: 2,
        total: 520,
        phone: '+1 (555) 345-6789',
    },
    {
        id: '4',
        guestName: 'Lisa Anderson',
        room: '101',
        checkIn: '2024-02-15',
        checkOut: '2024-02-18',
        status: 'held',
        nights: 3,
        total: 675,
        phone: '+1 (555) 456-7890',
    },
    {
        id: '5',
        guestName: 'James Wilson',
        room: '401',
        checkIn: '2024-02-12',
        checkOut: '2024-02-14',
        status: 'cancelled',
        nights: 2,
        total: 420,
        phone: '+1 (555) 567-8901',
    },
];

export default function Bookings() {
    const [filter, setFilter] = useState<string | null>(null);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

    const filteredBookings = filter
        ? mockBookings.filter((b) => b.status === filter)
        : mockBookings;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-50 text-green-700 border-green-200';
            case 'pending':
                return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'held':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'cancelled':
                return 'bg-red-50 text-red-700 border-red-200';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Bookings" />
            <div className="space-y-4 p-4">
                {/* Filters */}
                <div className="flex gap-2 flex-wrap">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                className="gap-2 bg-transparent"
                            >
                                <Filter className="h-4 w-4" />
                                Filter by Status
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => setFilter(null)}>All Bookings</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilter('pending')}>Pending</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilter('held')}>Held</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilter('confirmed')}>Confirmed</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilter('cancelled')}>Cancelled</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button className="gap-2 bg-primary hover:bg-primary/90">
                        <Plus className="h-4 w-4" />
                        New Booking
                    </Button>
                </div>

                {/* Bookings Table */}
                <Card className="border-border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-secondary/5 border-b border-border">
                                <tr>
                                    <th className="text-left px-4 py-3 font-semibold text-foreground">Guest</th>
                                    <th className="text-left px-4 py-3 font-semibold text-foreground">Room</th>
                                    <th className="text-left px-4 py-3 font-semibold text-foreground">Check-in</th>
                                    <th className="text-left px-4 py-3 font-semibold text-foreground">Check-out</th>
                                    <th className="text-left px-4 py-3 font-semibold text-foreground">Total</th>
                                    <th className="text-left px-4 py-3 font-semibold text-foreground">Status</th>
                                    <th className="text-left px-4 py-3 font-semibold text-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBookings.map((booking) => (
                                    <tr
                                        key={booking.id}
                                        className="border-b border-border/50 hover:bg-secondary/5 cursor-pointer transition-colors"
                                    >
                                        <td className="px-4 py-3">
                                            <div>
                                                <p className="font-medium text-foreground">{booking.guestName}</p>
                                                <p className="text-xs text-muted-foreground">{booking.phone}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-foreground font-medium">{booking.room}</td>
                                        <td className="px-4 py-3 text-muted-foreground">{booking.checkIn}</td>
                                        <td className="px-4 py-3 text-muted-foreground">{booking.checkOut}</td>
                                        <td className="px-4 py-3 text-foreground font-medium">${booking.total}</td>
                                        <td className="px-4 py-3">
                                            <Badge variant="outline" className={getStatusColor(booking.status)}>
                                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Sheet open={selectedBooking?.id === booking.id} onOpenChange={(open) => {
                                                if (!open) setSelectedBooking(null);
                                            }}>
                                                <SheetTrigger asChild onClick={() => setSelectedBooking(booking)}>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="gap-1"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                        View
                                                    </Button>
                                                </SheetTrigger>
                                                {selectedBooking?.id === booking.id && (
                                                    <SheetContent className="w-full md:w-96 bg-card border-border">
                                                        <SheetHeader>
                                                            <SheetTitle className="text-foreground">Booking Details</SheetTitle>
                                                        </SheetHeader>
                                                        <div className="mt-6 space-y-4">
                                                            <div>
                                                                <label className="text-xs font-semibold text-muted-foreground">GUEST NAME</label>
                                                                <p className="text-foreground mt-1">{selectedBooking.guestName}</p>
                                                            </div>
                                                            <div>
                                                                <label className="text-xs font-semibold text-muted-foreground">PHONE</label>
                                                                <p className="text-foreground mt-1">{selectedBooking.phone}</p>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                    <label className="text-xs font-semibold text-muted-foreground">CHECK-IN</label>
                                                                    <p className="text-foreground mt-1">{selectedBooking.checkIn}</p>
                                                                </div>
                                                                <div>
                                                                    <label className="text-xs font-semibold text-muted-foreground">CHECK-OUT</label>
                                                                    <p className="text-foreground mt-1">{selectedBooking.checkOut}</p>
                                                                </div>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                    <label className="text-xs font-semibold text-muted-foreground">ROOM</label>
                                                                    <p className="text-foreground mt-1">{selectedBooking.room}</p>
                                                                </div>
                                                                <div>
                                                                    <label className="text-xs font-semibold text-muted-foreground">NIGHTS</label>
                                                                    <p className="text-foreground mt-1">{selectedBooking.nights}</p>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <label className="text-xs font-semibold text-muted-foreground">TOTAL</label>
                                                                <p className="text-lg font-bold text-foreground mt-1">${selectedBooking.total}</p>
                                                            </div>
                                                            <div className="pt-4 space-y-2">
                                                                <Button className="w-full gap-2 bg-primary hover:bg-primary/90">
                                                                    <MessageSquare className="h-4 w-4" />
                                                                    Contact via WhatsApp
                                                                </Button>
                                                                <Button variant="outline" className="w-full bg-transparent">
                                                                    Edit Booking
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </SheetContent>
                                                )}
                                            </Sheet>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}

