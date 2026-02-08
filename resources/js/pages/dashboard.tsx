import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { DollarSign, BarChart3, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from "@/components/ui/badge"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    const metrics = [
        {
            label: 'Active WhatsApp Chats',
            value: '24',
            icon: BarChart3,
            change: '+12%',
            color: 'text-primary',
        },
        {
            label: 'Pending Bookings',
            value: '8',
            icon: Users,
            change: '+3',
            color: 'text-secondary',
        },
        {
            label: 'Confirmed Bookings',
            value: '42',
            icon: Users,
            change: '+5 today',
            color: 'text-accent',
        },
        {
            label: 'Total Revenue',
            value: '$12,450',
            icon: DollarSign,
            change: '+8% this week',
            color: 'text-green-600',
        },
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="space-y-6 flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {metrics.map((metric) => (
                        <Card key={metric.label} className="p-6 border-border">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                                    <h3 className="text-3xl font-bold text-foreground mt-2">{metric.value}</h3>
                                    <p className="text-xs text-muted-foreground mt-2">{metric.change}</p>
                                </div>
                                <metric.icon className={`h-10 w-10 ${metric.color} opacity-50`} />
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Status Widget */}
                <Card className="p-6 border-border">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-foreground">WhatsApp Status</h3>
                            <p className="text-sm text-muted-foreground mt-1">Integration status</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-green-500"></div>
                            <Badge className="bg-green-100 text-green-800 border-0">Connected</Badge>
                        </div>
                    </div>
                </Card>

                {/* Recent Bookings */}
                <Card className="p-6 border-border">
                    <h3 className="font-bold text-foreground mb-4">Recent Bookings</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left py-2 font-semibold text-foreground">Guest Name</th>
                                    <th className="text-left py-2 font-semibold text-foreground">Room</th>
                                    <th className="text-left py-2 font-semibold text-foreground">Check-in</th>
                                    <th className="text-left py-2 font-semibold text-foreground">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    {
                                        name: 'Sarah Johnson',
                                        room: '305',
                                        checkin: 'Tomorrow',
                                        status: 'Confirmed',
                                    },
                                    {
                                        name: 'Michael Chen',
                                        room: '201',
                                        checkin: 'Today',
                                        status: 'Checked In',
                                    },
                                    {
                                        name: 'Emma Wilson',
                                        room: '402',
                                        checkin: 'Yesterday',
                                        status: 'Checked Out',
                                    },
                                ].map((booking) => (
                                    <tr key={booking.name} className="border-b border-border/50">
                                        <td className="py-3 text-foreground">{booking.name}</td>
                                        <td className="py-3 text-foreground">{booking.room}</td>
                                        <td className="py-3 text-muted-foreground">{booking.checkin}</td>
                                        <td className="py-3">
                                            <Badge
                                                variant="outline"
                                                className={`${booking.status === 'Confirmed'
                                                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                                                        : booking.status === 'Checked In'
                                                            ? 'bg-green-50 text-green-700 border-green-200'
                                                            : 'bg-gray-50 text-gray-700 border-gray-200'
                                                    }`}
                                            >
                                                {booking.status}
                                            </Badge>
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
