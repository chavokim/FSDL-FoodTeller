import React from "react";
import {alpha, CircularProgress, Stack} from "@mui/material";

export const LoadingOverlay = ({active}) => {
    if(!active) return null;
    
    return (
        <Stack
            alignItems={"center"}
            justifyContent={"center"}
            sx={{
                width: "100%",
                height: "100%",
                backgroundColor: alpha("#000000", 0.5),
                position: "absolute",
            }}
        >
            <CircularProgress variant={"indeterminate"} />
        </Stack>
    )
}