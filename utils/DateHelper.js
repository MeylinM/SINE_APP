export const getCurrentDateTime = () => {
  const now = new Date();
  return now.toLocaleString(); // Devuelve la fecha y hora en formato local
};
