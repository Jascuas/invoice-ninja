import { redirect } from "next/navigation";
import { twMerge } from "tailwind-merge";

import { Invoice, UserInvoiceTotal } from "@/app/@types/invoices";
import { getInvoice } from "@/app/actions/get-invoice";
import { getInvoiceProducts } from "@/app/actions/get-invoice-products";
import { getInvoiceUserTotal } from "@/app/actions/get-invoice-user-total";
import { InvoiceProductsList } from "@/app/components/invoice-products-list";
import { formatCurrency } from "@/app/utils";
import { Avatar } from "@nextui-org/react";
import { IconCoin } from "@tabler/icons-react";

import { getSession } from "../../actions/get-session";

type Props = {
  params: {
    id?: string;
  };
};

export default async function Invoices({ params }: Props) {
  const session = getSession();

  if (!session) {
    redirect("/login");
  }
  const invoice = await getInvoice(params?.id ?? "");
  const invoiceProducts = await getInvoiceProducts(params?.id ?? "");
  const invoiceUserTotal = await getInvoiceUserTotal(params?.id ?? "");
  console.log(invoiceProducts);
  if (invoiceProducts && invoice && invoiceUserTotal)
    return (
      <section className="flex flex-col w-full h-full gap-6">
        <Cards invoiceUserTotal={invoiceUserTotal} invoice={invoice} />
        <InvoiceProductsList
          invoiceProducts={invoiceProducts}
          invoiceUserTotal={invoiceUserTotal}
        />
      </section>
    );
}

const Cards = ({
  invoiceUserTotal,
  invoice,
}: {
  invoiceUserTotal: UserInvoiceTotal;
  invoice: Invoice;
}) => {
  return (
    <div className="flex flex-wrap -mx-3">
      <Card
        title="Invoice total"
        content={formatCurrency(invoice?.sub_total ?? 0)}
        icon={<IconCoin />}
      />
      {invoiceUserTotal?.map((user) => (
        <Card
          title={user.user_id.user_name}
          content={formatCurrency(user.total ?? 0)}
          avatar={user.user_id.avatar_url}
        />
      ))}
    </div>
  );
};
interface cardProps {
  title: string;
  avatar?: string;
  content: string;
  subtitle?: string;
  contentSubtitle?: string;
  colors?: string;
  icon?: JSX.Element;
}
const Card = ({
  title,
  avatar,
  content,
  subtitle,
  contentSubtitle,
  colors,
  icon,
}: cardProps) => {
  return (
    <div className="w-full max-w-full px-3 mb-6 sm:w-1/2 sm:flex-none xl:mb-0 xl:w-1/4">
      <div className="relative flex flex-col min-w-0 break-words bg-zinc-900 shadow-dark-xl rounded-2xl bg-clip-border border-zinc-800 border-2">
        <div className="flex-auto p-4">
          <div className="flex flex-row items-center justify-between">
            <div className="flex-none w-2/3 max-w-full px-3">
              <div>
                <p className="mb-0 font-sans font-semibold leading-normal uppercase text-white opacity-60 text-sm">
                  {title}
                </p>
                <h5 className="font-bold text-white">{content}</h5>
                {subtitle && (
                  <p className="mb-0 text-white opacity-60">
                    <span className="font-bold leading-normal text-sm text-emerald-500">
                      {subtitle}
                    </span>
                    {contentSubtitle}
                  </p>
                )}
              </div>
            </div>
            <div
              className={twMerge(
                "flex items-center justify-center w-12 h-12 text-center rounded-circle  rounded-full",
                colors,
                icon && "bg-gradient-to-tl from-blue-500 to-violet-500"
              )}
            >
              {icon && icon}
              {avatar && <Avatar size="md" src={avatar} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
