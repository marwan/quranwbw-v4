import svelte from "rollup-plugin-svelte";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import css from "rollup-plugin-css-only";
import alias from "@rollup/plugin-alias";
import path from "path";

const production = !process.env.ROLLUP_WATCH;

function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = require("child_process").spawn("npm", ["run", "start", "--", "--dev"], {
        stdio: ["ignore", "inherit", "inherit"],
        shell: true,
      });

      process.on("SIGTERM", toExit);
      process.on("exit", toExit);
    },
  };
}

export default {
  plugins: [
    alias({
      entries: [
        { find: "$components", replacement: path.resolve(__dirname, "./src/components") },
        { find: "$ui", replacement: path.resolve(__dirname, "./src/components/ui") },
        { find: "$modals", replacement: path.resolve(__dirname, "./src/components/ui/modals") },
        { find: "$verses", replacement: path.resolve(__dirname, "./src/components/verses") },
        { find: "$displays", replacement: path.resolve(__dirname, "./src/components/verses/displays") },
        { find: "$svgs", replacement: path.resolve(__dirname, "./src/components/svgs") },
        { find: "$utils", replacement: path.resolve(__dirname, "./src/utils") },
        { find: "$views", replacement: path.resolve(__dirname, "./src/views") },
        { find: "$data", replacement: path.resolve(__dirname, "./src/data") },
        { find: "$lib", replacement: path.resolve(__dirname, "./src/lib") },
      ],
    }),

    svelte({
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production,
      },
    }),
    // we'll extract any component CSS out into
    // a separate file - better for performance
    css({ output: "bundle.css" }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true,
      dedupe: ["svelte"],
    }),
    commonjs(),

    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !production && serve(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload("public"),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),
  ],

  input: "src/main.js",
  output: {
    sourcemap: true,
    format: "iife",
    name: "app",
    file: "public/build/bundle.js",
  },

  watch: {
    clearScreen: false,
  },
};
