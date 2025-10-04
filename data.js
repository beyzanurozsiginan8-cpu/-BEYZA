// Constants for phenology tracking
const FLOWERING_MONTHS = {
    JANUARY: 1, FEBRUARY: 2, MARCH: 3, APRIL: 4, MAY: 5, JUNE: 6,
    JULY: 7, AUGUST: 8, SEPTEMBER: 9, OCTOBER: 10, NOVEMBER: 11, DECEMBER: 12
};

const POLLINATOR_TYPES = {
    BEES: 'bees',
    BUTTERFLIES: 'butterflies', 
    BIRDS: 'birds',
    BEETLES: 'beetles',
    WIND: 'wind'
};

const THREAT_LEVELS = {
    LOW: 'low',
    MODERATE: 'moderate', 
    HIGH: 'high',
    CRITICAL: 'critical'
};

// Plant species data - will be loaded from GBIF and CSV files
const plantData = [
    {
        id: 1,
        name: "Lavender (Lavandula angustifolia)",
        scientificName: "Lavandula angustifolia",
        coordinates: [],
        characteristics: {
            allergyRisk: "Low",
            allergyScore: 2,
            honeyProduction: "High",
            honeyScore: 8,
            climateSensitivity: "Moderate",
            climateScore: 5,
            benefits: "High",
            benefitsScore: 8,
            threats: "Low",
            threatsScore: 3
        },
        description: "Lavender is a fragrant plant that grows in the Mediterranean climate. It is valuable for beekeping.",
        phenology: {
            floweringPeriod: {
                early: { month: FLOWERING_MONTHS.MAY, day: 15 },
                peak: { month: FLOWERING_MONTHS.JULY, day: 1 },
                late: { month: FLOWERING_MONTHS.SEPTEMBER, day: 15 }
            },
            seasonalCalendar: [
                { month: 'May', phase: 'Early Bloom', intensity: 30 },
                { month: 'June', phase: 'Increase in Bloom', intensity: 70 },
                { month: 'July', phase: 'Peak Bloom', intensity: 100 },
                { month: 'August', phase: 'Continue in Bloom', intensity: 85 },
                { month: 'September', phase: 'Late Bloom', intensity: 40 }
            ],
            multiyearTrends: {
                nasaLandsatData: {
                    2020: { peakDate: '2020-07-05', intensity: 95, anomaly: false },
                    2021: { peakDate: '2021-06-28', intensity: 88, anomaly: true, note: 'Early Bloom' },
                    2022: { peakDate: '2022-07-12', intensity: 92, anomaly: false },
                    2023: { peakDate: '2023-07-01', intensity: 97, anomaly: false },
                    2024: { peakDate: '2024-06-25', intensity: 85, anomaly: true, note: 'Climate change impact' }
                },
                modisVegetationIndex: {
                    averageNDVI: 0.78,
                    trend: 'stable',
                    climateImpact: 'moderate'
                }
            },
            pollinatorInteractions: {
                primaryPollinators: [POLLINATOR_TYPES.BEES, POLLINATOR_TYPES.BUTTERFLIES],
                pollinatorSynchronization: {
                    bees: { syncRate: 95, peakActivity: 'July' },
                    butterflies: { syncRate: 80, peakActivity: 'August' },
                    birds: { syncRate: 20, peakActivity: 'June' }
                },
                pollinatorDeficitRisk: {
                    level: THREAT_LEVELS.LOW,
                    factors: ['Bee population is stable', 'Butterfly diversity is high'],
                    riskScore: 2
                }
            },
            invasiveSpeciesAlert: {
                threatLevel: THREAT_LEVELS.LOW,
                competitorSpecies: [],
                nativeEcosystemImpact: 'Minimal'
            },
            agricultureEconomics: {
                floweringHarvestTiming: {
                    optimalHarvest: 'the end of July - the beginning of August',
                    yieldPrediction: 'High',
                    economicValue: 175 // €/dönüm
                },
                diseaseRisks: {
                    postFloweringRisks: ['Fungal infections', 'Lavender beetle'],
                    riskLevel: THREAT_LEVELS.LOW,
                    preventionMethods: ['Proper drainage', 'Organic pesticides']
                }
            },
            conservation: {
                endemicStatus: false,
                conservationPriority: 'Medium',
                criticalHabitats: ['Meditarrenean maquis', 'Dry slopes'],
                tourismValue: {
                    peakTourismPeriod: 'July',
                    visitorImpact: 'Positive',
                    ecoTourismPotential: 'High'
                }
            }
        },
        details: {
            habitat: "Grows in sunny, dry, well-drained soils. Prefers the Mediterranean climate.",
            allergyInfo: "Does not usually cause an allergic reaction. May only cause mild skin irritation in very sensitive individuals.",
            honeyInfo: "Lavender honey is of very high quality and aromatic. Valued for its high sugar content and distinctive aroma.",
            climateImpact: "Moderately affected by climate change. Drought resistant but can be affected by extreme temperature changes.",
            benefits: [
                "High honey efficiency",
                "Great fragrance",
                "Medicinal properties",
                "Ideal for beekeping"
            ],
            threats: [
                "Excessive rainfall",
                "Frost events",
                "Soil erosion"
            ]
        }
    },
    {
        id: 2,
        name: "Oregano (Thymus vulgaris)",
        scientificName: "Thymus vulgaris",
        coordinates: [],
        characteristics: {
            allergyRisk: "Moderate",
            allergyScore: 5,
            honeyProduction: "Moderate",
            honeyScore: 6,
            climateSensitivity: "Low",
            climateScore: 3,
            benefits: "Moderate",
            benefitsScore: 6,
            threats: "Moderate",
            threatsScore: 5
        },
        description: "Oregano is a hardy aromatic herb that grows widely across Türkiye.",
        phenology: {
            floweringPeriod: {
                early: { month: FLOWERING_MONTHS.APRIL, day: 1 },
                peak: { month: FLOWERING_MONTHS.JUNE, day: 15 },
                late: { month: FLOWERING_MONTHS.AUGUST, day: 30 }
            },
            seasonalCalendar: [
                { month: 'April', phase: 'Early Bloom', intensity: 40 },
                { month: 'May', phase: 'Increase in Bloom', intensity: 75 },
                { month: 'June', phase: 'Peak Bloom', intensity: 100 },
                { month: 'July', phase: 'Continue in Bloom', intensity: 80 },
                { month: 'August', phase: 'Late Bloom', intensity: 35 }
            ],
            multiyearTrends: {
                nasaLandsatData: {
                    2020: { peakDate: '2020-06-18', intensity: 92, anomaly: false },
                    2021: { peakDate: '2021-06-10', intensity: 89, anomaly: true, note: 'Drought impact' },
                    2022: { peakDate: '2022-06-20', intensity: 94, anomaly: false },
                    2023: { peakDate: '2023-06-15', intensity: 96, anomaly: false },
                    2024: { peakDate: '2024-06-12', intensity: 91, anomaly: false }
                },
                modisVegetationIndex: {
                    averageNDVI: 0.72,
                    trend: 'increasing',
                    climateImpact: 'low'
                }
            },
            pollinatorInteractions: {
                primaryPollinators: [POLLINATOR_TYPES.BEES, POLLINATOR_TYPES.BEETLES],
                pollinatorSynchronization: {
                    bees: { syncRate: 88, peakActivity: 'June' },
                    butterflies: { syncRate: 65, peakActivity: 'July' },
                    beetles: { syncRate: 75, peakActivity: 'May' }
                },
                pollinatorDeficitRisk: {
                    level: THREAT_LEVELS.LOW,
                    factors: ['Wide pollinator diversity', 'Resilient ecosystem'],
                    riskScore: 3
                }
            },
            invasiveSpeciesAlert: {
                threatLevel: THREAT_LEVELS.MODERATE,
                competitorSpecies: ['Wild oregano species'],
                nativeEcosystemImpact: 'Moderate'
            },
            agricultureEconomics: {
                floweringHarvestTiming: {
                    optimalHarvest: 'Mid-June - Early July',
                    yieldPrediction: 'Moderate-High',
                    economicValue: 155 // EUR/decare
                },
                diseaseRisks: {
                    postFloweringRisks: ['Root rot', 'Aphid infestation'],
                    riskLevel: THREAT_LEVELS.MODERATE,
                    preventionMethods: ['Crop rotation', 'Natural predators']
                }
            },
            conservation: {
                endemicStatus: false,
                conservationPriority: 'Low',
                criticalHabitats: ['Rocky slopes', 'Steppe areas'],
                tourismValue: {
                    peakTourismPeriod: 'June',
                    visitorImpact: 'Neutral',
                    ecoTourismPotential: 'Moderate'
                }
            }
        },
        details: {
            habitat: "Grows in arid and semi-arid regions, on rocky and stony terrain.",
            allergyInfo: "May cause respiratory allergies in some people. Those with pollen allergies should take care.",
            honeyInfo: "Oregano honey is mid-grade but valued for its distinctive aroma. Has antibacterial properties.",
            climateImpact: "Highly resilient to climate change. Adapts to drought and temperature fluctuations.",
            benefits: [
                "Antibacterial properties",
                "Medicinal uses",
                "Culinary uses",
                "Resilient growth"
            ],
            threats: [
                "Overwatering",
                "Soil salinity",
                "Diseases and pests"
            ]
        }
    },
    {
        id: 3,
        name: "Chamomile (Matricaria chamomilla)",
        scientificName: "Matricaria chamomilla",
        coordinates: [],
        characteristics: {
            allergyRisk: "High",
            allergyScore: 8,
            honeyProduction: "Low",
            honeyScore: 3,
            climateSensitivity: "High",
            climateScore: 7,
            benefits: "Low",
            benefitsScore: 4,
            threats: "High",
            threatsScore: 8
        },
        description: "Chamomile is widely grown but carries a high allergy risk.",
        details: {
            habitat: "Grows in moist, sunny areas, field margins, and wastelands.",
            allergyInfo: "High allergy risk. Can cause serious reactions in people with pollen allergies.",
            honeyInfo: "Chamomile honey is low-yield but known for its distinctive aroma. Contains medicinal properties.",
            climateImpact: "Highly affected by climate change. Sensitive to temperature and precipitation changes.",
            benefits: [
                "Medicinal properties",
                "Use as tea",
                "Natural growth",
                "Attractive appearance"
            ],
            threats: [
                "Climate change",
                "Habitat loss",
                "Chemical pollution",
                "Overharvesting"
            ]
        }
    },
    {
        id: 4,
        name: "Rose (Rosa damascena)",
        scientificName: "Rosa damascena",
        coordinates: [],
        characteristics: {
            allergyRisk: "Moderate",
            allergyScore: 6,
            honeyProduction: "High",
            honeyScore: 9,
            climateSensitivity: "Moderate",
            climateScore: 5,
            benefits: "High",
            benefitsScore: 9,
            threats: "Moderate",
            threatsScore: 5
        },
        description: "Rose is one of the world's most popular flowers. Highly valued in the perfume industry.",
        details: {
            habitat: "Grows in temperate climates, in sunny and well-drained soils.",
            allergyInfo: "May cause pollen allergy in some people. Rose pollen is moderately allergenic.",
            honeyInfo: "Rose honey is very high quality and aromatic. Valued for high sugar content and distinctive aroma.",
            climateImpact: "Moderately affected by climate change. Sensitive to temperature changes.",
            benefits: [
                "Perfume industry",
                "Medicinal properties",
                "High honey yield",
                "Aesthetic appeal"
            ],
            threats: [
                "Diseases and pests",
                "Climate change",
                "Soil pollution",
                "Overwatering"
            ]
        }
    },
    {
        id: 5,
        name: "Orchid (Orchidaceae)",
        scientificName: "Orchidaceae",
        coordinates: [],
        characteristics: {
            allergyRisk: "Low",
            allergyScore: 3,
            honeyProduction: "Low",
            honeyScore: 2,
            climateSensitivity: "High",
            climateScore: 8,
            benefits: "High",
            benefitsScore: 7,
            threats: "High",
            threatsScore: 7
        },
        description: "Orchid is an exotic flower that grows in tropical and subtropical regions.",
        details: {
            habitat: "Grows in moist and shaded areas of tropical and subtropical regions.",
            allergyInfo: "Generally low allergy risk. May cause mild reactions in very sensitive individuals.",
            honeyInfo: "Orchid honey is very rare and valuable. Low yield but known for its special aroma.",
            climateImpact: "Highly affected by climate change. Very sensitive to temperature and humidity changes.",
            benefits: [
                "Exotic appearance",
                "Medicinal properties",
                "Rare honey type",
                "Orchid industry"
            ],
            threats: [
                "Climate change",
                "Habitat loss",
                "Overharvesting",
                "Pollution"
            ]
        }
    },
    {
        id: 6,
        name: "Tulip (Tulipa)",
        scientificName: "Tulipa",
        coordinates: [],
        characteristics: {
            allergyRisk: "Low",
            allergyScore: 2,
            honeyProduction: "Moderate",
            honeyScore: 5,
            climateSensitivity: "Low",
            climateScore: 3,
            benefits: "Moderate",
            benefitsScore: 6,
            threats: "Low",
            threatsScore: 3
        },
        description: "Tulip is a popular flower cultivated especially in the Netherlands.",
        details: {
            habitat: "Grows in temperate climates with cold winters and mild summers.",
            allergyInfo: "Generally low allergy risk. Rarely may cause pollen allergy.",
            honeyInfo: "Tulip honey is mid-grade and known for its specific aroma. Valued as a spring honey.",
            climateImpact: "Low impact from climate change. Prefers cold climates.",
            benefits: [
                "Aesthetic appeal",
                "Garden plant",
                "Moderate honey yield",
                "Durable structure"
            ],
            threats: [
                "Extreme temperatures",
                "Soil diseases",
                "Pests",
                "Excessive rainfall"
            ]
        }
    },
    {
        id: 7,
        name: "Lily (Lilium)",
        scientificName: "Lilium",
        coordinates: [],
        characteristics: {
            allergyRisk: "High",
            allergyScore: 7,
            honeyProduction: "Low",
            honeyScore: 3,
            climateSensitivity: "Moderate",
            climateScore: 6,
            benefits: "Moderate",
            benefitsScore: 5,
            threats: "Moderate",
            threatsScore: 6
        },
        description: "Lily is a large and showy flower commonly grown in North America.",
        details: {
            habitat: "Grows in temperate and cold climates, in moist soils.",
            allergyInfo: "High allergy risk due to heavy pollen production. Caution for those with pollen allergies.",
            honeyInfo: "Lily honey is low-yield but known for its special aroma. A rare honey type.",
            climateImpact: "Moderately affected by climate change. Sensitive to temperature changes.",
            benefits: [
                "Showy appearance",
                "Garden plant",
                "Medicinal properties",
                "Cut flower"
            ],
            threats: [
                "Diseases and pests",
                "Climate change",
                "Soil erosion",
                "Overharvesting"
            ]
        }
    },
    {
        id: 8,
        name: "Hyacinth (Hyacinthus orientalis)",
        scientificName: "Hyacinthus orientalis",
            coordinates: [],
        characteristics: {
            allergyRisk: "Moderate",
            allergyScore: 4,
            honeyProduction: "High",
            honeyScore: 8,
            climateSensitivity: "Low",
            climateScore: 2,
            benefits: "High",
            benefitsScore: 8,
            threats: "Low",
            threatsScore: 2
        },
        description: "Hyacinth is a fragrant flower commonly grown in Türkiye.",
        details: {
            habitat: "Grows in temperate climates, in sunny and well-drained soils.",
            allergyInfo: "Moderate allergy risk. May cause mild pollen allergy in some people.",
            honeyInfo: "Hyacinth honey is high quality and aromatic. Very valuable as a spring honey.",
            climateImpact: "Low impact from climate change. A resilient plant.",
            benefits: [
                "Pleasant fragrance",
                "High honey yield",
                "Garden plant",
                "Medicinal properties"
            ],
            threats: [
                "Extreme temperatures",
                "Soil diseases",
                "Harmful insects",
                "Overwatering"
            ]
        }
    },
    {
        id: 9,
        name: "Ragwort (Jacobaea vulgaris)",
        scientificName: "Jacobaea vulgaris",
        coordinates: [],
        characteristics: {
            allergyRisk: "High",
            allergyScore: 8,
            honeyProduction: "Low",
            honeyScore: 2,
            climateSensitivity: "Moderate",
            climateScore: 5,
            benefits: "Low",
            benefitsScore: 3,
            threats: "High",
            threatsScore: 9
        },
        description: "Ragwort is a toxic plant species that poses significant health risks to livestock.",
        details: {
            habitat: "Disturbed areas, meadows, and roadside verges in temperate climates.",
            allergyInfo: "High allergy risk. Contains toxic alkaloids that can cause severe allergic reactions.",
            honeyInfo: "Very low honey production. Pollen is toxic and makes honey unsuitable for consumption.",
            climateImpact: "Moderately affected by climate change. Spreads rapidly in disturbed environments.",
            benefits: ["Limited ecological value", "Some medicinal properties when properly processed"],
            threats: ["Liver toxicity", "Livestock poisoning", "Invasive nature", "Agricultural contamination"]
        }
    },
    {
        id: 10,
        name: "Cypress (Cupressus sempervirens)",
        scientificName: "Cupressus sempervirens",
         coordinates: [],
        characteristics: {
            allergyRisk: "High",
             allergyScore: 9,
             honeyProduction: "Low",
             honeyScore: 1,
             climateSensitivity: "Low",
             climateScore: 3,
             benefits: "Moderate",
             benefitsScore: 5,
             threats: "Moderate",
             threatsScore: 5
        },
        description: "Mediterranean cypress is an evergreen tree known for its columnar shape and high pollen production.",
         details: {
             habitat: "Mediterranean climate regions with well-drained soils and full sun exposure.",
             allergyInfo: "Very high allergy risk. Heavy pollen producer that causes severe respiratory allergies.",
             honeyInfo: "Minimal honey production. Pollen is allergenic and not preferred by bees.",
             climateImpact: "Low climate sensitivity. Drought-tolerant and adapts well to changing conditions.",
             benefits: ["Windbreak", "Ornamental value", "Wood production", "Drought resistance"],
             threats: ["Allergenic pollen", "Fire risk", "Resin toxicity", "Invasive potential"]
         }
     },
     {
         id: 11,
         name: "Alder (Alnus glutinosa)",
         scientificName: "Alnus glutinosa",
         coordinates: [],
         characteristics: {
             allergyRisk: "Moderate",
             allergyScore: 6,
             honeyProduction: "Moderate",
             honeyScore: 5,
             climateSensitivity: "Moderate",
             climateScore: 5,
             benefits: "High",
             benefitsScore: 7,
             threats: "Moderate",
             threatsScore: 4
         },
         description: "Common alder is a nitrogen-fixing tree commonly found in wet soils near water bodies.",
          details: {
              habitat: "Riparian zones, wet woodlands, и marshes in temperate climates.",
               allergyInfo: "Moderate allergy risk. Early blooming pollen can affect sensitive individuals.",
               honeyInfo: "Moderate honey production with early season nectar value.",
               climateImpact: "Moderately sensitive to climate change. Vulnerable to extreme drought and flooding.",
               benefits: ["Nitrogen fixation", "Soil improvement", "Riparian stabilization", "Wildlife habitat"],
               threats: ["Drought susceptibility", "Root disease", "Flooding stress", "Climate shifts"]
          }
      },
      {
          id: 12,
          name: "Rye (Secale cereale)",
          scientificName: "Secale cereale",
          coordinates: [],
          characteristics: {
              allergyRisk: "Moderate",
              allergyScore: 5,
              honeyProduction: "Moderate",
              honeyScore: 4,
              climateSensitivity: "Low",
              climateScore: 4,
              benefits: "High",
              benefitsScore: 8,
              threats: "Moderate",
              threatsScore: 6
          },
          description: "Rye is a hardy cereal grain crop with excellent cold tolerance and nutritional value.",
           details: {
               habitat: "Cool temperate regions with well-drained soils. Commercial agricultural production.",
                allergyInfo: "Moderate allergy risk. Grain dust and pollen can cause respiratory issues.",
                honeyInfo: "Moderate honey production potential from agricultural landscapes.",
                climateImpact: "Low climate sensitivity. Excellent cold tolerance and adaptability to harsh conditions.",
                benefits: ["High nutrition", "Cold tolerance", "Soil improvement", "Bread production"],
                threats: ["Ergot fungus", "Fungal diseases", "Weather extremes", "Market volatility"]
           }
       },
       {
           id: 13,
           name: "Barley (Hordeum vulgare)",
           scientificName: "Hordeum vulgare",
           coordinates: [],
           characteristics: {
               allergyRisk: "Moderate",
               allergyScore: 5,
               honeyProduction: "Low",
               honeyScore: 3,
               climateSensitivity: "Low",
               climateScore: 4,
               benefits: "High",
               benefitsScore: 8,
               threats: "Moderate",
               threatsScore: 6
           },
           description: "Barley is one of the world's most ancient cereal crops with high drought tolerance.",
            details: {
                habitat: "Cool to temperate climates in agricultural areas with moderate precipitation.",
                 allergyInfo: "Moderate allergy risk. Grain dust exposure can cause respiratory symptoms.",
                 honeyInfo: "Low honey production from agricultural landscapes with limited floral diversity.",
                 climateImpact: "Low climate sensitivity. Good drought tolerance and adaptability to variable conditions.",
                 benefits: ["High nutrition", "Malting quality", "Feed grain", "Drought resistant"],
                 threats: ["Fungal diseases", "Weather extremes", "Soil fertility", "Market dependency"]
            }
        },
        {
            id: 14,
           name: "Peanut (Arachis hypogaea)",
            scientificName: "Arachis hypogaea",
            coordinates: [
            ],
            characteristics: {
                allergyRisk: "High",
                allergyScore: 9,
                honeyProduction: "Low",
                honeyScore: 2,
                climateSensitivity: "Moderate",
                climateScore: 6,
                benefits: "High",
                benefitsScore: 9,
                threats: "Low",
                threatsScore: 4
            },
            description: "Peanut is a legume crop highly valued for its protein and oil content, but poses severe allergy risks.",
             details: {
                 habitat: "Warm subtropical climates with well-drained sandy soils and adequate moisture.",
                  allergyInfo: "Very high allergy risk. Severe and potentially life-threatening allergic reactions.",
                  honeyInfo: "Very low honey production. Flowers are self-pollinating with limited nectar.",
                  climateImpact: "Moderately sensitive to climate change. Vulnerable to drought and extreme rainfall.",
                  benefits: ["High protein", "Oil production", "Food security", "Cash crop"],
                  threats: ["Severe allergies", "Fungal contamination", "Weather dependence", "Processing hazards"]
             }
         },
         {
             id: 15,
             name: "Sesame (Sesamum indicum)",
             scientificName: "Sesamum indicum",
             coordinates: [
             ],
             characteristics: {
                 allergyRisk: "High",
                 allergyScore: 8,
                 honeyProduction: "High",
                 honeyScore: 7,
                 climateSensitivity: "Moderate",
                 climateScore: 5,
                 benefits: "High",
                 benefitsScore: 8,
                 threats: "Low",
                 threatsScore: 3
             },
             description: "Sesame is an ancient oilseed crop known for its drought tolerance and nutritional value.",
              details: {
                  habitat: "Tropical and subtropical regions with warm temperatures and well-drained soils.",
                   allergyInfo: "High allergy risk. Seeds can cause severe systemic allergic reactions.",
                   honeyInfo: "Good honey production potential with abundant nectar from aromatic flowers.",
                   climateImpact: "Moderately sensitive to climate change. Benefits from increased CO2 but vulnerable to extreme temperatures.",
                   benefits: ["Oil production", "Nutritional value", "Drought resistant", "Medicinal properties"],
                   threats: ["Allergy risk", "Seed shattering", "Pest susceptibility", "Harvest timing"]
              }
          },
          {
              id: 16,
              name: "Tea (Camellia sinensis)",
              scientificName: "Camellia sinensis",
              coordinates: [],
              characteristics: {
                  allergyRisk: "Low",
                  allergyScore: 2,
                  honeyProduction: "Moderate",
                  honeyScore: 5,
                  climateSensitivity: "High",
                  climateScore: 7,
                  benefits: "High",
                  benefitsScore: 9,
                  threats: "Low",
                  threatsScore: 3
              },
              description: "Tea plant is a caffeine-producing evergreen shrub cultivated in subtropical highlands.",
               details: {
                   habitat: "Subtropical highland regions with acidic soils, moderate temperatures, and high humidity.",
                    allergyInfo: "Low allergy risk. Non-allergenic plant with minimal pollen production.",
                    honeyInfo: "Moderate honey production from plantation areas with mixed floral resources.",
                    climateImpact: "High climate sensitivity. Vulnerable to temperature changes, rainfall patterns, and extreme weather.",
                    benefits: ["Caffeine production", "Economic value", "Cultural significance", "Health benefits"],
                    threats: ["Climate vulnerability", "Labor intensive", "Market fluctuations", "Soil acidification"]
               }
           },
           {
               id: 17,
               name: "Almond (Prunus dulcis)",
               scientificName: "Prunus dulcis",
               coordinates: [],
               characteristics: {
                   allergyRisk: "High",
                   allergyScore: 9,
                   honeyProduction: "High",
                   honeyScore: 8,
                   climateSensitivity: "Moderate",
                   climateScore: 5,
                   benefits: "High",
                   benefitsScore: 9,
                   threats: "Moderate",
                   threatsScore: 5
               },
               description: "Almond is a nut-producing tree highly valued for its nutritional and honey-producing qualities.",
                details: {
                    habitat: "Mediterranean climate regions with mild winters, warm summers, and well-drained soils.",
                     allergyInfo: "Very high allergy risk. Tree nuts cause severe and potentially fatal allergic reactions.",
                     honeyInfo: "Excellent honey production with early spring blooming and abundant nectar.",
                     climateImpact: "Moderately sensitive to climate change. Vulnerable to late frost and drought stress.",
                     benefits: ["High nutrition", "Excellent honey", "Economic value", "Early bloom"],
                     threats: ["Severe allergies", "Frost sensitivity", "Drought stress", "Pollination dependency"]
                }
            },
            {
                id: 18,
                name: "Cherry Blossom (Prunus serrulata)",
                scientificName: "Prunus serrulata",
                coordinates: [],
                characteristics: {
                    allergyRisk: "Medium",
                    allergyScore: 5,
                    honeyProduction: "High",
                    honeyScore: 7,
                    climateSensitivity: "Medium",
                    climateScore: 6,
                    benefits: "High",
                    benefitsScore: 8,
                    threats: "Low",
                    threatsScore: 3
                },
                description: "Cherry blossom is a flowering ornamental tree celebrated for its spectacular spring blooms.",
                  details: {
                      habitat: "Temperate climates with cold winters and moderate spring temperatures.",
                       allergyInfo: "Moderate allergy risk. Pollen can cause seasonal allergic rhinitis.",
                       honeyInfo: "Good honey production from spring flowering with abundant nectar resources.",
                       climateImpact: "Moderately sensitive to climate change. Vulnerable to late frost damage and altered bloom timing.",
                       benefits: ["Ornamental beauty", "Cultural significance", "Spring honey", "Tourism value"],
                       threats: ["Frost damage", "Disease susceptibility", "Short bloom period", "Weather dependency"]
            }
    },
    // Enhanced plant data with comprehensive phenology, trends, and pollinator data
    {
        id: 19,
        name: "Lavender Enhanced (Lavandula angustifolia)",
        scientificName: "Lavandula angustifolia",
        coordinates: [],
        characteristics: {
            allergyRisk: "Low",
            allergyScore: 2,
            honeyProduction: "High",
            honeyScore: 8,
            climateSensitivity: "Moderate",
            climateScore: 5,
            benefits: "High",
            benefitsScore: 8,
            threats: "Low",
            threatsScore: 3
        },
        description: "Lavender is a fragrant plant that grows in the Mediterranean climate. It is valuable for beekeeping.",
        phenology: {
            floweringPeriod: {
                early: { month: FLOWERING_MONTHS.MAY, day: 15 },
                peak: { month: FLOWERING_MONTHS.JULY, day: 1 },
                late: { month: FLOWERING_MONTHS.SEPTEMBER, day: 15 }
            },
            seasonalCalendar: [
                { month: 'May', phase: 'Early Bloom', intensity: 30 },
                { month: 'June', phase: 'Increase in Bloom', intensity: 70 },
                { month: 'July', phase: 'Peak Bloom', intensity: 100 },
                { month: 'August', phase: 'Continue in Bloom', intensity: 85 },
                { month: 'September', phase: 'Late Bloom', intensity: 40 }
            ],
            multiyearTrends: {
                nasaLandsatData: {
                    2020: { peakDate: '2020-07-05', intensity: 95, anomaly: false },
                    2021: { peakDate: '2021-06-28', intensity: 88, anomaly: true, note: 'Early Bloom' },
                    2022: { peakDate: '2022-07-12', intensity: 92, anomaly: false },
                    2023: { peakDate: '2023-07-01', intensity: 97, anomaly: false },
                    2024: { peakDate: '2024-06-25', intensity: 85, anomaly: true, note: 'Climate change impact' }
                },
                modisVegetationIndex: {
                    averageNDVI: 0.78,
                    trend: 'stable',
                    climateImpact: 'moderate'
                }
            },
            pollinatorInteractions: {
                primaryPollinators: [POLLINATOR_TYPES.BEES, POLLINATOR_TYPES.BUTTERFLIES],
                pollinatorSynchronization: {
                    bees: { syncRate: 95, peakActivity: 'July' },
                    butterflies: { syncRate: 80, peakActivity: 'August' },
                    birds: { syncRate: 20, peakActivity: 'June' }
                },
                pollinatorDeficitRisk: {
                    level: THREAT_LEVELS.LOW,
                    factors: ['Bee population is stable', 'Butterfly diversity is high'],
                    riskScore: 2
                }
            },
            invasiveSpeciesAlert: {
                threatLevel: THREAT_LEVELS.LOW,
                competitorSpecies: [],
                nativeEcosystemImpact: 'Minimal'
            },
            agricultureEconomics: {
                floweringHarvestTiming: {
                    optimalHarvest: 'the end of July - the beginning of August',
                    yieldPrediction: 'High',
                    economicValue: 175 // €/dönüm
                },
                diseaseRisks: {
                    postFloweringRisks: ['Fungal infections', 'Lavender beetle'],
                    riskLevel: THREAT_LEVELS.LOW,
                    preventionMethods: ['Proper drainage', 'Organic pesticides']
                }
            },
            conservation: {
                endemicStatus: false,
                conservationPriority: 'Medium',
                criticalHabitats: ['Mediterranean maquis', 'Dry slopes'],
                tourismValue: {
                    peakTourismPeriod: 'July',
                    visitorImpact: 'Positive',
                    ecoTourismPotential: 'High'
                }
            }
        },
        details: {
            habitat: "Grows in sunny, dry, well-drained soils. Prefers the Mediterranean climate.",
            allergyInfo: "Does not usually cause an allergic reaction. May only cause mild skin irritation in very sensitive individuals.",
            honeyInfo: "Lavender honey is of very high quality and aromatic. Valued for its high sugar content and distinctive aroma.",
            climateImpact: "Moderately affected by climate change. Drought resistant but can be affected by extreme temperature changes.",
            benefits: [
                "High honey efficiency",
                "Great fragrance",
                "Medicinal properties",
                "Ideal for beekeeping"
            ],
            threats: [
                "Excessive rainfall",
                "Frost events",
                "Soil erosion"
            ]
        }
    },
    {
        id: 20,
        name: "Oregano Complete (Thymus vulgaris)",
        scientificName: "Thymus vulgaris",
        coordinates: [],
        characteristics: {
            allergyRisk: "Moderate",
            allergyScore: 5,
            honeyProduction: "Moderate",
            honeyScore: 6,
            climateSensitivity: "Low",
            climateScore: 3,
            benefits: "Moderate",
            benefitsScore: 6,
            threats: "Moderate",
            threatsScore: 5
        },
        description: "Oregano is a hardy aromatic herb that grows widely across Türkiye.",
        phenology: {
            floweringPeriod: {
                early: { month: FLOWERING_MONTHS.APRIL, day: 1 },
                peak: { month: FLOWERING_MONTHS.JUNE, day: 15 },
                late: { month: FLOWERING_MONTHS.AUGUST, day: 30 }
            },
            seasonalCalendar: [
                { month: 'April', phase: 'Early Bloom', intensity: 40 },
                { month: 'May', phase: 'Increase in Bloom', intensity: 75 },
                { month: 'June', phase: 'Peak Bloom', intensity: 100 },
                { month: 'July', phase: 'Continue in Bloom', intensity: 80 },
                { month: 'August', phase: 'Late Bloom', intensity: 35 }
            ],
            multiyearTrends: {
                nasaLandsatData: {
                    2020: { peakDate: '2020-06-18', intensity: 92, anomaly: false },
                    2021: { peakDate: '2021-06-10', intensity: 89, anomaly: true, note: 'Drought impact' },
                    2022: { peakDate: '2022-06-20', intensity: 94, anomaly: false },
                    2023: { peakDate: '2023-06-15', intensity: 96, anomaly: false },
                    2024: { peakDate: '2024-06-12', intensity: 91, anomaly: false }
                },
                modisVegetationIndex: {
                    averageNDVI: 0.72,
                    trend: 'increasing',
                    climateImpact: 'low'
                }
            },
            pollinatorInteractions: {
                primaryPollinators: [POLLINATOR_TYPES.BEES, POLLINATOR_TYPES.BEETLES],
                pollinatorSynchronization: {
                    bees: { syncRate: 88, peakActivity: 'June' },
                    butterflies: { syncRate: 65, peakActivity: 'July' },
                    beetles: { syncRate: 75, peakActivity: 'May' }
                },
                pollinatorDeficitRisk: {
                    level: THREAT_LEVELS.LOW,
                    factors: ['Wide pollinator diversity', 'Resilient ecosystem'],
                    riskScore: 3
                }
            },
            invasiveSpeciesAlert: {
                threatLevel: THREAT_LEVELS.MODERATE,
                competitorSpecies: ['Wild oregano species'],
                nativeEcosystemImpact: 'Moderate'
            },
            agricultureEconomics: {
                floweringHarvestTiming: {
                    optimalHarvest: 'Mid-June - Early July',
                    yieldPrediction: 'Moderate-High',
                    economicValue: 155 // EUR/decare
                },
                diseaseRisks: {
                    postFloweringRisks: ['Root rot', 'Aphid infestation'],
                    riskLevel: THREAT_LEVELS.MODERATE,
                    preventionMethods: ['Crop rotation', 'Natural predators']
                }
            },
            conservation: {
                endemicStatus: false,
                conservationPriority: 'Low',
                criticalHabitats: ['Rocky slopes', 'Steppe areas'],
                tourismValue: {
                    peakTourismPeriod: 'June',
                    visitorImpact: 'Neutral',
                    ecoTourismPotential: 'Moderate'
                }
            }
        },
        details: {
            habitat: "Grows in arid and semi-arid regions, on rocky and stony terrain.",
            allergyInfo: "May cause respiratory allergies in some people. Those with pollen allergies should take care.",
            honeyInfo: "Oregano honey is mid-grade but valued for its distinctive aroma. Has antibacterial properties.",
            climateImpact: "Highly resilient to climate change. Adapts to drought and temperature fluctuations.",
            benefits: [
                "Antibacterial properties",
                "Medicinal uses",
                "Culinary uses",
                "Resilient growth"
            ],
            threats: [
                "Overwatering",
                "Soil salinity",
                "Diseases and pests"
            ]
        }
    },
    {
        id: 21,
        name: "Chamomile Complete (Matricaria chamomilla)",
        scientificName: "Matricaria chamomilla",
        coordinates: [],
        characteristics: {
            allergyRisk: "High",
            allergyScore: 8,
            honeyProduction: "Low",
            honeyScore: 3,
            climateSensitivity: "High",
            climateScore: 7,
            benefits: "Low",
            benefitsScore: 4,
            threats: "High",
            threatsScore: 8
        },
        description: "Chamomile is widely grown but carries a high allergy risk.",
        phenology: {
            floweringPeriod: {
                early: { month: FLOWERING_MONTHS.APRIL, day: 20 },
                peak: { month: FLOWERING_MONTHS.JUNE, day: 10 },
                late: { month: FLOWERING_MONTHS.AUGUST, day: 20 }
            },
            seasonalCalendar: [
                { month: 'April', phase: 'Early Bloom', intensity: 25 },
                { month: 'May', phase: 'Increase in Bloom', intensity: 60 },
                { month: 'June', phase: 'Peak Bloom', intensity: 90 },
                { month: 'July', phase: 'Continue in Bloom', intensity: 70 },
                { month: 'August', phase: 'Late Bloom', intensity: 40 }
            ],
            multiyearTrends: {
                nasaLandsatData: {
                    2020: { peakDate: '2020-06-15', intensity: 88, anomaly: false },
                    2021: { peakDate: '2021-06-05', intensity: 82, anomaly: true, note: 'Drought stress' },
                    2022: { peakDate: '2022-06-20', intensity: 85, anomaly: false },
                    2023: { peakDate: '2023-06-08', intensity: 80, anomaly: false },
                    2024: { peakDate: '2024-05-30', intensity: 75, anomaly: true, note: 'Climate shift' }
                },
                modisVegetationIndex: {
                    averageNDVI: 0.65,
                    trend: 'decreasing',
                    climateImpact: 'high'
                }
            },
            pollinatorInteractions: {
                primaryPollinators: [POLLINATOR_TYPES.BEES, POLLINATOR_TYPES.BUTTERFLIES],
                pollinatorSynchronization: {
                    bees: { syncRate: 60, peakActivity: 'June' },
                    butterflies: { syncRate: 85, peakActivity: 'July' },
                    birds: { syncRate: 10, peakActivity: 'May' }
                },
                pollinatorDeficitRisk: {
                    level: THREAT_LEVELS.HIGH,
                    factors: ['Habitat degradation', 'Agricultural intensification', 'Pesticide exposure'],
                    riskScore: 8
                }
            },
            invasiveSpeciesAlert: {
                threatLevel: THREAT_LEVELS.LOW,
                competitorSpecies: [],
                nativeEcosystemImpact: 'Minimal'
            },
            agricultureEconomics: {
                floweringHarvestTiming: {
                    optimalHarvest: 'Late May - Early June',
                    yieldPrediction: 'Low',
                    economicValue: 45 // EUR/decare
                },
                diseaseRisks: {
                    postFloweringRisks: ['Downy mildew', 'Powdery mildew', 'Rust diseases'],
                    riskLevel: THREAT_LEVELS.HIGH,
                    preventionMethods: ['Fungal treatments', 'Proper air circulation']
                }
            },
            conservation: {
                endemicStatus: false,
                conservationPriority: 'High',
                criticalHabitats: ['Meadows', 'Field margins', 'Wastelands'],
                tourismValue: {
                    peakTourismPeriod: 'May-June',
                    visitorImpact: 'Positive',
                    ecoTourismPotential: 'Medium'
                }
            }
        },
        details: {
            habitat: "Grows in moist, sunny areas, field margins, and wastelands.",
            allergyInfo: "High allergy risk. Can cause serious reactions in people with pollen allergies.",
            honeyInfo: "Chamomile honey is low-yield but known for its distinctive aroma. Contains medicinal properties.",
            climateImpact: "Highly affected by climate change. Sensitive to temperature and precipitation changes.",
            benefits: [
                "Medicinal properties",
                "Use as tea",
                "Natural growth",
                "Attractive appearance"
            ],
            threats: [
                "Climate change",
                "Habitat loss",
                "Chemical pollution",
                "Overharvesting"
            ]
        }
    },
    {
        id: 22,
        name: "Rose Complete (Rosa damascena)",
        scientificName: "Rosa damascena",
        coordinates: [],
        characteristics: {
            allergyRisk: "Moderate",
            allergyScore: 6,
            honeyProduction: "High",
            honeyScore: 9,
            climateSensitivity: "Moderate",
            climateScore: 5,
            benefits: "High",
            benefitsScore: 9,
            threats: "Moderate",
            threatsScore: 5
        },
        description: "Rose is one of the world's most popular flowers. Highly valued in the perfume industry.",
        phenology: {
            floweringPeriod: {
                early: { month: FLOWERING_MONTHS.MAY, day: 1 },
                peak: { month: FLOWERING_MONTHS.JUNE, day: 15 },
                late: { month: FLOWERING_MONTHS.SEPTEMBER, day: 1 }
            },
            seasonalCalendar: [
                { month: 'May', phase: 'Early Bloom', intensity: 30 },
                { month: 'June', phase: 'Peak Bloom', intensity: 100 },
                { month: 'July', phase: 'Continue Bloom', intensity: 85 },
                { month: 'August', phase: 'Second Wave', intensity: 75 },
                { month: 'September', phase: 'Late Bloom', intensity: 40 }
            ],
            multiyearTrends: {
                nasaLandsatData: {
                    2020: { peakDate: '2020-06-20', intensity: 92, anomaly: false },
                    2021: { peakDate: '2021-06-15', intensity: 89, anomaly: false },
                    2022: { peakDate: '2022-06-25', intensity: 94, anomaly: false },
                    2023: { peakDate: '2023-06-12', intensity: 96, anomaly: false },
                    2024: { peakDate: '2024-06-18', intensity: 91, anomaly: false }
                },
                modisVegetationIndex: {
                    averageNDVI: 0.82,
                    trend: 'stable',
                    climateImpact: 'moderate'
                }
            },
            pollinatorInteractions: {
                primaryPollinators: [POLLINATOR_TYPES.BEES, POLLINATOR_TYPES.BUTTERFLIES],
                pollinatorSynchronization: {
                    bees: { syncRate: 92, peakActivity: 'June' },
                    butterflies: { syncRate: 78, peakActivity: 'July' },
                    birds: { syncRate: 15, peakActivity: 'May' }
                },
                pollinatorDeficitRisk: {
                    level: THREAT_LEVELS.LOW,
                    factors: ['Abundant floral resources', 'Excellent nectar production'],
                    riskScore: 2
                }
            },
            invasiveSpeciesAlert: {
                threatLevel: THREAT_LEVELS.LOW,
                competitorSpecies: [],
                nativeEcosystemImpact: 'Minimal'
            },
            agricultureEconomics: {
                floweringHarvestTiming: {
                    optimalHarvest: 'Early morning in June',
                    yieldPrediction: 'High',
                    economicValue: 285 // EUR/decare
                },
                diseaseRisks: {
                    postFloweringRisks: ['Black spot', 'Powdery mildew', 'Aphids'],
                    riskLevel: THREAT_LEVELS.MODERATE,
                    preventionMethods: ['Regular pruning', 'Fungal treatments']
                }
            },
            conservation: {
                endemicStatus: false,
                conservationPriority: 'Medium',
                criticalHabitats: ['Garden landscapes', 'Rose farms'],
                tourismValue: {
                    peakTourismPeriod: 'June',
                    visitorImpact: 'Very Positive',
                    ecoTourismPotential: 'Very High'
                }
            }
        },
        details: {
            habitat: "Grows in temperate climates, in sunny and well-drained soils.",
            allergyInfo: "May cause pollen allergy in some people. Rose pollen is moderately allergenic.",
            honeyInfo: "Rose honey is very high quality and aromatic. Valued for high sugar content and distinctive aroma.",
            climateImpact: "Moderately affected by climate change. Sensitive to temperature changes.",
            benefits: [
                "Perfume industry",
                "Medicinal properties",
                "High honey yield",
                "Aesthetic appeal"
            ],
            threats: [
                "Diseases and pests",
                "Climate change",
                "Soil pollution",
                "Overwatering"
            ]
        }
    },
    {
        id: 23,
        name: "Orchid Complete (Orchidaceae)",
        scientificName: "Orchidaceae",
        coordinates: [],
        characteristics: {
            allergyRisk: "Low",
            allergyScore: 3,
            honeyProduction: "Low",
            honeyScore: 2,
            climateSensitivity: "High",
            climateScore: 8,
            benefits: "High",
            benefitsScore: 7,
            threats: "High",
            threatsScore: 7
        },
        description: "Orchid is is an exotic flower that grows in tropical and subtropical regions.",
        phenology: {
            floweringPeriod: {
                early: { month: FLOWERING_MONTHS.MARCH, day: 1 },
                peak: { month: FLOWERING_MONTHS.MAY, day: 15 },
                late: { month: FLOWERING_MONTHS.AUGUST, day: 30 }
            },
            seasonalCalendar: [
                { month: 'March', phase: 'Early Bloom', intensity: 25 },
                { month: 'April', phase: 'Increase Bloom', intensity: 60 },
                { month: 'May', phase: 'Peak Bloom', intensity: 85 },
                { month: 'June', phase: 'Sustained Bloom', intensity: 80 },
                { month: 'July', phase: 'Decline', intensity: 55 },
                { month: 'August', phase: 'Late Bloom', intensity: 30 }
            ],
            multiyearTrends: {
                nasaLandsatData: {
                    2020: { peakDate: '2020-05-15', intensity: 88, anomaly: false },
                    2021: { peakDate: '2021-05-08', intensity: 85, anomaly: false },
                    2022: { peakDate: '2022-05-18', intensity: 82, anomaly: true, note: 'Habitat pressure' },
                    2023: { peakDate: '2023-05-12', intensity: 79, anomaly: true, note: 'Climate stress' },
                    2024: { peakDate: '2024-05-22', intensity: 76, anomaly: true, note: 'Continuing decline' }
                },
                modisVegetationIndex: {
                    averageNDVI: 0.71,
                    trend: 'decreasing',
                    climateImpact: 'high'
                }
            },
            pollinatorInteractions: {
                primaryPollinators: [POLLINATOR_TYPES.BEES, POLLINATOR_TYPES.BUTTERFLIES, POLLINATOR_TYPES.BIRDS],
                pollinatorSynchronization: {
                    bees: { syncRate: 75, peakActivity: 'May' },
                    butterflies: { syncRate: 85, peakActivity: 'June' },
                    birds: { syncRate: 50, peakActivity: 'April' }
                },
                pollinatorDeficitRisk: {
                    level: THREAT_LEVELS.HIGH,
                    factors: ['Habitat destruction', 'Climate change impact', 'Specialized pollinators'],
                    riskScore: 7
                }
            },
            invasiveSpeciesAlert: {
                threatLevel: THREAT_LEVELS.HIGH,
                competitorSpecies: ['Commercial flower species', 'Invasive grasses'],
                nativeEcosystemImpact: 'High'
            },
            agricultureEconomics: {
                floweringHarvestTiming: {
                    optimalHarvest: 'May peak season',
                    yieldPrediction: 'Very Low',
                    economicValue: 85 // EUR/decare (mainly ornamental)
                },
                diseaseRisks: {
                    postFloweringRisks: ['Root rot', 'Fungal infections', 'Virus diseases'],
                    riskLevel: THREAT_LEVELS.HIGH,
                    preventionMethods: ['Careful irrigation', 'Disease-resistant varieties']
                }
            },
            conservation: {
                endemicStatus: false,
                conservationPriority: 'High',
                criticalHabitats: ['Tropical forests', 'Subtropical regions'],
                tourismValue: {
                    peakTourismPeriod: 'May-June',
                    visitorImpact: 'High',
                    ecoTourismPotential: 'Very High'
                }
            }
        },
        details: {
            habitat: "Grows in moist and shaded areas of tropical and subtropical regions.",
            allergyInfo: "Generally low allergy risk. May cause mild reactions in very sensitive individuals.",
            honeyInfo: "Orchid honey is very rare and valuable. Low yield but known for its special aroma.",
            climateImpact: "Highly affected by climate change. Very sensitive to temperature and humidity changes.",
            benefits: [
                "Exotic appearance",
                "Medicinal properties",
                "Rare honey type",
                "Orchid industry"
            ],
            threats: [
                "Climate change",
                "Habitat loss",
                "Overharvesting",
                "Pollution"
            ]
        }
    },
    {
        id: 24,
        name: "Tulip Complete (Tulipa)",
        scientificName: "Tulipa",
        coordinates: [],
        characteristics: {
            allergyRisk: "Low",
            allergyScore: 2,
            honeyProduction: "Moderate",
            honeyScore: 5,
            climateSensitivity: "Low",
            climateScore: 3,
            benefits: "Moderate",
            benefitsScore: 6,
            threats: "Low",
            threatsScore: 3
        },
        description: "Tulip is is a popular flower cultivated especially in the Netherlands.",
        phenology: {
            floweringPeriod: {
                early: { month: FLOWERING_MONTHS.MARCH, day: 15 },
                peak: { month: FLOWERING_MONTHS.APRIL, day: 15 },
                late: { month: FLOWERING_MONTHS.MAY, day: 15 }
            },
            seasonalCalendar: [
                { month: 'March', phase: 'Early Bloom', intensity: 40 },
                { month: 'April', phase: 'Peak Bloom', intensity: 100 },
                { month: 'May', phase: 'Late Bloom', intensity: 60 },
                { month: 'June', phase: 'Fading', intensity: 10 }
            ],
            multiyearTrends: {
                nasaLandsatData: {
                    2020: { peakDate: '2020-04-18', intensity: 94, anomaly: false },
                    2021: { peakDate: '2021-04-12', intensity: 91, anomaly: false },
                    2022: { peakDate: '2022-04-20', intensity: 96, anomaly: false },
                    2023: { peakDate: '2023-04-15', intensity: 92, anomaly: false },
                    2024: { peakDate: '2024-04-25', intensity: 88, anomaly: false }
                },
                modisVegetationIndex: {
                    averageNDVI: 0.69,
                    trend: 'stable',
                    climateImpact: 'low'
                }
            },
            pollinatorInteractions: {
                primaryPollinators: [POLLINATOR_TYPES.BEES],
                pollinatorSynchronization: {
                    bees: { syncRate: 80, peakActivity: 'April' },
                    butterflies: { syncRate: 35, peakActivity: 'May' },
                    birds: { syncRate: 10, peakActivity: 'March' }
                },
                pollinatorDeficitRisk: {
                    level: THREAT_LEVELS.LOW,
                    factors: ['Spring timing', 'Early season resources'],
                    riskScore: 3
                }
            },
            invasiveSpeciesAlert: {
                threatLevel: THREAT_LEVELS.LOW,
                competitorSpecies: [],
                nativeEcosystemImpact: 'Minimal'
            },
            agricultureEconomics: {
                floweringHarvestTiming: {
                    optimalHarvest: 'Mid-April',
                    yieldPrediction: 'High',
                    economicValue: 195 // EUR/decare
                },
                diseaseRisks: {
                    postFloweringRisks: ['Tulip fire', 'Botrytis', 'Root rot'],
                    riskLevel: THREAT_LEVELS.MODERATE,
                    preventionMethods: ['Bulb treatment', 'Rotation']
                }
            },
            conservation: {
                endemicStatus: false,
                conservationPriority: 'Low',
                criticalHabitats: ['Agricultural fields', 'Gardens'],
                tourismValue: {
                    peakTourismPeriod: 'April',
                    visitorImpact: 'Very Positive',
                    ecoTourismPotential: 'Very High'
                }
            }
        },
        details: {
            habitat: "Grows in temperate climates with cold winters and mild summers.",
            allergyInfo: "Generally low allergy risk. Rarely may cause pollen allergy.",
            honeyInfo: "Tulip honey is mid-grade and known for its specific aroma. Valued as a spring honey.",
            climateImpact: "Low impact from climate change. Prefers cold climates.",
            benefits: [
                "Aesthetic appeal",
                "Garden plant",
                "Moderate honey yield",
                "Durable structure"
            ],
            threats: [
                "Extreme temperatures",
                "Soil diseases",
                "Pests",
                "Excessive rainfall"
            ]
        }
    },
    {
        id: 25,
        name: "Lily Complete (Lilium)",
        scientificName: "Lilium",
        coordinates: [],
        characteristics: {
            allergyRisk: "High",
            allergyScore: 7,
            honeyProduction: "Low",
            honeyScore: 3,
            climateSensitivity: "Moderate",
            climateScore: 6,
            benefits: "Moderate",
            benefitsScore: 5,
            threats: "Moderate",
            threatsScore: 6
        },
        description: "Lily is is a large and showy flower commonly grown in North America.",
        phenology: {
            floweringPeriod: {
                early: { month: FLOWERING_MONTHS.JUNE, day: 1 },
                peak: { month: FLOWERING_MONTHS.JULY, day: 15 },
                late: { month: FLOWERING_MONTHS.AUGUST, day: 1 }
            },
            seasonalCalendar: [
                { month: 'June', phase: 'Early Bloom', intensity: 30 },
                { month: 'July', phase: 'Peak Bloom', intensity: 100 },
                { month: 'August', phase: 'Late Bloom', intensity: 50 }
            ],
            multiyearTrends: {
                nasaLandsatData: {
                    2020: { peakDate: '2020-07-20', intensity: 92, anomaly: false },
                    2021: { peakDate: '2021-07-15', intensity: 89, anomaly: false },
                    2022: { peakDate: '2022-07-25', intensity: 94, anomaly: false },
                    2023: { peakDate: '2023-07-10', intensity: 91, anomaly: false },
                    2024: { peakDate: '2024-07-18', intensity: 87, anomaly: false }
                },
                modisVegetationIndex: {
                    averageNDVI: 0.75,
                    trend: 'stable',
                    climateImpact: 'moderate'
                }
            },
            pollinatorInteractions: {
                primaryPollinators: [POLLINATOR_TYPES.BUTTERFLIES, POLLINATOR_TYPES.BEES],
                pollinatorSynchronization: {
                    bees: { syncRate: 65, peakActivity: 'July' },
                    butterflies: { syncRate: 90, peakActivity: 'July' },
                    birds: { syncRate: 20, peakActivity: 'August' }
                },
                pollinatorDeficitRisk: {
                    level: THREAT_LEVELS.MODERATE,
                    factors: ['Horticultural dependency', 'Pesticide exposure'],
                    riskScore: 5
                }
            },
            invasiveSpeciesAlert: {
                threatLevel: THREAT_LEVELS.LOW,
                competitorSpecies: [],
                nativeEcosystemImpact: 'Minimal'
            },
            agricultureEconomics: {
                floweringHarvestTiming: {
                    optimalHarvest: 'Mid-July',
                    yieldPrediction: 'Medium',
                    economicValue: 125 // EUR/decare
                },
                diseaseRisks: {
                    postFloweringRisks: ['Lily mosaic virus', 'Aphids', 'Thrips'],
                    riskLevel: THREAT_LEVELS.HIGH,
                    preventionMethods: ['Clean propagating material', 'Insect control']
                }
            },
            conservation: {
                endemicStatus: false,
                conservationPriority: 'Medium',
                criticalHabitats: ['Garden landscapes', 'Lily farms'],
                tourismValue: {
                    peakTourismPeriod: 'July',
                    visitorImpact: 'Positive',
                    ecoTourismPotential: 'High'
                }
            }
        },
        details: {
            habitat: "Grows in temperate and cold climates, in moist soils.",
            allergyInfo: "High allergy risk due to heavy pollen production. Caution for those with pollen allergies.",
            honeyInfo: "Lily honey is low-yield but known for its special aroma. A rare honey type.",
            climateImpact: "Moderately affected by climate change. Sensitive to temperature changes.",
            benefits: [
                "Showy appearance",
                "Garden plant",
                "Medicinal properties",
                "Cut flower"
            ],
            threats: [
                "Diseases and pests",
                "Climate change",
                "Soil erosion",
                "Overharvesting"
            ]
        }
    },
    {
        id: 26,
        name: "Hyacinth Complete (Hyacinthus orientalis)",
        scientificName: "Hyacinthus orientalis",
        coordinates: [],
        characteristics: {
            allergyRisk: "Moderate",
            allergyScore: 4,
            honeyProduction: "High",
            honeyScore: 8,
            climateSensitivity: "Low",
            climateScore: 2,
            benefits: "High",
            benefitsScore: 8,
            threats: "Low",
            threatsScore: 2
        },
        description: "Hyacinth is a fragrant flower commonly grown in Türkiye.",
        phenology: {
            floweringPeriod: {
                early: { month: FLOWERING_MONTHS.MARCH, day: 10 },
                peak: { month: FLOWERING_MONTHS.APRIL, day: 20 },
                late: { month: FLOWERING_MONTHS.MAY, day: 10 }
            },
            seasonalCalendar: [
                { month: 'March', phase: 'Early Bloom', intensity: 50 },
                { month: 'April', phase: 'Peak Bloom', intensity: 100 },
                { month: 'May', phase: 'Late Bloom', intensity: 40 },
                { month: 'June', phase: 'Fading', intensity: 5 }
            ],
            multiyearTrends: {
                nasaLandsatData: {
                    2020: { peakDate: '2020-04-25', intensity: 96, anomaly: false },
                    2021: { peakDate: '2021-04-18', intensity: 93, anomaly: false },
                    2022: { peakDate: '2022-04-22', intensity: 94, anomaly: false },
                    2023: { peakDate: '2023-04-20', intensity: 97, anomaly: false },
                    2024: { peakDate: '2024-04-28', intensity: 91, anomaly: false }
                },
                modisVegetationIndex: {
                    averageNDVI: 0.70,
                    trend: 'stable',
                    climateImpact: 'low'
                }
            },
            pollinatorInteractions: {
                primaryPollinators: [POLLINATOR_TYPES.BEES],
                pollinatorSynchronization: {
                    bees: { syncRate: 92, peakActivity: 'April' },
                    butterflies: { syncRate: 45, peakActivity: 'May' },
                    birds: { syncRate: 25, peakActivity: 'March' }
                },
                pollinatorDeficitRisk: {
                    level: THREAT_LEVELS.LOW,
                    factors: ['Early bloom timing', 'High nectar production'],
                    riskScore: 2
                }
            },
            invasiveSpeciesAlert: {
                threatLevel: THREAT_LEVELS.LOW,
                competitorSpecies: [],
                nativeEcosystemImpact: 'Minimal'
            },
            agricultureEconomics: {
                floweringHarvestTiming: {
                    optimalHarvest: 'Late April',
                    yieldPrediction: 'High',
                    economicValue: 225 // EUR/decare
                },
                diseaseRisks: {
                    postFloweringRisks: ['Hyacinth mosaic virus', 'Narcissus yellow stripe virus'],
                    riskLevel: THREAT_LEVELS.MODERATE,
                    preventionMethods: ['Clean propagating material', 'Vector control']
                }
            },
            conservation: {
                endemicStatus: false,
                conservationPriority: 'Low',
                criticalHabitats: ['Agricultural areas', 'Home gardens'],
                tourismValue: {
                    peakTourismPeriod: 'April',
                    visitorImpact: 'Positive',
                    ecoTourismPotential: 'High'
                }
            }
        },
        details: {
            habitat: "Grows in temperate climates, in sunny and well-drained soils.",
            allergyInfo: "Moderate allergy risk. May cause mild pollen allergy in some people.",
            honeyInfo: "Hyacinth honey is high quality and aromatic. Very valuable as a spring honey.",
            climateImpact: "Low impact from climate change. A resilient plant.",
            benefits: [
                "Pleasant fragrance",
                "High honey yield",
                "Garden plant",
                "Medicinal properties"
            ],
            threats: [
                "Extreme temperatures",
                "Soil diseases",
                "Harmful insects",
                "Overwatering"
            ]
        }
    },
    {
        id: 27,
        name: "Ragwort Complete (Jacobaea vulgaris)",
        scientificName: "Jacobaea vulgaris",
        coordinates: [],
        characteristics: {
            allergyRisk: "High",
            allergyScore: 8,
            honeyProduction: "Low",
            honeyScore: 2,
            climateSensitivity: "Moderate",
            climateScore: 5,
            benefits: "Low",
            benefitsScore: 3,
            threats: "High",
            threatsScore: 9
        },
        description: "Ragwort is a toxic plant species that poses significant health risks to livestock.",
        phenology: {
            floweringPeriod: {
                early: { month: FLOWERING_MONTHS.JUNE, day: 1 },
                peak: { month: FLOWERING_MONTHS.AUGUST, day: 15 },
                late: { month: FLOWERING_MONTHS.SEPTEMBER, day: 30 }
            },
            seasonalCalendar: [
                { month: 'June', phase: 'Early Bloom', intensity: 20 },
                { month: 'July', phase: 'Increase Bloom', intensity: 60 },
                { month: 'August', phase: 'Peak Bloom', intensity: 90 },
                { month: 'September', phase: 'Late Bloom', intensity: 30 }
            ],
            multiyearTrends: {
                nasaLandsatData: {
                    2020: { peakDate: '2020-08-20', intensity: 88, anomaly: false },
                    2021: { peakDate: '2021-08-15', intensity: 91, anomaly: false },
                    2022: { peakDate: '2022-08-25', intensity: 94, anomaly: true, note: 'Spread expansion' },
                    2023: { peakDate: '2023-08-10', intensity: 96, anomaly: true, note: 'Increased colonization' },
                    2024: { peakDate: '2024-08-28', intensity: 98, anomaly: true, note: 'Continuing spread' }
                },
                modisVegetationIndex: {
                    averageNDVI: 0.58,
                    trend: 'increasing',
                    climateImpact: 'moderate'
                }
            },
            pollinatorInteractions: {
                primaryPollinators: [POLLINATOR_TYPES.BEES, POLLINATOR_TYPES.BUTTERFLIES],
                pollinatorSynchronization: {
                    bees: { syncRate: 45, peakActivity: 'August' },
                    butterflies: { syncRate: 85, peakActivity: 'July' },
                    birds: { syncRate: 15, peakActivity: 'September' }
                },
                pollinatorDeficitRisk: {
                    level: THREAT_LEVELS.HIGH,
                    factors: ['Toxic pollen', 'Livestock poisoning risk', 'Agricultural contamination'],
                    riskScore: 9
                }
            },
            invasiveSpeciesAlert: {
                threatLevel: THREAT_LEVELS.HIGH,
                competitorSpecies: ['Native wildflowers', 'Pasture grasses'],
                nativeEcosystemImpact: 'High'
            },
            agricultureEconomics: {
                floweringHarvestTiming: {
                    optimalHarvest: 'Manual removal before flowering',
                    yieldPrediction: 'Negative Impact',
                    economicValue: -150 // EUR/decare (costs)
                },
                diseaseRisks: {
                    postFloweringRisks: ['Livestock poisoning', 'Contamination of hay', 'Seed dispersal'],
                    riskLevel: THREAT_LEVELS.HIGH,
                    preventionMethods: ['Early identification', 'Targeted removal', 'Biological control']
                }
            },
            conservation: {
                endemicStatus: false,
                conservationPriority: 'High (Control)',
                criticalHabitats: ['Disturbed areas', 'Meadows', 'Roadside verges'],
                tourismValue: {
                    peakTourismPeriod: 'Never (avoided)',
                    visitorImpact: 'Negative',
                    ecoTourismPotential: 'None'
                }
            }
        },
        details: {
            habitat: "Disturbed areas, meadows, and roadside verges in temperate climates.",
            allergyInfo: "High allergy risk. Contains toxic alkaloids that can cause severe allergic reactions.",
            honeyInfo: "Very low honey production. Pollen is toxic and makes honey unsuitable for consumption.",
            climateImpact: "Moderately affected by climate change. Spreads rapidly in disturbed environments.",
            benefits: ["Limited ecological value", "Some medicinal properties when properly processed"],
            threats: ["Liver toxicity", "Livestock poisoning", "Invasive nature", "Agricultural contamination"]
        }
    },
    {
        id: 28,
        name: "Cypress Complete (Cupressus sempervirens)",
        scientificName: "Cupressus sempervirens",
        coordinates: [],
        characteristics: {
            allergyRisk: "High",
            allergyScore: 9,
            honeyProduction: "Low",
            honeyScore: 1,
            climateSensitivity: "Low",
            climateScore: 3,
            benefits: "Moderate",
            benefitsScore: 5,
            threats: "Moderate",
            threatsScore: 5
        },
        description: "Mediterranean cypress is an evergreen tree known for its columnar shape and high pollen production.",
        phenology: {
            floweringPeriod: {
                early: { month: FLOWERING_MONTHS.FEBRUARY, day: 20 },
                peak: { month: FLOWERING_MONTHS.MARCH, day: 15 },
                late: { month: FLOWERING_MONTHS.APRIL, day: 10 }
            },
            seasonalCalendar: [
                { month: 'February', phase: 'Early Pollen', intensity: 40 },
                { month: 'March', phase: 'Peak Pollen', intensity: 100 },
                { month: 'April', phase: 'Late Pollen', intensity: 60 },
                { month: 'May', phase: 'Pollen Decline', intensity: 10 }
            ],
            multiyearTrends: {
                nasaLandsatData: {
                    2020: { peakDate: '2020-03-20', intensity: 95, anomaly: false },
                    2021: { peakDate: '2021-03-10', intensity: 97, anomaly: false },
                    2022: { peakDate: '2022-03-15', intensity: 94, anomaly: false },
                    2023: { peakDate: '2023-03-12', intensity: 96, anomaly: false },
                    2024: { peakDate: '2024-03-18', intensity: 92, anomaly: false }
                },
                modisVegetationIndex: {
                    averageNDVI: 0.68,
                    trend: 'stable',
                    climateImpact: 'low'
                }
            },
            pollinatorInteractions: {
                primaryPollinators: [POLLINATOR_TYPES.WIND],
                pollinatorSynchronization: {
                    bees: { syncRate: 5, peakActivity: 'No activity' },
                    butterflies: { syncRate: 10, peakActivity: 'No activity' },
                    birds: { syncRate: 20, peakActivity: 'March' }
                },
                pollinatorDeficitRisk: {
                    level: THREAT_LEVELS.LOW,
                    factors: ['Wind-pollinated', 'No dependence on insects'],
                    riskScore: 1
                }
            },
            invasiveSpeciesAlert: {
                threatLevel: THREAT_LEVELS.MODERATE,
                competitorSpecies: ['Native Mediterranean species'],
                nativeEcosystemImpact: 'Moderate'
            },
            agricultureEconomics: {
                floweringHarvestTiming: {
                    optimalHarvest: 'Not applicable - ornamental tree',
                    yieldPrediction: 'Ornamental Value',
                    economicValue: 85 // EUR/tree
                },
                diseaseRisks: {
                    postFloweringRisks: ['Cypress canker', 'Bark beetles', 'Fire risk'],
                    riskLevel: THREAT_LEVELS.MODERATE,
                    preventionMethods: ['Regular inspection', 'Fire prevention']
                }
            },
            conservation: {
                endemicStatus: false,
                conservationPriority: 'Medium',
                criticalHabitats: ['Mediterranean landscapes', 'Urban areas'],
                tourismValue: {
                    peakTourismPeriod: 'Year-round',
                    visitorImpact: 'Neutral',
                    ecoTourismPotential: 'Low'
                }
            }
        },
        details: {
            habitat: "Mediterranean climate regions with well-drained soils and full sun exposure.",
            allergyInfo: "Very high allergy risk. Heavy pollen producer that causes severe respiratory allergies.",
            honeyInfo: "Minimal honey production. Pollen is allergenic and not preferred by bees.",
            climateImpact: "Low climate sensitivity. Drought-tolerant and adapts well to changing conditions.",
            benefits: ["Windbreak", "Ornamental value", "Wood production", "Drought resistance"],
            threats: ["Allergenic pollen", "Fire risk", "Resin toxicity", "Invasive potential"]
        }
    },
    {
        id: 29,
        name: "Alder Complete (Alnus glutinosa)",
        scientificName: "Alnus glutinosa",
        coordinates: [],
        characteristics: {
            allergyRisk: "Moderate",
            allergyScore: 6,
            honeyProduction: "Moderate",
            honeyScore: 5,
            climateSensitivity: "Moderate",
            climateScore: 5,
            benefits: "High",
            benefitsScore: 7,
            threats: "Moderate",
            threatsScore: 4
        },
        description: "Common alder is a nitrogen-fixing tree commonly found in wet soils near water bodies.",
        phenology: {
            floweringPeriod: {
                early: { month: FLOWERING_MONTHS.FEBRUARY, day: 15 },
                peak: { month: FLOWERING_MONTHS.MARCH, day: 10 },
                late: { month: FLOWERING_MONTHS.APRIL, day: 5 }
            },
            seasonalCalendar: [
                { month: 'February', phase: 'Early Bloom', intensity: 40 },
                { month: 'March', phase: 'Peak Bloom', intensity: 100 },
                { month: 'April', phase: 'Late Bloom', intensity: 60 },
                { month: 'May', phase: 'Leaf Emergence', intensity: 10 }
            ],
            multiyearTrends: {
                nasaLandsatData: {
                    2020: { peakDate: '2020-03-15', intensity: 91, anomaly: false },
                    2021: { peakDate: '2021-03-05', intensity: 88, anomaly: false },
                    2022: { peakDate: '2022-03-12', intensity: 93, anomaly: false },
                    2023: { peakDate: '2023-03-08', intensity: 89, anomaly: false },
                    2024: { peakDate: '2024-03-18', intensity: 85, anomaly: true, note: 'Late bloom due to cold' }
                },
                modisVegetationIndex: {
                    averageNDVI: 0.74,
                    trend: 'stable',
                    climateImpact: 'moderate'
                }
            },
            pollinatorInteractions: {
                primaryPollinators: [POLLINATOR_TYPES.WIND, POLLINATOR_TYPES.BEES],
                pollinatorSynchronization: {
                    bees: { syncRate: 60, peakActivity: 'March' },
                    butterflies: { syncRate: 40, peakActivity: 'April' },
                    birds: { syncRate: 35, peakActivity: 'March' }
                },
                pollinatorDeficitRisk: {
                    level: THREAT_LEVELS.LOW,
                    factors: ['Wind pollination backup', 'Early spring resource'],
                    riskScore: 3
                }
            },
            invasiveSpeciesAlert: {
                threatLevel: THREAT_LEVELS.LOW,
                competitorSpecies: [],
                nativeEcosystemImpact: 'Positive'
            },
            agricultureEconomics: {
                floweringHarvestTiming: {
                    optimalHarvest: 'Not applicable - forestry',
                    yieldPrediction: 'Forestry Value',
                    economicValue: 75 // EUR/tree
                },
                diseaseRisks: {
                    postFloweringRisks: ['Root disease', 'Flood stress', 'Climate stress'],
                    riskLevel: THREAT_LEVELS.MODERATE,
                    preventionMethods: ['Soil drainage management', 'Disease monitoring']
                }
            },
            conservation: {
                endemicStatus: false,
                conservationPriority: 'Medium',
                criticalHabitats: ['Riparian zones', 'Wet woodlands', 'Marshes'],
                tourismValue: {
                    peakTourismPeriod: 'Spring',
                    visitorImpact: 'Neutral',
                    ecoTourismPotential: 'Medium'
                }
            }
        },
        details: {
            habitat: "Riparian zones, wet woodlands, and marshes in temperate climates.",
            allergyInfo: "Moderate allergy risk. Early blooming pollen can affect sensitive individuals.",
            honeyInfo: "Moderate honey production with early season nectar value.",
            climateImpact: "Moderately sensitive to climate change. Vulnerable to extreme drought and flooding.",
            benefits: ["Nitrogen fixation", "Soil improvement", "Riparian stabilization", "Wildlife habitat"],
            threats: ["Drought susceptibility", "Root disease", "Flooding stress", "Climate shifts"]
        }
    },
    {
        id: 30,
        name: "Rye Complete (Secale cereale)",
        scientificName: "Secale cereale",
        coordinates: [],
        characteristics: {
            allergyRisk: "Moderate",
            allergyScore: 5,
            honeyProduction: "Moderate",
            honeyScore: 4,
            climateSensitivity: "Low",
            climateScore: 4,
            benefits: "High",
            benefitsScore: 8,
            threats: "Moderate",
            threatsScore: 6
        },
        description: "Rye is a hardy cereal grain crop with excellent cold tolerance and nutritional value.",
        phenology: {
            floweringPeriod: {
                early: { month: FLOWERING_MONTHS.APRIL, day: 15 },
                peak: { month: FLOWERING_MONTHS.MAY, day: 10 },
                late: { month: FLOWERING_MONTHS.MAY, day: 25 }
            },
            seasonalCalendar: [
                { month: 'April', phase: 'Early Bloom', intensity: 50 },
                { month: 'May', phase: 'Peak Bloom', intensity: 100 },
                { month: 'June', phase: 'Seed Development', intensity: 20 },
                { month: 'July', phase: 'Maturation', intensity: 5 }
            ],
            multiyearTrends: {
                nasaLandsatData: {
                    2020: { peakDate: '2020-05-15', intensity: 93, anomaly: false },
                    2021: { peakDate: '2021-05-08', intensity: 91, anomaly: false },
                    2022: { peakDate: '2022-05-12', intensity: 95, anomaly: false },
                    2023: { peakDate: '2023-05-10', intensity: 89, anomaly: false },
                    2024: { peakDate: '2024-05-18', intensity: 87, anomaly: false }
                },
                modisVegetationIndex: {
                    averageNDVI: 0.76,
                    trend: 'stable',
                    climateImpact: 'low'
                }
            },
            pollinatorInteractions: {
                primaryPollinators: [POLLINATOR_TYPES.WIND],
                pollinatorSynchronization: {
                    bees: { syncRate: 30, peakActivity: 'May' },
                    butterflies: { syncRate: 20, peakActivity: 'May' },
                    birds: { syncRate: 10, peakActivity: 'April' }
                },
                pollinatorDeficitRisk: {
                    level: THREAT_LEVELS.LOW,
                    factors: ['Wind-pollinated', 'Agricultural crop'],
                    riskScore: 2
                }
            },
            invasiveSpeciesAlert: {
                threatLevel: THREAT_LEVELS.LOW,
                competitorSpecies: ['Other cereal crops'],
                nativeEcosystemImpact: 'Minimal'
            },
            agricultureEconomics: {
                floweringHarvestTiming: {
                    optimalHarvest: 'July-August',
                    yieldPrediction: 'High',
                    economicValue: 140 // EUR/decare
                },
                diseaseRisks: {
                    postFloweringRisks: ['Ergot fungus', 'Fungal diseases', 'Weather extremes'],
                    riskLevel: THREAT_LEVELS.MODERATE,
                    preventionMethods: ['Crop rotation', 'Disease-resistant varieties', 'Weather monitoring']
                }
            },
            conservation: {
                endemicStatus: false,
                conservationPriority: 'Low',
                criticalHabitats: ['Agricultural fields'],
                tourismValue: {
                    peakTourismPeriod: 'Summer',
                    visitorImpact: 'Neutral',
                    ecoTourismPotential: 'Low'
                }
            }
        },
        details: {
            habitat: "Cool temperate regions with well-drained soils. Commercial agricultural production.",
            allergyInfo: "Moderate allergy risk. Grain dust and pollen can cause respiratory issues.",
            honeyInfo: "Moderate honey production potential from agricultural landscapes.",
            climateImpact: "Low climate sensitivity. Excellent cold tolerance and adaptability to harsh conditions.",
            benefits: ["High nutrition", "Cold tolerance", "Soil improvement", "Bread production"],
            threats: ["Ergot fungus", "Fungal diseases", "Weather extremes", "Market volatility"]
        }
    },
    {
        id: 31,
        name: "Barley Complete (Hordeum vulgare)",
        scientificName: "Hordeum vulgare",
        coordinates: [],
        characteristics: {
            allergyRisk: "Moderate",
            allergyScore: 5,
            honeyProduction: "Low",
            honeyScore: 3,
            climateSensitivity: "Low",
            climateScore: 4,
            benefits: "High",
            benefitsScore: 8,
            threats: "Moderate",
            threatsScore: 6
        },
        description: "Barley is one of the world's most ancient cereal crops with high drought tolerance.",
        phenology: {
            floweringPeriod: {
                early: { month: FLOWERING_MONTHS.APRIL, day: 20 },
                peak: { month: FLOWERING_MONTHS.MAY, day: 15 },
                late: { month: FLOWERING_MONTHS.MAY, day: 30 }
            },
            seasonalCalendar: [
                { month: 'April', phase: 'Early Bloom', intensity: 40 },
                { month: 'May', phase: 'Peak Bloom', intensity: 100 },
                { month: 'June', phase: 'Seed Development', intensity: 30 },
                { month: 'July', phase: 'Maturation', intensity: 10 }
            ],
            multiyearTrends: {
                nasaLandsatData: {
                    2020: { peakDate: '2020-05-20', intensity: 92, anomaly: false },
                    2021: { peakDate: '2021-05-12', intensity: 89, anomaly: false },
                    2022: { peakDate: '2022-05-18', intensity: 94, anomaly: false },
                    2023: { peakDate: '2023-05-15', intensity: 87, anomaly: true, note: 'Drought stress' },
                    2024: { peakDate: '2024-05-25', intensity: 90, anomaly: false }
                },
                modisVegetationIndex: {
                    averageNDVI: 0.71,
                    trend: 'stable',
                    climateImpact: 'low'
                }
            },
            pollinatorInteractions: {
                primaryPollinators: [POLLINATOR_TYPES.WIND],
                pollinatorSynchronization: {
                    bees: { syncRate: 25, peakActivity: 'May' },
                    butterflies: { syncRate: 15, peakActivity: 'May' },
                    birds: { syncRate: 8, peakActivity: 'April' }
                },
                pollinatorDeficitRisk: {
                    level: THREAT_LEVELS.LOW,
                    factors: ['Wind-pollinated', 'Self-pollinating'],
                    riskScore: 2
                }
            },
            invasiveSpeciesAlert: {
                threatLevel: THREAT_LEVELS.LOW,
                competitorSpecies: ['Wild barley species'],
                nativeEcosystemImpact: 'Minimal'
            },
            agricultureEconomics: {
                floweringHarvestTiming: {
                    optimalHarvest: 'July-August',
                    yieldPrediction: 'Moderate-High',
                    economicValue: 125 // EUR/decare
                },
                diseaseRisks: {
                    postFloweringRisks: ['Fungal diseases', "Barley yellow dwarf virus", 'Weather extremes'],
                    riskLevel: THREAT_LEVELS.MODERATE,
                    preventionMethods: ['Resistant varieties', 'Timely planting', 'Weather monitoring']
                }
            },
            conservation: {
                endemicStatus: false,
                conservationPriority: 'Low',
                criticalHabitats: ['Agricultural regions'],
                tourismValue: {
                    peakTourismPeriod: 'Summer',
                    visitorImpact: 'Neutral',
                    ecoTourismPotential: 'Low'
                }
            }
        },
        details: {
            habitat: "Cool to temperate climates in agricultural areas with moderate precipitation.",
            allergyInfo: "Moderate allergy risk. Grain dust exposure can cause respiratory symptoms.",
            honeyInfo: "Low honey production from agricultural landscapes with limited floral diversity.",
            climateImpact: "Low climate sensitivity. Good drought tolerance and adaptability to variable conditions.",
            benefits: ["High nutrition", "Malting quality", "Feed grain", "Drought resistant"],
            threats: ["Fungal diseases", "Weather extremes", "Soil fertility", "Market dependency"]
        }
    },
    {
        id: 32,
        name: "Peanut Complete (Arachis hypogaea)",
        scientificName: "Arachis hypogaea",
        coordinates: [],
        characteristics: {
            allergyRisk: "High",
            allergyScore: 9,
            honeyProduction: "Low",
            honeyScore: 2,
            climateSensitivity: "Moderate",
            climateScore: 6,
            benefits: "High",
            benefitsScore: 9,
            threats: "Low",
            threatsScore: 4
        },
        description: "Peanut is a legume crop highly valued for its protein and oil content, but poses severe allergy risks.",
        phenology: {
            floweringPeriod: {
                early: { month: FLOWERING_MONTHS.JUNE, day: 15 },
                peak: { month: FLOWERING_MONTHS.JULY, day: 20 },
                late: { month: FLOWERING_MONTHS.AUGUST, day: 10 }
            },
            seasonalCalendar: [
                { month: 'June', phase: 'Early Bloom', intensity: 40 },
                { month: 'July', phase: 'Peak Bloom', intensity: 80 },
                { month: 'August', phase: 'Continued Bloom', intensity: 60 },
                { month: 'September', phase: 'Pod Development', intensity: 20 }
            ],
            multiyearTrends: {
                nasaLandsatData: {
                    2020: { peakDate: '2020-07-25', intensity: 89, anomaly: false },
                    2021: { peakDate: '2021-07-18', intensity: 87, anomaly: false },
                    2022: { peakDate: '2022-07-22', intensity: 91, anomaly: false },
                    2023: { peakDate: '2023-07-15', intensity: 84, anomaly: true, note: 'Drought impact' },
                    2024: { peakDate: '2024-07-28', intensity: 88, anomaly: false }
                },
                modisVegetationIndex: {
                    averageNDVI: 0.72,
                    trend: 'stable',
                    climateImpact: 'moderate'
                }
            },
            pollinatorInteractions: {
                primaryPollinators: [POLLINATOR_TYPES.BEES],
                pollinatorSynchronization: {
                    bees: { syncRate: 70, peakActivity: 'July' },
                    butterflies: { syncRate: 40, peakActivity: 'July' },
                    birds: { syncRate: 25, peakActivity: 'August' }
                },
                pollinatorDeficitRisk: {
                    level: THREAT_LEVELS.MODERATE,
                    factors: ['Self-pollination capability', 'Limited pollinator dependency'],
                    riskScore: 4
                }
            },
            invasiveSpeciesAlert: {
                threatLevel: THREAT_LEVELS.LOW,
                competitorSpecies: [],
                nativeEcosystemImpact: 'Minimal'
            },
            agricultureEconomics: {
                floweringHarvestTiming: {
                    optimalHarvest: 'September-October',
                    yieldPrediction: 'High',
                    economicValue: 220 // EUR/decare
                },
                diseaseRisks: {
                    postFloweringRisks: ['Soil pathogens', 'Fungal contamination', 'Aflatoxin risk'],
                    riskLevel: THREAT_LEVELS.MODERATE,
                    preventionMethods: ['Crop rotation', 'Proper curing', 'Storage management']
                }
            },
            conservation: {
                endemicStatus: false,
                conservationPriority: 'Low',
                criticalHabitats: ['Agricultural fields'],
                tourismValue: {
                    peakTourismPeriod: 'Harvest season',
                    visitorImpact: 'Neutral',
                    ecoTourismPotential: 'Low'
                }
            }
        },
        details: {
            habitat: "Warm subtropical climates with well-drained sandy soils and adequate moisture.",
            allergyInfo: "Very high allergy risk. Severe and potentially life-threatening allergic reactions.",
            honeyInfo: "Very low honey production. Flowers are self-pollinating with limited nectar.",
            climateImpact: "Moderately sensitive to climate change. Vulnerable to drought and extreme rainfall.",
            benefits: ["High protein", "Oil production", "Food security", "Cash crop"],
            threats: ["Severe allergies", "Fungal contamination", "Weather dependence", "Processing hazards"]
        }
    },
    {
        id: 33,
        name: "Sesame Complete (Sesamum indicum)",
        scientificName: "Sesamum indicum",
        coordinates: [],
        characteristics: {
            allergyRisk: "High",
            allergyScore: 8,
            honeyProduction: "High",
            honeyScore: 7,
            climateSensitivity: "Moderate",
            climateScore: 5,
            benefits: "High",
            benefitsScore: 8,
            threats: "Low",
            threatsScore: 3
        },
        description: "Sesame is an ancient oilseed crop known for its drought tolerance and nutritional value.",
        phenology: {
            floweringPeriod: {
                early: { month: FLOWERING_MONTHS.JULY, day: 10 },
                peak: { month: FLOWERING_MONTHS.AUGUST, day: 15 },
                late: { month: FLOWERING_MONTHS.SEPTEMBER, day: 5 }
            },
            seasonalCalendar: [
                { month: 'July', phase: 'Early Bloom', intensity: 30 },
                { month: 'August', phase: 'Peak Bloom', intensity: 100 },
                { month: 'September', phase: 'Late Bloom', intensity: 50 },
                { month: 'October', phase: 'Seed Development', intensity: 10 }
            ],
            multiyearTrends: {
                nasaLandsatData: {
                    2020: { peakDate: '2020-08-18', intensity: 92, anomaly: false },
                    2021: { peakDate: '2021-08-12', intensity: 89, anomaly: false },
                    2022: { peakDate: '2022-08-15', intensity: 95, anomaly: false },
                    2023: { peakDate: '2023-08-20', intensity: 87, anomaly: true, note: 'Drought stress' },
                    2024: { peakDate: '2024-08-25', intensity: 90, anomaly: false }
                },
                modisVegetationIndex: {
                    averageNDVI: 0.75,
                    trend: 'stable',
                    climateImpact: 'moderate'
                }
            },
            pollinatorInteractions: {
                primaryPollinators: [POLLINATOR_TYPES.BEES, POLLINATOR_TYPES.BUTTERFLIES],
                pollinatorSynchronization: {
                    bees: { syncRate: 85, peakActivity: 'August' },
                    butterflies: { syncRate: 90, peakActivity: 'August' },
                    birds: { syncRate: 35, peakActivity: 'September' }
                },
                pollinatorDeficitRisk: {
                    level: THREAT_LEVELS.LOW,
                    factors: ['Abundant nectar', 'High pollinator attraction'],
                    riskScore: 2
                }
            },
            invasiveSpeciesAlert: {
                threatLevel: THREAT_LEVELS.LOW,
                competitorSpecies: [],
                nativeEcosystemImpact: 'Minimal'
            },
            agricultureEconomics: {
                floweringHarvestTiming: {
                    optimalHarvest: 'October',
                    yieldPrediction: 'High',
                    economicValue: 185 // EUR/decare
                },
                diseaseRisks: {
                    postFloweringRisks: ['Whitefly infestation', 'Seed shattering', 'Drought stress'],
                    riskLevel: THREAT_LEVELS.MODERATE,
                    preventionMethods: ['Irrigation management', 'Pest monitoring', 'Timely harvest']
                }
            },
            conservation: {
                endemicStatus: false,
                conservationPriority: 'Low',
                criticalHabitats: ['Agricultural regions'],
                tourismValue: {
                    peakTourismPeriod: 'Harvest period',
                    visitorImpact: 'Neutral',
                    ecoTourismPotential: 'Low'
                }
            }
        },
        details: {
            habitat: "Tropical and subtropical regions with warm temperatures and well-drained soils.",
            allergyInfo: "High allergy risk. Seeds can cause severe systemic allergic reactions.",
            honeyInfo: "Good honey production potential with abundant nectar from aromatic flowers.",
            climateImpact: "Moderately sensitive to climate change. Benefits from increased CO2 but vulnerable to extreme temperatures.",
            benefits: ["Oil production", "Nutritional value", "Drought resistant", "Medicinal properties"],
            threats: ["Allergy risk", "Seed shattering", "Pest susceptibility", "Harvest timing"]
        }
    },
    {
        id: 34,
        name: "Tea Complete (Camellia sinensis)",
        scientificName: "Camellia sinensis",
        coordinates: [],
        characteristics: {
            allergyRisk: "Low",
            allergyScore: 2,
            honeyProduction: "Moderate",
            honeyScore: 5,
            climateSensitivity: "High",
            climateScore: 7,
            benefits: "High",
            benefitsScore: 9,
            threats: "Low",
            threatsScore: 3
        },
        description: "Tea plant is a caffeine-producing evergreen shrub cultivated in subtropical highlands.",
        phenology: {
            floweringPeriod: {
                early: { month: FLOWERING_MONTHS.OCTOBER, day: 15 },
                peak: { month: FLOWERING_MONTHS.NOVEMBER, day: 20 },
                late: { month: FLOWERING_MONTHS.DECEMBER, day: 10 }
            },
            seasonalCalendar: [
                { month: 'October', phase: 'Early Bloom', intensity: 40 },
                { month: 'November', phase: 'Peak Bloom', intensity: 90 },
                { month: 'December', phase: 'Late Bloom', intensity: 60 },
                { month: 'January', phase: 'Dormant Period', intensity: 5 }
            ],
            multiyearTrends: {
                nasaLandsatData: {
                    2020: { peakDate: '2020-11-25', intensity: 91, anomaly: false },
                    2021: { peakDate: '2021-11-18', intensity: 89, anomaly: false },
                    2022: { peakDate: '2022-11-22', intensity: 93, anomaly: false },
                    2023: { peakDate: '2023-11-15', intensity: 84, anomaly: true, note: 'Climate stress' },
                    2024: { peakDate: '2024-11-28', intensity: 86, anomaly: true, note: 'Continuing stress' }
                },
                modisVegetationIndex: {
                    averageNDVI: 0.78,
                    trend: 'decreasing',
                    climateImpact: 'high'
                }
            },
            pollinatorInteractions: {
                primaryPollinators: [POLLINATOR_TYPES.BEES, POLLINATOR_TYPES.BUTTERFLIES],
                pollinatorSynchronization: {
                    bees: { syncRate: 70, peakActivity: 'November' },
                    butterflies: { syncRate: 60, peakActivity: 'October' },
                    birds: { syncRate: 45, peakActivity: 'November' }
                },
                pollinatorDeficitRisk: {
                    level: THREAT_LEVELS.MODERATE,
                    factors: ['Climate stress', 'Plantation management'],
                    riskScore: 5
                }
            },
            invasiveSpeciesAlert: {
                threatLevel: THREAT_LEVELS.MODERATE,
                competitorSpecies: ['Native forest species'],
                nativeEcosystemImpact: 'Moderate'
            },
            agricultureEconomics: {
                floweringHarvestTiming: {
                    optimalHarvest: 'Manual leaf harvest year-round',
                    yieldPrediction: 'Continuous',
                    economicValue: 320 // EUR/decare
                },
                diseaseRisks: {
                    postFloweringRisks: ['Tea leaf blight', 'Root rot', 'Insect damage'],
                    riskLevel: THREAT_LEVELS.MODERATE,
                    preventionMethods: ['Pest control', 'Proper drainage', 'Crop rotation']
                }
            },
            conservation: {
                endemicStatus: false,
                conservationPriority: 'Medium',
                criticalHabitats: ['Subtropical highlands', 'Tea plantations'],
                tourismValue: {
                    peakTourismPeriod: 'Year-round',
                    visitorImpact: 'Positive',
                    ecoTourismPotential: 'High'
                }
            }
        },
        details: {
            habitat: "Subtropical highland regions with acidic soils, moderate temperatures, and high humidity.",
            allergyInfo: "Low allergy risk. Non-allergenic plant with minimal pollen production.",
            honeyInfo: "Moderate honey production from plantation areas with mixed floral resources.",
            climateImpact: "High climate sensitivity. Vulnerable to temperature changes, rainfall patterns, and extreme weather.",
            benefits: ["Caffeine production", "Economic value", "Cultural significance", "Health benefits"],
            threats: ["Climate vulnerability", "Labor intensive", "Market fluctuations", "Soil acidification"]
        }
    },
    {
        id: 35,
        name: "Almond Complete (Prunus dulcis)",
        scientificName: "Prunus dulcis",
        coordinates: [],
        characteristics: {
            allergyRisk: "High",
            allergyScore: 9,
            honeyProduction: "High",
            honeyScore: 8,
            climateSensitivity: "Moderate",
            climateScore: 5,
            benefits: "High",
            benefitsScore: 9,
            threats: "Moderate",
            threatsScore: 5
        },
        description: "Almond is a nut-producing tree highly valued for its nutritional and honey-producing qualities.",
        phenology: {
            floweringPeriod: {
                early: { month: FLOWERING_MONTHS.FEBRUARY, day: 20 },
                peak: { month: FLOWERING_MONTHS.MARCH, day: 15 },
                late: { month: FLOWERING_MONTHS.APRIL, day: 5 }
            },
            seasonalCalendar: [
                { month: 'February', phase: 'Early Bloom', intensity: 50 },
                { month: 'March', phase: 'Peak Bloom', intensity: 100 },
                { month: 'April', phase: 'Late Bloom', intensity: 60 },
                { month: 'May', phase: 'Fruit Development', intensity: 10 }
            ],
            multiyearTrends: {
                nasaLandsatData: {
                    2020: { peakDate: '2020-03-20', intensity: 94, anomaly: false },
                    2021: { peakDate: '2021-03-12', intensity: 87, anomaly: true, note: 'Frost damage' },
                    2022: { peakDate: '2022-03-18', intensity: 91, anomaly: false },
                    2023: { peakDate: '2023-03-15', intensity: 88, anomaly: false },
                    2024: { peakDate: '2024-03-10', intensity: 92, anomaly: true, note: 'Early bloom' }
                },
                modisVegetationIndex: {
                    averageNDVI: 0.79,
                    trend: 'stable',
                    climateImpact: 'moderate'
                }
            },
            pollinatorInteractions: {
                primaryPollinators: [POLLINATOR_TYPES.BEES],
                pollinatorSynchronization: {
                    bees: { syncRate: 95, peakActivity: 'March' },
                    butterflies: { syncRate: 30, peakActivity: 'April' },
                    birds: { syncRate: 40, peakActivity: 'March' }
                },
                pollinatorDeficitRisk: {
                    level: THREAT_LEVELS.MODERATE,
                    factors: ['Pollination dependency', 'Climate vulnerability', 'Early bloom timing'],
                    riskScore: 6
                }
            },
            invasiveSpeciesAlert: {
                threatLevel: THREAT_LEVELS.LOW,
                competitorSpecies: [],
                nativeEcosystemImpact: 'Minimal'
            },
            agricultureEconomics: {
                floweringHarvestTiming: {
                    optimalHarvest: 'August-September',
                    yieldPrediction: 'High',
                    economicValue: 380 // EUR/decare
                },
                diseaseRisks: {
                    postFloweringRisks: ['Brown rot', 'Almond scab', 'Frost damage'],
                    riskLevel: THREAT_LEVELS.HIGH,
                    preventionMethods: ['Frost protection', 'Fungal treatments', 'Pruning']
                }
            },
            conservation: {
                endemicStatus: false,
                conservationPriority: 'Low',
                criticalHabitats: ['Mediterranean orchards'],
                tourismValue: {
                    peakTourismPeriod: 'March',
                    visitorImpact: 'Positive',
                    ecoTourismPotential: 'Very High'
                }
            }
        },
        details: {
            habitat: "Mediterranean climate regions with mild winters, warm summers, and well-drained soils.",
            allergyInfo: "Very high allergy risk. Tree nuts cause severe and potentially fatal allergic reactions.",
            honeyInfo: "Excellent honey production with early spring blooming and abundant nectar.",
            climateImpact: "Moderately sensitive to climate change. Vulnerable to late frost and drought stress.",
            benefits: ["High nutrition", "Excellent honey", "Economic value", "Early bloom"],
            threats: ["Severe allergies", "Frost sensitivity", "Drought stress", "Pollination dependency"]
        }
    },
    {
        id: 36,
        name: "Cherry Blossom Complete (Prunus serrulata)",
        scientificName: "Prunus serrulata",
        coordinates: [],
        characteristics: {
            allergyRisk: "Medium",
            allergyScore: 5,
            honeyProduction: "High",
            honeyScore: 7,
            climateSensitivity: "Medium",
            climateScore: 6,
            benefits: "High",
            benefitsScore: 8,
            threats: "Low",
            threatsScore: 3
        },
        description: "Cherry blossom is a flowering ornamental tree celebrated for its spectacular spring blooms.",
        phenology: {
            floweringPeriod: {
                early: { month: FLOWERING_MONTHS.APRIL, day: 5 },
                peak: { month: FLOWERING_MONTHS.APRIL, day: 20 },
                late: { month: FLOWERING_MONTHS.MAY, day: 5 }
            },
            seasonalCalendar: [
                { month: 'April', phase: 'Peak Bloom', intensity: 100 },
                { month: 'May', phase: 'Late Bloom', intensity: 60 },
                { month: 'June', phase: 'Leaf Emergence', intensity: 15 }
            ],
            multiyearTrends: {
                nasaLandsatData: {
                    2020: { peakDate: '2020-04-25', intensity: 93, anomaly: false },
                    2021: { peakDate: '2021-04-18', intensity: 90, anomaly: false },
                    2022: { peakDate: '2022-04-22', intensity: 95, anomaly: false },
                    2023: { peakDate: '2023-04-15', intensity: 88, anomaly: true, note: 'Weather variability' },
                    2024: { peakDate: '2024-04-28', intensity: 91, anomaly: false }
                },
                modisVegetationIndex: {
                    averageNDVI: 0.81,
                    trend: 'stable',
                    climateImpact: 'moderate'
                }
            },
            pollinatorInteractions: {
                primaryPollinators: [POLLINATOR_TYPES.BEES, POLLINATOR_TYPES.BUTTERFLIES],
                pollinatorSynchronization: {
                    bees: { syncRate: 88, peakActivity: 'April' },
                    butterflies: { syncRate: 75, peakActivity: 'April' },
                    birds: { syncRate: 35, peakActivity: 'April' }
                },
                pollinatorDeficitRisk: {
                    level: THREAT_LEVELS.LOW,
                    factors: ['High pollination attraction', 'Spring timing'],
                    riskScore: 3
                }
            },
            invasiveSpeciesAlert: {
                threatLevel: THREAT_LEVELS.LOW,
                competitorSpecies: [],
                nativeEcosystemImpact: 'Minimal'
            },
            agricultureEconomics: {
                floweringHarvestTiming: {
                    optimalHarvest: 'Not applicable - ornamental',
                    yieldPrediction: 'Ornamental Value',
                    economicValue: 125 // EUR/tree
                },
                diseaseRisks: {
                    postFloweringRisks: ['Black knot', 'Cherry leaf spot', 'Powdery mildew'],
                    riskLevel: THREAT_LEVELS.MODERATE,
                    preventionMethods: ['Proper pruning', 'Fungicide application', 'Variety selection']
                }
            },
            conservation: {
                endemicStatus: false,
                conservationPriority: 'Medium',
                criticalHabitats: ['Urban landscapes', 'Parks', 'Gardens'],
                tourismValue: {
                    peakTourismPeriod: 'April',
                    visitorImpact: 'Very Positive',
                    ecoTourismPotential: 'Very High'
                }
            }
        },
        details: {
            habitat: "Temperate climates with cold winters and moderate spring temperatures.",
            allergyInfo: "Moderate allergy risk. Pollen can cause seasonal allergic rhinitis.",
            honeyInfo: "Good honey production from spring flowering with abundant nectar resources.",
            climateImpact: "Moderately sensitive to climate change. Vulnerable to late frost damage and altered bloom timing.",
            benefits: ["Ornamental beauty", "Cultural significance", "Spring honey", "Tourism value"],
            threats: ["Frost damage", "Disease susceptibility", "Short bloom period", "Weather dependency"]
        }
    }
];

// Renk kodları
const colorMapping = {
    allergy: {
        low: '#27ae60',    // Green - Low risk
        medium: '#f39c12', // Orange - Medium risk
        high: '#e74c3c'    // Red - High risk
    },
    honey: {
        low: '#95a5a6',    // Gray - Low yield
        medium: '#3498db', // Blue - Medium yield
        high: '#2ecc71'    // Green - High yield
    },
    climate: {
        low: '#27ae60',    // Green - Low sensitivity
        medium: '#f39c12', // Orange - Medium sensitivity
        high: '#e74c3c'    // Red - High sensitivity
    },
    benefits: {
        low: '#8e44ad',   // Purple - Low benefit
        medium: '#9b59b6', // Light purple - Moderate benefit
        high: '#e91e63'    // Pink - High benefit
    },
    threats: {
        low: '#2ecc71',    // Green - Low threat
        medium: '#f1c40f', // Yellow - Medium threat
        high: '#e67e22'    // Orange - High threat
    }
};

// Skor aralıklarına göre kategori belirleme
function getCategory(score) {
    if (score <= 3) return 'low';
    if (score <= 6) return 'medium';
    return 'high';
}

// Bitki türüne göre renk belirleme
function getPlantColor(plant, filterType) {
    let score, colorMap;
    
    switch(filterType) {
        case 'allergy':
            score = plant.characteristics.allergyScore;
            colorMap = colorMapping.allergy;
            break;
        case 'honey':
            score = plant.characteristics.honeyScore;
            colorMap = colorMapping.honey;
            break;
        case 'climate':
            score = plant.characteristics.climateScore;
            colorMap = colorMapping.climate;
            break;
        case 'benefits':
            score = plant.characteristics.benefitsScore;
            colorMap = colorMapping.benefits;
            break;
        case 'threats':
            score = plant.characteristics.threatsScore;
            colorMap = colorMapping.threats;
            break;
        default:
            return '#3498db'; // Default blue
    }
    
    const category = getCategory(score);
    return colorMap[category];
}

// Phenology analysis functions
function getCurrentFloweringPhase(plant) {
    if (!plant.phenology) return null;
    
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    
    const calendar = plant.phenology.seasonalCalendar;
    const monthNames = {
        1: 'January', 2: 'February', 3: 'March', 4: 'April', 5: 'May', 6: 'June',
        7: 'July', 8: 'August', 9: 'September', 10: 'October', 11: 'November', 12: 'December'
    };
    
    const currentMonthName = monthNames[currentMonth];
    const currentPhase = calendar.find(c => c.month === currentMonthName);
    
    return currentPhase || { month: currentMonthName, phase: 'Non-blooming', intensity: 0 };
}

function getPollinatorRiskLevel(plant) {
    if (!plant.phenology || !plant.phenology.pollinatorInteractions) return 'unknown';
    return plant.phenology.pollinatorInteractions.pollinatorDeficitRisk.level;
}

function getInvasiveSpeciesThreat(plant) {
    if (!plant.phenology || !plant.phenology.invasiveSpeciesAlert) return 'unknown';
    return plant.phenology.invasiveSpeciesAlert.threatLevel;
}

function calculateEconomicValue(plant) {
    if (!plant.phenology || !plant.phenology.agricultureEconomics) return 0;
    return plant.phenology.agricultureEconomics.floweringHarvestTiming.economicValue;
}

function isFloweringPeriod(plant, date = new Date()) {
    if (!plant.phenology) return false;
    
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    const flowering = plant.phenology.floweringPeriod;
    const startMonth = flowering.early.month;
    const endMonth = flowering.late.month;
    
    return month >= startMonth && month <= endMonth;
}

function getFloweringIntensity(plant, month) {
    if (!plant.phenology) return 0;
    
    const monthNames = {
        1: 'January', 2: 'February', 3: 'March', 4: 'April', 5: 'May', 6: 'June',
        7: 'July', 8: 'August', 9: 'September', 10: 'October', 11: 'November', 12: 'December'
    };
    
    const monthName = monthNames[month];
    const calendar = plant.phenology.seasonalCalendar;
    const monthData = calendar.find(c => c.month === monthName);
    
    return monthData ? monthData.intensity : 0;
}
    
