import styled from "styled-components";

const Page = styled.main`
  background-color: ${(props) => props.theme.color.darkTwo};
  width: 100%;
  min-height: 100vh;
  border-radius: 40px 0 0 0;
  padding: 30px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default Page;
