import os
import subprocess
import shutil
import sys

# python3 test/build-move.py test docs

dir_from = sys.argv[1]
dir_to = sys.argv[2]

# Run NPM build
subprocess.call("npm run build", cwd=dir_from, shell=True)

# Copy Dirs
shutil.copytree(f"{dir_from}/dist/assets", f"{dir_to}/assets", dirs_exist_ok=True)
# shutil.copytree(f"{dir_from}/vt-style", f"{dir_to}/vt-style", dirs_exist_ok=True)

# Copy Files
shutil.copy(f"{dir_from}/dist/index.html", f"{dir_to}")
shutil.copy(f"{dir_from}/dist/webmer.html", f"{dir_to}")
shutil.copy(f"{dir_from}/dist/nztm.html", f"{dir_to}")

# Fix "assets" path in HTML
with open(f"{dir_to}/index.html", 'r') as file:
    data = file.read()
    data = data.replace("/assets", "./assets")
    
with open(f"{dir_to}/index.html", 'w') as file:
    file.write(data)

with open(f"{dir_to}/nztm.html", 'r') as file:
    data = file.read()
    data = data.replace("/assets", "./assets")
    
with open(f"{dir_to}/nztm.html", 'w') as file:
    file.write(data)
  
with open(f"{dir_to}/webmer.html", 'r') as file:
    data = file.read()
    data = data.replace("/assets", "./assets")
    
with open(f"{dir_to}/webmer.html", 'w') as file:
    file.write(data)