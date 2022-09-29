import React, {useRef, useState} from "react";
import {Box, Stack, Typography} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";

export const MainTemplate = () => {
    const [file, setFile] = useState();
    const fileInputRef = useRef();
    const fileBoxRef = useRef();
    
    const onFileChange = (event) => {
        setFile(event.target.files[0])
    }
    
    const onFileUpload = () => {
        fileInputRef.current.click();
    }
    
    const handleDragEnter = e => {
        e.preventDefault();
        
        fileBoxRef.current.style.backgroundColor = "#666666";
        fileBoxRef.current.style.opacity = 0.3;
    }
    
    const handleDragOver = e => {
        e.preventDefault();
    }
    
    const handleDragLeave = e => {
        e.preventDefault();
        
        fileBoxRef.current.style.backgroundColor = "initial";
        fileBoxRef.current.style.opacity = 1;
    } 
    
    const handleDrop = e => {
        e.preventDefault();
        
        console.log("drop")
        console.log(e.dataTransfer.files[0]);
        
        fileBoxRef.current.style.backgroundColor = "initial";
        fileBoxRef.current.style.opacity = 1;
    }
    
    return (
        <Stack
            height={"100vh"}
            justifyContent={"center"}
            spacing={5}
            alignItems={"center"}
        >
            <Typography
                variant={"h2"}
            >
                FSDL Food-telling
            </Typography>
            <Stack
                ref={fileBoxRef}
                width={900}
                height={400}
                justifyContent={"center"}
                alignItems={"center"}
                spacing={1.5}
                sx={{
                    border: "5px dashed #000000",
                    cursor: "pointer",
                    userSelect: "none",
                    position: "relative",
                }}
                onClick={onFileUpload}
            >
                <Box
                    position={"absolute"}
                    sx={{
                        width: "100%",
                        height: "100%",
                        zIndex: 1,
                    }}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                />
                <ImageIcon
                    sx={{
                        fontSize: 60,
                    }}
                />
                <Typography
                    variant={"h6"}
                >
                    <strong>
                        Choose a image
                    </strong>
                    {" "}or drag it here.
                </Typography>
            </Stack>
            <input
                ref={fileInputRef}
                style={{
                    display: "none",
                }}
                type={"file"}
                onChange={onFileChange}
            />
        </Stack>
    )
}