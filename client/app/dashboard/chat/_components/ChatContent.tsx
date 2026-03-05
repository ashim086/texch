"use client";

import { useState, useRef, useEffect } from "react";
import {
    Send,
    Paperclip,
    MoreVertical,
    Phone,
    Video,
    Search,
    ArrowLeft,
    Check,
    CheckCheck,
    Image,
    Smile,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
    dummyConversations,
    dummyChatMessages,
    ChatConversation,
    ChatMessage,
    formatTime,
} from "@/lib/dummyData";

export function ChatContent() {
    const { user } = useAuth();
    const [selectedConversation, setSelectedConversation] = useState<string | null>("conv-1");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(dummyChatMessages);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [mobileShowChat, setMobileShowChat] = useState(false);

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
            senderId: user?.id || 1,
            senderName: user?.name || "You",
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
            <div className={`w-full md:w-80 border-r border-gray-100 flex flex-col ${mobileShowChat ? 'hidden md:flex' : 'flex'}`}>
                {/* Header */}
                <div className="p-4 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Messages</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                    </div>
                </div>

                {/* Conversations */}
                <div className="flex-1 overflow-y-auto">
                    {dummyConversations.map((conversation) => (
                        <ConversationItem
                            key={conversation.id}
                            conversation={conversation}
                            isActive={selectedConversation === conversation.id}
                            onClick={() => {
                                setSelectedConversation(conversation.id);
                                setMobileShowChat(true);
                            }}
                            currentUserId={user?.id || 1}
                        />
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className={`flex-1 flex flex-col ${mobileShowChat ? 'flex' : 'hidden md:flex'}`}>
                {activeConversation ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setMobileShowChat(false)}
                                    className="md:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100"
                                >
                                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                                </button>
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center text-white font-semibold">
                                        S
                                    </div>
                                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Support Team</h3>
                                    <p className="text-xs text-green-600">Online</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
                                    <Phone className="w-5 h-5" />
                                </button>
                                <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
                                    <Video className="w-5 h-5" />
                                </button>
                                <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
                                    <MoreVertical className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                            {activeMessages.map((msg) => (
                                <MessageBubble
                                    key={msg.id}
                                    message={msg}
                                    isOwn={msg.senderId === (user?.id || 1)}
                                />
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <div className="p-4 border-t border-gray-100 bg-white">
                            <div className="flex items-end gap-3">
                                <div className="flex gap-1">
                                    <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
                                        <Paperclip className="w-5 h-5" />
                                    </button>
                                    <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
                                        <Image className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="flex-1 relative">
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Type a message..."
                                        rows={1}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    />
                                    <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-200 text-gray-400">
                                        <Smile className="w-5 h-5" />
                                    </button>
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
                            <p className="text-gray-500">Choose a conversation to start messaging</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

interface ConversationItemProps {
    conversation: ChatConversation;
    isActive: boolean;
    onClick: () => void;
    currentUserId: number;
}

function ConversationItem({ conversation, isActive, onClick, currentUserId }: ConversationItemProps) {
    const otherParticipant = conversation.participants.find((p) => p.id !== currentUserId) || conversation.participants[0];

    return (
        <div
            onClick={onClick}
            className={`p-4 cursor-pointer transition-colors ${isActive ? "bg-primary/5 border-l-2 border-primary" : "hover:bg-gray-50"
                }`}
        >
            <div className="flex items-start gap-3">
                <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center text-white font-semibold">
                        {otherParticipant.name.charAt(0)}
                    </div>
                    {conversation.unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs flex items-center justify-center rounded-full">
                            {conversation.unreadCount}
                        </span>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-900 truncate">{otherParticipant.name}</h4>
                        <span className="text-xs text-gray-400">{formatTime(conversation.lastMessageTime)}</span>
                    </div>
                    <p className={`text-sm truncate ${conversation.unreadCount > 0 ? "text-gray-900 font-medium" : "text-gray-500"}`}>
                        {conversation.lastMessage}
                    </p>
                </div>
            </div>
        </div>
    );
}

interface MessageBubbleProps {
    message: ChatMessage;
    isOwn: boolean;
}

function MessageBubble({ message, isOwn }: MessageBubbleProps) {
    return (
        <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[70%] ${isOwn ? "order-2" : ""}`}>
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
