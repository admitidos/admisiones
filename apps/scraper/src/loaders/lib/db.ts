export async function createManyChunked<T extends object>(
  model: { createMany: (args: { data: T[]; skipDuplicates: boolean }) => Promise<{ count: number }> },
  data: T[],
  chunkSize = 1000,
): Promise<number> {
  let total = 0;
  for (let i = 0; i < data.length; i += chunkSize) {
    const result = await model.createMany({ data: data.slice(i, i + chunkSize), skipDuplicates: true });
    total += result.count;
  }
  return total;
}
