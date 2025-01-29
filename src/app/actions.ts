"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function linkWithMetamask(userAddress: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) redirect("/sign-in");

  await prisma.artist.create({
    data: { userId: session?.user.id, metamaskAddress: userAddress },
  });
  return true;
}
