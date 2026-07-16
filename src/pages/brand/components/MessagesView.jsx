/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState } from "react";
import { BadgeCheck, MessageSquare, Search, Send } from "lucide-react";

function MessagesView({
  threads,
  onSendMessage,
  activeThreadId,
  onSelectThread,
}) {
  const [inputText, setInputText] = useState("");
  const currentThread = threads.find((thread) => thread.creatorId === activeThreadId) || (!activeThreadId ? threads[0] : null);

  const handleSend = (event) => {
    event.preventDefault();
    if (!inputText.trim() || !currentThread) return;
    onSendMessage(currentThread.creatorId, inputText.trim());
    setInputText("");
  };

  return <div className="bg-white rounded-3xl border border-[#F1F1F1] shadow-[0px_10px_30px_rgba(176,38,255,0.06)] h-[calc(100vh-14rem)] overflow-hidden flex animate-in fade-in duration-500">
      <div className="w-full md:w-80 border-r border-[#F1F1F1] flex flex-col shrink-0 h-full">
        <div className="p-4 border-b border-surface-container flex items-center gap-2">
          <Search size={16} className="text-outline shrink-0" />
          <input
            type="text"
            placeholder="Mesajlarda ara..."
            className="w-full text-xs font-semibold text-on-surface placeholder:text-outline/60 outline-none bg-transparent"
          />
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-surface-container-low custom-scrollbar">
          {threads.length ? threads.map((thread) => {
            const isSelected = activeThreadId === thread.creatorId;
            return <button
              type="button"
              key={thread.creatorId}
              onClick={() => onSelectThread(thread.creatorId)}
              className={`w-full text-left p-4 cursor-pointer transition-colors flex gap-3 ${isSelected ? "bg-secondary-container/50 border-r-4 border-primary" : "hover:bg-surface-container-low/30"}`}
            >
              <img
                src={thread.avatarUrl}
                alt={thread.creatorName}
                className="w-11 h-11 rounded-full object-cover shrink-0 bg-slate-100"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-extrabold text-xs text-on-surface truncate">{thread.creatorName}</h4>
                  <span className="text-[9px] text-outline font-semibold shrink-0">{thread.lastMessageTime}</span>
                </div>
                <p className="text-[11px] text-on-surface-variant font-medium truncate">
                  {thread.lastMessageText}
                </p>
              </div>
              {thread.unreadCount > 0 && <div className="w-2.5 h-2.5 bg-primary rounded-full self-center shrink-0" />}
            </button>;
          }) : <EmptyThreadList />}
        </div>
      </div>

      <div className="hidden md:flex flex-1 flex-col h-full bg-surface-container-lowest">
        {currentThread ? <>
            <div className="px-6 py-4 border-b border-[#F1F1F1] flex items-center gap-3">
              <img
                src={currentThread.avatarUrl}
                alt={currentThread.creatorName}
                className="w-10 h-10 rounded-full object-cover bg-slate-100"
                referrerPolicy="no-referrer"
              />
              <div>
                <h3 className="font-extrabold text-sm text-on-surface flex items-center gap-1">
                  <span>{currentThread.creatorName}</span>
                  <BadgeCheck size={14} className="text-primary fill-current" />
                </h3>
                <p className="text-[10px] text-outline font-semibold">{currentThread.creatorUsername}</p>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar">
              {currentThread.messages.map((msg) => {
                const isBrand = msg.sender === "brand";
                return <div
                  key={msg.id}
                  className={`flex ${isBrand ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-md rounded-2xl px-4 py-3 text-xs font-semibold shadow-sm ${isBrand ? "bg-primary text-white rounded-br-none" : "bg-surface-container-low text-on-surface rounded-bl-none"}`}>
                    <p className="leading-relaxed">{msg.text}</p>
                    <span className={`text-[9px] mt-1.5 block text-right font-medium ${isBrand ? "text-white/70" : "text-outline"}`}>
                      {msg.timestamp}
                    </span>
                  </div>
                </div>;
              })}
            </div>

            <form onSubmit={handleSend} className="p-4 border-t border-[#F1F1F1] flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(event) => setInputText(event.target.value)}
                placeholder="Mesajınızı buraya yazın..."
                className="flex-1 bg-surface-container-low text-xs font-bold text-on-surface px-5 py-3.5 rounded-full border border-transparent focus:border-primary/30 outline-none"
              />
              <button
                type="submit"
                className="bg-primary text-white p-3.5 rounded-full shadow-md hover:scale-105 active:scale-95 transition-transform cursor-pointer"
              >
                <Send size={16} />
              </button>
            </form>
          </> : <EmptyConversation />}
      </div>
    </div>;
}

function EmptyThreadList() {
  return <div className="p-8 text-center text-on-surface-variant">
      <MessageSquare size={36} className="text-primary mx-auto mb-3" />
      <p className="font-bold text-sm text-on-surface">Henüz sohbet yok</p>
      <p className="text-xs mt-1">Teklif gönderildiğinde sohbetler burada veritabanından listelenecek.</p>
    </div>;
}

function EmptyConversation() {
  return <div className="flex-1 flex flex-col items-center justify-center text-outline gap-2.5">
      <MessageSquare size={36} className="text-outline/40" />
      <p className="font-bold text-sm">Sohbet bulunamadı.</p>
      <p className="text-xs">Kayıtlar veritabanından geldiğinde burada görünecek.</p>
    </div>;
}

export {
  MessagesView as default,
};
