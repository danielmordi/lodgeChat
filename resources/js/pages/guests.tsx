import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { dashboard, guests } from '@/routes';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard.url() },
    {
        title: 'Guests',
        href: guests.url(),
    },
];

export default function Guests() {
    const guests = [
        {
            name: 'Sarah Johnson',
            email: 'sarah@example.com',
            phone: '+1 (555) 123-4567',
            status: 'current',
            room: '305',
        },
        {
            name: 'Michael Chen',
            email: 'michael@example.com',
            phone: '+1 (555) 234-5678',
            status: 'current',
            room: '201',
        },
        {
            name: 'Emma Wilson',
            email: 'emma@example.com',
            phone: '+1 (555) 345-6789',
            status: 'past',
            room: '402',
        },
        {
            name: 'James Miller',
            email: 'james@example.com',
            phone: '+1 (555) 456-7890',
            status: 'upcoming',
            room: '102',
        },
    ]

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'current':
                return 'bg-blue-50 text-blue-700'
            case 'past':
                return 'bg-gray-50 text-gray-700'
            case 'upcoming':
                return 'bg-green-50 text-green-700'
            default:
                return 'bg-gray-50 text-gray-700'
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Guests" />
            <div className="space-y-4 p-4">
                <Card className="border-border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-secondary/5 border-b border-border">
                                <tr>
                                    <th className="text-left px-4 py-3 font-semibold text-foreground">Name</th>
                                    <th className="text-left px-4 py-3 font-semibold text-foreground">Email</th>
                                    <th className="text-left px-4 py-3 font-semibold text-foreground">Phone</th>
                                    <th className="text-left px-4 py-3 font-semibold text-foreground">Status</th>
                                    <th className="text-left px-4 py-3 font-semibold text-foreground">Room</th>
                                </tr>
                            </thead>
                            <tbody>
                                {guests.map((guest) => (
                                    <tr
                                        key={guest.name}
                                        className="border-b border-border/50 hover:bg-secondary/5 transition-colors"
                                    >
                                        <td className="px-4 py-3 font-medium text-foreground">{guest.name}</td>
                                        <td className="px-4 py-3 text-muted-foreground">{guest.email}</td>
                                        <td className="px-4 py-3 text-muted-foreground">{guest.phone}</td>
                                        <td className="px-4 py-3">
                                            <Badge className={getStatusColor(guest.status)}>
                                                {guest.status.charAt(0).toUpperCase() + guest.status.slice(1)}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 font-medium text-foreground">{guest.room}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </AppLayout>
    )
}

