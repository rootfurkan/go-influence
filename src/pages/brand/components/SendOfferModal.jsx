/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState } from "react";
import { X, Send, DollarSign } from "lucide-react";

function SendOfferModal({ creator, campaigns, onClose, onSubmit }) {
  const [amount, setAmount] = useState(15e3);
  const initialCampaignId = creator.campaignId || campaigns[0]?.id || "";
  const [selectedCamp, setSelectedCamp] = useState(initialCampaignId);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!amount) return;
    onSubmit(Number(amount), selectedCamp);
  };

  return <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div
        className="bg-white rounded-3xl w-full max-w-[480px] p-6 md:p-8 shadow-2xl border border-[#F1F1F1] animate-in zoom-in-95 duration-200"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="bg-primary/10 text-primary text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
              Kategori Eslesmesi
            </span>
            <h3 className="font-sans font-extrabold text-xl text-on-surface">Teklif Gonder</h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 hover:bg-surface-container-low rounded-full cursor-pointer transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex items-center gap-3 p-4 bg-surface-container-low rounded-2xl mb-6">
          <img
            src={creator.avatarUrl}
            alt={creator.name}
            className="w-12 h-12 rounded-xl object-cover shrink-0"
            referrerPolicy="no-referrer"
          />
          <div>
            <h4 className="font-extrabold text-sm text-on-surface">{creator.name}</h4>
            <p className="text-[10px] text-outline font-semibold">@{creator.username} - {creator.followers} takipci</p>
          </div>
          <div className="ml-auto bg-primary text-white text-xs font-black px-3 py-1 rounded-full">
            %{creator.matchScore} Uyum
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-on-surface-variant mb-2 uppercase tracking-wider">
              Kampanya Secin
            </label>
            <div className="relative">
              <select
                value={selectedCamp}
                onChange={(event) => setSelectedCamp(event.target.value)}
                className="w-full bg-[#F8F9FA] border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-2xl p-4 text-xs font-bold outline-none appearance-none cursor-pointer"
              >
                {campaigns.map((campaign) => <option key={campaign.id} value={campaign.id}>
                    {campaign.title}
                  </option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface-variant mb-2 uppercase tracking-wider">
              Teklif Tutari (TL)
            </label>
            <div className="relative">
              <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
              <input
                required
                type="number"
                min={1e3}
                value={amount}
                onChange={(event) => setAmount(event.target.value === "" ? "" : Number(event.target.value))}
                className="w-full bg-[#F8F9FA] border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-2xl p-4 pl-10 text-xs font-bold outline-none"
                placeholder="15000"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 bg-[#F8F9FA] hover:bg-surface-container-low text-on-surface font-bold text-xs rounded-2xl transition-colors cursor-pointer text-center border border-outline-variant/30"
            >
              Iptal Et
            </button>
            <button
              type="submit"
              className="flex-1 py-3.5 bg-primary text-white font-bold text-xs rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-transform flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Teklifi Gonder</span>
              <Send size={14} />
            </button>
          </div>
        </form>
      </div>
    </div>;
}

export {
  SendOfferModal as default
};
