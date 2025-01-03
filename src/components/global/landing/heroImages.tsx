import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";

export default function HeroImage() {
  return (
    <>
      <div className="w-full h-10 border justify-start items-center p-5 py-auto flex flex-row border-b-0 rounded-t-xl space-x-3">
        <div className="rounded-full w-4 h-4 bg-red-600"></div>
        <div className="rounded-full w-4 h-4 bg-orange-600"></div>
        <div className="rounded-full w-4 h-4 bg-green-600"></div>
      </div>
      <AspectRatio ratio={16 / 9} className="bg-muted border rounded-b-xl">
        <Image
          src={"/hero-light.png"}
          alt="Quirk"
          fill
          className="rounded-b-xl object-cover dark:hidden flex"
        />
        <Image
          src={"/hero-dark.png"}
          alt="Quirk"
          fill
          className="rounded-b-xl object-cover hidden dark:flex"
        />
      </AspectRatio>
    </>
  );
}
