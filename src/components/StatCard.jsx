import { Activity, AlertTriangle, ShieldCheck, Siren, ShieldAlert } from "lucide-react";
const icons={Activity,AlertTriangle,ShieldCheck,Siren,ShieldAlert};
export default function StatCard({title,value,icon="Activity",tone=""}) {
 const I=icons[icon]||Activity;
 return <div className={`stat-card ${tone}`}><div className="stat-icon"><I size={20}/></div><div><span>{title}</span><strong>{value}</strong></div></div>
}
