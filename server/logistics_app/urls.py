from django.urls import path
from . import views

urlpatterns = [
    path('calculate-trip/', views.CalculateTripView.as_view(), name='calculate-trip'),
]
