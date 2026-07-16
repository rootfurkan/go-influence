import { useEffect, useRef, useState } from "react";

function MessagesScreen({ channels: externalChannels = [], onShowToast, onSendMessage }) {
  const [activeChannelId, setActiveChannelId] = useState("");
  const [inputText, setInputText] = useState("");
  const chatEndRef = useRef(null);
  const shownChannels = externalChannels;
  const activeChannel = shownChannels.find((channel) => channel.id === activeChannelId) || shownChannels[0] || null;

  useEffect(() => {
    if (!shownChannels.length) {
      setActiveChannelId("");
      return;
    }

    if (!activeChannelId || !shownChannels.some((channel) => channel.id === activeChannelId)) {
      setActiveChannelId(shownChannels[0].id);
    }
  }, [activeChannelId, shownChannels]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChannel?.messages]);

  const handleSendMessage = async (event) => {
    event.preventDefault();
    if (!inputText.trim() || !activeChannel) return;

    const textSent = inputText.trim();
    setInputText("");
    try {
      await onSendMessage?.(activeChannel.id, textSent);
    } catch (error) {
      console.error("Message could not be sent.", error);
      onShowToast?.("Mesaj gönderilemedi. Lütfen tekrar deneyin.", "error");
      setInputText(textSent);
    }
  };

  return <div className="relative min-h-screen pb-16 flex flex-col">
      <div className="bg-blob bg-primary-fixed/20 w-[400px] h-[400px] -top-20 -right-20" />
      <div className="bg-blob bg-secondary-container/20 w-[400px] h-[400px] bottom-12 left-10" />

      <div className="mb-8" id="messages-header">
        <h1 className="text-3xl font-extrabold tracking-tight text-on-surface mb-2">Mesajlar</h1>
        <p className="text-base text-on-surface-variant">İş birliği yaptığınız markalar ile doğrudan iletişim kurun.</p>
      </div>

      <div className="bg-white rounded-3xl border border-[#F1F1F1] shadow-[0px_10px_30px_rgba(176,38,255,0.06)] overflow-hidden flex flex-col md:flex-row min-h-[600px] h-[calc(100vh-320px)]" id="chat-container-layout">
        <div className="w-full md:w-80 border-r border-outline-variant/30 flex flex-col bg-surface-container-lowest" id="chat-channels-list">
          <div className="p-4 border-b border-outline-variant/20 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">search</span>
            <input
              type="text"
              placeholder="Marka ismi ara..."
              className="w-full bg-transparent border-none text-xs font-semibold focus:ring-0 placeholder:text-on-surface-variant/60 py-1"
            />
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-outline-variant/20 custom-scrollbar">
            {shownChannels.length ? shownChannels.map((channel) => {
              const isSelected = channel.id === activeChannel?.id;
              return <button
                type="button"
                key={channel.id}
                onClick={() => setActiveChannelId(channel.id)}
                className={`w-full text-left p-4 flex items-center gap-3 cursor-pointer transition-colors relative hover:bg-surface-container/30 ${isSelected ? "bg-primary/5 border-l-4 border-primary" : ""}`}
              >
                <div className="w-12 h-12 rounded-xl bg-surface-container-low overflow-hidden border border-[#F1F1F1] flex-shrink-0">
                  <img className="w-full h-full object-cover" src={channel.logoUrl} alt={channel.brandName} referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h4 className="font-bold text-xs text-on-surface truncate">{channel.brandName}</h4>
                    {channel.unreadCount > 0 && <span className="bg-primary text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full">
                        {channel.unreadCount}
                      </span>}
                  </div>
                  <p className="text-[10px] text-primary font-bold uppercase tracking-wide mb-1">{channel.category}</p>
                  <p className="text-[11px] text-on-surface-variant truncate font-medium">{channel.lastMessage}</p>
                </div>
              </button>;
            }) : <EmptyThreadList />}
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-[#FAFAFA]" id="chat-message-window">
          {activeChannel ? <>
              <div className="p-4 bg-white border-b border-outline-variant/30 flex items-center gap-3 shadow-sm z-10" id="chat-active-header">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-surface-container-low border border-[#F1F1F1]">
                  <img className="w-full h-full object-cover" src={activeChannel.logoUrl} alt={activeChannel.brandName} referrerPolicy="no-referrer" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-on-surface">{activeChannel.brandName}</h3>
                  <p className="text-[10px] text-on-surface-variant font-semibold uppercase tracking-wide flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {activeChannel.category}
                  </p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar" id="chat-bubbles">
                {(activeChannel.messages || []).map((msg) => {
                  const isUser = msg.sender === "user";
                  return <div
                    key={msg.id}
                    className={`flex flex-col max-w-[75%] ${isUser ? "ml-auto items-end" : "mr-auto items-start"}`}
                  >
                    <div className={`p-4 rounded-2xl text-xs font-medium leading-relaxed shadow-sm ${isUser ? "bg-primary text-white rounded-tr-none" : "bg-white text-on-surface border border-outline-variant/30 rounded-tl-none"}`}>
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-on-surface-variant/70 font-semibold mt-1 px-1">
                      {msg.timestamp}
                    </span>
                  </div>;
                })}
                <div ref={chatEndRef} />
              </div>

              <form
                onSubmit={handleSendMessage}
                className="p-4 bg-white border-t border-outline-variant/30 flex gap-3 items-center"
                id="chat-input-form"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(event) => setInputText(event.target.value)}
                  placeholder="Mesajınızı buraya yazın..."
                  className="flex-1 bg-[#F8F9FA] border border-outline-variant/50 rounded-2xl px-4 py-3.5 text-xs font-semibold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-on-surface"
                />
                <button
                  type="submit"
                  className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md hover:bg-primary-container shrink-0"
                >
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
                </button>
              </form>
            </> : <EmptyConversation />}
        </div>
      </div>
    </div>;
}

function EmptyThreadList() {
  return <div className="p-8 text-center text-on-surface-variant">
      <span className="material-symbols-outlined text-primary text-4xl mb-3">forum</span>
      <p className="text-sm font-bold text-on-surface">Henüz sohbet yok</p>
      <p className="text-xs mt-1">Teklif gönderildiğinde veya sohbet başlatıldığında burada görünecek.</p>
    </div>;
}

function EmptyConversation() {
  return <div className="flex-1 flex flex-col items-center justify-center text-on-surface-variant gap-2.5">
      <span className="material-symbols-outlined text-primary text-5xl">forum</span>
      <p className="font-bold text-sm text-on-surface">Sohbet bulunamadı</p>
      <p className="text-xs">Mesajlaşma kayıtları veritabanından geldiğinde burada listelenecek.</p>
    </div>;
}

export {
  MessagesScreen as default,
};
