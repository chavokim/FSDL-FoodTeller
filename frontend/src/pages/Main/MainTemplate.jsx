import React, {useRef, useState} from "react";
import {Box, Stack, Typography, useMediaQuery} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import {LoadingOverlay} from "../../common/LoadingOverlay";
import {useNavigate} from "react-router-dom";
import AWS from 'aws-sdk'

const S3_BUCKET ='fsdl-foodwise';
const REGION ='ap-northeast-2';


AWS.config.update({
    accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY
})

const myBucket = new AWS.S3({
    params: { Bucket: S3_BUCKET},
    region: REGION,
})

export const MainTemplate = () => {
    const [file, setFile] = useState();
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef();
    const fileBoxRef = useRef();

    const mdBreakpoints = useMediaQuery(theme => theme.breakpoints.up("md"));
    
    const navigate = useNavigate();
    
    const onFileChange = (event) => {
        uploadFile(event.target.files[0]);
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
        
        uploadFile(e.dataTransfer.files[0]);
        
        fileBoxRef.current.style.backgroundColor = "initial";
        fileBoxRef.current.style.opacity = 1;
    }

    const uploadFileToS3 = (file) => {
        const params = {
            ACL: 'public-read',
            Body: file,
            Bucket: S3_BUCKET,
            Key: file.name
        };

        myBucket.putObject(params, function(err, data) {
            setLoading(false);
            navigate("/output");
            if (err) {
              return alert("There was an error creating your album: " + err.message);
            }
          })
    }
    
    const uploadFile = newFile => {
        setLoading(true);
        setFile(newFile);
        uploadFileToS3(newFile);
    }
    
    return (
        <Stack
            height={"100vh"}
            justifyContent={"center"}
            spacing={5}
            alignItems={"center"}
        >
            <LoadingOverlay 
                active={loading}
            />
            <Typography
                variant={mdBreakpoints ? "h2" : "h4"}
            >
                FSDL Food-telling
            </Typography>
            <Box
                width={900}
            >
                <Stack
                    ref={fileBoxRef}
                    maxWidth={900}
                    height={400}
                    justifyContent={"center"}
                    alignItems={"center"}
                    spacing={1.5}
                    sx={{
                        border: "5px dashed #000000",
                        cursor: "pointer",
                        userSelect: "none",
                        position: "relative",
                        mx: 5,
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
            </Box>
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