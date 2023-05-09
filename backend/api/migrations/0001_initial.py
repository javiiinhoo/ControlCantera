# Generated by Django 4.2 on 2023-04-18 10:19

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Jugador',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=100)),
                ('enlace', models.URLField()),
                ('temporada', models.CharField(max_length=10)),
                ('fecha', models.CharField(max_length=20)),
                ('ultimo_club', models.CharField(max_length=100)),
                ('nuevo_club', models.CharField(max_length=100)),
                ('valor_mercado', models.CharField(max_length=20)),
                ('coste', models.CharField(max_length=20)),
            ],
        ),
        migrations.CreateModel(
            name='SolicitudVerificacion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=255)),
                ('apellidos', models.CharField(max_length=255)),
                ('mensaje', models.TextField()),
                ('fecha_creacion', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'ordering': ['-fecha_creacion'],
            },
        ),
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('photo', models.ImageField(blank=True, default='default_profile_photo.png', null=True, upload_to='profile_photos')),
                ('direccion', models.CharField(blank=True, max_length=255)),
                ('telefono', models.CharField(blank=True, max_length=20)),
                ('aprobado', models.BooleanField(default=False)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='profile', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]