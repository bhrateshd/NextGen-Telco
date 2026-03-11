# Device Images - Download & Setup Guide

## 📱 Devices to Download

All devices are used in your project. Here's what you need:

### Apple iPhones (2 devices)
```
✓ iPhone 15 Pro
✓ iPhone 15
```

### Samsung Galaxy (2 devices)
```
✓ Samsung Galaxy S24 Ultra
✓ Samsung Galaxy S24
```

### Google Pixel (2 devices)
```
✓ Google Pixel 8 Pro
✓ Google Pixel 8
```

### Other Devices (2 devices)
```
✓ Motorola Edge 50
✓ iPad Pro
```

**Total: 8 device images needed**

---

## 🚀 Automated Setup (Recommended)

### Step 1: Run Download Script
```bash
cd ~/NextGen-Telco
python3 download_device_images.py
```

This script will:
- Search Unsplash for each device
- Download high-quality product images
- Optimize dimensions (400x600px)
- Save to `frontend/images/` directory
- Create these files:
  - `device-iphone-15-pro.jpg`
  - `device-iphone-15.jpg`
  - `device-samsung-s24-ultra.jpg`
  - `device-samsung-s24.jpg`
  - `device-pixel-8-pro.jpg`
  - `device-pixel-8.jpg`
  - `device-motorola-edge-50.jpg`
  - `device-ipad-pro.jpg`

### Step 2: Update HTML Files
```bash
python3 update_html_with_jpg.py
```

This script will:
- Replace all SVG references with JPG
- Update `frontend/index.html` (3 devices)
- Update `frontend/devices.html` (8 devices)
- Preserve all other HTML structure

### Step 3: Verify & Commit
```bash
# View the changes
git status

# Check images are there
ls -lh frontend/images/device-*.jpg

# Commit
git add frontend/
git commit -m "Add real device product images from Unsplash"
git push origin master
```

---

## 📥 Manual Setup (Alternative)

If the automated script doesn't work, follow these steps:

### Option A: Download from Unsplash.com
1. Go to **unsplash.com**
2. Search for each device name:
   - "iPhone 15 Pro product"
   - "iPhone 15 product"
   - etc.
3. Download high-resolution version
4. Save to: `frontend/images/device-[name].jpg`

### Option B: Download from Pexels.com
1. Go to **pexels.com**
2. Search for device models
3. Download & save to `frontend/images/`

### Option C: Use Manufacturer Images
- **Apple**: images.apple.com (official product images)
- **Samsung**: samsung.com/us/business (product photography)
- **Google**: store.google.com (Pixel product images)

---

## 📐 Image Requirements

For optimal website performance:

| Property | Value |
|----------|-------|
| **Format** | JPG |
| **Width** | 400-500 px |
| **Height** | 600-700 px |
| **Aspect Ratio** | 2:3 (portrait) |
| **File Size** | 100-300 KB each |
| **Quality** | 80% (high quality) |
| **Background** | White or clean |

---

## 🔧 What Gets Updated

### HTML Changes

**Before:**
```html
<img src="images/device-iphone.svg" alt="iPhone 15" class="device-image">
```

**After:**
```html
<img src="images/device-iphone-15.jpg" alt="iPhone 15" class="device-image">
```

### CSS (No Changes Needed)
The CSS already supports JPG images:
```css
.device-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 2rem 1rem;
}
```

---

## 📂 Final Directory Structure

```
NextGen-Telco/
├── frontend/
│   ├── images/
│   │   ├── logo.svg                    ← Keep (branding)
│   │   ├── hero-bg.svg                 ← Keep (background)
│   │   ├── icon-*.svg                  ← Keep (benefit icons)
│   │   ├── device-iphone-15-pro.jpg    ← ADD
│   │   ├── device-iphone-15.jpg        ← ADD
│   │   ├── device-samsung-s24-ultra.jpg ← ADD
│   │   ├── device-samsung-s24.jpg      ← ADD
│   │   ├── device-pixel-8-pro.jpg      ← ADD
│   │   ├── device-pixel-8.jpg          ← ADD
│   │   ├── device-motorola-edge-50.jpg ← ADD
│   │   ├── device-ipad-pro.jpg         ← ADD
│   │   ├── device-*.svg                ← REMOVE (old mockups)
│   ├── index.html                      ← UPDATE
│   ├── devices.html                    ← UPDATE
│   └── ... other files
```

---

## ✅ Verification Checklist

After running the scripts:

- [ ] 8 JPG files are in `frontend/images/`
- [ ] Each JPG is 100-300 KB
- [ ] `index.html` has JPG references for 3 devices
- [ ] `devices.html` has JPG references for 8 devices
- [ ] Old SVG device images can be deleted
- [ ] Website displays device photos correctly
- [ ] Images load quickly (< 1s)
- [ ] Changes are committed to git

---

## 🐛 Troubleshooting

### Images Not Showing
```bash
# Check if files exist
ls -la frontend/images/device-*.jpg

# Check file permissions
chmod 644 frontend/images/device-*.jpg

# Clear browser cache
# Press: Ctrl+Shift+Delete (or Cmd+Shift+Delete)
```

### Script Errors
```bash
# Make scripts executable
chmod +x download_device_images.py
chmod +x update_html_with_jpg.py

# Run with Python 3 explicitly
python3 download_device_images.py
python3 update_html_with_jpg.py
```

### Image Quality Issues
```bash
# Re-download with better quality
# Edit download_device_images.py line 28:
# Change: q=80  →  q=90
```

---

## 📊 Page Coverage

### Homepage (index.html)
- iPhone 15
- Samsung Galaxy S24
- Google Pixel 8

### Devices Shop (devices.html)
- iPhone 15 Pro
- iPhone 15
- Samsung Galaxy S24 Ultra
- Samsung Galaxy S24
- Google Pixel 8 Pro
- Google Pixel 8
- Motorola Edge 50 (text placeholder, add image)
- iPad Pro (text placeholder, add image)

---

## 🎯 Next Steps

1. **Run the download script:**
   ```bash
   python3 download_device_images.py
   ```

2. **Run the update script:**
   ```bash
   python3 update_html_with_jpg.py
   ```

3. **Verify in browser:**
   - Open `http://localhost/` (if running locally)
   - Check homepage devices display
   - Check devices shop page

4. **Commit to git:**
   ```bash
   git add frontend/images/device-*.jpg frontend/*.html
   git commit -m "Replace SVG mockups with real device product images"
   git push origin master
   ```

---

## 💡 Tips

- Download images in **batches** (2-3 at a time)
- Save with **consistent naming** (matches script expectations)
- Test in **multiple browsers** (Chrome, Firefox, Safari)
- Commit with a **clear message**
- Keep **SVG icons** (they're lightweight and perfect for logos)

---

**Ready? Start with:** `python3 download_device_images.py` 🚀
