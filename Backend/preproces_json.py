import requests
import os
import json
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import joblib 

def create_embedding(text_list):
    r = requests.post("http://localhost:11434/api/embed",json={
        "model":"bge-m3",
        "input": text_list
    })

    emebedding = r.json()['embeddings']
    return emebedding

# a=create_embedding("Hello, world!")
# print(a[:5])
# b=create_embedding("Hello Milky Way!")
# print(b[:5])

jsons = os.listdir("newjsons") # List all the json files
chunk_id = 0
my_dicts = []

for json_file in jsons:
    with open(f"newjsons/{json_file}") as f:
        content = json.load(f)
    print(f"Creating embeddings for {json_file}...")
    embeddings = create_embedding([c["text"] for c in content["chunks"]])    
    for i,chunk in enumerate(content["chunks"]):
        chunk["chunk_id"] = chunk_id
        chunk["embedding"] = embeddings[i]
        chunk_id +=1
        my_dicts.append(chunk)
    

df = pd.DataFrame.from_records(my_dicts)    
 
# Saving the DataFrame to further processing

joblib.dump(df,"embeddings_data.joblib")



