import { Activity, AlertTriangle, ShieldCheck, Siren, ShieldAlert } from "lucide-react";
const icons={Activity,AlertTriangle,ShieldCheck,Siren,ShieldAlert};
export default function StatCard({title,value,icon="Activity",tone=""}) {
 const I=icons[icon]||Activity;
 return <div className={`m2-stat-card m2-${tone}`}><div className="m2-stat-icon"><I size={20}/></div><div><span>{title}</span><strong>{value}</strong></div></div>
}
