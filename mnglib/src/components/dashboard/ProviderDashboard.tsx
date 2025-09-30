"use client";
import React, { useState, useEffect } from "react";
import { MetricsCard } from "./MetricsCard";
import { UploadForm } from "./UploadForm";
import { FileAdmissionSystem } from "./FileAdmissionSystem";
import { NotificationSystem } from "./NotificationSystem";
import { FilePreview } from "./FilePreview";
import { ProfileEditor } from "./ProfileEditor";
import { 
  Plus, 
  ChevronDown,
  Zap, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle,
  FileText,
  Users,
  Activity,
  Bell,
  BarChart3,
  Upload,
  CheckSquare,
  Eye,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSafeMetrics } from "@/hooks/useSafeMetrics";

interface DashboardMetrics {
  totalUploads: number;
  pendingApproval: number;
  approved: number;
  rejected: number;
  totalSize: string;
  totalUsers: number;
  activeUploads: number;
  weeklyGrowth: number;
}

export const ProviderDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { metrics, isLoading, error, getStoragePercentage, formatNumber } = useSafeMetrics();

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: <BarChart3 className="w-5 h-5" /> },
    { id: "upload", label: "Upload", icon: <Upload className="w-5 h-5" /> },
    { id: "admission", label: "Admisión", icon: <CheckSquare className="w-5 h-5" /> },
    { id: "notifications", label: "Notificaciones", icon: <Bell className="w-5 h-5" /> },
    { id: "preview", label: "Vista Previa", icon: <Eye className="w-5 h-5" /> },
    { id: "profile", label: "Perfil", icon: <User className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white relative overflow-hidden" style={{backgroundColor: '#0f172a'}}>
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-orange-400/20 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-red-400/30 rounded-full animate-ping"></div>
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-orange-300/25 rounded-full animate-bounce"></div>
        <div className="absolute top-60 right-1/3 w-1 h-1 bg-red-300/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-2 h-2 bg-orange-500/15 rounded-full animate-ping"></div>
      </div>
      
      {/* Header con gradiente dinámico */}
      <div className="bg-gradient-to-r from-orange-600 via-red-600 to-orange-500 border-b border-orange-400/30 shadow-2xl relative overflow-hidden">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-transparent to-red-500/20 animate-pulse"></div>
        <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="transform transition-all duration-500 hover:scale-105">
              <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-white to-orange-100 bg-clip-text text-transparent animate-fade-in">
                Panel de Administración
              </h1>
              <p className="text-orange-100 text-lg font-medium animate-fade-in-delay">
                Gestiona tu contenido de entretenimiento de manera eficiente
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <Button className="w-14 h-14 p-0 border-2 border-orange-400 bg-transparent hover:bg-orange-500/20 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-orange-500/25 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 to-orange-500/20 group-hover:from-orange-500/20 group-hover:to-orange-500/40 transition-all duration-300"></div>
                <Plus className="w-7 h-7 text-white relative z-10 group-hover:rotate-90 transition-transform duration-300" />
              </Button>
              
              <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-xl flex items-center gap-3 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/25 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 to-red-500/20 group-hover:from-red-500/20 group-hover:to-red-500/40 transition-all duration-300"></div>
                <Activity className="w-5 h-5 relative z-10 group-hover:animate-pulse" />
                <span className="relative z-10">En curso</span>
                <ChevronDown className="w-4 h-4 relative z-10 group-hover:rotate-180 transition-transform duration-300" />
              </Button>
              
              <Button className="w-14 h-14 p-0 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-orange-500/25 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 to-red-500/20 group-hover:from-orange-500/20 group-hover:to-red-500/40 transition-all duration-300"></div>
                <Zap className="w-7 h-7 text-white relative z-10 group-hover:animate-pulse" />
              </Button>
            </div>
          </div>

        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-6 py-6 relative z-10">
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-6 py-3 rounded-xl transition-all duration-500 flex items-center gap-3 whitespace-nowrap group relative overflow-hidden ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transform scale-105"
                  : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 hover:text-white border border-slate-600/50 hover:border-orange-500/50 hover:shadow-md hover:shadow-orange-500/10 hover:scale-105"
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Animated background overlay */}
              <div className={`absolute inset-0 transition-all duration-300 ${
                activeTab === tab.id 
                  ? "bg-gradient-to-r from-orange-400/20 to-red-400/20" 
                  : "bg-gradient-to-r from-orange-500/0 to-red-500/0 group-hover:from-orange-500/10 group-hover:to-red-500/10"
              }`}></div>
              
              <span className={`text-xl relative z-10 transition-transform duration-300 ${
                activeTab === tab.id ? "animate-pulse" : "group-hover:scale-110"
              }`}>{tab.icon}</span>
              
              <div className="text-left relative z-10">
                <div className="font-semibold">{tab.label}</div>
              </div>
              
              {/* Active indicator */}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-300 to-red-300 rounded-full animate-pulse"></div>
              )}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-600/50 shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 relative overflow-hidden group">
          {/* Tab indicator */}
          <div className="mb-6 flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-orange-400 font-medium">
              {tabs.find(tab => tab.id === activeTab)?.label || 'Dashboard'}
            </span>
          </div>
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-500/10 via-transparent to-red-500/10"></div>
            <div className="absolute top-4 right-4 w-32 h-32 bg-orange-400/5 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-4 left-4 w-24 h-24 bg-red-400/5 rounded-full blur-lg animate-ping"></div>
          </div>
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="space-y-8 relative z-10">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
                  <p>Error: {error}</p>
                </div>
              )}
              
              {isLoading && (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                  <span className="ml-2 text-orange-400">Cargando métricas...</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent animate-fade-in">Métricas de Contenido</h2>
                <div className="flex items-center gap-2 text-orange-400 bg-orange-500/10 px-4 py-2 rounded-full border border-orange-500/20 hover:bg-orange-500/20 transition-all duration-300 hover:scale-105 group">
                  <TrendingUp className="w-5 h-5 group-hover:animate-bounce" />
                  <span className="text-sm font-semibold">+{metrics.weeklyGrowth}% esta semana</span>
                </div>
              </div>
              
              {/* Main Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="animate-slide-in-left" style={{ animationDelay: '0.1s' }}>
                  <MetricsCard
                    title="Total Subidas"
                    value={formatNumber(metrics.totalUploads)}
                    icon={<FileText className="w-6 h-6" />}
                    color="navy"
                    trend="+5 esta semana"
                  />
                </div>
                <div className="animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
                  <MetricsCard
                    title="Pendientes"
                    value={formatNumber(metrics.pendingApproval)}
                    icon={<Clock className="w-6 h-6" />}
                    color="orange"
                    trend="+2 nuevos"
                  />
                </div>
                <div className="animate-slide-in-right" style={{ animationDelay: '0.3s' }}>
                  <MetricsCard
                    title="Aprobados"
                    value={formatNumber(metrics.approved)}
                    icon={<CheckCircle className="w-6 h-6" />}
                    color="green"
                    trend="+12 esta semana"
                  />
                </div>
                <div className="animate-slide-in-right" style={{ animationDelay: '0.4s' }}>
                  <MetricsCard
                    title="Rechazados"
                    value={formatNumber(metrics.rejected)}
                    icon={<XCircle className="w-6 h-6" />}
                    color="red"
                    trend="-3 esta semana"
                  />
                </div>
              </div>

              {/* Additional Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-slate-700/20 to-slate-800/20 rounded-xl p-6 border border-slate-600/30 hover:border-orange-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-600/20 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-slate-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-200">Usuarios Activos</h3>
                      <p className="text-3xl font-bold text-white">{formatNumber(metrics.totalUsers)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 rounded-xl p-6 border border-orange-500/30 hover:border-orange-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                      <Activity className="w-6 h-6 text-orange-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-orange-200">Uploads Activos</h3>
                      <p className="text-3xl font-bold text-white">{formatNumber(metrics.activeUploads)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-red-600/20 to-orange-600/20 rounded-xl p-6 border border-red-500/30 hover:border-red-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                      <Bell className="w-6 h-6 text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-red-200">Notificaciones</h3>
                      <p className="text-3xl font-bold text-white">{metrics.pendingApproval}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Storage Usage */}
              <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600/50 hover:border-orange-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10">
                <h3 className="text-xl font-semibold mb-4 text-slate-200">Uso de Almacenamiento</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-orange-400">{metrics.totalSize}</span>
                  <span className="text-sm text-slate-400">de 10 GB disponibles</span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${getStoragePercentage()}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-slate-400 mt-2">
                  <span>0 GB</span>
                  <span>10 GB</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content */}
          {activeTab === "upload" && (
            <div className="animate-fade-in">
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <Upload className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-orange-400">Upload Form</h3>
                    <p className="text-orange-200">Sube y gestiona tu contenido</p>
                  </div>
                </div>
                <UploadForm />
              </div>
            </div>
          )}
          
          {activeTab === "admission" && (
            <div className="animate-fade-in">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <CheckSquare className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-green-400">Sistema de Admisión</h3>
                    <p className="text-green-200">Revisa y aprueba contenido</p>
                  </div>
                </div>
                <FileAdmissionSystem />
              </div>
            </div>
          )}
          
          {activeTab === "notifications" && (
            <div className="animate-fade-in">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Bell className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-blue-400">Notificaciones</h3>
                    <p className="text-blue-200">Mantente al día con las actualizaciones</p>
                  </div>
                </div>
                <NotificationSystem />
              </div>
            </div>
          )}
          
          {activeTab === "preview" && (
            <div className="animate-fade-in">
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Eye className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-purple-400">Vista Previa</h3>
                    <p className="text-purple-200">Explora y visualiza archivos</p>
                  </div>
                </div>
                <FilePreview />
              </div>
            </div>
          )}
          
          {activeTab === "profile" && (
            <div className="animate-fade-in">
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <User className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-red-400">Editor de Perfil</h3>
                    <p className="text-red-200">Personaliza tu perfil y configuración</p>
                  </div>
                </div>
                <ProfileEditor />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 