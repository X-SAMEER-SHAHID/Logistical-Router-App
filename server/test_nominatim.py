import requests

url = "https://nominatim.openstreetmap.org/search"
params = {'q': 'Los Angeles', 'format': 'json', 'limit': 1}
headers = {'User-Agent': 'LogisticalRouterApp/1.0 (test@example.com)'}
resp = requests.get(url, params=params, headers=headers)
print(resp.status_code)
print(resp.json())
