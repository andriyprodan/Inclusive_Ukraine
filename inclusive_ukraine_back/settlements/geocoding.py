# geocoding.py
import googlemaps
from django.conf import settings

# Ініціалізація клієнта Google Maps
gmaps = googlemaps.Client(key=settings.GOOGLE_MAPS_API_KEY)

def get_location_details(lat, lon):
    # Виконання запиту до Geocoding API
    result = gmaps.reverse_geocode((lat, lon), language='uk')
    
    if result:
        # address = result[0].get('formatted_address', 'Адреса не знайдена')
        # components = result[0].get('address_components', [])
        
        # Виділяємо потрібні частини адреси
        settlement = None
        district = None
        region = None
        settlement_bounds = None
        district_bounds = None
        address = None
        
        for item in result:
            for component in item['address_components']:
                if not settlement and ('locality' in component['types']):
                    settlement = component['long_name']
                if not district and ('administrative_area_level_2' in component['types']):
                    district = component['long_name']
                if not region and ('administrative_area_level_1' in component['types']):
                    region = component['long_name']

            if not settlement_bounds and ('locality' in item['types']):
                # get bounds of the city
                settlement_bounds = item.get('geometry', {}).get('bounds', {})
            # get bounds of the district
            if not district_bounds and ('administrative_area_level_2' in item['types']):
                district_bounds = item.get('geometry', {}).get('bounds', {})

        address = result[0].get('formatted_address', 'Адреса не знайдена')
        
        return {
            # 'address': address,
            'settlement': settlement,
            'district': district,
            'region': region,
            'settlement_bounds': settlement_bounds,
            'district_bounds': district_bounds,
            'address': address
        }
    return None
