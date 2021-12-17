import { Stacks } from '.prisma/client';

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
      view_stack_enviroments: string[];
      update_stacks: {
        id: number;
      }[];
      update_stack_enviroments: string[];
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

  // List of stack enviroments that a user can view from their roles
  const userCanViewStacksOfEnviroment = user.roles.flatMap(
    (role) => role.view_stack_enviroments
  );

  // List of stack enviroments that a user can update from their roles
  const userCanUpdateStacksOfEnviroment = user.roles.flatMap(
    (role) => role.update_stack_enviroments
  );

  // All stacks by ID that a user can view filtered from list of enviroments
  const userCanViewStackIdsOfEnviroment = allStacks
    .filter((stack) =>
      userCanViewStacksOfEnviroment.includes(stack.environment)
    )
    .map((stack) => stack.id);

  // All stacks by ID that a user can update filtered from list of enviroments
  const userCanUpdateStackIdsOfEnviroment = allStacks
    .filter((stack) =>
      userCanUpdateStacksOfEnviroment.includes(stack.environment)
    )
    .map((stack) => stack.id);

  // Combine individual IDs from roles and IDs from enviroments into unique arrays
  const canViewStackIds = new Set([
    ...userCanViewStackIds,
    ...userCanViewStackIdsOfEnviroment,
  ]);
  const canUpdateStackIds = new Set([
    ...userCanUpdateStackIds,
    ...userCanUpdateStackIdsOfEnviroment,
  ]);

  return {
    canViewStackIds: Array.from(canViewStackIds),
    canUpdateStackIds: Array.from(canUpdateStackIds),
  };
};

export default constructUserStackPermissions;
