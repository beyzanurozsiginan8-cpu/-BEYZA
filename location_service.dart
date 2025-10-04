import 'package:geolocator/geolocator.dart';
import 'package:flutter/foundation.dart';
import 'package:geocoding/geocoding.dart';

class LocationService {
  static final LocationService _instance = LocationService._internal();
  factory LocationService() => _instance;
  LocationService._internal();

  Future<bool> ensurePermission() async {
    LocationPermission permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
    }
    return permission == LocationPermission.always ||
        permission == LocationPermission.whileInUse;
  }

  Future<Position?> getCurrentPosition() async {
    return await getCurrentLocation();
  }

  /// Get user's current location with improved error handling
  static Future<Position?> getCurrentLocation() async {
    try {
      // Check if location services are enabled
      bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        debugPrint('📍 Location services are disabled.');
        return null;
      }

      // Check location permissions
      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) {
          debugPrint('📍 Location permissions are denied');
          return null;
        }
      }

      if (permission == LocationPermission.deniedForever) {
        debugPrint('📍 Location permissions are permanently denied');
        return null;
      }

      // Get current position
      Position position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
        timeLimit: const Duration(seconds: 15),
      );
      
      debugPrint('📍 Location: ${position.latitude}, ${position.longitude}');
      return position;
    } catch (e) {
      debugPrint('📍 Error getting location: $e');
      return null;
    }
  }

  Future<String> reverseGeocode({required double latitude, required double longitude}) async {
    try {
      final List<Placemark> placemarks = await placemarkFromCoordinates(latitude, longitude);
      if (placemarks.isEmpty) return "Unknown location";
      final Placemark p = placemarks.first;
      final String locality = p.locality?.trim().isNotEmpty == true ? p.locality! : '';
      final String admin = p.administrativeArea?.trim().isNotEmpty == true ? p.administrativeArea! : '';
      final String country = p.country?.trim().isNotEmpty == true ? p.country! : '';
      final parts = [locality, admin, country].where((e) => e.isNotEmpty).toList();
      return parts.isEmpty ? "Unknown location" : parts.join(', ');
    } catch (e) {
      debugPrint('Error reverse geocoding: $e');
      return "Unknown location";
    }
  }

  Future<String> getCurrentLocationLabel() async {
    try {
      final position = await getCurrentLocation();
      if (position == null) return "Location unavailable";
      
      return await reverseGeocode(
        latitude: position.latitude,
        longitude: position.longitude,
      );
    } catch (e) {
      debugPrint('Error getting location label: $e');
      return "Location unavailable";
    }
  }

  Future<Map<String, double>?> getCurrentLocationCoordinates() async {
    try {
      final position = await getCurrentLocation();
      if (position == null) return null;
      
      return {
        'latitude': position.latitude,
        'longitude': position.longitude,
      };
    } catch (e) {
      debugPrint('Error getting location coordinates: $e');
      return null;
    }
  }
}