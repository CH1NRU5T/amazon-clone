// ignore_for_file: use_build_context_synchronously

import 'dart:convert';
import 'dart:io';

import 'package:amazon_clone/constants/global_variables.dart';
import 'package:amazon_clone/constants/utils.dart';
import 'package:amazon_clone/models/product.dart';
import 'package:cloudinary/cloudinary.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';

import '../../../constants/error_handling.dart';
import '../../../providers/user_provider.dart';

class AdminServices {
  // get all products
  Future<List<Product>> fetchAllProducts(BuildContext context) async {
    List<Product> products = [];
    try {
      var userProvider = Provider.of<UserProvider>(context, listen: false);
      http.Response res = await http.get(
        Uri.parse('$uri/admin/get-products'),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
          'x-auth-token': userProvider.user.token,
        },
      );
      httpErrorHandle(
          response: res,
          context: context,
          onSuccess: () {
            for (int i = 0; i < jsonDecode(res.body).length; i++) {
              products.add(
                Product.fromJson(
                  jsonEncode(jsonDecode(res.body)[i]),
                ),
              );
            }
          });
    } catch (e) {
      showSnackBar(context, e.toString());
    }
    return products;
  }

  void sellProduct(
      {required BuildContext context,
      required String name,
      required String description,
      required double price,
      required double quantity,
      required String category,
      required List<File> images}) async {
    final user = Provider.of<UserProvider>(context, listen: false);
    try {
      final cloudinary = Cloudinary.unsignedConfig(
        cloudName: dotenv.env['CLOUDNAME']!,
      );
      List<String> imageUrls = [];

      for (var image in images) {
        CloudinaryResponse res = await cloudinary.unsignedUpload(
          uploadPreset: dotenv.env['UPLOADPRESET']!,
          file: image.path,
          folder: name,
          resourceType: CloudinaryResourceType.image,
        );
        imageUrls.add(res.secureUrl!);
      }

      Product product = Product(
        name: name,
        description: description,
        price: price,
        quantity: quantity,
        category: category,
        images: imageUrls,
      );

      http.Response res = await http.post(
        Uri.parse('$uri/admin/add-product'),
        body: product.toJson(),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
          'x-auth-token': user.user.token,
        },
      );

      httpErrorHandle(
        response: res,
        context: context,
        onSuccess: () {
          showSnackBar(context, 'Product added successfully');
          Navigator.pop(context);
        },
      );
    } catch (e) {
      showSnackBar(context, e.toString());
    }
  }

  void deleteProduct(
      {required BuildContext context,
      required Product product,
      required VoidCallback onSuccess}) async {
    http.Response res = await http.post(
      Uri.parse('$uri/admin/delete-product'),
      body: jsonEncode({'id': product.id}),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
        'x-auth-token':
            Provider.of<UserProvider>(context, listen: false).user.token,
      },
    );
    final cloudinary = Cloudinary.unsignedConfig(
      cloudName: dotenv.env['CLOUDNAME']!,
    );
    for (var image in product.images) {
      String name = image.split('/')[image.split('/').length - 2];
      String id = image.split('/').last.split('.').first;
      CloudinaryResponse res = await cloudinary.destroy('$name/$id');
      if (!res.isSuccessful) {
        showSnackBar(context, 'Error deleting image');
      }
    }

    httpErrorHandle(
        response: res,
        context: context,
        onSuccess: () {
          onSuccess();
        });
  }
}
