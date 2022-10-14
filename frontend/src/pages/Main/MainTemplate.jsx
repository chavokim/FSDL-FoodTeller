import React, {useRef, useState} from "react";
import {Box, Stack, Typography} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import {LoadingOverlay} from "../../common/LoadingOverlay";
import {useNavigate} from "react-router-dom";
import AWS from 'aws-sdk'
// import {uploadFile} from "./UploadImageToS3WithNativeSdk";

export const MainTemplate = () => {
    const S3_BUCKET ='fsdl-foodwise';
    const REGION ='ap-northeast-2';

    AWS.config.update({
        accessKeyId: 'AKIAQIFI4OQ6M5GVRCUR',
        secretAccessKey: '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'
    })

    const myBucket = new AWS.S3({
        params: { Bucket: S3_BUCKET},
        region: REGION,
    })

    const [progress , setProgress] = useState(0);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileInput = (e) => {
        setSelectedFile(e.target.files[0]);
    }

    const uploadFileToS3 = (file) => {

        const params = {
            ACL: 'public-read',
            Body: file,
            Bucket: S3_BUCKET,
            Key: file.name
        };

        myBucket.putObject(params)
            .on('httpUploadProgress', (evt) => {
                setProgress(Math.round((evt.loaded / evt.total) * 100))
            })
            .send((err) => {
                if (err) console.log(err)
            })
    }


    const [file, setFile] = useState();
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef();
    const fileBoxRef = useRef();
    
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
    
    const uploadFile = newFile => {
        setFile(newFile);
        setLoading(true);
        setTimeout(() => {
            uploadFileToS3(newFile)
            navigate("/output");
            setLoading(false);
        }, 1000);
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