import { useEffect, useState } from "react";
import {
  changeCurrentUserPassword,
  updateInfluencerSettings,
} from "../../../features/auth/authService";

const DEFAULT_SETTINGS = {
  emailNotifications: true,
  pushNotifications: true,
  minimumMatchScore: 80,
  currencyPreference: "TRY",
  profileVisibility: true,
};

function SettingsScreen({ onShowToast, profile, user }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [passwordFormOpen, setPasswordFormOpen] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    newPasswordRepeat: "",
  });
  const displayName = profile?.displayName || user?.email?.split("@")[0] || "Influencer";
  const email = user?.email || profile?.email || "-";
  const profileIsVisible = settings.profileVisibility !== false;

  useEffect(() => {
    setSettings({
      ...DEFAULT_SETTINGS,
      ...(profile?.settings || {}),
      minimumMatchScore: profile?.settings?.minimumMatchScore ?? DEFAULT_SETTINGS.minimumMatchScore,
      profileVisibility: profile?.profileVisibility ?? profile?.settings?.profileVisibility ?? true,
    });
  }, [profile]);

  const updateSetting = (key, value) => {
    setSettings((current) => ({ ...current, [key]: value }));
  };

  const handleSaveSettings = async () => {
    if (!user?.uid) {
      onShowToast("Oturum bilgisi bulunamadi.", "error");
      return;
    }

    setSaving(true);
    try {
      const savedSettings = await updateInfluencerSettings(user.uid, settings);
      setSettings(savedSettings);
      onShowToast("Ayarlar basariyla kaydedildi.", "success");
    } catch (error) {
      console.error("Influencer settings could not be saved.", error);
      onShowToast("Ayarlar kaydedilemedi. Lutfen tekrar deneyin.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (event) => {
    event.preventDefault();

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.newPasswordRepeat) {
      onShowToast("Lutfen tum sifre alanlarini doldurun.", "error");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      onShowToast("Yeni sifre en az 6 karakter olmali.", "error");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.newPasswordRepeat) {
      onShowToast("Yeni sifreler birbiriyle eslesmiyor.", "error");
      return;
    }

    setPasswordSaving(true);
    try {
      await changeCurrentUserPassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      onShowToast("Sifre degistirildi. Guvenlik icin oturum kapatiliyor.", "success");
    } catch (error) {
      console.error("Password could not be updated.", error);
      onShowToast(getPasswordErrorMessage(error), "error");
    } finally {
      setPasswordSaving(false);
    }
  };

  return <div className="relative min-h-screen pb-16">
      <div className="bg-blob bg-tertiary-fixed w-[400px] h-[400px] -top-20 -left-20" />
      <div className="bg-blob bg-primary-fixed/20 w-[400px] h-[400px] bottom-0 right-10" />

      <div className="mb-8" id="settings-header">
        <h1 className="text-3xl font-extrabold tracking-tight text-on-surface mb-2">Ayarlar</h1>
        <p className="text-base text-on-surface-variant">Sistem tercihlerinizi ve hesap guvenlik ayarlarinizi yonetin.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="settings-bento-layout">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-[#F1F1F1] shadow-[0px_10px_30px_rgba(176,38,255,0.06)]">
            <h3 className="font-bold text-sm text-on-surface mb-4 uppercase tracking-wider text-primary">Hesap Bilgileri</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-2xl">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold">{displayName[0]?.toUpperCase() || "I"}</div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-on-surface truncate">{displayName}</h4>
                  <p className="text-[10px] text-on-surface-variant font-medium truncate">{email}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border border-outline-variant/30 rounded-2xl">
                <span className="text-xs font-bold text-on-surface-variant">Hesap Durumu</span>
                <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${profileIsVisible ? "bg-green-100 text-green-800" : "bg-error-container text-on-error-container"}`}>
                  {profileIsVisible ? "AKTIF" : "PASIF"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#F1F1F1] shadow-[0px_10px_30px_rgba(176,38,255,0.06)]">
            <h3 className="font-bold text-sm text-on-surface mb-4 uppercase tracking-wider text-primary">Guvenlik</h3>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setPasswordFormOpen((value) => !value)}
                className="w-full py-3 bg-surface-container-low text-on-surface-variant rounded-2xl text-xs font-bold hover:bg-surface-container transition-colors flex items-center justify-center gap-2 border border-outline-variant/20"
              >
                <span className="material-symbols-outlined text-[16px]">lock_reset</span>
                Sifreyi Degistir
              </button>

              {passwordFormOpen && <form onSubmit={handlePasswordChange} className="space-y-3 p-4 bg-surface-container-low rounded-2xl border border-outline-variant/20">
                  <PasswordInput
                    label="Mevcut Sifre"
                    value={passwordForm.currentPassword}
                    onChange={(value) => setPasswordForm((current) => ({ ...current, currentPassword: value }))}
                  />
                  <PasswordInput
                    label="Yeni Sifre"
                    value={passwordForm.newPassword}
                    onChange={(value) => setPasswordForm((current) => ({ ...current, newPassword: value }))}
                  />
                  <PasswordInput
                    label="Yeni Sifre Tekrar"
                    value={passwordForm.newPasswordRepeat}
                    onChange={(value) => setPasswordForm((current) => ({ ...current, newPasswordRepeat: value }))}
                  />
                  <button
                    type="submit"
                    disabled={passwordSaving}
                    className="w-full py-3 bg-primary text-white rounded-2xl text-xs font-bold hover:brightness-105 active:scale-95 transition-all disabled:opacity-60"
                  >
                    {passwordSaving ? "Guncelleniyor..." : "Sifreyi Guncelle"}
                  </button>
                </form>}

              <button
                type="button"
                onClick={() => onShowToast("Iki adimli dogrulama yakinda aktif olacak.", "info")}
                className="w-full py-3 bg-surface-container-low text-on-surface-variant rounded-2xl text-xs font-bold hover:bg-surface-container transition-colors flex items-center justify-center gap-2 border border-outline-variant/20"
              >
                <span className="material-symbols-outlined text-[16px]">verified_user</span>
                Iki Adimli Dogrulama (2FA)
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-[#F1F1F1] shadow-[0px_10px_30px_rgba(176,38,255,0.06)] space-y-6">
            <div>
              <h3 className="font-bold text-sm text-on-surface mb-4 uppercase tracking-wider text-primary flex items-center gap-2">
                <span className="material-symbols-outlined">notifications_active</span>
                Bildirim Tercihleri
              </h3>
              <div className="space-y-4">
                <ToggleRow
                  title="E-Posta Bildirimleri"
                  description="Yeni teklif geldiginde veya kampanya onaylandiginda e-posta gonder."
                  checked={settings.emailNotifications}
                  onChange={() => updateSetting("emailNotifications", !settings.emailNotifications)}
                />
                <ToggleRow
                  title="Anlik Mobil Bildirimler"
                  description="Yeni bir mesaj veya teklif aldiginizda anlik bildirim goster."
                  checked={settings.pushNotifications}
                  onChange={() => updateSetting("pushNotifications", !settings.pushNotifications)}
                />
              </div>
            </div>

            <div>
              <h3 className="font-bold text-sm text-on-surface mb-4 uppercase tracking-wider text-primary flex items-center gap-2">
                <span className="material-symbols-outlined">tune</span>
                Eslesme Uyum Filtresi
              </h3>
              <div className="p-4 bg-surface-container-low rounded-2xl space-y-3">
                <div className="flex justify-between text-xs font-bold text-on-surface">
                  <span>Minimum Uyum Orani</span>
                  <span className="text-primary font-extrabold">%{settings.minimumMatchScore} ve uzeri</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.minimumMatchScore}
                  onChange={(event) => updateSetting("minimumMatchScore", Number(event.target.value))}
                  className="w-full h-2 bg-outline-variant rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <p className="text-[10px] text-on-surface-variant font-medium leading-relaxed">
                  Bu ayar, Marka Ihtiyaclari sekmesinde kategori ve hizmet uyumu icin minimum baraji belirler.
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-sm text-on-surface mb-4 uppercase tracking-wider text-primary flex items-center gap-2">
                <span className="material-symbols-outlined">settings_suggest</span>
                Genel Tercihler
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-surface-container-low rounded-2xl space-y-2">
                  <h4 className="text-xs font-bold text-on-surface">Para Birimi</h4>
                  <select
                    value={settings.currencyPreference}
                    onChange={(event) => updateSetting("currencyPreference", event.target.value)}
                    className="w-full bg-white border border-outline-variant/50 rounded-xl text-xs p-2.5 font-bold text-on-surface"
                  >
                    <option value="TRY">Turk Lirasi (TL)</option>
                    <option value="USD">Amerikan Dolari ($)</option>
                    <option value="EUR">Euro (EUR)</option>
                  </select>
                </div>

                <div className="p-4 bg-surface-container-low rounded-2xl flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-on-surface">Profil Gorunurlugu</h4>
                    <p className="text-[9px] text-on-surface-variant font-medium">Pasif oldugunda markalarin creator listesinde gorunmezsiniz.</p>
                  </div>
                  <Toggle checked={settings.profileVisibility} onChange={() => updateSetting("profileVisibility", !settings.profileVisibility)} />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-outline-variant/20">
              <button
                type="button"
                onClick={handleSaveSettings}
                disabled={saving}
                className="w-full md:w-auto px-12 py-4 bg-primary text-on-primary rounded-3xl font-bold text-xs hover:scale-[1.03] active:scale-95 transition-all neon-shadow flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {saving ? <>
                    <span>Kaydediliyor...</span>
                    <span className="material-symbols-outlined text-base animate-spin">sync</span>
                  </> : <>
                    <span>Ayarlari Kaydet</span>
                    <span className="material-symbols-outlined text-base">save</span>
                  </>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>;
}

function ToggleRow({ title, description, checked, onChange }) {
  return <div className="flex items-center justify-between gap-4 p-4 bg-surface-container-low rounded-2xl">
      <div>
        <h4 className="text-xs font-bold text-on-surface">{title}</h4>
        <p className="text-[10px] text-on-surface-variant font-medium">{description}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>;
}

function Toggle({ checked, onChange }) {
  return <button
      type="button"
      onClick={onChange}
      className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none shrink-0 ${checked ? "bg-primary" : "bg-outline-variant"}`}
    >
      <span className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${checked ? "right-0.5" : "left-0.5"}`} />
    </button>;
}

function PasswordInput({ label, value, onChange }) {
  return <label className="block">
      <span className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">{label}</span>
      <input
        type="password"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full bg-white border border-outline-variant/40 rounded-xl px-3 py-2.5 text-xs font-bold text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary"
      />
    </label>;
}

function getPasswordErrorMessage(error) {
  if (error?.code === "auth/invalid-credential" || error?.code === "auth/wrong-password") {
    return "Mevcut sifre hatali.";
  }
  if (error?.code === "auth/weak-password") {
    return "Yeni sifre daha guclu olmali.";
  }
  if (error?.code === "auth/requires-recent-login") {
    return "Bu islem icin tekrar giris yapmaniz gerekiyor.";
  }
  return "Sifre degistirilemedi. Lutfen tekrar deneyin.";
}

export {
  SettingsScreen as default
};
