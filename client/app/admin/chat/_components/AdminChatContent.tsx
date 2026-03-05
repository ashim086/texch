"use client";

import { useState, useRef, useEffect } from "react";
import {
    Send,
    Search,
    ArrowLeft,
    Check,
    CheckCheck,
    MoreVertical,
    Tag,
    Clock,
    User,
    Package,
} from "lucide-react";
import {
    dummyConversations,
    dummyChatMessages,
    ChatConversation,
    ChatMessage,
    formatTime,
    formatDate,
} from "@/lib/dummyData";

export function AdminChatContent() {
    const [selectedConversation, setSelectedConversation] = useState<string | null>("conv-1");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(dummyChatMessages);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [mobileShowChat, setMobileShowChat] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredConversations = dummyConversations.filter((conv) =>
        conv.participants.some((p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    const activeConversation = dummyConversations.find((c) => c.id === selectedConversation);
    const activeMessages = selectedConversation ? messages[selectedConversation] || [] : [];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [activeMessages]);

    const handleSendMessage = () => {
        if (!message.trim() || !selectedConversation) return;

        const newMessage: ChatMessage = {
            id: `msg-${Date.now()}`,
            senderId: 2, // Admin ID
            senderName: "Support Team",
            content: message.trim(),
            timestamp: new Date().toISOString(),
            isRead: false,
        };

        setMessages((prev) => ({
            ...prev,
            [selectedConversation]: [...(prev[selectedConversation] || []), newMessage],
        }));
        setMessage("");
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="h-[calc(100vh-8rem)] bg-white rounded-2xl border border-gray-100 overflow-hidden flex">
            {/* Conversations List */}
            <div className={`w-full md:w-96 border-r border-gray-100 flex flex-col ${mobileShowChat ? 'hidden md:flex' : 'flex'}`}>
                {/* Header */}
                <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-semibold text-gray-900">Customer Chats</h2>
                        <span className="px-2 py-1 bg-orange-100 text-orange-600 text-xs font-medium rounded-full">
                            3 unread
                        </span>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search customers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-100">
                    <button className="flex-1 py-3 text-sm font-medium text-primary border-b-2 border-primary">
                        All
                    </button>
                    <button className="flex-1 py-3 text-sm font-medium text-gray-500 hover:text-gray-900">
                        Unread
                    </button>
                    <button className="flex-1 py-3 text-sm font-medium text-gray-500 hover:text-gray-900">
                        Bookings
                    </button>
                </div>

                {/* Conversations */}
                <div className="flex-1 overflow-y-auto">
                    {filteredConversations.map((conversation) => (
                        <AdminConversationItem
                            key={conversation.id}
                            conversation={conversation}
                            isActive={selectedConversation === conversation.id}
                            onClick={() => {
                                setSelectedConversation(conversation.id);
                                setMobileShowChat(true);
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className={`flex-1 flex flex-col ${mobileShowChat ? 'flex' : 'hidden md:flex'}`}>
                {activeConversation ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setMobileShowChat(false)}
                                        className="md:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100"
                                    >
                                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                                    </button>
                                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-emerald-600 flex items-center justify-center text-white font-semibold">
                                        {activeConversation.participants[0].name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">
                                            {activeConversation.participants[0].name}
                                        </h3>
                                        <p className="text-xs text-gray-500">Customer</p>
                                    </div>
                                </div>
                                <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
                                    <MoreVertical className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Linked Booking Info */}
                            {activeConversation?.bookingId && (
                                <div className="mt-3 p-3 bg-primary/5 rounded-xl border border-primary/10">
                                    <div className="flex items-center gap-2 text-xs text-primary font-medium">
                                        <Package className="w-3.5 h-3.5" />
                                        Linked Booking #{activeConversation.bookingId.slice(0, 8)}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                            {activeMessages.map((msg) => (
                                <AdminMessageBubble
                                    key={msg.id}
                                    message={msg}
                                    isOwn={msg.senderId === 2}
                                />
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Replies */}
                        <div className="px-4 py-2 border-t border-gray-100 bg-white">
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {[
                                    "Thanks for reaching out!",
                                    "Your booking is confirmed",
                                    "Driver on the way",
                                    "How can I help?",
                                ].map((reply) => (
                                    <button
                                        key={reply}
                                        onClick={() => setMessage(reply)}
                                        className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-xs whitespace-nowrap hover:bg-gray-200"
                                    >
                                        {reply}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Message Input */}
                        <div className="p-4 border-t border-gray-100 bg-white">
                            <div className="flex items-end gap-3">
                                <div className="flex-1 relative">
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Type a message..."
                                        rows={1}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    />
                                </div>
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!message.trim()}
                                    className="p-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-center">
                        <div>
                            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                                <Send className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">Select a conversation</h3>
                            <p className="text-gray-500">Choose a customer to start messaging</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Customer Info Sidebar */}
            {activeConversation && (
                <div className="hidden xl:block w-72 border-l border-gray-100 p-4">
                    <h3 className="font-semibold text-gray-900 mb-4">Customer Info</h3>

                    <div className="text-center mb-6">
                        <div className="w-16 h-16 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                            {activeConversation.participants[0].name.charAt(0)}
                        </div>
                        <p className="font-medium text-gray-900">{activeConversation.participants[0].name}</p>
                        <p className="text-sm text-gray-500">Customer since Jan 2024</p>
                    </div>

                    <div className="space-y-4">
                        <div className="p-3 bg-gray-50 rounded-xl">
                            <p className="text-xs text-gray-500 mb-1">Total Bookings</p>
                            <p className="font-semibold text-gray-900">3</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-xl">
                            <p className="text-xs text-gray-500 mb-1">Total Spent</p>
                            <p className="font-semibold text-gray-900">A$1,230</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-xl">
                            <p className="text-xs text-gray-500 mb-1">Last Active</p>
                            <p className="font-semibold text-gray-900">Today, 9:30 AM</p>
                        </div>
                    </div>

                    <div className="mt-6">
                        <button className="w-full py-2 text-sm font-medium text-primary border border-primary rounded-xl hover:bg-primary/5">
                            View Full Profile
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

interface AdminConversationItemProps {
    conversation: ChatConversation;
    isActive: boolean;
    onClick: () => void;
}

function AdminConversationItem({ conversation, isActive, onClick }: AdminConversationItemProps) {
    const customer = conversation.participants[0];

    return (
        <div
            onClick={onClick}
            className={`p-4 cursor-pointer transition-colors border-b border-gray-50 ${isActive ? "bg-primary/5 border-l-2 border-l-primary" : "hover:bg-gray-50"
                }`}
        >
            <div className="flex items-start gap-3">
                <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary to-emerald-600 flex items-center justify-center text-white font-semibold">
                        {customer.name.charAt(0)}
                    </div>
                    {conversation.unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs flex items-center justify-center rounded-full font-medium">
                            {conversation.unreadCount}
                        </span>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-900 truncate">{customer.name}</h4>
                        <span className="text-xs text-gray-400">{formatTime(conversation.lastMessageTime)}</span>
                    </div>
                    <p className={`text-sm truncate ${conversation.unreadCount > 0 ? "text-gray-900 font-medium" : "text-gray-500"}`}>
                        {conversation.lastMessage}
                    </p>
                    {conversation.bookingId && (
                        <div className="flex items-center gap-1 mt-1">
                            <Tag className="w-3 h-3 text-blue-500" />
                            <span className="text-xs text-blue-500">Booking linked</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

interface AdminMessageBubbleProps {
    message: ChatMessage;
    isOwn: boolean;
}

function AdminMessageBubble({ message, isOwn }: AdminMessageBubbleProps) {
    return (
        <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
            <div className="max-w-[70%]">
                {!isOwn && (
                    <p className="text-xs text-gray-500 mb-1 ml-1">{message.senderName}</p>
                )}
                <div
                    className={`px-4 py-3 rounded-2xl ${isOwn
                        ? "bg-primary text-white rounded-br-md"
                        : "bg-white text-gray-900 rounded-bl-md border border-gray-100"
                        }`}
                >
                    <p className="text-sm">{message.content}</p>
                </div>
                <div className={`flex items-center gap-1 mt-1 ${isOwn ? "justify-end" : ""}`}>
                    <span className="text-xs text-gray-400">{formatTime(message.timestamp)}</span>
                    {isOwn && (
                        message.isRead ? (
                            <CheckCheck className="w-4 h-4 text-blue-500" />
                        ) : (
                            <Check className="w-4 h-4 text-gray-400" />
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
