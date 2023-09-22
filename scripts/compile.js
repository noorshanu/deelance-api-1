const hre = require("hardhat");

const compile = async function () {
  console.log("Compiling Marketplace Contract...");
  await hre.run("compile");
  console.log("Compiled Marketplace Contract ✓");
};

compile();
