import { observer } from "mobx-react-lite";
import React, { memo, useContext, useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import styled from "styled-components";
import { StringParam, useQueryParams } from "use-query-params";

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

interface ApiGetStacksAvailableForUpdateProps {
  stack_id: string;
  stack_version: string;
  stack_environment: string;
  is_updating: boolean;
}

interface StacksQueryProps {
  0: string;
  1: ApiGetStacksAvailableForUpdateProps[];
}

const CreateUpdateModal = observer(() => {
  const [step, setStep] = useState(UpdateStepTypes.pickOptions);
  const [isSafeToClose, setIsSafeToClose] = useState(false);
  const [query, setQuery] = useQueryParams({
    stackId: StringParam,
    appVersion: StringParam,
    xapiVersion: StringParam,
  });
  const [stacksToUpdate, setStacksToUpdate] = useState(
    query.stackId ? [query.stackId] : [],
  );
  const [appVersion, setAppVersion] = useState(query.appVersion);
  const [xapiVersion, setXapiVersion] = useState(query.xapiVersion);
  const [updateOptions, setUpdateOptions] = useState([`run_migrations`]);

  const store = useContext(globalStoreContext);

  const mutation = useMutation((payload: CreateUpdateProps) =>
    apiRoutes.apiCreateUpdate({ body: payload }),
  );

  const warnAboutUnsavedChanges = (event: BeforeUnloadEvent) => {
    if (step !== UpdateStepTypes.pickOptions) {
      event.returnValue = `You have unsaved changes. Are you sure you want to leave?`;
    }
  };

  useEffect(() => {
    const documentRoot = document.querySelector(
      `#instant-status-root`,
    ) as HTMLElement;
    documentRoot.style.overflow = `hidden`;
    documentRoot.style.height = `100vh`;

    window.addEventListener(`beforeunload`, warnAboutUnsavedChanges);

    return () => {
      documentRoot.style.overflow = `auto`;
      documentRoot.style.height = `100%`;
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

  const stacksQuery = useQuery(
    `apiGetStacksAvailableForUpdate`,
    apiRoutes.apiGetStacksAvailableForUpdate,
    {
      refetchInterval: 2000, // Refetch the data every second
    },
  );

  const toggleCheckbox = (stackId: string) => {
    if (stacksToUpdate.includes(stackId)) {
      setStacksToUpdate(
        stacksToUpdate.filter((stackIdToUpdate) => stackIdToUpdate !== stackId),
      );
    } else {
      setStacksToUpdate([...stacksToUpdate, stackId]);
    }
  };

  const toggleConfigCheckbox = (option: string) => {
    if (updateOptions.includes(option)) {
      setUpdateOptions(updateOptions.filter((stack) => stack !== option));
    } else {
      setUpdateOptions([...updateOptions, option]);
    }
  };

  const toggleAll = (stackIds: string[], isChecked: boolean) => {
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
  };

  const stacks = [...(stacksQuery.data || [])]
    .map((environment) => {
      if (step !== UpdateStepTypes.pickOptions) {
        const filteredStacks = environment[1].filter(
          (stack: ApiGetStacksAvailableForUpdateProps) =>
            stacksToUpdate.includes(stack.stack_id),
        );

        if (filteredStacks.length) {
          return [environment[0], filteredStacks];
        }
      } else {
        return environment;
      }
    })
    .filter((data) => data) as StacksQueryProps[];

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
    }
  };

  const updateOptionsArray = [
    {
      label: `Run Migrations`,
      name: `run_migrations`,
    },
  ];

  const trimWhiteSpace = (value: string) => {
    return value.trim();
  };

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
        {stacks
          .sort((a, b) => a[1].length - b[1].length)
          .map((stackEnv) => {
            const environment = stackEnv[0] || `Undefined`;
            const stacks = stackEnv[1];
            const stackIds = stacks.map((stack) => stack.stack_id);
            const availableStackIds = stacks
              .filter((stack) => !stack.is_updating)
              .map((stack) => stack.stack_id);
            const allSelected = allExistIn(availableStackIds, stacksToUpdate);

            return (
              <Stack direction="down" key={environment}>
                <StackColumnName>
                  <Stack align="center" justify="spaceBetween">
                    <span>{environment}</span>
                    {step === UpdateStepTypes.pickOptions && (
                      <Checkbox
                        label={allSelected ? `Deselect all` : `Select all`}
                        name={`select_all_${environment}`}
                        checked={allSelected}
                        onClick={() => toggleAll(stackIds, allSelected)}
                      />
                    )}
                  </Stack>
                </StackColumnName>
                <Columns>
                  {stacks
                    .sort(
                      (a, b) =>
                        a.stack_version.localeCompare(b.stack_version) ||
                        a.stack_id.localeCompare(b.stack_id),
                    )
                    .map((stack) => (
                      <Checkbox
                        key={`${stack.stack_id}-${stack.stack_version}`}
                        label={stack.stack_id}
                        helperLabel={
                          stack.is_updating
                            ? `Updating to ${stack.stack_version}`
                            : stack.stack_version
                        }
                        name={stack.stack_id}
                        disabled={
                          step !== UpdateStepTypes.pickOptions
                            ? true
                            : stack.is_updating
                        }
                        visuallyDisabled={stack.is_updating}
                        onClick={() => toggleCheckbox(stack.stack_id)}
                        checked={
                          !stack.is_updating &&
                          stacksToUpdate.includes(stack.stack_id)
                        }
                      />
                    ))}
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
                  setAppVersion(trimWhiteSpace(event.target.value))
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
                  setXapiVersion(trimWhiteSpace(event.target.value))
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
