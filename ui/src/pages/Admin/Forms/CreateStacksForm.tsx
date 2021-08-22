import { motion } from "framer-motion";
import React, { useState } from "react";
import { useMutation } from "react-query";
import styled from "styled-components";

import apiRoutes, { CreateUpdateProps } from "../../../api/apiRoutes";
import { SmallButton } from "../../../components/Controls/Buttons";
import TagInput from "../../../components/Controls/TagInput";
import TextInput from "../../../components/Controls/TextInput";
import Stack from "../../../components/Layout/Stack";
import theme from "../../../utils/theme";

const CreateStackForm = styled(motion.div)`
  color: ${theme.color.lightOne};
  display: flex;
`;

interface CreateStacksFormProps {
  existingStackIds: string[];
  onSuccess?: () => void;
  onAbort?: () => void;
}

const CreateStacksForm = (props: CreateStacksFormProps) => {
  const [stackNames, setStackNames] = useState<string[]>([]);
  const [appVersion, setAppVersion] = useState(``);
  const [xapiVersion, setXapiVersion] = useState(``);

  const mutation = useMutation((payload: CreateUpdateProps) =>
    apiRoutes.apiCreateStack({ body: payload }),
  );

  const clearForm = () => {
    setStackNames([]);
    setAppVersion(``);
    setXapiVersion(``);
  };

  const setStackName = (event: React.KeyboardEvent<Element>) => {
    const target = event.target as HTMLInputElement;
    const newValue = target.value.replace(/,/gi, ``).trim().toLowerCase();

    if (
      (event.key === `Enter` || event.key === ` ` || event.key === `,`) &&
      newValue !== `` &&
      newValue !== ` ` &&
      newValue !== `,`
    ) {
      if (
        props.existingStackIds.includes(newValue) ||
        stackNames.includes(newValue)
      ) {
        target.value = ``;
        return;
      }

      setStackNames([...stackNames, newValue]);
      target.value = ``;
    }
  };

  const removeStackName = (value: string) => {
    setStackNames([...stackNames.filter((name) => name !== value)]);
  };

  const createStacks = () => {
    if (appVersion && xapiVersion && stackNames.length) {
      mutation.mutate(
        {
          stack_ids: stackNames,
          run_migrations: false,
          update_app_to: appVersion,
          update_xapi_to: xapiVersion,
        },
        {
          onSuccess: () => {
            props.onSuccess && props.onSuccess();
            clearForm();
          },
        },
      );
    }
  };

  return (
    <Stack
      as={CreateStackForm}
      direction="down"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Stack justify="center">
        <TagInput
          name="stackIds"
          label="Stack IDs:"
          onKeyUp={setStackName}
          values={stackNames}
          removeValue={removeStackName}
        />

        <TextInput
          label={
            <>
              Initial <b>app</b> Version:
            </>
          }
          name="appVersion"
          value={appVersion}
          onChange={(event) => setAppVersion(event.target.value)}
        />
        <TextInput
          label={
            <>
              Initial <b>xAPI</b> Version:
            </>
          }
          name="xapiVersion"
          value={xapiVersion}
          onChange={(event) => setXapiVersion(event.target.value)}
        />
      </Stack>
      <Stack justify="center" spacing={4}>
        <SmallButton
          $color={theme.color.red}
          $variant="ghost"
          onClick={() => {
            clearForm();
            props.onAbort && props.onAbort();
          }}
        >
          Cancel
        </SmallButton>
        <SmallButton
          $color={theme.color.green}
          $variant="primary"
          onClick={createStacks}
          disabled={!appVersion || !xapiVersion || stackNames.length < 1}
        >
          Create
        </SmallButton>
      </Stack>
    </Stack>
  );
};

export default CreateStacksForm;
