"use client";
import { Key, useCallback } from "react";

import { useRouter } from "next/navigation";

import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  User,
} from "@nextui-org/react";
import { IconEye, IconPencil } from "@tabler/icons-react";

import { Invoice } from "../@types/invoices";
import { dateFormatLg, dateFormatSm } from "../utils";

const columns = [
  {
    key: "id",
    label: "ID",
  },
  {
    key: "date",
    label: "DATE ADDED",
  },
  {
    key: "bought_at",
    label: "DATE BOUGHT",
  },
  {
    key: "sub_total",
    label: "TOTAL",
  },
  {
    key: "user",
    label: "ADDED BY",
  },
];

type MapedInvoice =
  | {
      id: string;
      created_at: string;
      sub_total: number;
      avatarUrl: string;
      userFullName: string;
      userName: string;
      bought_at: string;
    }
  | undefined;

export function InvoceLists({ invoices }: { invoices: Invoice[] }) {
  console.log(invoices);
  const renderItems = useCallback(() => {
    const mapedInvoices = invoices?.map((invoice) => {
      if (!invoice || !invoice.user) return;
      const { id, user, sub_total, created_at, bought_at } = invoice;

      const {
        user_name: userName,
        name: userFullName,
        avatar_url: avatarUrl,
      } = user;

      return {
        id,
        created_at,
        sub_total,
        avatarUrl,
        userFullName,
        userName,
        bought_at,
      };
    });

    return mapedInvoices;
  }, [invoices]);

  const renderCell = useCallback((item: MapedInvoice, columnKey: Key) => {
    const cellValue = item?.[columnKey as keyof MapedInvoice];
    switch (columnKey) {
      case "id":
        return (
          <Chip
            className="capitalize"
            color={"default"}
            size="sm"
            variant="flat"
          >
            {cellValue}
          </Chip>
        );
      case "date":
        return (
          <p className="text-bold text-sm capitalize">
            {" "}
            {dateFormatLg(item?.created_at ?? "")}
          </p>
        );
      case "bought_at":
        return (
          <p className="text-bold text-sm capitalize">
            {" "}
            {dateFormatSm(item?.bought_at ?? "")}
          </p>
        );
      case "sub_total":
        return (
          <p className="text-bold text-sm capitalize"> {item?.sub_total}</p>
        );
      case "user":
        return (
          <User
            avatarProps={{ radius: "full", src: item?.avatarUrl }}
            name={item?.userName}
          />
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Details">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <IconEye />
              </span>
            </Tooltip>
            <Tooltip content="Edit user">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <IconPencil />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);
  const router = useRouter();
  return (
    <Table
      aria-label="Example table with dynamic content"
      selectionMode="single"
      onRowAction={(key) => router.push("/invoices/" + key)}
    >
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={renderItems()} emptyContent={"No rows to display."}>
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
