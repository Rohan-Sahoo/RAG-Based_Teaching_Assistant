import numpy as np
import pandas as pd
import joblib
import requests
from sklearn.metrics.pairwise import cosine_similarity


def create_embedding(text_list):
    r = requests.post(
        "http://localhost:11434/api/embed",
        json={
            "model": "bge-m3",
            "input": text_list
        }
    )
    embedding = r.json()['embeddings']
    return embedding


def inference(prompt):
    r = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "llama3.2",
            "prompt": prompt,
            "stream": False
        }
    )
    response = r.json()
    return response


# Load embeddings once when the file loads
df = joblib.load("embeddings.joblib")


def process_query(incoming_query):

    # Create embedding for query
    ques_embedding = create_embedding([incoming_query])[0]

    # Cosine similarity
    similarities = cosine_similarity(
        np.vstack(df['embedding']),
        [ques_embedding]
    ).flatten()

    top_result = 3
    max_indices = similarities.argsort()[::-1][0:top_result]

    new_df = df.loc[max_indices]

    prompt = f"""
I am teaching web development in Sigma web development course, Here are video subtitle chunks containing video title, video number, start time in seconds, end time in seconds, the text at that time:

{new_df[['title','number','start','end','text']].to_json(orient='records')}
------------------------------------
"{incoming_query}"



User asked this question related to the video chunks, you have to answer in a human way (dont mention the above format, its just for you) where and how much content is taught in which video (in which video and at what timestamp) and guide the user to go to that particular video. If user asks unrelated question, tell him that you can only answer questions related to the course content.

If the user mention some greetings or appreciate you're work or thanking you then no need to provide and chunks or video details just reply to them in a human way.
"""

    response = inference(prompt)['response']

    return response