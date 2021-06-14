import { useObserver } from "mobx-react-lite";
import { lighten } from "polished";
import React, { useContext } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";

import APP_CONFIG from "../../../../config/appConfig";
import { StateContext } from "../../context/StateContext";
import fetchUrl from "../../hooks/useFetch";
import { globalStoreContext } from "../../store/globalStore";
import Checkbox from "./Checkbox";
import SelectInput from "./SelectInput";
import SidebarHeader from "./SidebarHeader";
import SliderInput from "./SliderInput";
import TextInput from "./TextInput";
import UncontrolledCheckbox from "./UncontrolledCheckbox";
import VersionFilters from "./VersionFilters";

const Aside = styled.aside`
  background-color: ${(props) => props.theme.color.darkOne};
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
  border-bottom: 1px solid ${(props) => lighten(0.1, props.theme.color.darkOne)};
  padding-bottom: 4px;
  text-transform: uppercase;
`;

const Footer = styled.footer`
  margin: auto 20px 0 0;
  text-align: center;
  opacity: 0.8;
  font-size: 14px;
`;

const A = styled.a`
  color: #fff;
`;

const Sidebar = () => {
  const {
    updateUrlParams,
    updateKeyLocation,
    keyLocation,
    updateRememberSettings,
    rememberSettings,
    showAdvanced,
    updateShowAdvanced,
  } = useContext(StateContext);

  const store = useContext(globalStoreContext);

  const updateOrderBy = (option: string) => {
    updateUrlParams({ key: `sortBy`, value: option });
  };

  const sidebarQuery = useQuery(
    `sidebarData`,
    () => fetchUrl(`${APP_CONFIG.DATA_URL}/v2/metadata`),
    {
      refetchInterval: 10000, // Refetch the data every second
    },
  );

  return useObserver(() => (
    <>
      <Aside>
        <SidebarHeader
          stackCount={sidebarQuery.data?.stackCount || 0}
          instanceCount={sidebarQuery.data?.instanceCount || 0}
        />
        <section>
          <SectionHeader>Versions</SectionHeader>
          <VersionFilters versions={sidebarQuery.data?.activeVersions || []} />
        </section>
        <section>
          <SectionHeader>Settings</SectionHeader>
          <SelectInput
            onChange={(event) => updateOrderBy(event.target.value)}
            label="Order By"
          />
          <SliderInput
            value={store.instanceDisplayCount}
            onChange={(event) =>
              store.setInstanceDisplayCount(Number(event.target.value))
            }
            total={4}
            label="Display Count:"
          />
          <TextInput
            value={keyLocation}
            onChange={(event) => updateKeyLocation(event.target.value)}
            onBlur={(event) => updateKeyLocation(event.target.value, true)}
            label="Key File Location:"
          />
          <UncontrolledCheckbox
            checked={showAdvanced}
            label={`Show More Info`}
            name={`showMoreInfo`}
            onClick={() => updateShowAdvanced(!showAdvanced)}
          />
          <UncontrolledCheckbox
            checked={rememberSettings}
            label={`Remember Settings`}
            name={`rememberSettings`}
            onClick={() => updateRememberSettings(!rememberSettings)}
          />
        </section>
        <Footer>
          <A
            href="https://github.com/instant-status/instant-status"
            rel="noopener noreferrer"
            title="Instant-Status on GitHub"
          >
            Instant Status
          </A>
          : Made With ⚡
        </Footer>
      </Aside>
      <AsideGhost />
    </>
  ));
};

export default Sidebar;
