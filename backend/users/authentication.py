from rest_framework.authentication import SessionAuthentication


class CsrfExemptSessionAuthentication(SessionAuthentication):
    """
    SessionAuthentication without CSRF validation for cross-origin requests.
    This is necessary when frontend and backend are on different domains.
    """
    def enforce_csrf(self, request):
        return  # Skip CSRF validation
