import 'package:flutter/material.dart';
import 'sidebar.dart';

class HelpPage extends StatelessWidget {
  const HelpPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFFFEF7F0),
      body: Row(
        children: [
          const AppSidebar(current: AppSection.help),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    "Help Center",
                    style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    "Get help with using BloomBee beekeeping app",
                    style: TextStyle(fontSize: 16, color: Colors.grey),
                  ),
                  const SizedBox(height: 24),

                  // App Overview
                  _HelpSection(
                    title: "App Overview",
                    icon: Icons.info_outline,
                    color: Colors.blue,
                    children: [
                      _HelpItem(
                        title: "What is BloomBee?",
                        content: "BloomBee is a comprehensive beekeeping management app designed to help beekeepers track their hives, manage schedules, and access educational resources. Whether you're a beginner or experienced beekeeper, BloomBee provides tools to optimize your beekeeping practice.",
                      ),
                      _HelpItem(
                        title: "Key Features",
                        content: "• Hive Management: Track individual hives with health status and honey production\n• Schedule Management: Plan and organize beekeeping activities with a visual calendar\n• Learning Center: Access educational articles about beekeeping best practices\n• Profile Management: Store and update your beekeeping information\n• Location Services: Use GPS to track your apiary location",
                      ),
                    ],
                  ),

                  const SizedBox(height: 24),

                  // Getting Started
                  _HelpSection(
                    title: "Getting Started",
                    icon: Icons.play_arrow,
                    color: Colors.green,
                    children: [
                      _HelpItem(
                        title: "Creating Your Account",
                        content: "1. Tap 'Sign up' on the login screen\n2. Fill in your personal information (name, email, location)\n3. Enter your apiary details (name, location, beekeeping type)\n4. Set your experience level and number of hives\n5. Create a secure password\n6. Tap 'Create Account' to complete registration",
                      ),
                      _HelpItem(
                        title: "Setting Up Your Profile",
                        content: "After signing up, you can update your profile in the Settings page:\n• Personal information (name, email, phone)\n• Apiary location and name\n• Beekeeping experience and hive count\n• Beekeeping type (hobby, commercial, etc.)",
                      ),
                    ],
                  ),

                  const SizedBox(height: 24),

                  // Navigation Guide
                  _HelpSection(
                    title: "Navigation Guide",
                    icon: Icons.navigation,
                    color: Colors.orange,
                    children: [
                      _HelpItem(
                        title: "Home Dashboard",
                        content: "The main dashboard shows:\n• Welcome message with your name\n• Current date and location\n• Weather and hive activity stats\n• Flower source distribution chart\n• Quick hive status overview",
                      ),
                      _HelpItem(
                        title: "My Hives",
                        content: "Manage your beehives:\n• View all hives with health status\n• Track honey production and harvest times\n• Monitor hive activity and progress\n• Add new hives to your collection",
                      ),
                      _HelpItem(
                        title: "My Schedule",
                        content: "Plan your beekeeping activities:\n• Visual calendar with activity indicators\n• Add activities with different types (inspection, harvest, feeding, etc.)\n• Color-coded activities for easy identification\n• Set specific times and descriptions for each activity",
                      ),
                      _HelpItem(
                        title: "Learning Center",
                        content: "Access educational resources:\n• Comprehensive beekeeping articles\n• Blooming season information\n• Best flowers for honey production\n• Climate change impacts on beekeeping\n• Safety and allergy information",
                      ),
                      _HelpItem(
                        title: "Settings",
                        content: "Manage your account:\n• Update personal information\n• Modify beekeeping details\n• Change location and apiary information\n• Adjust experience level and hive count",
                      ),
                    ],
                  ),

                  const SizedBox(height: 24),

                  // Tips & Best Practices
                  _HelpSection(
                    title: "Tips & Best Practices",
                    icon: Icons.lightbulb,
                    color: Colors.amber,
                    children: [
                      _HelpItem(
                        title: "Using the Schedule",
                        content: "• Plan activities during optimal weather conditions\n• Use different activity types to organize your tasks\n• Set reminders for important hive inspections\n• Track seasonal patterns in your beekeeping activities",
                      ),
                      _HelpItem(
                        title: "Hive Management",
                        content: "• Regularly update hive status and health information\n• Monitor honey production levels\n• Track harvest times and yields\n• Keep detailed records of hive performance",
                      ),
                      _HelpItem(
                        title: "Location Services",
                        content: "• Allow location access for accurate apiary tracking\n• Use manual location entry as backup\n• Update location if you move your apiary\n• Consider multiple apiary locations if applicable",
                      ),
                    ],
                  ),

                  const SizedBox(height: 24),

                  // Troubleshooting
                  _HelpSection(
                    title: "Troubleshooting",
                    icon: Icons.build,
                    color: Colors.red,
                    children: [
                      _HelpItem(
                        title: "App Not Loading",
                        content: "• Check your internet connection\n• Restart the app\n• Clear app cache if needed\n• Update to the latest version",
                      ),
                      _HelpItem(
                        title: "Location Not Working",
                        content: "• Enable location permissions in device settings\n• Check if GPS is turned on\n• Try manual location entry as alternative\n• Ensure you're in an area with good GPS signal",
                      ),
                      _HelpItem(
                        title: "Data Not Saving",
                        content: "• Check your internet connection\n• Ensure all required fields are filled\n• Try logging out and back in\n• Contact support if problem persists",
                      ),
                    ],
                  ),

                  const SizedBox(height: 24),

                  // Contact Information
                  _HelpSection(
                    title: "Contact Us",
                    icon: Icons.contact_support,
                    color: Colors.purple,
                    children: [
                      _HelpItem(
                        title: "Email Support",
                        content: "For technical support, feature requests, or general inquiries:\n\n📧 support@bloombee.app\n\nWe typically respond within 24-48 hours during business days.",
                      ),
                      _HelpItem(
                        title: "Business Hours",
                        content: "Monday - Friday: 9:00 AM - 6:00 PM (EST)\nSaturday: 10:00 AM - 4:00 PM (EST)\nSunday: Closed",
                      ),
                      _HelpItem(
                        title: "Community Support",
                        content: "Join our beekeeping community:\n• Share experiences with other beekeepers\n• Get advice from experienced users\n• Report bugs and suggest improvements\n• Access to exclusive beekeeping resources",
                      ),
                    ],
                  ),

                  const SizedBox(height: 24),

                  // FAQ
                  _HelpSection(
                    title: "Frequently Asked Questions",
                    icon: Icons.help_outline,
                    color: Colors.teal,
                    children: [
                      _HelpItem(
                        title: "Is BloomBee free to use?",
                        content: "Yes, BloomBee offers a free tier with basic features. Premium features may be available for advanced users.",
                      ),
                      _HelpItem(
                        title: "Can I use BloomBee offline?",
                        content: "Some features work offline, but full functionality requires an internet connection for data synchronization.",
                      ),
                      _HelpItem(
                        title: "How do I backup my data?",
                        content: "Your data is automatically saved to your account. You can access it from any device by logging in with your credentials.",
                      ),
                      _HelpItem(
                        title: "Can I share my hive data with others?",
                        content: "Currently, data sharing features are not available, but this may be added in future updates.",
                      ),
                    ],
                  ),

                  const SizedBox(height: 32),

                  // Footer
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.grey[100],
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Column(
                      children: [
                        const Text(
                          "🐝 BloomBee - Smart Beekeeping Management",
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 8),
                        const Text(
                          "Version 1.0.0",
                          style: TextStyle(color: Colors.grey),
                        ),
                        const SizedBox(height: 8),
                        const Text(
                          "© 2024 BloomBee. All rights reserved.",
                          style: TextStyle(color: Colors.grey, fontSize: 12),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _HelpSection extends StatelessWidget {
  final String title;
  final IconData icon;
  final Color color;
  final List<Widget> children;

  const _HelpSection({
    required this.title,
    required this.icon,
    required this.color,
    required this.children,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: color.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(icon, color: color, size: 24),
                ),
                const SizedBox(width: 16),
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),
            ...children,
          ],
        ),
      ),
    );
  }
}

class _HelpItem extends StatelessWidget {
  final String title;
  final String content;

  const _HelpItem({
    required this.title,
    required this.content,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            content,
            style: const TextStyle(
              fontSize: 14,
              height: 1.5,
              color: Colors.grey,
            ),
          ),
        ],
      ),
    );
  }
}