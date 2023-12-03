"use client";
import { Key, useCallback } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";

import { InvoiceProduct } from "../@types/invoices";
import { formatCurrency } from "../utils";

const columns = [
  {
    key: "description",
    label: "DESCRIPTION",
  },
  {
    key: "ownership",
    label: "OWNERSHIP",
  },
  {
    key: "quantity",
    label: "QUANTITY",
  },
  {
    key: "unit_price",
    label: "UNIT PRICE",
  },
  {
    key: "amount",
    label: "AMOUNT",
  },
];

export function InvoiceProductsList({
  invoiceProducts,
}: {
  invoiceProducts: InvoiceProduct[];
}) {
  //   const mapedInvoices = invoices?.map((invoice) => {
  //     if (!invoice || !invoice.user) return;
  //     const { id, user, sub_total, created_at } = invoice;

  //     const {
  //       user_name: userName,
  //       name: userFullName,
  //       avatar_url: avatarUrl,
  //     } = user;

  //     return {
  //       id,
  //       created_at,
  //       sub_total,
  //       avatarUrl,
  //       userFullName,
  //       userName,
  //     };
  //   });

  //   return mapedInvoices;
  // }, [invoices]);

  // const renderCell = useCallback((item: MapedInvoice, columnKey: Key) => {
  //   const cellValue = item?.[columnKey as keyof MapedInvoice];
  //   switch (columnKey) {
  //     case "id":
  //       return (
  //         <Chip
  //           className="capitalize"
  //           color={"default"}
  //           size="sm"
  //           variant="flat"
  //         >
  //           {cellValue}
  //         </Chip>
  //       );
  //     case "date":
  //       return (
  //         <p className="text-bold text-sm capitalize">
  //           {" "}
  //           {dateFormatLg(item?.created_at ?? "")}
  //         </p>
  //       );
  //     case "sub_total":
  //       return (
  //         <p className="text-bold text-sm capitalize"> {item?.sub_total}</p>
  //       );
  //     case "user":
  //       return (
  //         <User
  //           avatarProps={{ radius: "full", src: item?.avatarUrl }}
  //           name={item?.userName}
  //         />
  //       );
  //     case "actions":
  //       return (
  //         <div className="relative flex items-center gap-2">
  //           <Tooltip content="Details">
  //             <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
  //               <IconEye />
  //             </span>
  //           </Tooltip>
  //           <Tooltip content="Edit user">
  //             <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
  //               <IconPencil />
  //             </span>
  //           </Tooltip>
  //         </div>
  //       );
  //     default:
  //       return cellValue;
  //   }
  // }, []);
  const renderCell = useCallback((product: InvoiceProduct, columnKey: Key) => {
    function hasDecimal(number: number) {
      return number % 1 !== 0;
    }

    function setQuantityUnit(number: number) {
      if (hasDecimal(number)) {
        return number + " kg";
      }
      return number + " ud";
    }

    const cellValue = product?.[columnKey as keyof InvoiceProduct] ?? "";

    switch (columnKey) {
      case "description":
      case "ownership":
        return <p className="text-bold text-sm capitalize">{cellValue}</p>;
      case "quantity":
        return (
          <p className="text-bold text-sm capitalize">
            {setQuantityUnit(parseFloat(cellValue?.toString() ?? "0"))}
          </p>
        );
      case "unit_price":
      case "amount":
        return (
          <p className="text-bold text-sm capitalize">
            {formatCurrency(parseFloat(cellValue?.toString() ?? "0"))}
          </p>
        );
      default:
        return cellValue;
    }
  }, []);
  return (
    <Table selectionMode="single">
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={invoiceProducts} emptyContent={"No rows to display."}>
        {(item) => (
          <TableRow key={item?.id} className="cursor-pointer">
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
