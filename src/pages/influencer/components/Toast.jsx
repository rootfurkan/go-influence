import { useEffect } from "react";
function Toast({ toasts, onClose }) {
  return <div className="fixed bottom-24 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none md:bottom-6">
      {toasts.map((toast) => <ToastItem key={toast.id} toast={toast} onClose={onClose} />)}
    </div>;
}
function ToastItem({ toast, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 4e3);
    return () => clearTimeout(timer);
  }, [toast.id, onClose]);
  const bgStyle = () => {
    switch (toast.type) {
      case "success":
        return "bg-emerald-500 text-white";
      case "error":
        return "bg-red-500 text-white";
      case "info":
      default:
        return "bg-primary text-white";
    }
  };
  const iconName = () => {
    switch (toast.type) {
      case "success":
        return "check_circle";
      case "error":
        return "error";
      case "info":
      default:
        return "info";
    }
  };
  return <div className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-2xl shadow-lg neon-purple-shadow transition-all duration-300 transform translate-y-0 ${bgStyle()}`}>
      <div className="flex items-center gap-2.5">
        <span className="material-symbols-outlined text-[20px] font-bold">{iconName()}</span>
        <span className="text-xs font-bold leading-tight">{toast.message}</span>
      </div>
      <button
    onClick={() => onClose(toast.id)}
    className="text-white hover:opacity-80 transition-opacity focus:outline-none"
  >
        <span className="material-symbols-outlined text-[16px]">close</span>
      </button>
    </div>;
}
export {
  Toast as default
};
