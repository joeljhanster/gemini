import os
import re
import json
import google.generativeai as genai
from bson.objectid import ObjectId
from dotenv import load_dotenv
from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from urllib.parse import urlparse
from pymongo import ReturnDocument
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi


# Load environment variables (for development environment)
load_dotenv()

# Configure Google AI
generation_config = {
    "temperature": 0.9,
    "top_p": 1,
    "top_k": 1,
    "max_output_tokens": 2048,
}

safety_settings = [
    {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
    {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE"},
    {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE"},
    {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE"},
]
genai.configure(api_key=os.environ["API_KEY"])
model = genai.GenerativeModel("gemini-pro", safety_settings, generation_config)

# Configure MongoDB
uri = os.environ["DATABASE_URI"]
# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi("1"))

# Send a ping to confirm a successful connection
try:
    client.admin.command("ping")
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

phishy_db = client["phishy"]
chats_col = phishy_db["chats"]
urls_col = phishy_db["urls"]

# Create a Flask app
app = Flask(__name__)
CORS(app)

# Load chat history
with open("chat-history.json", "r") as file:
    chat_history = json.load(file)

# Constants
URL_TYPE = "URL"


### HELPER METHODS ###
def phishy_url_chat(context_history=[], user_history=[]):
    return model.start_chat(history=chat_history + context_history + user_history)


def parse_phishy_url(text):
    # Define regex pattern to match the first word and the sentence after it
    pattern = r"^(YES|NO|MAYBE)\.\s*(.*?)\n\n(.*)$"

    # Apply regex pattern to the input text
    match = re.match(pattern, text, re.DOTALL)

    if match:
        # Extract first word, header, and body
        first_word = match.group(1)
        header = match.group(2)
        body = match.group(3)

        isSuspicious = first_word in ["YES", "MAYBE"]

        return {
            "isSuspicious": isSuspicious,
            "header": header.strip() if isSuspicious else None,
            "body": body.strip() if isSuspicious else None,
        }
    else:
        return {"isSuspicious": False, "header": None, "body": None}


def get_domain_url(url):
    parsed_url = urlparse(url)
    if parsed_url.scheme and parsed_url.netloc:
        return f"{parsed_url.scheme}://{parsed_url.netloc}"

    return url


### API ROUTES ###
@app.route("/api/v1/chats", methods=["POST"])
def chats():
    if request.method == "POST":
        data = request.json
        user_id = data["userId"]
        phishy_type = data["type"]
        response = {"items": []}

        if phishy_type == URL_TYPE:
            urls = data["urls"]

            for url in urls:
                # Check if domain url has been checked before
                domain_url = get_domain_url(url)
                found_url = urls_col.find_one({"url": domain_url})

                response_item = {"type": URL_TYPE, "url": url, "domainUrl": domain_url}

                # If not, ask Gemini
                if not found_url:
                    message = f'Is "{domain_url}" a suspicious link? Answer starting with NO, YES or MAYBE. If it\'s NO, do not give an elaboration.'
                    chat = phishy_url_chat()
                    chat.send_message(message)
                    result = parse_phishy_url(chat.last.text)

                    # If suspicious, insert url & start new chat
                    if result["isSuspicious"]:
                        url_doc = {
                            "url": domain_url,
                            "is_suspicious": True,
                            "header": result["header"],
                            "body": result["body"],
                            "context_history": [
                                {"role": "user", "parts": [message]},
                                {"role": "model", "parts": [chat.last.text]},
                            ],
                        }
                        inserted_url = urls_col.insert_one(url_doc)

                        # Start new chat
                        chat_doc = {
                            "type": URL_TYPE,
                            "url_id": inserted_url.inserted_id,
                            "user_id": user_id,
                            "user_history": [],
                        }
                        inserted_chat = chats_col.insert_one(chat_doc)

                        response_item["header"] = result["header"]
                        response_item["body"] = result["body"]
                        response_item["id"] = str(inserted_chat.inserted_id)
                        response_item["userHistory"] = []
                        response["items"].append(response_item)
                    else:
                        url_doc = {"url": domain_url, "is_suspicious": False}
                        urls_col.insert_one(url_doc)

                elif found_url["is_suspicious"]:
                    response_item["header"] = found_url["header"]
                    response_item["body"] = found_url["body"]

                    # Get chat id related to user id, else create new
                    url_id = found_url["_id"]
                    found_chat = chats_col.find_one(
                        {"url_id": url_id, "user_id": user_id}
                    )

                    if not found_chat:
                        chat_doc = {
                            "type": URL_TYPE,
                            "url_id": url_id,
                            "user_id": user_id,
                            "user_history": [],
                        }
                        inserted_chat = chats_col.insert_one(chat_doc)
                        response_item["id"] = str(inserted_chat.inserted_id)
                        response_item["userHistory"] = []
                    else:
                        response_item["id"] = str(found_chat["_id"])
                        response_item["userHistory"] = found_chat["user_history"]

                    response["items"].append(response_item)

        response["catches"] = len(response["items"])
        return jsonify(response)


@app.route("/api/v1/chats/<chat_id>", methods=["GET", "POST"])
def chat(chat_id):
    try:
        found_chat = chats_col.find_one({"_id": ObjectId(chat_id)})
        if not found_chat:
            return Response(status=404)

        found_url = urls_col.find_one({"_id": found_chat["url_id"]})
        if not found_url:
            return Response(status=404)
    except:
        return Response(status=404)

    if request.method == "GET":
        response = {
            "id": str(found_chat["_id"]),
            "type": found_chat["type"],
            "url": found_url["url"],
            "domainUrl": None,
            "header": found_url["header"],
            "body": found_url["body"],
            "userHistory": found_chat["user_history"],
        }

        return jsonify(response)

    if request.method == "POST":
        data = request.json
        message = data["message"]

        chat = phishy_url_chat(
            context_history=found_url["context_history"],
            user_history=found_chat["user_history"],
        )
        chat.send_message(message)

        latest_convo = [
            {"role": "user", "parts": [message]},
            {"role": "model", "parts": [chat.last.text]},
        ]

        updated_chat = chats_col.find_one_and_update(
            {"_id": found_chat["_id"]},
            {"$push": {"user_history": {"$each": latest_convo}}},
            return_document=ReturnDocument.AFTER,
        )

        response = {
            "id": str(updated_chat["_id"]),
            "type": updated_chat["type"],
            "url": found_url["url"],
            "domainUrl": None,
            "header": found_url["header"],
            "body": found_url["body"],
            "userHistory": updated_chat["user_history"],
        }

        return jsonify(response)


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
