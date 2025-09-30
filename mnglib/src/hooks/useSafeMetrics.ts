import { useState, useEffect } from 'react';

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

const defaultMetrics: DashboardMetrics = {
  totalUploads: 0,
  pendingApproval: 0,
  approved: 0,
  rejected: 0,
  totalSize: "0 GB",
  totalUsers: 0,
  activeUploads: 0,
  weeklyGrowth: 0
};

export const useSafeMetrics = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>(defaultMetrics);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const newMetrics: DashboardMetrics = {
          totalUploads: 156,
          pendingApproval: 23,
          approved: 89,
          rejected: 12,
          totalSize: "2.4 GB",
          totalUsers: 1247,
          activeUploads: 8,
          weeklyGrowth: 12.5
        };
        
        setMetrics(newMetrics);
      } catch (err) {
        setError('Error loading metrics');
        setMetrics(defaultMetrics);
      } finally {
        setIsLoading(false);
      }
    };

    loadMetrics();
  }, []);

  // Función segura para obtener el porcentaje de almacenamiento
  const getStoragePercentage = (): number => {
    try {
      const sizeString = metrics.totalSize || "0 GB";
      const numericValue = parseFloat(sizeString.replace(/[^\d.]/g, '')) || 0;
      return Math.min((numericValue / 10) * 100, 100);
    } catch (error) {
      return 0;
    }
  };

  // Función segura para formatear números
  const formatNumber = (value: number | string): string => {
    try {
      const num = typeof value === 'string' ? parseFloat(value) : value;
      return isNaN(num) ? '0' : num.toString();
    } catch (error) {
      return '0';
    }
  };

  return {
    metrics,
    isLoading,
    error,
    getStoragePercentage,
    formatNumber
  };
};
