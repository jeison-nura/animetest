/**
 * Interfaces para componentes UI básicos
 */
import { LucideIcon } from "lucide-react";

/**
 * Interfaz para el componente CircleButton
 */
export interface CircleButtonProps {
  icon: LucideIcon;
  className?: string;
  onClick?: () => void;
}
