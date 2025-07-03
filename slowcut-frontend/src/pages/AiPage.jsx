import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Copy, Check, Loader2, Lightbulb } from 'lucide-react'

const AiPage = () => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'ai',
            content: 'Hello! I\'m your AI assistant. How can I help you today? You can ask me anything or try one of the suggestions below.',
            timestamp: new Date()
        }
    ])
    const [inputMessage, setInputMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [copiedMessageId, setCopiedMessageId] = useState(null)
    const [showPrePrompts, setShowPrePrompts] = useState(true)
    const messagesEndRef = useRef(null)
    const inputRef = useRef(null)

    // Pre-prompt suggestions
    const prePrompts = [
        {
            id: 1,
            title: "Movie Night",
            prompt: "What movie should I watch with my friends tonight?"
        },
        {
            id: 2,
            title: "Weekend Plans",
            prompt: "Give me some fun weekend activity suggestions"
        },
        {
            id: 3,
            title: "Happy Mood Movies",
            prompt: "My mood is happy, suggest me some uplifting movies"
        },
        {
            id: 4,
            title: "Sad Mood Movies",
            prompt: "My mood is sad, suggest me some comforting movies"
        },
        {
            id: 5,
            title: "Romantic Movies",
            prompt: "Recommend some romantic movies for a date night"
        },
        {
            id: 6,
            title: "Action Movies",
            prompt: "I'm in the mood for some intense action movies"
        },
        {
            id: 7,
            title: "Comedy Movies",
            prompt: "Suggest some funny comedy movies to watch"
        },
        {
            id: 8,
            title: "Horror Movies",
            prompt: "Recommend some scary horror movies for tonight"
        },
        {
            id: 9,
            title: "Sci-Fi Movies",
            prompt: "What are some good science fiction movies to watch?"
        },
        {
            id: 10,
            title: "Classic Movies",
            prompt: "Suggest some classic movies everyone should watch"
        },
        {
            id: 11,
            title: "TV Series",
            prompt: "Recommend some binge-worthy TV series"
        },
        {
            id: 12,
            title: "Documentary",
            prompt: "What are some interesting documentaries to watch?"
        },
        {
            id: 13,
            title: "Family Movies",
            prompt: "Suggest some family-friendly movies for all ages"
        },
        {
            id: 14,
            title: "Thriller Movies",
            prompt: "Recommend some suspenseful thriller movies"
        },
        {
            id: 15,
            title: "Animated Movies",
            prompt: "What are some great animated movies to watch?"
        }
    ]

    // Auto-scroll to bottom when new messages are added
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    // Focus input on component mount
    useEffect(() => {
        inputRef.current?.focus()
    }, [])

    const handleSendMessage = async (messageText = null) => {
        const textToSend = messageText || inputMessage.trim()
        if (!textToSend || isLoading) return

        const userMessage = {
            id: Date.now(),
            type: 'user',
            content: textToSend,
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMessage])
        setInputMessage('')
        setIsLoading(true)
        setShowPrePrompts(false) // Hide pre-prompts after first message

        try {
            const response = await fetch(`${apiBaseUrl}/ai/ask`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: textToSend
                })
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            
            const aiResponse = {
                id: Date.now() + 1,
                type: 'ai',
                content: data.reply || 'Sorry, I didn\'t receive a proper response.',
                timestamp: new Date()
            }

            setMessages(prev => [...prev, aiResponse])
        } catch (error) {
            console.error('Error sending message:', error)
            const errorMessage = {
                id: Date.now() + 1,
                type: 'ai',
                content: 'Sorry, I encountered an error connecting to the server. Please check if the server is running and try again.',
                timestamp: new Date()
            }
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    const handlePrePromptClick = (prompt) => {
        handleSendMessage(prompt)
    }

    const handleCopyMessage = async (messageId, content) => {
        try {
            await navigator.clipboard.writeText(content)
            setCopiedMessageId(messageId)
            setTimeout(() => setCopiedMessageId(null), 2000)
        } catch (error) {
            console.error('Failed to copy message:', error)
        }
    }

    const formatTimestamp = (timestamp) => {
        return timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        })
    }

    return (
        <div className="flex flex-col h-screen bg-gray-900 text-white">
            {/* Header */}
            <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <Bot size={20} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold text-white">AI Assistant</h1>
                        <p className="text-sm text-gray-400">Always here to help</p>
                    </div>
                </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 bg-gray-900">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex items-start space-x-3 ${
                            message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                        }`}
                    >
                        {/* Avatar */}
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                message.type === 'ai'
                                    ? 'bg-blue-500'
                                    : 'bg-green-500'
                            }`}
                        >
                            {message.type === 'ai' ? (
                                <Bot size={14} className="text-white" />
                            ) : (
                                <User size={14} className="text-white" />
                            )}
                        </div>

                        {/* Message Bubble */}
                        <div
                            className={`group relative max-w-3xl rounded-2xl px-4 py-3 ${
                                message.type === 'ai'
                                    ? 'bg-gray-800 border border-gray-700'
                                    : 'bg-green-600'
                            }`}
                        >
                            <div className="text-sm leading-relaxed whitespace-pre-wrap text-white">
                                {message.content}
                            </div>
                            
                            {/* Timestamp and Actions */}
                            <div className={`flex items-center mt-2 space-x-2 ${
                                message.type === 'user' ? 'justify-end' : 'justify-between'
                            }`}>
                                <span className="text-xs text-gray-400">
                                    {formatTimestamp(message.timestamp)}
                                </span>
                                
                                {message.type === 'ai' && (
                                    <button
                                        onClick={() => handleCopyMessage(message.id, message.content)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-white"
                                        title="Copy message"
                                    >
                                        {copiedMessageId === message.id ? (
                                            <Check size={12} className="text-green-400" />
                                        ) : (
                                            <Copy size={12} />
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Pre-prompts Section */}
                {showPrePrompts && (
                    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                        <div className="flex items-center space-x-2 mb-4">
                            <Lightbulb size={20} className="text-yellow-400" />
                            <h3 className="text-lg font-semibold text-white">Quick Suggestions</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {prePrompts.map((prePrompt) => (
                                <button
                                    key={prePrompt.id}
                                    onClick={() => handlePrePromptClick(prePrompt.prompt)}
                                    className="text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-lg border border-gray-600 hover:border-blue-500 transition-all duration-200 group"
                                    disabled={isLoading}
                                >
                                    <div className="text-sm font-medium text-blue-400 mb-1">
                                        {prePrompt.title}
                                    </div>
                                    <div className="text-xs text-gray-300 group-hover:text-white">
                                        {prePrompt.prompt}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Loading Indicator */}
                {isLoading && (
                    <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <Bot size={14} className="text-white" />
                        </div>
                        <div className="bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3">
                            <div className="flex items-center space-x-2">
                                <Loader2 className="animate-spin text-blue-400" size={16} />
                                <span className="text-sm text-gray-300">AI is thinking...</span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-gray-800 border-t border-gray-700 px-6 py-4">
                <div className="flex items-end space-x-4">
                    <div className="flex-1">
                        <textarea
                            ref={inputRef}
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-xl px-4 py-3 border border-gray-600 focus:border-blue-500 focus:outline-none resize-none"
                            rows={1}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault()
                                    handleSendMessage()
                                }
                            }}
                            disabled={isLoading}
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => handleSendMessage()}
                        disabled={!inputMessage.trim() || isLoading}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                            !inputMessage.trim() || isLoading
                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl'
                        }`}
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <Send size={20} />
                        )}
                    </button>
                </div>
                
                {/* Helpful Text */}
                <div className="flex items-center justify-center mt-3">
                    <p className="text-xs text-gray-500">
                        Press Enter to send, Shift + Enter for new line
                    </p>
                </div>
            </div>
        </div>
    )
}

export default AiPage