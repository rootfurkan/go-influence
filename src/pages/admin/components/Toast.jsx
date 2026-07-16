import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2 } from "lucide-react";
function Toast({ message, isVisible }) {
  return <AnimatePresence>
      {isVisible && <motion.div
    initial={{ opacity: 0, y: 50, x: "-50%" }}
    animate={{ opacity: 1, y: 0, x: "-50%" }}
    exit={{ opacity: 0, y: 20, x: "-50%" }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    id="feedbackToast"
    className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-on-background text-white px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-4 z-[110]"
  >
          <CheckCircle2 className="text-tertiary-fixed w-6 h-6 animate-pulse" />
          <span className="font-bold text-sm tracking-wide">{message}</span>
        </motion.div>}
    </AnimatePresence>;
}
export {
  Toast as default
};
