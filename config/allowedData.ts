const ALLOWED_DATA = <const>[
  "instance_id",
  "stackName",
  "stackRegion",
  "stackEnvironment",
  "stackAppUrl",
  "stackLogsUrl",
  "instanceName",
  "instancePublicIP",
  "instanceUpdatedAt",
  "instanceVersion",
  "instanceDiskUsedGb",
  "instanceDiskTotalGb",
  "instanceKeyFileName",
  "instanceIsChosenOne",
  "instanceInGhostMode",
  "instanceUpdatingToVersion",
  "instanceAZ",
  "instanceID",
  "instanceType",
  "instanceLastHealthyAt",
  "instanceHealthCode",
  "instanceHealthMessage",
];

export type AllowedDataType = typeof ALLOWED_DATA[number];

export default ALLOWED_DATA;
