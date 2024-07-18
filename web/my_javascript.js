function convertToGrayScale(base64Image, thickness) {
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

      // // 元の画像がRGBAフォーマットであることを確認（src）
      // // 新しいMatオブジェクトを作成し、透明部分を白色に置き換える
      // // 新しい白い背景画像を作成
      // let whiteBgImage = new cv.Mat(
      //   src.rows,
      //   src.cols,
      //   src.type(),
      //   new cv.Scalar(255, 255, 255, 255)
      // );

      // // srcの各ピクセルにアクセスし、透明度をチェック
      // for (let y = 0; y < src.rows; y++) {
      //   for (let x = 0; x < src.cols; x++) {
      //     let pixel = src.ucharPtr(y, x); // RGBAの値を取得
      //     let alpha = pixel[3]; // アルファチャンネルの値

      //     if (alpha !== 0) {
      //       // アルファ値が0でない場合、元のピクセル値をコピー
      //       whiteBgImage.ucharPtr(y, x)[0] = pixel[0]; // R
      //       whiteBgImage.ucharPtr(y, x)[1] = pixel[1]; // G
      //       whiteBgImage.ucharPtr(y, x)[2] = pixel[2]; // B
      //       whiteBgImage.ucharPtr(y, x)[3] = pixel[3]; // アルファ
      //     }
      //   }
      // }

      // グレースケール変換
      let gray = new cv.Mat();
      cv.cvtColor(src, gray, cv.COLOR_RGB2GRAY, 0);

      // 使用後のMatオブジェクトを解放
      // whiteBgImage.delete();

      let binary = new cv.Mat();
      // let binaryInv = new cv.Mat();
      cv.threshold(gray, binary, 0, 255, cv.THRESH_OTSU);
      // cv.bitwise_not(binary, binaryInv);

      let contours = new cv.MatVector();
      let hierarchy = new cv.Mat();
      cv.findContours(
        binary,
        contours,
        hierarchy,
        cv.RETR_EXTERNAL,
        cv.CHAIN_APPROX_SIMPLE
      );

      // Draw contours
      let dst = new cv.Mat(
        src.rows,
        src.cols,
        cv.CV_8UC4,
        new cv.Scalar(255, 255, 255, 0)
      );
      for (let i = 0; i < contours.size(); ++i) {
        let contour = contours.get(i);
        let pathData = createSVGPath(contour);
        console.log(pathData);
        let color = new cv.Scalar(255, 0, 0, 255);
        cv.drawContours(
          dst,
          contours,
          i,
          color,
          thickness,
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
      // binary.delete();
      contours.delete();
      hierarchy.delete();
      dst.delete();
      resolve(dstBase64);
    };
    img.onerror = reject;
  });
}

function createSVGPath(contour) {
  let pathData = "M";
  for (let i = 0; i < contour.data32S.length; i += 2) {
    let x = contour.data32S[i];
    let y = contour.data32S[i + 1];
    pathData += `${x},${y} `;
  }
  pathData += "Z";
  return pathData;
}
