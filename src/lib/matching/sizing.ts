import type { UserProfile } from './types';

/** Qualitative fleet sizing — not a dollar ROI estimate. */
export function getFleetSizingHint(profile: UserProfile, robotType: string): string | undefined {
  switch (profile.category) {
    case 'warehouse': {
      const { facilitySizeSqM, ordersPerDay } = profile;
      if (robotType === 'amr' || robotType === 'agv') {
        if (facilitySizeSqM < 3000) return 'Typical starting point: 1–2 mobile robots for a pilot.';
        if (ordersPerDay < 800) return 'Typical starting point: 2–3 mobile robots as utilization grows.';
        return 'Typical starting point: 3–8+ mobile robots depending on shift coverage and routes.';
      }
      if (robotType === 'picking_assist') {
        return 'Typical starting point: 5–15 pick-assist units per active pick zone — confirm with vendor site survey.';
      }
      if (robotType === 'pallet_mover') {
        return 'Typical starting point: 1–3 pallet movers for dedicated lanes — scale with shift overlap.';
      }
      return undefined;
    }
    case 'cleaning': {
      const area = profile.floorAreaSqM;
      const robots = Math.max(1, Math.ceil(area / 2000));
      return `Rule of thumb: ~1 robot per 1,500–2,500 m² (${robots} robot${robots > 1 ? 's' : ''} for your floor area). Validate coverage with a site walk.`;
    }
    case 'restaurant': {
      if (robotType === 'serving_robot' || robotType === 'bussing_robot') {
        const peakCoversPerHour = Math.round(profile.seatsPerDay / Math.max(profile.peakHoursPerDay, 1));
        const units = Math.max(1, Math.ceil(peakCoversPerHour / 50));
        return `Rule of thumb: ~1 front-of-house robot per 40–60 peak covers/hour (~${units} for your peak load). Pilot one unit first.`;
      }
      if (robotType === 'kitchen_automation') {
        return 'Kitchen automation is station-specific — start with one bottleneck station (e.g. fryer or drink) before expanding.';
      }
      if (robotType === 'reception_robot') {
        return 'Typical starting point: 1 reception robot at the main entry — add units only for multi-entrance venues.';
      }
      return undefined;
    }
  }
}

export function fleetSizingDisclaimer(): string {
  return 'Sizing guidance is illustrative only — not a quote or ROI guarantee. Confirm fleet size with vendors after a site assessment.';
}
