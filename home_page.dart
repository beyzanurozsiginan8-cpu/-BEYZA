import 'package:flutter/material.dart';
import 'package:pie_chart/pie_chart.dart';
import 'sidebar.dart';
import 'package:intl/intl.dart';
import 'location_service.dart';
import 'weather_widget.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> with SingleTickerProviderStateMixin {
  late TabController _tabController; 
  String _currentLocation = "Loading location...";
  final DateTime _currentDate = DateTime.now();

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _initLocation();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _initLocation() async {
    try {
      debugPrint('📍 Initializing location services...');
      final String location = await LocationService().getCurrentLocationLabel();
      await LocationService().getCurrentLocationCoordinates();
      
      // Update UI immediately with available data
      if (mounted) {
        setState(() {
          _currentLocation = location;
        });
        debugPrint('📍 Location updated: $location');
      }
      
      // Weather is now handled by WeatherWidget
    } catch (e) {
      debugPrint('📍 Error initializing location: $e');
      if (mounted) {
        setState(() {
          if (e.toString().contains('disabled')) {
            _currentLocation = "Location services disabled";
          } else if (e.toString().contains('denied')) {
            _currentLocation = "Location permission denied";
          } else {
            _currentLocation = "Location unavailable";
          }
        });
        
        // Show user-friendly message
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              e.toString().contains('disabled') 
                ? 'Please enable location services in your device settings'
                : e.toString().contains('denied')
                  ? 'Please grant location permission to access your location'
                  : 'Unable to get location. Using default settings.',
            ),
            backgroundColor: Colors.orange,
            duration: Duration(seconds: 3),
            action: SnackBarAction(
              label: 'Retry',
              textColor: Colors.white,
              onPressed: _refreshLocationAndWeather,
            ),
          ),
        );
      }
      // Weather widget handles its own fallback
    }
  }


  Future<void> _refreshLocationAndWeather() async {
    await _initLocation();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFFFEF7F0),
      body: Row(
        children: [
          const AppSidebar(current: AppSection.home),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Header with location and date
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
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Row(
                      children: [
                        Icon(Icons.location_on, color: Color(0xFFFF6B8A)),
                        const SizedBox(width: 8),
                        Text(
                          _currentLocation,
                          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
                        ),
                        const Spacer(),
                        Icon(Icons.access_time, color: Color(0xFFFF6B8A)),
                        const SizedBox(width: 8),
                        Text(
                          DateFormat('EEEE, MMMM d').format(_currentDate),
                          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
                        ),
                        const SizedBox(width: 8),
                        IconButton(
                          onPressed: _refreshLocationAndWeather,
                          icon: Icon(Icons.refresh, color: Color(0xFFFF6B8A)),
                          tooltip: 'Refresh location',
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Weather Widget
                  const WeatherWidget(),

                  // Chart section
                  Row(
                    children: [
                      Expanded(
                        flex: 2,
                        child: _FlowerSourcesCard(),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        flex: 3,
                        child: _HiveActivityCard(),
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),

                  // Quick actions
                  _QuickActionsCard(),
                  const SizedBox(height: 24),

                  // Map preview
                  Container(
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [
                          Color(0xFFFFBEBE),
                          Color(0xFFFFE4F1),
                        ],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 8)],
                    ),
                    child: Column(
                      children: [
                        Row(
                          children: [
                            Icon(Icons.map, size: 64, color: Color(0xFFFF6B8A)),
                            const SizedBox(width: 16),
                            Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    "Smart Hive Map",
                                    style: TextStyle(
                                      fontSize: 24,
                                      fontWeight: FontWeight.bold,
                                      color: Color(0xFFFF6B8A),
                                    ),
                                  ),
                                  const SizedBox(height: 8),
                                  Text(
                                    "Real-time apiary monitoring",
                                    style: TextStyle(color: Colors.black54),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 24),
                        Container(
                          width: double.infinity,
                          height: 300,
                          decoration: BoxDecoration(
                            color: Colors.white.withValues(alpha: 0.3),
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: Color(0xFFFF6B8A), width: 2),
                          ),
                          child: Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(Icons.hive, size: 48, color: Color(0xFFFF6B8A)),
                                const SizedBox(height: 8),
                                Text(
                                  "Interactive Map Coming Soon",
                                    style: TextStyle(
                                        fontSize: 18,
                                    fontWeight: FontWeight.w600,
                                    color: Color(0xFFFF6B8A),
                                  ),
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  "Coming Soon - Track your hives in real-time",
                                  style: TextStyle(color: Colors.black54),
                                ),
                              ],
                            ),
                          ),
                        ),
                    ],
                    ),
                  ),
                ],
              ),
            ),
          )
        ],
      ),
    );
  }
}

class _WeatherCard extends StatelessWidget {
  final String title;
  final String value;
  final IconData icon;
  final Color color;
  final Color textColor;

  const _WeatherCard({
    required this.title,
    required this.value,
    required this.icon,
    required this.color,
    required this.textColor,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, size: 24, color: textColor),
          const SizedBox(height: 8),
          Text(
            value,
          style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: textColor,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            title,
            style: TextStyle(
              fontSize: 12,
              color: textColor,
            ),
          ),
        ],
      ),
    );
  }
}

class _BeekeepingMetricCard extends StatelessWidget {
  final String title;
  final String value;
  final IconData icon;
  final Color color;
  final Color textColor;

  const _BeekeepingMetricCard({
    required this.title,
    required this.value,
    required this.icon,
    required this.color,
    required this.textColor,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, size: 24, color: textColor),
          const SizedBox(height: 8),
          Text(
            value,
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: textColor,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            title,
            style: TextStyle(
              fontSize: 12,
              color: textColor,
            ),
          ),
        ],
      ),
    );
  }
}

class _FlowerSourcesCard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 8)],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Row(
            children: [
              Text(
                "🌸 Flower Sources",
                style: TextStyle(
                  fontSize: 20, 
                  fontWeight: FontWeight.bold,
                  color: Color(0xFFFF6B8A),
                ),
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: Color(0xFFFFE4F1),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Color(0xFFFF6B8A)),
                ),
                child: Text(
                  "Live",
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFFFF6B8A),
                  ),
                ),
              ),
              const Spacer(),
            ],
          ),
          const SizedBox(height: 24),
          PieChart(
            dataMap: const {
              "Apple Blossoms": 25,
              "Wildflower Mix": 30,
              "Lavender": 20,
              "Clover": 15,
              "Other": 10,
            },
            chartType: ChartType.disc,
            colorList: const [
              Color(0xFFE8B86D),
              Color(0xFFD4A574),
              Color(0xFF8B7355),
              Color(0xFFF4E4BC),
              Color(0xFFC8C8C8),
            ],
            legendOptions: const LegendOptions(
              showLegends: true,
              legendPosition: LegendPosition.bottom,
              legendTextStyle: TextStyle(fontSize: 12),
            ),
            chartValuesOptions: const ChartValuesOptions(
              showChartValues: false,
            ),
            animationDuration: const Duration(milliseconds: 1200),
          ),
        ],
      ),
    );
  }
}

class _HiveActivityCard extends StatefulWidget {
  @override
  _HiveActivityCardState createState() => _HiveActivityCardState();
}

class _HiveActivityCardState extends State<_HiveActivityCard> {
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            Color(0xFFE8B86D),
            Color(0xFFD4A574),
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 8)],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            "🍯 Apiary Overview",
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Icon(Icons.hive, color: Colors.white70, size: 16),
              const SizedBox(width: 8),
              Text(
                "5 Active hives",
                style: TextStyle(color: Colors.white70, fontSize: 14),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Icon(Icons.house, color: Colors.white70, size: 16),
              const SizedBox(width: 8),
              Text(
                "Honey harvest: 24L this season",
                style: TextStyle(color: Colors.white70, fontSize: 14),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Icon(Icons.trending_up, color: Colors.white70, size: 16),
              const SizedBox(width: 8),
              Text(
                "Productivity: High",
                style: TextStyle(color: Colors.white70, fontSize: 14),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _QuickActionsCard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 8)],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            "🚀 Quick Actions",
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: Color(0xFFFF6B8A),
            ),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: _TaskItem(
                  icon: Icons.hive,
                  title: "Inspect Hives",
                  subtitle: "Schedule hive inspection",
                  onTap: () => Navigator.pushNamed(context, '/schedule'),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _TaskItem(
                  icon: Icons.house,
                  title: "Harvest Honey",
                  subtitle: "Log honey extraction",
                  onTap: () => Navigator.pushNamed(context, '/schedule'),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _TaskItem(
                  icon: Icons.location_on,
                  title: "Add Location",
                  subtitle: "Register new spot",
                  onTap: () => Navigator.pushNamed(context, '/settings'),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _TaskItem extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final VoidCallback onTap;

  const _TaskItem({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          border: Border.all(color: Colors.grey.shade200),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          children: [
            Icon(icon, size: 32, color: Color(0xFFFF6B8A)),
            const SizedBox(height: 8),
            Text(
              title,
              style: const TextStyle(fontWeight: FontWeight.w600),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 4),
            Text(
              subtitle,
              style: TextStyle(color: Colors.grey.shade600, fontSize: 12),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}