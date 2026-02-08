import React from "react"
import { useState } from 'react'
import { Head } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
    Search,
    Send,
    Phone,
    MoreVertical,
    Bot,
    User as UserIcon,
    CheckCheck,
    X,
    Maximize2,
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { dashboard, conversations } from '@/routes';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard.url() },
    { title: 'Conversations', href: conversations.url() },
];

interface ChatMessage {
    id: string
    sender: 'guest' | 'bot' | 'staff'
    content: string
    timestamp: string
    read?: boolean
}

interface Chat {
    id: string
    guestName: string
    guestPhone: string
    status: 'bot' | 'human' | 'closed'
    lastMessage: string
    lastMessageTime: string
    unread: number
    messages: ChatMessage[]
    handledByBot: boolean
}

const mockChats: Chat[] = [
    {
        id: '1',
        guestName: 'Sarah Johnson',
        guestPhone: '+1 (555) 123-4567',
        status: 'bot' as const,
        lastMessage: 'What amenities do you have available?',
        lastMessageTime: '2 min ago',
        unread: 2,
        handledByBot: true,
        messages: [
            {
                id: 'm1',
                sender: 'guest',
                content: 'Hi, I have a reservation for tomorrow',
                timestamp: '10:30 AM',
            },
            {
                id: 'm2',
                sender: 'bot',
                content: 'Hello Sarah! Welcome to The Grand Plaza Hotel. I can help you with information about your reservation, amenities, or any questions.',
                timestamp: '10:31 AM',
                read: true,
            },
            {
                id: 'm3',
                sender: 'guest',
                content: 'What amenities do you have available?',
                timestamp: '10:35 AM',
            },
            {
                id: 'm4',
                sender: 'bot',
                content: 'We offer a wonderful range of amenities: 🏊 Swimming Pool, 🏋️ Fitness Center, 🍽️ Restaurant & Bar, 📶 Free WiFi, 🅿️ Parking.',
                timestamp: '10:36 AM',
                read: true,
            },
        ],
    },
    {
        id: '2',
        guestName: 'Michael Chen',
        guestPhone: '+1 (555) 234-5678',
        status: 'human' as const,
        lastMessage: 'I need to extend my stay by 2 nights',
        lastMessageTime: '5 min ago',
        unread: 1,
        handledByBot: false,
        messages: [
            {
                id: 'm5',
                sender: 'guest',
                content: 'Hello, I need to extend my stay by 2 nights',
                timestamp: '10:40 AM',
            },
            {
                id: 'm6',
                sender: 'staff',
                content: 'Hi Michael! I can definitely help with that. Let me check room availability for you.',
                timestamp: '10:42 AM',
                read: true,
            },
            {
                id: 'm7',
                sender: 'guest',
                content: 'Great, thank you!',
                timestamp: '10:43 AM',
            },
        ],
    },
    {
        id: '3',
        guestName: 'Emma Wilson',
        guestPhone: '+1 (555) 345-6789',
        status: 'closed' as const,
        lastMessage: 'Thank you for everything!',
        lastMessageTime: '1 hour ago',
        unread: 0,
        handledByBot: false,
        messages: [
            {
                id: 'm8',
                sender: 'guest',
                content: 'Checking out now, thank you for your excellent service!',
                timestamp: '9:15 AM',
            },
            {
                id: 'm9',
                sender: 'staff',
                content: 'Thank you for staying with us, Emma! We hope to see you again soon.',
                timestamp: '9:16 AM',
                read: true,
            },
        ],
    },
    {
        id: '4',
        guestName: 'James Miller',
        guestPhone: '+1 (555) 456-7890',
        status: 'bot' as const,
        lastMessage: 'Do you have parking available?',
        lastMessageTime: '15 min ago',
        unread: 0,
        handledByBot: true,
        messages: [
            {
                id: 'm10',
                sender: 'guest',
                content: 'Do you have parking available?',
                timestamp: '10:20 AM',
            },
            {
                id: 'm11',
                sender: 'bot',
                content: 'Yes! We offer complimentary valet parking and self-parking options.',
                timestamp: '10:21 AM',
                read: true,
            },
        ],
    },
]

export default function Conversations() {
    const [selectedChat, setSelectedChat] = useState<Chat | null>(mockChats[0])
    const [searchQuery, setSearchQuery] = useState('')
    const [messageInput, setMessageInput] = useState('')
    const [chats, setChats] = useState(mockChats)

    const filteredChats = chats.filter(
        (chat) =>
            chat.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            chat.guestPhone.includes(searchQuery)
    )

    const handleSendMessage = () => {
        if (!messageInput.trim() || !selectedChat) return

        const updatedChats = chats.map((chat) => {
            if (chat.id === selectedChat.id) {
                return {
                    ...chat,
                    messages: [
                        ...chat.messages,
                        {
                            id: `m${Date.now()}`,
                            sender: 'staff' as const,
                            content: messageInput,
                            timestamp: new Date().toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                            }),
                            read: true,
                        },
                    ],
                    lastMessage: messageInput,
                    lastMessageTime: 'now',
                }
            }
            return chat
        })

        setChats(updatedChats)
        const updated = updatedChats.find((c) => c.id === selectedChat.id)
        if (updated) setSelectedChat(updated)
        setMessageInput('')
    }

    const handleTakeOver = () => {
        if (!selectedChat) return

        const updatedChats = chats.map((chat) => {
            if (chat.id === selectedChat.id) {
                return {
                    ...chat,
                    status: 'human' as const,
                    handledByBot: false,
                }
            }
            return chat
        })

        setChats(updatedChats)
        const updated = updatedChats.find((c) => c.id === selectedChat.id)
        if (updated) setSelectedChat(updated)
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'bot':
                return 'bg-blue-100 text-blue-800'
            case 'human':
                return 'bg-green-100 text-green-800'
            case 'closed':
                return 'bg-gray-100 text-gray-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Conversations" />
            <div className="flex gap-6 h-[calc(100vh-8rem)] p-4">
                {/* Chat List */}
                <Card className="w-full md:w-80 flex flex-col border-border bg-card">
                    <div className="p-4 border-b border-border">
                        <div className="flex items-center gap-2 bg-input rounded-lg px-3 py-2">
                            <Search className="h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search conversations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="border-0 bg-transparent p-0 placeholder:text-muted-foreground focus-visible:ring-0"
                            />
                        </div>
                    </div>

                    <ScrollArea className="flex-1">
                        <div className="space-y-1 p-2">
                            {filteredChats.map((chat) => (
                                <button
                                    key={chat.id}
                                    onClick={() => setSelectedChat(chat)}
                                    className={`w-full text-left p-3 rounded-lg transition-colors ${selectedChat?.id === chat.id
                                        ? 'bg-primary/10 border-l-2 border-primary'
                                        : 'hover:bg-secondary/50'
                                        }`}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold text-sm text-foreground truncate">
                                                    {chat.guestName}
                                                </h3>
                                                <Badge
                                                    variant="outline"
                                                    className={`text-xs ${getStatusColor(chat.status)} border-0`}
                                                >
                                                    {chat.status === 'bot' && <Bot className="h-3 w-3 mr-1" />}
                                                    {chat.status === 'human' && <UserIcon className="h-3 w-3 mr-1" />}
                                                    {chat.status}
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">{chat.guestPhone}</p>
                                            <p className="text-sm text-foreground/80 truncate mt-2">{chat.lastMessage}</p>
                                            <p className="text-xs text-muted-foreground mt-1">{chat.lastMessageTime}</p>
                                        </div>
                                        {chat.unread > 0 && (
                                            <Badge
                                                variant="destructive"
                                                className="h-6 w-6 flex items-center justify-center p-0 text-xs"
                                            >
                                                {chat.unread}
                                            </Badge>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </ScrollArea>
                </Card>

                {/* Message Thread */}
                {selectedChat && (
                    <Card className="flex-1 hidden md:flex flex-col border-border bg-card">
                        {/* Chat Header */}
                        <div className="flex items-center justify-between p-4 border-b border-border">
                            <div>
                                <h2 className="font-bold text-foreground">{selectedChat.guestName}</h2>
                                <p className="text-sm text-muted-foreground">{selectedChat.guestPhone}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge
                                    variant="outline"
                                    className={`${getStatusColor(selectedChat.status)} border-0`}
                                >
                                    {selectedChat.status === 'bot' && <Bot className="h-3 w-3 mr-1" />}
                                    {selectedChat.status === 'human' && <UserIcon className="h-3 w-3 mr-1" />}
                                    {selectedChat.status}
                                </Badge>
                                <Button variant="ghost" size="icon">
                                    <Phone className="h-4 w-4" />
                                </Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>View Guest Details</DropdownMenuItem>
                                        <DropdownMenuItem>View Booking</DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive">Close Chat</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        {/* Messages */}
                        <ScrollArea className="flex-1 p-4">
                            <div className="space-y-4">
                                {selectedChat.messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex gap-3 ${message.sender === 'staff' ? 'justify-end' : 'justify-start'
                                            }`}
                                    >
                                        {message.sender === 'guest' && (
                                            <div className="h-8 w-8 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                                                <UserIcon className="h-4 w-4 text-secondary" />
                                            </div>
                                        )}
                                        {message.sender === 'bot' && (
                                            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                                                <Bot className="h-4 w-4 text-primary" />
                                            </div>
                                        )}

                                        <div
                                            className={`flex flex-col gap-1 max-w-xs ${message.sender === 'staff' ? 'items-end' : 'items-start'
                                                }`}
                                        >
                                            <div
                                                className={`px-4 py-2 rounded-lg ${message.sender === 'staff'
                                                    ? 'bg-primary text-primary-foreground rounded-br-none'
                                                    : 'bg-secondary/20 text-foreground rounded-bl-none'
                                                    }`}
                                            >
                                                <p className="text-sm">{message.content}</p>
                                            </div>
                                            <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                                        </div>

                                        {message.sender === 'staff' && (
                                            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                                                <span className="text-xs font-semibold text-primary">S</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>

                        {/* Take Over Button */}
                        {selectedChat.handledByBot && selectedChat.status === 'bot' && (
                            <div className="px-4 py-3 border-t border-border bg-secondary/5">
                                <Button
                                    onClick={handleTakeOver}
                                    className="w-full gap-2 bg-secondary hover:bg-secondary/90 text-white"
                                >
                                    <UserIcon className="h-4 w-4" />
                                    Take Over from Bot
                                </Button>
                            </div>
                        )}

                        {/* Message Input */}
                        <div className="p-4 border-t border-border bg-background">
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Type your message..."
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    className="flex-1 bg-input border-border"
                                />
                                <Button
                                    onClick={handleSendMessage}
                                    disabled={!messageInput.trim()}
                                    className="gap-2 bg-primary hover:bg-primary/90"
                                >
                                    <Send className="h-4 w-4" />
                                    <span className="hidden sm:inline">Send</span>
                                </Button>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Mobile Message View Placeholder */}
                <div className="flex-1 md:hidden flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                        <MessageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Select a conversation to view messages</p>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}

function MessageIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
    )
}

