"use client";

import { useState } from "react";
import { parse } from "csv-parse";
import { twMerge } from "tailwind-merge";
interface Product {
  quantity: number;
  description: string;
  unitPrice: number;
  amount: number;
}
interface CSVData {
  date: string;
  total: string;
  items: Product[];
}

export default function Reader() {
  const [data, setData] = useState<CSVData | null>(null);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    console.log("A");
    if (file) {
      const text = await file.text();
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
      parser.on("end", () => {
        // Filtrar líneas
        const dateRow = results.find((row) => row[0].includes("/"));
        const totalRow = results.find(
          (row) => row[row.length - 2] === "TOTAL (€)"
        );
        const cleanedResults = results.filter(
          (row) =>
            !row[0].includes("/") &&
            row[1] !== "Descripción" &&
            row[1] !== "Parking" &&
            row[3] !== "TOTAL (€)"
        );

        const normalProducts = [];
        const kgProducts = [];

        for (let i = 0; i < cleanedResults.length; i++) {
          const row = cleanedResults[i];
          const nextRow = cleanedResults[i + 1];
          // Si la fila contiene "kg" en la columna 1 o 3, es un producto en kg
          if (nextRow[1].includes("kg") || nextRow[3].includes("kg")) {
            const kgProduct = [...row];
            // Combina el nombre con el valor kg
            kgProduct[2] = nextRow[1].replace("kg", "").trim();
            kgProduct[3] = nextRow[3].replace("€/kg", "").trim();
            kgProduct[4] = nextRow[4];
            kgProducts.push(kgProduct);

            // Aumentar indice para saltar linea

            i++;
          } else {
            normalProducts.push(row);
          }
        }
        const transformNumbers = (val: string) => {
          return parseFloat(val.replace(",", "."));
        };

        // Transformar los productos en arrays con campos específicos
        const transformedNormalProducts = normalProducts.map((row) => ({
          quantity: transformNumbers(row[0]),
          description: row[1],
          unitPrice: transformNumbers(row[4]) / transformNumbers(row[0]),
          amount: transformNumbers(row[4]),
        }));

        const transformedKgProducts = kgProducts.map((row) => ({
          quantity: transformNumbers(row[2]),
          description: row[1],
          unitPrice: transformNumbers(row[3]),
          amount: transformNumbers(row[4]),
        }));

        console.log("Normal Products:", transformedNormalProducts);
        console.log("Kg Products:", transformedKgProducts);
        // Extraer fecha y total

        const date = dateRow ? dateRow[0] : "";
        const total = totalRow ? totalRow[totalRow.length - 1] : "";

        setData({
          date,
          total,
          items: [...transformedNormalProducts, ...transformedKgProducts],
        });
      });
    }
  };

  return (
    <main className="flex gap-4 min-h-screen flex-col items-center justify-center p-24">
      <input type="file" onChange={handleFileUpload} />
      <span>TOTAL: {data?.total}</span>
      <span>DATE: {data?.date}</span>

      <Table products={data?.items} />
    </main>
  );
}

const Table: React.FC<{ products: Product[] | undefined }> = ({ products }) => {
  return (
    <table className="min-w-full table-auto">
      <thead>
        <tr className="bg-gray-800 p-2">
          <th>Quantity</th>
          <th>Description</th>
          <th>Unit Price</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        {products?.map((product, index) => (
          <tr
            key={index}
            className={twMerge(
              "p-2 text-center",
              index % 2 === 0 && "bg-gray-700"
            )}
          >
            <td>{product.quantity.toFixed(3)}</td>
            <td>{product.description}</td>
            <td>{product.unitPrice.toFixed(2)}</td>
            <td>{product.amount.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
