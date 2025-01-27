"use client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Ellipsis, Star } from "lucide-react";

export const AnimeCard = () => {
  const imageLoader = ({ src }) => {
    return `https://static.zerochan.net/${src}`;
  };
  return (
    <Card className="w-[300] border-none">
      <CardContent className="p-2">
        <Image
          loader={imageLoader}
          src="Mirai.Nikki.full.935960.jpg"
          alt="pictId"
          width={500}
          height={500}
          className="rounded-xl"
          priority
        />
      </CardContent>
      <CardFooter className="flex justify-between pt-3 pb-2">
        <Button
          className="bg-transparent size-12 rounded-full"
          variant="ghost"
          size="icon"
        >
          <Ellipsis style={{ width: "1.5rem", height: "1.5rem" }} />
        </Button>
        <Button
          className="bg-transparent rounded-full"
          size="icon"
          variant="ghost"
        >
          <Star style={{ width: "1.3rem", height: "1.3rem" }} />
        </Button>
      </CardFooter>
    </Card>
  );
};
