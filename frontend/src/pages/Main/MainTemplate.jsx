import React, {useEffect, useRef, useState} from "react";
import {Box, Stack, Typography, useMediaQuery} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import {LoadingOverlay} from "../../common/LoadingOverlay";
import {useNavigate, useSearchParams} from "react-router-dom";
import AWS from 'aws-sdk'
import axios from "axios";

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
    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef();
    const fileBoxRef = useRef();

    const mdBreakpoints = useMediaQuery(theme => theme.breakpoints.up("md"));

    useEffect(() => {
        console.log(searchParams);
    }, [searchParams])
    
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
            if (err) {
                return alert("There was an error creating your album: " + err.message);
            }
            setLoading(false);
        })
    }

    const getBase64 = file => {
        return new Promise(resolve => {
          let fileInfo;
          let baseURL = "";
          // Make new FileReader
          let reader = new FileReader();
    
          // Convert the file to base64 text
          reader.readAsDataURL(file);
    
          // on reader load somthing...
          reader.onload = () => {
            // Make a fileInfo Object
            console.log("Called", reader);
            baseURL = reader.result;
            console.log(baseURL);
            resolve(baseURL);
          };
          console.log(fileInfo);
        });
      };

    const getPrediction = (newFile) => {
        // getBase64(newFile).then(async result => {
        //     const response = await axios.post(
        //         "https://3r0hzkix91.execute-api.ap-southeast-1.amazonaws.com/Prod/classify_food",
        //         result,
        //         {
        //             headers: {
        //                 "Content-Type": "raw",
        //                 "Access-Control-Allow-Origin" : "*"
        //             },
        //         }
        //     ).then(resp => {
        //         setSearchParams({food: "hi", ingredients: ["h", "tomo", "potato"]});
        //     })
        // })
        setSearchParams({food: "hi", ingredients: ["h", "tomo", "potato"]});
    }
    
    const uploadFile = newFile => {
        setLoading(true);
        getPrediction(newFile);
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