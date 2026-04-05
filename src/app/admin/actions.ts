"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/getSession";
import { isAdmin } from "@/lib/auth/isAdmin";

export async function purgeCache() {
  const user = await getSession();
  if (!user || !isAdmin(user.email)) {
    throw new Error("Unauthorized");
  }

  const brands = [
    "grimdark-future",
    "age-of-fantasy",
    "pokemon",
    "basing-battle-effects",
    "gaming-accessories-terrain",
    "display-figures-busts",
  ];

  revalidatePath("/shop");
  revalidatePath("/new-arrivals");
  revalidatePath("/preorders");
  revalidatePath("/");
  for (const brand of brands) {
    revalidatePath(`/${brand}`);
    revalidatePath(`/${brand}`, "layout");
  }
}
