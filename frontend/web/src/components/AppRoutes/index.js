import { Route, Routes } from "react-router-dom";
import Dashboard from "../../pages/Dashboard";
import Menu from "../../pages/Menu";
import Orders from "../../pages/Orders";
import Ratings from "../../pages/Ratings";
import Staffs from "../../pages/Staffs";
import Times from "../../pages/Times";
const AppRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Dashboard />}></Route>
        <Route path="/orders" element={<Orders />}></Route>
        <Route path="/menu" element={<Menu />}></Route>
        <Route path="/times" element={<Times />}></Route>
        <Route path="/staffs" element={<Staffs />}></Route>
        <Route path="/ratings" element={<Ratings />}></Route>
      </Routes>
    </div>
  );
};

export default AppRoutes;
