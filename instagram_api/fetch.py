from instagrapi import Client
from instagrapi.exceptions import LoginRequired
import logging
from os import path
import json
from pathlib import Path
from base64 import b64decode
from os import environ

logger = logging.getLogger()

USERNAME = environ.get("USERNAME")
PASSWORD = environ.get("PASSWORD")

if USERNAME is None or PASSWORD is None:
    raise Exception("Please provide USERNAME and PASSWORD as environment variables")

USERNAME = b64decode(str(USERNAME)).decode("utf-8")
PASSWORD = b64decode(str(PASSWORD)).decode("utf-8")

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
                logger.info("Session is invalid, need to login via username and password")

                old_session = cl.get_settings()

                # use the same device uuids across logins
                cl.set_settings({})
                cl.set_uuids(old_session["uuids"])

                cl.login(USERNAME, PASSWORD)
                cl.dump_settings(Path(sessionPath))
            login_via_session = True
        except Exception as e:
            logger.info("Couldn't login user using session information: %s" % e)

    if not login_via_session:
        try:
            logger.info("Attempting to login via username and password. username: %s" % USERNAME)
            if cl.login(USERNAME, PASSWORD):
                login_via_pw = True
                cl.dump_settings(Path(sessionPath))
        except Exception as e:
            logger.info("Couldn't login user using username and password: %s" % e)

    if not login_via_pw and not login_via_session:
        raise Exception("Couldn't login user with either password or session")
    
    return cl

cl = login_user(USERNAME,PASSWORD)

user_id = cl.user_id_from_username(USERNAME)
medias = cl.user_medias(int(user_id), 12)
user_info = cl.user_info(user_id)

# Make sure we have the data directory
if path.exists(path.expanduser("~/public_html")):
    dataDir = path.join(path.expanduser("~/public_html"), "public", "instagram")
else:
    print("Using local data directory")
    dataDir = path.join(path.dirname(__file__), "..", "public", "images", "instagram")

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
    'followers': user_info.follower_count,
    'following': user_info.following_count,
    'media_count': user_info.media_count,
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
        cl.photo_download_by_url(str(media.thumbnail_url), path.join(dataDir, media.code))

# Download profile picture
if not path.exists(path.join(dataDir, "profile.jpg")):
    print("Downloading profile picture")
    cl.photo_download_by_url(str(user_info.profile_pic_url), path.join(dataDir, "profile"))

# Save Data
with open(path.join(path.dirname(__file__), "data.json"), 'w') as outfile:
    json.dump(data, outfile)

# Compile HTML

# Remove old images
for file in Path(dataDir).glob('[!profile.]*'):
    if not file.stem in mediaCodes:
        print("Removing old media: " + file.stem)
        file.unlink()