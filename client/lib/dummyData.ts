// ─── Dummy Data for Chat (until real-time chat is implemented) ──────────────

// ─── Chat Data ────────────────────────────────────────────────────────────────

export interface ChatMessage {
    id: string;
    senderId: number;
    senderName: string;
    senderAvatar?: string;
    content: string;
    timestamp: string;
    isRead: boolean;
}

export interface ChatConversation {
    id: string;
    participants: { id: number; name: string; avatar?: string }[];
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
    bookingId?: string;
}

export const dummyConversations: ChatConversation[] = [
    {
        id: "conv-1",
        participants: [
            { id: 1, name: "John Doe", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John" },
            { id: 2, name: "Support Team", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Support" },
        ],
        lastMessage: "Your booking has been confirmed!",
        lastMessageTime: "2026-03-05T09:30:00Z",
        unreadCount: 2,
        bookingId: "booking-1",
    },
    {
        id: "conv-2",
        participants: [
            { id: 3, name: "Sarah Wilson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
            { id: 2, name: "Support Team", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Support" },
        ],
        lastMessage: "Can I reschedule my move?",
        lastMessageTime: "2026-03-05T08:15:00Z",
        unreadCount: 1,
        bookingId: "booking-2",
    },
    {
        id: "conv-3",
        participants: [
            { id: 4, name: "Mike Brown", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike" },
            { id: 2, name: "Support Team" },
        ],
        lastMessage: "Thanks for the quick service!",
        lastMessageTime: "2026-03-04T16:45:00Z",
        unreadCount: 0,
        bookingId: "booking-3",
    },
];

export const dummyChatMessages: Record<string, ChatMessage[]> = {
    "conv-1": [
        {
            id: "msg-1",
            senderId: 2,
            senderName: "Support Team",
            content: "Hello! How can I help you today?",
            timestamp: "2026-03-05T09:00:00Z",
            isRead: true,
        },
        {
            id: "msg-2",
            senderId: 1,
            senderName: "John Doe",
            content: "Hi! I wanted to confirm my booking for tomorrow.",
            timestamp: "2026-03-05T09:15:00Z",
            isRead: true,
        },
        {
            id: "msg-3",
            senderId: 2,
            senderName: "Support Team",
            content: "Your booking has been confirmed! Driver will arrive at 9 AM.",
            timestamp: "2026-03-05T09:30:00Z",
            isRead: false,
        },
    ],
    "conv-2": [
        {
            id: "msg-4",
            senderId: 3,
            senderName: "Sarah Wilson",
            content: "Can I reschedule my move?",
            timestamp: "2026-03-05T08:15:00Z",
            isRead: false,
        },
    ],
};

// ─── Helper Functions ─────────────────────────────────────────────────────────

export const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-AU", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

export const formatTime = (dateString: string): string => {
    return new Date(dateString).toLocaleTimeString("en-AU", {
        hour: "2-digit",
        minute: "2-digit",
    });
};
