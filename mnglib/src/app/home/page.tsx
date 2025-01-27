import { AnimeCard } from "./components/card";
import Carousel from "./components/carousel";

export default function Page() {
  const data = {
    items: [
      {
        url: "https://static.zerochan.net/Mirai.Nikki.full.935960.jpg",
        name: "mirai nikki",
      },
    ],
    interval: 3000,
  };
  return (
    <div>
      <Carousel data={data}></Carousel>
      <AnimeCard></AnimeCard>
    </div>
  );
}
