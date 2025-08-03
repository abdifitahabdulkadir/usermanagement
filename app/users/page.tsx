"use client";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { columns, Users } from "./columns";

async function getUsersData(): Promise<Users[]> {
  try {
    const users = await fetch("https://jsonplaceholder.typicode.com/users");
    const decoded = await users.json();
    decoded.lastSeen = true;
    return decoded;
  } catch (e) {
    console.log(e);
    throw new Error("Error while fetching data");
  }
}

export default function UsersPage() {
  const { isLoading, data, isError } = useQuery({
    queryKey: ["users"],
    queryFn: getUsersData,
  });

  return (
    <section className="px-10 py-24">
      <div className="container">
        <h1 className="text-3xl font-bold ">Get All Users</h1>
        {isLoading ? (
          <div className="w-full h-screen flex items-center justify-center">
            <div className="spinner " />
          </div>
        ) : isError ? (
          <div className="w-full h-screen flex  flex-col gap-3 items-center justify-center">
            <Image
              src={"/error.png"}
              height={100}
              width={100}
              alt="error illustration page"
              className="size-2/3 object-contain"
            />
            <h1 className="text-3xl font-bold text-red-500">
              Error while fetching data
            </h1>
          </div>
        ) : (
          <DataTable columns={columns} data={data ?? []} />
        )}
      </div>

      <Link href={"/"}>
        <Button className="bg-slate-950 w-[10rem]  hover:bg-slate-800 transition-all duration-200 hover:-translate-y-1 text-white border-none rounded-[4px]">
          Back to Home
        </Button>
      </Link>
    </section>
  );
}
