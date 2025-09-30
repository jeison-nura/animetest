"use client";
import React, { useState, useRef } from "react";
import { 
  Edit, 
  Save, 
  X, 
  Camera, 
  User, 
  Mail, 
  Calendar,
  Heart,
  Star,
  Award,
  Activity,
  Shield,
  Settings,
  Bell,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProfileData {
  profileName: string;
  username: string;
  email: string;
  bio: string;
  joinDate: string;
  preferences: {
    notifications: boolean;
    privacy: boolean;
    theme: string;
  };
}

export const ProfileEditor = () => {
  const [profileData, setProfileData] = useState<ProfileData>({
    profileName: "Andres",
    username: "LtDowntownJumper",
    email: "andres@example.com",
    bio: "Apasionado del anime y manga. Amante de las historias épicas y los personajes memorables. Siempre buscando nuevas series para descubrir.",
    joinDate: "Enero 2024",
    preferences: {
      notifications: true,
      privacy: false,
      theme: "dark"
    }
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [showPassword, setShowPassword] = useState(false);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Handle banner image upload
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Handle profile image upload
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    // Handle profile data save
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const tabs = [
    { id: "personal", label: "Personal", icon: <User className="w-4 h-4" /> },
    { id: "preferences", label: "Preferencias", icon: <Settings className="w-4 h-4" /> },
    { id: "security", label: "Seguridad", icon: <Shield className="w-4 h-4" /> },
    { id: "activity", label: "Actividad", icon: <Activity className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-orange-400/20 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-red-400/30 rounded-full animate-ping"></div>
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-orange-300/25 rounded-full animate-bounce"></div>
        <div className="absolute top-60 right-1/3 w-1 h-1 bg-red-300/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-2 h-2 bg-orange-500/15 rounded-full animate-ping"></div>
      </div>

      <div className="max-w-6xl mx-auto p-6 relative z-10">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent">
            Editar perfil
          </h1>
          <p className="text-orange-100">Personaliza tu perfil y configuración</p>
        </div>

        {/* Main Profile Card */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border border-slate-600/50 hover:border-orange-500/30 transition-all duration-500">
          {/* Banner Section */}
          <div className="relative h-56 bg-gradient-to-r from-orange-600 via-red-600 to-orange-500">
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-transparent to-red-500/20 animate-pulse"></div>
            
            {/* Banner Background Pattern */}
            <div 
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: "url('data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 1200 400\'%3E%3Cdefs%3E%3CradialGradient id=\'stars\' cx=\'50%25\' cy=\'50%25\' r=\'50%25\'%3E%3Cstop offset=\'0%25\' stop-color=\'%23fb923c\' stop-opacity=\'0.8\'/%3E%3Cstop offset=\'100%25\' stop-color=\'%23dc2626\' stop-opacity=\'0.6\'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'url(%23stars)\'/%3E%3Ccircle cx=\'200\' cy=\'100\' r=\'2\' fill=\'white\' opacity=\'0.8\'/%3E%3Ccircle cx=\'400\' cy=\'80\' r=\'1.5\' fill=\'white\' opacity=\'0.6\'/%3E%3Ccircle cx=\'600\' cy=\'120\' r=\'1\' fill=\'white\' opacity=\'0.7\'/%3E%3Ccircle cx=\'800\' cy=\'90\' r=\'2.5\' fill=\'white\' opacity=\'0.9\'/%3E%3Ccircle cx=\'1000\' cy=\'110\' r=\'1.8\' fill=\'white\' opacity=\'0.8\'/%3E%3C/svg%3E')"
              }}
            />
            
            {/* Anime-inspired silhouette */}
            <div className="absolute right-0 bottom-0 w-40 h-40 opacity-20">
              <div className="w-full h-full bg-gradient-to-t from-slate-900 to-transparent rounded-tl-full" />
            </div>

            {/* Banner Edit Button */}
            <button
              onClick={() => bannerInputRef.current?.click()}
              className="absolute top-4 right-4 p-3 bg-black/50 hover:bg-black/70 rounded-full transition-all duration-200 hover:scale-110 group"
            >
              <Camera className="w-5 h-5 text-white group-hover:text-orange-400" />
            </button>
            <input
              ref={bannerInputRef}
              type="file"
              accept="image/*"
              onChange={handleBannerChange}
              className="hidden"
            />

            {/* Profile Picture */}
            <div className="absolute -bottom-20 left-8">
              <div className="relative group">
                <div className="w-40 h-40 rounded-full bg-gradient-to-br from-orange-500 to-red-600 p-1 animate-glow">
                  <div className="w-full h-full rounded-full bg-slate-700 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                      <User className="w-16 h-16 text-white" />
                    </div>
                  </div>
                </div>
                
                {/* Profile Picture Edit Button */}
                <button
                  onClick={() => profileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 p-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 rounded-full transition-all duration-200 hover:scale-110 border-4 border-slate-800 group"
                >
                  <Camera className="w-4 h-4 text-white group-hover:animate-pulse" />
                </button>
                <input
                  ref={profileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfileChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-8 pt-28">
            {/* Profile Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600/50 hover:border-orange-500/30 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <Heart className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Favoritos</p>
                    <p className="text-xl font-bold text-white">127</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600/50 hover:border-red-500/30 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Calificaciones</p>
                    <p className="text-xl font-bold text-white">89</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600/50 hover:border-orange-500/30 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Logros</p>
                    <p className="text-xl font-bold text-white">15</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600/50 hover:border-red-500/30 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Miembro desde</p>
                    <p className="text-lg font-bold text-white">Ene 2024</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
              {tabs.map((tab, index) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-3 whitespace-nowrap group relative overflow-hidden ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/25"
                      : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 hover:text-white border border-slate-600/50 hover:border-orange-500/50"
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span className={`text-lg transition-transform duration-300 ${
                    activeTab === tab.id ? "animate-pulse" : "group-hover:scale-110"
                  }`}>{tab.icon}</span>
                  <div className="font-semibold">{tab.label}</div>
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-300 to-red-300 rounded-full animate-pulse"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30">
              {/* Personal Tab */}
              {activeTab === "personal" && (
                <div className="space-y-6 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="profileName" className="text-lg font-semibold text-white mb-3 block">
                        Nombre del perfil
                      </Label>
                      <Input
                        id="profileName"
                        type="text"
                        value={profileData.profileName}
                        onChange={(e) => setProfileData(prev => ({ ...prev, profileName: e.target.value }))}
                        className="bg-slate-600/50 border-slate-500 text-white text-lg font-bold h-12 px-4 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        disabled={!isEditing}
                      />
                      <p className="text-sm text-slate-400 mt-2">
                        Este es el nombre del grupo de tu hogar y puede cambiarse en cualquier momento.
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="username" className="text-lg font-semibold text-white mb-3 block">
                        Nombre de usuario
                      </Label>
                      <Input
                        id="username"
                        type="text"
                        value={profileData.username}
                        onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                        className="bg-slate-600/50 border-slate-500 text-gray-300 text-lg h-12 px-4 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        disabled={!isEditing}
                      />
                      <p className="text-sm text-slate-400 mt-2">
                        Crea un nombre de usuario para futuras experiencias. ¡Elige uno que te encante!
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-lg font-semibold text-white mb-3 block">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                        className="bg-slate-600/50 border-slate-500 text-white h-12 pl-12 pr-4 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio" className="text-lg font-semibold text-white mb-3 block">
                      Biografía
                    </Label>
                    <textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                      className="w-full bg-slate-600/50 border border-slate-500 text-white h-24 px-4 py-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                      disabled={!isEditing}
                      placeholder="Cuéntanos sobre tus animes favoritos, géneros preferidos, o tu experiencia con el anime..."
                    />
                  </div>

                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === "preferences" && (
                <div className="space-y-6 animate-fade-in">
                  <div className="bg-slate-600/30 rounded-xl p-6 border border-slate-500/30">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                      <Bell className="w-6 h-6 text-orange-400" />
                      Notificaciones
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">Notificaciones push</p>
                          <p className="text-slate-400 text-sm">Recibe notificaciones en tu dispositivo</p>
                        </div>
                        <button
                          onClick={() => setProfileData(prev => ({
                            ...prev,
                            preferences: { ...prev.preferences, notifications: !prev.preferences.notifications }
                          }))}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            profileData.preferences.notifications ? 'bg-orange-500' : 'bg-slate-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              profileData.preferences.notifications ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-600/30 rounded-xl p-6 border border-slate-500/30">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                      <Eye className="w-6 h-6 text-red-400" />
                      Privacidad
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">Perfil privado</p>
                          <p className="text-slate-400 text-sm">Oculta tu perfil de otros usuarios</p>
                        </div>
                        <button
                          onClick={() => setProfileData(prev => ({
                            ...prev,
                            preferences: { ...prev.preferences, privacy: !prev.preferences.privacy }
                          }))}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            profileData.preferences.privacy ? 'bg-red-500' : 'bg-slate-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              profileData.preferences.privacy ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-600/30 rounded-xl p-6 border border-slate-500/30">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                      <Settings className="w-6 h-6 text-orange-400" />
                      Apariencia
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-white font-medium mb-2 block">Tema</Label>
                        <select
                          value={profileData.preferences.theme}
                          onChange={(e) => setProfileData(prev => ({
                            ...prev,
                            preferences: { ...prev.preferences, theme: e.target.value }
                          }))}
                          className="w-full bg-slate-600/50 border border-slate-500 text-white h-12 px-4 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          disabled={!isEditing}
                        >
                          <option value="dark">Oscuro</option>
                          <option value="light">Claro</option>
                          <option value="auto">Automático</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <div className="space-y-6 animate-fade-in">
                  <div className="bg-slate-600/30 rounded-xl p-6 border border-slate-500/30">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                      <Lock className="w-6 h-6 text-red-400" />
                      Cambiar contraseña
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-white font-medium mb-2 block">Contraseña actual</Label>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            className="bg-slate-600/50 border-slate-500 text-white h-12 pr-12 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            disabled={!isEditing}
                          />
                          <button
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <Label className="text-white font-medium mb-2 block">Nueva contraseña</Label>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            className="bg-slate-600/50 border-slate-500 text-white h-12 pr-12 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            disabled={!isEditing}
                          />
                          <button
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <Label className="text-white font-medium mb-2 block">Confirmar contraseña</Label>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            className="bg-slate-600/50 border-slate-500 text-white h-12 pr-12 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            disabled={!isEditing}
                          />
                          <button
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-600/30 rounded-xl p-6 border border-slate-500/30">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                      <Shield className="w-6 h-6 text-orange-400" />
                      Autenticación de dos factores
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">2FA habilitado</p>
                          <p className="text-slate-400 text-sm">Protege tu cuenta con autenticación adicional</p>
                        </div>
                        <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors">
                          Configurar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Activity Tab */}
              {activeTab === "activity" && (
                <div className="space-y-6 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-600/30 rounded-xl p-6 border border-slate-500/30">
                      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                        <Activity className="w-6 h-6 text-orange-400" />
                        Actividad reciente
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                          <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                          <div>
                            <p className="text-white text-sm">Inicio de sesión exitoso</p>
                            <p className="text-slate-400 text-xs">Hace 2 horas</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                          <div>
                            <p className="text-white text-sm">Perfil actualizado</p>
                            <p className="text-slate-400 text-xs">Ayer</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                          <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                          <div>
                            <p className="text-white text-sm">Nuevo anime agregado a favoritos</p>
                            <p className="text-slate-400 text-xs">Hace 3 días</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-600/30 rounded-xl p-6 border border-slate-500/30">
                      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                        <Star className="w-6 h-6 text-red-400" />
                        Estadísticas
                      </h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Tiempo total en la plataforma</span>
                          <span className="text-white font-semibold">127 horas</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Series completadas</span>
                          <span className="text-white font-semibold">45</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Episodios vistos</span>
                          <span className="text-white font-semibold">1,247</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Días consecutivos</span>
                          <span className="text-white font-semibold">23</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 border-t border-slate-600/50">
                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25 group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400/0 to-red-400/0 group-hover:from-orange-400/20 group-hover:to-red-400/20 transition-all duration-300"></div>
                    <Edit className="w-4 h-4 mr-2 relative z-10 group-hover:animate-pulse" />
                    <span className="relative z-10">EDITAR</span>
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={handleSave}
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 to-green-500/0 group-hover:from-green-400/20 group-hover:to-green-500/20 transition-all duration-300"></div>
                      <Save className="w-4 h-4 mr-2 relative z-10" />
                      <span className="relative z-10">GUARDAR</span>
                    </Button>
                    <Button
                      onClick={handleCancel}
                      className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-slate-500/25 group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-slate-400/0 to-slate-500/0 group-hover:from-slate-400/20 group-hover:to-slate-500/20 transition-all duration-300"></div>
                      <X className="w-4 h-4 mr-2 relative z-10" />
                      <span className="relative z-10">CANCELAR</span>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 