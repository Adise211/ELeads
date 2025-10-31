export interface SuccessResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface ErrorResponse {
  success: boolean;
  status: string;
  message: string;
  error?: any;
  stack?: string;
}

export type FeatureBadgeType = "Soon" | "New" | "Alpha" | "Beta";
