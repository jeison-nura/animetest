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
      {
        url: "https://static.zerochan.net/Mirai.Nikki.full.935960.jpg",
        name: "bleach",
        id: 3,
      },
      {
        url: "https://static.zerochan.net/Mirai.Nikki.full.935960.jpg",
        name: "doraemon",
        id: 4,
      },
      {
        url: "https://static.zerochan.net/Mirai.Nikki.full.935960.jpg",
        name: "imaizumi",
        id: 5,
      },
    ],
    interval: 15000,
  };
  return (
    <div className="p-5 rounded-xl bg-gradient-to-tl from-indigo-500 from-10% to-blue-700 to-90%">
      <Carousel data={data}></Carousel>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data.items.map((item) => {
          return <AnimeCard key={item.id} item={item} />;
        })}
      </div>
    </div>
  );
}
