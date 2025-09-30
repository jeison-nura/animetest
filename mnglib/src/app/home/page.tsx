"use client";

import { useState, useEffect } from "react";
import { Play, Bookmark, Star, Search, Flag, User } from "lucide-react";
import { BookmarkProvider } from "@/contexts/BookmarkContext";
import { BookmarkButton } from "@/components/ui/BookmarkButton";

interface AnimeCard {
  id: number;
  title: string;
  japaneseTitle?: string;
  image: string;
  rating: number;
  episodes: number;
  seasons: number;
  type: "Sub | Dob" | "Subtitulado +" | "SEASON 3";
  languages: string[]; // Array de códigos de idioma como ["en", "es", "fr"]
  description: string;
  genre: string[];
  year: number;
  status: "En emisión" | "Finalizado" | "Próximamente";
}

const animeData: AnimeCard[] = [
  {
    id: 1,
    title: "MY HERO ACADEMIA",
    japaneseTitle: "僕のヒーローアカデミア",
    image: "https://static.zerochan.net/Mirai.Nikki.full.935960.jpg",
    rating: 4.8,
    episodes: 25,
    seasons: 6,
    type: "Sub | Dob",
    languages: ["en", "es", "fr"],
    description: "En un mundo donde la mayoría de las personas nacen con superpoderes llamados 'Quirks', Izuku Midoriya sueña con convertirse en un héroe profesional.",
    genre: ["Acción", "Superhéroes", "Escuela"],
    year: 2016,
    status: "En emisión"
  },
  {
    id: 2,
    title: "Attack on Titan",
    japaneseTitle: "進撃の巨人",
    image: "https://static.zerochan.net/Mirai.Nikki.full.935960.jpg",
    rating: 4.9,
    episodes: 25,
    seasons: 4,
    type: "Sub | Dob",
    languages: ["en", "es", "de"],
    description: "La humanidad vive dentro de ciudades rodeadas por enormes muros debido a la amenaza de los Titanes, gigantes humanoides que devoran humanos.",
    genre: ["Acción", "Drama", "Fantasía"],
    year: 2013,
    status: "Finalizado"
  },
  {
    id: 3,
    title: "Black Clover",
    japaneseTitle: "ブラッククローバー",
    image: "https://static.zerochan.net/Mirai.Nikki.full.935960.jpg",
    rating: 4.6,
    episodes: 170,
    seasons: 1,
    type: "Sub | Dob",
    languages: ["en", "es", "pt"],
    description: "Asta y Yuno nacieron el mismo día en un orfanato. Asta no tiene magia, pero Yuno es un genio mágico prodigioso.",
    genre: ["Acción", "Fantasía", "Magia"],
    year: 2017,
    status: "En emisión"
  },
  {
    id: 4,
    title: "Naruto Shippuden",
    japaneseTitle: "ナルト 疾風伝",
    image: "https://static.zerochan.net/Mirai.Nikki.full.935960.jpg",
    rating: 4.7,
    episodes: 500,
    seasons: 17,
    type: "Subtitulado +",
    languages: ["en", "es", "it"],
    description: "Naruto Uzumaki regresa a Konoha después de dos años de entrenamiento con Jiraiya, listo para enfrentar nuevos desafíos.",
    genre: ["Acción", "Aventura", "Ninja"],
    year: 2007,
    status: "Finalizado"
  },
  {
    id: 5,
    title: "FIRE FORCE",
    japaneseTitle: "炎炎ノ消防隊",
    image: "https://static.zerochan.net/Mirai.Nikki.full.935960.jpg",
    rating: 4.5,
    episodes: 24,
    seasons: 3,
    type: "SEASON 3",
    languages: ["en", "es", "fr"],
    description: "En un mundo donde la humanidad sufre de combustión espontánea, los bomberos especiales luchan contra las llamas y los demonios.",
    genre: ["Acción", "Fantasía", "Ciencia Ficción"],
    year: 2019,
    status: "En emisión"
  },
  {
    id: 6,
    title: "DRAGON BALL Z",
    japaneseTitle: "ドラゴンボールZ",
    image: "https://static.zerochan.net/Mirai.Nikki.full.935960.jpg",
    rating: 4.9,
    episodes: 291,
    seasons: 9,
    type: "Sub | Dob",
    languages: ["en", "es", "fr"],
    description: "Goku y sus amigos protegen la Tierra de amenazas cada vez más poderosas, desde Saiyans hasta androides y criaturas mágicas.",
    genre: ["Acción", "Aventura", "Superhéroes"],
    year: 1989,
    status: "Finalizado"
  },
  {
    id: 7,
    title: "Demon Slayer",
    japaneseTitle: "鬼滅の刃",
    image: "https://static.zerochan.net/Mirai.Nikki.full.935960.jpg",
    rating: 4.7,
    episodes: 26,
    seasons: 2,
    type: "Subtitulado +",
    languages: ["en", "es", "de"],
    description: "Tanjiro Kamado es un joven que se convierte en cazador de demonios después de que su familia es asesinada y su hermana se convierte en demonio.",
    genre: ["Acción", "Supernatural", "Histórico"],
    year: 2019,
    status: "En emisión"
  },
  {
    id: 8,
    title: "One Piece",
    japaneseTitle: "ワンピース",
    image: "https://static.zerochan.net/Mirai.Nikki.full.935960.jpg",
    rating: 4.9,
    episodes: 1000,
    seasons: 20,
    type: "Sub | Dob",
    languages: ["en", "es", "pt"],
    description: "Monkey D. Luffy y su tripulación de piratas buscan el tesoro más grande del mundo, el One Piece, para convertirse en el próximo Rey de los Piratas.",
    genre: ["Aventura", "Acción", "Comedia"],
    year: 1999,
    status: "En emisión"
  },
  {
    id: 9,
    title: "Jujutsu Kaisen",
    japaneseTitle: "呪術廻戦",
    image: "https://static.zerochan.net/Mirai.Nikki.full.935960.jpg",
    rating: 4.8,
    episodes: 24,
    seasons: 2,
    type: "Subtitulado +",
    languages: ["en", "es", "fr"],
    description: "Yuji Itadori se une a una organización secreta de hechiceros para luchar contra maldiciones y demonios después de tragarse un dedo de Ryomen Sukuna.",
    genre: ["Acción", "Supernatural", "Escuela"],
    year: 2020,
    status: "En emisión"
  },
  {
    id: 10,
    title: "Tokyo Ghoul",
    japaneseTitle: "東京喰種",
    image: "https://static.zerochan.net/Mirai.Nikki.full.935960.jpg",
    rating: 4.5,
    episodes: 12,
    seasons: 2,
    type: "Sub | Dob",
    languages: ["en", "es", "it"],
    description: "Ken Kaneki se convierte en un ghoul híbrido después de un accidente y debe aprender a sobrevivir en un mundo donde los ghouls se alimentan de humanos.",
    genre: ["Acción", "Horror", "Psicológico"],
    year: 2014,
    status: "Finalizado"
  },
  {
    id: 11,
    title: "Death Note",
    japaneseTitle: "デスノート",
    image: "https://static.zerochan.net/Mirai.Nikki.full.935960.jpg",
    rating: 4.9,
    episodes: 37,
    seasons: 1,
    type: "Sub | Dob",
    languages: ["en", "es", "de"],
    description: "Light Yagami encuentra un cuaderno sobrenatural que le permite matar a cualquiera escribiendo su nombre, y decide usarlo para crear un mundo perfecto.",
    genre: ["Psicológico", "Thriller", "Supernatural"],
    year: 2006,
    status: "Finalizado"
  },
  {
    id: 12,
    title: "Fullmetal Alchemist",
    japaneseTitle: "鋼の錬金術師",
    image: "https://static.zerochan.net/Mirai.Nikki.full.935960.jpg",
    rating: 4.9,
    episodes: 64,
    seasons: 1,
    type: "Sub | Dob",
    languages: ["en", "es", "fr"],
    description: "Los hermanos Edward y Alphonse Elric buscan la Piedra Filosofal para restaurar sus cuerpos después de un experimento de alquimia fallido.",
    genre: ["Aventura", "Drama", "Fantasía"],
    year: 2003,
    status: "Finalizado"
  },
  {
    id: 13,
    title: "Hunter x Hunter",
    japaneseTitle: "ハンター×ハンター",
    image: "https://static.zerochan.net/Mirai.Nikki.full.935960.jpg",
    rating: 4.8,
    episodes: 148,
    seasons: 1,
    type: "Sub | Dob",
    languages: ["en", "es", "pt"],
    description: "Gon Freecss se embarca en una aventura para convertirse en Hunter y encontrar a su padre, mientras descubre un mundo lleno de peligros y misterios.",
    genre: ["Aventura", "Acción", "Fantasía"],
    year: 2011,
    status: "Finalizado"
  },
  {
    id: 14,
    title: "Steins;Gate",
    japaneseTitle: "シュタインズ・ゲート",
    image: "https://static.zerochan.net/Mirai.Nikki.full.935960.jpg",
    rating: 4.9,
    episodes: 24,
    seasons: 1,
    type: "Sub | Dob",
    languages: ["en", "es", "de"],
    description: "Rintaro Okabe y sus amigos accidentalmente crean una máquina del tiempo usando un microondas, lo que lleva a consecuencias imprevistas.",
    genre: ["Ciencia Ficción", "Thriller", "Romance"],
    year: 2011,
    status: "Finalizado"
  },
  {
    id: 15,
    title: "Code Geass",
    japaneseTitle: "コードギアス",
    image: "https://static.zerochan.net/Mirai.Nikki.full.935960.jpg",
    rating: 4.7,
    episodes: 25,
    seasons: 2,
    type: "Sub | Dob",
    languages: ["en", "es", "fr"],
    description: "Lelouch Lamperouge obtiene el poder de Geass y lidera una rebelión contra el Imperio Britannian para vengar a su hermana y crear un mundo mejor.",
    genre: ["Mecha", "Acción", "Psicológico"],
    year: 2006,
    status: "Finalizado"
  },
  {
    id: 16,
    title: "Your Name",
    japaneseTitle: "君の名は。",
    image: "https://static.zerochan.net/Mirai.Nikki.full.935960.jpg",
    rating: 4.8,
    episodes: 1,
    seasons: 1,
    type: "Sub | Dob",
    languages: ["en", "es", "fr"],
    description: "Taki y Mitsuha, dos adolescentes que viven en diferentes lugares, comienzan a intercambiar cuerpos de manera misteriosa.",
    genre: ["Romance", "Drama", "Fantasía"],
    year: 2016,
    status: "Finalizado"
  },
  {
    id: 17,
    title: "Spirited Away",
    japaneseTitle: "千と千尋の神隠し",
    image: "https://static.zerochan.net/Mirai.Nikki.full.935960.jpg",
    rating: 4.9,
    episodes: 1,
    seasons: 1,
    type: "Sub | Dob",
    languages: ["en", "es", "fr"],
    description: "Chihiro se encuentra atrapada en un mundo espiritual y debe trabajar en un baño para los dioses para salvar a sus padres y regresar al mundo real.",
    genre: ["Fantasía", "Aventura", "Familiar"],
    year: 2001,
    status: "Finalizado"
  },
  {
    id: 18,
    title: "Akira",
    japaneseTitle: "アキラ",
    image: "https://static.zerochan.net/Mirai.Nikki.full.935960.jpg",
    rating: 4.7,
    episodes: 1,
    seasons: 1,
    type: "Sub | Dob",
    languages: ["en", "es", "de"],
    description: "En Neo-Tokyo, un motociclista se ve envuelto en un experimento gubernamental que desata poderes psíquicos devastadores.",
    genre: ["Ciencia Ficción", "Acción", "Psicológico"],
    year: 1988,
    status: "Finalizado"
  },
  {
    id: 19,
    title: "Ghost in the Shell",
    japaneseTitle: "攻殻機動隊",
    image: "https://static.zerochan.net/Mirai.Nikki.full.935960.jpg",
    rating: 4.6,
    episodes: 1,
    seasons: 1,
    type: "Sub | Dob",
    languages: ["en", "es", "fr"],
    description: "En un futuro ciberpunk, la mayor Motoko Kusanagi investiga crímenes relacionados con la tecnología y la identidad humana.",
    genre: ["Ciencia Ficción", "Acción", "Filosófico"],
    year: 1995,
    status: "Finalizado"
  },
  {
    id: 20,
    title: "Neon Genesis Evangelion",
    japaneseTitle: "新世紀エヴァンゲリオン",
    image: "https://static.zerochan.net/Mirai.Nikki.full.935960.jpg",
    rating: 4.8,
    episodes: 26,
    seasons: 1,
    type: "Sub | Dob",
    languages: ["en", "es", "fr"],
    description: "Shinji Ikari pilotea un mecha gigante para luchar contra ángeles misteriosos mientras lidia con traumas psicológicos profundos.",
    genre: ["Mecha", "Psicológico", "Drama"],
    year: 1995,
    status: "Finalizado"
  },
  {
    id: 21,
    title: "Cowboy Bebop",
    japaneseTitle: "カウボーイビバップ",
    image: "https://static.zerochan.net/Mirai.Nikki.full.935960.jpg",
    rating: 4.9,
    episodes: 26,
    seasons: 1,
    type: "Sub | Dob",
    languages: ["en", "es", "fr"],
    description: "Un grupo de cazarrecompensas viaja por el espacio en su nave Bebop, persiguiendo criminales mientras lidian con sus pasados.",
    genre: ["Ciencia Ficción", "Acción", "Jazz"],
    year: 1998,
    status: "Finalizado"
  },
  {
    id: 22,
    title: "Bleach",
    japaneseTitle: "ブリーチ",
    image: "https://static.zerochan.net/Mirai.Nikki.full.935960.jpg",
    rating: 4.6,
    episodes: 366,
    seasons: 1,
    type: "Sub | Dob",
    languages: ["en", "es", "pt"],
    description: "Ichigo Kurosaki se convierte en Shinigami y protege a los vivos de los Hollows mientras descubre secretos sobre su pasado.",
    genre: ["Acción", "Supernatural", "Escuela"],
    year: 2004,
    status: "Finalizado"
  },
  {
    id: 23,
    title: "Fairy Tail",
    japaneseTitle: "フェアリーテイル",
    image: "https://static.zerochan.net/Mirai.Nikki.full.935960.jpg",
    rating: 4.5,
    episodes: 328,
    seasons: 1,
    type: "Sub | Dob",
    languages: ["en", "es", "fr"],
    description: "Natsu Dragneel y sus compañeros de la guild Fairy Tail realizan misiones mágicas mientras forman fuertes lazos de amistad.",
    genre: ["Aventura", "Acción", "Fantasía"],
    year: 2009,
    status: "Finalizado"
  },
  {
    id: 24,
    title: "Sword Art Online",
    japaneseTitle: "ソードアート・オンライン",
    image: "https://static.zerochan.net/Mirai.Nikki.full.935960.jpg",
    rating: 4.4,
    episodes: 25,
    seasons: 4,
    type: "Sub | Dob",
    languages: ["en", "es", "de"],
    description: "Kirito queda atrapado en un videojuego de realidad virtual donde la muerte en el juego significa la muerte real.",
    genre: ["Acción", "Romance", "Ciencia Ficción"],
    year: 2012,
    status: "Finalizado"
  },
  {
    id: 25,
    title: "The Promised Neverland",
    japaneseTitle: "約束のネバーランド",
    image: "https://static.zerochan.net/Mirai.Nikki.full.935960.jpg",
    rating: 4.7,
    episodes: 12,
    seasons: 2,
    type: "Sub | Dob",
    languages: ["en", "es", "fr"],
    description: "Emma y sus amigos descubren que su orfanato es en realidad una granja donde los niños son criados como alimento para demonios.",
    genre: ["Thriller", "Psicológico", "Fantasía"],
    year: 2019,
    status: "Finalizado"
  },
  {
    id: 26,
    title: "Mob Psycho 100",
    japaneseTitle: "モブサイコ100",
    image: "https://static.zerochan.net/Mirai.Nikki.full.935960.jpg",
    rating: 4.8,
    episodes: 25,
    seasons: 3,
    type: "Sub | Dob",
    languages: ["en", "es", "pt"],
    description: "Shigeo Kageyama, un estudiante con poderes psíquicos, trabaja para un falso espiritista mientras aprende a controlar sus emociones.",
    genre: ["Acción", "Comedia", "Supernatural"],
    year: 2016,
    status: "Finalizado"
  },
  {
    id: 27,
    title: "One Punch Man",
    japaneseTitle: "ワンパンマン",
    image: "https://static.zerochan.net/Mirai.Nikki.full.935960.jpg",
    rating: 4.7,
    episodes: 24,
    seasons: 2,
    type: "Sub | Dob",
    languages: ["en", "es", "fr"],
    description: "Saitama es un héroe tan poderoso que puede derrotar a cualquier enemigo con un solo puñetazo, pero está aburrido de la falta de desafío.",
    genre: ["Acción", "Comedia", "Superhéroes"],
    year: 2015,
    status: "En emisión"
  },
  {
    id: 28,
    title: "Re:Zero",
    japaneseTitle: "Re:ゼロから始める異世界生活",
    image: "https://static.zerochan.net/Mirai.Nikki.full.935960.jpg",
    rating: 4.6,
    episodes: 25,
    seasons: 2,
    type: "Sub | Dob",
    languages: ["en", "es", "de"],
    description: "Subaru Natsuki es transportado a un mundo de fantasía donde tiene el poder de volver en el tiempo al morir, pero debe mantenerlo en secreto.",
    genre: ["Fantasía", "Drama", "Romance"],
    year: 2016,
    status: "En emisión"
  },
  {
    id: 29,
    title: "Konosuba",
    japaneseTitle: "この素晴らしい世界に祝福を！",
    image: "https://static.zerochan.net/Mirai.Nikki.full.935960.jpg",
    rating: 4.5,
    episodes: 20,
    seasons: 2,
    type: "Sub | Dob",
    languages: ["en", "es", "fr"],
    description: "Kazuma Sato muere de manera vergonzosa y es enviado a un mundo de fantasía con una diosa inútil, donde forma un grupo de aventureros incompetentes.",
    genre: ["Comedia", "Fantasía", "Aventura"],
    year: 2016,
    status: "Finalizado"
  },
  {
    id: 30,
    title: "That Time I Got Reincarnated as a Slime",
    japaneseTitle: "転生したらスライムだった件",
    image: "https://static.zerochan.net/Mirai.Nikki.full.935960.jpg",
    rating: 4.6,
    episodes: 24,
    seasons: 2,
    type: "Sub | Dob",
    languages: ["en", "es", "pt"],
    description: "Satoru Mikami es asesinado y reencarna como un slime en un mundo de fantasía, donde construye una nación de monstruos.",
    genre: ["Fantasía", "Isekai", "Aventura"],
    year: 2018,
    status: "En emisión"
  }
];

export default function HomePage() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);

  const handleMouseEnter = (animeId: number) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setHoveredCard(animeId);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setHoveredCard(null);
    }, 150); // Retraso de 150ms
    setHoverTimeout(timeout);
  };

  const handleMenuMouseEnter = (animeId: number) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setHoveredCard(animeId);
  };

  const handleMenuMouseLeave = () => {
    const timeout = setTimeout(() => {
      setHoveredCard(null);
    }, 150);
    setHoverTimeout(timeout);
  };

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  // Rotación automática del carrusel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCarouselIndex((prevIndex) => 
        (prevIndex + 1) % animeData.length
      );
    }, 5000); // Cambiar cada 5 segundos

    return () => clearInterval(interval);
  }, []);

  // Navegación manual del carrusel
  const goToSlide = (index: number) => {
    setCurrentCarouselIndex(index);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Barra de navegación superior */}
      <nav className="bg-black/90 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 className="font-bold text-orange-500">
                <span className="text-3xl">アニメ</span><span className="text-lg">Libre</span>
              </h1>
            </div>
          </div>
        </div>
      </nav>

      {/* Sección Hero - Carrusel Dinámico */}
      <section className="relative h-[500px] bg-gradient-to-r from-red-900 via-red-800 to-red-900 overflow-hidden">
        {/* Imagen de fondo */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
          style={{
            backgroundImage: `url(${animeData[currentCarouselIndex]?.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center h-full">
            {/* Contenido izquierdo */}
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                {animeData[currentCarouselIndex]?.title}
              </h2>
              {animeData[currentCarouselIndex]?.japaneseTitle && (
                <p className="text-xl text-orange-300 font-medium">
                  {animeData[currentCarouselIndex].japaneseTitle}
                </p>
              )}
              <p className="text-lg text-gray-200 leading-relaxed max-w-lg">
                {animeData[currentCarouselIndex]?.description}
              </p>
              
              {/* Información del anime */}
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-white font-semibold">{animeData[currentCarouselIndex]?.rating}</span>
                </div>
                <div className="text-gray-300">
                  {animeData[currentCarouselIndex]?.year}
                </div>
                <div className="text-gray-300">
                  {animeData[currentCarouselIndex]?.episodes} episodios
                </div>
                <div className="text-gray-300">
                  {animeData[currentCarouselIndex]?.status}
                </div>
              </div>

              {/* Géneros */}
              <div className="flex flex-wrap gap-2">
                {animeData[currentCarouselIndex]?.genre.slice(0, 3).map((genre, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-orange-500/20 text-orange-300 text-sm rounded-full border border-orange-500/30"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              <div className="flex items-center space-x-4">
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors">
                  <Play className="h-5 w-5" />
                  <span>VER AHORA</span>
                </button>
                <BookmarkButton 
                  item={{
                    title: animeData[currentCarouselIndex]?.title || '',
                    japaneseTitle: animeData[currentCarouselIndex]?.japaneseTitle || '',
                    image: animeData[currentCarouselIndex]?.image || '',
                    genre: animeData[currentCarouselIndex]?.genre || [],
                    year: animeData[currentCarouselIndex]?.year || 0,
                    episodes: animeData[currentCarouselIndex]?.episodes || 0,
                    type: animeData[currentCarouselIndex]?.type.includes('Sub') ? 'anime' : 'manga',
                    rating: animeData[currentCarouselIndex]?.rating || 0,
                    status: animeData[currentCarouselIndex]?.status === 'En emisión' ? 'ongoing' : 
                           animeData[currentCarouselIndex]?.status === 'Finalizado' ? 'completed' : 'upcoming'
                  }}
                  size="lg"
                />
              </div>
              
              {/* Puntos de paginación */}
              <div className="flex space-x-2">
                {animeData.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`h-1 rounded-full transition-all duration-300 hover:bg-orange-400 ${
                      index === currentCarouselIndex ? 'bg-orange-500 w-8' : 'bg-gray-600 w-3'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Imagen derecha */}
            <div className="hidden lg:block relative">
              <div className="w-full h-80 rounded-lg overflow-hidden shadow-2xl">
                <img
                  src={animeData[currentCarouselIndex]?.image}
                  alt={animeData[currentCarouselIndex]?.title}
                  className="w-full h-full object-cover transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de recomendaciones */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h3 className="text-2xl font-bold text-white mb-8">Nuestras recomendaciones</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {animeData.map((anime) => (
            <div
              key={anime.id}
              className="relative group cursor-pointer"
              onMouseEnter={() => handleMouseEnter(anime.id)}
              onMouseLeave={handleMouseLeave}
            >
              {/* Tarjeta de anime */}
              <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="relative">
                  <img
                    src={anime.image}
                    alt={anime.title}
                    className="w-full h-64 object-cover"
                  />
                  {/* Insignia de calificación */}
                  <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <span>{anime.rating}</span>
                  </div>
                  {/* Insignia de episodios */}
                  <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                    {anime.episodes} Ep
                  </div>
                </div>
                
                <div className="p-3">
                  <h4 className="font-semibold text-sm text-white mb-1 line-clamp-2">
                    {anime.title}
                  </h4>
                  {anime.japaneseTitle && (
                    <p className="text-xs text-gray-400 mb-1">{anime.japaneseTitle}</p>
                  )}
                  <p className="text-xs text-orange-400">{anime.type}</p>
                </div>
              </div>

              {/* Menú de hover - Inferior */}
              {hoveredCard === anime.id && (
                <div 
                  className="absolute top-full left-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-2xl border border-gray-700 z-50 p-4 animate-fade-in hover:border-orange-500/50 transition-colors duration-200"
                  onMouseEnter={() => handleMenuMouseEnter(anime.id)}
                  onMouseLeave={handleMenuMouseLeave}
                >
                  <div className="space-y-4">
                    {/* Encabezado */}
                    <div className="flex items-start space-x-3">
                      <img
                        src={anime.image}
                        alt={anime.title}
                        className="w-16 h-24 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-bold text-white text-lg">{anime.title}</h4>
                        {anime.japaneseTitle && (
                          <p className="text-sm text-gray-400">{anime.japaneseTitle}</p>
                        )}
                        <div className="flex items-center space-x-2 mt-2">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-white">{anime.rating}</span>
                          </div>
                          <span className="text-gray-400">•</span>
                          <span className="text-sm text-gray-300">{anime.year}</span>
                        </div>
                      </div>
                    </div>

                    {/* Descripción */}
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {anime.description}
                    </p>

                    {/* Géneros */}
                    <div className="flex flex-wrap gap-2">
                      {anime.genre.map((g) => (
                        <span
                          key={g}
                          className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded"
                        >
                          {g}
                        </span>
                      ))}
                    </div>

                    {/* Estadísticas */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Episodios:</span>
                        <span className="text-white ml-2">{anime.episodes}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Temporadas:</span>
                        <span className="text-white ml-2">{anime.seasons}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Estado:</span>
                        <span className="text-white ml-2">{anime.status}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Sub:</span>
                        <span className="text-white ml-2">{anime.languages.slice(0, 3).join(', ')}</span>
                      </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex space-x-2 pt-2">
                      <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded font-semibold text-sm transition-colors flex items-center justify-center space-x-2">
                        <Play className="h-4 w-4" />
                        <span>Ver Ahora</span>
                      </button>
                      <BookmarkButton 
                        item={{
                          title: anime.title,
                          japaneseTitle: anime.japaneseTitle || '',
                          image: anime.image,
                          genre: anime.genre,
                          year: anime.year,
                          episodes: anime.episodes,
                          type: anime.type.includes('Sub') ? 'anime' : 'manga',
                          rating: anime.rating,
                          status: anime.status === 'En emisión' ? 'ongoing' : 
                                 anime.status === 'Finalizado' ? 'completed' : 'upcoming'
                        }}
                        size="md"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
