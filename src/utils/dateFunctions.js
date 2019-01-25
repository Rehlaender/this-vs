export const getToday = () => {
  const today = new Date();
  return `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
}

export const getTodayAsUUIDString = () => {
  const today = new Date();
  return `${today.getMonth() + 1}${today.getDate()}${today.getFullYear()}`;
}
