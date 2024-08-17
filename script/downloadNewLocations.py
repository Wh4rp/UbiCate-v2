import requests
import json
import os
from dotenv import load_dotenv 

load_dotenv()
POCKETBASE_URL = os.environ.get('POCKETBASE_URL')


def fetch_data_from_pocketbase(url):
    response = requests.get(url)
    response.raise_for_status()
    return response.json()

def convert_to_geojson(data):
    features = []
    for record in data['items']:  # Adjust if your Pocketbase data structure is different
        # Example assumes records have 'latitude' and 'longitude' fields
        feature = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [record['longitude'], record['latitude']]
            },
            "properties": {
                "information": record['information'],
                "name": record['name'],
                "floor": record['floor'],
            }
        }
        features.append(feature)
    
    geojson = {
        "type": "FeatureCollection",
        "features": features
    }
    return geojson

def save_geojson_to_file(geojson, filename):
    with open(filename, 'w') as f:
        json.dump(geojson, f, indent=4)

def main():
    print(f"Fetching data from {POCKETBASE_URL}")
    data = fetch_data_from_pocketbase(POCKETBASE_URL)
    
    
    geojson = convert_to_geojson(data)
    save_geojson_to_file(geojson, 'script/newLocations.json')
    #print(f"Data has been saved to {GEOJSON_FILE}")

if __name__ == "__main__":
    main()
