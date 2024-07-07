@JS()
library my_javascript;

import 'package:js/js.dart';

@JS('convertToGrayScale')
external Object convertToGrayScale(String base64Image, num point);
