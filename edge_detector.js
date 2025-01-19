// Get the canvas and upload input elements
const canvas = document.getElementById("canvas");
const uploadInput = document.getElementById("upload");

// Handle image upload
uploadInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) {
    alert("Please select an image file.");
    return;
  }

  // Create an image object and load the uploaded file
  const img = new Image();
  const reader = new FileReader();

  // Load the image file into the image object
  reader.onload = (e) => {
    img.src = e.target.result;
    
    img.onload = () => {
      // Draw the uploaded image on the canvas
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Convert the image on the canvas into a MarvinImage
      const image = new MarvinImage();
      image.load(canvas.toDataURL(), () => {
        const imageOut = new MarvinImage(image.getWidth(), image.getHeight());

        // Apply edge detection using Prewitt
        Marvin.prewitt(image, imageOut);

        // Invert colors
        Marvin.invertColors(imageOut, imageOut);

        // Apply threshold
        Marvin.thresholding(imageOut, imageOut, 220);

        // Draw the processed image back to the canvas
        imageOut.draw(canvas);

        // Extract the coordinates of edges
        const edgeCoordinates = [];
        for (let y = 0; y < imageOut.getHeight(); y++) {
          for (let x = 0; x < imageOut.getWidth(); x++) {
            // Get pixel color (check for edge pixels based on intensity)
            const pixel = imageOut.getIntColor(x, y);
            const brightness = (pixel >> 16) & 0xff; // Extract red component (grayscale image)
            
            // If brightness is above the threshold, it's an edge
            if (brightness < 50) { // Threshold value
              edgeCoordinates.push([x, y]);
            }
          }
        }

        globalThis.outputPath = edgeCoordinates;
        globalThis.uploadedImageWidth = image.getWidth();
        globalThis.uploadedImageHeight = image.getHeight();
        
        // globalThis.outputPath = edgeCoordinates.filter((_, index) => index % sliceStep === 0);
        console.log(globalThis.outputPath);
        globalThis.beginAnimation = true;
      });
    };
  };

  // Read the file as a data URL
  reader.readAsDataURL(file);
});