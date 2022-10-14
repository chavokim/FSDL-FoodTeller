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
    const [prediction, setPrediction] = useState();
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef();
    const fileBoxRef = useRef();

    const mdBreakpoints = useMediaQuery(theme => theme.breakpoints.up("md"));
        
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
            resolve(baseURL.split("base64,")[1]);
          };
          console.log(fileInfo);
        });
      };

    const getPrediction = (newFile) => {
         getBase64(newFile).then(async result => {
             const response = await axios.post(
                 "/Prod/classify_food",
                 result,
                 {
                    baseURL: "https://oqvmaayszek7blcwg6kl325dqe0fnxxh.lambda-url.ap-southeast-1.on.aws",
                    headers: {
                         "Content-Type" : "text/plain",
                    },
                 }
             ).then(resp => {
                 setPrediction(resp.data.prediction);
                 setLoading(false);
             })
         })
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
            alignItems={"center"}
        >
            <LoadingOverlay 
                active={loading}
            />
            <Stack
                direction={{md: "row", sm:"column"}}
                spacing={5}
                width={"100%"}
                height={"100%"}
            >
                {
                    prediction ? (
                        <Stack
                            spacing={2.5}
                            alignItems={"center"}
                            sx={{
                                mx: {md: 5, xs: 2.5,},
                                my: {md: 5, xs: 2.5,}
                            }}
                        >
                            <Typography
                                variant={mdBreakpoints ? "h4" : "h6"}
                            >
                                Your food is... 
                            </Typography>
                            <Typography
                                variant={mdBreakpoints ? "h3" : "h5"}
                                sx={{
                                    px: 5,
                                    py: 2,
                                    border: "2px dashed #000000",
                                    borderRadius: 2.5,
                                }}
                            >
                                {prediction.food}
                            </Typography>
                            <Typography
                                variant={mdBreakpoints ? "h4" : "h6"}
                            >
                                Ingredients are...
                            </Typography>
                            <Stack
                                spacing={1}
                            >
                            {prediction.ingredients[0].split(",").map(ingredient => (
                                <Typography
                                    variant={mdBreakpoints ? "h5" : "subtitle1"}
                                    children={ingredient}
                                    sx={{
                                        px: 2.5,
                                        py: 1,
                                        border: "2px dashed #000000",
                                        borderRadius: 2.5,
                                    }}
                                />
                            ))}
                            </Stack>
                        </Stack>    
                    ) : null
                }
                
                <Stack
                    spacing={5}
                    alignItems={"center"}
                    flexGrow={1}
                    sx={{
                        mx: 5,
                    }}
                >
                    <Typography
                        variant={mdBreakpoints ? "h2" : "h4"}
                    >
                        FSDL Food-telling
                    </Typography>
                    <Stack
                        ref={fileBoxRef}
                        maxWidth={900}
                        width={"100%"}
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
                </Stack>
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
