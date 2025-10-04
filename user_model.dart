class UserProfile {
  final String name;
  final String email;
  final String location;
  final String apiaryName;
  final String phoneNumber;
  final String beekeepingType;
  final int experienceYears;
  final int numberOfHives;

  const UserProfile({
    required this.name,
    required this.email,
    required this.location,
    required this.apiaryName,
    required this.phoneNumber,
    required this.beekeepingType,
    required this.experienceYears,
    required this.numberOfHives,
  });

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'email': email,
      'location': location,
      'apiaryName': apiaryName,
      'phoneNumber': phoneNumber,
      'beekeepingType': beekeepingType,
      'experienceYears': experienceYears,
      'numberOfHives': numberOfHives,
    };
  }

  factory UserProfile.fromJson(Map<String, dynamic> json) {
    return UserProfile(
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      location: json['location'] ?? '',
      apiaryName: json['apiaryName'] ?? '',
      phoneNumber: json['phoneNumber'] ?? '',
      beekeepingType: json['beekeepingType'] ?? '',
      experienceYears: json['experienceYears'] ?? 0,
      numberOfHives: json['numberOfHives'] ?? 0,
    );
  }
}
