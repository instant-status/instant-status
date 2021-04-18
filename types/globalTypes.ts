export interface InstanceProps {
  instanceAZ: string;
  instanceBuild: string;
  instanceDiskTotalGb: number;
  instanceDiskUsedGb: number;
  instanceHealthCode: number;
  instanceHealthMessage: string;
  server_id: string;
  instanceInGhostMode: false;
  instanceIsChosenOne: true;
  instanceKeyFileName: string;
  instanceLastHealthyAt: string;
  instanceName: string;
  instancePublicIP: string;
  instanceType: string;
  instanceUpdatedAt: string;
  instanceUpdatingToVersion: null;
  instanceVersion: string;
  stackAppUrl: string;
  stackEnvironment: string;
  stackLogsUrl: string;
  stackName: string;
  stackRegion: string;
}
