export interface Feature {
  id?: string; // Optional, if you want to store the document ID
  feature: string;
  free: boolean;
  premium: boolean;
  order?: number;
}
