# // app/core/safety.py
import re

_MEDICAL = re.compile(r"\b(diagnos(e|is)|prescrib(e|ption)|dose|treat(ment)?|symptom|side effect|medicine|drug interaction)\b", re.I)
_CRISIS  = re.compile(r"\b(kill myself|suicid(e|al)|self[- ]?harm|overdose|hurt myself|end my life)\b", re.I)

def check_safety(user_text: str) -> tuple[bool, str]:
    if _CRISIS.search(user_text):
        return False, ("It sounds like you might be in crisis. "
                       "I can’t help with that here. If you’re in immediate danger, call local emergency services. "
                       "You can also contact your regional crisis hotline.")
    if _MEDICAL.search(user_text):
        return False, ("I can’t provide medical advice. Please consult a qualified clinician. "
                       "If this is urgent, seek emergency care.")
    return True, ""
