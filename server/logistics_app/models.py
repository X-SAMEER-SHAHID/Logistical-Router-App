from django.db import models

class TripRequest(models.Model):
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

class LogSheet(models.Model):
    route_plan = models.ForeignKey(RoutePlan, on_delete=models.CASCADE, related_name='log_sheets')
    day_number = models.IntegerField()
    image = models.ImageField(upload_to='log_sheets/')
    created_at = models.DateTimeField(auto_now_add=True)
