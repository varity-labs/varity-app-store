import hre from "hardhat";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log("=== Solidity Gas Baseline Measurement ===\n");

  // Deploy contract
  console.log("Deploying VarityAppRegistry...");
  const VarityAppRegistry = await hre.ethers.getContractFactory("VarityAppRegistry");
  const registry = await VarityAppRegistry.deploy();
  await registry.waitForDeployment();

  const deploymentReceipt = await registry.deploymentTransaction().wait();
  console.log(`Contract deployed to: ${await registry.getAddress()}`);
  console.log(`Deployment gas used: ${deploymentReceipt.gasUsed.toString()}\n`);

  const [owner, developer, admin2] = await hre.ethers.getSigners();

  // Prepare test data
  const appData = {
    name: "DeFi Swap",
    description: "A decentralized exchange for seamless token swaps with low fees and high liquidity",
    appUrl: "https://defi-swap.example.com",
    logoUrl: "https://defi-swap.example.com/logo.png",
    category: "DeFi",
    chainId: 33529,
    builtWithVarity: true,
    githubUrl: "https://github.com/example/defi-swap",
    screenshotUrls: [
      "https://defi-swap.example.com/screenshot1.png",
      "https://defi-swap.example.com/screenshot2.png",
      "https://defi-swap.example.com/screenshot3.png"
    ]
  };

  const gasResults = {
    deployment: deploymentReceipt.gasUsed.toString(),
    operations: {}
  };

  // Test 1: Register App
  console.log("Test 1: register_app()");
  const registerTx = await registry.connect(developer).registerApp(
    appData.name,
    appData.description,
    appData.appUrl,
    appData.logoUrl,
    appData.category,
    appData.chainId,
    appData.builtWithVarity,
    appData.githubUrl,
    appData.screenshotUrls
  );
  const registerReceipt = await registerTx.wait();
  console.log(`Gas used: ${registerReceipt.gasUsed.toString()}`);
  gasResults.operations.register_app = registerReceipt.gasUsed.toString();

  // Test 2: Get App (view function - no gas cost in transactions)
  console.log("\nTest 2: get_app() (view function)");
  const appInfo = await registry.getApp(1);
  console.log(`App name: ${appInfo.name}`);
  console.log(`App category: ${appInfo.category}`);
  console.log("Note: View functions don't consume gas in transactions");

  // Test 3: Approve App
  console.log("\nTest 3: approve_app()");
  const approveTx = await registry.connect(owner).approveApp(1);
  const approveReceipt = await approveTx.wait();
  console.log(`Gas used: ${approveReceipt.gasUsed.toString()}`);
  gasResults.operations.approve_app = approveReceipt.gasUsed.toString();

  // Test 4: Feature App
  console.log("\nTest 4: feature_app()");
  const featureTx = await registry.connect(owner).featureApp(1);
  const featureReceipt = await featureTx.wait();
  console.log(`Gas used: ${featureReceipt.gasUsed.toString()}`);
  gasResults.operations.feature_app = featureReceipt.gasUsed.toString();

  // Test 5: Update App
  console.log("\nTest 5: update_app()");
  const updateTx = await registry.connect(developer).updateApp(
    1,
    "Updated description with more details about the DeFi protocol",
    "https://defi-swap-v2.example.com",
    [
      "https://defi-swap.example.com/screenshot1-updated.png",
      "https://defi-swap.example.com/screenshot2-updated.png"
    ]
  );
  const updateReceipt = await updateTx.wait();
  console.log(`Gas used: ${updateReceipt.gasUsed.toString()}`);
  gasResults.operations.update_app = updateReceipt.gasUsed.toString();

  // Test 6: Add Admin
  console.log("\nTest 6: add_admin()");
  const addAdminTx = await registry.connect(owner).addAdmin(admin2.address);
  const addAdminReceipt = await addAdminTx.wait();
  console.log(`Gas used: ${addAdminReceipt.gasUsed.toString()}`);
  gasResults.operations.add_admin = addAdminReceipt.gasUsed.toString();

  // Test 7: Register multiple apps for query testing
  console.log("\nTest 7: Registering 5 more apps for query tests...");
  const categories = ["Gaming", "NFT", "DeFi", "Social", "DAO"];
  const registerGasCosts = [];

  for (let i = 0; i < 5; i++) {
    const tx = await registry.connect(developer).registerApp(
      `Test App ${i + 2}`,
      `Description for test app ${i + 2}`,
      `https://app${i + 2}.example.com`,
      `https://app${i + 2}.example.com/logo.png`,
      categories[i],
      33529 + i,
      i % 2 === 0,
      `https://github.com/example/app${i + 2}`,
      [`https://app${i + 2}.example.com/screenshot.png`]
    );
    const receipt = await tx.wait();
    registerGasCosts.push(receipt.gasUsed.toString());

    // Approve every other app
    if (i % 2 === 0) {
      await registry.connect(owner).approveApp(i + 2);
    }
  }
  console.log(`Average register gas (5 apps): ${calculateAverage(registerGasCosts)}`);

  // Test 8: Get Apps by Category
  console.log("\nTest 8: get_apps_by_category()");
  const defiApps = await registry.getAppsByCategory("DeFi", 10);
  console.log(`Found ${defiApps.length} DeFi apps: [${defiApps.join(", ")}]`);
  console.log("Note: View function - no gas cost");

  // Test 9: Get Apps by Developer
  console.log("\nTest 9: get_apps_by_developer()");
  const devApps = await registry.getAppsByDeveloper(developer.address, 10);
  console.log(`Found ${devApps.length} apps by developer`);
  console.log("Note: View function - no gas cost");

  // Test 10: Get Apps by Chain
  console.log("\nTest 10: get_apps_by_chain()");
  const chainApps = await registry.getAppsByChain(33529, 10);
  console.log(`Found ${chainApps.length} apps on chain 33529`);
  console.log("Note: View function - no gas cost");

  // Test 11: Get All Apps
  console.log("\nTest 11: get_all_apps()");
  const allApps = await registry.getAllApps(20);
  console.log(`Found ${allApps.length} approved and active apps`);
  console.log("Note: View function - no gas cost");

  // Test 12: Get Featured Apps
  console.log("\nTest 12: get_featured_apps()");
  const featuredApps = await registry.getFeaturedApps(10);
  console.log(`Found ${featuredApps.length} featured apps`);
  console.log("Note: View function - no gas cost");

  // Test 13: Get Pending Apps
  console.log("\nTest 13: get_pending_apps()");
  const pendingApps = await registry.getPendingApps(10);
  console.log(`Found ${pendingApps.length} pending apps`);
  console.log("Note: View function - no gas cost");

  // Test 14: Reject App
  console.log("\nTest 14: reject_app()");
  const rejectTx = await registry.connect(owner).rejectApp(2, "Does not meet quality standards");
  const rejectReceipt = await rejectTx.wait();
  console.log(`Gas used: ${rejectReceipt.gasUsed.toString()}`);
  gasResults.operations.reject_app = rejectReceipt.gasUsed.toString();

  // Test 15: Deactivate App
  console.log("\nTest 15: deactivate_app()");
  const deactivateTx = await registry.connect(developer).deactivateApp(1);
  const deactivateReceipt = await deactivateTx.wait();
  console.log(`Gas used: ${deactivateReceipt.gasUsed.toString()}`);
  gasResults.operations.deactivate_app = deactivateReceipt.gasUsed.toString();

  // Save results to JSON
  const resultsPath = path.join(__dirname, "..", "gas-results.json");
  fs.writeFileSync(resultsPath, JSON.stringify(gasResults, null, 2));
  console.log(`\nGas results saved to: ${resultsPath}`);

  // Print summary
  console.log("\n=== Gas Usage Summary ===");
  console.log(`Deployment: ${formatGas(gasResults.deployment)}`);
  console.log("\nWrite Operations:");
  Object.entries(gasResults.operations).forEach(([op, gas]) => {
    console.log(`  ${op}: ${formatGas(gas)}`);
  });

  console.log("\n=== Comparison Notes ===");
  console.log("View functions (get_*) don't consume gas in transactions.");
  console.log("These gas costs are for the Solidity baseline.");
  console.log("Compare with Stylus implementation for 40%+ savings.");
}

function calculateAverage(values) {
  const sum = values.reduce((acc, val) => acc + BigInt(val), BigInt(0));
  return (sum / BigInt(values.length)).toString();
}

function formatGas(gas) {
  const gasNum = parseInt(gas);
  return `${gasNum.toLocaleString()} gas`;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
