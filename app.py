import os
from fastapi import FastAPI, Request


# define a Fast API app
app = FastAPI()

# define a route, binding a function to a URL (e.g. GET method) of the server
@app.get("/")
async def root():
  return {"message": "Hello World"}  # the API returns a JSON response
