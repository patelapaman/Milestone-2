export default function ConfidenceCard({value=0}) {
 const radius=48, circumference=2*Math.PI*radius, offset=circumference-(value/100)*circumference;
 return <div className="m2-confidence-card"><div className="m2-ring"><svg width="120" height="120"><circle className="m2-ring-bg" cx="60" cy="60" r={radius}/><circle className="m2-ring-value" cx="60" cy="60" r={radius} strokeDasharray={circumference} strokeDashoffset={offset}/></svg><b>{value}%</b></div><div><span>Detection confidence</span><p>Normalized model + rule evidence. Not an attack probability.</p></div></div>
}
