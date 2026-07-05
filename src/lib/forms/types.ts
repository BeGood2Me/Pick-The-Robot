import type {
  AcquisitionModel,
  BudgetPreference,
  CleaningProfile,
  RestaurantProfile,
  RobotCategory,
  StaffingPressure,
  TechReadiness,
  WarehouseProfile,
} from '../matching/types';



/** Shared fields collected on every category wizard. */

export interface BaseFormAnswers {

  laborCostPerHour: number;

  hoursPerDay: number;

  daysPerWeek: number;

  staffingPressure: StaffingPressure;

  budgetPreference: BudgetPreference;

  acquisitionPreference: AcquisitionModel | 'open';

  techReadiness: TechReadiness;

  region?: string;

}



export interface WarehouseFormAnswers extends BaseFormAnswers {

  category: 'warehouse';

  facilitySizeSqM: number;

  ordersPerDay: number;

  picksPerDay: number;

  mainPainPoint: WarehouseProfile['mainPainPoint'];

  loadType: WarehouseProfile['loadType'];

  layoutStability: WarehouseProfile['layoutStability'];

  aisleConstraints: WarehouseProfile['aisleConstraints'];

  wmsReadiness: WarehouseProfile['wmsReadiness'];

  temperatureZone: WarehouseProfile['temperatureZone'];

}



export interface CleaningFormAnswers extends BaseFormAnswers {

  category: 'cleaning';

  floorAreaSqM: number;

  environmentType: CleaningProfile['environmentType'];

  cleaningFrequencyPerDay: number;

  messLevel: CleaningProfile['messLevel'];

  obstacleComplexity: CleaningProfile['obstacleComplexity'];

  cleaningType: CleaningProfile['cleaningType'];

  staffAssignedToCleaning: number;

  floorSurface: CleaningProfile['floorSurface'];

  cleaningLaborCostPerHour: number;

}



export interface RestaurantFormAnswers extends BaseFormAnswers {

  category: 'restaurant';

  venueType: RestaurantProfile['venueType'];

  seatsPerDay: number;

  peakHoursPerDay: number;

  mainPainPoint: RestaurantProfile['mainPainPoint'];

  layoutComplexity: RestaurantProfile['layoutComplexity'];

  aisleWidth: RestaurantProfile['aisleWidth'];

  serviceIntensity: RestaurantProfile['serviceIntensity'];

  tableCount: number;

}



export type FormAnswers = WarehouseFormAnswers | CleaningFormAnswers | RestaurantFormAnswers;



export type FormAnswersForCategory<C extends RobotCategory> = Extract<
  FormAnswers,
  { category: C }
>;

/** Wizard state before all fields are filled. */
export type WizardAnswers = Partial<FormAnswers> & { category: RobotCategory };

