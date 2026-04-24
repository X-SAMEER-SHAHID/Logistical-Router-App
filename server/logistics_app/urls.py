from django.urls import path
from .views import CalculateTripView, MyTripsView, GoogleLoginView, TripDetailView

urlpatterns = [
    path('calculate-trip/', CalculateTripView.as_view(), name='calculate-trip'),
    path('my-trips/', MyTripsView.as_view(), name='my-trips'),
    path('my-trips/<int:pk>/', TripDetailView.as_view(), name='trip-detail'),
    path('auth/google/', GoogleLoginView.as_view(), name='google_login'),
]
