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
import SliderInput from "./SliderInput";

const Aside = styled.aside`
  background-color: ${props => props.theme.color.darkOne};
  width: 290px;
  height: 100vh;
  position: fixed;
  color: #fff;
  padding: 20px 0 20px 20px;
  display: flex;
  flex-direction: column;
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

const Footer = styled.footer`
  margin: auto 20px 0 0;
  text-align: center;
  opacity: 0.8;
  font-size: 14px;
`;

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

  console.log(Object.values(pageData).flat(1));

  return (
    <>
      <Aside>
        <SidebarHeader
          stackCount={Object.keys(pageData).length || 0}
          instanceCount={sidebarData.length || 0}
        />
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
          <SliderInput
            value={instanceDisplayCount}
            onChange={(event: any) =>
              updateInstanceDisplayCount(event.target.value)
            }
            total={4}
            label="Display Count:"
          />
          <TextInput
            value={keyLocation}
            onChange={(event: any) => updateKeyLocation(event.target.value)}
            label="Key File Location:"
          />
          <Checkbox
            isChecked={showAdvanced}
            value="true"
            label={"Show More Info"}
            onChange={() => updateShowAdvanced(!showAdvanced)}
          />
          <Checkbox
            isChecked={rememberSettings}
            value="true"
            label={rememberSettings ? "Clear Settings" : "Remember Settings"}
            onChange={() => updateRememberSettings(!rememberSettings)}
          />
        </section>
        <Footer>Made with ⚡ by Callum</Footer>
      </Aside>
      <AsideGhost />
    </>
  );
};

export default Sidebar;
