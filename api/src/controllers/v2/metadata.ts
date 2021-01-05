import db from 'diskdb';
import { InstanceProps } from '../../../../types/globalTypes';
import response from '../../helpers/returnResponse';

export const getMetadata = (ctx: any) => {
  const instances = db.instances.find() as InstanceProps[];
  const stacks = new Set(instances.map((instance) => instance.stackName));
  const versions = new Set(
    instances.map((instance) => instance.instanceVersion)
  );

  const responseBody = {
    activeVersions: [...versions],
    instanceCount: instances.length,
    stackCount: [...stacks].length,
    maxInstanceCount: 3,
  };

  return response(ctx, 200, responseBody);
};
