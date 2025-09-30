// Mock news data for testing when API is not available
import { JikanNewsItem } from './jikan';

export const mockNewsData: JikanNewsItem[] = [
  {
    mal_id: 1,
    url: "https://myanimelist.net/news/1",
    title: "One Piece alcanza nuevo récord de ventas en Japón",
    date: new Date().toISOString(),
    author_username: "MAL_News",
    author_url: "https://myanimelist.net/profile/MAL_News",
    forum_url: "https://myanimelist.net/forum/?topicid=1",
    images: {
      jpg: {
        image_url: "https://cdn.myanimelist.net/images/anime/6/73245.jpg"
      }
    },
    comments: 45,
    excerpt: "El manga de One Piece ha alcanzado un nuevo récord histórico de ventas en Japón, superando los 500 millones de copias vendidas en todo el mundo."
  },
  {
    mal_id: 2,
    url: "https://myanimelist.net/news/2",
    title: "Attack on Titan: Final Season confirma fecha de estreno",
    date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    author_username: "MAL_News",
    author_url: "https://myanimelist.net/profile/MAL_News",
    forum_url: "https://myanimelist.net/forum/?topicid=2",
    images: {
      jpg: {
        image_url: "https://cdn.myanimelist.net/images/anime/10/47347.jpg"
      }
    },
    comments: 128,
    excerpt: "La temporada final de Attack on Titan ha confirmado oficialmente su fecha de estreno para el próximo mes, con una duración extendida de 12 episodios."
  },
  {
    mal_id: 3,
    url: "https://myanimelist.net/news/3",
    title: "Demon Slayer: Nuevo arco del manga será adaptado",
    date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    author_username: "MAL_News",
    author_url: "https://myanimelist.net/profile/MAL_News",
    forum_url: "https://myanimelist.net/forum/?topicid=3",
    images: {
      jpg: {
        image_url: "https://cdn.myanimelist.net/images/anime/1286/99889.jpg"
      }
    },
    comments: 89,
    excerpt: "Ufotable ha anunciado que adaptará el nuevo arco del manga de Demon Slayer en una película que se estrenará en 2024."
  },
  {
    mal_id: 4,
    url: "https://myanimelist.net/news/4",
    title: "Naruto: Nuevo videojuego en desarrollo",
    date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    author_username: "MAL_News",
    author_url: "https://myanimelist.net/profile/MAL_News",
    forum_url: "https://myanimelist.net/forum/?topicid=4",
    images: {
      jpg: {
        image_url: "https://cdn.myanimelist.net/images/anime/2/76049.jpg"
      }
    },
    comments: 67,
    excerpt: "Bandai Namco ha confirmado el desarrollo de un nuevo videojuego de Naruto que incluirá personajes tanto del anime clásico como de Boruto."
  },
  {
    mal_id: 5,
    url: "https://myanimelist.net/news/5",
    title: "Studio Ghibli anuncia nueva película para 2024",
    date: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
    author_username: "MAL_News",
    author_url: "https://myanimelist.net/profile/MAL_News",
    forum_url: "https://myanimelist.net/forum/?topicid=5",
    images: {
      jpg: {
        image_url: "https://cdn.myanimelist.net/images/anime/4/19644.jpg"
      }
    },
    comments: 156,
    excerpt: "Studio Ghibli ha anunciado oficialmente una nueva película animada dirigida por Hayao Miyazaki que se estrenará en 2024."
  },
  {
    mal_id: 6,
    url: "https://myanimelist.net/news/6",
    title: "My Hero Academia: Temporada 7 en producción",
    date: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
    author_username: "MAL_News",
    author_url: "https://myanimelist.net/profile/MAL_News",
    forum_url: "https://myanimelist.net/forum/?topicid=6",
    images: {
      jpg: {
        image_url: "https://cdn.myanimelist.net/images/anime/10/78745.jpg"
      }
    },
    comments: 234,
    excerpt: "Bones Studio ha confirmado que la séptima temporada de My Hero Academia ya está en producción y se espera para el próximo año."
  },
  {
    mal_id: 7,
    url: "https://myanimelist.net/news/7",
    title: "Dragon Ball Super: Nuevo arco del manga",
    date: new Date(Date.now() - 518400000).toISOString(), // 6 days ago
    author_username: "MAL_News",
    author_url: "https://myanimelist.net/profile/MAL_News",
    forum_url: "https://myanimelist.net/forum/?topicid=7",
    images: {
      jpg: {
        image_url: "https://cdn.myanimelist.net/images/anime/1004/104275.jpg"
      }
    },
    comments: 178,
    excerpt: "El manga de Dragon Ball Super ha comenzado un nuevo arco que explorará el pasado de Goku y sus orígenes en el planeta Vegeta."
  },
  {
    mal_id: 8,
    url: "https://myanimelist.net/news/8",
    title: "Jujutsu Kaisen: Película recauda millones en taquilla",
    date: new Date(Date.now() - 604800000).toISOString(), // 7 days ago
    author_username: "MAL_News",
    author_url: "https://myanimelist.net/profile/MAL_News",
    forum_url: "https://myanimelist.net/forum/?topicid=8",
    images: {
      jpg: {
        image_url: "https://cdn.myanimelist.net/images/anime/1171/109222.jpg"
      }
    },
    comments: 312,
    excerpt: "La película de Jujutsu Kaisen 0 ha superado los 200 millones de dólares en taquilla mundial, convirtiéndose en una de las películas de anime más exitosas."
  }
];

export const getMockNews = (limit: number = 10, offset: number = 0): JikanNewsItem[] => {
  const startIndex = offset;
  const endIndex = Math.min(startIndex + limit, mockNewsData.length);
  
  // If we need more items than available, generate additional unique items
  if (endIndex < startIndex + limit) {
    const baseItems = mockNewsData.slice(startIndex);
    const additionalItems: JikanNewsItem[] = [];
    
    for (let i = 0; i < (startIndex + limit) - mockNewsData.length; i++) {
      const baseItem = mockNewsData[i % mockNewsData.length];
      const uniqueId = mockNewsData.length + offset + i + 1;
      
      additionalItems.push({
        ...baseItem,
        mal_id: uniqueId,
        url: `https://myanimelist.net/news/${uniqueId}`,
        title: `${baseItem.title} (Parte ${Math.floor(i / mockNewsData.length) + 2})`,
        date: new Date(Date.now() - (i + 1) * 86400000).toISOString(),
        forum_url: `https://myanimelist.net/forum/?topicid=${uniqueId}`,
        comments: baseItem.comments + i * 10,
        excerpt: `${baseItem.excerpt} Esta es una noticia adicional generada para demostrar la paginación.`
      });
    }
    
    return [...baseItems, ...additionalItems];
  }
  
  return mockNewsData.slice(startIndex, endIndex);
};
