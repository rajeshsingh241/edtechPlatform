// craco.config.js
const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");

module.exports = {
  style: {
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer
      ]
    }
  },

  // Optional: Webpack customization
  webpack: {
    configure: (webpackConfig) => {
      return webpackConfig;
    }
  },

  // Optional: Dev server tweaks
  devServer: (devServerConfig) => {
    devServerConfig.allowedHosts = "all";
    return devServerConfig;
  }
};
