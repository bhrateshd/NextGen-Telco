#!/usr/bin/env python3
"""
Download real device product images from Unsplash API
Automatically saves images with optimized dimensions for web
"""

import os
import urllib.request
import json
from pathlib import Path

# Unsplash API endpoint (free, no auth key needed for basic usage)
UNSPLASH_API_URL = "https://api.unsplash.com/search/photos"
ACCESS_KEY = "34a79e0b69a0cff0d59d34e86ea0c935"  # Unsplash demo key

# Device list with search queries
DEVICES = {
    "device-iphone-15-pro.jpg": "iPhone 15 Pro product",
    "device-iphone-15.jpg": "iPhone 15 product",
    "device-samsung-s24-ultra.jpg": "Samsung Galaxy S24 Ultra product",
    "device-samsung-s24.jpg": "Samsung Galaxy S24 product",
    "device-pixel-8-pro.jpg": "Google Pixel 8 Pro product",
    "device-pixel-8.jpg": "Google Pixel 8 product",
    "device-motorola-edge-50.jpg": "Motorola Edge 50 product",
    "device-ipad-pro.jpg": "iPad Pro product",
}

# Image dimensions for web (optimize for display)
IMAGE_WIDTH = 400
IMAGE_HEIGHT = 600

def download_device_images():
    """Download device images from Unsplash"""
    images_dir = Path(__file__).parent / "frontend" / "images"
    images_dir.mkdir(parents=True, exist_ok=True)
    
    print(f"📱 Downloading device images to {images_dir}")
    print("-" * 60)
    
    for filename, search_query in DEVICES.items():
        try:
            # Build API URL with parameters
            url = f"{UNSPLASH_API_URL}?query={search_query}&client_id={ACCESS_KEY}&per_page=1&orientation=portrait"
            
            print(f"⏳ Downloading: {filename}")
            print(f"   Search: {search_query}")
            
            # Fetch JSON data
            req = urllib.request.Request(url)
            with urllib.request.urlopen(req) as response:
                data = json.loads(response.read().decode())
                
                if data['results']:
                    # Get the first result image
                    image_url = data['results'][0]['urls']['regular']
                    print(f"   URL: {image_url}")
                    
                    # Download with optimized size
                    optimized_url = f"{image_url}?w={IMAGE_WIDTH}&h={IMAGE_HEIGHT}&fit=crop&q=80"
                    
                    file_path = images_dir / filename
                    urllib.request.urlretrieve(optimized_url, file_path)
                    
                    print(f"   ✅ Saved to: {file_path}")
                else:
                    print(f"   ❌ No results found for '{search_query}'")
                    
        except Exception as e:
            print(f"   ❌ Error downloading {filename}: {str(e)}")
        
        print()
    
    print("-" * 60)
    print("✅ Download complete!")
    print(f"\nImages saved to: {images_dir}")
    print("\nNext steps:")
    print("1. Run: python update_html_with_jpg.py")
    print("2. Commit: git add frontend/images/*.jpg")
    print("3. Push: git push origin master")

if __name__ == "__main__":
    download_device_images()
