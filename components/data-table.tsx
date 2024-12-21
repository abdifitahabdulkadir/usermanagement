"use client";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { createQueryString } from "@/lib/handleurl";
import { Filter } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState<string[]>([]);
  const pathName = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
  });

  //update the users table page based on current url.
  useEffect(function () {
    if (searchParams.get("page")) {
      table.setPageIndex(Number(searchParams.get("page")));
    }
  }, []);

  return (
    <>
      {/* filtering input  */}
      <div className="flex items-center py-4  justify-between flex-col gap-3 lg:flex-row ">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm  rounded-[6px] h-10 outline-none border-slate-400/90 focus-within:border-blue-500 bg-white/50 focus-within:border-2 transition-all duration-150"
        />
        <Input
          placeholder="Filter/search By anything..."
          value={globalFilter[0] ?? ""}
          onChange={(event) => setGlobalFilter([event.target.value])}
          className="max-w-sm  rounded-[6px] h-10 outline-none border-slate-400/90 focus-within:border-blue-500 bg-white/50 focus-within:border-2 transition-all duration-150"
        />
      </div>
      {/* dropdown for selecting specific columns */}
      <div className="w-full flex items-center justify-between mb-5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="ml-auto bg-slate-900 rounded-[4px] text-white hover:bg-slate-800  transition-all duration-300 hover:shadow-sm">
              <Filter />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-slate-100">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize hover:!bg-white cursor-pointer"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* table  */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="bg-slate-950 text-white"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const isEven = Number(row.id) % 2 === 0;
                return (
                  <TableRow
                    key={row.id}
                    className={`${
                      isEven ? "bg-slate-50/40" : "bg-slate-100/40"
                    }`}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <h5>No Users Found</h5>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* pagination controlles --going to the Next and previos page/s */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          size="sm"
          className="rounded-[5px] !bg-slate-950 disabled:bg-slate-600  !text-white"
          onClick={() => {
            table.previousPage();
            const index = table.options.state.pagination?.pageIndex ?? 0;
            const formattedUrl = createQueryString({
              key: "page",
              value: index.toString(),
              currentSearchParams: searchParams,
            });
            router.replace(pathName + "?" + formattedUrl, { scroll: false });
          }}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          size="sm"
          className="rounded-[5px] !bg-slate-950 disabled:bg-slate-600  !text-white"
          onClick={() => {
            table.nextPage();
            const index = table.options.state.pagination?.pageIndex ?? 0;
            const formattedUrl = createQueryString({
              key: "page",
              value: index.toString(),
              currentSearchParams: searchParams,
            });
            router.replace(pathName + "?" + formattedUrl, { scroll: false });
          }}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </>
  );
}
