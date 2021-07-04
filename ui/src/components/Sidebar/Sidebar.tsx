import APP_CONFIG from "@config/appConfig";
import { observer } from "mobx-react-lite";
import { lighten } from "polished";
import React, { useContext } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";

import fetchUrl from "../../hooks/useFetch";
import { globalStoreContext } from "../../store/globalStore";
import { SidebarButton } from "../Controls/Buttons";
import Checkbox from "../Controls/Checkbox";
import SelectInput from "../Controls/SelectInput";
import SliderInput from "../Controls/SliderInput";
import TextInput from "../Controls/TextInput";
import Stack from "../Layout/Stack";
import SidebarHeader from "./SidebarHeader";
import VersionFilters from "./VersionFilters";

const Aside = styled.aside`
  background-color: ${(props) => props.theme.color.darkOne};
  width: 290px;
  height: 100vh;
  position: fixed;
  color: ${(props) => props.theme.color.lightOne};
  padding: 20px 0 20px 20px;
  display: flex;
  flex-direction: column;
`;

const AsideGhost = styled.div`
  width: 290px;
  flex: none;
`;

const AsidePaddingContainer = styled.div`
  padding-right: 20px;
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
  color: ${(props) => props.theme.color.lightOne};
`;

const Sidebar = observer(() => {
  const store = useContext(globalStoreContext);

  const sidebarQuery = useQuery(
    `sidebarData`,
    () => fetchUrl(`${APP_CONFIG.DATA_URL}/v2/metadata`),
    {
      refetchInterval: 10000, // Refetch the data every second
    },
  );

  const hasCustomSettings =
    store.keyLocation !== APP_CONFIG.DEFAULTS.KEY_LOCATION ||
    store.serverDisplayCount !== APP_CONFIG.DEFAULTS.SERVER_DISPLAY_COUNT ||
    store.orderBy !== APP_CONFIG.DEFAULTS.ORDER_BY ||
    store.showMoreInfo !== APP_CONFIG.DEFAULTS.SHOW_MORE_INFO;

  return (
    <>
      <Aside>
        <SidebarHeader
          stackCount={sidebarQuery.data?.stackCount || 0}
          serverCount={sidebarQuery.data?.serverCount || 0}
        />
        <section>
          <SectionHeader>Versions</SectionHeader>
          <VersionFilters versions={sidebarQuery.data?.activeVersions || []} />
        </section>
        <Stack as="section" direction="down" spacing={4}>
          <SectionHeader>Settings</SectionHeader>
          <Stack as={AsidePaddingContainer} direction="down" spacing={4}>
            <SelectInput
              onChange={(event) => store.setOrderBy(event.target.value)}
              value={store.orderBy}
              label="Order By:"
            />
            <SliderInput
              value={store.serverDisplayCount}
              onChange={(event) =>
                store.setServerDisplayCount(Number(event.target.value))
              }
              total={4}
              label="Display Count:"
            />
            <TextInput
              value={store.keyLocation}
              onChange={(event) => store.setKeyLocation(event.target.value)}
              onBlur={(event) => store.setKeyLocation(event.target.value, true)}
              label="Key File Location:"
              name="Key File Location:"
            />
          </Stack>
          <Stack as={AsidePaddingContainer} direction="down" spacing={9}>
            <Checkbox
              checked={store.showMoreInfo}
              label={`Show More Info`}
              name={`Show More Info`}
              onClick={() => store.setShowMoreInfo(!store.showMoreInfo)}
            />
            <SidebarButton
              onClick={() => store.resetToDefaultValues()}
              disabled={!hasCustomSettings}
            >
              Clear Custom Settings
            </SidebarButton>
          </Stack>
        </Stack>
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
  );
});

export default Sidebar;
