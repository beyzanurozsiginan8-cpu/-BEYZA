class WeatherData {
  final double temperature;
  final String condition;
  final int humidity;
  final double windSpeed;
  final String weatherIcon;
  final String hiveActivityLevel;
  final String bloomingSeasonLevel;
  final String foragingConditions;

  WeatherData({
    required this.temperature,
    required this.condition,
    required this.humidity,
    required this.windSpeed,
    required this.weatherIcon,
    required this.hiveActivityLevel,
    required this.bloomingSeasonLevel,
    required this.foragingConditions,
  });

  factory WeatherData.fromJson(Map<String, dynamic> json) {
    final temp = (json['main']['temp'] as num).toDouble();
    final windSpeedMs = (json['wind']['speed'] as num).toDouble();
    final windSpeedKmh = windSpeedMs * 3.6; // Convert m/s to km/h
    final humidity = json['main']['humidity'] as int;
    final weatherMain = json['weather'][0]['main'] as String;
    
    // Determine weather icon
    String icon;
    switch (weatherMain.toLowerCase()) {
      case 'clear':
        icon = '☀️';
        break;
      case 'clouds':
        icon = '☁️';
        break;
      case 'rain':
      case 'drizzle':
        icon = '🌧️';
        break;
      case 'thunderstorm':
        icon = '⛈️';
        break;
      case 'snow':
        icon = '❄️';
        break;
      case 'mist':
      case 'fog':
        icon = '🌫️';
        break;
      default:
        icon = '🌤️';
    }

    // Determine hive activity based on temperature and weather
    String hiveActivity;
    if (temp >= 15 && temp <= 30 && !['rain', 'thunderstorm'].contains(weatherMain.toLowerCase())) {
      hiveActivity = 'High';
    } else if (temp >= 10 && temp <= 35) {
      hiveActivity = 'Moderate';
    } else {
      hiveActivity = 'Low';
    }

    // Determine blooming season (simplified - based on temperature)
    String blooming;
    if (temp >= 15 && temp <= 28) {
      blooming = 'Good';
    } else if (temp >= 10 && temp <= 32) {
      blooming = 'Moderate';
    } else {
      blooming = 'Poor';
    }

    // Foraging conditions based on wind and weather
    String foraging;
    if (windSpeedKmh < 20 && !['rain', 'thunderstorm', 'snow'].contains(weatherMain.toLowerCase())) {
      foraging = 'Good';
    } else if (windSpeedKmh < 30) {
      foraging = 'Moderate';
    } else {
      foraging = 'Poor';
    }

    return WeatherData(
      temperature: temp,
      condition: weatherMain,
      humidity: humidity,
      windSpeed: windSpeedKmh,
      weatherIcon: icon,
      hiveActivityLevel: hiveActivity,
      bloomingSeasonLevel: blooming,
      foragingConditions: foraging,
    );
  }
}
