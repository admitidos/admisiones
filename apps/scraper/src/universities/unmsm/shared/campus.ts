/** Parse a raw program string into its clean name and optional campus suffix.
 *
 * UNMSM publishes satellite campus programs with a " - CAMPUS" suffix:
 *   "PSICOLOGÍA - CHILCA"    → { clean: "PSICOLOGÍA",     campus: "CHILCA" }
 *   "ADMINISTRACIÓN - LIMA"  → { clean: "ADMINISTRACIÓN", campus: "LIMA"   }
 *   "MEDICINA HUMANA"        → { clean: "MEDICINA HUMANA", campus: ""      }
 *
 * Programs with no suffix are Lima main campus by convention — we do NOT add
 * an implicit "LIMA" campus tag; only explicit suffixes are stored.
 */
export function extractCampus(programRaw: string): { clean: string; campus: string } {
  const trimmed = programRaw.trim();
  const separatorIdx = trimmed.lastIndexOf(' - ');

  if (separatorIdx === -1) {
    return { clean: trimmed, campus: '' };
  }

  const campus = trimmed.slice(separatorIdx + 3).trim();
  const clean = trimmed.slice(0, separatorIdx).trim();
  return { clean, campus };
}
