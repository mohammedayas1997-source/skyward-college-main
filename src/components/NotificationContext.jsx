import React, { createContext, useState, useContext } from 'react';
import { Bell, X } from 'lucide-react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Wannan function din za a kira shi daga ko ina (Accountant, Admin, etc.)
  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    
    // Sako zai bace bayan sakan 5
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  };

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      
      {/* UI na Sakonni (Toast) */}
      <div className="fixed top-5 right-5 z-[100] space-y-3 w-80">
        {notifications.map((n) => (
          <div key={n.id} className="bg-white border-l-4 border-[#002147] shadow-2xl p-4 rounded-2xl flex items-start gap-4 animate-in slide-in-from-right">
            <div className="bg-blue-50 p-2 rounded-xl text-blue-600">
              <Bell size={18} className="animate-bounce" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black text-[#002147] uppercase tracking-tight leading-tight">
                System Update
              </p>
              <p className="text-[11px] font-bold text-slate-500 mt-1">{n.message}</p>
            </div>
            <button onClick={() => setNotifications(prev => prev.filter(i => i.id !== n.id))}>
              <X size={14} className="text-slate-300 hover:text-red-500" />
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotify = () => useContext(NotificationContext);