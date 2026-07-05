import type { AcquisitionModel, RobotType } from './types';

export const ROBOT_TYPE_LABELS: Record<RobotType, string> = {
  amr: 'AMR (autonomous mobile robot)',
  agv: 'AGV (automated guided vehicle)',
  picking_assist: 'picking assist robot',
  pallet_mover: 'pallet mover',
  office_cleaner: 'office cleaning robot',
  large_scrubber: 'large-area scrubber robot',
  industrial_cleaner: 'industrial cleaning robot',
  serving_robot: 'serving robot',
  bussing_robot: 'bussing robot',
  kitchen_automation: 'kitchen automation system',
  reception_robot: 'reception and guest-guidance robot',
};

export const ACQUISITION_LABELS: Record<AcquisitionModel, string> = {
  buy: 'outright purchase',
  lease: 'equipment lease',
  raas: 'Robotics-as-a-Service (RaaS)',
};
