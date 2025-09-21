import google.generativeai as genai
from PIL import Image
from PIL.ExifTags import TAGS, GPSTAGS
import os
from dotenv import load_dotenv
import json
import requests

# Load environment variables from .env
load_dotenv()

# Configure your Gemini API key
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

def get_exif_data(image_path):
    """Extract EXIF data from image"""
    try:
        with Image.open(image_path) as img:
            exif_data = img._getexif()
            if exif_data:
                exif = {}
                for tag_id, value in exif_data.items():
                    tag = TAGS.get(tag_id, tag_id)
                    exif[tag] = value
                return exif
            else:
                return None
    except Exception:
        return None

def extract_gps_info(exif_data):
    """Extract GPS information from EXIF data"""
    if not exif_data or 'GPSInfo' not in exif_data:
        return None
    
    gps_info = {}
    for key, value in exif_data['GPSInfo'].items():
        tag = GPSTAGS.get(key, key)
        gps_info[tag] = value
    
    return gps_info

def convert_gps_to_decimal(gps_value, ref):
    """Convert GPS coordinates to decimal format"""
    try:
        degrees, minutes, seconds = gps_value
        decimal = float(degrees) + (float(minutes) / 60.0) + (float(seconds) / 3600.0)
        
        if ref in ['S', 'W']:
            decimal = -decimal
        
        return round(decimal, 6)
    except:
        return None

def get_location_and_date(image_path):
    """Extract GPSDateStamp and Google Maps location link"""
    if not os.path.exists(image_path):
        return {"GPSDateStamp": "null", "Location": "null"}

    exif_data = get_exif_data(image_path)
    if not exif_data:
        return {"GPSDateStamp": "null", "Location": "null"}

    gps_data = extract_gps_info(exif_data)
    if not gps_data:
        return {"GPSDateStamp": "null", "Location": "null"}

    # GPS Date Stamp
    gps_date = gps_data.get('GPSDateStamp', 'null')

    # Coordinates
    latitude = None
    longitude = None
    google_maps = "null"

    if 'GPSLatitude' in gps_data and 'GPSLatitudeRef' in gps_data:
        latitude = convert_gps_to_decimal(gps_data['GPSLatitude'], gps_data['GPSLatitudeRef'])

    if 'GPSLongitude' in gps_data and 'GPSLongitudeRef' in gps_data:
        longitude = convert_gps_to_decimal(gps_data['GPSLongitude'], gps_data['GPSLongitudeRef'])

    if latitude and longitude:
        google_maps = f"https://www.google.com/maps?q={latitude},{longitude}"

    return {
        "GPSDateStamp": gps_date,
        "Location": google_maps
    }

def classify_image(image_path, model_name="gemini-1.5-flash"):
    """Send image to Gemini for classification"""
    model = genai.GenerativeModel(model_name)

    with open(image_path, "rb") as f:
        image_bytes = f.read()

    parts = [
        {"text": "Does this image show a pothole or garbage? If yes, reply only with 'pothole' or 'garbage'. If no, return null."},
        {"inline_data": {"mime_type": "image/jpeg", "data": image_bytes}}
    ]

    response = model.generate_content(parts)
    return response.text.strip()

def send_to_backend(json_data, url="http://10.10.14.18:3000/api/issue"):
    """Send JSON data to backend"""
    try:
        response = requests.post(url, json=json_data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        return response
    except Exception as e:
        print(f"Error sending data: {e}")
        return None

def analyze_image(image_path, model_name="gemini-1.5-flash"):
    """Full pipeline: classification + GPSDateStamp + Location + send to backend"""
    classification = classify_image(image_path, model_name)
    location_data = get_location_and_date(image_path)

    # Final Output - Clean formatting
    result = {
        "GPSDateStamp": location_data['GPSDateStamp'],
        "Classification": classification,
        "Location": location_data['Location']
    }

    # Print result
    print("\n--- Image Analysis Result ---")
    print(json.dumps(result, indent=2))
    print("--- End of Result ---\n")

    # Save to JSON file
    output_dir = os.path.join(os.path.dirname(__file__), 'output')
    os.makedirs(output_dir, exist_ok=True)
    json_path = os.path.join(output_dir, "output.json")

    with open(json_path, "w") as f:
        json.dump(result, f, indent=2)

    print(f"Output saved to: {json_path}")

    # Send to backend
# send_to_backend(...) removed for local integration
    return result

# Example usage
if __name__ == "__main__":
    image_path = r"C:\Users\Aaryan\Downloads\pothole_2.jpg"   # pothole image from downloads folder
    analyze_image(image_path)
