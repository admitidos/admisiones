import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

export default tseslint.config(
  {
    ignores: ["apps/web/**", "**/node_modules/**", "**/dist/**"],
  },
  tseslint.configs.recommended,
  prettier
);
