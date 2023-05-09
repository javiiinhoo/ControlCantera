from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Profile, SolicitudVerificacion


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['direccion', 'telefono', 'photo']

    def update(self, instance, validated_data):
        instance.direccion = validated_data.get(
            'direccion', instance.direccion)
        instance.telefono = validated_data.get('telefono', instance.telefono)
        instance.photo = validated_data.get('photo', instance.photo)
        if 'is_approved' in validated_data:
            instance.is_approved = validated_data['is_approved']
        instance.save()
        return instance


class RegisterSerializer(serializers.Serializer):
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    username = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)

    def validate(self, data):
        password = data.get("password")
        password_confirm = data.get("password_confirm")
        if password != password_confirm:
            raise serializers.ValidationError("Las contraseñas no coinciden.")
        if User.objects.filter(username=data.get("username")).exists():
            raise serializers.ValidationError(
                "El nombre de usuario ya existe.")
        if User.objects.filter(email=data.get("email")).exists():
            raise serializers.ValidationError(
                "El correo electrónico ya está en uso.")
        return data

    def create(self, validated_data):
        print("Datos validados:", validated_data)
        user = User.objects.create_user(
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )
        return user


User = get_user_model()


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        print("user: ", user)
        if user and user.is_active:
            print("username: ", data["username"])
            print("password: ", data["password"])
            return data
        raise serializers.ValidationError(
            "Nombre de usuario o contraseña incorrectos")


class ChangePasswordSerializer(serializers.Serializer):
    oldPassword = serializers.CharField(max_length=128, required=True)
    newPassword = serializers.CharField(max_length=128, required=True)
    confirmNewPassword = serializers.CharField(max_length=128, required=True)

    def validate(self, data):
        newPassword = data.get("newPassword")
        confirmNewPassword = data.get("confirmNewPassword")
        if newPassword != confirmNewPassword:
            raise serializers.ValidationError("Las contraseñas no coinciden.")
        return data


class PlayerSearchSerializer(serializers.Serializer):
    nombre = serializers.CharField(required=True)


class SolicitudVerificacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = SolicitudVerificacion
        fields = ["id", "nombre", "apellidos", "mensaje"]
