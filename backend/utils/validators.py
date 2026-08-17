import re


def validate_ip(ip):
    """
    Validate IPv4 address.
    """

    pattern = r"^((25[0-5]|2[0-4][0-9]|1?[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|1?[0-9]{1,2})$"

    return bool(re.match(pattern, ip))


def validate_cvss(score):
    """
    Validate CVSS score.
    """

    try:
        score = float(score)

        return 0 <= score <= 10

    except Exception:

        return False


def validate_severity(severity):

    allowed = [
        "Low",
        "Medium",
        "High",
        "Critical"
    ]

    return severity in allowed


def validate_file(filename):

    return filename.endswith(".csv")