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
import requests as http_requests
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class GoogleLoginView(APIView):
    """Custom Google login that handles Google Identity Services JWT tokens."""
    
    def post(self, request):
        credential = request.data.get('id_token') or request.data.get('access_token')
        
        if not credential:
            return Response(
                {"error": "No Google credential provided"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Verify the token with Google's tokeninfo endpoint
            google_response = http_requests.get(
                f'https://oauth2.googleapis.com/tokeninfo?id_token={credential}'
            )
            
            if google_response.status_code != 200:
                return Response(
                    {"error": "Invalid Google token"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            google_data = google_response.json()
            
            # Verify the token is for our app
            expected_client_id = os.environ.get('GOOGLE_CLIENT_ID', '').strip()
            if google_data.get('aud') != expected_client_id:
                return Response(
                    {"error": "Token not intended for this app"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            email = google_data.get('email')
            if not email:
                return Response(
                    {"error": "No email in Google token"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get or create user
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'username': email,
                    'first_name': google_data.get('given_name', ''),
                    'last_name': google_data.get('family_name', ''),
                }
            )
            
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            
            response = Response({
                'user': {
                    'pk': user.pk,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                },
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }, status=status.HTTP_200_OK)
            
            # Set JWT cookies (matching dj-rest-auth cookie settings)
            response.set_cookie(
                'auth_cookie',
                str(refresh.access_token),
                httponly=True,
                samesite='None',
                secure=True,
                max_age=3600,
            )
            response.set_cookie(
                'refresh_cookie',
                str(refresh),
                httponly=True,
                samesite='None',
                secure=True,
                max_age=7 * 24 * 3600,
            )
            
            return response
            
        except Exception as e:
            return Response(
                {"error": f"Google authentication failed: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

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
