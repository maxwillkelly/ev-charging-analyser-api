export class BatteryCharge {
  carId: string;
  recordedAt: Date;
  range?: number;
  percentRemaining?: number;
  isPluggedIn?: string;
  state?: string;
}
