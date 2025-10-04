import 'package:flutter/material.dart';
import 'sidebar.dart';
import 'package:intl/intl.dart';

class SchedulePage extends StatefulWidget {
  const SchedulePage({super.key});

  @override
  State<SchedulePage> createState() => _SchedulePageState();
}

class _SchedulePageState extends State<SchedulePage> {
  DateTime _selectedDate = DateTime.now();
  List<ScheduleActivity> _activities = [];

  @override
  void initState() {
    super.initState();
    _loadSampleActivities();
  }

  void _loadSampleActivities() {
    final today = DateTime.now();
    _activities = [
      ScheduleActivity(
        id: '1',
        title: 'Hive Inspection',
        description: 'Check hive health and queen status',
        date: today,
        time: '09:00',
        type: ActivityType.inspection,
      ),
      ScheduleActivity(
        id: '2',
        title: 'Honey Extraction',
        description: 'Extract honey from ready frames',
        date: today.add(const Duration(days: 2)),
        time: '14:00',
        type: ActivityType.harvest,
      ),
      ScheduleActivity(
        id: '3',
        title: 'Queen Introduction',
        description: 'Introduce new queen to weak hive',
        date: today.add(const Duration(days: 5)),
        time: '10:30',
        type: ActivityType.management,
      ),
      ScheduleActivity(
        id: '4',
        title: 'Feeding Session',
        description: 'Provide sugar syrup to hives',
        date: today.add(const Duration(days: 1)),
        time: '16:00',
        type: ActivityType.feeding,
      ),
    ];
  }

  void _addActivity() {
    showDialog(
      context: context,
      builder: (ctx) => _AddActivityDialog(
        selectedDate: _selectedDate,
        onActivityAdded: (activity) {
          setState(() {
            _activities.add(activity);
          });
        },
      ),
    );
  }

  List<ScheduleActivity> _getActivitiesForDate(DateTime date) {
    return _activities.where((activity) {
      return activity.date.year == date.year &&
          activity.date.month == date.month &&
          activity.date.day == date.day;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final activitiesForSelectedDate = _getActivitiesForDate(_selectedDate);
    
    return Scaffold(
      backgroundColor: Color(0xFFFEF7F0),
      body: Row(
        children: [
          const AppSidebar(current: AppSection.schedule),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Header
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        "Beekeeping Schedule",
                        style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                      ),
                      ElevatedButton.icon(
                        onPressed: _addActivity,
                        icon: const Icon(Icons.add),
                        label: const Text("Add Activity"),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.amber,
                          foregroundColor: Colors.black,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),

                  // Calendar
                  Expanded(
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Calendar Widget
                        Expanded(
                          flex: 2,
                          child: Card(
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(16),
                            ),
                            child: Padding(
                              padding: const EdgeInsets.all(16),
                              child: Column(
                                children: [
                                  // Month/Year Header
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    children: [
                                      IconButton(
                                        onPressed: () {
                                          setState(() {
                                            _selectedDate = DateTime(
                                              _selectedDate.year,
                                              _selectedDate.month - 1,
                                            );
                                          });
                                        },
                                        icon: const Icon(Icons.chevron_left),
                                      ),
                                      Text(
                                        DateFormat('MMMM yyyy').format(_selectedDate),
                                        style: const TextStyle(
                                          fontSize: 18,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                      IconButton(
                                        onPressed: () {
                                          setState(() {
                                            _selectedDate = DateTime(
                                              _selectedDate.year,
                                              _selectedDate.month + 1,
                                            );
                                          });
                                        },
                                        icon: const Icon(Icons.chevron_right),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 16),
                                  
                                  // Calendar Grid
                                  Expanded(
                                    child: _buildCalendar(),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 20),
                        
                        // Activities List
                        Expanded(
                          flex: 1,
                          child: Card(
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(16),
                            ),
                            child: Padding(
                              padding: const EdgeInsets.all(16),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    "Activities for ${DateFormat('MMM d, yyyy').format(_selectedDate)}",
                                    style: const TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  const SizedBox(height: 16),
                                  Expanded(
                                    child: activitiesForSelectedDate.isEmpty
                                        ? const Center(
                                            child: Text(
                                              "No activities scheduled",
                                              style: TextStyle(color: Colors.grey),
                                            ),
                                          )
                                        : ListView.builder(
                                            itemCount: activitiesForSelectedDate.length,
                                            itemBuilder: (context, index) {
                                              final activity = activitiesForSelectedDate[index];
                                              return _ActivityCard(activity: activity);
                                            },
                                          ),
                                  ),
                                ],
                              ),
                            ),
                          ),
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

  Widget _buildCalendar() {
    final firstDayOfMonth = DateTime(_selectedDate.year, _selectedDate.month, 1);
    final lastDayOfMonth = DateTime(_selectedDate.year, _selectedDate.month + 1, 0);
    final firstDayWeekday = firstDayOfMonth.weekday;
    final daysInMonth = lastDayOfMonth.day;
    
    final today = DateTime.now();
    
    return Column(
      children: [
        // Weekday headers
        Row(
          children: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
              .map((day) => Expanded(
                    child: Center(
                      child: Text(
                        day,
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                    ),
                  ))
              .toList(),
        ),
        const SizedBox(height: 8),
        
        // Calendar days
        Expanded(
          child: GridView.builder(
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 7,
              childAspectRatio: 1,
            ),
            itemCount: 42, // 6 weeks * 7 days
            itemBuilder: (context, index) {
              final dayNumber = index - firstDayWeekday + 2;
              final isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;
              final dayDate = isCurrentMonth
                  ? DateTime(_selectedDate.year, _selectedDate.month, dayNumber)
                  : null;
              
              final isToday = dayDate != null &&
                  dayDate.year == today.year &&
                  dayDate.month == today.month &&
                  dayDate.day == today.day;
              
              final hasActivities = dayDate != null &&
                  _getActivitiesForDate(dayDate).isNotEmpty;
              
              return GestureDetector(
                onTap: () {
                  if (isCurrentMonth) {
                    setState(() {
                      _selectedDate = dayDate!;
                    });
                  }
                },
                child: Container(
                  margin: const EdgeInsets.all(2),
                  decoration: BoxDecoration(
                    color: isToday
                        ? Colors.amber
                        : hasActivities
                            ? Colors.amber.withValues(alpha: 0.3)
                            : Colors.transparent,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(
                      color: isCurrentMonth ? Colors.grey : Colors.transparent,
                    ),
                  ),
                  child: Center(
                    child: Text(
                      isCurrentMonth ? dayNumber.toString() : '',
                      style: TextStyle(
                        fontWeight: isToday ? FontWeight.bold : FontWeight.normal,
                        color: isCurrentMonth ? Colors.black : Colors.grey,
                      ),
                    ),
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}

class _AddActivityDialog extends StatefulWidget {
  final DateTime selectedDate;
  final Function(ScheduleActivity) onActivityAdded;

  const _AddActivityDialog({
    required this.selectedDate,
    required this.onActivityAdded,
  });

  @override
  State<_AddActivityDialog> createState() => _AddActivityDialogState();
}

class _AddActivityDialogState extends State<_AddActivityDialog> {
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _timeController = TextEditingController();
  ActivityType _selectedType = ActivityType.inspection;

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    _timeController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text("Add Activity"),
      content: SizedBox(
        width: 300,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: _titleController,
              decoration: const InputDecoration(
                labelText: "Activity Title",
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _descriptionController,
              decoration: const InputDecoration(
                labelText: "Description",
                border: OutlineInputBorder(),
              ),
              maxLines: 2,
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _timeController,
              decoration: const InputDecoration(
                labelText: "Time (HH:MM)",
                border: OutlineInputBorder(),
                hintText: "09:00",
              ),
            ),
            const SizedBox(height: 16),
            DropdownButtonFormField<ActivityType>(
              initialValue: _selectedType,
              decoration: const InputDecoration(
                labelText: "Activity Type",
                border: OutlineInputBorder(),
              ),
              items: ActivityType.values.map((type) {
                return DropdownMenuItem(
                  value: type,
                  child: Row(
                    children: [
                      Container(
                        width: 12,
                        height: 12,
                        decoration: BoxDecoration(
                          color: _getActivityColor(type),
                          shape: BoxShape.circle,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text(_getActivityTypeName(type)),
                    ],
                  ),
                );
              }).toList(),
              onChanged: (value) {
                setState(() {
                  _selectedType = value!;
                });
              },
            ),
          ],
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: const Text("Cancel"),
        ),
        TextButton(
          onPressed: () {
            if (_titleController.text.isNotEmpty) {
              final activity = ScheduleActivity(
                id: DateTime.now().millisecondsSinceEpoch.toString(),
                title: _titleController.text,
                description: _descriptionController.text,
                date: widget.selectedDate,
                time: _timeController.text,
                type: _selectedType,
              );
              widget.onActivityAdded(activity);
              Navigator.pop(context);
            }
          },
          child: const Text("Add"),
        ),
      ],
    );
  }

  String _getActivityTypeName(ActivityType type) {
    switch (type) {
      case ActivityType.inspection:
        return "Hive Inspection";
      case ActivityType.harvest:
        return "Honey Harvest";
      case ActivityType.management:
        return "Hive Management";
      case ActivityType.feeding:
        return "Feeding";
      case ActivityType.cleaning:
        return "Cleaning";
    }
  }

  Color _getActivityColor(ActivityType type) {
    switch (type) {
      case ActivityType.inspection:
        return Colors.blue;
      case ActivityType.harvest:
        return Colors.amber;
      case ActivityType.management:
        return Colors.green;
      case ActivityType.feeding:
        return Colors.orange;
      case ActivityType.cleaning:
        return Colors.purple;
    }
  }
}

class _ActivityCard extends StatelessWidget {
  final ScheduleActivity activity;

  const _ActivityCard({required this.activity});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: _getActivityColor(activity.type).withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(
          color: _getActivityColor(activity.type),
          width: 2,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 8,
                height: 8,
                decoration: BoxDecoration(
                  color: _getActivityColor(activity.type),
                  shape: BoxShape.circle,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  activity.title,
                  style: const TextStyle(fontWeight: FontWeight.bold),
                ),
              ),
              Text(
                activity.time,
                style: const TextStyle(fontSize: 12, color: Colors.grey),
              ),
            ],
          ),
          if (activity.description.isNotEmpty) ...[
            const SizedBox(height: 4),
            Text(
              activity.description,
              style: const TextStyle(fontSize: 12, color: Colors.grey),
            ),
          ],
        ],
      ),
    );
  }

  Color _getActivityColor(ActivityType type) {
    switch (type) {
      case ActivityType.inspection:
        return Colors.blue;
      case ActivityType.harvest:
        return Colors.amber;
      case ActivityType.management:
        return Colors.green;
      case ActivityType.feeding:
        return Colors.orange;
      case ActivityType.cleaning:
        return Colors.purple;
    }
  }
}

class ScheduleActivity {
  final String id;
  final String title;
  final String description;
  final DateTime date;
  final String time;
  final ActivityType type;

  ScheduleActivity({
    required this.id,
    required this.title,
    required this.description,
    required this.date,
    required this.time,
    required this.type,
  });
}

enum ActivityType {
  inspection,
  harvest,
  management,
  feeding,
  cleaning,
}