// eslint-disable-next-line @typescript-eslint/no-require-imports
const hre = require("hardhat");

async function main() {
  try {
    console.log("Deploying SongNFT contract...");
    
    // Get the contract factory
    const SongNFT = await hre.ethers.getContractFactory("SongNFT");
    
    // Deploy the contract
    const songNFT = await SongNFT.deploy();
    
    // Wait for the deployment
    await songNFT.waitForDeployment();
    
    // Get the contract address
    const contractAddress = await songNFT.getAddress();
    console.log(`SongNFT deployed to: ${contractAddress}`);

    if (network.name !== "hardhat" && network.name !== "localhost") {
      // Simple delay to ensure the contract is deployed before verification
      console.log("Verifying contract on Etherscan...");
      await songNFT.deploymentTransaction().wait(6);
      
      try {
        await hre.run("verify:verify", {
          address: contractAddress,
          constructorArguments: []
        });
        console.log("Contract verified on Etherscan!");
      } catch (error) {
        console.log("Verification failed:", error);
      }
    }

    // Save deployment info
    const deploymentInfo = {
      contract: "SongNFT",
      address: contractAddress,
      network: hre.network.name,
      chainId: hre.network.config.chainId,
      timestamp: new Date().toISOString()
    };

    console.log("\nDeployment Info:", deploymentInfo);
    
    // Create example song if specified
    if (process.env.CREATE_EXAMPLE_SONG === "true") {
      await createExampleSong(songNFT);
    }

  } catch (error) {
    console.error("Error during deployment:", error);
    process.exit(1);
  }
}

async function createExampleSong(songNFT) {
  console.log("\nCreating example song...");
  
  const [deployer] = await hre.ethers.getSigners();
  
  const songData = {
    title: "Example Song",
    artist: "Test Artist",
    ipfsHash: "QmExample...", // Replace with actual IPFS hash
    metadataURI: "ipfs://QmExample.../metadata.json", // Replace with actual metadata URI
    mintPrice: hre.ethers.parseEther("0.1"), // 0.1 ETH
    stakeholderAddresses: [
      deployer.address, // Using deployer as example stakeholder
      deployer.address  // Replace with actual addresses in production
    ],
    sharePercentages: [
      7000, // 70%
      3000  // 30%
    ]
  };

  const tx = await songNFT.createSong(
    songData.title,
    songData.artist,
    songData.ipfsHash,
    songData.metadataURI,
    songData.mintPrice,
    songData.stakeholderAddresses,
    songData.sharePercentages
  );

  await tx.wait();
  console.log("Example song created successfully!");
}

// Execute deployment
main().then(() => process.exit(0)).catch((error) => {
  console.error(error);
  process.exit(1);
});