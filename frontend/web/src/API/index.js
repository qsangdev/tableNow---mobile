export const getBills = () => {
  return fetch("http://localhost:3000/bills").then((res) => res.json());
};

export const getMenu = () => {
  return fetch("http://localhost:3000/menu").then((res) => res.json());
};

export const getStaffs = () => {
  return fetch("http://localhost:3000/staffs").then((res) => res.json());
};

export const getDashboard = () => {
  return fetch("http://localhost:3000/profile").then((res) => res.json());
};

export const getTimes = () => {
  return fetch("http://localhost:3000/times").then((res) => res.json());
};

export const getRating = () => {
  return fetch("http://localhost:3000/rate").then((res) => res.json());
};
