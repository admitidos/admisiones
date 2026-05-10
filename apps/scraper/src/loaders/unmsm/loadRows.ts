import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";
import { CSV_DIR } from "../../lib/paths";
import type { UNMSMRow } from "../../universities/unmsm/shared/types";

export function loadRows(): UNMSMRow[] {
  const rows: UNMSMRow[] = [];
  const universityDir = path.join(CSV_DIR, "unmsm");

  for (const processId of readdirSync(universityDir)) {
    const processDir = path.join(universityDir, processId);
    for (const file of readdirSync(processDir)) {
      if (!file.endsWith(".csv")) continue;
      const content = readFileSync(path.join(processDir, file), "utf-8");
      const parsed = parse(content, {
        columns: true,
        skip_empty_lines: true,
        cast: (value, context) => {
          if (context.header) return value;
          if (context.column === "score" || context.column === "rank") {
            const n = parseFloat(value);
            return isNaN(n) ? null : context.column === "rank" ? Math.round(n) : n;
          }
          if (context.column === "admitted") return value === "true";
          return value;
        },
      }) as UNMSMRow[];
      rows.push(...parsed);
    }
  }

  return rows;
}
