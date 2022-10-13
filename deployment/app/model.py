import torch
from torchvision import models


class ResNet(torch.nn.Module):
    def __init__(self):
        super().__init__()
        self.resnet = getattr(models, "resnet18")(pretrained=True)
        # self.resnet.conv1 = torch.nn.Conv2d(1, 64, kernel_size=(7, 7), stride=(2, 2), padding=(3, 3), bias=False)
        # for param in self.resnet.parameters():
        #    param.requires_grad = Tr
        ninput = self.resnet.fc.in_features
        self.resnet.fc = torch.nn.Linear(ninput, 101)

    def forward(self, xb):
        # xb = xb.view(-1, 3, 224, 224) #xb = [bs=64,channel=1,height=244,width=244]
        xb = self.resnet(xb)

        return xb
