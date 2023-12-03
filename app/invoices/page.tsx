import { redirect } from 'next/navigation'

import { InvoceLists } from '@/app/components/invoices-list'

import { getInvoices } from '../actions/get-invoices'
import { getSession } from '../actions/get-session'

export default async function Invoices() {
  const session = getSession();

  if (!session) {
    redirect("/login");
  }
  const invoices = await getInvoices();
  if (invoices)
    return (
      <section className="flex flex-col w-full h-full gap-6">
        {/* <ComposeInvoice /> */}
        <InvoceLists invoices={invoices} />
      </section>
    );
}
