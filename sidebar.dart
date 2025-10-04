import 'package:flutter/material.dart';
import 'home_page.dart';
import 'myfields_page.dart';
import 'schedule_page.dart';
import 'settings_page.dart';
import 'help_page.dart';
import 'learning_page.dart';

enum AppSection { home, fields, schedule, learning, settings, help }

class AppSidebar extends StatelessWidget {
  final AppSection current;

  const AppSidebar({super.key, required this.current});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 240,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [Color(0xFFFFE4F1), Color(0xFFFFB8D8)],
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
        ),
        boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 8)],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 40),
          Container(
            margin: const EdgeInsets.all(16),
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [Color(0xFFFFE4F1), Color(0xFFFFB8D8)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(16),
              boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 4)],
            ),
            child: Row(
              children: [
                Text(
                  "🐝",
                  style: const TextStyle(fontSize: 28),
                ),
                const SizedBox(width: 12),
                const Text(
                  "BloomBee",
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Colors.black87,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          _SidebarButton(
            icon: Icons.dashboard,
            text: "Home",
            active: current == AppSection.home,
            onTap: current == AppSection.home
                ? null
                : () {
                    Navigator.pushReplacement(
                      context,
                      MaterialPageRoute(builder: (_) => const HomePage()),
                    );
                  },
          ),

          _SidebarButton(
            icon: Icons.hive,
            text: "My Hives",
            active: current == AppSection.fields,
            onTap: current == AppSection.fields
                ? null
                : () {
                    Navigator.pushReplacement(
                      context,
                      MaterialPageRoute(builder: (_) => MyfieldsPage()),
                    );
                  },
          ),

          _SidebarButton(
            icon: Icons.calendar_today,
            text: "My Schedule",
            active: current == AppSection.schedule,
            onTap: current == AppSection.schedule
                ? null
                : () {
                    Navigator.pushReplacement(
                      context,
                      MaterialPageRoute(builder: (_) => const SchedulePage()),
                    );
                  },
          ),

          _SidebarButton(
            icon: Icons.school,
            text: "Learning Center",
            active: current == AppSection.learning,
            onTap: current == AppSection.learning
                ? null
                : () {
                    Navigator.pushReplacement(
                      context,
                      MaterialPageRoute(builder: (_) => const LearningPage()),
                    );
                  },
          ),

          const Spacer(),

          _SidebarButton(
            icon: Icons.settings,
            text: "Settings",
            active: current == AppSection.settings,
            onTap: current == AppSection.settings
                ? null
                : () {
                    Navigator.pushReplacement(
                      context,
                      MaterialPageRoute(builder: (_) => const SettingsPage()),
                    );
                  },
          ),
          _SidebarButton(
            icon: Icons.help_outline,
            text: "Help Center",
            active: current == AppSection.help,
            onTap: current == AppSection.help
                ? null
                : () {
                    Navigator.pushReplacement(
                      context,
                      MaterialPageRoute(builder: (_) => const HelpPage()),
                    );
                  },
          ),
          const SizedBox(height: 20),
          
          // Logout button
          _SidebarButton(
            icon: Icons.logout,
            text: "Logout",
            onTap: () {
              showDialog(
                context: context,
                builder: (ctx) => AlertDialog(
                  title: const Text("Logout"),
                  content: const Text("Are you sure you want to logout?"),
                  actions: [
                    TextButton(
                      onPressed: () => Navigator.pop(ctx),
                      child: const Text("Cancel"),
                    ),
                    TextButton(
                      onPressed: () {
                        Navigator.pop(ctx);
                        Navigator.pushNamedAndRemoveUntil(
                          context,
                          '/login',
                          (route) => false,
                        );
                      },
                      child: const Text("Logout"),
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}

class _SidebarButton extends StatelessWidget {
  final IconData icon;
  final String text;
  final bool active;
  final VoidCallback? onTap;

  const _SidebarButton({
    required this.icon,
    required this.text,
    this.active = false,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 4, horizontal: 16),
      decoration: BoxDecoration(
        color: active ? Colors.white : Colors.transparent,
        borderRadius: BorderRadius.circular(12),
        boxShadow: active ? const [BoxShadow(color: Colors.black12, blurRadius: 4)] : null,
      ),
      child: ListTile(
        leading: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: active ? Color(0xFFFFE4F1) : Colors.transparent,
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(
            icon, 
            color: active ? Color(0xFFFF6B8A) : Colors.grey[600],
            size: 20,
          ),
        ),
        title: Text(
          text,
          style: TextStyle(
            color: active ? Color(0xFFFF6B8A) : Colors.grey[700],
            fontWeight: active ? FontWeight.bold : FontWeight.w500,
            fontSize: 14,
          ),
        ),
        onTap: onTap,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
    );
  }
}


