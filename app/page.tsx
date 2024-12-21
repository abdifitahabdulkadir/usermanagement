import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="w-full h-screen flex flex-col items-center justify-center">
      <h1 className=" text-2xl md:text-3xl font-bold capitalize">
        Welcome to management user table
      </h1>
      <Image
        src={"/users-illustration.svg"}
        width={100}
        height={100}
        priority
        loading="eager"
        alt="users-illustration image"
        className="w-1/2 h-1/2 object-contain "
      />
      <Link href={"/users?page=0"}>
        <Button className="bg-slate-950 w-[10rem]  hover:bg-slate-800 transition-all duration-200 hover:-translate-y-1 text-white border-none rounded-[4px]">
          Get Started
        </Button>
      </Link>
    </main>
  );
}
