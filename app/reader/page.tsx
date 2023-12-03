import { redirect } from "next/navigation";

import { getFriends } from "../actions/get-friends";
import { getSession } from "../actions/get-session";
import ReaderClient from "../components/reader";

export default async function Reader() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }
  const user = session.user;
  const friends = await getFriends(session.user.id);
  const friendsIDs: string[] = [
    ...(friends?.map((friend) => friend?.friend_id?.id || "") ?? []),
    session.user.id,
  ];
  return <ReaderClient session={session} friends={friends} />;
}
