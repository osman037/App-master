import 'package:flutter/material.dart';

class SidebarDrawer extends StatelessWidget {
  final Function(String) onNavigate;
  final VoidCallback onClose;

  SidebarDrawer({
    required this.onNavigate,
    required this.onClose,
  });

  final List<Map<String, dynamic>> menuItems = [
    {
      'id': 'home',
      'title': 'Home',
      'icon': Icons.home,
      'color': Colors.blue,
    },
    {
      'id': 'progress',
      'title': 'Progress & Stats',
      'icon': Icons.trending_up,
      'color': Colors.green,
    },
    {
      'id': 'recovery',
      'title': 'Recovery Guide',
      'icon': Icons.book,
      'color': Colors.purple,
    },
    {
      'id': 'habits',
      'title': 'Habit Settings',
      'icon': Icons.settings,
      'color': Colors.orange,
    },
    {
      'id': 'triggers',
      'title': 'Trigger Records',
      'icon': Icons.warning,
      'color': Colors.red,
    },
    {
      'id': 'quotes',
      'title': 'Motivational Quotes',
      'icon': Icons.format_quote,
      'color': Colors.teal,
    },
    {
      'id': 'about',
      'title': 'About Us',
      'icon': Icons.info,
      'color': Colors.indigo,
    },
  ];

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    
    return Drawer(
      backgroundColor: theme.scaffoldBackgroundColor,
      child: Column(
        children: [
          Container(
            height: 200,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: isDark 
                  ? [Color(0xFF1A1A2E), Color(0xFF16213E)]
                  : [Color(0xFF6C63FF), Color(0xFF5A52E8)],
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
              ),
            ),
            child: SafeArea(
              child: Padding(
                padding: EdgeInsets.all(20),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      width: 80,
                      height: 80,
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.2),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        Icons.self_improvement,
                        size: 40,
                        color: Colors.white,
                      ),
                    ),
                    SizedBox(height: 15),
                    Text(
                      'NofapJourney',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      'Your Path to Freedom',
                      style: TextStyle(
                        color: Colors.white70,
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          Expanded(
            child: ListView.builder(
              padding: EdgeInsets.symmetric(vertical: 10),
              itemCount: menuItems.length,
              itemBuilder: (context, index) {
                final item = menuItems[index];
                return Container(
                  margin: EdgeInsets.symmetric(horizontal: 10, vertical: 2),
                  child: ListTile(
                    leading: Container(
                      padding: EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: item['color'].withOpacity(0.1),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Icon(
                        item['icon'],
                        color: item['color'],
                        size: 24,
                      ),
                    ),
                    title: Text(
                      item['title'],
                      style: theme.textTheme.bodyLarge?.copyWith(
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    onTap: () {
                      onNavigate(item['id']);
                      onClose();
                    },
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    hoverColor: item['color'].withOpacity(0.1),
                  ),
                );
              },
            ),
          ),
          Container(
            padding: EdgeInsets.all(20),
            child: Column(
              children: [
                Divider(),
                SizedBox(height: 10),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.favorite,
                      color: Colors.red,
                      size: 16,
                    ),
                    SizedBox(width: 5),
                    Text(
                      'Made with love for your journey',
                      style: theme.textTheme.bodySmall?.copyWith(
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 5),
                Text(
                  'Version 1.0.0',
                  style: theme.textTheme.bodySmall?.copyWith(
                    fontSize: 10,
                    color: Colors.grey,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}