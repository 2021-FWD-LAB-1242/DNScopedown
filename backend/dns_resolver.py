import socket
import time

class DNSResolver:
    def __init__(self):
        self.response_times = []

    def resolve(self, domain):
        try:
            start_time = time.time()
            ip = socket.gethostbyname(domain)
            response_time = time.time() - start_time
            # Store the response time
            self.response_times.append({
                'timestamp': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
                'time': response_time
            })
            return ip
        except socket.error:
            return None

    def get_response_times(self):
        return self.response_times
