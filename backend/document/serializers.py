from rest_framework import serializers

# document/serializers.py
from .models import Document, Version
from user.serializers import CustomUserSerializer


class DocumentSerializer(serializers.ModelSerializer):
    """
    Serializer for Document model.
    """

    # owner = CustomUserSerializer()

    class Meta:
        model = Document
        fields = ("id", "owner", "title", "content", "created_at", "updated_at")


    # def create(self, validated_data):
    #     user = self.context['request'].user
    #     validated_data['owner'] = user
    #     return super().create(validated_data)


    # def update(self, instance, validated_data):
    #     validated_data.pop('owner', None)
    #     # validated_data.pop('username', None)
    #     # validated_data.pop('Email', None)
    #     return super().update(instance, validated_data)



class VersionSerializer(serializers.ModelSerializer):
    """
    Serializer for Version model.
    """

    # document = DocumentSerializer(read_only=True)

    class Meta:
        model = Version
        fields = "__all__"
