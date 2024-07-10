import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:js/js_util.dart';

import 'js/my_javascript.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const MyHomePage(title: 'Flutter Demo Home Page'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});
  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  Uint8List? grey;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: Text(widget.title),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () async {
                final imageBytes =
                    await rootBundle.load('assets/flutter_logo.png');
                final srcBase64 = base64Encode(imageBytes.buffer.asUint8List());
                final tmpBase64 =
                    await promiseToFuture(convertToGrayScale(srcBase64, 50));
                final greyBase64 =
                    await promiseToFuture(convertToGrayScale(tmpBase64, 5));
                grey = base64Decode(greyBase64);
                setState(() {});
              },
              child: const Text('変換'),
            ),
            const SizedBox(height: 16),
            SizedBox(
              width: 120,
              height: 120,
              child: Image.asset('assets/flutter_logo.png'),
            ),
            const SizedBox(height: 16),
            if (grey != null)
              SizedBox(
                width: 120,
                height: 120,
                child: Image.memory(grey!),
              ),
          ],
        ),
      ),
    );
  }
}
