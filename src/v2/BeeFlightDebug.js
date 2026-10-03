// Loaded only by the explicit ?beeDebug=1 development/review URL.
import React,{useState} from 'react';
import {sampleDistance,sampleFlight} from './beeFlight';
const colors={A:'#087e8b',B:'#2255aa',C:'#b41596',D:'#cf5414',E:'#167436'};
const box=(r,color,key,pad=0)=><rect key={key} x={r.left-pad} y={r.top-pad} width={r.width+2*pad} height={r.height+2*pad} fill="none" stroke={color} strokeDasharray={pad?'3 3':undefined}/>;
export default function BeeFlightDebug({view,controller}) {
  const [overlay,setOverlay]=useState(true),[compact,setCompact]=useState(false);
  const route=view.route,m=route&&route.measurements;
  const diagnostics={status:view.status,time:view.time,speed:view.speed,conflicts:view.conflicts,measurements:m,route:route&&route.diagnostics,pose:view.pose};
  return <div data-bee-debug="true">
    {overlay&&route&&route.ok?<svg className="v2-bee-debug-svg" aria-hidden="true" style={{position:'absolute',left:0,top:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:7}} viewBox={`0 0 ${m.hero.width} ${m.hero.height}`}>
      <defs>{Object.keys(colors).map(id=><marker key={id} id={`bee-arrow-${id}`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8" fill={colors[id]}/></marker>)}</defs>
      {m.lines.map((r,i)=>box(r,'#222',`H${i}`))}{m.jasonFragments.map((r,i)=>box(r,'#b41596',`J${i}`))}{m.taglineRects.map((r,i)=>box(r,'#167436',`G${i}`))}
      {[...m.lines,...m.taglineRects].map((r,i)=>box(r,'#999',`s${i}`,route.r+route.gap))}{m.eyebrow&&box(m.eyebrow,'#777','eyebrow')}{m.art&&box(m.art,'#c00','art')}{box(m.actions,'#c00','cta')}
      {route.segments.map((s,i)=><g key={i}>
        <path d={`M${s.p0.x} ${s.p0.y}C${s.p1.x} ${s.p1.y},${s.p2.x} ${s.p2.y},${s.p3.x} ${s.p3.y}`} fill="none" stroke={colors[s.phase]} strokeWidth="1.6" markerEnd={`url(#bee-arrow-${s.phase})`}/>
        <path d={`M${s.p0.x} ${s.p0.y}L${s.p1.x} ${s.p1.y}M${s.p2.x} ${s.p2.y}L${s.p3.x} ${s.p3.y}`} fill="none" stroke="#888" strokeWidth=".6"/>
        {[s.p0,s.p1,s.p2,s.p3].map((p,j)=><circle key={j} cx={p.x} cy={p.y} r={j===0||j===3?2.2:1.3} fill={colors[s.phase]}/>)}</g>)}
      {Array.from({length:21},(_,i)=>sampleDistance(route,route.length*i/20)).map((p,i)=><circle key={`d${i}`} cx={p.x} cy={p.y} r="3.1" fill="#fff" stroke="#111"/>)}
      {Array.from({length:19},(_,i)=>sampleFlight(route,route.duration*i/18)).map((p,i)=><rect key={`t${i}`} x={p.x-2} y={p.y-2} width="4" height="4" fill="#e11"/>)}
    </svg>:null}
    <aside style={{position:'fixed',zIndex:100,bottom:8,right:8,maxWidth:'min(28rem,94vw)',maxHeight:'42vh',overflow:'auto',background:'#fff',color:'#222',padding:12,border:'1px solid #555',fontSize:12}} aria-label="Bee animation debug controls">
      <label><input type="checkbox" checked={overlay} onChange={e=>setOverlay(e.target.checked)}/> Show route overlay</label> <button onClick={()=>setCompact(!compact)}>{compact?'Expand debug':'Compact debug'}</button>
      <label>Timeline {view.time.toFixed(2)}s <input aria-label="Bee timeline" type="range" min="0" max={(route&&route.duration)||9} step=".01" value={view.time} onChange={e=>controller.scrub(Number(e.target.value))}/></label>
      <button onClick={()=>controller.resume()}>Play</button><button onClick={()=>controller.pause()}>Pause</button><button onClick={()=>controller.replay()}>Replay</button>
      <button onClick={()=>controller.speed(1)}>Normal speed</button><button onClick={()=>controller.speed(.25)}>0.25 speed</button>
      <p hidden={compact}>Circles: equal distance. Red squares: equal time. A–E colors show phases.</p>
      <pre hidden={compact} id="bee-flight-diagnostics" style={{whiteSpace:'pre-wrap'}}>{JSON.stringify(diagnostics,null,2)}</pre>
    </aside>
  </div>;
}
