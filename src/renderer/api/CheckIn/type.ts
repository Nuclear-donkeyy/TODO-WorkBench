export interface CheckInTask {
  id: string;
  title: string;
  description: string;
  isCheckedIn: boolean;
  checkedInAt?: string;
  streak: number;
}
export interface DeleteCheckInTaskParam {
  id: string;
}
export interface CheckInTaskParam {
  id: string;
}

export interface ResetCheckInTaskParam {
  id: string;
}

export interface UpdateCheckInTaskParam {
  id: string;
  title: string;
  description: string;
}

export interface AddCheckInTaskParam {
  id: string;
  title: string;
  description: string;
  isCheckIn: boolean;
  streak: number;
}
