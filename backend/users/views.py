from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken


class RegisterView(APIView):
    permission_classes = (permissions.AllowAny, )

    def post(self, request, format=None):
        data = request.data
        u, p, p2 = data.get("username"), data.get("password"), data.get("password2")

        if not all([u, p, p2]):
            return Response({"error": "All fields required"}, status=400)
        if p != p2:
            return Response({"error": "Passwords do not match"}, status=400)

        try:
            if User.objects.filter(username=u).exists():
                return Response({"error": "Username taken"}, status=400)
            if len(p) < 8:
                return Response({"error": "Password too short"}, status=400)

            User.objects.create_user(username=u, password=p)
            return Response({"detail": "User created"}, status=201)
        except Exception as e:
            return Response({'error': f'RegisterView error: {str(e)}'}, status=500)


class LoginView(APIView):
    permission_classes = (permissions.AllowAny, )

    def post(self, request, format=None):
        data = request.data

        try:
            user = authenticate(
                username=data.get("username"), 
                password=data.get("password")
            )
            if user is None:
                return Response({"error": "Invalid credentials"}, status=400)

            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "username": user.username
            })
        except Exception as e:
            return Response({'error': f'LoginView error: {str(e)}'}, status=500)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"username": request.user.username})


class LogoutView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        # JWT is stateless - client just deletes tokens locally
        return Response({"detail": "Logged out"})


class RefreshTokenView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        """Refresh access token using refresh token"""
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response({"error": "Refresh token required"}, status=400)
        
        try:
            refresh = RefreshToken(refresh_token)
            return Response({
                "access": str(refresh.access_token),
            })
        except Exception as e:
            return Response({"error": "Invalid refresh token"}, status=401)


class DeleteAccountView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, format=None):
        request.user.delete()
        return Response({"detail": "Account deleted"})
