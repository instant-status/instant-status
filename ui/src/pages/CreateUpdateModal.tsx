import React, { memo, useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import styled from "styled-components";
import { StringParam, useQueryParams } from "use-query-params";
import apiRoutes from "../api/apiRoutes";
import ModalBase from "../components/Modal/ModalBase";
import Checkbox from "../components/sidebar/Checkbox";
import UncontrolledCheckbox from "../components/sidebar/UncontrolledCheckbox";
import TextInput from "../components/sidebar/TextInput";
import { spacing } from "../components/spacing";
import Stack from "../components/Stack";
import { globalStoreContext } from "../store/globalStore";
import UpdateSuccess from "./UpdateSuccess";
import allExistIn from "../utils/allExistIn";

const GhostButton = styled.button`
  padding: 0.9rem 4rem;
  border-radius: 12px;
  cursor: pointer;
  font-size: ${spacing[11]};
  color: #fff;
  background-color: transparent;
  border: 4px solid #fff;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    color: #191e2a;
    background-color: #fff;
  }
`;

const UpdateButton = styled.button`
  padding: 0.9rem 4rem;
  border-radius: 12px;
  cursor: pointer;
  font-size: ${spacing[11]};
  color: #00ab4e;
  background-color: transparent;
  border: 4px solid #00ab4e;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    color: #191e2a;
    background-color: #00ab4e;
  }
`;

const BackButton = styled.button`
  padding: 1rem 4rem;
  font-size: ${spacing[11]};
  border-radius: 12px;
  color: #fff;
  background-color: transparent;
  border: 2px solid #fff;
  cursor: pointer;
`;

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
  pickOptions = "pickOptions",
  confirmOptions = "confirmOptions",
  coolOff = "coolOff",
}

interface ApiGetStacksAvailableForUpdateProps {
  stack_id: string;
  stackVersion: string;
  stack_environment: string;
  isUpdating: boolean;
}

const CreateUpdateModal = () => {
  const [step, setStep] = useState(UpdateStepTypes.pickOptions);
  const [query, setQuery] = useQueryParams({
    stack: StringParam,
    version: StringParam,
    xapiVersion: StringParam,
  });
  const [stacksToUpdate, setStacksToUpdate] = useState(
    query.stack ? [query.stack] : [],
  );
  const { register, getValues, handleSubmit } = useForm();
  const store = useContext(globalStoreContext);

  const mutation = useMutation((payload: any) =>
    apiRoutes.apiCreateUpdate({ body: payload }),
  );

  const warnAboutUnsavedChanges = (event) => {
    if (step !== UpdateStepTypes.pickOptions) {
      event.returnValue = `You have unsaved changes. Are you sure you want to leave?`;
    }
  };

  useEffect(() => {
    window.addEventListener("beforeunload", warnAboutUnsavedChanges);

    return () => {
      window.removeEventListener("beforeunload", warnAboutUnsavedChanges);
    };
  }, [step]);

  const onSubmit = (data) => {
    // console.log("data", data);
  };

  const onSave = () => {
    const formData = getValues();

    // FIX THIS
    formData.run_migrations = true;
    formData.update_configs = true;
    formData.update_envs = true;

    mutation.mutate({
      stack_ids: stacksToUpdate,
      ...formData,
    });
  };

  const stacksQuery = useQuery<ApiGetStacksAvailableForUpdateProps[], Error>(
    `apiGetStacksAvailableForUpdate`,
    apiRoutes.apiGetStacksAvailableForUpdate,
    {
      refetchInterval: 2000, // Refetch the data every second
    },
  );

  const toggleCheckbox = (stackId: string) => {
    if (stacksToUpdate.includes(stackId)) {
      setStacksToUpdate(stacksToUpdate.filter((stack) => stack !== stackId));
    } else {
      setStacksToUpdate([...stacksToUpdate, stackId]);
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
    .filter((data) => data);

  let modalTitle = "Create Update";
  if (step === UpdateStepTypes.confirmOptions) {
    modalTitle = "Review Update";
  }
  if (step === UpdateStepTypes.coolOff) {
    modalTitle = "Update Requested";
  }

  const closeModal = () => {
    let canClose = true;

    canClose = confirm(
      `You have unsaved changes. Are you sure you want to leave?`,
    );

    if (canClose) {
      setQuery({
        stack: undefined,
        version: undefined,
        xapiVersion: undefined,
      });
      store.setIsUpdateModalOpen(false);
    }
  };

  return (
    <ModalBase title={modalTitle} onClose={closeModal}>
      <Stack direction="down" spacing={8}>
        {stacks
          .sort((a, b) => a[1].length - b[1].length)
          .map((stackEnv) => {
            const environment = stackEnv[0];
            const stacks = stackEnv[1] as ApiGetStacksAvailableForUpdateProps[];
            const stackIds = stacks.map((stack) => stack.stack_id);
            const availableStackIds = stacks
              .filter((stack) => !stack.isUpdating)
              .map((stack) => stack.stack_id);
            const allSelected = allExistIn(availableStackIds, stacksToUpdate);

            return (
              <Stack direction="down" key={environment}>
                <StackColumnName>
                  <Stack align="center" justify="spaceBetween">
                    {environment}
                    {step === UpdateStepTypes.pickOptions && (
                      <Checkbox
                        label="Select all"
                        name={`select_all_${environment}`}
                        defaultChecked={allSelected}
                        callback={(isChecked) => toggleAll(stackIds, isChecked)}
                      />
                    )}
                  </Stack>
                </StackColumnName>
                <Columns>
                  {stacks.map((stack) => (
                    <UncontrolledCheckbox
                      key={`${stack.stack_id}-${stack.stackVersion}`}
                      label={stack.stack_id}
                      helperLabel={stack.stackVersion}
                      name={stack.stack_id}
                      disabled={
                        step !== UpdateStepTypes.pickOptions
                          ? true
                          : stack.isUpdating
                      }
                      visuallyDisabled={stack.isUpdating}
                      onClick={() => toggleCheckbox(stack.stack_id)}
                      checked={
                        !stack.isUpdating &&
                        stacksToUpdate.includes(stack.stack_id)
                      }
                    />
                  ))}
                </Columns>
              </Stack>
            );
          })}
      </Stack>
      <Stack
        direction="down"
        spacing={8}
        as="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Stack spacing={4} direction="down" align="center">
          <Heading>
            {step === UpdateStepTypes.pickOptions
              ? "Configure Options"
              : "Configured Options"}
          </Heading>
          <Stack direction="down" spacing={6}>
            <Stack spacing={9} justify="center">
              <Checkbox
                label="Run Migrations"
                defaultChecked={true}
                // disabled={step !== UpdateStepTypes.pickOptions}
                {...register("run_migrations")}
              />
              <Checkbox
                label="Update ENVs"
                defaultChecked={true}
                // disabled={step !== UpdateStepTypes.pickOptions}
                {...register("update_envs")}
              />
              <Checkbox
                label="Update Configs"
                defaultChecked={true}
                // disabled={step !== UpdateStepTypes.pickOptions}
                {...register("update_configs")}
              />
            </Stack>
            <Stack spacing={6} direction="right" fullWidth={true}>
              <TextInput
                label="Update app to:"
                defaultValue={query.version}
                // disabled={step !== UpdateStepTypes.pickOptions}
                {...register("update_app_to")}
              />
              <TextInput
                label="Update xAPI to:"
                defaultValue={query.xapiVersion}
                // disabled={step !== UpdateStepTypes.pickOptions}
                {...register("update_xapi_to")}
              />
            </Stack>
          </Stack>
        </Stack>
        <Stack justify="center" spacing={4}>
          {step === UpdateStepTypes.pickOptions && (
            <GhostButton
              onClick={() => setStep(UpdateStepTypes.confirmOptions)}
              disabled={stacksToUpdate.length < 1}
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
                  // onSave();
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
            />
          )}
        </Stack>
      </Stack>
    </ModalBase>
  );
};

export default memo(CreateUpdateModal);
