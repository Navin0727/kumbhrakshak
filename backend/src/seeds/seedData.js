const mongoose = require('mongoose');
const { env } = require('../config/env');
const SafetyPoi = require('../models/SafetyPoi');
const Temple = require('../models/Temple');
const SafetyAlert = require('../models/SafetyAlert');
const LostPersonCase = require('../models/LostPersonCase');
const WaterStation = require('../models/WaterStation');
const DroneUnit = require('../models/DroneUnit');
const ShuttleRoute = require('../models/ShuttleRoute');
const FoodService = require('../models/FoodService');

const POIS = [
  {
    name: 'Civil Hospital Nashik',
    category: 'hospital',
    sector: 'Sector 4',
    area: 'PANCHAVATI',
    distanceKm: 1.2,
    openStatus: 'Open 24/7',
    phone: '+91 253 257 6000',
    address: 'Near Old Agra Road, Panchavati, Nashik',
    coordinates: { x: 58, y: 38 },
    is24x7: true,
    facilities: ['Emergency Trauma Care', 'ICU', 'Blood Bank', 'Free Pilgrim Clinic', 'Ambulance Bay'],
  },
  {
    name: 'Panchavati Police Station & Rapid Desk',
    category: 'police',
    sector: 'Sector 4',
    area: 'PANCHAVATI',
    distanceKm: 0.6,
    openStatus: 'Open 24/7',
    phone: '+91 253 251 2233',
    address: 'Opposite Godavari Ghat, Panchavati',
    coordinates: { x: 34, y: 53 },
    is24x7: true,
    facilities: ['Lost & Found Registration', 'Crowd Control Command', 'Women & Child Helpdesk', 'First Aid'],
  },
  {
    name: 'Bharat Petroleum & Quick EV Hub',
    category: 'petrol',
    sector: 'Sector 2',
    area: 'NASHIK',
    distanceKm: 1.8,
    openStatus: 'Open 24/7',
    phone: '+91 253 250 1199',
    address: 'Dindori Road, Near Mharsul, Nashik',
    coordinates: { x: 20, y: 28 },
    is24x7: true,
    facilities: ['Petrol/Diesel', 'Air/Nitrogen', 'Restroom', 'Free Drinking Water'],
  },
];

const TEMPLES = [
  {
    name: 'Kalaram Temple',
    location: 'Panchavati, Nashik',
    area: 'PANCHAVATI',
    distanceKm: 1.2,
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZ_KPmw3CvSXi4TKjB2Ug_u9gcyQlyyBABf6jWECes6ctQ2169LQXBJcmUDe4S0X3bWTgVM4EFQDarb4IyY2GmaDNxshazyQLkrfdkEiVTS-azIhUe44DtyTrRHFpSY51_abQZghh8yCLGihQolNCt6RvjfrQUjtpaLsAHsY4Q1G4P6SQQ1_8uDRbLg-FCIsgBZWEuCfGKXu5fZR9PHs6Yv3YgXXY9mJ8l1_81Ogfi00H1d747JnN8Fg',
    photoCredit: 'Photo: Nashik District Government',
    isOpen: true,
    statusLabel: 'Open Now',
    nextAarti: '7:00 PM',
    mahaAartiTime: '7:00 PM',
    description: 'An ancient temple dedicated to Lord Rama carved out of black stone.',
    darshanTimings: '5:00 AM – 10:00 PM (Daily)',
    aartiSchedule: [
      { name: 'Kakad Aarti', time: '05:30 AM', crowdLevel: 'Safe', description: 'Early morning holy awakening' },
      { name: 'Sandhya Maha Aarti', time: '07:00 PM', crowdLevel: 'Moderate', description: 'Grand evening lamp Aarti' },
    ],
    guidelines: ['Keep phones silent in inner sanctum', 'Special queue for elderly at North Gate 2'],
  },
];

const ALERTS = [
  {
    title: 'Safe Crowd Levels at Godavari Ghats',
    severity: 'safe',
    category: 'CROWD',
    location: 'Ramkund & Laxman Ghat',
    timeAgo: '12 mins ago',
    message: 'Current crowd density at Ramkund is currently within optimal green thresholds.',
    actionGuidance: 'Pilgrims may proceed for evening holy dip with regular queuing.',
    verifiedSource: 'Nashik Police Mela Control Room',
  },
  {
    title: 'Goda Maha Aarti Crowd Advisory',
    severity: 'warning',
    category: 'AARTI',
    location: 'Goda Ghat Sector 4',
    timeAgo: '45 mins ago',
    message: 'Large congregation anticipated for 06:30 PM Goda Maha Aarti.',
    actionGuidance: 'Please keep children close and follow marshals in neon vests.',
    verifiedSource: 'Mela Administrative Authority',
  },
];

const CASES = [
  {
    personName: 'Aarav Deshmukh',
    age: 7,
    gender: 'Child',
    lastSeenLocation: 'Near Ramkund Step 14 (Panchavati)',
    lastSeenTime: 'Today, 03:15 PM',
    clothing: 'Yellow Kurta and Blue Jeans',
    guardianName: 'Suresh Deshmukh',
    guardianContact: '+91 98234 11223',
    photoUrl: '',
    status: 'MISSING',
    notes: 'Speaks Marathi & Hindi. Volunteers and Drone Surveillance active.',
  },
];

const WATER_STATIONS = [
  {
    name: 'Ramkund Jal Seva Booth #4',
    location: 'Ramkund Main Snan Ghat Entry, Step 3',
    sector: 'Sector 4',
    area: 'RAMKUND',
    distanceKm: 0.3,
    type: 'Chilled RO',
    tankLevelPercent: 92,
    dispensersCount: 8,
    queueWaitMins: 1,
    isOperating: true,
    refilledAtAgo: '15 mins ago',
    managedBy: 'NMC Jal Vibhag & Red Cross',
    coordinates: { x: 51, y: 49 },
  },
];

const DRONES = [
  {
    name: 'Garuda-1 River Rescue Drone',
    callSign: 'GARUDA-01',
    unitType: 'Lifebuoy Drop & Water Rescue',
    sector: 'Sector 4 (Ramkund Basin)',
    currentZone: 'Above Ramkund Step 8 to Ahilyabai Bridge',
    status: 'PATROLLING',
    batteryPercent: 86,
    altitudeMeters: 45,
    speedKmh: 28,
    distanceKm: 0.4,
    payloadEquipped: '2x Self-Inflatable U-Lifebuoys',
    cameraFeedStatus: 'HD LIVE 60FPS',
    lastPatrolPing: 'Active just now',
    coordinates: { x: 49, y: 44 },
  },
];

const SHUTTLES = [
  {
    routeNumber: 'Route 4A (Green Corridor)',
    routeName: 'CBS Express to Ramkund Ghat',
    from: 'Central Bus Stand (Old CBS)',
    to: 'Ramkund Ghat North Parking',
    area: 'RAMKUND',
    operatingHours: '04:00 AM – 11:30 PM',
    frequencyMins: 4,
    fare: 'Free Pilgrim Seva (₹0)',
    activeBusesCount: 8,
    stops: ['Central Bus Stand', 'Dwarka Circle', 'Malegaon Stand', 'Ramkund Gate 1'],
    coordinates: { x: 44, y: 52 },
    vehicles: [
      {
        vehicleId: 'EV-401',
        vehicleNumber: 'MH-15-EV-8821',
        driverName: 'Sambhaji Patil',
        driverPhone: '+91 98221 44550',
        currentStop: 'Malegaon Stand',
        nextStop: 'Ramkund Gate 1',
        etaMins: 3,
        occupancy: 12,
        totalSeats: 22,
        isElectric: true,
        isWheelchairAccessible: true,
        speedKmh: 24,
      },
    ],
  },
];

const FOOD = [
  {
    name: 'Maha Prasad Annakshetra Bhawan',
    type: 'Maha Prasad Annakshetra',
    organizer: 'Nashik Kumbhmela 2027 Maha Samiti',
    area: 'PANCHAVATI',
    location: 'Opposite Kalaram Temple East Gate',
    distanceKm: 0.6,
    currentStatus: 'Serving Now',
    mealTimings: '11:00 AM – 03:30 PM & 06:30 PM – 10:00 PM',
    todayMenu: ['Ghee Moong Dal Khichdi', 'Badam Sheera Prasad'],
    queueWaitMins: 4,
    mealsServedToday: 18450,
    isFree: true,
    fssaiCertified: true,
    cleanlinessRating: 4.9,
    coordinates: { x: 59, y: 41 },
  },
];

async function seed() {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    await SafetyPoi.deleteMany({});
    await Temple.deleteMany({});
    await SafetyAlert.deleteMany({});
    await LostPersonCase.deleteMany({});
    await WaterStation.deleteMany({});
    await DroneUnit.deleteMany({});
    await ShuttleRoute.deleteMany({});
    await FoodService.deleteMany({});

    await SafetyPoi.insertMany(POIS);
    await Temple.insertMany(TEMPLES);
    await SafetyAlert.insertMany(ALERTS);
    await LostPersonCase.insertMany(CASES);
    await WaterStation.insertMany(WATER_STATIONS);
    await DroneUnit.insertMany(DRONES);
    await ShuttleRoute.insertMany(SHUTTLES);
    await FoodService.insertMany(FOOD);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  seed();
}

module.exports = { seed };
