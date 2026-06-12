export interface AdminStats {
  totalUsers: number;
  totalDocs: number;
  totalFeedbacks: number;
  totalViews: number;
  userGrowth: number[];
}

export interface UserAdmin {
  id: string;
  fullName: string;
  email: string;
  role: 'admin' | 'student' | 'teacher';
  joinedDate: string;
  status: 'active' | 'blocked' | 'pending';
  avatar?: string;
}

export interface SystemSettings {
  appName: string;
  logoUrl?: string;
  adminEmail: string;
}
