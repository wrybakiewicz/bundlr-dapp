const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MemeNFT", function () {
  it("should mint three tokens", async function () {
    const [owner, address1, address2] = await ethers.getSigners();
    const MemeNFT = await ethers.getContractFactory("MemeNFT");
    const memeNFT = await MemeNFT.deploy();
    await memeNFT.deployed();
    const url1 = "some1.url"
    const url2 = "some2.url"
    const url3 = "some3.url"

    await memeNFT.mint(url1)
    await memeNFT.mint(url2)
    await memeNFT.connect(address1).mint(url3)

    expect(await memeNFT.name()).to.equal("MemeNFT");
    expect(await memeNFT.symbol()).to.equal("MNFT");
    expect(await memeNFT.ownerOf(1)).to.equal(owner.address);
    expect(await memeNFT.tokenURI(1)).to.equal(url1);
    expect(await memeNFT.ownerOf(2)).to.equal(owner.address);
    expect(await memeNFT.tokenURI(2)).to.equal(url2);
    expect(await memeNFT.ownerOf(3)).to.equal(address1.address);
    expect(await memeNFT.tokenURI(3)).to.equal(url3);
    expect(await memeNFT.balanceOf(owner.address)).to.equal(2);
    expect(await memeNFT.balanceOf(address1.address)).to.equal(1);
    expect(await memeNFT.balanceOf(address2.address)).to.equal(0);
  });

});
