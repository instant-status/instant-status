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

const TagFilters = ({ tags }: { tags: Set<string> }) => {
  const [isChecked, setIsChecked] = useState(true);
  const { urlVersionParams } = useContext(StateContext);
  return (
    <>
      {Array.from(tags).map(tag => {
        const name = tag === "" ? "👻" : tag;
        return (
          <div key={name}>
            <input
              type="checkbox"
              checked={urlVersionParams.includes(name)}
              id={name}
              name={name}
              value={name}
            />
            <label htmlFor={name}>{name}</label>
          </div>
        );
      })}
    </>
  );
};

const Sidebar = () => {
  const [pemLocation, setPemLocation] = useState("~/.ssh/");
  const {
    sidebarData,
    updateSidebarData,
    pageData,
    urlVersionParams,
    urlEnvParams
  } = useContext(StateContext);
  updateSidebarData();

  if (sidebarData.length < 1 || pageData.length < 1) return <div>loading</div>;

  const tags = new Set(sidebarData.map(item => item.tag));
  console.log(Object.keys(pageData));

  return (
    <>
      <Aside>
        <SidebarHeader
          stackCount={Object.keys(pageData).length}
          instanceCount={sidebarData.length}
        />
        <section>
          <SectionHeader>Environment</SectionHeader>
          <EnvFilters />
        </section>
        <section>
          <SectionHeader>Versions</SectionHeader>
          <TagFilters tags={tags} />
        </section>
        <section>
          <SectionHeader>Settings</SectionHeader>
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
