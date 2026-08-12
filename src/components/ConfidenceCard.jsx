export default function ConfidenceCard({value=0}) {
 const radius=48, circumference=2*Math.PI*radius, offset=circumference-(value/100)*circumference;
 return <div className="confidence-card"><div className="ring"><svg width="120" height="120"><circle className="ring-bg" cx="60" cy="60" r={radius}/><circle className="ring-value" cx="60" cy="60" r={radius} strokeDasharray={circumference} strokeDashoffset={offset}/></svg><b>{value}%</b></div><div><span>Detection confidence</span><p>Normalized model + rule evidence. Not an attack probability.</p></div></div>
}
