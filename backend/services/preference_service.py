preferences = {
    "theme": "dark",
    "emailAlerts": True
}

def get_preferences():
    return preferences

def update_preferences(data):
    preferences.update(data)
    return preferences