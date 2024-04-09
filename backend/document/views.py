# document/views.py
from django.shortcuts import render
from .models import Document,Version
from .serializers import DocumentSerializer, VersionSerializer
from rest_framework import viewsets, status
from rest_framework.response import Response
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required



class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all().order_by('-updated_at')
    lookup_body_field = 'id'
    serializer_class = DocumentSerializer

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
    queryset = Version.objects.all().order_by('-created_at')
    lookup_body_field = 'id'
    serializer_class = VersionSerializer