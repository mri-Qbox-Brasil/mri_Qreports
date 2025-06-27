import React from "react";
import { Box } from "@mui/material";
import type { BoxProps } from "@mui/material";

export const GridContainer: React.FC<React.PropsWithChildren<BoxProps>> = ({
  children,
  ...rest
}) => {
  return (
    <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={3} {...rest}>
      {children}
    </Box>
  );
};

// Item Grid
export const GridItem: React.FC<
  React.PropsWithChildren<
    BoxProps & {
      xs?: number;
      sm?: number;
      md?: number;
      lg?: number;
      xl?: number;
    }
  >
> = ({ children, xs = 12, sm, md, lg, xl, ...rest }) => {
  const gridColumn = {
    xs: `span ${xs}`,
    ...(sm && { sm: `span ${sm}` }),
    ...(md && { md: `span ${md}` }),
    ...(lg && { lg: `span ${lg}` }),
    ...(xl && { xl: `span ${xl}` }),
  };

  return (
    <Box gridColumn={gridColumn} {...rest}>
      {children}
    </Box>
  );
};
