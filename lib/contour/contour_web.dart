@JS()
library my_javascript;

import 'dart:convert';
import 'dart:typed_data';

import 'package:js/js.dart';
import 'package:js/js_util.dart';

@JS('convertToGrayScale')
external Object convertToGrayScale(String base64Image, num thickness);

Future<Uint8List> generateContourImage(Uint8List src) async {
  final srcBase64 = base64Encode(src.buffer.asUint8List());
  final tmpBase64 = await promiseToFuture(convertToGrayScale(srcBase64, 50));
  final greyBase64 = await promiseToFuture(convertToGrayScale(tmpBase64, 10));
  return base64Decode(greyBase64);
}
