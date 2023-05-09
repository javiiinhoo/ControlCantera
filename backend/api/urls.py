from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = (
    [
        path("registro/", views.RegisterView.as_view(), name="registro"),
        path("login/", views.LoginView.as_view(), name="login"),
        path("logout/", views.LogoutView.as_view(), name="logout"),
        path("perfil/<str:username>/", views.ProfileView.as_view(), name="perfil"),
        path(
            "cambiar-contraseña/",
            views.ChangePasswordView.as_view(),
            name="cambiar-contraseña",
        ),
        path(
            "gestion-usuarios/",
            views.UserManagementView.as_view(),
            name="gestion-usuarios",
        ),
        path(
            "solicitar-verificacion/",
            views.VerificationRequestView.as_view(),
            name="solicitar-verificacion",
        ),
        path(
            "importar-jugadores/",
            views.ImportPlayersView.as_view(),
            name="importar-jugadores",
        ),
        path(
            "buscar-jugadores/", views.SearchPlayersView.as_view(), name="buscar-jugadores"
        ),
        path("usuario-actual/", views.CurrentUserView.as_view(),
             name="usuario-actual"),
        path(
            "jugadores/<str:query>/",
            views.PlayerListView.as_view(),
            name="lista-jugadores",
        ),
    ]
    
)
urlpatterns +=static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
