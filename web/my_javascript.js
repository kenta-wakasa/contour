function convertToGrayScale(base64Image) {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.src = "data:image/png;base64," + base64Image;
    img.onload = function () {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);
      let src = cv.imread(canvas);
      let gray = new cv.Mat();
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);

      // Create a new canvas element for the output
      let outputCanvas = document.createElement("canvas");
      outputCanvas.width = gray.cols;
      outputCanvas.height = gray.rows;
      cv.imshow(outputCanvas, gray);
      let grayBase64 = outputCanvas.toDataURL("image/png").split(",")[1];
      src.delete();
      gray.delete();
      resolve(grayBase64);
    };
    img.onerror = reject;
  });
}
