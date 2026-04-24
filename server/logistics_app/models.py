from django.db import models
from django.contrib.auth.models import User

class TripRequest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='trips')
    current_loc = models.CharField(max_length=255)
    pickup_loc = models.CharField(max_length=255)
    dropoff_loc = models.CharField(max_length=255)
    current_cycle_used = models.FloatField(default=0.0) # hours used in 70hr cycle
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.pickup_loc} -> {self.dropoff_loc}"

class RoutePlan(models.Model):
    trip_request = models.ForeignKey(TripRequest, on_delete=models.CASCADE, related_name='route_plans')
    total_distance = models.FloatField() # in miles
    total_duration = models.FloatField() # in hours
    polyline = models.TextField(blank=True, null=True) # JSON or encoded string
    created_at = models.DateTimeField(auto_now_add=True)
