import 'package:flutter/material.dart';
import 'sidebar.dart';
import 'profile_service.dart';
import 'user_model.dart';

class SettingsPage extends StatefulWidget {
  const SettingsPage({super.key});

  @override
  State<SettingsPage> createState() => _SettingsPageState();
}

class _SettingsPageState extends State<SettingsPage> {
  bool _isLoading = true;
  bool _isSaving = false;

  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _locationController = TextEditingController();
  final _apiaryNameController = TextEditingController();
  final _phoneController = TextEditingController();
  
  String _selectedBeekeepingType = 'Hobby Beekeeping';
  int _experienceYears = 1;
  int _numberOfHives = 1;

  final List<String> _beekeepingTypes = [
    'Hobby Beekeeping',
    'Commercial Beekeeping',
    'Pollination Services',
    'Honey Production',
    'Queen Bee Breeding',
    'Educational Beekeeping',
  ];

  @override
  void initState() {
    super.initState();
    _loadUserProfile();
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _locationController.dispose();
    _apiaryNameController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  Future<void> _loadUserProfile() async {
    final profile = await ProfileService.getUserProfile();
    if (mounted) {
      setState(() {
        if (profile != null) {
          _nameController.text = profile.name;
          _emailController.text = profile.email;
          _locationController.text = profile.location;
          _apiaryNameController.text = profile.apiaryName;
          _phoneController.text = profile.phoneNumber;
          _selectedBeekeepingType = profile.beekeepingType;
          _experienceYears = profile.experienceYears;
          _numberOfHives = profile.numberOfHives;
        }
        _isLoading = false;
      });
    }
  }

  Future<void> _saveProfile() async {
    if (_nameController.text.trim().isEmpty ||
        _emailController.text.trim().isEmpty ||
        _locationController.text.trim().isEmpty ||
        _apiaryNameController.text.trim().isEmpty ||
        _phoneController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Please fill in all fields")),
      );
      return;
    }

    setState(() => _isSaving = true);

    try {
      final updatedProfile = UserProfile(
        name: _nameController.text.trim(),
        email: _emailController.text.trim(),
        location: _locationController.text.trim(),
        apiaryName: _apiaryNameController.text.trim(),
        phoneNumber: _phoneController.text.trim(),
        beekeepingType: _selectedBeekeepingType,
        experienceYears: _experienceYears,
        numberOfHives: _numberOfHives,
      );

      await ProfileService.saveUserProfile(updatedProfile);
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text("Profile saved successfully!"),
            backgroundColor: Colors.green,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text("Error saving profile: $e"),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isSaving = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return Scaffold(
        body: Row(
          children: [
            const AppSidebar(current: AppSection.settings),
            const Expanded(
              child: Center(
                child: CircularProgressIndicator(),
              ),
            ),
          ],
        ),
      );
    }

    return Scaffold(
      backgroundColor: Color(0xFFFEF7F0),
      body: Row(
        children: [
          const AppSidebar(current: AppSection.settings),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    "Profile Settings",
                    style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    "Manage your beekeeping profile information",
                    style: TextStyle(fontSize: 16, color: Colors.grey),
                  ),
                  const SizedBox(height: 24),

                  // Profile Form
                  Card(
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(24),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Personal Information
                          const Text(
                            "Personal Information",
                            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(height: 16),
                          
                          Row(
                            children: [
                              Expanded(
                                child: TextField(
                                  controller: _nameController,
                                  decoration: const InputDecoration(
                                    labelText: "Full Name",
                                    border: OutlineInputBorder(),
                                    prefixIcon: Icon(Icons.person),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 16),
                              Expanded(
                                child: TextField(
                                  controller: _emailController,
                                  keyboardType: TextInputType.emailAddress,
                                  decoration: const InputDecoration(
                                    labelText: "Email Address",
                                    border: OutlineInputBorder(),
                                    prefixIcon: Icon(Icons.email),
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),

                          // Location and Apiary
                          const Text(
                            "Location & Apiary",
                            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(height: 16),
                          
                          Row(
                            children: [
                              Expanded(
                                child: TextField(
                                  controller: _locationController,
                                  decoration: const InputDecoration(
                                    labelText: "Apiary Location",
                                    border: OutlineInputBorder(),
                                    prefixIcon: Icon(Icons.location_on),
                                    hintText: "e.g. Paso Robles, California",
                                  ),
                                ),
                              ),
                              const SizedBox(width: 16),
                              Expanded(
                                child: TextField(
                                  controller: _apiaryNameController,
                                  decoration: const InputDecoration(
                                    labelText: "Apiary Name",
                                    border: OutlineInputBorder(),
                                    prefixIcon: Icon(Icons.hive),
                                    hintText: "e.g. Golden Honey Apiary",
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),

                          TextField(
                            controller: _phoneController,
                            keyboardType: TextInputType.phone,
                            decoration: const InputDecoration(
                              labelText: "Phone Number",
                              border: OutlineInputBorder(),
                              prefixIcon: Icon(Icons.phone),
                            ),
                          ),
                          const SizedBox(height: 24),

                          // Beekeeping Information
                          const Text(
                            "Beekeeping Information",
                            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(height: 16),
                          
                          DropdownButtonFormField<String>(
                            initialValue: _selectedBeekeepingType,
                            decoration: const InputDecoration(
                              labelText: "Beekeeping Type",
                              border: OutlineInputBorder(),
                              prefixIcon: Icon(Icons.category),
                            ),
                            items: _beekeepingTypes.map((type) {
                              return DropdownMenuItem(
                                value: type,
                                child: Text(type),
                              );
                            }).toList(),
                            onChanged: (value) {
                              setState(() {
                                _selectedBeekeepingType = value!;
                              });
                            },
                          ),
                          const SizedBox(height: 16),

                          // Experience Years
                          Row(
                            children: [
                              const Icon(Icons.work_history),
                              const SizedBox(width: 12),
                              const Text("Beekeeping Experience: "),
                              Expanded(
                                child: Slider(
                                  value: _experienceYears.toDouble(),
                                  min: 0,
                                  max: 50,
                                  divisions: 50,
                                  label: "$_experienceYears years",
                                  onChanged: (value) {
                                    setState(() {
                                      _experienceYears = value.round();
                                    });
                                  },
                                ),
                              ),
                              Text("$_experienceYears years"),
                            ],
                          ),
                          const SizedBox(height: 16),

                          // Number of Hives
                          Row(
                            children: [
                              const Icon(Icons.hive),
                              const SizedBox(width: 12),
                              const Text("Number of Hives: "),
                              Expanded(
                                child: Slider(
                                  value: _numberOfHives.toDouble(),
                                  min: 1,
                                  max: 100,
                                  divisions: 99,
                                  label: "$_numberOfHives hives",
                                  onChanged: (value) {
                                    setState(() {
                                      _numberOfHives = value.round();
                                    });
                                  },
                                ),
                              ),
                              Text("$_numberOfHives hives"),
                            ],
                          ),
                          const SizedBox(height: 32),

                          // Save Button
                          SizedBox(
                            width: double.infinity,
                            child: ElevatedButton(
                              onPressed: _isSaving ? null : _saveProfile,
                              style: ElevatedButton.styleFrom(
                                minimumSize: const Size.fromHeight(50),
                                backgroundColor: Colors.blue,
                                foregroundColor: Colors.white,
                              ),
                              child: _isSaving
                                  ? const Row(
                                      mainAxisAlignment: MainAxisAlignment.center,
                                      children: [
                                        SizedBox(
                                          width: 20,
                                          height: 20,
                                          child: CircularProgressIndicator(
                                            color: Colors.white,
                                            strokeWidth: 2,
                                          ),
                                        ),
                                        SizedBox(width: 12),
                                        Text("Saving..."),
                                      ],
                                    )
                                  : const Text("Save Changes", style: TextStyle(fontSize: 16)),
                            ),
                          ),
                        ],
                      ),
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