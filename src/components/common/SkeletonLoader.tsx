import { Skeleton } from "@mui/material";
import React from "react";

interface SkeletonLoaderProps {
  count: number;
  height: string | number;
  width?: string | number;
  variant?: "text" | "rectangular" | "circular";
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  count,
  height,
  width = "100%",
  variant = "rectangular",
}) => {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <Skeleton
          key={i}
          variant={variant}
          height={height}
          width={width}
          sx={{
            borderRadius: 1,
            bgcolor: "grey.800",
            mb: 2,
          }}
        />
      ))}
    </>
  );
};

export default SkeletonLoader;