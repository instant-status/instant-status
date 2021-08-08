import APP_CONFIG from "@config/appConfig";
import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { useQuery } from "react-query";

import { SidebarButton } from "../../components/Controls/Buttons";
import Checkbox from "../../components/Controls/Checkbox";
import SelectInput from "../../components/Controls/SelectInput";
import SliderInput from "../../components/Controls/SliderInput";
import TextInput from "../../components/Controls/TextInput";
import Stack from "../../components/Layout/Stack";
import Sidebar from "../../components/Sidebar/Sidebar";
import SidebarPaddingContainer from "../../components/Sidebar/SidebarPaddingContainer";
import SidebarSectionHeader from "../../components/Sidebar/SidebarSectionHeader";
import fetchUrl from "../../hooks/useFetch";
import { globalStoreContext } from "../../store/globalStore";
import VersionFilters from "./VersionFilters";

const StatusSidebar = observer(() => {
  const store = useContext(globalStoreContext);

  const sidebarQuery = useQuery(
    `sidebarData`,
    () => fetchUrl(`${APP_CONFIG.DATA_URL}/v2/metadata`),
    {
      refetchInterval: 10000, // Refetch the data every 10 seconds
    },
  );

  const hasCustomSettings =
    store.keyLocation !== APP_CONFIG.DEFAULTS.KEY_LOCATION ||
    store.serverDisplayCount !== APP_CONFIG.DEFAULTS.SERVER_DISPLAY_COUNT ||
    store.orderBy !== APP_CONFIG.DEFAULTS.ORDER_BY ||
    store.showMoreInfo !== APP_CONFIG.DEFAULTS.SHOW_MORE_INFO;

  return (
    <Sidebar
      stackCount={sidebarQuery.data?.stackCount}
      serverCount={sidebarQuery.data?.serverCount}
    >
      <Stack
        as="section"
        direction="down"
        spacing={4}
        style={{ paddingLeft: `20px` }}
      >
        <SidebarSectionHeader>Versions</SidebarSectionHeader>
        <VersionFilters versions={sidebarQuery.data?.activeVersions || []} />
        <SidebarSectionHeader>Settings</SidebarSectionHeader>
        <Stack as={SidebarPaddingContainer} direction="down" spacing={4}>
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
        <Stack as={SidebarPaddingContainer} direction="down" spacing={9}>
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
    </Sidebar>
  );
});

export default StatusSidebar;
