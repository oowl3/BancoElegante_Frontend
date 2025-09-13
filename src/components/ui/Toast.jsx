import { useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";

const typeStyles = {
  success: "bg-green-500 text-white",
  error: "bg-red-500 text-white",
  warning: "bg-yellow-400 text-black",
  info: "bg-blue-500 text-white",
};

const icons = {
  success: <CheckCircle className="w-5 h-5" />,
  error: <XCircle className="w-5 h-5" />,
  warning: <AlertTriangle className="w-5 h-5" />,
  info: <Info className="w-5 h-5" />,
};

export function Toast({ message, onClose, type = "error" }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      className={`fixed top-4 right-4 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg ${typeStyles[type] || typeStyles.error}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {icons[type]}
      <p className="flex-1">{message}</p>
      <button
        onClick={onClose}
        className="ml-2 text-lg font-bold hover:opacity-80"
      >
        &times;
      </button>
    </motion.div>
  );
}

