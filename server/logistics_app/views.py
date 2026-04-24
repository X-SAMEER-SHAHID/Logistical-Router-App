from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import json

from .models import TripRequest, RoutePlan, LogSheet
from .serializers import RoutePlanSerializer
from .utils.routing import get_full_route
from .utils.hos_calculator import HOSCalculator
from .utils.image_generator import generate_log_sheet

class CalculateTripView(APIView):
    def post(self, request):
        data = request.data
        current_loc = data.get('current_loc')
        pickup_loc = data.get('pickup_loc')
        dropoff_loc = data.get('dropoff_loc')
        current_cycle_used = float(data.get('current_cycle_used', 0.0))

        if not all([current_loc, pickup_loc, dropoff_loc]):
            return Response({"error": "Missing required location data."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # 1. Save Request
            trip_request = TripRequest.objects.create(
                current_loc=current_loc,
                pickup_loc=pickup_loc,
                dropoff_loc=dropoff_loc,
                current_cycle_used=current_cycle_used
            )

            # 2. Get Routing Data
            total_distance, total_duration, full_polyline = get_full_route(current_loc, pickup_loc, dropoff_loc)
            
            if total_distance == 0:
                return Response({"error": "Could not calculate route."}, status=status.HTTP_400_BAD_REQUEST)

            route_plan = RoutePlan.objects.create(
                trip_request=trip_request,
                total_distance=total_distance,
                total_duration=total_duration,
                polyline=json.dumps(full_polyline)
            )

            # 3. Calculate HOS
            hos = HOSCalculator(current_cycle_used)
            events = hos.process_trip(total_distance, total_duration)

            # 4. Generate Images
            days = set(event['day'] for event in events)
            for day in days:
                image_path = generate_log_sheet(day, events, route_plan.id)
                LogSheet.objects.create(
                    route_plan=route_plan,
                    day_number=day,
                    image=image_path
                )

            # 5. Return Response
            serializer = RoutePlanSerializer(route_plan)
            
            response_data = serializer.data
            response_data['events'] = events
            
            return Response(response_data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
