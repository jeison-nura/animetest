import { Button } from "@/components/ui/button";
import { AnimeCard } from "./components/card";
import Carousel from "./components/carousel";
import { ChevronRightIcon } from "lucide-react";

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
    <div className="p-5 rounded-xl bg-linear-to-b from-black from-40% to-blue-800 to-60%">
      <Carousel data={data}></Carousel>
      <section className="justify-between flex items-center m-3">
        <h1 className="font-bold text-2xl  text-amber-50">Latest content</h1>
        <Button className="bg-transparent border-none shadow-none text-2xl">
          Browse
          <ChevronRightIcon />
        </Button>
      </section>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data.items.map((item) => {
          return <AnimeCard key={item.id} item={item} />;
        })}
      </div>
    </div>
  );
}
