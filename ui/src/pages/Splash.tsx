import React, { useCallback } from "react";
import styled from "styled-components";
import { useDropzone } from "react-dropzone";
import { theme } from "../App";

const SplashContent = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  color: ${props => props.theme.color.lightOne};
  width: 100%;
  overflow: hidden;
  height: 100vh;
`;

const SplashText = styled.div`
  color: rgba(225, 225, 225, 0.5);
  font-size: 1rem;
`;

const Splash = () => {
  const onDrop = useCallback(acceptedFiles => {
    acceptedFiles.forEach((file: any) => {
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        localStorage.setItem("bearer", reader.result.toString());
        window.location.reload();
      };

      reader.readAsText(file);
    });
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <SplashContent {...getRootProps()}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 100 100"
        style={{ width: "160px" }}
      >
        <g
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth="7"
          stroke={theme.color.red}
          fill="none"
        >
          <path d="M4 50h21l6-12 10 37 15-55 10 38 5-8h25" />
          <path d="M4 55h19l7-11 10 36 14-54 10 37 5-8h27" opacity="0.3" />
        </g>
      </svg>
      <input {...getInputProps()} />
      <SplashText>Upload key file to unlock</SplashText>
    </SplashContent>
  );
};

export default Splash;
