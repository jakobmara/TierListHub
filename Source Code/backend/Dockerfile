FROM python:3.8
WORKDIR /app
COPY ./requirements.txt /app
RUN pip install -r ./requirements.txt
COPY ./ /app
ENV FLASK_APP=app.py
ENV FLASK_ENV=development
EXPOSE 5000
CMD ["python", "app.py"]
