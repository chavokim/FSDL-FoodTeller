FROM public.ecr.aws/lambda/python:3.8

COPY app.py model.py classes.txt food2ingredients.json requirements.txt ./
COPY FSDL_backup.pt /opt/ml/model

RUN python3.8 -m pip install -r requirements.txt -t .

CMD ["app.lambda_handler"]
