"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
export type Users = {
  id: string;
  name: string;
  email: string;
  role: string;
  updatedAt: Date;
};

export const columns: ColumnDef<Users>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    // header: "Name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },

  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "updatedAt",
    header: "UpdatedAt",
    cell: (row) => {
      const formattedDate = new Date(
        row.getValue("updatedAt")
      ).toLocaleDateString();
      return <div className="font-medium">{formattedDate}</div>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-slate-100 w-full">
            <DropdownMenuLabel className="border-b border">
              Actions
            </DropdownMenuLabel>
            <DropdownMenuItem
              className="cursor-pointer hover:!bg-white"
              onClick={() => {
                navigator.clipboard.writeText(user.id);
                toast({
                  title: "User ID copied",
                  description: "User ID copied to clipboard",
                });
              }}
            >
              Copy user ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(user.email);
                toast({
                  title: "User Email copied",
                  description: "User Email copied to clipboard",
                });
              }}
              className="cursor-pointer hover:!bg-white"
            >
              Copy user email
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(user.name);
                toast({
                  title: "User Name copied",
                  description: "User Name copied to clipboard",
                });
              }}
              className="cursor-pointer hover:!bg-white"
            >
              Copy user Name
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
