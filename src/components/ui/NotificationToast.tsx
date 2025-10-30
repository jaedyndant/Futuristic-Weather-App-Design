import React from 'react';
import { X, AlertTriangle, Info, AlertCircle } from 'lucide-react';

interface NotificationToastProps {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error';
  onClose: (id: string) => void;
  isLightMode?: boolean;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  id,
  title,
  message,
  type,
  onClose,
  isLightMode = false
}) => {
  const getIcon = () => {
    switch (type) {
      case 'warning':
        return AlertTriangle;
      case 'error':
        return AlertCircle;
      default:
        return Info;
    }
  };

  const getColors = () => {
    if (isLightMode) {
      switch (type) {
        case 'warning':
          return 'border-yellow-500 bg-yellow-50/90';
        case 'error':
          return 'border-red-500 bg-red-50/90';
        default:
          return 'border-blue-500 bg-blue-50/90';
      }
    } else {
      switch (type) {
        case 'warning':
          return 'border-yellow-500/50 bg-yellow-500/10';
        case 'error':
          return 'border-red-500/50 bg-red-500/10';
        default:
          return 'border-blue-500/50 bg-blue-500/10';
      }
    }
  };

  const Icon = getIcon();

  return (
    <div className={`
      ${isLightMode ? 'glass-card-light' : 'glass-card'} 
      ${getColors()}
      p-4 rounded-xl border-l-4 animate-in slide-in-from-right duration-300
      max-w-sm w-full shadow-lg
    `}>
      <div className="flex items-start gap-3">
        <Icon 
          size={20} 
          className={
            type === 'warning' 
              ? 'text-yellow-500' 
              : type === 'error' 
              ? 'text-red-500' 
              : 'text-blue-500'
          } 
        />
        <div className="flex-1">
          <h4 className={`${isLightMode ? 'text-gray-900' : 'text-white'} font-medium text-sm`}>
            {title}
          </h4>
          <p className={`${isLightMode ? 'text-gray-700' : 'text-white/80'} text-xs mt-1`}>
            {message}
          </p>
        </div>
        <button
          onClick={() => onClose(id)}
          className={`${isLightMode ? 'text-gray-500 hover:text-gray-700' : 'text-white/60 hover:text-white'} transition-colors`}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};