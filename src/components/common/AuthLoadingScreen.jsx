export default function AuthLoadingScreen() {
  return (
    <div className="min-h-screen grid place-items-center bg-surface text-on-surface">
      <div className="rounded-3xl bg-white border border-outline-variant/50 px-8 py-6 shadow-sm text-center">
        <p className="text-sm font-bold text-primary">Oturum kontrol ediliyor...</p>
      </div>
    </div>
  );
}
