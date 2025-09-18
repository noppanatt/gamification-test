import * as tsconfigPaths from "tsconfig-paths";
import app from "../src/index";

tsconfigPaths.register({
  baseUrl: process.cwd(),
  paths: {
    "@routes/*": ["src/routes/*"],
    "@utils/*": ["src/utils/*"],
    "@constants/*": ["src/constants/*"],
    "@dto/*": ["src/dto/*"],
    "@validation/*": ["src/middlewares/validation/*"],
    "@database/*": ["src/database/*"],
    ".commit-id": ["commit-id"],
  },
});

export default app;
