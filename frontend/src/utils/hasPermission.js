export const hasPermission = (perm) => {
  try {
    const permissions =
      JSON.parse(localStorage.getItem("permissions")) || [];
    return permissions.includes(perm);
  } catch {
    return false;
  }
};
