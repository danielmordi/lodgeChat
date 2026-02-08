import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bed, Wifi, Users } from 'lucide-react';
import { dashboard, rooms } from '@/routes';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard.url() },
    { title: 'Rooms', href: rooms.url() },
];

export default function Rooms() {
    const rooms = [
        { number: '101', type: 'Single', status: 'available', amenities: ['WiFi', 'TV', 'AC'] },
        { number: '102', type: 'Double', status: 'occupied', amenities: ['WiFi', 'TV', 'AC'] },
        { number: '201', type: 'Suite', status: 'occupied', amenities: ['WiFi', 'TV', 'AC', 'Jacuzzi'] },
        { number: '202', type: 'Double', status: 'maintenance', amenities: ['WiFi', 'TV'] },
        { number: '301', type: 'Single', status: 'available', amenities: ['WiFi', 'TV', 'AC'] },
        { number: '302', type: 'Double', status: 'available', amenities: ['WiFi', 'TV', 'AC', 'Balcony'] },
    ]

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'available':
                return 'bg-green-50 text-green-700'
            case 'occupied':
                return 'bg-blue-50 text-blue-700'
            case 'maintenance':
                return 'bg-yellow-50 text-yellow-700'
            default:
                return 'bg-gray-50 text-gray-700'
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Rooms" />
            <div className="space-y-4 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {rooms.map((room) => (
                        <Card key={room.number} className="p-4 border-border">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="text-lg font-bold text-foreground">Room {room.number}</h3>
                                    <p className="text-sm text-muted-foreground">{room.type}</p>
                                </div>
                                <Badge className={getStatusColor(room.status)}>
                                    {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                                </Badge>
                            </div>
                            <div className="flex gap-2">
                                {room.amenities.map((amenity) => (
                                    <Badge key={amenity} variant="outline" className="text-xs">
                                        {amenity}
                                    </Badge>
                                ))}
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    )
}

