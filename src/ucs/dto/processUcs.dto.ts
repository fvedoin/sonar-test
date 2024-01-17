export class ProcessUcsDto {
  clientId: string;
  transformerId: string | null;
  transformer: string;
  billingGroup: number;
  location: { type: string; coordinates: number[] };
  routeCode: number;
  ucCode: string;
  ucNumber: string;
  ucClass: string;
  group: string;
  subClass: string;
  subGroup: string;
  sequence: string;
  phases: string;
  circuitBreaker: number;
  microgeneration: boolean;
  city: string;
  district: string;
  timeZone: string;
}
