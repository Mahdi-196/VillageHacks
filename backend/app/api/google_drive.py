from fastapi import APIRouter, Depends, HTTPException, status
# Assume you have an authentication dependency to get the logged-in user
# from app.core.auth import get_current_user  
from app.services import supermemory_service

router = APIRouter(
    prefix="/connectors/google-drive",
    tags=["Google Drive Connector"]
)

# Define a Pydantic response model for clarity (optional)
class OAuthStartResponse(dict):
    auth_url: str

@router.post("/start", status_code=200)
def start_google_drive_oauth(
    # current_user: User = Depends(get_current_user)   # Enforce login, if applicable
):
    """
    Start Google Drive OAuth process by obtaining the authorization URL.
    Returns the URL that the client should redirect the user to.
    """
    try:
        # Define the redirect callback URL for Google OAuth flow
        redirect_uri = "https://<your-domain>/connectors/google-drive/callback"  # Update to your actual callback
        # Optionally, use the current user's ID as a container tag to segregate data
        container_tag = None 
        # If user auth is in place, you might do: container_tag = f"user-{current_user.id}"
        
        # Call the service to get the Google OAuth authorization URL
        auth_url = supermemory_service.start_google_drive_connection(redirect_uri, container_tag)
    except Exception as e:
        # Log the error (omitted for brevity) and return HTTP 500
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(e))
    # Respond with the URL so client can redirect the user to Google
    return {"auth_url": auth_url}
