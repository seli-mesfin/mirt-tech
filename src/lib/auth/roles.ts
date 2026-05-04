import type { UserRole } from "@/lib/auth/types";

/**
 * Global route mapping for ምርት tech user roles.
 */
export const ROLE_ROUTES: Record<UserRole, string> = {
  admin: "/dashboard/admin",
  farmer: "/dashboard/farmer",
  exporter: "/dashboard/exporter",
};

/**
 * Returns the destination path for a specific user role.
 */
export function getRoleRoute(role: UserRole) {
  return ROLE_ROUTES[role] || "/auth/login";
}