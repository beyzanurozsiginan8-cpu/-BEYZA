import 'package:flutter/material.dart';
import 'weather_service.dart';
import 'weather_model.dart';
import 'location_service.dart';

class WeatherWidget extends StatefulWidget {
  const WeatherWidget({super.key});

  @override
  State<WeatherWidget> createState() => _WeatherWidgetState();
}

class _WeatherWidgetState extends State<WeatherWidget> {
  WeatherData? _weatherData;
  bool _isLoading = true;
  String _errorMessage = '';

  @override
  void initState() {
    super.initState();
    _fetchWeather();
  }

  Future<void> _fetchWeather() async {
    setState(() {
      _isLoading = true;
      _errorMessage = '';
    });

    try {
      // Get user's current location
      final position = await LocationService.getCurrentLocation();
      
      if (position != null) {
        // Fetch weather using coordinates
        final weather = await WeatherService.getCurrentWeather(
          position.latitude,
          position.longitude,
        );
        
        setState(() {
          _weatherData = weather;
          _isLoading = false;
        });
      } else {
        // If location is unavailable, use mock data
        setState(() {
          _weatherData = WeatherService.getMockWeatherData();
          _isLoading = false;
          _errorMessage = 'Location unavailable, showing sample data';
        });
      }
    } catch (e) {
      setState(() {
        _weatherData = WeatherService.getMockWeatherData();
        _isLoading = false;
        _errorMessage = 'Error fetching weather';
      });
    }
  }

  Future<void> _fetchWeatherByCity(String cityName) async {
    setState(() => _isLoading = true);

    final weather = await WeatherService.getWeatherByCity(cityName);
    
    setState(() {
      _weatherData = weather ?? WeatherService.getMockWeatherData();
      _isLoading = false;
      _errorMessage = weather == null ? 'City not found, showing sample data' : '';
    });
  }

  Future<void> _fetchWeatherByZip(String zipCode, String countryCode) async {
    setState(() => _isLoading = true);

    final weather = await WeatherService.getWeatherByZipCode(zipCode, countryCode);
    
    setState(() {
      _weatherData = weather ?? WeatherService.getMockWeatherData();
      _isLoading = false;
      _errorMessage = weather == null ? 'Location not found, showing sample data' : '';
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return Container(
        padding: const EdgeInsets.all(20),
        child: const Center(child: CircularProgressIndicator()),
      );
    }

    if (_weatherData == null) {
      return Container(
        padding: const EdgeInsets.all(20),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Text('Unable to load weather'),
              ElevatedButton(
                onPressed: _fetchWeather,
                child: const Text('Retry'),
              ),
            ],
          ),
        ),
      );
    }

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 8)],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Text(
                "🌤️ Weather Conditions",
                style: TextStyle(
                  fontSize: 20, 
                  fontWeight: FontWeight.bold,
                  color: Color(0xFFFF6B8A),
                ),
              ),
              const Spacer(),
              IconButton(
                icon: const Icon(Icons.refresh),
                onPressed: _fetchWeather,
                tooltip: 'Refresh Weather',
                color: Color(0xFFFF6B8A),
              ),
            ],
          ),
          
          if (_errorMessage.isNotEmpty)
            Padding(
              padding: const EdgeInsets.only(bottom: 8.0),
              child: Text(
                _errorMessage,
                style: TextStyle(color: Colors.orange[700], fontSize: 12),
              ),
            ),
          
          const SizedBox(height: 16),
          
          // Main weather info
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '${_weatherData!.weatherIcon} ${_weatherData!.condition}',
                      style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      '${_weatherData!.temperature.toStringAsFixed(1)}°C',
                      style: const TextStyle(fontSize: 32, fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
              ),
              Column(
                children: [
                  Text('Humidity: ${_weatherData!.humidity}%'),
                  Text('Wind: ${_weatherData!.windSpeed.toStringAsFixed(1)} km/h'),
                ],
              ),
            ],
          ),
          
          const SizedBox(height: 24),
          
          // Beekeeping specific info
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  Color(0xFFFDE7ED),
                  Color(0xFFFECEB8)
                ],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '🐝 Beekeeping Conditions',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFFFF6B8A),
                  ),
                ),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    _BeekeepingCondition(
                      label: 'Hive Activity',
                      value: _weatherData!.hiveActivityLevel,
                      icon: Icons.hive,
                    ),
                    _BeekeepingCondition(
                      label: 'Blooming Season',
                      value: _weatherData!.bloomingSeasonLevel,
                      icon: Icons.local_florist,
                    ),
                    _BeekeepingCondition(
                      label: 'Foraging',
                      value: _weatherData!.foragingConditions,
                      icon: Icons.search,
                    ),
                  ],
                ),
              ],
            ),
          ),
          
          const SizedBox(height: 16),
          
          // Quick actions
          Row(
            children: [
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () => _showCitySearch(),
                  icon: Icon(Icons.location_city),
                  label: Text('Search City'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Color(0xFFFF6B8A),
                    foregroundColor: Colors.white,
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () => _showZipSearch(),
                  icon: Icon(Icons.local_post_office),
                  label: Text('Search ZIP'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Color(0xFFFF6B8A),
                    foregroundColor: Colors.white,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  void _showCitySearch() {
    showDialog(
      context: context,
      builder: (context) => WeatherSearchWidget(
        title: 'Search City',
        hint: 'e.g., Istanbul, London, Paris',
        onSearch: (value) => _fetchWeatherByCity(value),
      ),
    );
  }

  void _showZipSearch() {
    showDialog(
      context: context,
      builder: (context) => ZipCodeSearchWidget(
        onSearch: (zip, country) => _fetchWeatherByZip(zip, country),
      ),
    );
  }
}

class _BeekeepingCondition extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;

  const _BeekeepingCondition({
    required this.label,
    required this.value,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    Color color;
    switch (value.toLowerCase()) {
      case 'high':
      case 'excellent':
      case 'good':
        color = Colors.green;
        break;
      case 'moderate':
        color = Colors.orange;
        break;
      case 'low':
      case 'poor':
        color = Colors.red;
        break;
      default:
        color = Colors.grey;
    }

    return Column(
      children: [
        Icon(icon, color: color, size: 16),
        const SizedBox(height: 4),
        Text(
          label,
          style: TextStyle(fontSize: 12, color: Colors.grey[600]),
        ),
        Text(
          value,
          style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: color),
        ),
      ],
    );
  }
}

class WeatherSearchWidget extends StatefulWidget {
  final String title;
  final String hint;
  final Function(String) onSearch;

  const WeatherSearchWidget({
    super.key,
    required this.title,
    required this.hint,
    required this.onSearch,
  });

  @override
  State<WeatherSearchWidget> createState() => _WeatherSearchWidgetState();
}

class _WeatherSearchWidgetState extends State<WeatherSearchWidget> {
  final _controller = TextEditingController();
  bool _isLoading = false;

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Future<void> _search() async {
    if (_controller.text.trim().isEmpty) return;

    setState(() => _isLoading = true);
    
    await widget.onSearch(_controller.text.trim());
    
    if (mounted) {
      setState(() => _isLoading = false);
      Navigator.pop(context);
    }
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text(widget.title),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          TextField(
            controller: _controller,
            decoration: InputDecoration(
              labelText: widget.title,
              hintText: widget.hint,
              border: const OutlineInputBorder(),
            ),
            onSubmitted: (_) => _search(),
          ),
          if (_isLoading)
            const Padding(
              padding: EdgeInsets.only(top: 16.0),
              child: CircularProgressIndicator(),
            ),
        ],
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: const Text('Cancel'),
        ),
        ElevatedButton(
          onPressed: _isLoading ? null : _search,
          child: const Text('Search'),
        ),
      ],
    );
  }
}

class ZipCodeSearchWidget extends StatefulWidget {
  final Function(String zip, String country) onSearch;

  const ZipCodeSearchWidget({super.key, required this.onSearch});

  @override
  State<ZipCodeSearchWidget> createState() => _ZipCodeSearchWidgetState();
}

class _ZipCodeSearchWidgetState extends State<ZipCodeSearchWidget> {
  final _zipController = TextEditingController();
  final _countryController = TextEditingController(text: 'US');
  bool _isLoading = false;

  @override
  void dispose() {
    _zipController.dispose();
    _countryController.dispose();
    super.dispose();
  }

  Future<void> _search() async {
    if (_zipController.text.trim().isEmpty) return;

    setState(() => _isLoading = true);
    
    await widget.onSearch(_zipController.text.trim(), _countryController.text.trim());
    
    if (mounted) {
      setState(() => _isLoading = false);
      Navigator.pop(context);
    }
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Search ZIP Code'),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          TextField(
            controller: _zipController,
            decoration: const InputDecoration(
              labelText: 'ZIP Code',
              hintText: 'e.g., 34000',
              border: OutlineInputBorder(),
            ),
          ),
          const SizedBox(height: 16),
          TextField(
            controller: _countryController,
            decoration: const InputDecoration(
              labelText: 'Country Code',
              hintText: 'e.g., US, TR, UK',
              border: OutlineInputBorder(),
            ),
          ),
          if (_isLoading)
            const Padding(
              padding: EdgeInsets.only(top: 16.0),
              child: CircularProgressIndicator(),
            ),
        ],
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: const Text('Cancel'),
        ),
        ElevatedButton(
          onPressed: _isLoading ? null : _search,
          child: const Text('Search'),
        ),
      ],
    );
  }
}
