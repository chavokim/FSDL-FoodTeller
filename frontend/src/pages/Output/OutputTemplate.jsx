import React, {useState} from "react";
import {Button, IconButton, Stack, TextField, Typography} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from "react-router-dom";

const ComponentList = ({label}) => {
    return (
        <Typography 
            variant={"h6"}
            children={label}
            sx={{
                width: "100%",
                background: "#FFFFFF",
                boxShadow: 1,
                px: 1.5,
                py: 1.5,
                borderRadius: 2.5,
                textAlign: "center",
            }}
        />
    )
}

export const OutputTemplate = () => {
    const componentsList = [
        "Egg",
        "Rice",
        "Olive Oil",
        "Kimchi",
    ];
    
    const navigate = useNavigate();
    
    const [inputs, setInputs] = useState([""]);
    
    const handleChange = (index) => (e) => {
        setInputs(prev => [
            ...(prev.slice(0, index)),
            e.target.value,
            ...(prev.slice(index + 1)),
        ])
    }
    
    const handleAdd = () => {
        setInputs(prev => [
            ...prev,
            "",
        ])
    }
    
    const handleDelete = index => () => {
        setInputs(prev => [
            ...(prev.slice(0, index)),
            ...(prev.slice(index + 1))
        ])
    }
    
    const handleSubmit = () => {
        alert("Thank you for suggesting!");
        navigate("/");
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
                Here's your recipe !
            </Typography>
            <Stack
                spacing={1.25}
                width={300}
            >
                {
                    componentsList.map(component => (
                        <ComponentList 
                            label={component}
                        />
                    ))
                }
            </Stack>
            <Typography
                variant={"h4"}
            >
                Any Suggestions?
            </Typography>
            <Stack
                width={300}
                alignItems={"center"}
                spacing={1.25}
            >
                {
                    inputs.map((input, index) => (
                        <Stack
                            direction={"row"}
                            spacing={0.5}
                            alignItems={"center"}
                            width={"100%"}
                        >
                            <TextField
                                fullWidth
                                value={input}
                                onChange={handleChange(index)}
                                placeholder={"Ingredient"}
                            />
                            <IconButton
                                size={"small"}
                                onClick={handleDelete(index)}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Stack>
                    ))
                }
                <Stack
                    direction={"row"}
                    spacing={1}
                    alignItems={"center"}
                >
                    <IconButton
                        size={"large"}
                        onClick={handleAdd}
                        sx={{
                            background: "#1A8D33"
                        }}
                    >
                        <AddIcon />
                    </IconButton>
                    <Button
                        onClick={handleSubmit}
                        variant={"contained"}
                    >
                        Submit
                    </Button>
                </Stack>
            </Stack>
        </Stack>
    )
}