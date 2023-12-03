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

import { Friend, User as UserType } from "../@types/invoices";
import { dateFormatLg } from "../utils";

const columns = [
  {
    key: "id",
    label: "ID",
  },
  {
    key: "user",
    label: "USER",
  },
  {
    key: "status",
    label: "STATUS",
  },
  {
    key: "friends_at",
    label: "CREATION DATE",
  },
];
type MapedFriends =
  | {
      avatar_url?: string | undefined;
      friends_at?: string | undefined;
      id?: string | undefined;
      name?: string | undefined;
      user_name?: string | undefined;
      status?: string | undefined;
    }
  | undefined;

export function FriendsList({ friends }: { friends: Friend[] | undefined }) {
  const renderItems = useCallback(() => {
    if (!friends) return [];
    const mapedFriends = friends?.map((friend) => {
      if (!friend) return;
      const { friend_id, status, created_at } = friend;

      return {
        ...friend_id,
        status,
        friends_at: created_at,
      };
    });

    return mapedFriends;
  }, [friends]);

  const renderCell = useCallback((item: MapedFriends, columnKey: Key) => {
    const cellValue = item?.[columnKey as keyof UserType];
    switch (columnKey) {
      case "id":
      case "status":
        return <p className="text-bold text-sm capitalize">{cellValue}</p>;
      case "user":
        return (
          <User
            avatarProps={{ radius: "full", src: item?.avatar_url }}
            name={item?.user_name}
          />
        );

      case "friends_at":
        return (
          <p className="text-bold text-sm capitalize">
            {dateFormatLg(item?.friends_at ?? "")}
          </p>
        );

      default:
        return cellValue;
    }
  }, []);

  return (
    <Table
      aria-label="Example table with dynamic content"
      selectionMode="single"
      onRowAction={(key) => alert(`Opening item ${key}...`)}
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
