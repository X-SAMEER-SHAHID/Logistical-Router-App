from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import json
import os

from .models import TripRequest, RoutePlan
from .serializers import RoutePlanSerializer
from .utils.routing import get_full_route
from .utils.hos_calculator import HOSCalculator
from rest_framework.permissions import IsAuthenticated
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView

class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    callback_url = 'https://logistical-router-app.vercel.app'
    client_class = OAuth2Client

class MyTripsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        trips = TripRequest.objects.filter(user=request.user).order_by('-created_at')
        # We can just serialize the trips and their related route plans
        data = []
        for trip in trips:
            route = trip.route_plans.first()
            data.append({
                'id': trip.id,
                'pickup_loc': trip.pickup_loc,
                'dropoff_loc': trip.dropoff_loc,
                'created_at': trip.created_at,
                'total_distance': route.total_distance if route else 0,
                'total_duration': route.total_duration if route else 0,
            })
        return Response(data, status=status.HTTP_200_OK)

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
            trip_request = TripRequest(
                current_loc=current_loc,
                pickup_loc=pickup_loc,
                dropoff_loc=dropoff_loc,
                current_cycle_used=current_cycle_used
            )
            if request.user.is_authenticated:
                trip_request.user = request.user
            trip_request.save()

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

            # 4. Return Response
            serializer = RoutePlanSerializer(route_plan)
            
            response_data = serializer.data
            response_data['events'] = events
            
            return Response(response_data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TripDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            trip = TripRequest.objects.get(pk=pk, user=request.user)
            route = trip.route_plans.first()
            if not route:
                return Response({"error": "Route plan not found"}, status=status.HTTP_404_NOT_FOUND)

            # Recalculate HOS events
            hos = HOSCalculator(trip.current_cycle_used)
            events = hos.process_trip(route.total_distance, route.total_duration)

            serializer = RoutePlanSerializer(route)
            response_data = serializer.data
            response_data['events'] = events
            
            # also inject trip data if needed
            response_data['pickup_loc'] = trip.pickup_loc
            response_data['dropoff_loc'] = trip.dropoff_loc

            return Response(response_data, status=status.HTTP_200_OK)
        except TripRequest.DoesNotExist:
            return Response({"error": "Trip not found"}, status=status.HTTP_404_NOT_FOUND)
