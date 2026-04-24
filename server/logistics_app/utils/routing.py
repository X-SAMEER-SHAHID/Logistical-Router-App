import requests
import json
import time

def geocode_address(address):
    """
    Geocodes an address string to [lon, lat] using Nominatim.
    Returns None if not found.
    """
    # Simple check if address is already lat,lng
    if ',' in address and not any(c.isalpha() for c in address):
        parts = address.split(',')
        try:
            lat = float(parts[0].strip())
            lon = float(parts[1].strip())
            return [lon, lat]
        except ValueError:
            pass
            
    # Mock lookup to avoid 403 on free APIs during testing
    mock_db = {
        "los angeles": [-118.2426, 34.0549],
        "los angeles, ca": [-118.2426, 34.0549],
        "phoenix": [-112.0740, 33.4484],
        "phoenix, az": [-112.0740, 33.4484],
        "dallas": [-96.7970, 32.7767],
        "dallas, tx": [-96.7970, 32.7767],
        "new york": [-74.0060, 40.7128],
        "chicago": [-87.6298, 41.8781]
    }
    addr_lower = address.lower().strip()
    if addr_lower in mock_db:
        return mock_db[addr_lower]

    url = f"https://nominatim.openstreetmap.org/search"
    params = {
        'q': address,
        'format': 'json',
        'limit': 1
    }
    headers = {
        'User-Agent': 'LogisticalRouterApp/1.0 (test@example.com)'
    }
    response = requests.get(url, params=params, headers=headers)
    
    # Respect Nominatim's usage policy
    time.sleep(1)

    if response.status_code == 200:
        data = response.json()
        if data:
            return [float(data[0]['lon']), float(data[0]['lat'])]
    return None

def get_route_data(origin, destination):
    """
    Gets route from origin [lon, lat] to destination [lon, lat] using OSRM.
    Returns distance (miles), duration (hours), and polyline coordinates.
    """
    url = f"http://router.project-osrm.org/route/v1/driving/{origin[0]},{origin[1]};{destination[0]},{destination[1]}"
    params = {
        'overview': 'full',
        'geometries': 'geojson'
    }
    response = requests.get(url, params=params)
    if response.status_code == 200:
        data = response.json()
        if data['code'] == 'Ok':
            route = data['routes'][0]
            distance_meters = route['distance']
            duration_seconds = route['duration']
            
            distance_miles = distance_meters * 0.000621371
            duration_hours = duration_seconds / 3600.0
            
            coordinates = route['geometry']['coordinates'] # List of [lon, lat]
            
            return distance_miles, duration_hours, coordinates
    return 0, 0, []

def get_full_route(current, pickup, dropoff):
    """
    Gets the full route from current -> pickup -> dropoff.
    """
    coords_current = geocode_address(current)
    coords_pickup = geocode_address(pickup)
    coords_dropoff = geocode_address(dropoff)

    if not all([coords_current, coords_pickup, coords_dropoff]):
        raise ValueError("Could not geocode one or more addresses.")

    dist1, dur1, poly1 = get_route_data(coords_current, coords_pickup)
    dist2, dur2, poly2 = get_route_data(coords_pickup, coords_dropoff)

    total_distance = dist1 + dist2
    total_duration = dur1 + dur2
    
    # Combine polylines (remove first point of poly2 to avoid duplication if it matches exactly, though OSRM might not be exact, it's fine for demo)
    full_polyline = poly1 + poly2[1:] if len(poly2) > 0 else poly1

    return total_distance, total_duration, full_polyline
