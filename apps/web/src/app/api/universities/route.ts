import { getUniversities } from "@/services/university.service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? undefined;

  const universities = await getUniversities(search);
  return Response.json(universities);
}
