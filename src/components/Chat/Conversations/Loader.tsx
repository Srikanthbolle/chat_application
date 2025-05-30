import { Skeleton } from "@mui/material";
import React from "react";

const Loader: React.FC = () => {
  return (
    <>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <Skeleton
          key={i}
          variant="rectangular"
          height={80}
          sx={{ mb: 2, backgroundColor: "rgba(0, 0, 0, 0.4)" }}
        />
      ))}
    </>
  );
};

export default Loader;