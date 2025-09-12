# sell-your-ebook

Simple **landing page** with Stripe (link to buy.stripe.com product) connection to **sell your ebook**.

You will need a way for the ebook to be sent as per striper webhook.

> To actually create an ebook (with code), see [this other repo](https://github.com/JAlcocerT/ebooks) or the `./create_ebooks.sh` script and embrace Pandoc's magic.


✨ Acknowledgment

1. Thanks to: https://github.com/candidosales/landing-page-book-astro-tailwind and https://github.com/zenorocha/14habits.comfrom which this repo is based

>  MIT | Simple landing page to sell your book - Astro + Tailwind 

```sh
#git clone https://github.com/JAlcocerT/sell-your-ebook
#npm install
npm run dev -- --host 0.0.0.0 --port 4321 #http://192.168.1.11:4321/
#npm run build
#npm install -g serve #serve with npm
#serve -s dist #http://localhost:3000
```

## 🐳 Docker Setup

Complete containerized setup with Astro + Flask Config Editor:

### Quick Start Options

```sh
# Option 1: Just Astro development
make quick-dev
# Access at: http://localhost:4321

# Option 2: Just Astro production
make quick-prod  
# Access at: http://localhost:8090

# Option 3: Just Config Editor
make quick-config
# Access at: http://localhost:5000

# Option 4: Complete setup (Astro + Config Editor)
make quick-all
# Astro dev: http://localhost:4321
# Config editor: http://localhost:5000
```

### Development Commands

```sh
# Start all services (foreground)
make all

# Start complete dev stack in single container
make dev-stack

# View logs
make logs

# Stop all services
make stop

# Clean everything
make clean
```

## 📊 Analytics Configuration

The theme supports both **Google Analytics** and **Umami Analytics** with environment variable configuration:

### **Enable Umami Analytics:**
```sh
# Set environment variable to enable Umami
export UMAMI_ENABLED=true

# Or edit docker-compose.yml
environment:
  - UMAMI_ENABLED=true
```

### **Configure Analytics via Environment Variables:**
```sh
# Umami Analytics
UMAMI_ENABLED=false                                    # Enable/disable Umami
UMAMI_SCRIPT_URL=https://weban.fossengineer.com/script.js  # Your Umami script URL
UMAMI_WEBSITE_ID=9e00fc48-3897-4668-9298-09052dae5237     # Your website ID

# Google Analytics
GOOGLE_ANALYTICS_ENABLED=true                         # Enable/disable Google Analytics
GOOGLE_ANALYTICS_ID=G-9FXFDTDRH4                      # Your Google Analytics ID
```

### **Configure via Config Editor:**
1. Start the config editor: `make config-editor`
2. Navigate to http://localhost:5000
3. Edit the `analytics` section in config.json
4. Save changes

### **Example Analytics Configuration:**
```json
{
  "analytics": {
    "enabled": true,
    "googleAnalytics": {
      "enabled": true,
      "trackingId": "G-9FXFDTDRH4"
    },
    "umami": {
      "enabled": true,
      "scriptUrl": "https://weban.fossengineer.com/script.js",
      "websiteId": "9e00fc48-3897-4668-9298-09052dae5237"
    }
  }
}
```

> **See how I created this at [this post](https://jalcocert.github.io/JAlcocerT/ai-driven-ebooks/)**


<!-- https://youtu.be/XEFpzEIEDFc -->
[![Youtube Video](https://img.youtube.com/vi/XEFpzEIEDFc/0.jpg)](https://www.youtube.com/watch?v=XEFpzEIEDFc)

---

## 📚 Creating EPUB from Cover Image

You can create an EPUB file from the cover image (`cover-3-Ebook-SSGs.png`) using several methods:

**Method 1: Using Calibre (Recommended)**

```bash
# Install Calibre
sudo apt install calibre  # Ubuntu/Debian
# or download from https://calibre-ebook.com/

# Create HTML file first, then convert to EPUB
echo '<html><body><img src="cover-3-Ebook-SSGs.png" style="width:100%; height:auto;" /></body></html>' > book.html
ebook-convert book.html book.epub --cover=cover-3-Ebook-SSGs.png --title="Sell Your Ebook" --authors="Your Name"
```

**Method 2: Using Pandoc**

```bash
# Install pandoc
sudo apt install pandoc  # Ubuntu/Debian

# Create Markdown file first, then convert to EPUB
echo '# Sell Your Ebook\n\n![Cover](cover-3-Ebook-SSGs.png)' > book.md
pandoc book.md -o book.epub --epub-cover-image=cover-3-Ebook-SSGs.png --metadata title="Sell Your Ebook" --metadata author="Your Name"
```

**Method 3: Online Tools**

- **Sigil** (Free EPUB editor): https://sigil-ebook.com/
- **Calibre Web** (Online conversion)
- **EPUB generators** (Various online tools)

Method 4: Programmatic (Node.js)

```bash
# Install epub-gen
npm install epub-gen

# Create simple script
node -e "
const epub = require('epub-gen');
const options = {
  title: 'Sell Your Ebook',
  author: 'Your Name',
  cover: 'cover-3-Ebook-SSGs.png',
  content: [{ title: 'Cover', data: '<img src=\"cover-3-Ebook-SSGs.png\" />' }]
};
new epub(options).promise.then(() => console.log('EPUB created!'));
"
```

### Quick EPUB Creation

```bash
# Navigate to the public directory
cd landing-page-book-astro-tailwind/public

# Create HTML file with cover image
echo '<html><body><img src="cover-3-Ebook-SSGs.png" style="width:100%; height:auto;" /></body></html>' > book.html

# Convert to EPUB with cover
ebook-convert book.html ../sell-your-ebook.epub --cover=cover-3-Ebook-SSGs.png --title="Sell Your Ebook" --authors="Your Name"

# Clean up
rm book.html
```

Alternative: Simple Image-to-EPUB Script

```bash
# Create a simple script to automate the process
cat > create_epub.sh << 'EOF'
#!/bin/bash
cd landing-page-book-astro-tailwind/public
echo '<html><body><img src="cover-3-Ebook-SSGs.png" style="width:100%; height:auto;" /></body></html>' > book.html
ebook-convert book.html ../sell-your-ebook.epub --cover=cover-3-Ebook-SSGs.png --title="Sell Your Ebook" --authors="Your Name"
rm book.html
echo "EPUB created: sell-your-ebook.epub"
EOF

chmod +x create_epub.sh
./create_epub.sh
```

## 📄 Creating PDF from Cover Image

You can also create a PDF file from the cover image (`cover-3-Ebook-SSGs.png`) using several methods:

**Method 1: Using ImageMagick (Recommended)**

```bash
# Install ImageMagick
sudo apt install imagemagick  # Ubuntu/Debian

# Convert PNG to PDF
convert cover-3-Ebook-SSGs.png sell-your-ebook.pdf

# Or with specific settings
convert cover-3-Ebook-SSGs.png -quality 100 -density 300 sell-your-ebook.pdf
```

**Method 2: Using Calibre**

```bash
# Create HTML file first, then convert to PDF
echo '<html><body><img src="cover-3-Ebook-SSGs.png" style="width:100%; height:auto;" /></body></html>' > book.html
ebook-convert book.html sell-your-ebook.pdf --cover=cover-3-Ebook-SSGs.png --title="Sell Your Ebook" --authors="Your Name"
rm book.html
```

**Method 3: Using LibreOffice**

```bash
# Install LibreOffice
sudo apt install libreoffice  # Ubuntu/Debian

# Convert using LibreOffice (if you have the image in a document)
libreoffice --headless --convert-to pdf cover-3-Ebook-SSGs.png
```

**Method 4: Using Ghostscript**

```bash
# Install Ghostscript
sudo apt install ghostscript  # Ubuntu/Debian

# Convert PNG to PDF
gs -dNOPAUSE -dBATCH -sDEVICE=pdfwrite -sOutputFile=sell-your-ebook.pdf cover-3-Ebook-SSGs.png
```

### Quick PDF Creation

```bash
# Navigate to the public directory
cd landing-page-book-astro-tailwind/public

# Method 1: Direct conversion (simplest)
convert cover-3-Ebook-SSGs.png ../sell-your-ebook.pdf

# Method 2: With quality settings
convert cover-3-Ebook-SSGs.png -quality 100 -density 300 ../sell-your-ebook.pdf

# Method 3: Using Calibre (more control)
echo '<html><body><img src="cover-3-Ebook-SSGs.png" style="width:100%; height:auto;" /></body></html>' > book.html
ebook-convert book.html ../sell-your-ebook.pdf --cover=cover-3-Ebook-SSGs.png --title="Sell Your Ebook" --authors="Your Name"
rm book.html
```

### Combined EPUB + PDF Script

```bash
# Create a script that generates both EPUB and PDF
cat > create_ebooks.sh << 'EOF'
#!/bin/bash
cd landing-page-book-astro-tailwind/public

echo "Creating EPUB..."
echo '<html><body><img src="cover-3-Ebook-SSGs.png" style="width:100%; height:auto;" /></body></html>' > book.html
ebook-convert book.html ../sell-your-ebook.epub --cover=cover-3-Ebook-SSGs.png --title="Sell Your Ebook" --authors="Your Name"

echo "Creating PDF..."
convert cover-3-Ebook-SSGs.png -quality 100 -density 300 ../sell-your-ebook.pdf

rm book.html
echo "Both EPUB and PDF created successfully!"
echo "Files: sell-your-ebook.epub and sell-your-ebook.pdf"
EOF

chmod +x create_ebooks.sh
./create_ebooks.sh
```

## 🎨 Astro Config Editor (Flask)

A beautiful web interface to edit your `config.json` file, fully integrated with the Docker setup:

```sh
# Start just the config editor
make config-editor
# Access at: http://localhost:5000

# Or start everything together
make quick-all
# Astro: http://localhost:4321
# Config Editor: http://localhost:5000
```

**Features:**
- 🎨 Beautiful modern UI with Tailwind CSS
- 📝 Real-time JSON editing with syntax highlighting
- 💾 Automatic backups before saving
- 🔄 Restore from previous backups
- ⌨️ Keyboard shortcuts (Ctrl+S to save, Ctrl+R to reload)
- 📱 Responsive design for all devices
- 🐳 Fully containerized with Docker Compose