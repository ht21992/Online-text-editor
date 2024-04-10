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


class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all().order_by("-updated_at")
    lookup_body_field = "id"
    serializer_class = DocumentSerializer

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        is_valid_serializer = serializer.is_valid(raise_exception=True)
        if is_valid_serializer:
            if not request.data.get("onlyTitle", ""):
                Version.objects.create(document=instance, content=instance.content)

        self.perform_update(serializer)

        if getattr(instance, "_prefetched_objects_cache", None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)

    # def create(self, request, *args, **kwargs):
    #     data = request.data
    #     print(data)
    #     # user = request.user
    #     # request.data['user'] = user.id
    #     # current_language = request.data['language']

    #     # user_drafted_essays = Essay.objects.filter(
    #     #     writer_id=user.id, draft=True)
    #     # if len(user_drafted_essays) > 0:
    #     #     return Response({'error': "You already have a draft essay"})

    #     # user_essays_per_lang = Essay.objects.filter(
    #     #     writer_id=user.id, language=current_language)
    #     # if len(user_essays_per_lang) > 0:
    #     #     return Response({'error': f"You already have an essay with {current_language} language"}, status=status.HTTP_406_NOT_ACCEPTABLE)

    #     # serializer = self.get_serializer(data=request.data)
    #     # serializer.is_valid(raise_exception=True)
    #     # self.perform_create(serializer)
    #     # headers = self.get_success_headers(serializer.data)
    #     return Response({"ok":"ok"}, status=status.HTTP_201_CREATED)


class VersionViewSet(viewsets.ModelViewSet):
    queryset = Version.objects.all().order_by("-created_at")
    lookup_body_field = "id"
    serializer_class = VersionSerializer


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
