# document/views.py
from django.shortcuts import render
from .models import Document, Version
from .serializers import DocumentSerializer, VersionSerializer
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required
import json

class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all().order_by("-updated_at")
    lookup_body_field = "id"
    serializer_class = DocumentSerializer


    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.owner != request.user and not request.user.is_superuser:
            return Response({"error": "Access Denied"}, status=403)
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.owner != request.user and not request.user.is_superuser:
            return Response({"error": "Access Denied"}, status=403)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        if instance.owner != request.user and not request.user.is_superuser:
            return Response({"error": "Access Denied"}, status=403)
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        is_valid_serializer = serializer.is_valid(raise_exception=True)
        if is_valid_serializer:
            if not request.data.get("versionCreation", ""):
                Version.objects.create(document=instance, content=instance.content)

        self.perform_update(serializer)

        if getattr(instance, "_prefetched_objects_cache", None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)

    def get_queryset(self) :
        all_docs = self.request.GET.get("all","")
        user = self.request.user
        if all_docs and user.is_superuser:
            return Document.objects.all()
        return Document.objects.filter(owner=user)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)




class VersionViewSet(viewsets.ModelViewSet):
    queryset = Version.objects.all().order_by("-created_at")
    lookup_body_field = "id"
    serializer_class = VersionSerializer


    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.document.owner != request.user and not request.user.is_superuser:
            return Response({"error": "Access Denied"}, status=403)
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.document.owner != request.user and not request.user.is_superuser:
            return Response({"error": "Access Denied"}, status=403)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


    def list(self, request, *args, **kwargs):
        doc_id = request.GET.get("doc_id", "")

        if not doc_id and not request.user.is_superuser:
            return Response({"error": "document id is mandatory"}, status=401)

        if doc_id:
            if Document.objects.filter(id=doc_id).exists():
                doc = Document.objects.get(id=doc_id)
                queryset = Version.objects.filter(document=doc).order_by("-created_at")
            else:
                queryset = []
        else:
            queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        if instance.document.owner != request.user and not request.user.is_superuser:
            return Response({"error": "Access Denied"}, status=403)
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)




class VersionsAPIView(APIView):
    def get(self, request, format=None):
        version_id = request.GET.get("version_id", "")
        if version_id:
            data, flag = self.get_version(request, version_id)
            if not flag:
                return Response({"error": "invalid version id"}, status=401)
            return Response(data)
        doc_id = request.GET.get("doc_id", "")
        if not doc_id:
            return Response({"error": "document id is mandatory"}, status=401)
        doc = Document.objects.get(id=doc_id)
        queryset = Version.objects.filter(document=doc).order_by("-created_at")
        serializer = VersionSerializer(queryset, many=True)
        return Response(serializer.data)

    def get_version(self, request, version_id, format=None):
        try:
            version = Version.objects.get(id=version_id)
        except Version.DoesNotExist:
            return "",False
        serializer = VersionSerializer(version)
        return serializer.data, True
