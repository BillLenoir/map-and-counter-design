import { javascript } from "projen";
import { monorepo } from "@aws/pdk";
const project = new monorepo.MonorepoTsProject({
  devDeps: ["@aws/pdk"],
  eslint: true,
  github: true,
  name: "map-and-counter-design",
  packageManager: javascript.NodePackageManager.NPM,
  prettier: true,
  projenrcTs: true,
});
project.synth();