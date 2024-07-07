function convertToGrayScale(base64Image, point) {
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

      /// グレースケール変換
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);

      let binary = new cv.Mat();
      let binaryInv = new cv.Mat();
      cv.threshold(gray, binary, 0, 255, cv.THRESH_OTSU);
      cv.bitwise_not(binary, binaryInv);

      let contours = new cv.MatVector();
      let hierarchy = new cv.Mat();
      cv.findContours(
        binaryInv,
        contours,
        hierarchy,
        cv.RETR_EXTERNAL,
        cv.CHAIN_APPROX_SIMPLE
      );

      // Draw contours
      let dst = new cv.Mat(
        src.rows,
        src.cols,
        cv.CV_8UC3,
        new cv.Scalar(255, 255, 255)
      );
      console.log(contours);
      for (let i = 0; i < contours.size(); ++i) {
        let color = new cv.Scalar(255, 0, 0);
        cv.drawContours(
          dst,
          contours,
          i,
          color,
          point,
          cv.LINE_8,
          hierarchy,
          100
        );
      }

      // Create a new canvas element for the output
      let outputCanvas = document.createElement("canvas");
      outputCanvas.width = dst.cols;
      outputCanvas.height = dst.rows;
      cv.imshow(outputCanvas, dst);
      let dstBase64 = outputCanvas.toDataURL("image/png").split(",")[1];
      // Clean up
      src.delete();
      gray.delete();
      binary.delete();
      contours.delete();
      hierarchy.delete();
      dst.delete();
      resolve(dstBase64);
    };
    img.onerror = reject;
  });
}
