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
