const webp = require("webp-converter");
const fs = require('fs');
const path = require('path');

// Convert images
// loop through images folder, go in subfolders, convert all images to webp

// Get all folders in images folder
async function convertImages(folder) {
    // Get all files and subfolders in the current folder
    const files = fs.readdirSync(folder);
  
    // Loop through all files and subfolders
    for (const file of files) {
      const filePath = path.join(folder, file);
  
        // If the file is a directory, call the function recursively
        if (fs.statSync(filePath).isDirectory()) {
            await convertImages(filePath);
        } else {
            // If the file is an image, convert it to WebP format
            if (path.extname(filePath).toLowerCase() === '.jpg' || path.extname(filePath).toLowerCase() === '.jpeg' || path.extname(filePath).toLowerCase() === '.png') {
                const webpPath = filePath.replace(/\.[^/.]+$/, ".webp");
                await webp.cwebp(filePath, webpPath, "-q 80");
                fs.rmSync(filePath);
                console.log('Converted ' + filePath)
            }
        }
    }
}

convertImages(path.resolve(__dirname, '..', 'public', 'images'));