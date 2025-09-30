"use client";

import React, { useState, useCallback, useRef } from "react";
import { Upload, X, FileText, Image, Video, File, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  progress: number;
  status: "uploading" | "success" | "error";
  error?: string;
}

interface AnimeMangaData {
  title: string;
  japaneseTitle: string;
  description: string;
  genre: string[];
  year: number;
  episodes: number;
  type: "anime" | "manga";
  language: string;
  quality: string;
}

export const UploadForm: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [formData, setFormData] = useState<AnimeMangaData>({
    title: "",
    japaneseTitle: "",
    description: "",
    genre: [],
    year: new Date().getFullYear(),
    episodes: 1,
    type: "anime",
    language: "japanese",
    quality: "1080p"
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleFiles = useCallback((files: FileList) => {
    Array.from(files).forEach((file) => {
      if (file.size > 500 * 1024 * 1024) { // 500MB limit
        alert(`El archivo ${file.name} es demasiado grande. Máximo 500MB.`);
        return;
      }

      const newFile: UploadedFile = {
        id: Math.random().toString(36).substring(2, 11),
        file,
        preview: URL.createObjectURL(file),
        progress: 0,
        status: "uploading"
      };

      setUploadedFiles(prev => [...prev, newFile]);
      
      // Simular progreso de upload
      simulateUpload(newFile.id);
    });
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const simulateUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === fileId 
              ? { ...f, progress: 100, status: "success" as const }
              : f
          )
        );
      } else {
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === fileId 
              ? { ...f, progress }
              : f
          )
        );
      }
    }, 200);
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => {
      const file = prev.find(f => f.id === fileId);
      if (file) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return <Image className="w-6 h-6" />;
    if (file.type.startsWith("video/")) return <Video className="w-6 h-6" />;
    return <File className="w-6 h-6" />;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadedFiles.length === 0) {
      alert("Por favor, sube al menos un archivo.");
      return;
    }

    setIsSubmitting(true);
    
    // Simular envío
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    alert("¡Archivos subidos exitosamente! Serán revisados por un administrador.");
    setIsSubmitting(false);
    setCurrentStep(1);
    setUploadedFiles([]);
    setFormData({
      title: "",
      japaneseTitle: "",
      description: "",
      genre: [],
      year: new Date().getFullYear(),
      episodes: 1,
      type: "anime",
      language: "japanese",
      quality: "1080p"
    });
  };

  const addGenre = (genre: string) => {
    if (!formData.genre.includes(genre)) {
      setFormData(prev => ({ ...prev, genre: [...prev.genre, genre] }));
    }
  };

  const removeGenre = (genre: string) => {
    setFormData(prev => ({ ...prev, genre: prev.genre.filter(g => g !== genre) }));
  };

  const predefinedGenres = ["Acción", "Aventura", "Comedia", "Drama", "Fantasía", "Horror", "Misterio", "Romance", "Sci-Fi", "Slice of Life"];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent mb-2">Subir Contenido</h2>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
              currentStep >= step 
                ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/25" 
                : "bg-slate-700 text-slate-300 border border-slate-600"
            }`}>
              {step}
            </div>
            {step < 3 && (
              <div className={`w-16 h-1 mx-2 rounded-full transition-all duration-300 ${
                currentStep > step ? "bg-gradient-to-r from-orange-500 to-red-600" : "bg-slate-600"
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: File Upload */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
              dragActive
                ? "border-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/25"
                : "border-slate-600 hover:border-orange-500 bg-slate-800/30 hover:bg-slate-700/30 hover:shadow-lg hover:shadow-orange-500/10"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-16 h-16 text-orange-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Arrastra y suelta archivos aquí
            </h3>
            <p className="text-slate-300 mb-4">
              o haz clic para seleccionar archivos
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300"
            >
              Seleccionar Archivos
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
              className="hidden"
              accept=".mp4,.avi,.mkv,.jpg,.jpeg,.png,.pdf,.epub,.cbz,.cbr"
            />
          </div>

          {/* File List */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-[#030303]">Archivos Subidos</h4>
              <div className="grid gap-4">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="bg-[#F1EFEC]/50 rounded-lg p-4 border border-[#D4C9BE]/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-[#123458]" aria-label="File type icon">
                          {getFileIcon(file.file)}
                        </div>
                        <div>
                          <p className="font-medium text-[#030303]">{file.file.name}</p>
                          <p className="text-sm text-[#123458]">
                            {(file.file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {/* Progress Bar */}
                        <div className="w-24 bg-[#D4C9BE] rounded-full h-2">
                          <div
                            className="bg-[#123458] h-2 rounded-full transition-all duration-300"
                            style={{ width: `${file.progress}%` }}
                          />
                        </div>
                        
                        {/* Status */}
                        {file.status === "uploading" && (
                          <span className="text-[#D4C9BE] text-sm">
                            {Math.round(file.progress)}%
                          </span>
                        )}
                        {file.status === "success" && (
                          <CheckCircle className="w-5 h-5 text-[#123458]" />
                        )}
                        {file.status === "error" && (
                          <AlertCircle className="w-5 h-5 text-red-400" />
                        )}
                        
                        <Button
                          onClick={() => removeFile(file.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button
                onClick={() => setCurrentStep(2)}
                disabled={uploadedFiles.some(f => f.status !== "success")}
                className="w-full bg-[#123458] hover:bg-[#123458]/80 text-[#F1EFEC] py-3"
              >
                Continuar con la Información
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Content Information */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-[#030303]">Información del Contenido</h3>
          
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="title" className="text-[#030303]">Título</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Título del anime/manga"
                  className="bg-[#F1EFEC] border-[#D4C9BE] text-[#030303]"
                />
              </div>
              
              <div>
                <Label htmlFor="japaneseTitle" className="text-[#030303]">Título Japonés</Label>
                <Input
                  id="japaneseTitle"
                  value={formData.japaneseTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, japaneseTitle: e.target.value }))}
                  placeholder="Título en japonés (opcional)"
                  className="bg-[#F1EFEC] border-[#D4C9BE] text-[#030303]"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-[#030303]">Descripción</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe brevemente el contenido..."
                className="w-full h-24 bg-[#F1EFEC] border border-[#D4C9BE] rounded-md p-3 text-[#030303] resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="type" className="text-[#030303]">Tipo</Label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as "anime" | "manga" }))}
                  className="w-full bg-[#F1EFEC] border border-[#D4C9BE] rounded-md p-3 text-[#030303]"
                >
                  <option value="anime">Anime</option>
                  <option value="manga">Manga</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="year" className="text-[#030303]">Año</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                  min="1900"
                  max={new Date().getFullYear()}
                  className="bg-[#F1EFEC] border-[#D4C9BE] text-[#030303]"
                />
              </div>
              
              <div>
                <Label htmlFor="episodes" className="text-[#030303]">Episodios/Capítulos</Label>
                <Input
                  id="episodes"
                  type="number"
                  value={formData.episodes}
                  onChange={(e) => setFormData(prev => ({ ...prev, episodes: parseInt(e.target.value) }))}
                  min="1"
                  className="bg-[#F1EFEC] border-[#D4C9BE] text-[#030303]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="language" className="text-[#030303]">Idioma</Label>
                <select
                  id="language"
                  value={formData.language}
                  onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                  className="w-full bg-[#F1EFEC] border border-[#D4C9BE] rounded-md p-3 text-[#030303]"
                >
                  <option value="japanese">Japonés</option>
                  <option value="english">Inglés</option>
                  <option value="spanish">Español</option>
                  <option value="french">Francés</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="quality" className="text-[#030303]">Calidad</Label>
                <select
                  id="quality"
                  value={formData.quality}
                  onChange={(e) => setFormData(prev => ({ ...prev, quality: e.target.value }))}
                  className="w-full bg-[#F1EFEC] border border-[#D4C9BE] rounded-md p-3 text-[#030303]"
                >
                  <option value="480p">480p</option>
                  <option value="720p">720p</option>
                  <option value="1080p">1080p</option>
                  <option value="4K">4K</option>
                </select>
              </div>
            </div>

            <div>
              <Label className="text-[#030303]">Géneros</Label>
              <div className="mt-2 space-y-3">
                <div className="flex flex-wrap gap-2">
                  {predefinedGenres.map((genre) => (
                    <button
                      key={genre}
                      type="button"
                      onClick={() => addGenre(genre)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        formData.genre.includes(genre)
                          ? "bg-[#123458] text-[#F1EFEC]"
                          : "bg-[#D4C9BE] text-[#030303] hover:bg-[#D4C9BE]/80"
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
                
                {formData.genre.length > 0 && (
                  <div className="mt-3">
                    <Label className="text-[#030303] text-sm">Géneros seleccionados:</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.genre.map((genre) => (
                        <span
                          key={genre}
                          className="px-3 py-1 bg-[#123458] text-[#F1EFEC] rounded-full text-sm flex items-center gap-2"
                        >
                          {genre}
                          <button
                            type="button"
                            onClick={() => removeGenre(genre)}
                            className="hover:text-[#D4C9BE]"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-4 pt-4">
              <Button
                type="button"
                onClick={() => setCurrentStep(1)}
                variant="outline"
                className="flex-1 border-[#D4C9BE] text-[#030303] hover:bg-[#F1EFEC]"
              >
                Atrás
              </Button>
              <Button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="flex-1 bg-[#123458] hover:bg-[#123458]/80 text-[#F1EFEC]"
                disabled={!formData.title || formData.genre.length === 0}
              >
                Revisar y Enviar
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Step 3: Review and Submit */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-[#030303]">Revisar y Enviar</h3>
          
          <div className="bg-[#F1EFEC]/50 rounded-lg p-6 border border-[#D4C9BE]/50">
            <h4 className="text-lg font-semibold text-[#030303] mb-4">Resumen del Envío</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium text-[#123458] mb-2">Información del Contenido</h5>
                <div className="space-y-2 text-sm">
                  <p><span className="text-[#123458]">Título:</span> {formData.title}</p>
                  <p><span className="text-[#123458]">Título Japonés:</span> {formData.japaneseTitle || "N/A"}</p>
                  <p><span className="text-[#123458]">Tipo:</span> {formData.type === "anime" ? "Anime" : "Manga"}</p>
                  <p><span className="text-[#123458]">Año:</span> {formData.year}</p>
                  <p><span className="text-[#123458]">Episodios/Capítulos:</span> {formData.episodes}</p>
                  <p><span className="text-[#123458]">Idioma:</span> {formData.language}</p>
                  <p><span className="text-[#123458]">Calidad:</span> {formData.quality}</p>
                </div>
              </div>
              
              <div>
                <h5 className="font-medium text-[#123458] mb-2">Archivos</h5>
                <div className="space-y-2">
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="flex items-center space-x-2 text-sm">
                      <FileText className="w-4 h-4 text-[#123458]" />
                      <span className="text-[#030303]">{file.file.name}</span>
                      <span className="text-[#123458]">
                        ({(file.file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4">
                  <h5 className="font-medium text-[#123458] mb-2">Géneros</h5>
                  <div className="flex flex-wrap gap-2">
                    {formData.genre.map((genre) => (
                      <span
                        key={genre}
                        className="px-2 py-1 bg-[#123458]/20 text-[#123458] rounded text-xs border border-[#123458]/30"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {formData.description && (
              <div className="mt-6">
                <h5 className="font-medium text-[#123458] mb-2">Descripción</h5>
                <p className="text-[#030303] text-sm">{formData.description}</p>
              </div>
            )}
          </div>

          <div className="flex space-x-4">
            <Button
              type="button"
              onClick={() => setCurrentStep(2)}
              variant="outline"
              className="flex-1 border-[#D4C9BE] text-[#030303] hover:bg-[#F1EFEC]"
            >
              Atrás
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-[#123458] hover:bg-[#123458]/80 text-[#F1EFEC] py-3"
            >
              {isSubmitting ? "Enviando..." : "Enviar para Revisión"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}; 