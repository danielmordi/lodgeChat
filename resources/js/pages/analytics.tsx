import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card } from '@/components/ui/card';
import { dashboard, analytics } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { BarChart, LineChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard.url() },
    { title: 'Analytics', href: analytics.url() },
];

export default function Analytics() {
    const monthlyData = [
        { month: 'Jan', bookings: 12, revenue: 8400, guests: 34 },
        { month: 'Feb', bookings: 18, revenue: 12100, guests: 52 },
        { month: 'Mar', bookings: 15, revenue: 9800, guests: 41 },
        { month: 'Apr', bookings: 22, revenue: 15200, guests: 68 },
        { month: 'May', bookings: 28, revenue: 19800, guests: 92 },
        { month: 'Jun', bookings: 32, revenue: 22400, guests: 105 },
    ];

    const roomTypeData = [
        { name: 'Single', value: 24, revenue: 4800 },
        { name: 'Double', value: 42, revenue: 9800 },
        { name: 'Suite', value: 18, revenue: 7200 },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Analytics" />
            <div className="space-y-6 p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-6 border-border">
                        <h3 className="text-sm font-medium text-muted-foreground">Total Revenue</h3>
                        <p className="text-3xl font-bold text-foreground mt-2">$67,400</p>
                        <p className="text-xs text-green-600 mt-1">+12% from last month</p>
                    </Card>
                    <Card className="p-6 border-border">
                        <h3 className="text-sm font-medium text-muted-foreground">Total Bookings</h3>
                        <p className="text-3xl font-bold text-foreground mt-2">127</p>
                        <p className="text-xs text-green-600 mt-1">+8% from last month</p>
                    </Card>
                    <Card className="p-6 border-border">
                        <h3 className="text-sm font-medium text-muted-foreground">Average Rating</h3>
                        <p className="text-3xl font-bold text-foreground mt-2">4.8</p>
                        <p className="text-xs text-green-600 mt-1">From 125 reviews</p>
                    </Card>
                </div>

                {/* Charts */}
                <Card className="p-6 border-border">
                    <h3 className="font-bold text-foreground mb-4">Monthly Performance</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                            <YAxis stroke="hsl(var(--muted-foreground))" />
                            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                            <Legend />
                            <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" name="Revenue ($100s)" strokeWidth={2} />
                            <Line type="monotone" dataKey="bookings" stroke="hsl(var(--secondary))" name="Bookings" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>

                <Card className="p-6 border-border">
                    <h3 className="font-bold text-foreground mb-4">Revenue by Room Type</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={roomTypeData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                            <YAxis stroke="hsl(var(--muted-foreground))" />
                            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                            <Legend />
                            <Bar dataKey="revenue" fill="hsl(var(--accent))" name="Revenue ($)" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </div>
        </AppLayout>
    );
}

