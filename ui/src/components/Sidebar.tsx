import React, { useContext, useState } from "react";
import styled from "styled-components";
import { StateContext } from "../context/StateContext";
import SidebarHeader from "./SidebarHeader";

const Aside = styled.aside`
  background-color: ${({ theme }) => theme.color.darkOne};
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
  border-bottom: 1px solid #fff;
  padding-bottom: 4px;
  text-transform: uppercase;
`;

const TagFilters = ({ tags }: { tags: Set<string> }) => {
  return (
    <>
      {Array.from(tags).map(tag => {
        return (
          <div key={tag}>
            <input type="checkbox" id={tag} name={tag} value={tag} />
            <label htmlFor={tag}>{tag}</label>
          </div>
        );
      })}
    </>
  );
};

const Sidebar = () => {
  const [pemLocation, setPemLocation] = useState(".ssh/");
  const { pageData } = useContext(StateContext);
  if (pageData.length < 1) return <div>loading</div>;

  const tags = new Set(pageData.map(item => item.tag));

  return (
    <>
      <Aside>
        <SidebarHeader
          stackCount={pageData.length}
          instanceCount={pageData.length}
        />
        <section>
          <SectionHeader>Environment</SectionHeader>
        </section>
        <section>
          <SectionHeader>Versions</SectionHeader>
          <TagFilters tags={tags} />
        </section>
        <section>
          <SectionHeader>Settings</SectionHeader>
          <div>
            <input
              type="checkbox"
              id="autoRefresh"
              name="autoRefresh"
              value={1}
            />
            <label htmlFor="autoRefresh">Auto Refresh</label>
          </div>
          <div>
            <label htmlFor="orderBy">Order By</label>
            <input type="text" id="orderBy" name="orderBy" />
          </div>
          <div>
            <label htmlFor="pemLocation">Location of PEM files</label>
            <input
              onChange={(event: any) => setPemLocation(event.target.current)}
              type="text"
              id="pemLocation"
              name="pemLocation"
              value={pemLocation}
            />
          </div>
        </section>
        <footer></footer>
      </Aside>
      <AsideGhost />
    </>
  );
};

export default Sidebar;
