module.exports = function (api) {
  api.cache(true);
  const presets = [["@babel/env", { targets: "ie 9" }]];
  return { presets };
};
