from ProyectoCanteraAPIReact import settings
from django.contrib.auth import authenticate, login, logout
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from datetime import timedelta
from django.utils import timezone
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.db.models import Q
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework import status
import unidecode
from django.shortcuts import get_object_or_404
from django.contrib import messages
from django.core import serializers
from django.core.signing import Signer
from django.core.exceptions import ObjectDoesNotExist
import hashlib
import datetime
import subprocess
from .models import Jugador
import os
import time
from .models import Jugador, Profile
from .serializers import ChangePasswordSerializer, PlayerSearchSerializer, ProfileSerializer, RegisterSerializer, SolicitudVerificacionSerializer


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            Profile.objects.create(user=user)
            login(request, user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            signer = Signer()
            response = Response({'detail': 'Inicio de sesión exitoso'})
            response.set_cookie('authtoken', hashlib.sha256(signer.sign(f"{username}:{password}").encode(
                'utf-8')).hexdigest(), max_age=86400, secure=True, httponly=True, samesite='Strict', path='/')
            return response
        else:
            return Response({'detail': 'Credenciales inválidas'}, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(APIView):
    def post(self, request): logout(request); response = Response(
        {'success': 'Sesión cerrada exitosamente.'}); response.delete_cookie('authtoken'); return response


class CurrentUserView(APIView):
    def get(self, request):
        user = request.user
        if user.is_authenticated:
            is_authenticated = True
            username = user.username
            first_name = user.first_name
            last_name = user.last_name
            email = user.email
            is_admin = user.is_superuser
            try:
                profile = user.profile
                direccion = profile.direccion
                telefono = profile.telefono
                is_approved = profile.aprobado
                if profile.photo:
                    profile_serializer = ProfileSerializer(profile)
                    profile_data = profile_serializer.data
                    photo_url = profile_data['photo']
                else:
                    photo_url = None
            except ObjectDoesNotExist:
                is_approved = False
                photo_url = None
            return Response({
                'is_authenticated': is_authenticated, 'username': username,
                'direccion': direccion, 'telefono': telefono,
                'email': email, 'is_admin': is_admin, 'is_approved': is_approved, 'first_name': first_name,
                'last_name': last_name, 'photo_url': photo_url})
        else:
            is_authenticated = False
            return Response({'detail': 'Usuario no autenticado'}, status=401)


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, username):
        user = get_object_or_404(User, username=username)
        if user.profile.aprobado == 0:
            return Response({'mensaje': 'Tu cuenta está pendiente de verificación por el administrador'}, status=status.HTTP_403_FORBIDDEN)
        if request.user != user:
            return Response('No está autorizado para ver este perfil.', status=status.HTTP_403_FORBIDDEN)
        serializer = ProfileSerializer(user.profile)
        context = serializer.data
        if not user.profile.photo:
            context['default'] = settings.MEDIA_URL + 'default.png'
        return Response(context)

    def put(self, request, username):
        user = get_object_or_404(User, username=username)
        if request.user != user:
            return Response('No está autorizado para editar este perfil.', status=status.HTTP_403_FORBIDDEN)
        perfil = user.profile
        perfil_form = ProfileSerializer(
            instance=perfil, data=request.data, partial=True)
        if perfil_form.is_valid():
            perfil = perfil_form.save(commit=False)
            if 'photo' not in request.data:
                perfil.photo = None
            perfil.save()
            messages.success(
                request, 'Se han guardado los cambios en el perfil')
            serializer = ProfileSerializer(perfil)
            context = serializer.data
            if not perfil.photo:
                context['default'] = settings.MEDIA_URL + 'default.png'
            return Response(context)
        else:
            print(perfil_form.errors)
            return Response(perfil_form.errors, status=status.HTTP_400_BAD_REQUEST)


class IndexView(APIView):
    def get(self, request):
        user = request.user
        if user.is_authenticated:
            if not user.profile.aprobado:
                if user.is_staff:
                    messages.warning(
                        request, 'Su cuenta aún no ha sido aprobada por el administrador.')
                else:
                    return Response({'detail': 'Cuenta no aprobada'}, status=403)
        return Response({'detail': 'Bienvenido al índice'}, status=200)


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            password_actual = serializer.validated_data['oldPassword']
            new_password = serializer.validated_data['newPassword']
            user = request.user
            if user.check_password(password_actual):
                user.set_password(new_password)
                user.save()
                messages.success(
                    request, 'La contraseña ha sido cambiada exitosamente')
                return Response({'detail': 'Contraseña cambiada exitosamente'}, status=status.HTTP_200_OK)
            else:
                return Response({'detail': 'La contraseña actual es incorrecta'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserManagementView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    def get(self, request): profiles = Profile.objects.filter(aprobado=False); serializer = ProfileSerializer(
        profiles, many=True); return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, user_id): profile = get_object_or_404(Profile, user_id=user_id); profile.aprobado = True; profile.save(
    ); return Response({'message': f"El perfil de {profile.user.username} ha sido aprobado"}, status=status.HTTP_200_OK)
    def delete(self, request, user_id): profile = get_object_or_404(Profile, user_id=user_id); profile.delete(
    ); return Response({'message': f"El perfil de {profile.user.username} ha sido eliminado"}, status=status.HTTP_200_OK)


class VerificationRequestView(APIView):
    def post(self, request):
        serializer = SolicitudVerificacionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print('no vale serial')
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ImportPlayersView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        players_count = Jugador.objects.count()
        last_update = Jugador.objects.order_by('-fecha').first()
        if last_update is None:
            last_update = datetime.datetime.now().replace(
                month=1, day=1, hour=0, minute=0, second=0, microsecond=0)
        else:
            last_update = last_update.fecha
        time_since_last_update = (timezone.now()-last_update).days
        if players_count > 0 and time_since_last_update < 42:
            return Response({'message': 'Hay suficientes jugadores en la base de datos'})
        script_path = os.path.join(os.path.dirname(
            os.path.abspath(__file__)), 'scripts', 'scraper.py')
        subprocess.run(['python', script_path])
        with open('cantera.csv', 'r', encoding='utf-8')as f:
            lines = f.readlines()[1:]
            num_lines = len(lines)
            channel_layer = get_channel_layer()
            for (i, line) in enumerate(lines):
                data = line.strip().split(',')
                jugador = Jugador(nombre=data[0], enlace=data[1], temporada=data[2], fecha=data[3],
                                  ultimo_club=data[4], nuevo_club=data[5], valor_mercado=data[6], coste=data[7])
                jugador.save()
                progress = int((i+1)/num_lines*100)
                async_to_sync(channel_layer.group_send)('progress_updates', {
                    'type': 'progress.update', 'progress': progress})
                time.sleep(.1)
        return Response({'message': 'Importación de jugadores completada'})


class SearchPlayersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        jugadores_en_bd = Jugador.objects.all()
        if not jugadores_en_bd:
            return Response({'message': 'No se encontraron jugadores en la base de datos. Por favor, importe los jugadores.'}, status=404)
        six_weeks_ago = timezone.now()-timedelta(weeks=6)
        last_update = jugadores_en_bd.latest('updated_at').updated_at
        if last_update < six_weeks_ago:
            return Response({'message': 'La base de datos de jugadores no se ha actualizado en más de 6 semanas. Por favor, importe los jugadores.'}, status=404)
        return Response({'message': 'Hay jugadores en la base de datos y se han actualizado en las últimas 6 semanas.'}, status=200)

    def post(self, request):
        jugadores = []
        jugadores_en_bd = Jugador.objects.all()
        if not jugadores_en_bd:
            return Response({'message': 'No se encontraron jugadores en la base de datos. Por favor, importe los jugadores.'}, status=404)
        six_weeks_ago = timezone.now()-timedelta(weeks=6)
        last_update = jugadores_en_bd.latest('updated_at').updated_at
        if last_update < six_weeks_ago:
            return Response({'message': 'La base de datos de jugadores no se ha actualizado en más de 6 semanas. Por favor, importe los jugadores.'}, status=404)
        if request.method == 'POST':
            serializer = PlayerSearchSerializer(data=request.data)
            if serializer.is_valid():
                nombre_jugador = serializer.validated_data['nombre']
                nombre_jugador_ascii = unidecode(nombre_jugador)
                jugadores = Jugador.objects.filter(Q(nombre__icontains=nombre_jugador) | Q(
                    nombre__icontains=nombre_jugador_ascii))
                if not jugadores:
                    return Response({'message': 'No se encontraron jugadores con ese nombre.'}, status=404)
                else:
                    data = serializers.serialize('json', jugadores)
                    return Response({'jugadores': data}, status=200)
        else:
            serializer = PlayerSearchSerializer()
        return Response({'message': 'Petición no válida'}, status=400)


class PlayerListView(APIView):
    def get(self, query=None):
        if query:
            query_ascii = unidecode(query)
            jugadores = Jugador.objects.filter(
                Q(nombre__icontains=query) | Q(nombre__icontains=query_ascii))
        else:
            jugadores = Jugador.objects.all()
        serializer = PlayerSearchSerializer(jugadores, many=True)
        return Response(serializer.data)
