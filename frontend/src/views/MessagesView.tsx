'use client';

import React, { useState } from 'react';
import { chatData, highlightJSON, ChatConversation } from '@/lib/mock-data';

export default function MessagesView() {
  const [conversations, setConversations] = useState(chatData);
  const [activeChat, setActiveChat] = useState<ChatConversation | null>(null);
  const [message, setMessage] = useState('');
  const [showChatList, setShowChatList] = useState(true);

  const openChat = (id: number) => {
    const chat = conversations.find((c) => c.id === id);
    if (chat) {
      setActiveChat(chat);
      setShowChatList(false);
    }
  };

  const sendMessage = () => {
    if (!message.trim() || !activeChat) return;

    const updatedConversations = conversations.map((conv) => {
      if (conv.id === activeChat.id) {
        return {
          ...conv,
          messages: [
            ...conv.messages,
            { from: 'me' as const, text: message },
          ],
        };
      }
      return conv;
    });

    setConversations(updatedConversations);
    setMessage('');

    // Simulate response
    setTimeout(() => {
      const updatedWithResponse = updatedConversations.map((conv) => {
        if (conv.id === activeChat.id) {
          return {
            ...conv,
            messages: [
              ...conv.messages,
              { from: 'them' as const, text: 'Message received. Processing...' },
            ],
          };
        }
        return conv;
      });
      setConversations(updatedWithResponse);
      setActiveChat(updatedWithResponse.find((c) => c.id === activeChat.id) || null);
    }, 1000);
  };

  const toggleChatMobile = () => {
    setShowChatList(true);
    setActiveChat(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 h-[calc(100vh-80px)] animate-fade-in">
      <div className="h-full bg-white rounded-lg shadow-sm border border-gray-200 flex overflow-hidden">
        {/* Chat List */}
        <div className={`w-full md:w-80 ${showChatList ? 'block' : 'hidden md:block'} border-r border-gray-200 flex flex-col h-full bg-white z-10`}>
          <div className="p-3 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">Messaging</h3>
            <button className="text-gray-500 hover:text-gray-700">
              <i className="fas fa-edit"></i>
            </button>
          </div>
          <div className="p-2">
            <div className="relative">
              <i className="fas fa-search absolute left-3 top-2.5 text-gray-400 text-xs"></i>
              <input
                type="text"
                placeholder="Search messages"
                className="w-full pl-8 pr-3 py-1.5 bg-gray-100 rounded text-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.map((chat) => (
              <div
                key={chat.id}
                onClick={() => openChat(chat.id)}
                className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer border-l-4 transition ${
                  activeChat?.id === chat.id
                    ? 'bg-blue-50 border-primary'
                    : 'border-transparent'
                }`}
              >
                <div className="relative mr-3">
                  <img
                    src={chat.avatar}
                    alt={chat.name}
                    className="w-12 h-12 rounded-full border border-gray-200"
                  />
                  {chat.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 overflow-hidden">
                  <h4 className="font-semibold text-sm text-gray-900 truncate">{chat.name}</h4>
                  <p className="text-xs text-gray-500 truncate">
                    {chat.messages[chat.messages.length - 1].text.substring(0, 30)}...
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className={`flex-1 ${showChatList ? 'hidden md:flex' : 'flex'} flex-col h-full bg-gray-50`}>
          {activeChat ? (
            <>
              <div className="p-3 bg-white border-b border-gray-200 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-3">
                  <button
                    className="md:hidden text-gray-500 mr-2"
                    onClick={toggleChatMobile}
                  >
                    <i className="fas fa-arrow-left"></i>
                  </button>
                  <div className="relative">
                    <img
                      src={activeChat.avatar}
                      alt={activeChat.name}
                      className="w-10 h-10 rounded-full border border-gray-200"
                    />
                    {activeChat.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{activeChat.name}</h3>
                    <p className="text-xs text-gray-500">{activeChat.role}</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                {activeChat.messages.map((msg, idx) => {
                  const isMe = msg.from === 'me';

                  return (
                    <div
                      key={idx}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-2`}
                    >
                      {msg.isJson ? (
                        <div className={`max-w-[75%] rounded-2xl p-3 shadow-sm text-sm bg-white border border-gray-200 text-gray-800 rounded-tl-none`}>
                          <pre className="font-mono text-xs bg-code text-gray-300 p-2 rounded overflow-x-auto mt-1">
                            <code dangerouslySetInnerHTML={{ __html: highlightJSON(msg.text) }} />
                          </pre>
                        </div>
                      ) : (
                        <div className={`max-w-[75%] rounded-2xl p-3 shadow-sm text-sm ${
                          isMe
                            ? 'bg-primary text-white rounded-tr-none'
                            : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
                        }`}>
                          {msg.text}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="p-3 bg-white border-t border-gray-200">
                <div className="bg-gray-100 rounded-lg p-2">
                  <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    className="w-full bg-transparent border-none focus:ring-0 resize-none text-sm font-mono placeholder-gray-500 outline-none"
                    placeholder="Type a message..."
                  />
                  <div className="flex justify-between items-center mt-2 border-t border-gray-200 pt-2">
                    <div className="flex gap-2">
                      <button
                        onClick={sendMessage}
                        className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-secondary"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <i className="fas fa-comments text-4xl mb-3"></i>
              <p>Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
