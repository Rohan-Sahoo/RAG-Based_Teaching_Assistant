# Converting Video into mp3
import os
import subprocess
files=os.listdir("videos")
for file in files:
    tutorial_num = file.split("-")[1].split("#")[1]
    file_name = file.split("-")[0].replace(" Sigma Web Development Course","")
    subprocess.run(['ffmpeg','-i',f'videos/{file}', f"audios/{tutorial_num}_{file_name}.mp3"])