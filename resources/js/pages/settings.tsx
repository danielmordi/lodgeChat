import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Bell, Lock, Eye, Database } from 'lucide-react';
import { dashboard, settings } from '@/routes';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard.url() },
    { title: 'Settings', href: settings.url() },
];

export default function Settings() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Settings" />
            <div className="space-y-6 max-w-2xl p-4">
                <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">Settings</h2>
                    <p className="text-muted-foreground">Manage your hotel and account preferences</p>
                </div>

                {/* Hotel Settings */}
                <Card className="p-6 border-border">
                    <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                        <Eye className="h-5 w-5" />
                        Hotel Information
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-foreground">Hotel Name</label>
                            <p className="text-muted-foreground mt-1">The Grand Plaza Hotel</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-foreground">Location</label>
                            <p className="text-muted-foreground mt-1">123 Main Street, City, State 12345</p>
                        </div>
                        <Button variant="outline" className="w-full bg-transparent">
                            Edit Hotel Details
                        </Button>
                    </div>
                </Card>

                <Separator />

                {/* Notifications */}
                <Card className="p-6 border-border">
                    <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Notifications
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-foreground">New Bookings</label>
                            <input type="checkbox" defaultChecked className="h-4 w-4" />
                        </div>
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-foreground">New Messages</label>
                            <input type="checkbox" defaultChecked className="h-4 w-4" />
                        </div>
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-foreground">Guest Check-in</label>
                            <input type="checkbox" defaultChecked className="h-4 w-4" />
                        </div>
                    </div>
                </Card>

                <Separator />

                {/* Security */}
                <Card className="p-6 border-border">
                    <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                        <Lock className="h-5 w-5" />
                        Security
                    </h3>
                    <div className="space-y-3">
                        <Button variant="outline" className="w-full bg-transparent">
                            Change Password
                        </Button>
                        <Button variant="outline" className="w-full bg-transparent">
                            Two-Factor Authentication
                        </Button>
                    </div>
                </Card>

                <Separator />

                {/* Data */}
                <Card className="p-6 border-border">
                    <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                        <Database className="h-5 w-5" />
                        Data Management
                    </h3>
                    <div className="space-y-3">
                        <Button variant="outline" className="w-full bg-transparent">
                            Export Data
                        </Button>
                        <Button variant="outline" className="w-full text-destructive bg-transparent">
                            Delete Account
                        </Button>
                    </div>
                </Card>
            </div>
        </AppLayout>
    )
}

