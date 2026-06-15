// craco.config.js
const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");

module.exports = {
  style: {
    postcss: {
      mode: "extends",
      loaderOptions: (postcssLoaderOptions) => {
        const plugins = postcssLoaderOptions.postcssOptions?.plugins || [];
        // Prepend tailwindcss and autoprefixer to existing plugins
        postcssLoaderOptions.postcssOptions = {
          ...postcssLoaderOptions.postcssOptions,
          plugins: [tailwindcss, autoprefixer, ...plugins],
        };
        return postcssLoaderOptions;
      },
    },
  },

  webpack: {
    configure: (webpackConfig) => {
      // Find all postcss-loader rules and inject tailwindcss
      const insertTailwindPlugin = (rules) => {
        if (!rules) return;
        rules.forEach((rule) => {
          if (rule && typeof rule === "object") {
            if (rule.use && Array.isArray(rule.use)) {
              rule.use.forEach((use) => {
                if (
                  use &&
                  typeof use === "object" &&
                  use.loader &&
                  use.loader.includes("postcss-loader")
                ) {
                  if (use.options && use.options.postcssOptions) {
                    const existingPlugins =
                      use.options.postcssOptions.plugins || [];
                    // Check if tailwindcss is already there
                    const hasTailwind = existingPlugins.some(
                      (p) =>
                        (typeof p === "function" &&
                          p.postcssPlugin === "tailwindcss") ||
                        (Array.isArray(p) && p[0] === "tailwindcss") ||
                        p === tailwindcss
                    );
                    if (!hasTailwind) {
                      use.options.postcssOptions.plugins = [
                        tailwindcss,
                        ...existingPlugins,
                      ];
                    }
                  }
                }
              });
            }
            if (rule.oneOf) insertTailwindPlugin(rule.oneOf);
            if (rule.rules) insertTailwindPlugin(rule.rules);
          }
        });
      };

      if (webpackConfig.module && webpackConfig.module.rules) {
        insertTailwindPlugin(webpackConfig.module.rules);
      }

      return webpackConfig;
    },
  },

  devServer: (devServerConfig) => {
    devServerConfig.allowedHosts = "all";
    return devServerConfig;
  },
};
