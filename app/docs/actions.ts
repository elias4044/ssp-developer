"use server";
import { revalidatePath, updateTag } from "next/cache";
import { docsCacheTag, getDocsIndex } from "@/lib/docs";

export async function checkDocsUpdates() {
  updateTag(docsCacheTag);
  const index = await getDocsIndex();
  if (index.status === "unavailable") return { status: index.status };
  revalidatePath("/docs", "layout");
  revalidatePath("/llms.txt");
  revalidatePath("/llms-full.txt");
  revalidatePath("/");
  return {
    status: index.status,
    revision: index.revision,
    checkedAt: index.checkedAt,
  };
}
