const {network} = require("hardhat")
const fs = require("fs");

module.exports = async ({getNamedAccounts, deployments}) => {
    const {deploy, log} = deployments
    const {deployer} = await getNamedAccounts()
    let memeNFT;
    log("Deploying MemeNFT")
    if (network.name === "localhost" || network.name === "matic") {
        memeNFT = await deploy("MemeNFT", {from: deployer, log: true, args: []})
    } else {
        throw new Error("Cannot deploy MemeNFT - unsupported network")
    }
    saveFrontendFiles(memeNFT.address)
    log("npx hardhat verify --network " + network.name + " " + memeNFT.address)
}

//TODO: use --export-all
function saveFrontendFiles(memeNFTAddress) {
    const contractsDir = __dirname + "/../../frontend/src/contracts";

    if (!fs.existsSync(contractsDir)) {
        fs.mkdirSync(contractsDir);
    }

    fs.writeFileSync(
        contractsDir + "/contract-address.json",
        JSON.stringify({MemeNFT: memeNFTAddress}, undefined, 2)
    );

    const LotteryArtifact = artifacts.readArtifactSync("MemeNFT");

    fs.writeFileSync(
        contractsDir + "/MemeNFT.json",
        JSON.stringify(LotteryArtifact, null, 2)
    );
}