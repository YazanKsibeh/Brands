/**
 * Brand entity definitions for the LocalStyle application
 * Defines brand data structures and related types
 */

export interface Brand {
  id: string;
  name: string;
  logoUrl: string;
  bio: string;
  contactInfo: {
    email: string;
    phone: string;
    website: string;
  };
}