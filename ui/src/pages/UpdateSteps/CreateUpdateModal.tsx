import { observer } from "mobx-react-lite";
import React, { memo, useContext, useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import styled from "styled-components";
import { StringParam, useQueryParams } from "use-query-params";

import { StackProps } from "../../../../types/globalTypes";
import apiRoutes, { CreateUpdateProps } from "../../api/apiRoutes";
import {
  BackButton,
  GhostButton,
  UpdateButton,
} from "../../components/Controls/Buttons";
import Checkbox from "../../components/Controls/Checkbox";
import TextInput from "../../components/Controls/TextInput";
import { spacing } from "../../components/Layout/spacing";
import Stack from "../../components/Layout/Stack";
import ModalBase from "../../components/Modal/ModalBase";
import { globalStoreContext } from "../../store/globalStore";
import allExistIn from "../../utils/allExistIn";
import UpdateSuccess from "./UpdateSuccess";

const Heading = styled.h2`
  margin: 0;
  font-size: ${spacing[11]};
`;

const StackColumnName = styled.h3`
  margin: 0;
  text-transform: capitalize;
`;

const Columns = styled.div`
  column-count: 4;
  break-inside: avoid;
  & > * {
    margin-bottom: 0.2rem;
  }
`;

enum UpdateStepTypes {
  pickOptions = `pickOptions`,
  confirmOptions = `confirmOptions`,
  coolOff = `coolOff`,
}

const CreateUpdateModal = observer(() => {
  const [step, setStep] = useState(UpdateStepTypes.pickOptions);
  const [isSafeToClose, setIsSafeToClose] = useState(true);
  const [query, setQuery] = useQueryParams({
    stackId: StringParam,
    appVersion: StringParam,
    xapiVersion: StringParam,
  });
  const [stacksToUpdate, setStacksToUpdate] = useState(
    query.stackId ? [Number(query.stackId)] : [],
  );
  const [appVersion, setAppVersion] = useState(query.appVersion);
  const [xapiVersion, setXapiVersion] = useState(query.xapiVersion);
  const [updateOptions, setUpdateOptions] = useState([`run_migrations`]);

  const store = useContext(globalStoreContext);

  const stacksQuery = useQuery(`stacksData`, apiRoutes.apiGetStacksList);

  const stacks = [...(stacksQuery.data || [])].filter((stack) =>
    step !== UpdateStepTypes.pickOptions
      ? stacksToUpdate.includes(stack.id)
      : stack,
  );

  const mutation = useMutation((payload: CreateUpdateProps) =>
    apiRoutes.apiCreateUpdate({ body: payload }),
  );

  const warnAboutUnsavedChanges = (event: BeforeUnloadEvent) => {
    if (step !== UpdateStepTypes.pickOptions) {
      event.returnValue = `You have unsaved changes. Are you sure you want to leave?`;
    }
  };

  useEffect(() => {
    const documentRoot = document.querySelector(`#body`) as HTMLElement;
    documentRoot.style.overflow = `hidden`;

    window.addEventListener(`beforeunload`, warnAboutUnsavedChanges);

    return () => {
      documentRoot.style.overflow = `auto`;

      window.removeEventListener(`beforeunload`, warnAboutUnsavedChanges);
    };
  }, [step]);

  const onSave = () => {
    if (appVersion && xapiVersion && stacksToUpdate) {
      mutation.mutate({
        stack_ids: stacksToUpdate,
        run_migrations: updateOptions.includes(`run_migrations`),
        update_app_to: appVersion,
        update_xapi_to: xapiVersion,
      });
    }
  };

  const toggleCheckbox = (stackId: number) => {
    if (stacksToUpdate.includes(stackId)) {
      setStacksToUpdate(
        stacksToUpdate.filter((stackIdToUpdate) => stackIdToUpdate !== stackId),
      );
    } else {
      setStacksToUpdate([...stacksToUpdate, stackId]);
    }

    setIsSafeToClose(false);
  };

  const toggleConfigCheckbox = (option: string) => {
    if (updateOptions.includes(option)) {
      setUpdateOptions(updateOptions.filter((stack) => stack !== option));
    } else {
      setUpdateOptions([...updateOptions, option]);
    }

    setIsSafeToClose(false);
  };

  const toggleAll = (stackIds: number[], isChecked: boolean) => {
    let stacks = stacksToUpdate;

    for (const stackId of stackIds) {
      if (stacksToUpdate.includes(stackId)) {
        stacks = stacks.filter((stack) => stack !== stackId);
      }
    }

    if (!isChecked) {
      stacks = [...stacks, ...stackIds];
    }

    setStacksToUpdate(stacks);
    setIsSafeToClose(false);
  };

  let modalTitle = `Create Update`;
  if (step === UpdateStepTypes.confirmOptions) {
    modalTitle = `Review Update`;
  }
  if (step === UpdateStepTypes.coolOff) {
    modalTitle = `Update Requested`;
  }

  const closeModal = () => {
    let canClose = true;

    if (!isSafeToClose) {
      canClose = confirm(
        `You have unsaved changes. Are you sure you want to leave?`,
      );
    }

    if (canClose) {
      setQuery({
        stackId: undefined,
        appVersion: undefined,
        xapiVersion: undefined,
      });
      store.setIsUpdateModalOpen(false);
      stacksQuery.refetch();
    }
  };

  const updateOptionsArray = [
    {
      label: `Run Migrations`,
      name: `run_migrations`,
    },
  ];

  const removeWhiteSpace = (value: string) => {
    return value.replace(/ /g, ``);
  };

  const groupedStacks = stacks.reduce((groupedStack, stack) => {
    groupedStack[stack.environment] = [
      ...(groupedStack[stack.environment] || []),
      stack,
    ];
    return groupedStack;
  }, {} as { [key: string]: any });

  const groupedStacksArray = Object.entries(groupedStacks) as {
    [0]: string;
    [1]: StackProps[];
  }[];

  return (
    <ModalBase
      title={modalTitle}
      onClose={closeModal}
      actions={
        <Stack justify="center" spacing={4}>
          {step === UpdateStepTypes.pickOptions && (
            <GhostButton
              onClick={() => setStep(UpdateStepTypes.confirmOptions)}
              disabled={
                stacksToUpdate.length < 1 || !appVersion || !xapiVersion
              }
            >
              Next
            </GhostButton>
          )}
          {step === UpdateStepTypes.confirmOptions && (
            <>
              <BackButton onClick={() => setStep(UpdateStepTypes.pickOptions)}>
                Back
              </BackButton>
              <UpdateButton
                type="button"
                onClick={() => {
                  setStep(UpdateStepTypes.coolOff);
                }}
              >
                Confirm Update
              </UpdateButton>
            </>
          )}
          {step === UpdateStepTypes.coolOff && (
            <UpdateSuccess
              callback={onSave}
              cancel={() => setStep(UpdateStepTypes.pickOptions)}
              onClose={closeModal}
              setIsSafeToClose={setIsSafeToClose}
            />
          )}
        </Stack>
      }
    >
      <Stack direction="down" spacing={8}>
        {groupedStacksArray
          .sort((a, b) => a[1].length - b[1].length)
          .map((stackGroup) => {
            const environment = stackGroup[0] || `Undefined`;
            const stacks = stackGroup[1];
            const availableStacks = stacks.filter((stack) => {
              return !(
                stack.servers.find(
                  (server) => server.server_update_progress !== 100,
                ) || stack.updates.find((update) => update.server_count === 0)
              );
            });
            const availableStackIds = availableStacks.map((stack) => stack.id);

            const allSelected = allExistIn(availableStackIds, stacksToUpdate);

            return (
              <Stack direction="down" key={environment}>
                <StackColumnName>
                  <Stack align="center" justify="spaceBetween">
                    <span>{environment}</span>
                    {step === UpdateStepTypes.pickOptions && (
                      <Checkbox
                        label={
                          availableStackIds.length && allSelected
                            ? `Deselect all`
                            : `Select all`
                        }
                        name={`select_all_${environment}`}
                        checked={
                          !availableStackIds.length ? false : allSelected
                        }
                        disabled={!availableStackIds.length || false}
                        visuallyDisabled={!availableStackIds.length || false}
                        onClick={() =>
                          toggleAll(availableStackIds, allSelected)
                        }
                      />
                    )}
                  </Stack>
                </StackColumnName>
                <Columns>
                  {(step === UpdateStepTypes.pickOptions
                    ? stacks
                    : stacks.filter((stack) =>
                        stacksToUpdate.includes(stack.id),
                      )
                  )
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((stack) => {
                      const runningAppVersion =
                        stack.servers.find(
                          (server) => server.server_app_version,
                        )?.server_app_version || ``;
                      const runningXAPIVersion =
                        stack.servers.find(
                          (server) => server.server_xapi_version,
                        )?.server_xapi_version || ``;

                      const updatingToAppVersion =
                        stack.updates.find((update) => update.update_app_to)
                          ?.update_app_to || ``;
                      const updatingToXAPIVersion =
                        stack.updates.find((update) => update.update_xapi_to)
                          ?.update_xapi_to || ``;

                      const isUpdating = Boolean(
                        stack.servers.find(
                          (server) => server.server_update_progress !== 100,
                        ) ||
                          stack.updates.find(
                            (update) => update.server_count === 0,
                          ),
                      );

                      return (
                        <Checkbox
                          key={`${stack.id}`}
                          label={stack.name}
                          helperLabel={
                            isUpdating
                              ? `Updating to ${updatingToAppVersion} (xAPI ${updatingToXAPIVersion})`
                              : `${runningAppVersion} (xAPI ${runningXAPIVersion})`
                          }
                          name={stack.name}
                          disabled={
                            step !== UpdateStepTypes.pickOptions
                              ? true
                              : isUpdating
                          }
                          visuallyDisabled={isUpdating}
                          onClick={() => toggleCheckbox(stack.id)}
                          checked={
                            !isUpdating && stacksToUpdate.includes(stack.id)
                          }
                        />
                      );
                    })}
                </Columns>
              </Stack>
            );
          })}
      </Stack>
      <Stack direction="down" spacing={8} as="form">
        <Stack spacing={4} direction="down" align="center">
          <Heading>
            {step === UpdateStepTypes.pickOptions
              ? `Configure Options`
              : `Configured Options`}
          </Heading>
          <Stack direction="down" spacing={6}>
            <Stack spacing={6} direction="right" fullWidth={true}>
              <TextInput
                label={
                  <>
                    Update <b>app</b> to:
                  </>
                }
                value={appVersion || ``}
                disabled={step !== UpdateStepTypes.pickOptions}
                name="update_app_to"
                onChange={(event) =>
                  setAppVersion(removeWhiteSpace(event.target.value))
                }
              />
              <TextInput
                label={
                  <>
                    Update <b>xAPI</b> to:
                  </>
                }
                value={xapiVersion || ``}
                disabled={step !== UpdateStepTypes.pickOptions}
                name="update_xapi_to"
                onChange={(event) =>
                  setXapiVersion(removeWhiteSpace(event.target.value))
                }
              />
            </Stack>
            <Stack spacing={9} justify="start">
              {updateOptionsArray.map((option) => {
                return (
                  <Checkbox
                    key={option.name}
                    label={option.label}
                    name={option.name}
                    disabled={step !== UpdateStepTypes.pickOptions}
                    onClick={() => toggleConfigCheckbox(option.name)}
                    checked={updateOptions.includes(option.name)}
                  />
                );
              })}
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </ModalBase>
  );
});

export default memo(CreateUpdateModal);
