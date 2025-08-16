import React from "react";
import SvgIcon, { type SvgIconProps } from "@mui/material/SvgIcon";

export const BluewaterLogo: React.FC<SvgIconProps> = (props) => (
  <SvgIcon viewBox="0 0 64 64" {...props}>
    <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="5" />
    <path
      d="M12 38c7 0 10-8 20-8s13 8 20 8"
      fill="none"
      stroke="currentColor"
      strokeWidth="5"
      strokeLinecap="round"
    />
  </SvgIcon>
);

export default BluewaterLogo;
