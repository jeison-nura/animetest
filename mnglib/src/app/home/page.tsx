import { AnimeCard } from "./components/card";
import Carousel from "./components/carousel";

export default function Page() {
  const data = {
    items: [
      {
        url: "https://static.zerochan.net/Mirai.Nikki.full.935960.jpg",
        name: "mirai nikki",
        id: 1,
      },
      {
        url: "https://static.zerochan.net/Mirai.Nikki.full.935960.jpg",
        name: "chainsawman",
        id: 2,
      },
    ],
    interval: 3000,
  };
  return (
    <div className="p-5">
      <Carousel data={data}></Carousel>
      <AnimeCard></AnimeCard>
    </div>
  );
}
