import os
import json
from flask import Flask, request, jsonify
import nacl.signing
import nacl.encoding

app = Flask(__name__)

# Public Key dari tab General Information di Developer Portal
PUBLIC_KEY = d9b7812af83dd8cf787b0232cf7e3bf41459a745842249956e28bbafe07cf337

# Middleware verifikasi signature dari Discord
def verify_signature(req):
    signature = req.headers.get("X-Signature-Ed25519")
    timestamp = req.headers.get("X-Signature-Timestamp")
    body = req.get_data().decode("utf-8")

    try:
        verify_key = nacl.signing.VerifyKey(PUBLIC_KEY, encoder=nacl.encoding.HexEncoder)
        verify_key.verify(f"{timestamp}{body}".encode(), bytes.fromhex(signature))
        return True
    except Exception:
        return False

@app.route("/api/interactions", methods=["POST"])
def interactions():
    if not verify_signature(request):
        return "Invalid request signature", 401

    interaction = request.json

    # Type 1 = Ping → balas Pong
    if interaction["type"] == 1:
        return jsonify({"type": 1})

    # Type 2 = Slash command
    if interaction["type"] == 2:
        if interaction["data"]["name"] == "halo":
            return jsonify({
                "type": 4,
                "data": {"content": "Halo dari endpoint Flask! 👋"}
            })
        if interaction["data"]["name"] == "ping":
            return jsonify({
                "type": 4,
                "data": {"content": "🏓 Pong dari endpoint Flask!"}
            })

    return "Not handled", 400

if __name__ == "__main__":
    app.run(port=3000)
