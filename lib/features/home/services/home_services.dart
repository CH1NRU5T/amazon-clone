import 'dart:convert';

import 'package:amazon_clone/constants/error_handling.dart';
import 'package:amazon_clone/constants/global_variables.dart';
import 'package:amazon_clone/constants/utils.dart';
import 'package:amazon_clone/models/product.dart';
import 'package:amazon_clone/providers/user_provider.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';

class HomeServices {
  Future<Product> getDealOfTheDay({required BuildContext context}) async {
    http.Response res = await http.get(
      Uri.parse('$uri/api/deal-of-the-day'),
      headers: {
        'Content-Type': 'application/json charset=UTF-8',
        'x-auth-token':
            Provider.of<UserProvider>(context, listen: false).user.token,
      },
    );
    httpErrorHandle(response: res, context: context, onSuccess: () {});
    Product product = Product.fromMap(jsonDecode(res.body));
    return product;
  }

  Future<List<Product>> fetchCategoryProducts(
      {required BuildContext context, required String category}) async {
    final userProvider = Provider.of<UserProvider>(context, listen: false).user;
    List<Product> products = [];
    try {
      http.Response res = await http.get(
          Uri.parse(
            '$uri/api/products?category=$category',
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
