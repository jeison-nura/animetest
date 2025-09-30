"use client";
import React, { useState } from "react";
import { Eye, Download, Play, FileText, Image as ImageIcon, Video, File, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PreviewFile {
  id: string;
  name: string;
  type: "anime" | "manga";
  fileType: "video" | "image" | "document" | "archive";
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  status: "pending" | "approved" | "rejected";
  thumbnail?: string;
  description?: string;
  tags: string[];
}

export const FilePreview = () => {
  const [previewFiles] = useState<PreviewFile[]>([
    {
      id: "1",
      name: "Naruto_Shippuden_Episode_1.mp4",
      type: "anime",
      fileType: "video",
      size: "450 MB",
      uploadedBy: "user123",
      uploadedAt: "2024-01-15 14:30",
      status: "pending",
      description: "Episodio 1 de Naruto Shippuden - La llegada de Sasuke",
      tags: ["Naruto", "Shippuden", "Episodio 1", "Acción", "Ninja"]
    },
    {
      id: "2",
      name: "One_Piece_Chapter_1000.pdf",
      type: "manga",
      fileType: "document",
      size: "25 MB",
      uploadedBy: "user456",
      uploadedAt: "2024-01-15 13:45",
      status: "approved",
      description: "Capítulo 1000 de One Piece - Un momento histórico",
      tags: ["One Piece", "Capítulo 1000", "Aventura", "Piratas"]
    },
    {
      id: "3",
      name: "Dragon_Ball_Super_Episode_50.mkv",
      type: "anime",
      fileType: "video",
      size: "380 MB",
      uploadedBy: "user789",
      uploadedAt: "2024-01-15 12:20",
      status: "pending",
      description: "Episodio 50 de Dragon Ball Super - La batalla final",
      tags: ["Dragon Ball", "Super", "Episodio 50", "Pelea", "Transformación"]
    },
    {
      id: "4",
      name: "Attack_on_Titan_Season_4_01.jpg",
      type: "anime",
      fileType: "image",
      size: "2.5 MB",
      uploadedBy: "user101",
      uploadedAt: "2024-01-15 11:15",
      status: "approved",
      description: "Imagen promocional de la temporada 4 de Attack on Titan",
      tags: ["Attack on Titan", "Temporada 4", "Imagen", "Promocional"]
    }
  ]);

  const [selectedFile, setSelectedFile] = useState<PreviewFile | null>(null);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const getFileTypeIcon = (fileType: string) => {
    switch (fileType) {
      case "video":
        return <Video className="w-6 h-6 text-red-400" />;
      case "image":
        return <ImageIcon className="w-6 h-6 text-green-400" />;
      case "document":
        return <FileText className="w-6 h-6 text-blue-400" />;
      case "archive":
        return <File className="w-6 h-6 text-yellow-400" />;
      default:
        return <File className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-400 bg-yellow-400/10";
      case "approved":
        return "text-green-400 bg-green-400/10";
      case "rejected":
        return "text-red-400 bg-red-400/10";
      default:
        return "text-gray-400 bg-gray-400/10";
    }
  };

  const filteredFiles = previewFiles.filter(file => 
    (filterType === "all" || file.type === filterType) &&
    (filterStatus === "all" || file.status === filterStatus)
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-100 mb-4">Vista Previa de Archivos</h2>
      
      {/* Filters */}
      <div className="flex gap-2 mb-6">
        <div className="flex gap-2">
          <span className="text-gray-300 text-sm font-medium">Tipo:</span>
          {["all", "anime", "manga"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterType === type
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {type === "all" ? "Todos" : type === "anime" ? "Anime" : "Manga"}
            </button>
          ))}
        </div>
        
        <div className="flex gap-2 ml-4">
          <span className="text-gray-300 text-sm font-medium">Estado:</span>
          {["all", "pending", "approved", "rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === status
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {status === "all" ? "Todos" : 
               status === "pending" ? "Pendientes" :
               status === "approved" ? "Aprobados" :
               "Rechazados"}
            </button>
          ))}
        </div>
      </div>

      {/* Files Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFiles.map((file) => (
          <div key={file.id} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors">
            {/* File Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                {getFileTypeIcon(file.fileType)}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(file.status)}`}>
                  {file.status === "pending" ? "Pendiente" : 
                   file.status === "approved" ? "Aprobado" : "Rechazado"}
                </span>
              </div>
            </div>
            
            {/* File Info */}
            <div className="mb-3">
              <h4 className="text-white font-medium text-sm mb-1 line-clamp-2">{file.name}</h4>
              <p className="text-gray-400 text-xs mb-2">
                {file.size} • {file.uploadedBy} • {file.uploadedAt}
              </p>
              {file.description && (
                <p className="text-gray-300 text-xs line-clamp-2">{file.description}</p>
              )}
            </div>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-3">
              {file.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="bg-gray-600 text-gray-300 text-xs px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
              {file.tags.length > 3 && (
                <span className="bg-gray-600 text-gray-300 text-xs px-2 py-1 rounded">
                  +{file.tags.length - 3}
                </span>
              )}
            </div>
            
            {/* Actions */}
            <div className="flex gap-2">
              <Button
                onClick={() => setSelectedFile(file)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-xs flex-1"
              >
                <Eye className="w-3 h-3 mr-1" />
                Vista Previa
              </Button>
              
              {file.fileType === "video" && (
                <Button className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 text-xs">
                  <Play className="w-3 h-3" />
                </Button>
              )}
              
              <Button className="bg-gray-600 hover:bg-gray-500 text-white px-2 py-1 text-xs">
                <Download className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {selectedFile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Vista Previa: {selectedFile.name}</h3>
              <button
                onClick={() => setSelectedFile(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Preview Area */}
              <div className="space-y-4">
                <div className="bg-gray-700 rounded-lg p-4 min-h-[300px] flex items-center justify-center">
                  {selectedFile.fileType === "video" ? (
                    <div className="text-center">
                      <Video className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-300">Vista previa de video no disponible</p>
                      <p className="text-gray-400 text-sm">Archivo: {selectedFile.name}</p>
                    </div>
                  ) : selectedFile.fileType === "image" ? (
                    <div className="text-center">
                      <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-300">Vista previa de imagen no disponible</p>
                      <p className="text-gray-400 text-sm">Archivo: {selectedFile.name}</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <FileText className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-300">Vista previa de documento no disponible</p>
                      <p className="text-gray-400 text-sm">Archivo: {selectedFile.name}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2">
                    <Play className="w-4 h-4 mr-2" />
                    Reproducir
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2">
                    <Download className="w-4 h-4 mr-2" />
                    Descargar
                  </Button>
                </div>
              </div>
              
              {/* File Details */}
              <div className="space-y-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-3">Información del Archivo</h4>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div><strong>Nombre:</strong> {selectedFile.name}</div>
                    <div><strong>Tipo:</strong> {selectedFile.type === 'anime' ? 'Anime' : 'Manga'}</div>
                    <div><strong>Formato:</strong> {selectedFile.fileType}</div>
                    <div><strong>Tamaño:</strong> {selectedFile.size}</div>
                    <div><strong>Subido por:</strong> {selectedFile.uploadedBy}</div>
                    <div><strong>Fecha:</strong> {selectedFile.uploadedAt}</div>
                    <div><strong>Estado:</strong> {selectedFile.status}</div>
                  </div>
                </div>
                
                {selectedFile.description && (
                  <div className="bg-gray-700 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-3">Descripción</h4>
                    <p className="text-gray-300 text-sm">{selectedFile.description}</p>
                  </div>
                )}
                
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-3">Etiquetas</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedFile.tags.map((tag, index) => (
                      <span key={index} className="bg-gray-600 text-gray-300 text-xs px-3 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 