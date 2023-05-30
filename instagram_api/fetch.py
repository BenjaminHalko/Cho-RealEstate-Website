from instagrapi import Client
from instagrapi.exceptions import LoginRequired
from os import path
from pathlib import Path
from base64 import b64decode
from subprocess import run
from PIL import Image
import json

# Get credentials
credentialsPath = path.join('~', "credentials.json")

if path.exists(path.expanduser(credentialsPath)):
    with open(path.expanduser(credentialsPath)) as json_file:
        credentials = json.load(json_file)
        USERNAME = b64decode(credentials["username"]).decode("utf-8")
        PASSWORD = b64decode(credentials["password"]).decode("utf-8")
else:
    print("No credentials.json file found")
    #exit()

USERNAME = "benjaminhalko"
PASSWORD = "secure"

def login_user(USERNAME, PASSWORD):
    """
    Attempts to login to Instagram using either the provided session information
    or the provided username and password.
    """

    sessionPath = path.join(path.dirname(__file__), "session.json")

    cl = Client()
    if path.exists(sessionPath):
        session = cl.load_settings(Path(sessionPath))
    else:
        session = None

    login_via_session = False
    login_via_pw = False

    if session:
        try:
            cl.set_settings(session)
            cl.login(USERNAME, PASSWORD)

            # check if session is valid
            try:
                cl.get_timeline_feed()
            except LoginRequired:
                old_session = cl.get_settings()

                # use the same device uuids across logins
                cl.set_settings({})
                cl.set_uuids(old_session["uuids"])

                cl.login(USERNAME, PASSWORD)
                cl.dump_settings(Path(sessionPath))
            login_via_session = True
        except Exception as e:
            print("Couldn't login user")

    if not login_via_session:
        try:
            if cl.login(USERNAME, PASSWORD):
                login_via_pw = True
                cl.dump_settings(Path(sessionPath))
        except Exception as e:
            print("Couldn't login user")

    if not login_via_pw and not login_via_session:
        raise Exception("Couldn't login user with either password or session")
    
    return cl

# Login
print("Logging in")
cl = login_user(USERNAME,PASSWORD)

# Get Data
print("Getting data")

user_id = cl.user_id_from_username(USERNAME)
medias = cl.user_medias(int(user_id), 12)
user_info = cl.user_info(user_id)

# Write data to file
print("Writing data to file")

# Make sure we have the data directory
dataDir = path.abspath(path.join(path.dirname(__file__), "..", "public", "images", "instagram"))

if not path.exists(dataDir):
    Path(dataDir).mkdir(parents=True, exist_ok=True)

# Get Data
downloadedImages = []
mediaCodes = []

for file in Path(dataDir).glob('[!profile.]*'): downloadedImages.append(file.stem)

data = {
    'username': user_info.username,
    'full_name': user_info.full_name,
    'biography': user_info.biography,
    'posts': []
}

for media in medias:
    data['posts'].append({
        'caption': media.caption_text,
        'code': media.code
    })

    mediaCodes.append(media.code)

    if not media.code in downloadedImages:
        print("Downloading media: " + media.code)
        imagePath = path.join(dataDir, media.code)
        cl.photo_download_by_url(str(media.thumbnail_url), imagePath)
        Image.open(imagePath+".jpg").resize((300, 300)).save(imagePath+".jpg")

# Download profile picture
if not path.exists(path.join(dataDir, "profile.jpg")):
    print("Downloading profile picture")
    profilePath = path.join(dataDir, "profile")
    cl.photo_download_by_url(str(user_info.profile_pic_url), profilePath)
    Image.open(profilePath+".jpg").resize((86, 86)).save(profilePath+".jpg")

# Save Data
with open(path.join(path.dirname(__file__), "data.json"), 'w') as outfile:
    json.dump(data, outfile)

# Compile HTML
print("Compiling HTML")
run(["node", path.join(path.dirname(__file__), "compile.js")])

# Remove old images
for file in Path(dataDir).glob('[!profile.]*'):
    if not file.stem in mediaCodes:
        print("Removing old media: " + file.stem)
        file.unlink()

# Rsync Images
if path.exists(path.expanduser("~/public_html")):
    print("Rsyncing images")
    run(["rsync", "-acv", "--delete", dataDir, "~/public_html/images/instagram/"])
else:
    print("No public_html directory found, skipping rsync")