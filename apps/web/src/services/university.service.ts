import { findUniversities } from "@/repositories/university.repository";

export async function getUniversities(search?: string) {
  return findUniversities(search?.trim() || undefined);
}
