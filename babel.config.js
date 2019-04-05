module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: [
          "maintained node versions",
          "last 1 version",
          "> 5%",
          "not dead"
        ],
        // useBuiltIns: "usage",
        // corejs: "2",
        modules: false
      }
    ]
  ]
}