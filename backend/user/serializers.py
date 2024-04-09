from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from .models import CustomUser


class CustomUserSerializer(serializers.ModelSerializer):
    """
    Serializer for CustomUser model.

    Fields:
    - username: The username of the user.
    - email: The email address of the user.
    """

    class Meta:
        model = CustomUser
        fields = ("username", "email")


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom token serializer that includes additional user information in the token.

    Additional Fields:
    - full_name: The full name of the user.
    - username: The username of the user.
    - email: The email address of the user.
    - bio: The biography of the user.
    - verified: A flag indicating whether the user is verified.
    """

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token["full_name"] = user.profile.full_name
        token["username"] = user.username
        token["email"] = user.email
        token["bio"] = user.profile.bio
        token["verified"] = user.profile.verified
        return token


class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration.

    Fields:
    - email: The email address of the user.
    - username: The username of the user.
    - password: The password for the user account.
    - password2: Confirmation of the password to ensure it matches.
    """

    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = CustomUser
        fields = ("email", "username", "password", "password2")

    def validate(self, attrs):
        """
        Validate that the password and password2 fields match.

        Args:
        - attrs (dict): The dictionary of field values.

        Returns:
        - dict: The validated data.
        """
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."}
            )
        return attrs

    def create(self, validated_data):
        """
        Create a new user instance.

        Args:
        - validated_data (dict): The validated data.

        Returns:
        - CustomUser: The created user instance.
        """
        user = CustomUser.objects.create(
            username=validated_data["username"], email=validated_data["email"]
        )
        user.set_password(validated_data["password"])
        user.save()
        return user
