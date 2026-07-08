export const USER_ROLES = ["user", "customer"];

export const getRoleHome = (role) => {
  if (role === "admin") return "/admin";
  if (role === "delivery") return "/delivery";
  return "/";
};
