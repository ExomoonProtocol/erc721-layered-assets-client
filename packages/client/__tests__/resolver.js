module.exports = (path, options) => {
  // Call the defaultResolver, so we leverage its cache, error handling, etc.
  return options.defaultResolver(path, {
    ...options,
    // Use packageFilter to process parsed `package.json` before the resolution (see https://www.npmjs.com/package/resolve#resolveid-opts-cb)
    packageFilter: (pkg) => {
      let main = pkg.main;
      if (
        pkg.name.includes("exomoon")
      ) {
        main = "./src/index.ts";
      }
      return {
        ...pkg,
        // Alter the value of `main` before resolving the package
        main: main,
      };
    },
  });
};
