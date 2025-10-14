/**
 * Interfaces para componentes de carrusel
 */

/**
 * Interfaz para los elementos del carrusel
 */
export interface CarouselItem {
  id: number;
  url: string;
  name: string;
}

/**
 * Interfaz para las propiedades del componente CarouselItem
 */
export interface CarouselItemProps {
  item: CarouselItem;
  isActive: boolean;
}

/**
 * Interfaz para las propiedades del componente Carousel
 */
export interface CarouselProps {
  data: {
    items: CarouselItem[];
    interval?: number;
  };
}
