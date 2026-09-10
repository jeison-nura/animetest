import type { EpisodeComment } from "../model/types";

const episodeComments: EpisodeComment[] = [
  {
    id: 1,
    author: "AnimeSenpai",
    initials: "AS",
    color: "#7c3aed",
    rating: 5,
    text: "The sakuga in this fight is insane. Every single frame was worth the wait.",
    date: "2 hours ago",
  },
  {
    id: 2,
    author: "MangaFirst",
    initials: "MF",
    color: "#0891b2",
    rating: 4,
    text: "Good pacing, but they cut an entire arc from the manga. Still a great adaptation.",
    date: "5 hours ago",
  },
  {
    id: 3,
    author: "Cinephile99",
    initials: "C9",
    color: "#d97706",
    rating: 5,
    text: "That soundtrack drop right before the climax gives me chills every single time.",
    date: "1 day ago",
  },
  {
    id: 4,
    author: "CasualOtaku",
    initials: "CO",
    color: "#be185d",
    rating: 3,
    text: "Solid episode overall, though the CGI still pulls me out of the action scenes.",
    date: "2 days ago",
  },
];

export async function getEpisodeComments(): Promise<EpisodeComment[]> {
  return episodeComments;
}