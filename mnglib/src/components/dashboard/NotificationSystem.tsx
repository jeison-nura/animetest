"use client";
import React, { useState } from "react";
import { Bell, Check, X, Clock, AlertTriangle, Settings, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  type: "approval" | "rejection" | "upload" | "system" | "warning";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: "low" | "medium" | "high";
  fileId?: string;
  fileName?: string;
}

export const NotificationSystem = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "approval",
      title: "Archivo Aprobado",
      message: "Tu archivo 'Naruto_Shippuden_Episode_1.mp4' ha sido aprobado y está disponible para publicación.",
      timestamp: "Hace 5 minutos",
      isRead: false,
      priority: "high",
      fileId: "file123",
      fileName: "Naruto_Shippuden_Episode_1.mp4"
    },
    {
      id: "2",
      type: "rejection",
      title: "Archivo Rechazado",
      message: "Tu archivo 'One_Piece_Chapter_1000.pdf' ha sido rechazado. Revisa los comentarios del administrador.",
      timestamp: "Hace 1 hora",
      isRead: false,
      priority: "high",
      fileId: "file456",
      fileName: "One_Piece_Chapter_1000.pdf"
    },
    {
      id: "3",
      type: "upload",
      title: "Nuevo Archivo Subido",
      message: "Se ha subido un nuevo archivo: 'Dragon_Ball_Super_Episode_50.mkv' por el usuario user789.",
      timestamp: "Hace 2 horas",
      isRead: true,
      priority: "medium",
      fileId: "file789",
      fileName: "Dragon_Ball_Super_Episode_50.mkv"
    },
    {
      id: "4",
      type: "system",
      title: "Mantenimiento Programado",
      message: "El sistema estará en mantenimiento el próximo domingo de 2:00 AM a 6:00 AM.",
      timestamp: "Hace 1 día",
      isRead: true,
      priority: "low"
    },
    {
      id: "5",
      type: "warning",
      title: "Espacio de Almacenamiento",
      message: "El espacio de almacenamiento está al 85%. Considera limpiar archivos antiguos.",
      timestamp: "Hace 2 días",
      isRead: true,
      priority: "medium"
    }
  ]);

  const [filterType, setFilterType] = useState<string>("all");
  const [showSettings, setShowSettings] = useState(false);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "approval":
        return <Check className="w-5 h-5 text-green-400" />;
      case "rejection":
        return <X className="w-5 h-5 text-red-400" />;
      case "upload":
        return <Clock className="w-5 h-5 text-blue-400" />;
      case "system":
        return <Settings className="w-5 h-5 text-gray-400" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      default:
        return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500";
      case "medium":
        return "border-l-yellow-500";
      case "low":
        return "border-l-green-500";
      default:
        return "border-l-gray-500";
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, isRead: true }
          : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  const filteredNotifications = notifications.filter(notif => 
    filterType === "all" || notif.type === filterType
  );

  const unreadCount = notifications.filter(notif => !notif.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-100">Sistema de Notificaciones</h2>
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-sm">
            {unreadCount} sin leer
          </span>
          <Button
            onClick={markAllAsRead}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm"
          >
            Marcar todo como leído
          </Button>
          <Button
            onClick={() => setShowSettings(!showSettings)}
            className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 text-sm"
          >
            <Settings className="w-4 h-4 mr-2" />
            Configuración
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {["all", "approval", "rejection", "upload", "system", "warning"].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterType === type
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {type === "all" ? "Todas" : 
             type === "approval" ? "Aprobaciones" :
             type === "rejection" ? "Rechazos" :
             type === "upload" ? "Subidas" :
             type === "system" ? "Sistema" :
             "Advertencias"}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.map((notification) => (
          <div 
            key={notification.id} 
            className={`bg-gray-700 rounded-lg p-4 border-l-4 transition-all ${
              notification.isRead ? "opacity-75" : ""
            } ${getPriorityColor(notification.priority)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-white font-medium">{notification.title}</h4>
                    {!notification.isRead && (
                      <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                    )}
                  </div>
                  <p className="text-gray-300 text-sm mb-2">{notification.message}</p>
                  
                  {notification.fileName && (
                    <div className="bg-gray-600 rounded px-2 py-1 inline-block">
                      <span className="text-xs text-gray-300">{notification.fileName}</span>
                    </div>
                  )}
                  
                  <p className="text-gray-400 text-xs mt-2">{notification.timestamp}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {!notification.isRead && (
                  <Button
                    onClick={() => markAsRead(notification.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 text-xs"
                  >
                    Marcar leído
                  </Button>
                )}
                
                <Button
                  onClick={() => deleteNotification(notification.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 text-xs"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Configuración de Notificaciones</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4 text-gray-300">
              <div className="flex items-center justify-between">
                <span>Notificaciones por email</span>
                <input type="checkbox" className="w-4 h-4" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span>Notificaciones push</span>
                <input type="checkbox" className="w-4 h-4" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span>Notificaciones de sistema</span>
                <input type="checkbox" className="w-4 h-4" defaultChecked />
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button
                onClick={() => setShowSettings(false)}
                className="bg-gray-600 hover:bg-gray-500 text-white"
              >
                Guardar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 