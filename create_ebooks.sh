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
