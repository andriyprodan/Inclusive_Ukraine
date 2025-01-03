from typing import Tuple


from places.models import Settlement
from settlements.geocoding import get_location_details
from settlements.models import District, Region


def process_settlement(lat, lon) -> Tuple[str, str]:
    """returns settlement and region"""
    location_data = get_location_details(lat, lon)

    region, _ = Region.objects.get_or_create(
        name=location_data['region']
    )

    district = None
    if location_data['district']:
        district, _ = District.objects.get_or_create(
            name=location_data['district'],
            region=region
        )

    if location_data['settlement']:
        settlement, _ = Settlement.objects.get_or_create(
            name=location_data['settlement'],
            district=district,
            region=region
        )
        settlement.bounds = location_data['settlement_bounds']
        settlement.save()
    else:
        # assign bounds to district
        district.bounds = location_data['district_bounds']
        district.save()
        settlement = None

    return settlement, district, location_data['address']
