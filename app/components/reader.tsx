"use client";

import { Key, useCallback, useEffect, useRef, useState } from "react";
import { experimental_useFormStatus } from "react-dom";

import { parse } from "csv-parse";
import { twMerge } from "tailwind-merge";

import {
  Avatar,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  useDisclosure,
  User,
} from "@nextui-org/react";
import { Session } from "@supabase/auth-helpers-nextjs";
import { IconEdit, IconEye, IconTrash } from "@tabler/icons-react";

import { Friend, ProductInfo } from "../@types/invoices";
import { addReaderInvoice } from "../actions/add-invoice";
import { addLineProducts, addProducts } from "../actions/add-products";
import { getUserFilterProducts } from "../actions/get-user-products";
import { formatCurrency } from "../utils";

interface CSVData {
  total: number;
  usersTotal: { user_id: string; total: number }[];
  productsInfo: ProductInfo[];
}
export default function ReaderClient({
  session,
  friends,
}: {
  session: Session;
  friends: Friend[] | undefined;
}) {
  const [data, setData] = useState<CSVData | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductInfo>();
  const [selectedUSers, setSelectedUSers] = useState<string[]>([]);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const formRef = useRef<HTMLFormElement>(null);
  const { pending } = experimental_useFormStatus();
  const user = session?.user;
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const text = await file.text();
      readCSV(text);
    }
  };
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
  const updateProducts = (product: ProductInfo, products: ProductInfo[]) => {
    if (!data) return;
    console.log(product);
    console.log(products);
    const newProducts = data.productsInfo.filter((p) => p != product);
    newProducts.push(...products);
    console.log(newProducts);
    setData({ ...data, productsInfo: newProducts });
    onClose();
  };
  const readCSV = async (text: string) => {
    const results: string[][] = [];
    const parser = parse(text, {
      delimiter: ",",
      skip_empty_lines: true,
      skip_records_with_empty_values: true,
    });
    parser.on("readable", () => {
      let record;
      while ((record = parser.read()) !== null) {
        results.push(record);
      }
    });
    parser.on("end", async () => {
      const normalProducts = [];
      const kgProducts = [];
      const DATEFORMAT = /^\d{1,2}\/\d{1,2}\/\d{4} \d{1,2}:\d{2}$/;

      const transformNumbers = (val: string) => {
        return parseFloat(val.replace(",", "."));
      };

      const cleanedResults = results.filter((row) =>
        row.every(
          (element) =>
            !DATEFORMAT.test(element) &&
            !element.includes("Descripción") &&
            !element.includes("PARKING") &&
            !element.includes("TOTAL") &&
            !element.includes("ENTRADA") &&
            !element.includes("TABLE") &&
            !element.startsWith("IVA") &&
            !element.startsWith("%")
        )
      );

      for (let i = 0; i < cleanedResults.length; i++) {
        const row = cleanedResults[i];
        const nextRow = cleanedResults[i + 1];
        // Si la fila contiene "kg" en la columna 1 o 3, es un producto en kg
        if (nextRow[1]?.includes("kg") || nextRow[3]?.includes("kg")) {
          const kgProduct = [...row];
          // Combina el nombre con el valor kg
          kgProduct[2] = nextRow[1].replace("kg", "").trim();
          kgProduct[3] = nextRow[3].replace("€/kg", "").trim();
          kgProduct[4] = nextRow[4];
          kgProducts.push(kgProduct);
          i++;
        } else {
          normalProducts.push(row);
        }
      }

      const transformedNormalProducts = normalProducts.map((row) => ({
        description: row[1],
        user_id: user.id,
        unit_price: transformNumbers(row[4]) / transformNumbers(row[0]),
        quantity: transformNumbers(row[0]),
        amount: transformNumbers(row[4]),
      }));

      const transformedKgProducts = kgProducts.map((row) => ({
        user_id: user.id,
        description: row[1],
        unit_price: transformNumbers(row[3]),
        quantity: transformNumbers(row[2]),
        amount: transformNumbers(row[4]),
      }));

      const items = [...transformedNormalProducts, ...transformedKgProducts];

      const total = items.reduce((accumulator, currentItem) => {
        return accumulator + currentItem.amount;
      }, 0);

      const products = items
        .map((product) => {
          const { description, quantity, amount, ...rest } = product;
          return { external_id: description, description, ...rest };
        })
        .filter(
          (product, index, self) =>
            index ===
            self.findIndex((p) => p.external_id === product.external_id)
        );

      const addedProducts = await addProducts(products);

      const productIDs =
        addedProducts?.data?.map((p) => {
          return p.id;
        }) ?? [];
      const filterProducts = await getUserFilterProducts(
        selectedUSers,
        productIDs
      );

      const productsInfo = items
        ?.map((p) => {
          const filtered = filterProducts?.find(
            (a) => a.external_id == p.description
          );
          console.log(filtered);
          return {
            ...p,
            user_products: filtered?.user_products as any,
            product_id: filtered?.id,
          };
        })
        .sort((a, b) => {
          const descriptionA = a.description.toUpperCase(); // Convert to uppercase for case-insensitive sorting
          const descriptionB = b.description.toUpperCase();

          if (descriptionA < descriptionB) {
            return -1;
          }
          if (descriptionA > descriptionB) {
            return 1;
          }
          return 0;
        });
      var userTotal: { [userId: string]: number } = {};
      productsInfo.map((p) => {
        p.user_products?.map((userProduct: { user_id: { id: string } }) => {
          const userId = userProduct.user_id.id;
          userTotal[userId] =
            (userTotal[userId] || 0) + p.amount / p.user_products.length;
        });
      });

      const usersTotalArray = Object.keys(userTotal).map((userId) => ({
        user_id: userId,
        total: userTotal[userId],
      }));
      setData({
        total,
        usersTotal: usersTotalArray,
        productsInfo,
      });
    });
  };
  useEffect(() => {
    setSelectedUSers([session?.user.id, friends?.[0]?.friend_id?.id ?? ""]);
  }, []);
  console.log("S", selectedUSers);
  console.log(isOpen);
  console.log(selectedProduct);
  return (
    <main className="flex gap-4 flex-col items-center justify-center">
      <div className="flex w-full flex-wrap gap-4">
        <Card
          toggle={() => toggleIdInArray(session?.user.id)}
          selected={idIsSelected(session?.user.id)}
          title={user?.user_metadata.user_name}
          avatar={user?.user_metadata.avatar_url}
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
      <div className="flex gap-4 w-full items-center">
        <div className="flex gap-4 w-full  items-center">
          <label className=" text-sm font-medium text-gray-300">
            Upload CSV file
          </label>
          <input
            className="block  text-sm border  rounded-md cursor-pointer text-gray-400 focus:outline-none bg-gray-700 border-gray-600 placeholder-gray-400"
            onChange={handleFileUpload}
            type="file"
          />
        </div>
        {data && (
          <div className="flex w-full gap-4 items-center">
            <span>TOTAL: {formatCurrency(data?.total)}</span>
            {data.usersTotal.map((userTotal) => {
              return (
                <Card
                  key={user.id + userTotal.total}
                  title={formatCurrency(userTotal.total)}
                  avatar={
                    user.id == userTotal.user_id
                      ? user?.user_metadata.avatar_url
                      : friends?.find((f) => {
                          return f?.friend_id?.id == userTotal.user_id;
                        })?.friend_id?.avatar_url
                  }
                  colors="from-orange-500 to-yellow-500"
                />
              );
            })}

            <form
              ref={formRef}
              action={async () => {
                const invoice = await addReaderInvoice(data?.total ?? 0);
                const invoice_id = invoice?.data?.[0].id;
                const mapedProducst = data?.productsInfo?.map((p) => {
                  const { user_products, ...rest } = p;
                  return {
                    ...rest,
                    invoice_id,
                  };
                });

                await addLineProducts(mapedProducst);

                formRef.current?.reset();
              }}
            >
              <Button
                className="px-8"
                color="primary"
                type="submit"
                isDisabled={pending}
                isLoading={pending}
              >
                {pending ? "Adding..." : "Add invoice"}
              </Button>
            </form>
          </div>
        )}
      </div>
      {data && (
        <TableComp
          products={data?.productsInfo}
          onOpen={onOpen}
          selectProduct={(p: ProductInfo) => setSelectedProduct(p)}
        />
      )}
      <ModalComp
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        product={selectedProduct}
        updateProducts={(product: ProductInfo, products: ProductInfo[]) =>
          updateProducts(product, products)
        }
      />
    </main>
  );
}
interface tableProps {
  products: ProductInfo[] | undefined;
  onOpen: () => void;
  selectProduct: (p: ProductInfo) => void;
}
const TableComp: React.FC<tableProps> = ({
  products,
  onOpen,
  selectProduct,
}) => {
  const columns = [
    {
      key: "description",
      label: "DESCRIPTION",
    },
    {
      key: "added",
      label: "ADDED",
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
    {
      key: "actions",
      label: "ACTIONS",
    },
  ];
  const renderCell = useCallback((product: ProductInfo, columnKey: Key) => {
    function hasDecimal(number: number) {
      return number % 1 !== 0;
    }
    function setQuantityUnit(number: number) {
      if (hasDecimal(number)) {
        return number + " kg";
      }
      return number + " ud";
    }
    const cellValue = product?.[columnKey as keyof ProductInfo];
    switch (columnKey) {
      case "description":
        return <p className="text-bold text-sm capitalize">{cellValue}</p>;
      case "added":
        return (
          <div className="flex gap-4">
            {product?.user_products?.map((user: any) => {
              return (
                <User
                  key={product.product_id + user.user_id.id}
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
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Details">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <IconEye />
              </span>
            </Tooltip>
            <Tooltip content="Edit user">
              <span
                onClick={() => {
                  onOpen();
                  selectProduct(product);
                }}
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
              >
                <IconEdit />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete user">
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <IconTrash />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);
  return (
    <Table
      aria-label="Selection behavior table example with dynamic content"
      selectionMode="multiple"
      onSelectionChange={(s) => {
        for (let select of s) {
          console.log(select);
        }
      }}
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.key}
            align={column.key === "actions" ? "center" : "start"}
          >
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={products}>
        {(item) => (
          <TableRow
            key={item.amount + item.description + item.invoice_id}
            className="cursor-pointer"
          >
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

interface cardProps {
  title?: string;
  colors?: string;
  avatar?: string;
  selected?: boolean;
  toggle?: () => void;
}
const Card = ({ title, colors, avatar, selected, toggle }: cardProps) => {
  return (
    <div className="w-full max-w-full  mb-6  sm:flex-none xl:mb-0 xl:w-fit">
      <div
        onClick={toggle}
        className={twMerge(
          "relative cursor-pointer flex flex-col min-w-0 break-words bg-zinc-900 shadow-dark-xl rounded-2xl bg-clip-border border-zinc-800 border-2 transition-all",
          selected && "border-white"
        )}
      >
        <div className="flex-auto p-2 px-3">
          <div className="flex gap-4 flex-row items-center justify-between">
            <Avatar size="sm" src={avatar} />
            <div className="flex-none max-w-full ">
              <div>
                <p className=" font-sans font-semibold leading-normal uppercase text-white opacity-60 text-xs">
                  {title}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface modalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  product?: ProductInfo;
  updateProducts: (product: ProductInfo, products: ProductInfo[]) => void;
}
const ModalComp = ({
  isOpen,
  product,
  onOpenChange,
  updateProducts,
}: modalProps) => {
  console.log(product);
  if (!product) return;
  const { user_products, quantity, amount, unit_price, ...rest } = product;

  const users = product?.user_products?.map((user: any) => {
    return {
      user_products: [user],
      quantity: quantity / 2,
      unit_price: unit_price,
      amount: amount / 2,
      ...rest,
    };
  });
  const formatN = (amount: number) => {
    const result = Intl.NumberFormat("es", {
      useGrouping: true,
      minimumIntegerDigits: 1,
      maximumFractionDigits: 2,
    }).format(amount);
    return !result || result === "NaN" ? "0.00" : result;
  };
  const [usersProduct, setUsersProduct] = useState(users);
  console.log(users);

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Edit product line
            </ModalHeader>
            <ModalBody className="gap-4">
              <div className="flex gap-4 w-full bg-zinc-800 p-3 rounded-md ">
                <div className="flex flex-col gap-2 flex-grow basis-32">
                  <span>DESCRIPTION</span>
                  <span>{product?.description}</span>
                </div>
                <div className="flex flex-col gap-2 flex-grow basis-32">
                  <span>QUANTITY</span>
                  <span>{product?.quantity}</span>
                </div>
                <div className="flex flex-col gap-2 flex-grow basis-32">
                  <span>UNIT PRICE</span>
                  <span>
                    {formatCurrency(
                      parseFloat(product?.unit_price?.toString() ?? "0")
                    )}
                  </span>
                </div>
                <div className="flex flex-col gap-2 flex-grow basis-32">
                  <span>AMOUNT</span>
                  <span>
                    {formatCurrency(
                      parseFloat(product?.amount?.toString() ?? "0")
                    )}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-4 w-full bg-zinc-800 p-3 rounded-md">
                <div className="flex gap-4 w-full ">
                  <span className="flex-grow basis-32">USERS</span>
                  <span className="flex-grow basis-32">PERCENTAGE</span>
                  <span className="flex-grow basis-32">QUANTITY</span>
                  <span className="flex-grow basis-32">AMOUNT</span>
                </div>
                {usersProduct?.map((p: any) => {
                  return (
                    <div
                      className="flex gap-4 w-full items-center"
                      key={p.user_products[0]?.user_id.id}
                    >
                      <div className="flex flex-grow basis-32">
                        <User
                          avatarProps={{
                            radius: "full",
                            src: p.user_products[0]?.user_id.avatar_url,
                          }}
                          name={""}
                        />
                      </div>
                      <div className="flex flex-grow basis-32">
                        <input
                          className="w-28 p-2 rounded-md"
                          value={formatN((p.quantity / quantity) * 100)}
                          onChange={(event) => {
                            let value = parseFloat(event.target.value) / 100;
                            let percentage = event.target.value;
                            console.log(value);
                            if (!value) value = 0;
                            if (value > 1) return;

                            const newUsersPRoduct = usersProduct.map(
                              (u: any) => {
                                if (
                                  p.user_products[0]?.user_id ==
                                  u.user_products[0]?.user_id
                                ) {
                                  let q = quantity * value;
                                  u.quantity = q;
                                  u.amount = unit_price * q;
                                } else {
                                  let q =
                                    (quantity * (1 - value)) /
                                    (usersProduct.length - 1);
                                  u.quantity = q;
                                  u.amount = unit_price * q;
                                }
                                return u;
                              }
                            );
                            console.log(newUsersPRoduct);
                            setUsersProduct(newUsersPRoduct);
                          }}
                        />
                      </div>
                      <div className="flex flex-grow basis-32">
                        <input
                          className="w-28 p-2 rounded-md"
                          value={formatN(p.quantity)}
                          onChange={(event) => {
                            let value = parseInt(event.target.value);
                            console.log(value);
                            if (!value) value = 0;
                            if (value > quantity) return;

                            const newUsersPRoduct = usersProduct.map(
                              (u: any) => {
                                if (
                                  p.user_products[0]?.user_id ==
                                  u.user_products[0]?.user_id
                                ) {
                                  u.quantity = value;
                                  u.amount = unit_price * value;
                                } else {
                                  let q =
                                    (quantity - value) /
                                    (usersProduct.length - 1);
                                  u.quantity = q;
                                  u.amount = unit_price * q;
                                }
                                return u;
                              }
                            );
                            console.log(newUsersPRoduct);
                            setUsersProduct(newUsersPRoduct);
                          }}
                        />
                      </div>
                      <div className="flex flex-grow basis-32">
                        <span>
                          {formatCurrency(
                            parseFloat(p?.amount?.toString() ?? "0")
                          )}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button
                color="primary"
                onPress={() => updateProducts(product, usersProduct)}
              >
                Save
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
