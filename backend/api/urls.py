from django.urls import path
from . import views
from .views import SavedRoutesListCreateView, SavedRouteDetailView
from django.views.decorators.csrf import csrf_exempt

app_name = 'api'

urlpatterns = [
    path('find-optimal-route', csrf_exempt(views.find_optimal_route), name="find_optimal_route"),
    # Use DRF views for saved-routes (JWT authentication)
    path('saved-routes/', SavedRoutesListCreateView.as_view(), name='saved_routes_list_create'),
    path('saved-routes/<int:pk>/', SavedRouteDetailView.as_view(), name='saved_route_detail'),
]