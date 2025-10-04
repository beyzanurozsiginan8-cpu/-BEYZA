import 'package:flutter/material.dart';
import 'user_model.dart';
import 'profile_service.dart';
import 'home_page.dart';

class SignupPage extends StatefulWidget {
  const SignupPage({super.key});

  @override
  State<SignupPage> createState() => _SignupPageState();
}

class _SignupPageState extends State<SignupPage> {
  // Form controllers
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _locationController = TextEditingController();
  final _apiaryNameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();

  // State variables
  String _selectedBeekeepingType = 'Hobby Beekeeping';
  String _selectedCountryCode = '+1';
  int _experienceYears = 1;
  int _numberOfHives = 1;
  bool _isLoading = false;
  bool _obscurePassword = true;
  bool _obscureConfirmPassword = true;

  final List<String> _beekeepingTypes = [
    'Hobby Beekeeping',
    'Commercial Beekeeping',
    'Pollination Services',
    'Honey Production',
    'Queen Bee Breeding',
    'Educational Beekeeping',
  ];

  final List<Map<String, String>> _countryCodes = [
      {'code': '+1', 'country': 'US/Canada'},  // Keep only one +1 entry
      {'code': '+7', 'country': 'Russia/Kazakhstan'},  // Combine +7 countries
      {'code': '+20', 'country': 'Egypt'},
      {'code': '+27', 'country': 'South Africa'},
      {'code': '+30', 'country': 'Greece'},
      {'code': '+31', 'country': 'Netherlands'},
      {'code': '+32', 'country': 'Belgium'},
      {'code': '+33', 'country': 'France'},
      {'code': '+34', 'country': 'Spain'},
      {'code': '+36', 'country': 'Hungary'},
      {'code': '+39', 'country': 'Italy'},
      {'code': '+40', 'country': 'Romania'},
      {'code': '+41', 'country': 'Switzerland'},
      {'code': '+43', 'country': 'Austria'},
      {'code': '+44', 'country': 'United Kingdom'},
      {'code': '+45', 'country': 'Denmark'},
      {'code': '+46', 'country': 'Sweden'},
      {'code': '+47', 'country': 'Norway'},
      {'code': '+48', 'country': 'Poland'},
      {'code': '+49', 'country': 'Germany'},
      {'code': '+51', 'country': 'Peru'},
      {'code': '+52', 'country': 'Mexico'},
      {'code': '+54', 'country': 'Argentina'},
      {'code': '+55', 'country': 'Brazil'},
      {'code': '+56', 'country': 'Chile'},
      {'code': '+57', 'country': 'Colombia'},
      {'code': '+58', 'country': 'Venezuela'},
      {'code': '+60', 'country': 'Malaysia'},
      {'code': '+61', 'country': 'Australia'},
      {'code': '+62', 'country': 'Indonesia'},
      {'code': '+63', 'country': 'Philippines'},
      {'code': '+64', 'country': 'New Zealand'},
      {'code': '+65', 'country': 'Singapore'},
      {'code': '+66', 'country': 'Thailand'},
      {'code': '+81', 'country': 'Japan'},
      {'code': '+82', 'country': 'South Korea'},
      {'code': '+84', 'country': 'Vietnam'},
      {'code': '+86', 'country': 'China'},
      {'code': '+90', 'country': 'Turkey'},
      {'code': '+91', 'country': 'India'},
      {'code': '+92', 'country': 'Pakistan'},
      {'code': '+93', 'country': 'Afghanistan'},
      {'code': '+94', 'country': 'Sri Lanka'},
      {'code': '+98', 'country': 'Iran'},
      {'code': '+212', 'country': 'Morocco'},
      {'code': '+213', 'country': 'Algeria'},
      {'code': '+216', 'country': 'Tunisia'},
      {'code': '+218', 'country': 'Libya'},
      {'code': '+221', 'country': 'Senegal'},
      {'code': '+223', 'country': 'Mali'},
      {'code': '+225', 'country': 'Côte d\'Ivoire'},
      {'code': '+226', 'country': 'Burkina Faso'},
      {'code': '+227', 'country': 'Niger'},
      {'code': '+228', 'country': 'Togo'},
      {'code': '+229', 'country': 'Benin'},
      {'code': '+230', 'country': 'Mauritius/Seychelles'},
      {'code': '+233', 'country': 'Ghana'},
      {'code': '+234', 'country': 'Nigeria'},
      {'code': '+249', 'country': 'Sudan'},
      {'code': '+250', 'country': 'Rwanda'},
      {'code': '+251', 'country': 'Ethiopia'},
      {'code': '+254', 'country': 'Kenya'},
      {'code': '+255', 'country': 'Tanzania'},
      {'code': '+256', 'country': 'Uganda'},
      {'code': '+257', 'country': 'Burundi'},
      {'code': '+261', 'country': 'Madagascar'},
      {'code': '+351', 'country': 'Portugal'},
      {'code': '+358', 'country': 'Finland'},
      {'code': '+359', 'country': 'Bulgaria'},
      {'code': '+385', 'country': 'Croatia'},
      {'code': '+386', 'country': 'Slovenia'},
      {'code': '+420', 'country': 'Czech Republic'},
      {'code': '+421', 'country': 'Slovakia'},
      {'code': '+502', 'country': 'Guatemala'},
      {'code': '+503', 'country': 'El Salvador'},
      {'code': '+504', 'country': 'Honduras'},
      {'code': '+505', 'country': 'Nicaragua'},
      {'code': '+506', 'country': 'Costa Rica'},
      {'code': '+507', 'country': 'Panama'},
      {'code': '+591', 'country': 'Bolivia'},
      {'code': '+593', 'country': 'Ecuador'},
      {'code': '+595', 'country': 'Paraguay'},
      {'code': '+598', 'country': 'Uruguay'},
      {'code': '+852', 'country': 'Hong Kong'},
      {'code': '+853', 'country': 'Macau'},
      {'code': '+880', 'country': 'Bangladesh'},
      {'code': '+886', 'country': 'Taiwan'},
      {'code': '+964', 'country': 'Iraq'},
      {'code': '+965', 'country': 'Kuwait'},
      {'code': '+966', 'country': 'Saudi Arabia'},
      {'code': '+967', 'country': 'Yemen'},
      {'code': '+968', 'country': 'Oman'},
      {'code': '+971', 'country': 'UAE'},
      {'code': '+973', 'country': 'Bahrain'},
      {'code': '+974', 'country': 'Qatar'},
      {'code': '+975', 'country': 'Bhutan'},
      {'code': '+977', 'country': 'Nepal'},
      {'code': '+992', 'country': 'Tajikistan'},
      {'code': '+993', 'country': 'Turkmenistan'},
      {'code': '+996', 'country': 'Kyrgyzstan'},
      {'code': '+998', 'country': 'Uzbekistan'},
  ];

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _locationController.dispose();
    _apiaryNameController.dispose();
    _phoneController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  Future<void> _signup() async {
    if (!_formKey.currentState!.validate()) return;

    if (_passwordController.text != _confirmPasswordController.text) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Passwords don't match")),
      );
      return;
    }

    setState(() => _isLoading = true);

    try {
      await Future.delayed(const Duration(seconds: 2)); // Simulate API call

      final profile = UserProfile(
        name: _nameController.text.trim(),
        email: _emailController.text.trim(),
        location: _locationController.text.trim(),
        apiaryName: _apiaryNameController.text.trim(),
        phoneNumber: '$_selectedCountryCode${_phoneController.text.trim()}',
        beekeepingType: _selectedBeekeepingType,
        experienceYears: _experienceYears,
        numberOfHives: _numberOfHives,
      );

      await ProfileService.saveUserProfile(profile);

      if (!mounted) return;

      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => const HomePage()),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Signup failed. Please try again.")),
      );
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFFFEF7F0),
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Container(
            constraints: const BoxConstraints(maxWidth: 500),
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 6)],
            ),
            child: Form(
              key: _formKey,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    "🐝 BloomBee Signup",
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFFFF6B8A),
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    "Join the smart beekeeping community",
                    style: TextStyle(color: Colors.grey[600]),
                  ),
                  const SizedBox(height: 24),

                  // Full Name
                  TextFormField(
                    controller: _nameController,
                    decoration: const InputDecoration(
                      labelText: "Full Name",
                      border: OutlineInputBorder(),
                      prefixIcon: Icon(Icons.person),
                    ),
                    validator: (value) {
                      if (value == null || value.trim().isEmpty) {
                        return "Please enter your name";
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 16),

                  // Email
                  TextFormField(
                    controller: _emailController,
                    keyboardType: TextInputType.emailAddress,
                    decoration: const InputDecoration(
                      labelText: "Email Address",
                      border: OutlineInputBorder(),
                      prefixIcon: Icon(Icons.email),
                    ),
                    validator: (value) {
                      if (value == null || value.trim().isEmpty) {
                        return "Please enter your email";
                      }
                      if (!value.contains('@')) {
                        return "Please enter a valid email";
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 16),

                  // Location
                  TextFormField(
                    controller: _locationController,
                    decoration: const InputDecoration(
                      labelText: "Apiary Location",
                      border: OutlineInputBorder(),
                      prefixIcon: Icon(Icons.location_on),
                      hintText: "e.g. Paso Robles, California",
                    ),
                    validator: (value) {
                      if (value == null || value.trim().isEmpty) {
                        return "Please enter your apiary location";
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 16),

                  // Apiary Name
                  TextFormField(
                    controller: _apiaryNameController,
                    decoration: const InputDecoration(
                      labelText: "Apiary Name",
                      border: OutlineInputBorder(),
                      prefixIcon: Icon(Icons.hive),
                      hintText: "e.g. Golden Honey Apiary",
                    ),
                    validator: (value) {
                      if (value == null || value.trim().isEmpty) {
                        return "Please enter your apiary name";
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 16),

                  // Phone Number with Country Code
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "Phone Number",
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.grey[600],
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          // Country Code Dropdown
                          Container(
                            width: 120,
                            padding: const EdgeInsets.symmetric(horizontal: 12),
                            decoration: BoxDecoration(
                              border: Border.all(color: Colors.grey.shade400),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: DropdownButtonHideUnderline(
                              child: DropdownButton<String>(
                                value: _selectedCountryCode,
                                isExpanded: true,
                                icon: Icon(Icons.keyboard_arrow_down, color: Colors.grey.shade600),
                                items: _countryCodes.map((country) {
                                  return DropdownMenuItem<String>(
                                    value: country['code'],
                                    child: Row(
                                      children: [
                                        Text(
                                          country['code']!,
                                          style: TextStyle(fontWeight: FontWeight.w600),
                                        ),
                                        const SizedBox(width: 4),
                                        Flexible(
                                          child: Text(
                                            country['country']!,
                                            style: TextStyle(
                                              fontSize: 12,
                                              color: Colors.grey.shade600,
                                            ),
                                            overflow: TextOverflow.ellipsis,
                                          ),
                                        ),
                                      ],
                                    ),
                                  );
                                }).toList(),
                                onChanged: (value) {
                                  setState(() {
                                    _selectedCountryCode = value!;
                                  });
                                },
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          // Phone Number Input
                          Expanded(
                            child: TextFormField(
                              controller: _phoneController,
                              keyboardType: TextInputType.phone,
                              decoration: InputDecoration(
                                labelText: "Phone Number",
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                prefixIcon: Icon(Icons.phone),
                                hintText: "1234567890",
                                helperText: "Enter number without country code",
                              ),
                              validator: (value) {
                                if (value == null || value.trim().isEmpty) {
                                  return "Please enter your phone number";
                                }
                                if (value.length < 7) {
                                  return "Please enter a valid phone number";
                                }
                                return null;
                              },
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  // Beekeeping Type
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

                  // Password
                  TextFormField(
                    controller: _passwordController,
                    obscureText: _obscurePassword,
                    decoration: InputDecoration(
                      labelText: "Password",
                      border: const OutlineInputBorder(),
                      prefixIcon: const Icon(Icons.lock),
                      suffixIcon: IconButton(
                        icon: Icon(_obscurePassword ? Icons.visibility : Icons.visibility_off),
                        onPressed: () {
                          setState(() {
                            _obscurePassword = !_obscurePassword;
                          });
                        },
                      ),
                    ),
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return "Please enter a password";
                      }
                      if (value.length < 6) {
                        return "Password must be at least 6 characters";
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 16),

                  // Confirm Password
                  TextFormField(
                    controller: _confirmPasswordController,
                    obscureText: _obscureConfirmPassword,
                    decoration: InputDecoration(
                      labelText: "Confirm Password",
                      border: const OutlineInputBorder(),
                      prefixIcon: const Icon(Icons.lock_outline),
                      suffixIcon: IconButton(
                        icon: Icon(_obscureConfirmPassword ? Icons.visibility : Icons.visibility_off),
                        onPressed: () {
                          setState(() {
                            _obscureConfirmPassword = !_obscureConfirmPassword;
                          });
                        },
                      ),
                    ),
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return "Please confirm your password";
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 24),

                  // Signup Button
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: _isLoading ? null : _signup,
                      style: ElevatedButton.styleFrom(
                        minimumSize: const Size.fromHeight(50),
                        backgroundColor: Color(0xFFFF6B8A),
                        foregroundColor: Colors.white,
                      ),
                      child: _isLoading
                          ? const CircularProgressIndicator(color: Colors.white)
                          : const Text("Create Account", style: TextStyle(fontSize: 16)),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Login Link
                  TextButton(
                    onPressed: () => Navigator.pop(context),
                    child: const Text("Already have an account? Login"),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}