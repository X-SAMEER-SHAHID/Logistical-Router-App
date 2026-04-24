from rest_framework import serializers
from .models import TripRequest, RoutePlan, LogSheet

class TripRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = TripRequest
        fields = '__all__'

class LogSheetSerializer(serializers.ModelSerializer):
    class Meta:
        model = LogSheet
        fields = ['id', 'day_number', 'image']

class RoutePlanSerializer(serializers.ModelSerializer):
    log_sheets = LogSheetSerializer(many=True, read_only=True)
    
    class Meta:
        model = RoutePlan
        fields = ['id', 'total_distance', 'total_duration', 'polyline', 'log_sheets']
