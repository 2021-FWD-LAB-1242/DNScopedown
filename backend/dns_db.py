class DNSDatabase:
    def __init__(self):
        self.records = {}

    def add_record(self, domain, ip):
        self.records[domain] = {'ip': ip}

    def get_record(self, domain):
        record = self.records.get(domain)
        if record:
            return record['ip']
        return None
