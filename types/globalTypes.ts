export interface InstanceProps {
  instanceType: string;
  instanceID: string;
  instanceAZ: string;
  instanceUpdatingToVersion: null;
  instanceInGhostMode: false;
  instanceKeyFileName: string;
  instanceDiskTotalGb: number;
  instanceDiskUsedGb: number;
  instanceVersion: string;
  instancePublicIP: string;
  instanceName: string;
  stackRegion: string;
  stackName: string;
  instanceIsChosenOne: true;
  instanceBuild: string;
  instanceUpdatedAt: string;
  stackLogsUrl: string;
  stackAppUrl: string;
  instanceHealthMessage: string;
  instanceHealthCode: number;
  instanceLastHealthyAt: string;
}
