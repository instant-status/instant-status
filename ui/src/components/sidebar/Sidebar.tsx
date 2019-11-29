import React, { useContext, useState } from "react";
import styled from "styled-components";
import { StateContext } from "../../context/StateContext";
import SidebarHeader from "./SidebarHeader";
import VersionFilters from "./VersionFilters";
import InstanceProps from "../../utils/InstanceProps";
import Checkbox from "./Checkbox";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";
import { lighten } from "polished";

const Aside = styled.aside`
  background-color: ${props => props.theme.color.darkOne};
  width: 290px;
  height: 100vh;
  position: fixed;
  color: #fff;
  padding: 20px 0 20px 20px;
`;

const AsideGhost = styled.div`
  width: 290px;
  flex: none;
`;

const SectionHeader = styled.h3`
  font-size: 14px;
  font-weight: 400;
  border-bottom: 1px solid ${props => lighten(0.1, props.theme.color.darkOne)};
  padding-bottom: 4px;
  text-transform: uppercase;
`;

const EnvFilters = () => {
  const { urlEnvParams } = useContext(StateContext);
  const envFilters = ["production", "staging", "dev"];
  return (
    <>
      {envFilters.map(tag => {
        return (
          <div key={tag}>
            <input
              type="checkbox"
              checked={urlEnvParams.includes(tag) || true}
              id={tag}
              name={tag}
              value={tag}
            />
            <label htmlFor={tag}>{tag}</label>
          </div>
        );
      })}
    </>
  );
};

const Sidebar = () => {
  const {
    pageData,
    updateUrlParams,
    updateKeyLocation,
    keyLocation,
    updateRememberSettings,
    rememberSettings,
    showAdvanced,
    updateShowAdvanced,
    instanceDisplayCount,
    updateInstanceDisplayCount,
  } = useContext(StateContext);
  const sidebarData = Object.values(pageData).flat(1);

  const versions = new Set(
    sidebarData.map((instance: InstanceProps) => instance.instanceVersion),
  );

  const updateOrderBy = (option: string) => {
    updateUrlParams({ key: "sortBy", value: option });
  };

  return (
    <>
      <Aside>
        <SidebarHeader
          stackCount={Object.keys(pageData).length || 0}
          instanceCount={sidebarData.length || 0}
        />
        <section>
          <SectionHeader>Environment</SectionHeader>
          {/* <EnvFilters /> */}
        </section>
        <section>
          <SectionHeader>Versions</SectionHeader>
          <VersionFilters versions={Array.from(versions)} />
        </section>
        <section>
          <SectionHeader>Settings</SectionHeader>
          <SelectInput
            onChange={event => updateOrderBy(event.target.value)}
            label="Order By"
          />
          <Checkbox
            isChecked={showAdvanced}
            value="true"
            label={"Show Advanced"}
            onChange={() => updateShowAdvanced(!showAdvanced)}
          />
          <div>
            <label htmlFor="wip">WIP</label>
            <input
              type="range"
              id="wip"
              name="wip"
              min="0"
              max="2"
              onChange={(event: any) =>
                updateInstanceDisplayCount(event.target.value)
              }
              value={instanceDisplayCount}
              step="1"
            />
          </div>
          <TextInput
            value={keyLocation}
            onChange={(event: any) => updateKeyLocation(event.target.value)}
            label="Key File Location:"
          />
          <Checkbox
            isChecked={rememberSettings}
            value="true"
            label={rememberSettings ? "Clear Settings" : "Remember Settings"}
            onChange={() => updateRememberSettings(!rememberSettings)}
          />
        </section>
        <footer></footer>
      </Aside>
      <AsideGhost />
    </>
  );
};

export default Sidebar;
