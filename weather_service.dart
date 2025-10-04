import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'weather_model.dart';

class WeatherService {
  // Get your free API key from https://openweathermap.org/api
  static const String _apiKey = '67308a06bd6b39f3294c40ee73691a82';
  static const String _baseUrl = 'https://api.openweathermap.org/data/2.5/weather';

  /// Fetch current weather by latitude and longitude
  /// Returns WeatherData or fallback mock data if API fails
  static Future<WeatherData?> getCurrentWeather(double lat, double lon) async {
    try {
      final url = Uri.parse('$_baseUrl?lat=$lat&lon=$lon&appid=$_apiKey&units=metric');
      debugPrint('🌤️ Fetching weather from: $url');
      
      final response = await http.get(url).timeout(
        const Duration(seconds: 10),
        onTimeout: () {
          debugPrint('🌤️ Weather API request timed out');
          throw Exception('Request timeout');
        },
      );
      
      debugPrint('🌤️ Weather API Response status: ${response.statusCode}');
      
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        debugPrint('🌤️ Weather data received successfully');
        debugPrint('🌤️ Location: ${data['name']}, ${data['sys']['country']}');
        return WeatherData.fromJson(data);
      } else if (response.statusCode == 401) {
        debugPrint('🌤️ Invalid API Key. Please check your OpenWeatherMap API key.');
        return getMockWeatherData();
      } else if (response.statusCode == 404) {
        debugPrint('🌤️ Location not found');
        return getMockWeatherData();
      } else {
        debugPrint('🌤️ Weather API Error: ${response.statusCode} - ${response.body}');
        return getMockWeatherData();
      }
    } catch (e) {
      debugPrint('🌤️ Weather Service Error: $e');
      return getMockWeatherData();
    }
  }

  /// Fetch current weather by city name
  /// Example: "London", "London,UK", "New York,US"
  static Future<WeatherData?> getWeatherByCity(String cityName) async {
    try {
      final url = Uri.parse('$_baseUrl?q=$cityName&appid=$_apiKey&units=metric');
      debugPrint('🌤️ Fetching weather for city: $cityName');
      
      final response = await http.get(url).timeout(
        const Duration(seconds: 10),
        onTimeout: () {
          throw Exception('Request timeout');
        },
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        debugPrint('🌤️ Weather data received for ${data['name']}');
        return WeatherData.fromJson(data);
      } else if (response.statusCode == 404) {
        debugPrint('🌤️ City not found: $cityName');
        return null;
      } else {
        debugPrint('🌤️ Weather API Error: ${response.statusCode}');
        return null;
      }
    } catch (e) {
      debugPrint('🌤️ Weather Service Error: $e');
      return null;
    }
  }

  /// Fetch current weather by ZIP code
  /// Example: "94040,US" for US zip codes
  static Future<WeatherData?> getWeatherByZipCode(String zipCode, String countryCode) async {
    try {
      final url = Uri.parse('$_baseUrl?zip=$zipCode,$countryCode&appid=$_apiKey&units=metric');
      debugPrint('🌤️ Fetching weather for ZIP: $zipCode, $countryCode');
      
      final response = await http.get(url).timeout(
        const Duration(seconds: 10),
        onTimeout: () {
          throw Exception('Request timeout');
        },
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        debugPrint('🌤️ Weather data received for ZIP $zipCode');
        return WeatherData.fromJson(data);
      } else {
        debugPrint('🌤️ Weather API Error: ${response.statusCode}');
        return null;
      }
    } catch (e) {
      debugPrint('🌤️ Weather Service Error: $e');
      return null;
    }
  }

  /// Mock weather data for development/fallback
  /// Provides realistic seasonal temperatures
  static WeatherData getMockWeatherData() {
    final DateTime now = DateTime.now();
    debugPrint('🌤️ Using mock weather data for: ${now.month}/${now.day}/${now.year}');
    
    // Realistic seasonal temperature calculation
    double temp;
    String condition;
    String icon;
    
    switch (now.month) {
      case 12:
      case 1:
      case 2: // Winter
        temp = 5.0 + (now.day % 8);  // 5-12°C
        condition = now.day % 4 == 0 ? 'Clouds' : 'Clear';
        icon = now.day % 4 == 0 ? '☁️' : '☀️';
        break;
      case 3:
      case 4:
      case 5: // Spring
        temp = 15.0 + (now.day % 10); // 15-24°C
        condition = 'Clear';
        icon = '☀️';
        break;
      case 6:
      case 7:
      case 8: // Summer
        temp = 25.0 + (now.day % 8);  // 25-32°C
        condition = now.day % 3 == 0 ? 'Clouds' : 'Clear';
        icon = now.day % 3 == 0 ? '☁️' : '☀️';
        break;
      case 9:
      case 10:
      case 11: // Fall
        temp = 12.0 + (now.day % 10); // 12-21°C
        condition = now.day % 5 == 0 ? 'Rain' : 'Clear';
        icon = now.day % 5 == 0 ? '🌧️' : '☀️';
        break;
      default:
        temp = 18.0;
        condition = 'Clear';
        icon = '☀️';
    }
    
    final windSpeed = 5.0 + (now.day % 15); // 5-20 km/h
    final humidity = 50 + (now.day % 30); // 50-80%
    
    // Determine hive activity based on temperature
    String hiveActivity;
    if (temp >= 15 && temp <= 30) {
      hiveActivity = 'High';
    } else if (temp >= 10 && temp <= 35) {
      hiveActivity = 'Moderate';
    } else {
      hiveActivity = 'Low';
    }
    
    // Determine blooming season based on month and temperature
    String blooming;
    if (now.month >= 3 && now.month <= 5) {
      // Spring - peak blooming
      blooming = temp >= 15 ? 'Excellent' : 'Good';
    } else if (now.month >= 6 && now.month <= 8) {
      // Summer - good blooming
      blooming = temp >= 18 ? 'Good' : 'Moderate';
    } else if (now.month >= 9 && now.month <= 11) {
      // Fall - declining blooming
      blooming = temp >= 15 ? 'Moderate' : 'Poor';
    } else {
      // Winter - poor blooming
      blooming = 'Poor';
    }
    
    // Foraging conditions based on wind and weather
    String foraging;
    if (windSpeed < 20 && condition != 'Rain') {
      foraging = 'Good';
    } else if (windSpeed < 30) {
      foraging = 'Moderate';
    } else {
      foraging = 'Poor';
    }
    
    return WeatherData(
      temperature: temp,
      condition: condition,
      humidity: humidity,
      windSpeed: windSpeed,
      weatherIcon: icon,
      hiveActivityLevel: hiveActivity,
      bloomingSeasonLevel: blooming,
      foragingConditions: foraging,
    );
  }
}