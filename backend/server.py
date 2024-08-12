from flask import Flask, request, jsonify
from flask_cors import CORS
from dns_resolver import DNSResolver
from dns_db import DNSDatabase

app = Flask(__name__)
CORS(app)  # Enable CORS for all domains

resolver = DNSResolver()
db = DNSDatabase()

@app.route('/resolve/<domain>', methods=['GET'])
def resolve(domain):
    ip = db.get_record(domain)
    if not ip:
        ip = resolver.resolve(domain)
        if ip:
            db.add_record(domain, ip)
    return jsonify({'domain': domain, 'ip': ip})

@app.route('/get-response-times', methods=['GET'])
def get_response_times():
    return jsonify(resolver.get_response_times())  # Return real response times

if __name__ == '__main__':
    app.run(debug=True)
