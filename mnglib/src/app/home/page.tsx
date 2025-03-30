import { Button } from "@/components/ui/button";
import { AnimeCard } from "./components/card";
import Carousel from "./components/carousel";
import { ChevronRightIcon } from "lucide-react";

export default function Page() {
  const carouselData = {
    items: [
      {
        url: "https://static.zerochan.net/Mirai.Nikki.full.935960.jpg",
        name: "SPY×FAMILY",
        id: 1,
      },
      {
        url: "https://static.zerochan.net/Mirai.Nikki.full.935960.jpg",
        name: "Attack on Titan",
        id: 2,
      },
      {
        url: "https://static.zerochan.net/Mirai.Nikki.full.935960.jpg",
        name: "Demon Slayer",
        id: 3,
      },
      {
        url: "https://static.zerochan.net/Mirai.Nikki.full.935960.jpg",
        name: "Jujutsu Kaisen",
        id: 4,
      },
    ],
    interval: 15000,
  };

  const topPicksData = [
    {
      url: "https://static.zerochan.net/Mirai.Nikki.full.935960.jpg",
      name: "One Piece",
      id: 1,
    },
    {
      url: "https://static.zerochan.net/Mirai.Nikki.full.935960.jpg",
      name: "Miss Kobayashi's Dragon Maid",
      id: 2,
    },
    {
      url: "https://static.zerochan.net/Mirai.Nikki.full.935960.jpg",
      name: "Black Clover",
      id: 3,
    },
  ];

  return (
    <div className="relative overflow-hidden min-h-screen p-5 rounded-xl scrollbar-hide">
      <Carousel data={carouselData}></Carousel>

      <section className="justify-between flex items-center mb-4">
        <h1 className="font-bold text-2xl text-black">TOP PICKS FOR YOU</h1>
        <Button className="hover:bg-[#8a55f8]/20 text-white text-lg flex items-center">
          BROWSE
          <ChevronRightIcon />
        </Button>
      </section>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        {topPicksData.map((item) => {
          return <AnimeCard key={item.id} item={item} />;
        })}
      </div>
    </div>
  );
}
