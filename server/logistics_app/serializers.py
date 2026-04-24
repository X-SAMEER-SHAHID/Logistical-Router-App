from rest_framework import serializers
from .models import TripRequest, RoutePlan

class TripRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = TripRequest
        fields = '__all__'

class RoutePlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoutePlan
        fields = ['id', 'total_distance', 'total_duration', 'polyline']
