module.exports = {
  chainWebpack: (config) => {
    config.entry('app').clear().add('./dev/main.ts');
  }
};
