import { monorepo } from "@aws/pdk";
import { javascript, typescript } from "projen";

const project = new monorepo.MonorepoTsProject({
  devDeps: ["@aws/pdk"],
  eslint: true,
  github: true,
  name: "map-and-counter-design",
  packageManager: javascript.NodePackageManager.NPM,
  prettier: true,
  projenrcTs: true,
  gitignore: ["map/output-files/", "map/src/*.svg"],
});

const mapApp = new typescript.TypeScriptAppProject({
  parent: project,
  name: "map-app",
  defaultReleaseBranch: "main",
  outdir: "map",
  packageManager: project.package.packageManager,
  tsconfig: {
    compilerOptions: {
      alwaysStrict: undefined,
      declaration: undefined,
      esModuleInterop: undefined,
      experimentalDecorators: undefined,
      inlineSourceMap: undefined,
      inlineSources: undefined,
      lib: undefined,
      module: "es2022",
      noEmitOnError: undefined,
      noFallthroughCasesInSwitch: undefined,
      noImplicitAny: undefined,
      noImplicitReturns: undefined,
      noImplicitThis: undefined,
      noUnusedLocals: undefined,
      noUnusedParameters: undefined,
      resolveJsonModule: undefined,
      strict: undefined,
      strictNullChecks: undefined,
      strictPropertyInitialization: undefined,
      stripInternal: undefined,
      target: undefined,
      moduleResolution: javascript.TypeScriptModuleResolution.BUNDLER,
      noEmit: true,
    },
    extends: javascript.TypescriptConfigExtends.fromPaths([
      "@tsconfig/node18/tsconfig.json",
    ]),
  },
});
mapApp.addDevDeps("@tsconfig/node18");

project.synth();
