import { redirect } from "next/navigation";

import { getFriends } from "../actions/get-friends";
import { getSession } from "../actions/get-session";
import { getUserProducts } from "../actions/get-user-products";
import { ProductList } from "../components/products-list";

export default async function Invoices() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const friends = await getFriends(session.user.id);
  const friendsIDs: string[] = [
    ...(friends?.map((friend) => friend?.friend_id?.id || "") ?? []),
    session.user.id,
  ];
  const user_products = await getUserProducts(friendsIDs);
  if (user_products)
    return (
      <section className="flex flex-col w-full h-full gap-6 ">
        <ProductList
          products={user_products}
          session={session}
          friends={friends}
        />
      </section>
    );
}
