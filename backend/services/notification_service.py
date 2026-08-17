notifications = [
    {
        "id": 1,
        "title": "Critical Threat",
        "message": "Malware detected",
        "time": "2 mins ago",
        "read": False
    },
    {
        "id": 2,
        "title": "Firewall Updated",
        "message": "Rules synchronized",
        "time": "10 mins ago",
        "read": True
    }
]

def get_notifications():
    return notifications