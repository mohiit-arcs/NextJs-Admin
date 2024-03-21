export interface TokenData {
  id: number;
  email: string;
  role?: {
    name: string;
    slug: string;
  };
}
