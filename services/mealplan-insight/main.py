from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi import HTTPException
from starlette.responses import JSONResponse
from gradio_client import Client

app = FastAPI()

origins = [
    "*",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get('/health-check', status_code=200)
async def health_check():
    return 'Server is ready to go!'

class GenerateRequest(BaseModel):
    prompt: str



@app.post("/generate")
async def lookup_words(req:GenerateRequest):
    client = Client("https://qwen-qwen1-5-72b-chat.hf.space/--replicas/3kh1x/")
    result = client.predict(
    req.prompt,
    [["Hello!","null"]],	
    "You are a helpful assistant.",
    api_name="/model_chat"
)
    return JSONResponse({"insight":result[1][1][1]})
