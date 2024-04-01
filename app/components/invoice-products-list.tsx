"use client";
import { Key, useCallback } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  User,
} from "@nextui-org/react";

import { InvoiceProduct, UserInvoiceTotal } from "../@types/invoices";
import { formatCurrency } from "../utils";

const columns = [
  {
    key: "description",
    label: "DESCRIPTION",
  },
  {
    key: "user_id",
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
  invoiceUserTotal,
}: {
  invoiceProducts: InvoiceProduct[];
  invoiceUserTotal: UserInvoiceTotal;
}) {
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
    const user = invoiceUserTotal?.find(
      (user) => user.user_id.id === product?.user_id
    );
    console.log(user);
    if (!user) return;
    switch (columnKey) {
      case "description":
        return <p className="text-bold text-sm capitalize">{cellValue}</p>;
      case "user_id":
        return (
          <div className="flex gap-4">
            <User
              key={product?.product_id + user.user_id.id}
              avatarProps={{
                radius: "full",
                src: user?.user_id.avatar_url,
              }}
              name={user?.user_id.user_name}
            />
          </div>
        );
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
