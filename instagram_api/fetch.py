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

user_id = int(cl.user_id_from_username(USERNAME))
medias = cl.user_medias(user_id, 10)

data = []
for media in medias:
    data.append({
        'caption': media.caption_text,
        'thumbnail': media.thumbnail_url,
        'code': media.code
    })

with open(path.join(path.dirname(__file__), "data.json"), 'w') as outfile:
    json.dump(data, outfile)