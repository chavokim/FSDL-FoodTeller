from collections import defaultdict
import copy
import random
import os
import shutil
from urllib.request import urlretrieve
import cv2
import matplotlib.pyplot as plt
import torch
import torch.backends.cudnn as cudnn
import torch.nn as nn
import json
from torchvision import models
from PIL import Image
import numpy as np
import json
import albumentations as A
from albumentations.pytorch import ToTensorV2
import base64

model_path = "/opt/ml/model"
model = torch.jit.load(model_path)

model.eval()


def get_predictions(img_path):

    # preprocess data
    test_transforms = A.Compose(
        [
            A.SmallestMaxSize(max_size=350),
            A.CenterCrop(height=256, width=256),
            A.Normalize(mean=(0.485, 0.456, 0.406), std=(0.229, 0.224, 0.225)),
            ToTensorV2(),
        ]
    )
    # image = cv2.imread(img_path)
    image = cv2.cvtColor(img_path, cv2.COLOR_BGR2RGB)
    image = test_transforms(image=image)["image"]

    # get prediction
    outputs = model(image.unsqueeze(0))
    _, predicted = torch.max(outputs.data, 1)

    # get class category and ingredients
    with open("classes.txt") as f:
        classes = f.readlines()
    classes = [c.replace("\n", "") for c in classes]

    class2idx = {c: i for i, c in enumerate(classes)}
    idx2class = {i: c for i, c in enumerate(classes)}

    with open("food2ingredients.json", "r") as f:
        food2ingredients = json.load(f)

    food = idx2class[predicted[0].item()]
    return {"food": food, "ingredients": [food2ingredients[food]]}


def base64_to_cv2(image_base64):
    # base64 image to cv2
    image_bytes = base64.b64decode(image_base64)
    np_array = np.frombuffer(image_bytes, np.uint8)
    image_cv2 = cv2.imdecode(np_array, cv2.IMREAD_COLOR)
    return image_cv2


def lambda_handler(event, context):
    image_bytes = event["body"].encode("utf-8")

    img_path = base64_to_cv2(image_bytes)

    # get predictions
    predictions = get_predictions(img_path)

    return {
        "statusCode": 200,
        "body": json.dumps(
            {
                "prediction": predictions,
            }
        ),
    }
