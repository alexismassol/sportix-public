export interface SportEvent {
  id: string;
  title: string;
  sportType: string;
  date: string;
  location: string;
  clubName: string;
  ticketsSold: number;
  maxCapacity: number;
  price: number;
  status: 'upcoming' | 'live' | 'completed';
  description?: string;
  imageUrl?: string;
}

export interface DashboardStats {
  ticketsBought: number;
  eventsAttended: number;
  creditsBalance: number;
  loyaltyPoints: number;
}

export type GlobalStats = Record<string, { value: number; label: string }>;

export interface ScanResult {
  status: 'valid' | 'already_scanned' | 'refunded' | 'invalid' | 'insufficient';
  message: string;
  ticketId?: string;
  holderName?: string;
  seatInfo?: string;
  scannedAt?: string;
  previousBalance?: number;
  newBalance?: number;
  amount?: number;
  currentBalance?: number;
  requiredAmount?: number;
}
