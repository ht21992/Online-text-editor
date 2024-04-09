from .models import CustomUser
from .serializers import MyTokenObtainPairSerializer, RegisterSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes


class MyTokenObtainPairView(TokenObtainPairView):
    """
    Custom view for obtaining JWT token pairs with additional user information.
    """
    serializer_class = MyTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    """
    View for user registration.
    """
    queryset = CustomUser.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer


# Get All Routes
@api_view(["GET"])
def getRoutes(request):
    """
    Get a list of available API routes.

    Parameters:
    - request: The HTTP request object.

    Returns:
    Response: A list of available API routes.
    """
    routes = ["/api/token/", "/api/register/", "/api/token/refresh/"]
    return Response(routes)