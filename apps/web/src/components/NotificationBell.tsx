'use client';

import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { socketClient } from '@/lib/socket';

interface NotificationBellProps {
  className?: string;
}

export default function NotificationBell({ className }: NotificationBellProps) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [showToast, setShowToast] = useState<{ visible: boolean; title?: string }>({ visible: false });

  useEffect(() => {
    // Conectar el socket al montar el componente
    const socket = socketClient.connect();

    const handleNuevaPQR = (data: any) => {
      setUnreadCount((prev) => prev + 1);
      
      // Mostrar toast nativo
      setShowToast({ visible: true, title: data.titulo || 'Nueva PQR recibida' });
      
      // Ocultar toast después de 4 segundos
      setTimeout(() => {
        setShowToast({ visible: false });
      }, 4000);
    };

    socket.on('nueva_pqr', handleNuevaPQR);

    return () => {
      socket.off('nueva_pqr', handleNuevaPQR);
    };
  }, []);

  const handleClick = () => {
    // Al abrir o ver notificaciones se limpia el contador
    setUnreadCount(0);
  };

  return (
    <div className="relative flex items-center justify-center">
      <button 
        onClick={handleClick}
        className={className || "relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
        )}
      </button>

      {showToast.visible && (
        <div className="absolute right-0 top-12 w-64 bg-slate-800 text-white p-3 rounded-lg shadow-xl animate-in fade-in slide-in-from-top-2 z-50">
          <div className="flex items-start gap-3">
            <div className="bg-brand-500 p-1.5 rounded-full mt-0.5">
              <Bell size={12} className="text-white" />
            </div>
            <div>
              <p className="text-xs text-slate-300 font-medium">Nueva PQR Radicada</p>
              <p className="text-sm font-bold truncate">{showToast.title}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
