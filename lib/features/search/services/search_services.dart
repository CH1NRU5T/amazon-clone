import 'dart:convert';

import 'package:amazon_clone/models/product.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';

import '../../../constants/error_handling.dart';
import '../../../constants/global_variables.dart';
import '../../../constants/utils.dart';
import '../../../providers/user_provider.dart';

class SearchServices {
  Future<List<Product>> fetchSearchedProducts(
      {required BuildContext context, required String searchQuery}) async {
    final userProvider = Provider.of<UserProvider>(context, listen: false).user;
    List<Product> products = [];
    try {
      http.Response res = await http.get(
          Uri.parse(
            '$uri/api/products/search/$searchQuery',
          ),
          headers: {
            'Content-Type': 'application/json charset=UTF-8',
            'x-auth-token': userProvider.token,
          });
      httpErrorHandle(
          response: res,
          context: context,
          onSuccess: () {
            for (var object in jsonDecode(res.body)) {
              products.add(Product.fromMap(object));
            }
          });
    } catch (e) {
      showSnackBar(context, e.toString());
    }
    return products;
  }
}
