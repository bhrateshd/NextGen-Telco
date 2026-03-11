#!/usr/bin/env python3
"""
Update HTML files to use JPG images instead of SVG mockups
This script automatically replaces all device image references
"""

import re
from pathlib import Path

# Mapping of SVG files to JPG files
SVG_TO_JPG_MAP = {
    "device-iphone-pro.svg": "device-iphone-15-pro.jpg",
    "device-iphone.svg": "device-iphone-15.jpg",
    "device-samsung-ultra.svg": "device-samsung-s24-ultra.jpg",
    "device-samsung.svg": "device-samsung-s24.jpg",
    "device-pixel-pro.svg": "device-pixel-8-pro.jpg",
    "device-pixel.svg": "device-pixel-8.jpg",
}

def update_html_files():
    """Update HTML files to use JPG images"""
    
    # Find all HTML files
    html_files = [
        Path("frontend/index.html"),
        Path("frontend/devices.html"),
    ]
    
    print("🖼️  Updating HTML files to use JPG images")
    print("-" * 60)
    
    for html_file in html_files:
        if not html_file.exists():
            print(f"⚠️  File not found: {html_file}")
            continue
        
        print(f"📝 Processing: {html_file}")
        
        # Read file
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Replace each SVG reference with JPG
        for svg_file, jpg_file in SVG_TO_JPG_MAP.items():
            pattern = f'src="images/{svg_file}"'
            replacement = f'src="images/{jpg_file}"'
            
            if pattern in content:
                count = content.count(pattern)
                content = content.replace(pattern, replacement)
                print(f"   ✅ Replaced {count}x: {svg_file} → {jpg_file}")
        
        # Write back if changed
        if content != original_content:
            with open(html_file, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"   💾 Saved {html_file}")
        else:
            print(f"   ⓘ No changes needed")
        
        print()
    
    print("-" * 60)
    print("✅ HTML update complete!")
    print("\nNext steps:")
    print("1. Verify images display correctly in browser")
    print("2. Commit changes: git add frontend/")
    print("3. Push to repo: git push origin master")

if __name__ == "__main__":
    update_html_files()
