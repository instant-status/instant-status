import { Stacks } from '@prisma/client';

const constructUserStackPermissions = ({
  user,
  allStacks,
}: {
  user: {
    id: number;
    email: string;
    is_super_admin: boolean;
    roles: {
      view_stacks: {
        id: number;
      }[];
      view_stack_environments: string[];
      update_stacks: {
        id: number;
      }[];
      update_stack_environments: string[];
    }[];
  };
  allStacks: { id: Stacks['id']; environment: Stacks['environment'] }[];
}) => {
  if (user.is_super_admin) {
    const allStackIds = allStacks.map((stack) => stack.id);
    return {
      canViewStackIds: allStackIds,
      canUpdateStackIds: allStackIds,
    };
  }

  // All stacks by ID that a user can view from their roles
  const userCanViewStackIds = user.roles
    .flatMap((role) => role.view_stacks)
    .map((stack) => stack.id);

  // All stacks by ID that a user can update from their roles
  const userCanUpdateStackIds = user.roles
    .flatMap((role) => role.update_stacks)
    .map((stack) => stack.id);

  // List of stack environments that a user can view from their roles
  const userCanViewStacksOfEnvironment = user.roles.flatMap(
    (role) => role.view_stack_environments
  );

  // List of stack environments that a user can update from their roles
  const userCanUpdateStacksOfEnvironment = user.roles.flatMap(
    (role) => role.update_stack_environments
  );

  // All stacks by ID that a user can view filtered from list of environments
  const userCanViewStackIdsOfEnvironment = allStacks
    .filter((stack) =>
      userCanViewStacksOfEnvironment.includes(stack.environment)
    )
    .map((stack) => stack.id);

  // All stacks by ID that a user can update filtered from list of environments
  const userCanUpdateStackIdsOfEnvironment = allStacks
    .filter((stack) =>
      userCanUpdateStacksOfEnvironment.includes(stack.environment)
    )
    .map((stack) => stack.id);

  // Combine individual IDs from roles and IDs from environments into unique arrays
  const canViewStackIds = new Set([
    ...userCanViewStackIds,
    ...userCanViewStackIdsOfEnvironment,
  ]);
  const canUpdateStackIds = new Set([
    ...userCanUpdateStackIds,
    ...userCanUpdateStackIdsOfEnvironment,
  ]);

  return {
    canViewStackIds: Array.from(canViewStackIds),
    canUpdateStackIds: Array.from(canUpdateStackIds),
  };
};

export default constructUserStackPermissions;
