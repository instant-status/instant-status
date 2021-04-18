import React, { memo, useContext, useState } from "react";
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

  & > * {
    margin-bottom: 0.2rem;
  }
`;

enum UpdateStepTypes {
  pickOptions = "pickOptions",
  confirmOptions = "confirmOptions",
  coolOff = "coolOff",
}

const CreateUpdateModal = () => {
  const [step, setStep] = useState(UpdateStepTypes.pickOptions);
  const [query] = useQueryParams({
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

  const onSubmit = (data) => {
    console.log("data", data);
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

  const stacksQuery = useQuery(
    `apiGetStacksAvailableForUpdate`,
    apiRoutes.apiGetStacksAvailableForUpdate,
    {
      // refetchInterval: 2000, // Refetch the data every second
    },
  );

  const toggleCheckbox = (stackName: string) => {
    if (stacksToUpdate.includes(stackName)) {
      setStacksToUpdate(stacksToUpdate.filter((stack) => stack !== stackName));
    } else {
      setStacksToUpdate([...stacksToUpdate, stackName]);
    }
  };

  const toggleAll = (stackNames: string[], isChecked: boolean) => {
    let stacks = stacksToUpdate;

    for (const stackName of stackNames) {
      if (stacksToUpdate.includes(stackName)) {
        stacks = stacks.filter((stack) => stack !== stackName);
      }
    }

    if (!isChecked) {
      stacks = [...stacks, ...stackNames];
    }

    setStacksToUpdate(stacks);
  };

  const stacks = [...(stacksQuery.data || [])]
    .map((environment) => {
      if (step !== UpdateStepTypes.pickOptions) {
        const filteredStacks = environment[1].filter((stack) =>
          stacksToUpdate.includes(stack.stackName),
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
    modalTitle = "Update requested";
  }

  return (
    <ModalBase
      title={modalTitle}
      onClose={() => store.setIsUpdateModalOpen(false)}
    >
      <Stack direction="down" spacing={8}>
        {stacks
          .sort((a, b) => a[1].length > b[1].length)
          .map((stackEnvironment) => (
            <Stack direction="down" key={stackEnvironment[0]}>
              <StackColumnName>
                <Stack align="center" justify="spaceBetween">
                  {stackEnvironment[0]}
                  {step === UpdateStepTypes.pickOptions && (
                    <Checkbox
                      label="Select all"
                      name={`select_all_${stackEnvironment[0]}`}
                      callback={(isChecked) =>
                        toggleAll(
                          stackEnvironment[1].map((stack) => stack.stackName),
                          isChecked,
                        )
                      }
                    />
                  )}
                </Stack>
              </StackColumnName>
              <Columns>
                {stackEnvironment[1].map((stack) => (
                  <UncontrolledCheckbox
                    key={`${stack.stackName}-${stack.stackVersion}`}
                    label={stack.stackName}
                    helperLabel={stack.stackVersion}
                    name={stack.stackName}
                    disabled={
                      step !== UpdateStepTypes.pickOptions
                        ? true
                        : stack.isUpdating
                    }
                    faded={stack.isUpdating}
                    onClick={() => toggleCheckbox(stack.stackName)}
                    checked={stacksToUpdate.includes(stack.stackName)}
                  />
                ))}
              </Columns>
            </Stack>
          ))}
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
                // type="button"
                onClick={() => {
                  // setStep(UpdateStepTypes.coolOff);
                  onSave();
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
            />
          )}
        </Stack>
      </Stack>
    </ModalBase>
  );
};

export default memo(CreateUpdateModal);
