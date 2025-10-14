import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
    {
        files: ["**/*.{js,mjs,cjs}"],
        plugins: { js },
        extends: ["js/recommended"],
        languageOptions: { globals: globals.browser },
        rules: {
            "indent": ["error", 4],
            "no-unused-vars": "warn",
            "no-console": "off",
            "eqeqeq": "error",
            "semi": ["error", "always"],
            "quotes": ["error", "double"]
        }

    }]);
