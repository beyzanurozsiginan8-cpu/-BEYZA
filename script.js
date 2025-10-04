// Global variables
let map;
let canvasRenderer = null; // Leaflet canvas renderer for performance
let pendingRegions = []; // Buffered regions to add in batches
let flushScheduled = false;
let plantMarkers = [];
let currentFilter = null; // No filter initially
let chatOpen = false;
let activeFilters = []; // Active filters
let currentTab = 'map'; // Active dashboard tab
let phenologyCharts = {}; // Chart.js instances
let gbifCache = null; // GBIF cache data { scientificName: [{lat,lng,city}, ...] }
// Beehive location variables
let hiveSelectionMode = false;
let hiveRadiusKm = 5; // Default 5km radius for foraging (bee flying distance)
// Multiple hives support
let hives = []; // Array of {id, name, location, marker, circle, data, beeCount}
let currentHiveId = null;
let nextHiveId = 1;
// Data loading state
let dataLoadingComplete = false;
let dataReadyNotificationShown = false;
// Visual and data limits settings
const MAX_POINTS_PER_SPECIES = 120; // Maximum points per species (higher density)
const MAX_TOTAL_POINTS = 2000; // Total point limit
const CSV_BATCH_PER_FILE = 50; // Records to add per file per round (smoother)
const REGION_RADIUS_KM = 12; // Region radius (km)
const MIN_TOTAL_POINTS = 1500; // Target total points on map
const GBIF_CACHE_STORAGE_KEY = 'gbif_cache_v1';

// Incrementally save new points to GBIF cache (no duplicates)
function upsertGbifCache(scientificName, newPoints) {
    if (!Array.isArray(newPoints) || newPoints.length === 0) return 0;
    if (!gbifCache || typeof gbifCache !== 'object') gbifCache = {};
    const existing = Array.isArray(gbifCache[scientificName]) ? gbifCache[scientificName] : [];
    const keyOf = (p) => `${Number(p.lat).toFixed(4)},${Number(p.lng).toFixed(4)}`;
    const seen = new Set(existing.map(keyOf));
    let added = 0;
    newPoints.forEach(p => {
        const key = keyOf(p);
        if (!seen.has(key)) {
            existing.push({ lat: p.lat, lng: p.lng, city: p.city });
            seen.add(key);
            added++;
        }
    });
    gbifCache[scientificName] = existing;
    try { localStorage.setItem(GBIF_CACHE_STORAGE_KEY, JSON.stringify(gbifCache)); } catch (_) {}
    return added;
}

// Functions to run when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Show initial loading popup
    showInitialLoadingPopup();
    
    initializeMap();
    setupEventListeners();
    
    // Hide empty chart containers initially
    hideEmptyChartContainers();

    // Select allergy filter by default
    document.getElementById('allergyFilter').checked = true;
    activeFilters.push('allergy');
    currentFilter = 'allergy';

    // Load from GBIF initially, until minimum 1000 points reached
    (async () => {
        try {
            const loader = document.getElementById('gbifLoader');
            if (loader) { loader.style.display = 'block'; loader.textContent = 'Loading GBIF data...'; }
            clearMapMarkers();
            // Plot existing coordinates (data.js)
            loadPlantData();
            await ensureMinimumWithGbif(MIN_TOTAL_POINTS);
        } catch (e) { console.error(e); }
        finally {
            const loader = document.getElementById('gbifLoader');
            if (loader) loader.style.display = 'none';
            initializePhenologyDashboard();
            markDataAsReady(); // Mark initial data as ready
        }
    })();
    
    // Show beehive popup after 45 seconds
    setTimeout(() => {
        showBeehivePopup();
    }, 45000); // 45 seconds
});

// Show initial loading popup at page start
function showInitialLoadingPopup() {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 45%;
        left: 48%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #2c3e50, #34495e);
        color: white;
        padding: 25px 35px;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        z-index: 2500;
        font-size: 1.2rem;
        font-weight: 600;
        text-align: center;
        max-width: 500px;
        animation: fadeInScale 0.8s ease;
        border: 3px solid rgba(255, 255, 255, 0.2);
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; gap: 15px; margin-bottom: 15px;">
            <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: #3498db;"></i>
            <span style="font-size: 1.4rem;">Loading Plant Data</span>
        </div>
        <div style="font-size: 1.1rem; opacity: 0.9; line-height: 1.5;">
            Please wait a few seconds for the data to load.
        </div>
        <div style="margin-top: 15px; font-size: 0.9rem; opacity: 0.7;">
            Gathering plant occurrence data from GBIF database...
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Add animation CSS if not exists
    if (!document.querySelector('#initialPopupStyle')) {
        const style = document.createElement('style');
        style.id = 'initialPopupStyle';
        style.textContent = `
            @keyframes fadeInScale {
                from {
                    transform: translate(-50%, -50%) scale(0.5);
                    opacity: 0;
                }
                to {
                    transform: translate(-50%, -50%) scale(1);
                    opacity: 1;
                }
            }
            @keyframes fadeOutScale {
                from {
                    transform: translate(-50%, -50%) scale(1);
                    opacity: 1;
                }
                to {
                    transform: translate(-50%, -50%) scale(0.8);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'fadeOutScale 0.5s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        }
    }, 5000);
}

// Show beehive functionality popup after 45 seconds
function showBeehivePopup() {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 45%;
        left: 48%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #3498db, #2980b9);
        color: white;
        padding: 25px 35px;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        z-index: 2000;
        font-size: 1.2rem;
        font-weight: 600;
        text-align: center;
        max-width: 600px;
        animation: fadeInScaleCenter 0.8s ease;
        border: 3px solid rgba(255, 255, 255, 0.2);
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; gap: 15px; margin-bottom: 10px;">
            <i class="fas fa-honey-pot" style="font-size: 1.8rem;"></i>
            <span style="font-size: 1.3rem;">Beehive System Ready!</span>
        </div>
        <div style="font-size: 1rem; opacity: 0.95; line-height: 1.4;">
            You can now start working on your hive!<br>
            <span style="color: #ffd700; font-weight: bold;">(Or you can wait a few minutes to reach all the data.)</span>
        </div>
        <div style="margin-top: 15px; font-size: 0.9rem; opacity: 0.8;">
            <i class="fas fa-map-marker-alt"></i> Click "Select Beehive Location" above the map
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Add animation CSS if not exists
    if (!document.querySelector('#beehivePopupStyle')) {
        const style = document.createElement('style');
        style.id = 'beehivePopupStyle';
        style.textContent = `
            @keyframes fadeInScaleCenter {
                from {
                    transform: translate(-50%, -50%) scale(0.5);
                    opacity: 0;
                }
                to {
                    transform: translate(-50%, -50%) scale(1);
                    opacity: 1;
                }
            }
            @keyframes fadeOutScaleCenter {
                from {
                    transform: translate(-50%, -50%) scale(1);
                    opacity: 1;
                }
                to {
                    transform: translate(-50%, -50%) scale(0.8);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Remove after 8 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'fadeOutScaleCenter 0.6s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 600);
        }
    }, 8000);
}

// Load GBIF data from cache or fetch and create cache after CSV completes
function parseCsvAndThenLoadGbif() {
    if (typeof Papa === 'undefined') {
        // GBIF disabled
        return;
    }
    Papa.parse('veri.csv', {
        download: true,
        header: true,
        complete: function(results) {
            try {
                const rows = (results.data || []).filter(r => r['Scientific Name']);
                let nextId = Math.max(...plantData.map(p => p.id)) + 1;
                rows.forEach(r => {
                    const sci = (r['Scientific Name'] || '').trim();
                    const common = (r['Common Name'] || sci).trim();
                    if (!sci) return;
                    if (!plantData.some(p => (p.scientificName || '').toLowerCase() === sci.toLowerCase())) {
                        plantData.push({
                            id: nextId++,
                            name: `${common} (${sci})`,
                            scientificName: sci,
                            coordinates: [],
                            characteristics: {
                                allergyRisk: 'Medium', allergyScore: 5,
                                honeyProduction: /Yes/i.test(r['Is it a Honey Source?'] || '') ? 'High' : 'Low',
                                honeyScore: /Yes/i.test(r['Is it a Honey Source?'] || '') ? 7 : 3,
                                climateSensitivity: 'Medium', climateScore: 5,
                                benefits: 'Medium', benefitsScore: 5,
                                threats: 'Medium', threatsScore: 5
                            },
                            description: (r['Benefits and Drawbacks'] || '').toString(),
                            phenology: buildPhenologyFromCsvSeasons(r),
                            details: { habitat: (r['Regions/Climate'] || '').toString(), allergyInfo: (r['Allergy Type'] || '').toString(), honeyInfo: (r['Impact on Honey Yield'] || '').toString(), climateImpact: (r['How is it affected by Climate change'] || '').toString(), benefits: [], threats: [] }
                        });
                    }
                });
            } catch (e) {
                console.error('CSV processing error:', e);
            }
            // GBIF disabled
        },
        error: function(err) {
            console.error('CSV could not be loaded:', err);
            // GBIF disabled
        }
    });
}

async function loadGbifCacheOrFetch() { /* DISABLED: API usage disabled */ }

function plotFromGbifCache() { /* DISABLED: API usage disabled */ }

// Initialize the map
function initializeMap() {
    // World center coordinates
    window.map = map = L.map('map').setView([20, 0], 2);

    // OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(map);
    // Use a shared canvas renderer for all circles
    try { canvasRenderer = L.canvas({ padding: 0.5 }); } catch (_) { canvasRenderer = null; }

    console.log('Map loaded successfully');

// Ensure map interactions are re-enabled after loading completes
map.on('load', function() {
    const overlay = document.getElementById('loadingOverlay');
    const mapContainer = document.getElementById('map');
    if (overlay && overlay.style.display !== 'none') {
        // Still waiting for min duration; additional security here
        // Definitely open after 6 seconds
        setTimeout(() => {
            overlay.style.display = 'none';
            if (mapContainer) mapContainer.style.pointerEvents = 'auto';
        }, 6000);
    }
});
}

function scheduleFlush() {
    if (flushScheduled) return;
    flushScheduled = true;
    (window.requestAnimationFrame || setTimeout)(flushPendingRegions, 80);
}

function flushPendingRegions() {
    if (!pendingRegions.length) { flushScheduled = false; return; }
    const group = L.layerGroup(pendingRegions);
    group.addTo(map);
    pendingRegions = [];
    flushScheduled = false;
}

// Set up event listeners
function setupEventListeners() {
    // Search button (may be removed)
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', searchPlant);
    }
    // Clear search button (may be removed)
    const clearSearchBtn = document.getElementById('clearSearchBtn');
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', function() {
            const input = document.getElementById('plantSearch');
            if (input) input.value = '';
            clearSearchHighlights();
            if (map && plantMarkers.length > 0) {
                const pts = plantMarkers.map(m => m.getLatLng());
                const bounds = L.latLngBounds(pts);
                map.fitBounds(bounds, { padding: [30, 30], maxZoom: 5 });
            }
        });
    }

    // Search with Enter key
    const plantSearchEl = document.getElementById('plantSearch');
    if (plantSearchEl) {
        plantSearchEl.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchPlant();
            }
        });
    }

    // AI Chat Enter key
    document.getElementById('chatInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendAIMessage();
        }
    });
    
    // Filter checkboxes
    document.getElementById('allergyFilter').addEventListener('change', function() {
        updateActiveFilters('allergy', this.checked);
    });

    document.getElementById('honeyFilter').addEventListener('change', function() {
        updateActiveFilters('honey', this.checked);
    });

    document.getElementById('climateFilter').addEventListener('change', function() {
        updateActiveFilters('climate', this.checked);
    });

    document.getElementById('benefitsFilter').addEventListener('change', function() {
        updateActiveFilters('benefits', this.checked);
    });

    document.getElementById('threatsFilter').addEventListener('change', function() {
        updateActiveFilters('threats', this.checked);
    });

    // Beehive location selection
    const selectHiveBtn = document.getElementById('selectHiveBtn');
    if (selectHiveBtn) {
        selectHiveBtn.addEventListener('click', toggleHiveSelection);
    }

    const clearHiveBtn = document.getElementById('clearHiveBtn');
    if (clearHiveBtn) {
        clearHiveBtn.addEventListener('click', clearHiveLocation);
    }

    // Hive name modal
    const confirmHiveBtn = document.getElementById('confirmHiveBtn');
    if (confirmHiveBtn) {
        confirmHiveBtn.addEventListener('click', confirmHivePlacement);
    }

    const cancelHiveNameBtn = document.getElementById('cancelHiveNameBtn');
    if (cancelHiveNameBtn) {
        cancelHiveNameBtn.addEventListener('click', cancelHiveNameInput);
    }

    // Hive name input - enter key
    const hiveNameInput = document.getElementById('hiveNameInput');
    if (hiveNameInput) {
        hiveNameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                confirmHivePlacement();
            }
        });
    }

    // Suggestion modal
    const moveToSuggestedBtn = document.getElementById('moveToSuggestedBtn');
    if (moveToSuggestedBtn) {
        moveToSuggestedBtn.addEventListener('click', moveToSuggestedLocation);
    }

    const cancelSuggestionBtn = document.getElementById('cancelSuggestionBtn');
    if (cancelSuggestionBtn) {
        cancelSuggestionBtn.addEventListener('click', cancelSuggestion);
    }

    const suggestionModal = document.getElementById('hiveSuggestionModal');
    if (suggestionModal) {
        suggestionModal.addEventListener('click', function(e) {
            if (e.target === this) {
                cancelSuggestion();
            }
        });
    }

    // Hive selector
    const hiveSelector = document.getElementById('hiveSelector');
    if (hiveSelector) {
        hiveSelector.addEventListener('change', onHiveSelect);
    }

    // Update bee count
    const updateBeeCountBtn = document.getElementById('updateBeeCountBtn');
    if (updateBeeCountBtn) {
        updateBeeCountBtn.addEventListener('click', updateBeeCount);
    }

    // Modal closing
    document.querySelector('.close').addEventListener('click', closeModal);
    document.getElementById('plantModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
    // Export GBIF data
    const exportBtn = document.getElementById('exportGbifBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async function() {
            if (!gbifCache || Object.keys(gbifCache).length === 0) {
                // No cache: generate and download when complete
                await generateAndDownloadGbifCache();
            } else {
                // Cache exists: download directly
                triggerCacheDownload();
            }
        });
    }
    // Import GBIF cache
    const importInput = document.getElementById('importGbifInput');
    if (importInput) {
        importInput.addEventListener('change', function(ev) {
            const file = ev.target.files && ev.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const json = JSON.parse(e.target.result);
                    if (json && typeof json === 'object') {
                        gbifCache = json;
                        plotFromGbifCache();
                    } else {
                        alert('Invalid JSON format');
                    }
                } catch (err) {
                    alert('JSON parse error: ' + err.message);
                }
            };
            reader.readAsText(file);
            ev.target.value = '';
        });
    }

    // Load Data button
    const loadBtn = document.getElementById('loadDataBtn');
    if (loadBtn) {
        loadBtn.addEventListener('click', async function() {
            const btn = this;
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            try {
                await loadOccurrencesFromCsvFolder();
                // Refresh map and metrics after loading
                clearMapMarkers();
                loadPlantData();
            } catch (e) {
                console.error(e);
                alert('Data could not be loaded');
            } finally {
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-database"></i> Load Data';
            }
        });
    }

    // Load CSV from file without server
    const csvInput = document.getElementById('csvFileInput');
    if (csvInput) {
        csvInput.addEventListener('change', async function(ev) {
            const files = Array.from(ev.target.files || []).filter(f => /\.csv$/i.test(f.name));
            if (files.length === 0) { ev.target.value = ''; return; }
            const btn = document.getElementById('loadDataBtn');
            if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...'; }
            try {
                await loadOccurrencesFromLocalFiles(files);
                clearMapMarkers();
                loadPlantData();
            } catch (e) {
                console.error(e);
                alert('Data could not be loaded from file');
            } finally {
                if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-database"></i> Load Data'; }
                ev.target.value = '';
            }
        });
    }

    // Load CSV via Drag & Drop
    const dropZone = document.getElementById('csvDropZone');
    if (dropZone) {
        ['dragenter','dragover'].forEach(evt => dropZone.addEventListener(evt, function(e){ e.preventDefault(); e.stopPropagation(); dropZone.style.borderColor = '#ffd700'; }));
        ;['dragleave','drop'].forEach(evt => dropZone.addEventListener(evt, function(e){ e.preventDefault(); e.stopPropagation(); dropZone.style.borderColor = '#666'; }));
        dropZone.addEventListener('drop', async function(e) {
            const dt = e.dataTransfer;
            const fileList = dt && dt.files ? Array.from(dt.files) : [];
            const files = fileList.filter(f => /\.csv$/i.test(f.name));
            if (files.length === 0) return;
            const btn = document.getElementById('loadDataBtn');
            if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...'; }
            try {
                await loadOccurrencesFromLocalFiles(files);
                clearMapMarkers();
                loadPlantData();
            } catch (err) {
                console.error(err);
                alert('Data could not be loaded from file');
            } finally {
                if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-database"></i> Load Data'; }
            }
        });
    }
}

// Load plant data
function loadPlantData() {
    clearMapMarkers();

    // Use allergy filter by default if no filter selected
    if (activeFilters.length === 0) {
        currentFilter = 'allergy';
        console.log('Default filter: allergy');
    }

    plantData.forEach(plant => {
        plant.coordinates.forEach(coord => {
            const region = createPlantRegion(plant, coord);
            plantMarkers.push(region);
        });
    });

    console.log(`${plantMarkers.length} plant markers added`);
    
    // Update species dropdowns whenever data changes
    updateSpeciesDropdowns();
}

// Create plant region (region instead of point)
function createPlantRegion(plant, coord) {
    const color = getPlantColor(plant, currentFilter || activeFilters[0]);

    // Region radius (in km)
    const radius = REGION_RADIUS_KM; // from configuration

    const region = L.circle([coord.lat, coord.lng], {
        radius: radius * 1000, // in meters
        fillColor: color,
        color: '#fff',
        weight: 2,
        opacity: 0.8,
        fillOpacity: 0.3,
        className: 'plant-region',
        renderer: canvasRenderer || undefined
    });

    // Popup content
    const popupContent = `
        <div style="text-align: center; min-width: 200px;">
            <h3 style="color: #ffffff; margin-bottom: 10px;">${plant.name}</h3>
            <p style="margin-bottom: 8px; color: #ffffff;"><strong>Scientific Name:</strong> ${plant.scientificName}</p>
            <p style="margin-bottom: 8px; color: #ffffff;"><strong>Location:</strong> ${coord.city}</p>
            <div style="margin: 10px 0;">
                <span style="background: #e8f4fd; color: #000000; padding: 4px 8px; border-radius: 4px; margin-right: 5px; font-size: 0.9em;">
                    Allergy: ${plant.characteristics.allergyRisk}
                </span>
                <span style="background: #e8f5e8; color: #000000; padding: 4px 8px; border-radius: 4px; margin-right: 5px; font-size: 0.9em;">
                    Honey: ${plant.characteristics.honeyProduction}
                </span>
                <span style="background: #fff3cd; color: #000000; padding: 4px 8px; border-radius: 4px; font-size: 0.9em;">
                    Climate: ${plant.characteristics.climateSensitivity}
                </span>
            </div>
            <button onclick="showPlantDetails(${plant.id})"
                    style="background: #666; color: white; border: 1px solid #888; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-top: 10px; transition: all 0.3s ease;">
                View Details
            </button>
        </div>
    `;

    region.bindPopup(popupContent);

    // Click event
    region.on('click', function() {
        showPlantDetails(plant.id);
    });

    region.addTo(map);
    // Attach plant ID for color updates
    region.plantId = plant.id;
    return region;
}

// Buffered region creator: does NOT add to map immediately
function createPlantRegionBuffered(plant, coord) {
    const color = getPlantColor(plant, currentFilter || activeFilters[0]);
    const radius = REGION_RADIUS_KM;
    const region = L.circle([coord.lat, coord.lng], {
        radius: radius * 1000,
        fillColor: color,
        color: '#fff',
        weight: 2,
        opacity: 0.8,
        fillOpacity: 0.3,
        className: 'plant-region',
        renderer: canvasRenderer || undefined
    });
    // Don't create popup during loading; create and bind on click
    region.on('click', function() {
        const popupContent = `
            <div style="text-align: center; min-width: 200px;">
                <h3 style=\"color: #ffffff; margin-bottom: 10px;\">${plant.name}</h3>
                <p style=\"margin-bottom: 8px; color: #ffffff;\"><strong>Scientific Name:</strong> ${plant.scientificName}</p>
                <p style=\"margin-bottom: 8px; color: #ffffff;\"><strong>Location:</strong> ${coord.city}</p>
                <div style=\"margin: 10px 0;\">
                    <span style=\"background: #e8f4fd; color: #000000; padding: 4px 8px; border-radius: 4px; margin-right: 5px; font-size: 0.9em;\">Allergy: ${plant.characteristics.allergyRisk}</span>
                    <span style=\"background: #e8f5e8; color: #000000; padding: 4px 8px; border-radius: 4px; margin-right: 5px; font-size: 0.9em;\">Honey: ${plant.characteristics.honeyProduction}</span>
                    <span style=\"background: #fff3cd; color: #000000; padding: 4px 8px; border-radius: 4px; font-size: 0.9em;\">Climate: ${plant.characteristics.climateSensitivity}</span>
                </div>
                <button onclick=\"showPlantDetails(${plant.id})\" style=\"background: #666; color: white; border: 1px solid #888; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-top: 10px; transition: all 0.3s ease;\">View Details</button>
            </div>`;
        if (!region.getPopup()) region.bindPopup(popupContent).openPopup();
    });
    region.plantId = plant.id;
    pendingRegions.push(region);
    scheduleFlush();
    return region;
}

// Search for plants
function searchPlant() {
    const searchTerm = document.getElementById('plantSearch').value.toLowerCase().trim();

    if (!searchTerm) {
        // If empty, clear highlights and return to general view
        clearSearchHighlights();
        return;
    }

    // Filter search results
    const results = plantData.filter(plant =>
        plant.name.toLowerCase().includes(searchTerm) ||
        plant.scientificName.toLowerCase().includes(searchTerm)
    );

    if (results.length === 0) {
        alert('The plant species you are looking for could not be found.');
        return;
    }

    // Highlight on map and ease view
    highlightSearchResults(results);
}

// Show search results
function showSearchResults(results) {
    // Old behavior (full redraw) not used; highlightSearchResults active
    highlightSearchResults(results);
}

// Clear search highlights
function clearSearchHighlights() {
    if (!map) return;
    plantMarkers.forEach(marker => {
        const plant = plantData.find(p => p.id === marker.plantId);
        if (plant) {
            const baseColor = getPlantColor(plant, currentFilter || activeFilters[0] || 'allergy');
            marker.setStyle({
                fillColor: baseColor,
                color: '#fff',
                weight: 2,
                fillOpacity: 0.3,
                opacity: 0.8
            });
        }
    });
}

// Highlight results on map and focus view
function highlightSearchResults(results) {
    const resultIds = new Set(results.map(r => r.id));
    const boundsPoints = [];

    plantMarkers.forEach(marker => {
        const plant = plantData.find(p => p.id === marker.plantId);
        if (!plant) return;
        if (resultIds.has(plant.id)) {
            marker.setStyle({
                color: '#ffd700',
                weight: 3,
                fillOpacity: 0.6
            });
            const ll = marker.getLatLng();
            boundsPoints.push([ll.lat, ll.lng]);
            if (marker.bringToFront) marker.bringToFront();
        } else {
            const baseColor = getPlantColor(plant, currentFilter || activeFilters[0] || 'allergy');
            marker.setStyle({
                color: '#666',
                fillColor: baseColor,
                weight: 1,
                fillOpacity: 0.1
            });
        }
    });

    if (boundsPoints.length > 0) {
        const bounds = L.latLngBounds(boundsPoints);
        map.fitBounds(bounds, { padding: [30, 30], maxZoom: 10 });
    }
}

// Aktif filtreleri güncelle
function updateActiveFilters(filterType, isChecked) {
    // Tek seçimli filtre davranışı
    const checkboxes = {
        allergy: document.getElementById('allergyFilter'),
        honey: document.getElementById('honeyFilter'),
        climate: document.getElementById('climateFilter'),
        benefits: document.getElementById('benefitsFilter'),
        threats: document.getElementById('threatsFilter')
    };

    if (isChecked) {
        // Seçilen filtreyi aktif bırak, diğerlerinin seçimini kaldır
        Object.keys(checkboxes).forEach(key => {
            checkboxes[key].checked = (key === filterType);
        });
        activeFilters = [filterType];
        currentFilter = filterType;
    } else {
        // Her zaman en az bir filtre açık kalsın: kapatılmak istenirse tekrar aç
        checkboxes[filterType].checked = true;
        activeFilters = [filterType];
        currentFilter = filterType;
    }

    // Var olan işaretçilerin renklerini güncelle (silmeden)
    plantMarkers.forEach(marker => {
        const plant = plantData.find(p => p.id === marker.plantId);
        if (plant) {
            const newColor = getPlantColor(plant, currentFilter);
            marker.setStyle({ fillColor: newColor });
        }
    });
    updateLegend(currentFilter);
}

// CSV'yi okuyup türleri plantData'ya ekle ve GBIF lokasyonlarını çiz
function parseCsvAndFetchGbif() {
    if (typeof Papa === 'undefined') return;
    Papa.parse('veri.csv', {
        download: true,
        header: true,
        complete: function(results) {
            try {
                const rows = (results.data || []).filter(r => r['Scientific Name']);
                let nextId = Math.max(...plantData.map(p => p.id)) + 1;
                rows.forEach(r => {
                    const sci = (r['Scientific Name'] || '').trim();
                    const common = (r['Common Name'] || sci).trim();
                    if (!sci) return;
                    if (!plantData.some(p => (p.scientificName || '').toLowerCase() === sci.toLowerCase())) {
                        plantData.push({
                            id: nextId++,
                            name: `${common} (${sci})`,
                            scientificName: sci,
                            coordinates: [],
                            characteristics: {
                                allergyRisk: 'Medium', allergyScore: 5,
                                honeyProduction: /Yes/i.test(r['Is it a Honey Source?'] || '') ? 'High' : 'Low',
                                honeyScore: /Yes/i.test(r['Is it a Honey Source?'] || '') ? 7 : 3,
                                climateSensitivity: 'Medium', climateScore: 5,
                                benefits: 'Medium', benefitsScore: 5,
                                threats: 'Medium', threatsScore: 5
                            },
                            description: (r['Benefits and Drawbacks'] || '').toString(),
                            phenology: buildPhenologyFromCsvSeasons(r),
                            details: { habitat: (r['Regions/Climate'] || '').toString(), allergyInfo: (r['Allergy Type'] || '').toString(), honeyInfo: (r['Impact on Honey Yield'] || '').toString(), climateImpact: (r['How is it affected by Climate change'] || '').toString(), benefits: [], threats: [] }
                        });
                    }
                });
            } catch (e) {
                console.error('CSV işleme hatası:', e);
            }
            // GBIF lokasyonlarını (tüm türler, arıcılık öncelikli) çiz
            updateMapWithGbifAll();
        },
        error: function(err) {
            console.error('CSV yüklenemedi:', err);
            updateMapWithGbifAll();
        }
    });
}

// CSV Spring/Summer/Autumn/Winter alanlarını fenoloji takvimine dönüştür
function buildPhenologyFromCsvSeasons(row) {
    const seasonToMonths = {
        Spring: ['Mart', 'Nisan', 'Mayıs'],
        Summer: ['Haziran', 'Temmuz', 'Ağustos'],
        Autumn: ['Eylül', 'Ekim', 'Kasım'],
        Winter: ['Aralık', 'Ocak', 'Şubat']
    };
    const calendar = [];
    Object.keys(seasonToMonths).forEach(season => {
        const value = (row[season] || '').toString();
        if (!value) return;
        const intensity = value.includes('🟥') ? 90 : value.includes('🟧') ? 60 : value.includes('🟩') ? 30 : 0;
        seasonToMonths[season].forEach(month => {
            if (intensity > 0) {
                calendar.push({ month, phase: season + ' Bloom', intensity });
            }
        });
    });
    if (calendar.length === 0) return undefined;
    return {
        seasonalCalendar: calendar,
        floweringPeriod: {
            early: { month: 3, day: 1 },
            peak: { month: 6, day: 15 },
            late: { month: 9, day: 30 }
        }
    };
}

// GBIF API'den konumları çek ve çizecek yardımcılar
async function fetchWithRetry(url, tries = 3, delayMs = 600) {
    for (let attempt = 1; attempt <= tries; attempt++) {
        try {
            const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return await res.json();
        } catch (e) {
            if (attempt === tries) throw e;
            await new Promise(r => setTimeout(r, delayMs * attempt));
        }
    }
}

async function fetchGbifOccurrences(scientificName, maxRecords = 1500) {
    // European countries - important countries first, then less known countries
    const europeanCountries = [
        'TR', 'IT', 'FR', 'ES', 'GR', // Main Mediterranean countries
        'AL', 'ME', 'HR', 'BG', 'RO', // Balkan countries
        'HU', 'PL', 'CZ', 'SK',       // Central Europe
        'AT', 'DE', 'CH', 'SI'        // Central/Southern Europe
    ];
    
    let allResults = [];
    const resultsPerCountry = Math.ceil(maxRecords / europeanCountries.length);
    
    // Query each country separately - for balanced distribution
    for (const country of europeanCountries) {
        if (allResults.length >= maxRecords) break;
        
        const pageSize = Math.min(300, resultsPerCountry); // Increased from 200 to 300
        let offset = 0;
        let countryResults = [];
        
        // Get limited number of records for each country
        while (countryResults.length < resultsPerCountry && allResults.length < maxRecords) {
            const url = `https://api.gbif.org/v1/occurrence/search?scientificName=${encodeURIComponent(scientificName)}&hasCoordinate=true&country=${country}&limit=${pageSize}&offset=${offset}`;
            let data;
            try { 
                console.log(`GBIF query: ${country} - ${scientificName} (${offset}-${offset + pageSize})`);
                data = await fetchWithRetry(url, 3, 500); 
                
                if (data.results && data.results.length > 0) {
                    console.log(`Found: ${data.results.length} records (${country})`);
                }
            } catch (e) { 
                console.warn(`GBIF query error (${country}):`, e.message);
                // Wait longer if there's a rate limit error
                if (e.message.includes('429')) {
                    console.log(`Waiting 2 seconds for ${country} due to rate limit...`);
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
                break; 
            }
            
            const results = (data.results || []).filter(r => 
                typeof r.decimalLatitude === 'number' && 
                typeof r.decimalLongitude === 'number' &&
                r.decimalLatitude >= 35 && r.decimalLatitude <= 72 &&
                r.decimalLongitude >= -25 && r.decimalLongitude <= 45
            );
            
            countryResults = countryResults.concat(results);
            
            if (!data.endOfRecords && results.length > 0) {
                offset += pageSize;
            } else {
                break;
            }
        }
        
        // Add country results to main list
        const countrySlice = countryResults.slice(0, resultsPerCountry);
        allResults = allResults.concat(countrySlice);
        console.log(`Total ${allResults.length} records collected (${country}: ${countrySlice.length} records)`);
        
        // Add small delay - out of respect for API
        await new Promise(resolve => setTimeout(resolve, 500)); // Increased from 300ms to 500ms
    }
    
    // Shuffle results and limit
    const shuffled = allResults.sort(() => Math.random() - 0.5);
    console.log(`Final result: ${shuffled.slice(0, maxRecords).length} records`);
    return shuffled.slice(0, maxRecords).map(r => ({ 
        lat: r.decimalLatitude, 
        lng: r.decimalLongitude, 
        city: r.locality || r.country || r.stateProvince || scientificName 
    }));
}

function sampleArray(arr, maxCount) {
    if (arr.length <= maxCount) return arr;
    const sampled = [];
    const step = Math.max(1, Math.floor(arr.length / maxCount));
    for (let i = 0; i < arr.length && sampled.length < maxCount; i += step) {
        sampled.push(arr[i]);
    }
    return sampled;
}

async function plotGbifOccurrencesForPlant(plant) {
    try {
        // Daha fazla veri çekmek için limit'i artırıyoruz
        const coords = await fetchGbifOccurrences(plant.scientificName, 2000);
        const points = (coords && coords.length > 0) ? sampleArray(coords, MAX_POINTS_PER_SPECIES) : [];
        points.forEach(coord => {
            const region = createPlantRegionBuffered(plant, coord);
            plantMarkers.push(region);
        });
        scheduleFlush();
        return points.length;
    } catch (e) {
        console.warn(`${plant.scientificName} için veri yükleme hatası:`, e);
        return 0;
    }
}

async function updateMapWithGbif() {
    const species = plantData.filter(p => !!p.scientificName);
    const batchSize = 2;
    for (let i = 0; i < species.length; i += batchSize) {
        const batch = species.slice(i, i + batchSize);
        await Promise.all(batch.map(p => plotGbifOccurrencesForPlant(p)));
    }
}

// Tüm türler için (arıcılık öncelikli) GBIF lokasyonlarını çek ve ekle
async function updateMapWithGbifAll() { await updateMapWithGbif(); }
// GBIF'ten yükleyip aynı zamanda önbellek nesnesi oluştur
async function updateMapWithGbifAllWithCache() { await updateMapWithGbif(); }

// Cache'te olmayan türleri arka planda doldur ve mape ekle
async function fillMissingFromGbifCache() { /* Cache kullanılmıyor */ }

function triggerCacheDownload() {
    try {
        if (!gbifCache) return;
        const blob = new Blob([JSON.stringify(gbifCache, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'gbif_cache.json';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            URL.revokeObjectURL(url);
            a.remove();
        }, 0);
    } catch (e) {
        console.error('Cache indirilemedi:', e);
    }
}

// GBIF cache'i oluştur ve tamamlanınca indir
async function generateAndDownloadGbifCache() {
    try {
        await updateMapWithGbifAllWithCache();
    } catch (e) {
        console.error('GBIF cache oluşturma hatası:', e);
    }
    // Mevcut gbifCache'i indir
    triggerCacheDownload();
}


// Bilimsel ada göre deterministik pseudo koordinat üret
function pseudoCoordFromName(name) {
    const h = simpleHash(name || 'plant');
    const lat = ((h % 121) - 60);
    const lng = (((Math.floor(h / 121)) % 341) - 170);
    return { lat, lng, city: name };
}

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

// iNaturalist API: gözlem konumlarını çek
async function fetchInatOccurrences(scientificName, maxRecords = 200) { return []; }

async function plotInatOccurrencesForPlant(plant, maxPoints = 30) { return 0; }

async function augmentWithINat(species, needed) { return 0; }

function ensureMinimumPointsWithPseudo(species, needed) {
    if (!Array.isArray(species) || needed <= 0) return;
    let added = 0;
    for (let i = 0; i < species.length && added < needed; i++) {
        const p = species[i];
        // Her tür için birkaç pseudo nokta üret
        const toAdd = Math.min(5, needed - added);
        for (let k = 0; k < toAdd; k++) {
            const jitter = k * 0.2;
            const base = pseudoCoordFromName(p.scientificName + '-' + k);
            const coord = { lat: base.lat + jitter, lng: base.lng + jitter, city: p.scientificName };
            const region = createPlantRegion(p, coord);
            plantMarkers.push(region);
            added++;
            if (added >= needed) break;
        }
    }
}

// Locations klasöründen CSV'leri topla ve plantData'ya koordinatları işle (ilerlemeli, round-robin)
const CSV_FILES = [
    'locations/0041196-250920141307145.csv',
    'locations/0041201-250920141307145.csv',
    'locations/0041225-250920141307145.csv',
    'locations/0041253-250920141307145.csv'
];

async function loadOccurrencesFromCsvFolder() {
    if (typeof Papa === 'undefined') return;

    // UI: progress bar oluştur (yoksa)
    const loader = document.getElementById('gbifLoader');
    if (loader) {
        loader.style.display = 'block';
        if (!loader._progressInit) {
            const bar = document.createElement('div');
            bar.className = 'progress';
            const fill = document.createElement('div');
            fill.className = 'progress-bar';
            fill.id = 'csvProgressBarFill';
            bar.appendChild(fill);
            const txt = document.createElement('div');
            txt.className = 'progress-detail';
            txt.id = 'csvProgressDetail';
            loader.innerHTML = '';
            const title = document.createElement('div');
            title.className = 'loading-text';
            title.textContent = 'CSV verileri yükleniyor...';
            loader.appendChild(title);
            loader.appendChild(bar);
            loader.appendChild(txt);
            loader._progressInit = true;
        }
    }

    const progressFill = document.getElementById('csvProgressBarFill');
    const progressDetail = document.getElementById('csvProgressDetail');

    // Tür başına duplicate filtre için anahtar seti
    const speciesKeyToSeen = new Map(); // sci -> Set("lat,lng")

    // Toplam limit takibi
    let totalPointsAdded = 0;

    // Tür kaydı veya oluşturma yardımcıları
    function ensurePlant(sci) {
        let plant = plantData.find(p => (p.scientificName || '').toLowerCase() === sci.toLowerCase());
        if (!plant) {
            const created = ensureDefaultsForSci(sci);
            plantData.push(created);
            plant = created;
        }
        if (!speciesKeyToSeen.has(sci)) speciesKeyToSeen.set(sci, new Set());
        return plant;
    }

    function ensureDefaultsForSci(sci) {
        return {
            id: Math.max(0, ...plantData.map(p => p.id)) + 1,
            name: `${sci} (${sci})`,
            scientificName: sci,
            coordinates: [],
            characteristics: {
                allergyRisk: 'Medium', allergyScore: 5,
                honeyProduction: 'Medium', honeyScore: 5,
                climateSensitivity: 'Medium', climateScore: 5,
                benefits: 'Medium', benefitsScore: 5,
                threats: 'Medium', threatsScore: 5
            },
            description: `Description automatically generated for ${sci} species.`,
            phenology: {
                seasonalCalendar: [
                    { month: 'April', phase: 'Early Blooming', intensity: 40 },
                    { month: 'May', phase: 'Bloom', intensity: 70 },
                    { month: 'June', phase: 'Peak Blooming', intensity: 100 }
                ],
                floweringPeriod: { early: { month: 4, day: 1 }, peak: { month: 6, day: 15 }, late: { month: 9, day: 1 } },
                agricultureEconomics: {
                    floweringHarvestTiming: { optimalHarvest: 'End of June', yieldPrediction: 'Medium', economicValue: 125 },
                    diseaseRisks: { postFloweringRisks: ['Fungal diseases'], riskLevel: 'moderate', preventionMethods: [] }
                },
                pollinatorInteractions: {
                    primaryPollinators: ['bees'],
                    pollinatorSynchronization: { bees: { syncRate: 70, peakActivity: 'June' }, butterflies: { syncRate: 50, peakActivity: 'July' }, birds: { syncRate: 20, peakActivity: 'May' } },
                    pollinatorDeficitRisk: { level: 'moderate', factors: ['Habitat fragmentation'], riskScore: 5 }
                },
                invasiveSpeciesAlert: { threatLevel: 'low', competitorSpecies: [], nativeEcosystemImpact: 'Minimal' },
                conservation: { endemicStatus: false, conservationPriority: 'Low', criticalHabitats: [], tourismValue: { peakTourismPeriod: 'Summer', visitorImpact: 'Neutral', ecoTourismPotential: 'Medium' } }
            },
            details: {
                habitat: 'No data - automatically filled.',
                allergyInfo: 'No data - automatically filled.',
                honeyInfo: 'No data - automatically filled.',
                climateImpact: 'No data - automatically filled.',
                benefits: [],
                threats: []
            }
        };
    }

    let lastUiUpdate = 0;
    function tryAddPointFromRow(row) {
        if (totalPointsAdded >= MAX_TOTAL_POINTS) return false;
        const r = row || {};
        const sci = (r.species || r.scientificName || r['Scientific Name'] || r['species'] || '').toString().trim();
        const lat = Number(r.decimalLatitude ?? r.latitude ?? r.lat ?? r.decimallatitude);
        const lng = Number(r.decimalLongitude ?? r.longitude ?? r.lng ?? r.decimallongitude);
        if (!sci || !isFinite(lat) || !isFinite(lng)) return false;
        const plant = ensurePlant(sci);
        // Tür başına limit
        if (plant.coordinates.length >= MAX_POINTS_PER_SPECIES) return false;
        const keySet = speciesKeyToSeen.get(sci);
        const key = `${lat.toFixed(4)},${lng.toFixed(4)}`;
        if (keySet.has(key)) return false;

        const city = (r.city || r.locality || r.country || r.stateProvince || sci).toString();
        plant.coordinates.push({ lat, lng, city });
        keySet.add(key);
        totalPointsAdded++;

        // Anında haritaya ekle
        const region = createPlantRegionBuffered(plant, { lat, lng, city });
        plantMarkers.push(region);

        // Progress UI
        const now = Date.now();
        if (now - lastUiUpdate > 300) {
            if (progressFill) progressFill.style.width = `${Math.min(100, Math.round((totalPointsAdded / MAX_TOTAL_POINTS) * 100))}%`;
            if (progressDetail) progressDetail.textContent = `${totalPointsAdded}/${MAX_TOTAL_POINTS} nokta yüklendi`;
            lastUiUpdate = now;
        }

        return true;
    }

    // Round-robin için parser kuyrukları
    const fileStates = CSV_FILES.map(file => ({ file, addedInCurrentBatch: 0, done: false, parser: null }));
    let activeState = null; // Tek seferde sadece bir parser aktif
    const readyQueue = []; // pause edilmiş parser'lar

    function makeStepHandler(state) {
        return function stepFn(results, parser) {
            state.parser = parser;
            // Sadece aktif state işlesin; diğerleri sıraya girip beklesin
            if (activeState && activeState !== state) {
                if (!state.done) {
                    readyQueue.push(state);
                    parser.pause();
                }
                return;
            }
            if (!activeState) activeState = state;
            if (results && results.data) {
                if (tryAddPointFromRow(results.data)) {
                    state.addedInCurrentBatch++;
                }
            }
            if (totalPointsAdded >= MAX_TOTAL_POINTS) {
                parser.abort();
                state.done = true;
                return;
            }
            if (state.addedInCurrentBatch >= CSV_BATCH_PER_FILE) {
                state.addedInCurrentBatch = 0;
                // Bu dosya sıradaki tura kadar beklesin
                readyQueue.push(state);
                parser.pause();
                activeState = null;
            }
        };
    }

    function makeCompleteHandler(state) {
        return function() {
            state.done = true;
        };
    }

    // Tüm dosyalar için stream parse'i başlat
    fileStates.forEach((state, idx) => {
        Papa.parse(state.file, {
            download: true,
            header: true,
            dynamicTyping: true,
            worker: false,
            step: makeStepHandler(state),
            complete: makeCompleteHandler(state),
            error: function() { state.done = true; }
        });
    });

    // Round-robin scheduler: sırayla parser.resume() yap
    await new Promise(resolve => {
        const pump = () => {
            if (totalPointsAdded >= MAX_TOTAL_POINTS || fileStates.every(s => s.done)) {
                if (loader) setTimeout(() => loader.style.display = 'none', 500);
                flushPendingRegions();
                updateSpeciesDropdowns(); // Update dropdowns after data loaded
                markDataAsReady(); // Mark data as ready
                resolve();
                return;
            }
            const next = readyQueue.shift() || fileStates.find(s => !s.done && s.parser);
            if (next && next.parser) {
                next.parser.resume();
                activeState = next;
            }
            const schedule = window.requestIdleCallback || window.requestAnimationFrame || setTimeout;
            schedule(pump, 100);
        };
        pump();
    });
}

// GBIF üzerinden minimum toplam nokta sayısına ulaşmayı garanti et
async function ensureMinimumWithGbif(minTotal) {
    const species = plantData.filter(p => !!p.scientificName);
    let total = plantMarkers.length;
    const loader = document.getElementById('gbifLoader');
    const batchSize = 1; // Batch size'ı 2'den 1'e düşürüldü
    
    console.log(`GBIF ile minimum ${minTotal} noktaya ulaşılmaya çalışılıyor. Başlangıç: ${total} nokta`);
    
    for (let i = 0; i < species.length && total < minTotal; i++) {
        const plant = species[i];
        console.log(`Tür işleniyor: ${plant.scientificName}`);
        
        if (loader) loader.textContent = `GBIF verileri yükleniyor... (${Math.min(total, minTotal)}/${minTotal}) - ${plant.name}`;
        
        const added = await plotGbifOccurrencesForPlant(plant);
        total += added;
        console.log(`Eklenen nokta: ${added}, Toplam: ${total}`);
        
        // Her bitki arası 1 saniye bekliyoruz
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log(`Yükleme tamamlandı. Toplam: ${total} nokta`);
    if (loader) loader.textContent = `Yükleme tamamlandı (${Math.min(total, minTotal)})`;
    
    // Update species dropdowns after loading data
    updateSpeciesDropdowns();
    
    // Mark data as loaded and show notification
    markDataAsReady();
}

// Local FileReader ile CSV yükleme (sunucu gerektirmez)
async function loadOccurrencesFromLocalFiles(files) {
    if (typeof Papa === 'undefined') return;
    const loader = document.getElementById('gbifLoader');
    if (loader) {
        loader.style.display = 'block';
        if (!loader._progressInit) {
            const bar = document.createElement('div');
            bar.className = 'progress';
            const fill = document.createElement('div');
            fill.className = 'progress-bar';
            fill.id = 'csvProgressBarFill';
            bar.appendChild(fill);
            const txt = document.createElement('div');
            txt.className = 'progress-detail';
            txt.id = 'csvProgressDetail';
            loader.innerHTML = '';
            const title = document.createElement('div');
            title.className = 'loading-text';
            title.textContent = 'CSV verileri yükleniyor...';
            loader.appendChild(title);
            loader.appendChild(bar);
            loader.appendChild(txt);
            loader._progressInit = true;
        }
    }
    const progressFill = document.getElementById('csvProgressBarFill');
    const progressDetail = document.getElementById('csvProgressDetail');

    let totalPointsAdded = 0;
    const speciesKeyToSeen = new Map();
    let lastUi = 0;

    function ensurePlant(sci) {
        let plant = plantData.find(p => (p.scientificName || '').toLowerCase() === sci.toLowerCase());
        if (!plant) {
            const created = ensureDefaultsForSci(sci);
            plantData.push(created);
            plant = created;
        }
        if (!speciesKeyToSeen.has(sci)) speciesKeyToSeen.set(sci, new Set());
        return plant;
    }
    function ensureDefaultsForSci(sci) {
        return {
            id: Math.max(0, ...plantData.map(p => p.id)) + 1,
            name: `${sci} (${sci})`,
            scientificName: sci,
            coordinates: [],
            characteristics: { allergyRisk: 'Medium', allergyScore: 5, honeyProduction: 'Medium', honeyScore: 5, climateSensitivity: 'Medium', climateScore: 5, benefits: 'Medium', benefitsScore: 5, threats: 'Medium', threatsScore: 5 },
            description: `Description automatically generated for ${sci} species.`,
            phenology: { seasonalCalendar: [ { month: 'April', phase: 'Early Blooming', intensity: 40 }, { month: 'May', phase: 'Bloom', intensity: 70 }, { month: 'June', phase: 'Peak Blooming', intensity: 100 } ], floweringPeriod: { early: { month: 4, day: 1 }, peak: { month: 6, day: 15 }, late: { month: 9, day: 1 } }, agricultureEconomics: { floweringHarvestTiming: { optimalHarvest: 'End of June', yieldPrediction: 'Medium', economicValue: 125 }, diseaseRisks: { postFloweringRisks: ['Fungal diseases'], riskLevel: 'moderate', preventionMethods: [] } }, pollinatorInteractions: { primaryPollinators: ['bees'], pollinatorSynchronization: { bees: { syncRate: 70, peakActivity: 'June' }, butterflies: { syncRate: 50, peakActivity: 'July' }, birds: { syncRate: 20, peakActivity: 'May' } }, pollinatorDeficitRisk: { level: 'moderate', factors: ['Habitat fragmentation'], riskScore: 5 } }, invasiveSpeciesAlert: { threatLevel: 'low', competitorSpecies: [], nativeEcosystemImpact: 'Minimal' }, conservation: { endemicStatus: false, conservationPriority: 'Low', criticalHabitats: [], tourismValue: { peakTourismPeriod: 'Summer', visitorImpact: 'Neutral', ecoTourismPotential: 'Medium' } } },
            details: { habitat: 'No data - automatically filled.', allergyInfo: 'No data - automatically filled.', honeyInfo: 'No data - automatically filled.', climateImpact: 'No data - automatically filled.', benefits: [], threats: [] }
        };
    }
    function tryAdd(row) {
        if (totalPointsAdded >= MAX_TOTAL_POINTS) return false;
        const r = row || {};
        const sci = (r.species || r.scientificName || r['Scientific Name'] || r['species'] || '').toString().trim();
        const lat = Number(r.decimalLatitude ?? r.latitude ?? r.lat ?? r.decimallatitude);
        const lng = Number(r.decimalLongitude ?? r.longitude ?? r.lng ?? r.decimallongitude);
        if (!sci || !isFinite(lat) || !isFinite(lng)) return false;
        const plant = ensurePlant(sci);
        if (plant.coordinates.length >= MAX_POINTS_PER_SPECIES) return false;
        const keySet = speciesKeyToSeen.get(sci);
        const key = `${lat.toFixed(4)},${lng.toFixed(4)}`;
        if (keySet.has(key)) return false;
        const city = (r.city || r.locality || r.country || r.stateProvince || sci).toString();
        plant.coordinates.push({ lat, lng, city });
        keySet.add(key);
        totalPointsAdded++;
        const region = createPlantRegionBuffered(plant, { lat, lng, city });
        plantMarkers.push(region);
        const now = Date.now();
        if (progressFill && (now - lastUi > 300)) {
            progressFill.style.width = `${Math.min(100, Math.round((totalPointsAdded / MAX_TOTAL_POINTS) * 100))}%`;
            if (progressDetail) progressDetail.textContent = `${totalPointsAdded}/${MAX_TOTAL_POINTS} nokta yüklendi`;
            lastUi = now;
        }
        return true;
    }

    // Round-robin: her dosyadan 50 kayıt
    const fileQueues = files.map(f => ({ file: f, added: 0, done: false }));
    await new Promise(resolve => {
        const stepFile = (queue, onDone) => {
            if (queue.done) { onDone(); return; }
            queue.added = 0;
            Papa.parse(queue.file, {
                header: true,
                dynamicTyping: true,
                worker: false,
                step: function(res, parser) {
                    if (tryAdd(res.data)) queue.added++;
                    if (totalPointsAdded >= MAX_TOTAL_POINTS) { parser.abort(); queue.done = true; return; }
                    if (queue.added >= CSV_BATCH_PER_FILE) { parser.pause(); onDone(parser); }
                },
                complete: function() { queue.done = true; onDone(); },
                error: function() { queue.done = true; onDone(); }
            });
        };

        const round = () => {
            if (totalPointsAdded >= MAX_TOTAL_POINTS || fileQueues.every(q => q.done)) {
                if (loader) setTimeout(() => loader.style.display = 'none', 500);
                flushPendingRegions();
                updateSpeciesDropdowns(); // Update dropdowns after data loaded
                markDataAsReady(); // Mark data as ready
                resolve();
                return;
            }
            let pending = fileQueues.filter(q => !q.done);
            let index = 0;
            const next = () => {
                if (index >= pending.length) {
                    const schedule = window.requestIdleCallback || window.requestAnimationFrame || setTimeout;
                    schedule(round, 100);
                    return;
                }
                const q = pending[index++];
                stepFile(q, (parser) => {
                    if (parser && !q.done) { parser.pause(); }
                    next();
                });
            };
            next();
        };
        round();
    });
}

// Harita filtresini güncelle
function updateMapFilter(filterType) {
    currentFilter = filterType;
    
    // Mevcut işaretçileri güncelle
    plantMarkers.forEach(marker => {
        const plantId = marker.plantId;
        const plant = plantData.find(p => p.id === plantId);
        
        if (plant) {
            const newColor = getPlantColor(plant, filterType);
            marker.setStyle({
                fillColor: newColor
            });
        }
    });
    
    // Legend'ı güncelle
    updateLegend(filterType);
}

// Legend'ı güncelle
function updateLegend(filterType) {
    const legendItems = document.querySelectorAll('.legend-item');
    
    // Mevcut legend'ı temizle
    legendItems.forEach(item => item.remove());
    
    // Yeni legend oluştur
    const legendContainer = document.querySelector('.legend-items');
    let legendHTML = '';
    
    switch(filterType) {
        case 'allergy':
            legendHTML = `
                <div class="legend-item">
                    <span class="color-dot" style="background-color: #27ae60;"></span>
                    <span>Low Allergy Risk</span>
                </div>
                <div class="legend-item">
                    <span class="color-dot" style="background-color: #f39c12;"></span>
                    <span>Medium Allergy Risk</span>
                </div>
                <div class="legend-item">
                    <span class="color-dot" style="background-color: #e74c3c;"></span>
                    <span>High Allergy Risk</span>
                </div>
            `;
            break;
        case 'honey':
            legendHTML = `
                <div class="legend-item">
                    <span class="color-dot" style="background-color: #95a5a6;"></span>
                    <span>Low Honey Yield</span>
                </div>
                <div class="legend-item">
                    <span class="color-dot" style="background-color: #3498db;"></span>
                    <span>Medium Honey Yield</span>
                </div>
                <div class="legend-item">
                    <span class="color-dot" style="background-color: #2ecc71;"></span>
                    <span>High Honey Yield</span>
                </div>
            `;
            break;
        case 'climate':
            legendHTML = `
                <div class="legend-item">
                    <span class="color-dot" style="background-color: #27ae60;"></span>
                    <span>Low Climate Sensitivity</span>
                </div>
                <div class="legend-item">
                    <span class="color-dot" style="background-color: #f39c12;"></span>
                    <span>Medium Climate Sensitivity</span>
                </div>
                <div class="legend-item">
                    <span class="color-dot" style="background-color: #e74c3c;"></span>
                    <span>High Climate Sensitivity</span>
                </div>
            `;
            break;
        case 'benefits':
            legendHTML = `
                <div class="legend-item">
                    <span class="color-dot" style="background-color: ${colorMapping.benefits.low};"></span>
                    <span>Low Benefit</span>
                </div>
                <div class="legend-item">
                    <span class="color-dot" style="background-color: ${colorMapping.benefits.medium};"></span>
                    <span>Medium Benefit</span>
                </div>
                <div class="legend-item">
                    <span class="color-dot" style="background-color: ${colorMapping.benefits.high};"></span>
                    <span>High Benefit</span>
                </div>
            `;
            break;
        case 'threats':
            legendHTML = `
                <div class="legend-item">
                    <span class="color-dot" style="background-color: ${colorMapping.threats.low};"></span>
                    <span>Low Threat</span>
                </div>
                <div class="legend-item">
                    <span class="color-dot" style="background-color: ${colorMapping.threats.medium};"></span>
                    <span>Medium Threat</span>
                </div>
                <div class="legend-item">
                    <span class="color-dot" style="background-color: ${colorMapping.threats.high};"></span>
                    <span>High Threat</span>
                </div>
            `;
            break;
        default:
            legendHTML = '';
    }
    
    legendContainer.innerHTML = legendHTML;
}

// Bitki detaylarını göster
function showPlantDetails(plantId) {
    const plant = plantData.find(p => p.id === plantId);
    
    if (!plant) {
        console.error('Bitki bulunamadı:', plantId);
        return;
    }
    
    const modal = document.getElementById('plantModal');
    const plantInfo = document.getElementById('plantInfo');
    
    let phenologyHTML = '';
    if (plant.phenology) {
        const currentPhase = getCurrentFloweringPhase(plant);
        const pollinatorRisk = getPollinatorRiskLevel(plant);
        const invasiveThreat = getInvasiveSpeciesThreat(plant);
        const economicValue = calculateEconomicValue(plant);
        
        phenologyHTML = `
            <h3>Phenology Tracking</h3>
            <div style="background: #4a4a4a; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                <h4>Current Status</h4>
                <p><strong>Flowering Phase:</strong> ${currentPhase ? currentPhase.phase : 'No data'}</p>
                <p><strong>Intensity:</strong> ${currentPhase ? currentPhase.intensity : 0}%</p>
                <p><strong>Flowering Period:</strong> ${plant.phenology.floweringPeriod ? 
                    `Month ${plant.phenology.floweringPeriod.early.month} - Month ${plant.phenology.floweringPeriod.late.month}` : 'No data'}</p>
            </div>
            
            <h4>Pollinator Interaction</h4>
            <div style="background: #4a4a4a; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                <p><strong>Primary Pollinators:</strong> ${plant.phenology.pollinatorInteractions ? 
                    plant.phenology.pollinatorInteractions.primaryPollinators.join(', ') : 'No data'}</p>
                <p><strong>Pollinator Risk:</strong> <span style="color: ${pollinatorRisk === 'low' ? '#27ae60' : 
                    pollinatorRisk === 'moderate' ? '#f39c12' : '#e74c3c'}">${pollinatorRisk.toUpperCase()}</span></p>
            </div>
            
            <h4>Conservation and Tourism</h4>
            <div style="background: #4a4a4a; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                <p><strong>Endemic Status:</strong> ${plant.phenology.conservation ? 
                    (plant.phenology.conservation.endemicStatus ? 'Yes' : 'No') : 'No data'}</p>
                <p><strong>Conservation Priority:</strong> ${plant.phenology.conservation ? 
                    plant.phenology.conservation.conservationPriority : 'No data'}</p>
                <p><strong>Tourism Potential:</strong> ${plant.phenology.conservation && plant.phenology.conservation.tourismValue ? 
                    plant.phenology.conservation.tourismValue.ecoTourismPotential : 'No data'}</p>
                <p><strong>Peak Tourism Period:</strong> ${plant.phenology.conservation && plant.phenology.conservation.tourismValue ? 
                    plant.phenology.conservation.tourismValue.peakTourismPeriod : 'No data'}</p>
            </div>
            
            <h4>Invasive Species Alert</h4>
            <div style="background: #4a4a4a; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                <p><strong>Threat Level:</Strong> <span style="color: ${invasiveThreat === 'low' ? '#27ae60' : 
                    invasiveThreat === 'moderate' ? '#f39c12' : '#e74c3c'}">${invasiveThreat.toUpperCase()}</span></p>
                <p><strong>Ecosystem Impact:</strong> ${plant.phenology.invasiveSpeciesAlert ? 
                    plant.phenology.invasiveSpeciesAlert.nativeEcosystemImpact : 'No data'}</p>
            </div>
        `;
    }

    plantInfo.innerHTML = `
        <div class="plant-info">
            <h2>${plant.name}</h2>
            <p><strong>Scientific Name:</strong> ${plant.scientificName}</p>
            <p>${plant.description}</p>
            
            ${phenologyHTML}
            
            <h3>Growing Habitat</h3>
            <p>${plant.details.habitat}</p>
            
            <h3>Allergy Information</h3>
            <p><strong>Risk Level:</strong> ${plant.characteristics.allergyRisk}</p>
            <p>${plant.details.allergyInfo}</p>
            
            <h3>Honey Production</h3>
            <p><strong>Production Level:</strong> ${plant.characteristics.honeyProduction}</p>
            <p>${plant.details.honeyInfo}</p>
            
            <h3>Climate Change Impact</h3>
            <p><strong>Sensitivity Level:</strong> ${plant.characteristics.climateSensitivity}</p>
            <p>${plant.details.climateImpact}</p>
            
            <h3>Benefits</h3>
            <ul>
                ${plant.details.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
            </ul>
            
            <h3>Threats</h3>
            <ul>
                ${plant.details.threats.map(threat => `<li>${threat}</li>`).join('')}
            </ul>
            
        </div>
    `;
    
    modal.style.display = 'block';
}

// Modal'ı kapat
function closeModal() {
    document.getElementById('plantModal').style.display = 'none';
}

// Harita işaretçilerini temizle
function clearMapMarkers() {
    plantMarkers.forEach(marker => {
        map.removeLayer(marker);
    });
    plantMarkers = [];
}

// AI Chat fonksiyonları
function toggleAIChat() {
    const chatMessages = document.getElementById('chatMessages');
    const chatToggle = document.getElementById('chatToggle');
    
    chatOpen = !chatOpen;
    
    if (chatOpen) {
        chatMessages.classList.add('show');
        chatToggle.style.transform = 'rotate(180deg)';
    } else {
        chatMessages.classList.remove('show');
        chatToggle.style.transform = 'rotate(0deg)';
    }
}

function sendAIMessage() {
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    // Kullanıcı mesajını ekle
    addMessage(message, 'user');
    chatInput.value = '';
    
    // AI yanıtını simüle et (gerçek API entegrasyonu için hazır)
    setTimeout(() => {
        const aiResponse = generateAIResponse(message);
        addMessage(aiResponse, 'ai');
    }, 1000);
}

function addMessage(text, sender) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = sender === 'user' ? 'user-message' : 'ai-message';
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function generateAIResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Simple response system (to be replaced with a real AI API)
    if (message.includes('lavender') || message.includes('lavandula')) {
        return 'Lavender thrives in Mediterranean climates. It provides high honey yield, has low allergy risk, and is moderately affected by climate change.';
    } else if (message.includes('thyme') || message.includes('thymus') || message.includes('kekik')) {
        return 'Thyme is a hardy plant that grows widely across Türkiye. It provides medium honey yield and is quite resilient to climate change.';
    } else if (message.includes('chamomile') || message.includes('matricaria') || message.includes('papatya')) {
        return 'Chamomile is widespread but carries a high allergy risk. It has low honey yield and is highly affected by climate change.';
    } else if (message.includes('allergy') || message.includes('alerji')) {
        return 'Regarding allergy risk: Lavender is the safest, Thyme is medium risk, and Chamomile is high risk. The color legend on the map shows these risks.';
    } else if (message.includes('honey') || message.includes('bal')) {
        return 'For honey yield: Lavender is highest, Thyme is medium, and Chamomile is low. Honey quality also varies by plant species.';
    } else if (message.includes('climate') || message.includes('iklim')) {
        return 'Climate sensitivity: Thyme is most resilient, Lavender is medium, and Chamomile is most sensitive. This is visualized on the map.';
    } else {
        return 'Ask me specific questions about plant species. For example: "Where does Lavender grow?", "Which plant produces the most honey?", "Which plant has the lowest allergy risk?"';
    }
}

// Fenoloji Dashboard Fonksiyonları

// Dashboard'ı başlat
function initializePhenologyDashboard() {
    // Update species dropdowns
    updateSpeciesDropdowns();
    
    // Event listener'ları ekle (sadece bir kere)
    const timelineYear = document.getElementById('timelineYear');
    const timelineSpecies = document.getElementById('timelineSpecies');
    const trendsDataSource = document.getElementById('trendsDataSource');
    const trendsSpecies = document.getElementById('trendsSpecies');
    
    if (timelineYear && !timelineYear.dataset.listenerAdded) {
        timelineYear.addEventListener('change', updateTimelineChart);
        timelineYear.dataset.listenerAdded = 'true';
    }
    
    if (timelineSpecies && !timelineSpecies.dataset.listenerAdded) {
        timelineSpecies.addEventListener('change', updateTimelineChart);
        timelineSpecies.dataset.listenerAdded = 'true';
    }
    
    if (trendsDataSource && !trendsDataSource.dataset.listenerAdded) {
        trendsDataSource.addEventListener('change', updateTrendsChart);
        trendsDataSource.dataset.listenerAdded = 'true';
    }
    
    if (trendsSpecies && !trendsSpecies.dataset.listenerAdded) {
        trendsSpecies.addEventListener('change', updateTrendsChart);
        trendsSpecies.dataset.listenerAdded = 'true';
    }
    
    const pollinatorSpecies = document.getElementById('pollinatorSpecies');
    if (pollinatorSpecies && !pollinatorSpecies.dataset.listenerAdded) {
        pollinatorSpecies.addEventListener('change', updatePollinatorCharts);
        pollinatorSpecies.dataset.listenerAdded = 'true';
    }
}

function updateSpeciesDropdowns() {
    const timelineSpecies = document.getElementById('timelineSpecies');
    const trendsSpecies = document.getElementById('trendsSpecies');
    const pollinatorSpecies = document.getElementById('pollinatorSpecies');
    
    // Get current selections
    const currentTimeline = timelineSpecies ? timelineSpecies.value : 'all';
    const currentTrends = trendsSpecies ? trendsSpecies.value : 'all';
    const currentPollinator = pollinatorSpecies ? pollinatorSpecies.value : 'all';
    
    // Clear existing options (except "All Species")
    if (timelineSpecies) timelineSpecies.innerHTML = '<option value="all">All Species</option>';
    if (trendsSpecies) trendsSpecies.innerHTML = '<option value="all">All Species</option>';
    if (pollinatorSpecies) pollinatorSpecies.innerHTML = '<option value="all">All Species</option>';
    
    // Add ALL plants with phenology data (regardless of coordinates)
    const addedCount = { timeline: 0, trends: 0, pollinator: 0 };
    
    plantData.forEach(plant => {
        // Timeline - needs phenology.seasonalCalendar
        if (plant.phenology && plant.phenology.seasonalCalendar) {
            if (timelineSpecies) {
        const option1 = document.createElement('option');
        option1.value = plant.id;
        option1.textContent = plant.name;
        timelineSpecies.appendChild(option1);
                addedCount.timeline++;
            }
        }
        
        // Trends - needs phenology.multiyearTrends
        if (plant.phenology && plant.phenology.multiyearTrends) {
            if (trendsSpecies) {
        const option2 = document.createElement('option');
        option2.value = plant.id;
        option2.textContent = plant.name;
        trendsSpecies.appendChild(option2);
                addedCount.trends++;
            }
        }
        
        // Pollinators - needs phenology.pollinatorInteractions
        if (plant.phenology && plant.phenology.pollinatorInteractions) {
            if (pollinatorSpecies) {
                const option3 = document.createElement('option');
                option3.value = plant.id;
                option3.textContent = plant.name;
                pollinatorSpecies.appendChild(option3);
                addedCount.pollinator++;
            }
        }
    });
    
    // Restore selections if they still exist
    if (timelineSpecies && currentTimeline) timelineSpecies.value = currentTimeline;
    if (trendsSpecies && currentTrends) trendsSpecies.value = currentTrends;
    if (pollinatorSpecies && currentPollinator) pollinatorSpecies.value = currentPollinator;
    
    console.log(`Updated species dropdowns - Timeline: ${addedCount.timeline}, Trends: ${addedCount.trends}, Pollinators: ${addedCount.pollinator} species`);
}

function markDataAsReady() {
    dataLoadingComplete = true;
    
    // Show notification once
    if (!dataReadyNotificationShown) {
        dataReadyNotificationShown = true;
        showDataReadyNotification();
    }
}

function showDataReadyNotification() {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 45%;
        left: 48%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #27ae60, #2ecc71);
        color: white;
        padding: 30px 40px;
        border-radius: 15px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        z-index: 10000;
        text-align: center;
        font-size: 1.2rem;
        font-weight: 600;
        animation: slideIn 0.5s ease;
    `;
    
    notification.innerHTML = `
        <i class="fas fa-check-circle" style="font-size: 3rem; margin-bottom: 15px; display: block;"></i>
        <div style="margin-bottom: 10px;">Data Loading Complete!</div>
        <div style="font-size: 0.9rem; font-weight: normal; opacity: 0.9;">
            You can now explore Timeline, Trends, and Pollinators charts
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translate(-50%, -50%) scale(0.8)';
        notification.style.transition = 'all 0.5s ease';
        setTimeout(() => notification.remove(), 500);
    }, 4000);
}

function checkDataReady() {
    if (!dataLoadingComplete) {
        showLoadingWarning();
        return false;
    }
    return true;
}

function showLoadingWarning() {
    const warning = document.createElement('div');
    warning.style.cssText = `
        position: fixed;
        top: 45%;
        left: 48%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #f39c12, #e67e22);
        color: white;
        padding: 30px 40px;
        border-radius: 15px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        z-index: 10000;
        text-align: center;
        font-size: 1.1rem;
        font-weight: 600;
    `;
    
    warning.innerHTML = `
        <i class="fas fa-hourglass-half fa-spin" style="font-size: 2.5rem; margin-bottom: 15px; display: block;"></i>
        <div style="margin-bottom: 10px;">Data Still Loading...</div>
        <div style="font-size: 0.85rem; font-weight: normal; opacity: 0.9;">
            Please wait while we load plant species data from GBIF database
        </div>
        <div style="margin-top: 15px; font-size: 0.75rem; opacity: 0.7;">
            This usually takes 30-60 seconds
        </div>
    `;
    
    document.body.appendChild(warning);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        warning.style.opacity = '0';
        warning.style.transform = 'translate(-50%, -50%) scale(0.9)';
        warning.style.transition = 'all 0.3s ease';
        setTimeout(() => warning.remove(), 300);
    }, 3000);
}

// Sidebar toggle function - completely hide/show
function toggleSidebar() {
    const sidebar = document.querySelector('.control-panel');
    const toggleBtn = document.getElementById('sidebarHideBtn');
    const toggleIcon = document.getElementById('hideIcon');
    const mainContent = document.querySelector('.main-content');
    
    if (sidebar && toggleBtn) {
        const isHidden = sidebar.classList.contains('sidebar-hidden');
        
        if (isHidden) {
            // Show sidebar
            sidebar.classList.remove('sidebar-hidden');
            toggleBtn.classList.remove('sidebar-hidden');
            toggleBtn.classList.add('sidebar-open');
            toggleBtn.style.left = '400px'; // Move button back to sidebar edge
            toggleIcon.className = 'fas fa-chevron-left';
            if (mainContent) mainContent.classList.remove('sidebar-hidden');
            document.body.classList.remove('sidebar-hidden'); // Remove body class
            console.log('Sidebar shown');
        } else {
            // Hide sidebar completely
            sidebar.classList.add('sidebar-hidden');
            toggleBtn.classList.remove('sidebar-open');
            toggleBtn.classList.add('sidebar-hidden');
            toggleBtn.style.left = '20px'; // Move button to left edge
            toggleIcon.className = 'fas fa-chevron-right';
            if (mainContent) mainContent.classList.add('sidebar-hidden');
            document.body.classList.add('sidebar-hidden'); // Add body class
            console.log('Sidebar hidden');
        }
        
        // Refresh map after animation completes
        setTimeout(() => {
            if (window.map) {
                window.map.invalidateSize();
                console.log('Map refreshed');
            }
        }, 300);
    }
}

// Tab değiştirme
function switchTab(tabName) {
    // Check if data is ready for certain tabs
    if (['timeline', 'trends', 'pollinators'].includes(tabName)) {
        if (!checkDataReady()) {
            return; // Don't switch tab if data not ready
        }
    }
    
    // Tüm tab butonlarını deaktif et
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
    
    // Seçilen tab'ı aktif et
    document.querySelector(`[onclick="switchTab('${tabName}')"]`).classList.add('active');
    
    currentTab = tabName;
    
    if (tabName === 'map') {
        document.getElementById('mapTab').classList.add('active');
        // Haritayı yeniden boyutlandır
        setTimeout(() => {
            if (map) map.invalidateSize();
        }, 100);
    } else if (tabName === 'timeline') {
        document.getElementById('timelineTab').classList.add('active');
        // Ensure dropdowns are up to date
        updateSpeciesDropdowns();
        // Update charts
        setTimeout(() => {
        updateTimelineChart();
        createSeasonalCalendar();
        }, 50);
    } else if (tabName === 'trends') {
        document.getElementById('trendsTab').classList.add('active');
        // Ensure dropdowns are up to date
        updateSpeciesDropdowns();
        // Update charts
        setTimeout(() => {
        updateTrendsChart();
        updateAnomalyDetection();
        }, 50);
    } else if (tabName === 'pollinators') {
        document.getElementById('pollinatorsTab').classList.add('active');
        setTimeout(() => {
        updatePollinatorCharts();
        updatePollinatorRiskAlerts();
        updateInvasiveSpeciesAlerts();
        }, 50);
    } else if (tabName === 'harvesting') {
        document.getElementById('harvestingTab').classList.add('active');
        if (hives.length > 0) {
            updateHarvestingDashboard();
        }
    }
}

// Current status function removed - UI element deleted

function getFloweringIntensity(plant, monthNumber) {
    // Default intensity values by month (0-100)
    const defaultIntensity = {
        1: 0,   // January
        2: 0,   // February
        3: 10,  // March
        4: 25,  // April
        5: 60,  // May
        6: 100, // June
        7: 80,  // July
        8: 40,  // August
        9: 20,  // September
        10: 5,  // October
        11: 0,  // November
        12: 0   // December
    };
    
    // Check if plant has specific phenology data
    if (plant.phenology && plant.phenology.seasonalCalendar) {
        const calendar = plant.phenology.seasonalCalendar;
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                           'July', 'August', 'September', 'October', 'November', 'December'];
        
        const monthName = monthNames[monthNumber - 1];
        
        // Look for the month in calendar
        for (const phase of calendar) {
            if (phase.months && phase.months.includes(monthName)) {
                // Convert phase activity to intensity percentage
                switch (phase.activity) {
                    case 'Germination':
                    case 'Seed Formation':
                        return 5;
                    case 'Early Growth':
                    case 'Pre-flowering':
                        return 25;
                    case 'Flowering':
                    case 'Peak Flowering':
                        return 85;
                    case 'Late Flowering':
                        return 50;
                    case 'Fruiting':
                        return 30;
                    case 'Dormant':
                    case 'Post-harvest':
                        return 0;
                    default:
                        return 10;
                }
            }
        }
    }
    
    // Fallback to default intensity for the month
    return defaultIntensity[monthNumber] || 0;
}

// Timeline chart güncelle
function updateTimelineChart() {
    const year = document.getElementById('timelineYear').value;
    const speciesIdStr = document.getElementById('timelineSpecies').value;
    
    console.log('Timeline update requested:', { year, speciesId: speciesIdStr });
    
    const ctx = document.getElementById('timelineChart');
    if (!ctx) return;
    
    // Mevcut chart'ı temizle
    if (phenologyCharts.timeline) {
        phenologyCharts.timeline.destroy();
    }
    
    const canvas = ctx.querySelector('canvas') || document.createElement('canvas');
    ctx.innerHTML = '';
    ctx.appendChild(canvas);
    
    const chartCtx = canvas.getContext('2d');
    
    let datasets = [];
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                   'July', 'August', 'September', 'October', 'November', 'December'];
    
    // Filter plants - handle both string and number comparison
    let plantsToShow;
    if (speciesIdStr === 'all' || speciesIdStr === '') {
        // Show ALL plants that have phenology data OR seasonal calendar
        plantsToShow = plantData.filter(p => p.phenology && p.phenology.seasonalCalendar);
        console.log('Timeline - All species mode:', plantsToShow.map(p => p.name));
    } else {
        const speciesId = parseInt(speciesIdStr);
        plantsToShow = plantData.filter(p => p.id === speciesId);
        console.log('Timeline - Single species mode:', plantsToShow.map(p => p.name));
    }
    
    console.log(`Showing ${plantsToShow.length} plants in timeline`);
    
    plantsToShow.forEach((plant, index) => {
        if (!plant.phenology) {
            console.log(`Skipping ${plant.name} - no phenology data`);
            return;
        }
        
        const data = months.map((month, monthIndex) => 
            getFloweringIntensity(plant, monthIndex + 1)
        );
        
        console.log(`${plant.name} timeline data:`, data);
        
        const colors = [
            '#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c',
            '#e67e22', '#8e44ad', '#2980b9', '#27ae60', '#f1c40f', '#34495e',
            '#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'
        ];
        
        datasets.push({
            label: plant.name,
            data: data,
            borderColor: colors[index % colors.length],
            backgroundColor: colors[index % colors.length] + '20',
            tension: 0.4,
            fill: false
        });
    });
    
    console.log(`Total datasets: ${datasets.length}`);
    
    // Check if we have data to display
    if (datasets.length === 0) {
        ctx.innerHTML = '<div style="padding: 40px; text-align: center; color: #ccc;"><i class="fas fa-info-circle"></i><br><br>No flowering data available for selected species</div>';
        return;
    }
    
    phenologyCharts.timeline = new Chart(chartCtx, {
        type: 'line',
        data: {
            labels: months,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: `Flowering Intensity - ${year}`,
                    color: '#fff'
                },
                legend: {
                    labels: {
                        color: '#fff'
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: '#fff' },
                    grid: { color: '#666' }
                },
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: { color: '#fff' },
                    grid: { color: '#666' },
                    title: {
                        display: true,
                        text: 'Flowing Intensity (%)',
                        color: '#fff'
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// Mevsimsel takvim oluştur
function createSeasonalCalendar() {
    const calendarContainer = document.getElementById('seasonalCalendar');
    if (!calendarContainer) return;
    
    const currentMonth = new Date().getMonth() + 1;
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    let calendarHTML = '';
    
    months.forEach((month, index) => {
        const monthNum = index + 1;
        const isCurrentMonth = monthNum === currentMonth;
        
        // Count species flowering this month
        const floweringCount = plantData.filter(plant => 
            getFloweringIntensity(plant, monthNum) > 0
        ).length;
        
        // Compute average intensity
        const avgIntensity = plantData.reduce((sum, plant) => 
            sum + getFloweringIntensity(plant, monthNum), 0
        ) / plantData.length;
        
        calendarHTML += `
            <div class="month-card ${isCurrentMonth ? 'active' : ''}">
                <div class="month-name">${month}</div>
                <div class="flowering-phase">${floweringCount} species flowering</div>
                <div class="intensity-bar">
                    <div class="intensity-fill" style="width: ${avgIntensity}%"></div>
                </div>
            </div>
        `;
    });
    
    calendarContainer.innerHTML = calendarHTML;
}

// Trends chart güncelle
function updateTrendsChart() {
    const dataSource = document.getElementById('trendsDataSource').value;
    const speciesIdStr = document.getElementById('trendsSpecies').value;
    
    console.log('Trends update requested:', { dataSource, speciesId: speciesIdStr });
    
    const ctx = document.getElementById('trendsChart');
    if (!ctx) return;
    
    // Mevcut chart'ı temizle
    if (phenologyCharts.trends) {
        phenologyCharts.trends.destroy();
    }
    
    const canvas = ctx.querySelector('canvas') || document.createElement('canvas');
    ctx.innerHTML = '';
    ctx.appendChild(canvas);
    
    const chartCtx = canvas.getContext('2d');
    
    // Filter plants - handle both string and number comparison
    let plantsToShow;
    if (speciesIdStr === 'all' || speciesIdStr === '') {
        plantsToShow = plantData.filter(p => p.phenology && p.phenology.multiyearTrends);
    } else {
        const speciesId = parseInt(speciesIdStr);
        plantsToShow = plantData.filter(p => p.id === speciesId && p.phenology && p.phenology.multiyearTrends);
    }
    
    console.log(`Showing ${plantsToShow.length} plants in trends`);
    
    const years = ['2020', '2021', '2022', '2023', '2024'];
    
    let datasets = [];
    
    plantsToShow.forEach((plant, index) => {
        if (!plant.phenology || !plant.phenology.multiyearTrends) {
            console.log(`Skipping ${plant.name} - no multiyear trends data`);
            return;
        }
        
        const trendData = plant.phenology.multiyearTrends.nasaLandsatData;
        const data = years.map(year => trendData[year] ? trendData[year].intensity : 0);
        
        console.log(`${plant.name} trends data:`, data);
        
        const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6'];
        
        datasets.push({
            label: plant.name,
            data: data,
            borderColor: colors[index % colors.length],
            backgroundColor: colors[index % colors.length] + '20',
            tension: 0.4
        });
    });
    
    console.log(`Total trend datasets: ${datasets.length}`);
    
    // Check if we have data to display
    if (datasets.length === 0) {
        ctx.innerHTML = '<div style="padding: 40px; text-align: center; color: #ccc;"><i class="fas fa-info-circle"></i><br><br>No multi-year trend data available for selected species</div>';
        return;
    }
    
    phenologyCharts.trends = new Chart(chartCtx, {
        type: 'line',
        data: {
            labels: years,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: `NASA ${dataSource.toUpperCase()} Data - Multi-Year Trends`,
                    color: '#fff'
                },
                legend: {
                    labels: {
                        color: '#fff'
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: '#fff' },
                    grid: { color: '#666' }
                },
                y: {
                    ticks: { color: '#fff' },
                    grid: { color: '#666' },
                    title: {
                        display: true,
                        text: 'Flowering Intensity',
                        color: '#fff'
                    }
                }
            }
        }
    });
}

// Anomali tespiti güncelle
function updateAnomalyDetection() {
    const container = document.getElementById('anomalyDetection');
    if (!container) return;
    
    let anomalies = [];
    
    plantData.forEach(plant => {
        if (!plant.phenology || !plant.phenology.multiyearTrends) return;
        
        const trendData = plant.phenology.multiyearTrends.nasaLandsatData;
        Object.keys(trendData).forEach(year => {
            if (trendData[year].anomaly) {
                anomalies.push({
                    plant: plant.name,
                    year: year,
                    note: trendData[year].note
                });
            }
        });
    });
    
    let html = '<h4>Anomaly Detection</h4>';
    if (anomalies.length === 0) {
        html += '<p style="color: #27ae60;">No significant anomalies detected.</p>';
    } else {
        anomalies.forEach(anomaly => {
            html += `
                <div class="risk-alert moderate">
                    <i class="fas fa-exclamation-triangle"></i>
                    <div>
                        <strong>${anomaly.plant}</strong> - ${anomaly.year}<br>
                        <small>${anomaly.note}</small>
                    </div>
                </div>
            `;
        });
    }
    
    container.innerHTML = html;
}

// Polinatör chart'larını güncelle
function updatePollinatorCharts() {
    const speciesIdStr = document.getElementById('pollinatorSpecies') ? 
                         document.getElementById('pollinatorSpecies').value : 'all';
    
    console.log('Pollinator update requested:', { speciesId: speciesIdStr });
    
    const ctx = document.getElementById('pollinatorSyncChart');
    if (!ctx) return;
    
    // Mevcut chart'ı temizle
    if (phenologyCharts.pollinator) {
        phenologyCharts.pollinator.destroy();
    }
    
    const canvas = ctx.querySelector('canvas') || document.createElement('canvas');
    ctx.innerHTML = '';
    ctx.appendChild(canvas);
    
    const chartCtx = canvas.getContext('2d');
    
    // Filter plants
    let plantsToShow;
    if (speciesIdStr === 'all' || speciesIdStr === '') {
        plantsToShow = plantData.filter(p => p.phenology && p.phenology.pollinatorInteractions);
    } else {
        const speciesId = parseInt(speciesIdStr);
        plantsToShow = plantData.filter(p => p.id === speciesId && p.phenology && p.phenology.pollinatorInteractions);
    }
    
    console.log(`Showing ${plantsToShow.length} plants in pollinators`);
    
    // Collect pollinator synchronization data
    const pollinatorData = {
        bees: [],
        butterflies: [],
        birds: []
    };
    
    const plantLabels = [];
    
    plantsToShow.forEach(plant => {
        plantLabels.push(plant.name.split('(')[0].trim());
        const sync = plant.phenology.pollinatorInteractions.pollinatorSynchronization;
        
        pollinatorData.bees.push(sync.bees ? sync.bees.syncRate : 0);
        pollinatorData.butterflies.push(sync.butterflies ? sync.butterflies.syncRate : 0);
        pollinatorData.birds.push(sync.birds ? sync.birds.syncRate : 0);
    });
    
    phenologyCharts.pollinator = new Chart(chartCtx, {
        type: 'bar',
        data: {
            labels: plantLabels,
            datasets: [
                {
                    label: 'Bees',
                    data: pollinatorData.bees,
                    backgroundColor: '#f39c12'
                },
                {
                    label: 'Butterflies',
                    data: pollinatorData.butterflies,
                    backgroundColor: '#e74c3c'
                },
                {
                    label: 'Birds',
                    data: pollinatorData.birds,
                    backgroundColor: '#3498db'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Pollinator Synchronization Rates (%)',
                    color: '#fff'
                },
                legend: {
                    labels: {
                        color: '#fff'
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: '#fff', maxRotation: 45 },
                    grid: { color: '#666' }
                },
                y: {
                    ticks: { color: '#fff' },
                    grid: { color: '#666' },
                    max: 100
                }
            }
        }
    });
}

// Polinatör risk uyarılarını güncelle
function updatePollinatorRiskAlerts() {
    const container = document.getElementById('pollinatorRiskAlert');
    if (!container) return;
    
    const speciesIdStr = document.getElementById('pollinatorSpecies') ? 
                         document.getElementById('pollinatorSpecies').value : 'all';
    
    // Filter plants
    let plantsToShow;
    if (speciesIdStr === 'all' || speciesIdStr === '') {
        plantsToShow = plantData.filter(p => p.phenology && p.phenology.pollinatorInteractions);
    } else {
        const speciesId = parseInt(speciesIdStr);
        plantsToShow = plantData.filter(p => p.id === speciesId && p.phenology && p.phenology.pollinatorInteractions);
    }
    
    let html = '';
    
    plantsToShow.forEach(plant => {
        const risk = plant.phenology.pollinatorInteractions.pollinatorDeficitRisk;
        const riskClass = risk.level === 'low' ? 'low' : 
                         risk.level === 'moderate' ? 'moderate' : 'high';
        
        html += `
            <div class="risk-alert ${riskClass}">
                <i class="fas fa-bug"></i>
                <div>
                    <strong>${plant.name.split('(')[0].trim()}</strong><br>
                    <small>Risk: ${risk.level.toUpperCase()} (${risk.riskScore}/10)</small><br>
                    <small>${risk.factors.join(', ')}</small>
                </div>
            </div>
        `;
    });
    
    if (!html) {
        html = '<div style="padding: 20px; text-align: center; color: #ccc;">No pollinator risk data available for selected species</div>';
    }
    
    container.innerHTML = html;
}

// İstilacı tür uyarılarını güncelle
function updateInvasiveSpeciesAlerts() {
    const container = document.getElementById('invasiveSpeciesAlert');
    if (!container) return;
    
    const speciesIdStr = document.getElementById('pollinatorSpecies') ? 
                         document.getElementById('pollinatorSpecies').value : 'all';
    
    // Filter plants
    let plantsToShow;
    if (speciesIdStr === 'all' || speciesIdStr === '') {
        plantsToShow = plantData.filter(p => p.phenology && p.phenology.invasiveSpeciesAlert);
    } else {
        const speciesId = parseInt(speciesIdStr);
        plantsToShow = plantData.filter(p => p.id === speciesId && p.phenology && p.phenology.invasiveSpeciesAlert);
    }
    
    let html = '';
    
    plantsToShow.forEach(plant => {
        const alert = plant.phenology.invasiveSpeciesAlert;
        if (alert.threatLevel === 'low') return; // Skip showing low risk
        
        const riskClass = alert.threatLevel === 'moderate' ? 'moderate' : 
                         alert.threatLevel === 'high' ? 'high' : 'critical';
        
        html += `
            <div class="risk-alert ${riskClass}">
                <i class="fas fa-exclamation-triangle"></i>
                <div>
                    <strong>${plant.name.split('(')[0].trim()}</strong><br>
                    <small>Threat: ${alert.threatLevel.toUpperCase()}</small><br>
                    <small>Impact: ${alert.nativeEcosystemImpact}</small>
                </div>
            </div>
        `;
    });
    
    if (!html) {
        html = '<div class="risk-alert low"><i class="fas fa-check"></i><div>No significant invasive species threat detected.</div></div>';
    }
    
    container.innerHTML = html;
}






// Beehive location selection functions
function toggleHiveSelection() {
    hiveSelectionMode = !hiveSelectionMode;
    const btn = document.getElementById('selectHiveBtn');
    const info = document.getElementById('hiveInfo');
    
    if (hiveSelectionMode) {
        btn.classList.add('active');
        btn.innerHTML = '<i class="fas fa-check"></i> Click on Map';
        info.style.display = 'flex';
        map.getContainer().style.cursor = 'crosshair';
        
        // Disable plant region clicks temporarily
        plantMarkers.forEach(marker => {
            marker.off('click');
        });
        
        // Add click listener to map
        map.once('click', onMapClickForHive);
    } else {
        btn.classList.remove('active');
        btn.innerHTML = '<i class="fas fa-map-marker-alt"></i> Select Beehive Location';
        info.style.display = 'none';
        map.getContainer().style.cursor = '';
        map.off('click', onMapClickForHive);
        
        // Re-enable plant region clicks
        restorePlantMarkerClicks();
    }
}

function onMapClickForHive(e) {
    // Store clicked location temporarily
    window.tempClickedLocation = e.latlng;
    
    // Show name input modal
    showHiveNameModal();
    
    // Reset selection mode
    hiveSelectionMode = false;
    const btn = document.getElementById('selectHiveBtn');
    btn.classList.remove('active');
    btn.innerHTML = '<i class="fas fa-map-marker-alt"></i> Select Beehive Location';
    map.getContainer().style.cursor = '';
    
    const info = document.getElementById('hiveInfo');
    info.style.display = 'none';
    
    // Re-enable plant region clicks
    restorePlantMarkerClicks();
}

function showHiveNameModal() {
    const modal = document.getElementById('hiveNameModal');
    const nameInput = document.getElementById('hiveNameInput');
    const beeCountInput = document.getElementById('beeCountInput');
    
    // Set default name
    nameInput.value = `Beehive #${nextHiveId}`;
    beeCountInput.value = 10;
    
    modal.style.display = 'block';
    nameInput.focus();
    nameInput.select();
}

function confirmHivePlacement() {
    const modal = document.getElementById('hiveNameModal');
    const nameInput = document.getElementById('hiveNameInput');
    const beeCountInput = document.getElementById('beeCountInput');
    
    const hiveName = nameInput.value.trim() || `Beehive #${nextHiveId}`;
    const beeCount = parseInt(beeCountInput.value) || 10;
    
    modal.style.display = 'none';
    
    const clickedLocation = window.tempClickedLocation;
    if (!clickedLocation) {
        console.error('No clicked location stored');
        return;
    }
    
    // Create new hive
    const hiveId = nextHiveId++;
    const hive = {
        id: hiveId,
        name: hiveName,
        location: clickedLocation,
        beeCount: beeCount,
        marker: null,
        circle: null,
        data: null
    };
    
    console.log('Creating hive:', hive);
    
    // Place hive on map
    placeHive(hive);
    
    // Add to hives array
    hives.push(hive);
    currentHiveId = hiveId;
    
    // Update hive selector dropdown
    updateHiveSelector();
    
    // Analyze this hive
    analyzeHive(hive);
    
    // Cleanup
    window.tempClickedLocation = null;
}

function cancelHiveNameInput() {
    document.getElementById('hiveNameModal').style.display = 'none';
    window.tempClickedLocation = null;
}

function restorePlantMarkerClicks() {
    plantMarkers.forEach(marker => {
        marker.on('click', function() {
            const plant = plantData.find(p => p.id === marker.plantId);
            if (plant) {
                showPlantDetails(plant.id);
            }
        });
    });
}

function placeHive(hive) {
    const latlng = hive.location;
    
    // Create custom hive icon with number
    const hiveIcon = L.divIcon({
        className: 'hive-marker',
        html: `<div style="background: #f39c12; width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.3); border: 3px solid white;">
                   <i class="fas fa-home" style="color: white; font-size: 16px;"></i>
               </div>
               <div style="background: rgba(243, 156, 18, 0.9); color: white; padding: 2px 6px; border-radius: 10px; 
                           font-size: 0.7rem; font-weight: bold; text-align: center; margin-top: 2px; white-space: nowrap;">
                   ${hive.name}
               </div>`,
        iconSize: [35, 35],
        iconAnchor: [17, 17]
    });
    
    // Place marker
    const marker = L.marker(latlng, { icon: hiveIcon }).addTo(map);
    marker.bindPopup(`<strong>${hive.name}</strong><br>Colonies: ${hive.beeCount}<br>Foraging radius: ${hiveRadiusKm} km`);
    hive.marker = marker;
    
    // Draw radius circle
    const circle = L.circle(latlng, {
        radius: hiveRadiusKm * 1000,
        fillColor: '#f39c12',
        fillOpacity: 0.1,
        color: '#f39c12',
        weight: 2,
        dashArray: '5, 10'
    }).addTo(map);
    hive.circle = circle;
    
    // Fit map to show radius
    map.fitBounds(circle.getBounds(), { padding: [50, 50] });
}

function clearHiveLocation() {
    // Clear all hives
    hives.forEach(hive => {
        if (hive.marker) map.removeLayer(hive.marker);
        if (hive.circle) map.removeLayer(hive.circle);
    });
    
    hives = [];
    currentHiveId = null;
    hiveSelectionMode = false;
    
    const btn = document.getElementById('selectHiveBtn');
    const info = document.getElementById('hiveInfo');
    
    btn.classList.remove('active');
    btn.innerHTML = '<i class="fas fa-map-marker-alt"></i> Select Beehive Location';
    info.style.display = 'none';
    map.getContainer().style.cursor = '';
    
    // Re-enable plant region clicks
    restorePlantMarkerClicks();
    
    // Clear harvesting display
    document.getElementById('harvestingMessage').style.display = 'block';
    document.getElementById('harvestingDashboard').style.display = 'none';
    document.getElementById('hiveControlsPanel').style.display = 'none';
    
    // Clear selector
    const selector = document.getElementById('hiveSelector');
    if (selector) {
        selector.innerHTML = '<option value="">-- Select a hive --</option>';
    }
}

function analyzeHive(hive) {
    if (!hive || !hive.location) return;
    
    // Find all flowers within radius
    const flowersInRadius = [];
    const speciesCount = {};
    const speciesData = {};
    
    plantMarkers.forEach(marker => {
        const markerLatLng = marker.getLatLng();
        const distance = hive.location.distanceTo(markerLatLng) / 1000; // Convert to km
        
        if (distance <= hiveRadiusKm) {
            const plant = plantData.find(p => p.id === marker.plantId);
            if (plant) {
                flowersInRadius.push({
                    plant: plant,
                    distance: distance,
                    marker: marker
                });
                
                // Count species
                const speciesName = plant.scientificName;
                if (!speciesCount[speciesName]) {
                    speciesCount[speciesName] = 0;
                    speciesData[speciesName] = plant;
                }
                speciesCount[speciesName]++;
            }
        }
    });
    
    // Check if area has flowers - only suggest if ABSOLUTELY no flowers (not even 1)
    if (flowersInRadius.length === 0) {
        // No flowers found at all, suggest nearest flower-rich area
        showNoFlowersSuggestion(hive);
        return;
    }
    
    // If there are flowers (even just 1), continue with analysis
    
    // Calculate honey yield per species
    const honeyYield = {};
    const monthlyYield = Array(12).fill(0);
    let totalAnnualYield = 0;
    
    Object.keys(speciesCount).forEach(speciesName => {
        const plant = speciesData[speciesName];
        const count = speciesCount[speciesName];
        const honeyScore = plant.characteristics.honeyScore || 5;
        
        // Base honey per plant region per colony per year (kg)
        // High score (8-10): 15-25 kg, Medium (5-7): 8-15 kg, Low (1-4): 2-8 kg
        let honeyPerRegionPerColony = 10;
        if (honeyScore >= 8) {
            honeyPerRegionPerColony = 15 + (honeyScore - 8) * 5;
        } else if (honeyScore >= 5) {
            honeyPerRegionPerColony = 8 + (honeyScore - 5) * 2.3;
        } else {
            honeyPerRegionPerColony = 2 + honeyScore * 1.5;
        }
        
        // Multiply by bee colony count
        const beeMultiplier = hive.beeCount / 10; // 10 colonies is baseline
        const honeyPerRegion = honeyPerRegionPerColony * beeMultiplier;
        const speciesYield = honeyPerRegion * count;
        
        honeyYield[speciesName] = {
            totalYield: speciesYield,
            yieldPerRegion: honeyPerRegion,
            yieldPerColony: honeyPerRegionPerColony,
            regionCount: count,
            honeyScore: honeyScore
        };
        
        totalAnnualYield += speciesYield;
        
        // Distribute yield across flowering months
        if (plant.phenology && plant.phenology.seasonalCalendar && plant.phenology.seasonalCalendar.length > 0) {
            const totalIntensity = plant.phenology.seasonalCalendar.reduce((sum, entry) => sum + (entry.intensity || 0), 0);
            
            plant.phenology.seasonalCalendar.forEach(entry => {
                const monthIndex = getMonthIndex(entry.month);
                
                if (monthIndex >= 0 && entry.intensity > 0 && totalIntensity > 0) {
                    // Distribute yield proportionally based on flowering intensity
                    const monthlyContribution = (speciesYield * entry.intensity) / totalIntensity;
                    monthlyYield[monthIndex] += monthlyContribution;
                }
            });
        } else {
            // If no phenology data, distribute evenly across growing season (Apr-Sep)
            for (let m = 3; m <= 8; m++) {
                monthlyYield[m] += speciesYield / 6;
            }
        }
    });
    
    // Store harvesting data in hive object
    hive.data = {
        radius: hiveRadiusKm,
        flowersInRadius: flowersInRadius,
        totalFlowers: flowersInRadius.length,
        speciesCount: Object.keys(speciesCount).length,
        speciesDistribution: speciesCount,
        speciesData: speciesData,
        honeyYield: honeyYield,
        totalAnnualYield: totalAnnualYield,
        monthlyYield: monthlyYield,
        averageDistance: flowersInRadius.length > 0 ? 
            flowersInRadius.reduce((sum, f) => sum + f.distance, 0) / flowersInRadius.length : 0
    };
    
    // Update popup with data
    hive.marker.setPopupContent(`
        <strong>${hive.name}</strong><br>
        Colonies: ${hive.beeCount}<br>
        Flowers: ${flowersInRadius.length} regions<br>
        Species: ${Object.keys(speciesCount).length}<br>
        Est. Yield: ${Math.round(totalAnnualYield)} kg/year
    `);
    
    // Show controls panel
    document.getElementById('hiveControlsPanel').style.display = 'block';
    
    // Update harvesting dashboard
    if (currentTab === 'harvesting') {
        updateHarvestingDashboard();
    }
    
    // Automatically switch to harvesting tab
    switchTab('harvesting');
}

function getMonthIndex(monthName) {
    const months = {
        // English months
        'January': 0, 'February': 1, 'March': 2, 'April': 3,
        'May': 4, 'June': 5, 'July': 6, 'August': 7,
        'September': 8, 'October': 9, 'November': 10, 'December': 11,
        // Turkish months
        'Ocak': 0, 'Şubat': 1, 'Mart': 2, 'Nisan': 3,
        'Mayıs': 4, 'Haziran': 5, 'Temmuz': 6, 'Ağustos': 7,
        'Eylül': 8, 'Ekim': 9, 'Kasım': 10, 'Aralık': 11,
        // Short forms
        'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3,
        'Jun': 5, 'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
    };
    return months[monthName] !== undefined ? months[monthName] : -1;
}

function updateHarvestingDashboard() {
    const currentHive = getCurrentHive();
    
    if (!currentHive || !currentHive.data) {
        document.getElementById('harvestingMessage').style.display = 'block';
        document.getElementById('harvestingDashboard').style.display = 'none';
        
        // Hide empty chart containers
        hideEmptyChartContainers();
        return;
    }
    
    document.getElementById('harvestingMessage').style.display = 'none';
    document.getElementById('harvestingDashboard').style.display = 'grid';
    
    // Update summary cards
    updateHiveSummary(currentHive);
    
    // Update available species list
    updateAvailableSpeciesList(currentHive);
    
    // Update charts only if there's data
    updateSpeciesChart(currentHive);
    updateHoneyYieldChart(currentHive);
    updateSeasonalHarvestChart(currentHive);
}

function hideEmptyChartContainers() {
    // Hide chart containers when no data
    const speciesAnalysis = document.querySelector('.species-analysis');
    const honeyPrediction = document.querySelector('.honey-prediction');
    const seasonalHarvest = document.querySelector('.seasonal-harvest');
    
    if (speciesAnalysis) speciesAnalysis.style.display = 'none';
    if (honeyPrediction) honeyPrediction.style.display = 'none';
    if (seasonalHarvest) seasonalHarvest.style.display = 'none';
}

function getCurrentHive() {
    if (!currentHiveId) {
        return hives.length > 0 ? hives[hives.length - 1] : null;
    }
    return hives.find(h => h.id === currentHiveId) || null;
}

function updateHiveSummary(hive) {
    const container = document.getElementById('hiveSummary');
    const data = hive.data;
    
    const html = `
        <div class="summary-card">
            <div class="card-label">Hive Name</div>
            <div class="card-value" style="font-size: 1.3rem;">${hive.name}</div>
        </div>
        <div class="summary-card">
            <div class="card-label">Bee Colonies</div>
            <div class="card-value">${hive.beeCount}</div>
        </div>
        <div class="summary-card">
            <div class="card-label">Total Flower Regions</div>
            <div class="card-value">${data.totalFlowers}</div>
        </div>
        <div class="summary-card">
            <div class="card-label">Plant Species</div>
            <div class="card-value">${data.speciesCount}</div>
        </div>
        <div class="summary-card">
            <div class="card-label">Est. Annual Honey Yield</div>
            <div class="card-value">${Math.round(data.totalAnnualYield)} kg</div>
        </div>
        <div class="summary-card">
            <div class="card-label">Best Season</div>
            <div class="card-value">${getBestHarvestSeason(data)}</div>
        </div>
    `;
    
    container.innerHTML = html;
}

function getBestHarvestSeason(data) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const maxYield = Math.max(...data.monthlyYield);
    const bestMonthIndex = data.monthlyYield.indexOf(maxYield);
    return months[bestMonthIndex];
}

function updateSpeciesChart(hive) {
    const container = document.getElementById('speciesChart');
    const data = hive.data;
    
    // Show the container when updating
    const speciesAnalysisDiv = document.querySelector('.species-analysis');
    if (speciesAnalysisDiv) speciesAnalysisDiv.style.display = 'block';
    
    // Create simple bar chart with HTML
    let html = '<div style="padding: 10px;">';
    
    const sortedSpecies = Object.entries(data.speciesDistribution)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10); // Top 10 species
    
    const maxCount = Math.max(...sortedSpecies.map(s => s[1]));
    
    sortedSpecies.forEach(([species, count]) => {
        const percentage = (count / maxCount) * 100;
        const plant = data.speciesData[species];
        const displayName = plant.name.split('(')[0].trim();
        
        html += `
            <div style="margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span style="color: #fff; font-size: 0.9rem;">${displayName}</span>
                    <span style="color: #f39c12; font-weight: bold;">${count} regions</span>
                </div>
                <div style="background: #666; height: 20px; border-radius: 4px; overflow: hidden;">
                    <div style="background: linear-gradient(90deg, #f39c12, #e67e22); width: ${percentage}%; height: 100%; transition: width 0.3s ease;"></div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

function updateHoneyYieldChart(hive) {
    const container = document.getElementById('honeyYieldChart');
    const hiveData = hive.data;
    
    // Show the container when updating
    const honeyPredictionDiv = document.querySelector('.honey-prediction');
    if (honeyPredictionDiv) honeyPredictionDiv.style.display = 'block';
    
    let html = '<div style="padding: 10px;">';
    
    const sortedYield = Object.entries(hiveData.honeyYield)
        .sort((a, b) => b[1].totalYield - a[1].totalYield)
        .slice(0, 10);
    
    const maxYield = Math.max(...sortedYield.map(s => s[1].totalYield));
    
    sortedYield.forEach(([species, data]) => {
        const percentage = (data.totalYield / maxYield) * 100;
        const plant = hiveData.speciesData[species];
        const displayName = plant.name.split('(')[0].trim();
        
        html += `
            <div style="margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span style="color: #fff; font-size: 0.9rem;">${displayName}</span>
                    <span style="color: #27ae60; font-weight: bold;">${Math.round(data.totalYield)} kg/year</span>
                </div>
                <div style="background: #666; height: 20px; border-radius: 4px; overflow: hidden;">
                    <div style="background: linear-gradient(90deg, #27ae60, #2ecc71); width: ${percentage}%; height: 100%; transition: width 0.3s ease;"></div>
                </div>
                <div style="color: #ccc; font-size: 0.8rem; margin-top: 3px;">
                    ${data.regionCount} regions × ${data.yieldPerRegion.toFixed(1)} kg/region (${hive.beeCount} colonies)
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

function updateSeasonalHarvestChart(hive) {
    const container = document.getElementById('seasonalHarvestChart');
    const data = hive.data;
    
    // Show the container when updating
    const seasonalHarvestDiv = document.querySelector('.seasonal-harvest');
    if (seasonalHarvestDiv) seasonalHarvestDiv.style.display = 'block';
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const maxYield = Math.max(...data.monthlyYield);
    
    // Check if there's any data
    if (maxYield === 0) {
        container.innerHTML = '<div style="padding: 20px; text-align: center; color: #ccc;"><i class="fas fa-info-circle"></i> No seasonal flowering data available</div>';
        return;
    }
    
    let html = '<div style="padding: 15px;">';
    html += `<div style="margin-bottom: 20px; padding: 10px; background: rgba(243, 156, 18, 0.1); border-radius: 6px; 
                         color: #f39c12; font-size: 0.85rem; text-align: center; border: 1px solid rgba(243, 156, 18, 0.3);">
                <i class="fas fa-info-circle"></i> Gray bars indicate months with no flowering (0 kg honey)
             </div>`;
    html += '<div style="display: grid; grid-template-columns: repeat(12, 1fr); gap: 8px;">';
    
    data.monthlyYield.forEach((yieldValue, index) => {
        const height = yieldValue > 0 ? Math.max(10, (yieldValue / maxYield) * 100) : 0;
        const isCurrentMonth = new Date().getMonth() === index;
        
        html += `
            <div style="text-align: center; position: relative;">
                <div style="height: 140px; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; position: relative;">
                    ${yieldValue > 0 ? `<div style="position: absolute; bottom: 100%; margin-bottom: 8px;
                                    color: #fff; font-size: 0.75rem; font-weight: bold; white-space: nowrap;
                                    background: rgba(0,0,0,0.6); padding: 2px 6px; border-radius: 4px;">
                            ${Math.round(yieldValue)}kg
                        </div>` : ''}
                    <div style="background: ${isCurrentMonth ? '#f39c12' : (yieldValue > 0 ? 'linear-gradient(180deg, #3498db, #2980b9)' : '#555')}; 
                                width: 100%;
                                height: ${yieldValue > 0 ? height : 3}%; 
                                min-height: ${yieldValue > 0 ? '10px' : '3px'};
                                border-radius: 4px 4px 0 0;
                                transition: all 0.3s ease;
                                opacity: ${yieldValue > 0 ? '1' : '0.3'};
                                box-shadow: ${yieldValue > 0 ? '0 2px 4px rgba(0,0,0,0.2)' : 'none'};">
                    </div>
                </div>
                <div style="color: ${isCurrentMonth ? '#f39c12' : '#ccc'}; 
                            font-size: 0.7rem; 
                            margin-top: 8px;
                            font-weight: ${isCurrentMonth ? 'bold' : 'normal'};">
                    ${months[index]}
                </div>
            </div>
        `;
    });
    
    html += '</div></div>';
    container.innerHTML = html;
}

function updateAvailableSpeciesList(hive) {
    const container = document.getElementById('availableSpeciesList');
    const data = hive.data;
    
    // Get unique species sorted by count
    const sortedSpecies = Object.entries(data.speciesDistribution)
        .sort((a, b) => b[1] - a[1]);
    
    let html = '';
    
    sortedSpecies.forEach(([speciesName, count]) => {
        const plant = data.speciesData[speciesName];
        const displayName = plant.name.split('(')[0].trim();
        const scientificName = plant.scientificName;
        const honeyProduction = plant.characteristics.honeyProduction || 'Medium';
        const honeyScore = plant.characteristics.honeyScore || 5;
        
        // Determine icon color based on honey production
        let iconBg = 'linear-gradient(135deg, #27ae60, #2ecc71)';
        if (honeyScore >= 8) {
            iconBg = 'linear-gradient(135deg, #f39c12, #e67e22)';
        } else if (honeyScore <= 3) {
            iconBg = 'linear-gradient(135deg, #95a5a6, #7f8c8d)';
        }
    
    html += `
            <div class="species-item">
                <div class="species-icon" style="background: ${iconBg};">
                    <i class="fas fa-seedling"></i>
        </div>
                <div class="species-info">
                    <div class="species-name">${displayName}</div>
                    <div class="species-details">
                        <i>${scientificName}</i><br>
                        Honey: ${honeyProduction} | ${count} region${count > 1 ? 's' : ''}
                    </div>
                </div>
                <div class="species-badge">${honeyScore}/10</div>
        </div>
    `;
    });
    
    container.innerHTML = html;
}

function updateHiveSelector() {
    const selector = document.getElementById('hiveSelector');
    if (!selector) return;
    
    selector.innerHTML = '<option value="">-- Select a hive --</option>';
    
    hives.forEach(hive => {
        const option = document.createElement('option');
        option.value = hive.id;
        option.textContent = `${hive.name} (${hive.beeCount} colonies)`;
        if (hive.id === currentHiveId) {
            option.selected = true;
        }
        selector.appendChild(option);
    });
}

function onHiveSelect(event) {
    const selectedId = parseInt(event.target.value);
    if (!selectedId) return;
    
    currentHiveId = selectedId;
    const hive = hives.find(h => h.id === selectedId);
    
    if (hive) {
        // Update bee count input
        document.getElementById('beeColonyCount').value = hive.beeCount;
        
        // Zoom to hive
        if (hive.circle) {
            map.fitBounds(hive.circle.getBounds(), { padding: [50, 50] });
        }
        
        // Update dashboard
        updateHarvestingDashboard();
    }
}

function updateBeeCount() {
    const hive = getCurrentHive();
    if (!hive) return;
    
    const newBeeCount = parseInt(document.getElementById('beeColonyCount').value);
    if (!newBeeCount || newBeeCount < 1) return;
    
    hive.beeCount = newBeeCount;
    
    // Re-analyze with new bee count
    analyzeHive(hive);
    
    // Update selector text
    updateHiveSelector();
}

function showNoFlowersSuggestion(hive) {
    // Find nearest flower-rich area
    const nearestFlower = findNearestFlower(hive.location);
    
    if (!nearestFlower) {
        alert('No flowers found on the map. Please load flower data first.');
        // Remove this hive
        removeHive(hive.id);
        return;
    }
    
    const distance = nearestFlower.distance;
    const plant = nearestFlower.plant;
    
    // Show suggestion modal
    const modal = document.getElementById('hiveSuggestionModal');
    const content = document.getElementById('suggestionContent');
    
    content.innerHTML = `
        <p><strong>Selected area has no flowers within 5km foraging radius.</strong></p>
        <p>The nearest flower region is <strong>${distance.toFixed(2)} km</strong> away.</p>
        <p><strong>Nearest Flower:</strong> ${plant.name}</p>
        <p><strong>Honey Production:</strong> ${plant.characteristics.honeyProduction}</p>
        <p>Would you like to move "${hive.name}" to this flower-rich location?</p>
    `;
    
    // Store both hive and suggested location in window object
    window.tempHiveToMove = hive;
    window.tempSuggestedLocation = nearestFlower.location;
    
    console.log('Suggestion prepared:', {
        hive: hive.name,
        suggested: nearestFlower.location,
        distance: distance
    });
    
    modal.style.display = 'block';
}

function findNearestFlower(fromLocation) {
    if (!fromLocation || plantMarkers.length === 0) return null;
    
    let nearestMarker = null;
    let minDistance = Infinity;
    
    plantMarkers.forEach(marker => {
        const markerLatLng = marker.getLatLng();
        const distance = fromLocation.distanceTo(markerLatLng) / 1000; // km
        
        if (distance < minDistance) {
            minDistance = distance;
            nearestMarker = marker;
        }
    });
    
    if (!nearestMarker) return null;
    
    const plant = plantData.find(p => p.id === nearestMarker.plantId);
    
    return {
        location: nearestMarker.getLatLng(),
        distance: minDistance,
        marker: nearestMarker,
        plant: plant
    };
}

function removeHive(hiveId) {
    const index = hives.findIndex(h => h.id === hiveId);
    if (index === -1) return;
    
    const hive = hives[index];
    
    // Remove from map
    if (hive.marker) map.removeLayer(hive.marker);
    if (hive.circle) map.removeLayer(hive.circle);
    
    // Remove from array
    hives.splice(index, 1);
    
    // Update current if needed
    if (currentHiveId === hiveId) {
        currentHiveId = hives.length > 0 ? hives[0].id : null;
    }
    
    // Update UI
    updateHiveSelector();
    updateHarvestingDashboard();
    
    if (hives.length === 0) {
        document.getElementById('hiveControlsPanel').style.display = 'none';
    }
}

function moveToSuggestedLocation() {
    const modal = document.getElementById('hiveSuggestionModal');
    const hive = window.tempHiveToMove;
    const newLocation = window.tempSuggestedLocation;
    
    console.log('Move button clicked:', { hive, newLocation });
    
    if (!newLocation || !hive) {
        console.error('Missing data:', { newLocation, hive });
        alert('Error: Missing location or hive data. Please try again.');
        modal.style.display = 'none';
        return;
    }
    
    modal.style.display = 'none';
    
    console.log('Moving hive:', hive.name, 'from', hive.location, 'to', newLocation);
    
    // Remove old marker and circle if they exist
    if (hive.marker) {
        map.removeLayer(hive.marker);
        hive.marker = null;
    }
    if (hive.circle) {
        map.removeLayer(hive.circle);
        hive.circle = null;
    }
    
    // Update location
    hive.location = newLocation;
    
    // Place hive at new location
    placeHive(hive);
    
    // Analyze the new location
    analyzeHive(hive);
    
    // Cleanup
    window.tempHiveToMove = null;
    window.tempSuggestedLocation = null;
    
    console.log('Hive successfully moved and analyzed');
}

function cancelSuggestion() {
    const modal = document.getElementById('hiveSuggestionModal');
    const hive = window.tempHiveToMove;
    
    modal.style.display = 'none';
    
    console.log('Suggestion cancelled, removing hive:', hive);
    
    // Remove the hive that had no flowers
    if (hive && hive.id) {
        removeHive(hive.id);
    }
    
    // Cleanup
    window.tempHiveToMove = null;
    window.tempSuggestedLocation = null;
}


// Sayfa kapatılırken temizlik
window.addEventListener('beforeunload', function() {
    if (map) {
        map.remove();
    }
    
    // Chart'ları temizle
    Object.values(phenologyCharts).forEach(chart => {
        if (chart && chart.destroy) {
            chart.destroy();
        }
    });
});

