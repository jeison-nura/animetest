"use client";
import React, { useState } from "react";
import { Check, X, Eye, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PendingFile {
  id: string;
  name: string;
  type: "anime" | "manga";
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  status: "pending" | "reviewing" | "approved" | "rejected";
  priority: "low" | "medium" | "high";
}

export const FileAdmissionSystem = () => {
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([
    {
      id: "1",
      name: "Naruto_Shippuden_Episode_1.mp4",
      type: "anime",
      size: "450 MB",
      uploadedBy: "user123",
      uploadedAt: "2024-01-15 14:30",
      status: "pending",
      priority: "high"
    },
    {
      id: "2",
      name: "One_Piece_Chapter_1000.pdf",
      type: "manga",
      size: "25 MB",
      uploadedBy: "user456",
      uploadedAt: "2024-01-15 13:45",
      status: "reviewing",
      priority: "medium"
    },
    {
      id: "3",
      name: "Dragon_Ball_Super_Episode_50.mkv",
      type: "anime",
      size: "380 MB",
      uploadedBy: "user789",
      uploadedAt: "2024-01-15 12:20",
      status: "pending",
      priority: "low"
    }
  ]);

  const [selectedFile, setSelectedFile] = useState<PendingFile | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case "reviewing":
        return <Eye className="w-5 h-5 text-blue-400" />;
      case "approved":
        return <Check className="w-5 h-5 text-green-400" />;
      case "rejected":
        return <X className="w-5 h-5 text-red-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-400 bg-red-400/10";
      case "medium":
        return "text-yellow-400 bg-yellow-400/10";
      case "low":
        return "text-green-400 bg-green-400/10";
      default:
        return "text-gray-400 bg-gray-400/10";
    }
  };

  const handleStatusChange = (fileId: string, newStatus: string) => {
            setPendingFiles(prev => 
          prev.map(file => 
            file.id === fileId 
              ? { ...file, status: newStatus as "pending" | "reviewing" | "approved" | "rejected" }
              : file
          )
        );
  };

  const filteredFiles = pendingFiles.filter(file => 
    filterStatus === "all" || file.status === filterStatus
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-100 mb-4">Sistema de Admisión de Archivos</h2>
      
      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {["all", "pending", "reviewing", "approved", "rejected"].map((status) => (
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
             status === "reviewing" ? "Revisando" :
             status === "approved" ? "Aprobados" :
             "Rechazados"}
          </button>
        ))}
      </div>

      {/* Files List */}
      <div className="space-y-3">
        {filteredFiles.map((file) => (
          <div key={file.id} className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {getStatusIcon(file.status)}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(file.priority)}`}>
                    {file.priority === "high" ? "Alta" : 
                     file.priority === "medium" ? "Media" : "Baja"}
                  </span>
                </div>
                
                <div>
                  <p className="text-white font-medium">{file.name}</p>
                  <p className="text-gray-400 text-sm">
                    {file.type === 'anime' ? 'Anime' : 'Manga'} • {file.size} • {file.uploadedBy} • {file.uploadedAt}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {file.status === "pending" && (
                  <>
                    <Button
                      onClick={() => handleStatusChange(file.id, "reviewing")}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm"
                    >
                      Revisar
                    </Button>
                    <Button
                      onClick={() => handleStatusChange(file.id, "approved")}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm"
                    >
                      Aprobar
                    </Button>
                    <Button
                      onClick={() => handleStatusChange(file.id, "rejected")}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-sm"
                    >
                      Rechazar
                    </Button>
                  </>
                )}
                
                {file.status === "reviewing" && (
                  <>
                    <Button
                      onClick={() => handleStatusChange(file.id, "approved")}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm"
                    >
                      Aprobar
                    </Button>
                    <Button
                      onClick={() => handleStatusChange(file.id, "rejected")}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-sm"
                    >
                      Rechazar
                    </Button>
                  </>
                )}
                
                <Button
                  onClick={() => setSelectedFile(file)}
                  className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 text-sm"
                >
                  Ver Detalles
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* File Details Modal */}
      {selectedFile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Detalles del Archivo</h3>
              <button
                onClick={() => setSelectedFile(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4 text-gray-300">
              <div>
                <strong>Nombre:</strong> {selectedFile.name}
              </div>
              <div>
                <strong>Tipo:</strong> {selectedFile.type === 'anime' ? 'Anime' : 'Manga'}
              </div>
              <div>
                <strong>Tamaño:</strong> {selectedFile.size}
              </div>
              <div>
                <strong>Subido por:</strong> {selectedFile.uploadedBy}
              </div>
              <div>
                <strong>Fecha de subida:</strong> {selectedFile.uploadedAt}
              </div>
              <div>
                <strong>Estado:</strong> {selectedFile.status}
              </div>
              <div>
                <strong>Prioridad:</strong> {selectedFile.priority}
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button
                onClick={() => setSelectedFile(null)}
                className="bg-gray-600 hover:bg-gray-500 text-white"
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 