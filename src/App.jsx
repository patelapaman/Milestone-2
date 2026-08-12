import { NavLink,Routes,Route } from "react-router-dom";
import { Shield,Radio,ScanSearch } from "lucide-react";
import Dashboard from "./pages/Dashboard";
import EventDetails from "./pages/EventDetails";
import LivePrediction from "./pages/LivePrediction";
export default function App(){
 return <><nav className="side-nav"><div className="nav-logo"><Shield/></div><NavLink to="/" end title="Dashboard"><Radio/></NavLink><NavLink to="/live" title="Live Prediction"><ScanSearch/></NavLink></nav><Routes><Route path="/" element={<Dashboard/>}/><Route path="/events/:id" element={<EventDetails/>}/><Route path="/live" element={<LivePrediction/>}/></Routes></>
}
