const hre = require("hardhat");

async function main() {
    const Coinflip = await hre.ethers.getContractFactory("Coinflip");
    const coinflip = await Coinflip.deploy();

    await coinflip.deployed();

    console.log("Coinflip deployed to:", coinflip.address);
}

// Run the main function and handle errors
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
