import 'package:flutter/material.dart';
import 'sidebar.dart';

class LearningPage extends StatelessWidget {
  const LearningPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFFFEF7F0),
      body: Row(
        children: [
          const AppSidebar(current: AppSection.learning),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    "Beekeeping Learning Center",
                    style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    "Essential knowledge for successful beekeeping",
                    style: TextStyle(fontSize: 16, color: Colors.grey),
                  ),
                  const SizedBox(height: 24),

                  // Articles Grid
                  GridView.count(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    crossAxisCount: 2,
                    crossAxisSpacing: 16,
                    mainAxisSpacing: 16,
                    childAspectRatio: 1.2,
                    children: [
                      _ArticleCard(
                        title: "Understanding Blooming Seasons",
                        description: "Learn how different flowering seasons affect your bees and honey production",
                        icon: Icons.local_florist,
                        color: Colors.pink,
                        onTap: () => _showArticle(context, "blooming"),
                      ),
                      _ArticleCard(
                        title: "Beekeeping 101",
                        description: "Essential guide for beginners starting their beekeeping journey",
                        icon: Icons.school,
                        color: Colors.blue,
                        onTap: () => _showArticle(context, "beekeeping101"),
                      ),
                      _ArticleCard(
                        title: "Best Flowers for Honey",
                        description: "Discover which flowers produce the best quality and quantity of honey",
                        icon: Icons.eco,
                        color: Colors.green,
                        onTap: () => _showArticle(context, "flowers"),
                      ),
                      _ArticleCard(
                        title: "Climate Change Impact",
                        description: "How climate change affects blooming seasons and beekeeping practices",
                        icon: Icons.wb_sunny,
                        color: Colors.orange,
                        onTap: () => _showArticle(context, "climate"),
                      ),
                      _ArticleCard(
                        title: "Bee Allergies & Safety",
                        description: "Important safety information about bee allergies and protection",
                        icon: Icons.health_and_safety,
                        color: Colors.red,
                        onTap: () => _showArticle(context, "allergies"),
                      ),
                      _ArticleCard(
                        title: "Hive Management",
                        description: "Advanced techniques for managing healthy and productive hives",
                        icon: Icons.build,
                        color: Colors.purple,
                        onTap: () => _showArticle(context, "management"),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _showArticle(BuildContext context, String articleType) {
    String title = "";
    String content = "";

    switch (articleType) {
      case "blooming":
        title = "Understanding Blooming Seasons";
        content = """
🌸 The Importance of Blooming Seasons in Beekeeping

Blooming seasons are the foundation of successful beekeeping. Understanding when different flowers bloom helps you:

• Plan your beekeeping activities around nectar flows
• Choose the best locations for your apiaries
• Predict honey production and quality
• Manage hive populations effectively

Key Blooming Periods:
• Spring (March-May): Fruit trees, dandelions, clover
• Summer (June-August): Wildflowers, sunflowers, lavender
• Fall (September-November): Goldenrod, aster, ivy

Pro Tips:
- Track local flowering calendars for your region
- Plant bee-friendly flowers in your garden
- Monitor weather patterns that affect blooming
- Keep records of nectar flows and honey yields

Remember: Different flowers produce different types of honey with unique flavors and colors!
        """;
        break;
      case "beekeeping101":
        title = "Beekeeping 101: Getting Started";
        content = """
🐝 Essential Beekeeping Basics

Starting your beekeeping journey? Here's what you need to know:

Equipment Essentials:
• Hive boxes (Langstroth, Top-bar, or Warre)
• Frames and foundation
• Smoker and fuel
• Hive tool and bee brush
• Protective suit and gloves
• Feeder for sugar syrup

First Steps:
1. Choose your hive location carefully
2. Order your bees (package or nuc)
3. Install your first colony
4. Learn to inspect hives safely
5. Understand bee behavior and communication

Safety First:
- Always wear protective gear
- Work during warm, sunny days
- Use smoke to calm bees
- Move slowly and deliberately
- Have an escape plan ready

Common Beginner Mistakes:
- Over-inspecting hives
- Not feeding new colonies
- Ignoring queen health
- Poor hive placement
- Inadequate winter preparation

Remember: Beekeeping is a learning process. Start small and grow your knowledge with experience!
        """;
        break;
      case "flowers":
        title = "Best Flowers for Honey Production";
        content = """
🌻 Top Flowers for Quality Honey

Not all flowers are created equal when it comes to honey production. Here are the best:

High-Yield Flowers:
• Clover (White & Red): Mild, light honey
• Lavender: Distinctive flavor, popular with consumers
• Sunflower: Large quantities, golden color
• Wildflower mixes: Complex, unique flavors

Premium Quality Flowers:
• Orange blossom: Citrusy, highly sought after
• Acacia: Light, delicate, slow to crystallize
• Manuka: Medicinal properties, premium price
• Heather: Strong flavor, thick consistency

Regional Favorites:
• California: Orange blossom, avocado
• Midwest: Clover, alfalfa
• Southeast: Tupelo, sourwood
• Northeast: Blueberry, basswood

Planting for Bees:
- Choose native flowers when possible
- Plant in groups for better foraging
- Ensure continuous bloom throughout season
- Avoid pesticides and herbicides
- Provide water sources nearby

Pro Tip: The best honey comes from diverse flower sources, creating complex and unique flavor profiles!
        """;
        break;
      case "climate":
        title = "Climate Change & Beekeeping";
        content = """
🌡️ Climate Change Impact on Beekeeping

Climate change is significantly affecting beekeeping worldwide:

Temperature Changes:
• Earlier spring blooms disrupt bee cycles
• Extreme heat stresses colonies
• Warmer winters affect hibernation patterns
• Shifting bloom times confuse foraging schedules

Weather Extremes:
• Drought reduces nectar availability
• Heavy rains wash away pollen
• Storms damage hives and flowers
• Unpredictable weather makes planning difficult

Adaptation Strategies:
• Monitor local climate data
• Plant drought-resistant flowers
• Provide shade and water sources
• Adjust hive management timing
• Consider migratory beekeeping

Regional Impacts:
• Northern regions: Longer growing seasons
• Southern regions: Increased heat stress
• Coastal areas: Rising sea levels affect forage
• Mountain regions: Shifting elevation zones

What You Can Do:
- Track weather patterns and bloom times
- Plant climate-resilient flowers
- Provide artificial water sources
- Adjust feeding schedules
- Share data with local beekeeping groups

Remember: Adaptation is key to successful beekeeping in a changing climate!
        """;
        break;
      case "allergies":
        title = "Bee & Pollen Allergies & Safety";
        content = """
⚠️ Important Safety Information

Bee stings and pollen allergies can be dangerous for those with sensitivities. Here's what you need to know:

BEE STING ALLERGIES:
Allergic Reactions:
• Mild: Localized swelling, redness, itching
• Moderate: Larger swelling, hives, nausea
• Severe (Anaphylaxis): Difficulty breathing, rapid pulse, loss of consciousness

POLLEN ALLERGIES:
Common Symptoms:
• Sneezing, runny nose, nasal congestion
• Itchy, watery eyes
• Scratchy throat and cough
• Skin rashes or hives
• Asthma-like symptoms (wheezing, shortness of breath)

Seasonal Pollen Sources:
• Spring: Tree pollen (oak, birch, maple)
• Summer: Grass pollen (timothy, rye, bluegrass)
• Fall: Weed pollen (ragweed, goldenrod, sagebrush)
• Year-round: Mold spores in damp areas

Safety Precautions:
• Always wear protective gear
• Have an EpiPen available if allergic to stings
• Carry antihistamines for pollen allergies
• Work with a partner when possible
• Keep emergency contact information handy
• Learn CPR and first aid

Protective Equipment:
• Full bee suit with veil
• Thick gloves (leather recommended)
• Closed-toe shoes
• Light-colored clothing
• Avoid perfumes and scented products
• Consider wearing a mask during high pollen seasons

Emergency Response for Stings:
1. Remove stinger quickly (scrape, don't pinch)
2. Apply ice to reduce swelling
3. Monitor for allergic reactions
4. Call emergency services if severe
5. Use EpiPen if prescribed

Pollen Allergy Management:
• Check daily pollen counts
• Take antihistamines before exposure
• Use nasal sprays as needed
• Shower after beekeeping sessions
• Keep windows closed during high pollen days
• Consider immunotherapy for severe allergies

Prevention Tips:
- Work during calm weather
- Use smoke to calm bees
- Move slowly and deliberately
- Avoid sudden movements
- Keep hives well-maintained
- Monitor pollen forecasts
- Plan activities around low-pollen times

Remember: Safety first! Never work alone if you have known allergies to bee stings or severe pollen allergies.
        """;
        break;
      case "management":
        title = "Advanced Hive Management";
        content = """
🔧 Professional Hive Management Techniques

Master these advanced techniques for healthy, productive hives:

Seasonal Management:
• Spring: Population building, swarm prevention
• Summer: Honey production, queen rearing
• Fall: Winter preparation, feeding
• Winter: Minimal disturbance, monitoring

Queen Management:
• Regular queen inspections
• Marking queens for easy identification
• Requeening weak or failing queens
• Raising your own queens
• Understanding queen genetics

Disease Prevention:
• Regular hive inspections
• Proper sanitation practices
• Varroa mite monitoring and treatment
• Nosema detection and control
• American Foulbrood prevention

Swarm Prevention:
• Provide adequate space
• Remove queen cells when found
• Split strong colonies
• Requeen aggressive colonies
• Monitor population growth

Honey Production:
• Super management and timing
• Frame rotation techniques
• Extraction best practices
• Storage and bottling
• Quality control methods

Record Keeping:
- Hive inspection logs
- Weather and bloom data
- Honey production records
- Treatment schedules
- Queen performance tracking

Pro Tip: Consistent management practices lead to healthier hives and better honey production!
        """;
        break;
    }

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text(title),
        content: SizedBox(
          width: 500,
          height: 400,
          child: SingleChildScrollView(
            child: Text(
              content,
              style: const TextStyle(fontSize: 14, height: 1.5),
            ),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text("Close"),
          ),
        ],
      ),
    );
  }
}

class _ArticleCard extends StatelessWidget {
  final String title;
  final String description;
  final IconData icon;
  final Color color;
  final VoidCallback onTap;

  const _ArticleCard({
    required this.title,
    required this.description,
    required this.icon,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(16),
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
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      title,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Text(
                description,
                style: const TextStyle(
                  fontSize: 14,
                  color: Colors.grey,
                  height: 1.4,
                ),
              ),
              const Spacer(),
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  Text(
                    "Read More",
                    style: TextStyle(
                      color: color,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(width: 4),
                  Icon(Icons.arrow_forward, color: color, size: 16),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
