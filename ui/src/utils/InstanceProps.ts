export default interface InstanceProps {
  // Stack
  stackName: string;
  stackEnvironment: string;
  stackRegion: string;
  stackAppUrl: string;
  stackLogsUrl: string;

  // Instance Display
  instanceName: string;
  instancePublicIP: string;
  instanceCreatedAt: string;
  instanceUpdatedAt: string;
  instanceBuild: string;
  instanceVersion: string;
  instanceDiskUsedGb: number;
  instanceDiskTotalGb: number;
  instanceKeyFileName: string;
  instanceIsChosenOne: boolean;
  instanceInGhostMode: boolean;
  instanceUpdatingToVersion: string | null;

  // Instance Display Advanced
  instanceAZ: string;
  instanceID: string;
  instanceType: string;

  // Health Check
  instanceLastHealthyAt: string;
  instanceHealthCode: number;
  instanceHealthMessage: string;
}
