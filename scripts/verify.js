const { spawnSync } = require("child_process");

const VERIFICATION_STAGES = Object.freeze(["lint", "test:ci", "build", "verify:build"]);

function runNpmStage(
  stage,
  spawn = spawnSync,
  nodePath = process.execPath,
  npmExecPath = process.env.npm_execpath
) {
  if (!npmExecPath) {
    console.error(`Could not run npm run ${stage}: npm did not provide its CLI path.`);
    return 1;
  }

  const result = spawn(nodePath, [npmExecPath, "run", stage], {
    env: { ...process.env, CI: "true" },
    stdio: "inherit",
  });

  if (result.error) {
    console.error(`Could not run npm run ${stage}: ${result.error.message}`);
    return 1;
  }
  if (result.status === null) {
    console.error(
      `npm run ${stage} did not exit normally${result.signal ? ` (signal ${result.signal})` : ""}.`
    );
    return 1;
  }

  return result.status;
}

function runVerification(runStage = runNpmStage) {
  for (const stage of VERIFICATION_STAGES) {
    let status;
    try {
      status = runStage(stage);
    } catch (error) {
      console.error(`Could not run npm run ${stage}: ${error.message || error}`);
      return 1;
    }

    if (status !== 0) {
      console.error(`Verification stopped at npm run ${stage} (exit code ${status}).`);
      return Number.isInteger(status) && status > 0 ? status : 1;
    }
  }

  return 0;
}

if (require.main === module) {
  process.exitCode = runVerification();
}

module.exports = { VERIFICATION_STAGES, runNpmStage, runVerification };
