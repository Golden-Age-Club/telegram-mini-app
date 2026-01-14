import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

const Toast = ({ 
  message, 
  type = 'info', 
  duration = 3000, 
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} className="text-emerald-400" />;
      case 'error':
        return <AlertCircle size={20} className="text-red-400" />;
      case 'warning':
        return <AlertTriangle size={20} className="text-amber-400" />;
      default:
        return <Info size={20} className="text-blue-400" />;
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`toast toast-${type} ${
        isExiting ? 'animate-fadeOut' : 'animate-slideDown'
      } pointer-events-auto relative`}
    >
      <div className="flex items-start gap-3">
        {getIcon()}
        <div className="flex-1">
          <p className="text-sm text-white">{message}</p>
        </div>
        <button
          onClick={handleClose}
          className="flex-shrink-0 p-1 hover:bg-white/10 rounded transition-colors cursor-pointer z-10 relative"
          style={{ pointerEvents: 'auto' }}
        >
          <X size={16} className="text-white/70 hover:text-white" />
        </button>
      </div>
    </div>
  );
};

// Toast Container Component
export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] h-full pointer-events-none z-[9999]">
      <div className="absolute top-20 right-4 space-y-2 pointer-events-none">
        {toasts.map((toast, index) => (
          <div 
            key={toast.id}
            className="pointer-events-auto"
            style={{ 
              transform: `translateY(${index * 4}px)`,
              zIndex: 9999 - index 
            }}
          >
            <Toast
              {...toast}
              onClose={() => removeToast(toast.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// Toast Hook
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', options = {}) => {
    // Check for duplicate messages to prevent spam
    const isDuplicate = toasts.some(toast => 
      toast.message === message && toast.type === type
    );
    
    if (isDuplicate) {
      return null; // Don't add duplicate toasts
    }

    const id = Date.now() + Math.random();
    const toast = {
      id,
      message,
      type,
      duration: options.duration || 3000, // Reduced to 3 seconds
      position: options.position || 'top-right',
    };

    setToasts(prev => {
      // Limit to maximum 3 toasts at once
      const newToasts = [...prev, toast];
      return newToasts.slice(-3);
    });
    
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const clearAll = () => {
    setToasts([]);
  };

  const success = (message, options) => addToast(message, 'success', options);
  const error = (message, options) => addToast(message, 'error', options);
  const warning = (message, options) => addToast(message, 'warning', options);
  const info = (message, options) => addToast(message, 'info', options);

  return {
    toasts,
    addToast,
    removeToast,
    clearAll,
    success,
    error,
    warning,
    info,
  };
};

export default Toast;