import { redirect } from "next/navigation";

import { getFriends } from "../actions/get-friends";
import { getSession } from "../actions/get-session";
import { FriendsList } from "../components/friends-list";

export default async function Invoices() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const friends = await getFriends(session.user.id);

  return (
    <section className="flex flex-col w-full h-full gap-6 my-2">
      <FriendsList friends={friends} />
    </section>
  );
}
