import { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Send, Clock, Lock } from 'lucide-react';
import { dashboard, promotions } from '@/routes';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard.url() },
    { title: 'Promotions', href: promotions.url() },
];

export default function Promotions() {
    const [isOwner] = useState(true) // This would be determined by user role

    const campaigns = [
        {
            id: '1',
            name: 'Valentine\'s Special',
            sentDate: 'Feb 1, 2024',
            recipients: 150,
            clicks: 45,
        },
        {
            id: '2',
            name: 'Spring Break Offer',
            sentDate: 'Jan 15, 2024',
            recipients: 320,
            clicks: 89,
        },
        {
            id: '3',
            name: 'New Year Promo',
            sentDate: 'Dec 20, 2023',
            recipients: 280,
            clicks: 67,
        },
    ]

    if (!isOwner) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Promotions" />
                <div className="flex items-center justify-center min-h-[400px]">
                    <Card className="p-8 text-center border-border max-w-md">
                        <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-xl font-bold text-foreground mb-2">Promotions Restricted</h3>
                        <p className="text-muted-foreground">
                            Only hotel owners can create and manage promotions. Please contact your manager.
                        </p>
                    </Card>
                </div>
            </AppLayout>
        )
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Promotions" />
            <div className="space-y-6 p-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-foreground">Promotions</h2>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="gap-2 bg-primary hover:bg-primary/90">
                                <Plus className="h-4 w-4" />
                                Create Promotion
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-card border-border">
                            <DialogHeader>
                                <DialogTitle className="text-foreground">Create New Promotion</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-foreground">Target Audience</label>
                                    <div className="mt-2 p-3 bg-secondary/10 rounded-lg border border-border">
                                        <p className="text-sm text-muted-foreground">
                                            <Lock className="h-4 w-4 inline mr-2" />
                                            Past Guests Only
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-foreground">Message Template</label>
                                    <div className="mt-2 p-3 bg-secondary/10 rounded-lg border border-border text-sm text-muted-foreground">
                                        <p>Select a pre-designed template for your promotion...</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline">Preview</Button>
                                    <Button className="gap-2 bg-primary hover:bg-primary/90">
                                        <Send className="h-4 w-4" />
                                        Send Campaign
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Past Campaigns */}
                <Card className="border-border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-secondary/5 border-b border-border">
                                <tr>
                                    <th className="text-left px-4 py-3 font-semibold text-foreground">Campaign</th>
                                    <th className="text-left px-4 py-3 font-semibold text-foreground">Sent Date</th>
                                    <th className="text-left px-4 py-3 font-semibold text-foreground">Recipients</th>
                                    <th className="text-left px-4 py-3 font-semibold text-foreground">Clicks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {campaigns.map((campaign) => (
                                    <tr
                                        key={campaign.id}
                                        className="border-b border-border/50 hover:bg-secondary/5 transition-colors"
                                    >
                                        <td className="px-4 py-3 font-medium text-foreground">{campaign.name}</td>
                                        <td className="px-4 py-3 text-muted-foreground">{campaign.sentDate}</td>
                                        <td className="px-4 py-3">
                                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                                {campaign.recipients}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                {campaign.clicks}
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
    )
}

