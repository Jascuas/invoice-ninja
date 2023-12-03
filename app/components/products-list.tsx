"use client";
import { Key, useCallback, useState } from "react";

import { twMerge } from "tailwind-merge";

import {
  Avatar,
  Button,
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
import { Session } from "@supabase/auth-helpers-nextjs";
import { IconEye, IconPencil } from "@tabler/icons-react";

import { AddUserProduct, Friend, UserProduct } from "../@types/invoices";
import { addUserProducts } from "../actions/add-user-products";
import { deleteUserProducts } from "../actions/delete-user-products";
import { formatCurrency } from "../utils";

const columns = [
  {
    key: "description",
    label: "DESCRIPTION",
  },
  {
    key: "added",
    label: "ADDED",
  },
];
type Selection = "all" | Set<Key>;
export function ProductList({
  products,
  session,
  friends,
}: {
  products: UserProduct[];
  session: Session;
  friends: Friend[] | undefined;
}) {
  const [selectedProducts, setSelectedProducts] = useState<Selection>();
  const [selectedUSers, setSelectedUSers] = useState<string[]>([]);
  const user = session?.user.user_metadata;

  const renderCell = useCallback((item: UserProduct, columnKey: Key) => {
    const cellValue = item?.[columnKey as keyof UserProduct];

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
      case "description":
        return <p className="text-bold text-sm capitalize">{cellValue}</p>;
      case "unit_price":
        return (
          <p className="text-bold text-sm capitalize">
            {formatCurrency(cellValue ?? 0)}
          </p>
        );
      case "added":
        return (
          <div className="flex gap-4">
            {item?.user_products?.map((user) => {
              return (
                <User
                  avatarProps={{
                    radius: "full",
                    src: user?.user_id.avatar_url,
                  }}
                  name={user?.user_id.user_name}
                />
              );
            })}
          </div>
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

  const idIsSelected = (id?: string) => selectedUSers?.some((uid) => uid == id);

  const toggleIdInArray = (id?: string) => {
    if (!id) return;
    const index = selectedUSers?.indexOf(id);
    if (index === -1) {
      // Si el ID no existe en el array, agrégalo
      setSelectedUSers([...selectedUSers, id]);
    } else {
      // Si el ID ya existe en el array, elimínalo
      const newArray = [...selectedUSers];
      newArray.splice(index, 1);
      setSelectedUSers(newArray);
    }
  };
  const onAddProducts = async () => {
    if (selectedProducts) {
      if (selectedProducts.toString() == "all") {
        return console.log("ALL");
      }
      let newSelectedProducts: string[] = [];
      for (const item of selectedProducts) {
        newSelectedProducts.push(item.toString());
      }
      const userProducts: AddUserProduct[] = selectedUSers
        .map((userId) => {
          return newSelectedProducts.map((productId) => {
            return {
              product_id: productId,
              user_id: userId,
            };
          });
        })
        .flat(); // Utiliza flat() para aplanar el array de arrays resultante

      console.log(userProducts);
      await addUserProducts(userProducts);
    }
  };
  const onRemoveProducts = async () => {
    console.log(selectedProducts);
    if (selectedProducts) {
      if (selectedProducts.toString() == "all") {
        return console.log("ALL");
      }
      let newSelectedProducts: string[] = [];
      for (const item of selectedProducts) {
        newSelectedProducts.push(item.toString());
      }
      console.log(newSelectedProducts);
      selectedUSers?.map(async (userId) => {
        await deleteUserProducts(userId, newSelectedProducts);
      });
    }
  };

  return (
    <>
      <div className="flex flex-wrap -mx-3">
        <Card
          toggle={() => toggleIdInArray(session?.user.id)}
          selected={idIsSelected(session?.user.id)}
          title={user?.user_name}
          avatar={user?.avatar_url}
          colors="from-orange-500 to-yellow-500"
        />
        <Card
          toggle={() => toggleIdInArray(friends?.[0]?.friend_id?.id)}
          selected={idIsSelected(friends?.[0]?.friend_id?.id)}
          title={friends?.[0]?.friend_id?.user_name}
          avatar={friends?.[0]?.friend_id?.avatar_url}
          colors="from-red-600 to-orange-600"
        />
      </div>
      <div className="flex gap-4 ">
        <Button
          onClick={onAddProducts}
          className="px-8"
          color="primary"
          type="submit"
        >
          {"Add selected"}
        </Button>
        <Button
          onClick={onRemoveProducts}
          className="px-8"
          color="danger"
          type="submit"
        >
          {"Remove selected"}
        </Button>
      </div>
      <Table
        aria-label="Example table with dynamic content"
        selectionMode="multiple"
        onSelectionChange={(s) => setSelectedProducts(s)}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={products} emptyContent={"No rows to display."}>
          {(item) => (
            <TableRow key={item?.id} className="cursor-pointer">
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
interface cardProps {
  title?: string;
  colors?: string;
  avatar?: string;
  selected?: boolean;
  toggle?: () => void;
}
const Card = ({ title, colors, avatar, selected, toggle }: cardProps) => {
  return (
    <div className="w-full max-w-full px-3 mb-6  sm:flex-none xl:mb-0 xl:w-fit">
      <div
        onClick={toggle}
        className={twMerge(
          "relative cursor-pointer flex flex-col min-w-0 break-words bg-zinc-900 shadow-dark-xl rounded-2xl bg-clip-border border-zinc-800 border-2 transition-all",
          selected && "border-white"
        )}
      >
        <div className="flex-auto p-4">
          <div className="flex flex-row items-center justify-between">
            <Avatar size="sm" src={avatar} />
            <div className="flex-none max-w-full px-3">
              <div>
                <p className="mb-0 font-sans font-semibold leading-normal uppercase text-white opacity-60 text-xs">
                  @{title}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
