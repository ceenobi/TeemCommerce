import { useCallback, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { cn, formatCurrency, formatDate } from "~/lib/utils";
import { Badge } from "../ui/badge";
import { MoreVertical } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface Column {
  name: string;
  uid: string;
}

interface CustomTableProps {
  columns: Column[];
  data: any[];
  className?: string;
}

export default function CustomTable({
  columns,
  data,
  className,
}: CustomTableProps) {
  const renderCell = useCallback((item: any, columnKey: string) => {
    const cellValue = item[columnKey];

    switch (columnKey) {
      case "status":
        return (
          <Badge
            variant="outline"
            className={cn(
              "capitalize border-none px-3 py-1 text-[10px] font-bold tracking-widest leading-none",
              cellValue === "completed" &&
                "bg-MediumJungle/10 text-MediumJungle",
              cellValue === "pending" && "bg-AmberFlame/10 text-AmberFlame",
              cellValue === "cancelled" && "bg-CottonCandy/10 text-CottonCandy",
            )}
          >
            {cellValue}
          </Badge>
        );
      case "date":
        return (
          <span className="text-muted-foreground/80">
            {formatDate(cellValue)}
          </span>
        );
      case "amount":
        return (
          <span className="font-semibold tabular-nums text-foreground">
            {formatCurrency(cellValue)}
          </span>
        );
      case "action":
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 cursor-pointer"
              >
                <MoreVertical size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-white/90 dark:bg-DarkBlue/90 backdrop-blur-xl border-border dark:border-white/10"
            >
              <DropdownMenuItem className="cursor-pointer">
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                Edit Order
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer text-red-500">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      default:
        return <span className="text-muted-foreground/80">{cellValue}</span>;
    }
  }, []);

  return (
    <div
      className={cn(
        "border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-white/2 backdrop-blur-3xl overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-none",
        className,
      )}
    >
      <Table>
        <TableHeader className="bg-slate-50/50 dark:bg-white/5">
          <TableRow className="hover:bg-transparent border-slate-200 dark:border-white/5">
            {columns.map((column) => (
              <TableHead
                key={column.uid}
                className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 py-4"
              >
                {column.name}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {useMemo(
            () =>
              data.map((item, index) => (
                <TableRow
                  key={item._id || index}
                  className="border-slate-100 dark:border-white/5 transition-colors hover:bg-slate-50 dark:hover:bg-white/5 group"
                >
                  {columns.map((column) => (
                    <TableCell
                      key={column.uid}
                      className="py-4 px-2 first:pl-4 last:pr-4"
                    >
                      {renderCell(item, column.uid)}
                    </TableCell>
                  ))}
                </TableRow>
              )),
            [data, columns, renderCell],
          )}
        </TableBody>
      </Table>
    </div>
  );
}
