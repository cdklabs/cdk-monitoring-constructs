// Helps ensure consistent test snapshot generation between runs
expect.addSnapshotSerializer({
  test: (val) => typeof val === "string" && /([A-Fa-f0-9]{64}).zip/.test(val),
  print: (val) =>
    `"${(val as string).replace(
      /([A-Fa-f0-9]{64}).zip/,
      "[HASH REMOVED].zip",
    )}"`,
});

expect.addSnapshotSerializer({
  test: (val) =>
    val && Object.prototype.hasOwnProperty.call(val, "LatestNodeRuntimeMap"),
  print: (_val) => "[MAPPING REMOVED]",
});

// Replicates CDK_DISABLE_STACK_TRACE=1 outside of a CDK App context
expect.addSnapshotSerializer({
  test: (val) =>
    Array.isArray(val) &&
    val.length > 0 &&
    typeof val[0] === "string" &&
    (val[0].includes("stack traces disabled") ||
      val[0].includes("new ") ||
      val[0].includes("Object.<anonymous>")),
  print: (_val) =>
    `Array [
            "stack traces disabled",
          ]`,
});
