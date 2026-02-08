import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, MessageSquare, Calendar, Building2, Users, Zap, DollarSign, BarChart3, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarSeparator,
    SidebarGroupLabel,
} from '@/components/ui/sidebar';
import {
    dashboard,
    conversations,
    bookings,
    rooms,
    guests,
    storefront,
    promotions,
    analytics,
    settings
} from '@/routes';
import type { NavItem } from '@/types';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { url } = usePage();
    const userRole = 'owner'; // In a real app, get this from usePage().props.auth.user.role
    const hotelName = 'The Grand Plaza Hotel'
    const unreadChats = 3
    const unreadNotifications = 2

    const navigationItems = [
        {
            label: 'Main',
            items: [
                { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, url: dashboard.url() },
                { id: 'conversations', label: 'Conversations', icon: MessageSquare, badge: unreadChats, url: conversations.url() },
            ],
        },
        {
            label: 'Management',
            items: [
                { id: 'bookings', label: 'Bookings', icon: Calendar, url: bookings.url() },
                { id: 'rooms', label: 'Rooms', icon: Building2, url: rooms.url() },
                { id: 'guests', label: 'Guests', icon: Users, url: guests.url() },
            ],
        },
        {
            label: 'Business',
            items: [
                { id: 'storefront', label: 'Storefront', icon: Zap, ownerOnly: true, url: storefront.url() },
                { id: 'promotions', label: 'Promotions', icon: DollarSign, url: promotions.url() },
                { id: 'analytics', label: 'Analytics', icon: BarChart3, ownerOnly: true, url: analytics.url() },
            ],
        },
        {
            label: 'System',
            items: [{ id: 'settings', label: 'Settings', icon: Settings, url: settings.url() }],
        },
    ]

    const filteredNavigation = navigationItems.map((group) => ({
        ...group,
        items: group.items.filter((item: any) => !item.ownerOnly || userRole === 'owner'),
    }))

    return (
        <Sidebar className="border-r border-border bg-sidebar">
            <SidebarContent className="pt-6">
                {/* Hotel Name */}
                <div className="px-4 pb-6">
                    <h1 className="text-lg font-bold text-sidebar-foreground truncate">
                        {hotelName}
                    </h1>
                    <p className="text-xs text-sidebar-foreground/60 mt-1">
                        Hotel Management System
                    </p>
                </div>

                <SidebarSeparator />

                {/* Navigation */}
                {filteredNavigation.map((group) => (
                    <div key={group.label} className="py-4">
                        <SidebarGroupLabel className="px-4 py-2 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider">
                            {group.label}
                        </SidebarGroupLabel>
                        <SidebarMenu className="gap-1 px-2">
                            {group.items.map((item: any) => {
                                const isActive = url === item.url || url.startsWith(item.url + '/');
                                return (
                                    <SidebarMenuItem key={item.id}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            className="cursor-pointer hover:bg-sidebar-accent/50"
                                        >
                                            <Link href={item.url}>
                                                <item.icon className="h-5 w-5" />
                                                <span className="flex-1">{item.label}</span>
                                                {item.badge && (
                                                    <Badge
                                                        variant="destructive"
                                                        className="ml-auto h-5 w-5 flex items-center justify-center p-0 text-xs"
                                                    >
                                                        {item.badge}
                                                    </Badge>
                                                )}
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </div>
                ))}
            </SidebarContent>

            <SidebarRail />
        </Sidebar>
    );
}
