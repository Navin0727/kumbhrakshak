export type Language = 'en' | 'hi' | 'mr' | 'gu' | 'sa';

export interface UserProfile {
  id: string;
  fullName: string;
  phoneNumber: string;
  ageGroup: '18-30' | '31-50' | '51-65' | '65+' | '';
  language: Language;
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'Unknown';
  allergies: string;
  medicalConditions: string;
  currentMedications: string;
  mobilityAssistance: boolean;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: 'Spouse' | 'Parent' | 'Child' | 'Sibling' | 'Friend' | 'Other' | '';
  };
  pilgrimId: string;
  isRegistered: boolean;
  emergencyQrCode: string;
}

export type PoiCategory = 'hospital' | 'police' | 'petrol' | 'booth' | 'ghat' | 'water' | 'drone' | 'shuttle' | 'food';

export interface WaterStation {
  id: string;
  name: string;
  location: string;
  sector: string;
  area: 'NASHIK' | 'PANCHAVATI' | 'TRIMBAKESHWAR' | 'RAMKUND' | 'TAPOVAN';
  distanceKm: number;
  type: 'Chilled RO' | 'Electrolyte ORS + RO' | 'Normal Purified' | 'Mineral Kiosk';
  tankLevelPercent: number; // e.g. 88%
  dispensersCount: number;
  queueWaitMins: number;
  isOperating: boolean;
  refilledAtAgo: string;
  managedBy: string;
  coordinates: { x: number; y: number };
}

export interface DroneRescueUnit {
  id: string;
  name: string;
  callSign: string;
  unitType: 'Lifebuoy Drop & Water Rescue' | 'River Bank Surveillance' | 'Thermal Missing Search' | 'First-Aid Kit Airborne Delivery';
  sector: string;
  currentZone: string;
  status: 'PATROLLING' | 'STANDBY' | 'MISSION_ACTIVE' | 'RETURNING';
  batteryPercent: number;
  altitudeMeters: number;
  speedKmh: number;
  distanceKm: number;
  payloadEquipped: string;
  cameraFeedStatus: 'HD LIVE 60FPS' | 'INFRARED NIGHT' | 'THERMAL SCAN';
  lastPatrolPing: string;
  coordinates: { x: number; y: number };
}

export interface ShuttleVehicle {
  id: string;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  currentStop: string;
  nextStop: string;
  etaMins: number;
  occupancy: number;
  totalSeats: number;
  isElectric: boolean;
  isWheelchairAccessible: boolean;
  speedKmh: number;
}

export interface ShuttleRoute {
  id: string;
  routeNumber: string;
  routeName: string;
  from: string;
  to: string;
  area: 'NASHIK' | 'PANCHAVATI' | 'TRIMBAKESHWAR' | 'RAMKUND' | 'TAPOVAN';
  operatingHours: string;
  frequencyMins: number;
  fare: string; // e.g. "Free Pilgrim Seva"
  activeBusesCount: number;
  stops: string[];
  vehicles: ShuttleVehicle[];
  coordinates: { x: number; y: number };
}

export interface FoodService {
  id: string;
  name: string;
  type: 'Maha Prasad Annakshetra' | 'Free Seva Langar' | 'Pilgrim Dining Hall' | 'Sadhus & Senior Bhojanalaya';
  organizer: string;
  area: 'NASHIK' | 'PANCHAVATI' | 'TRIMBAKESHWAR' | 'RAMKUND' | 'TAPOVAN';
  location: string;
  distanceKm: number;
  currentStatus: 'Serving Now' | 'Next Batch in 15m' | 'Evening Dinner Preps';
  mealTimings: string;
  todayMenu: string[];
  queueWaitMins: number;
  mealsServedToday: number;
  isFree: boolean;
  fssaiCertified: boolean;
  cleanlinessRating: number; // out of 5
  coordinates: { x: number; y: number };
}

export interface SafetyPoi {
  id: string;
  name: string;
  category: PoiCategory;
  sector: string;
  area: 'NASHIK' | 'PANCHAVATI' | 'TRIMBAKESHWAR' | 'RAMKUND' | 'TAPOVAN';
  distanceKm: number;
  openStatus: string;
  phone: string;
  address: string;
  coordinates: { x: number; y: number }; // percentage on custom map
  is24x7: boolean;
  facilities?: string[];
}

export interface AartiItem {
  name: string;
  time: string;
  description: string;
  crowdLevel: 'Safe' | 'Moderate' | 'Heavy';
}

export interface Temple {
  id: string;
  name: string;
  location: string;
  area: string;
  distanceKm: number;
  photoUrl: string;
  photoCredit: string;
  isOpen: boolean;
  statusLabel: string;
  nextAarti: string;
  mahaAartiTime?: string;
  description: string;
  aartiSchedule: AartiItem[];
  darshanTimings: string;
  guidelines: string[];
}

export type AlertSeverity = 'critical' | 'warning' | 'info' | 'safe';

export interface SafetyAlert {
  id: string;
  title: string;
  severity: AlertSeverity;
  category: 'CROWD' | 'TRAFFIC' | 'WEATHER' | 'AARTI' | 'MEDICAL';
  location: string;
  timeAgo: string;
  message: string;
  actionGuidance?: string;
  verifiedSource: string;
}

export interface LostPersonCase {
  id: string;
  personName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Child';
  lastSeenLocation: string;
  lastSeenTime: string;
  clothing: string;
  guardianName: string;
  guardianContact: string;
  photoUrl: string;
  status: 'MISSING' | 'INVESTIGATING' | 'REUNITED';
  notes: string;
}

export interface EmergencySOSDispatch {
  incidentId: string;
  timestamp: string;
  status: 'PENDING' | 'DISPATCHED' | 'ARRIVED' | 'RESOLVED';
  responderSector: string;
  eta: string;
  location: string;
}
