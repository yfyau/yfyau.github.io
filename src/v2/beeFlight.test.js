import {buildFlightPath,buildResizeBridge,cubicPoint,cubicTangent,sampleDistance,sampleFlight} from './beeFlight';
const rect=(left,top,width,height)=>({left,top,right:left+width,bottom:top+height,width,height});
const fixture=(wide=false)=>wide?{
  hero:{width:1425,height:800},world:{left:0,top:76},bee:{width:62.7125,height:50.175},P:{x:426,y:511},
  lines:[rect(86,206,270,144.8),rect(86,326,480,144.8)],jasonFragments:[rect(86,326,273.7,144.8)],
  taglineRects:[rect(86,500,300,27.2)],eyebrow:rect(86,170,261,13.6),actions:rect(86,568,540,55),art:rect(740,130,544,544)
}:{hero:{width:305,height:1000},world:{left:0,top:121},bee:{width:49.275,height:39.4125},P:{x:108,y:256},
  lines:[rect(20,64,245,67.2),rect(20,120,250,67.2)],jasonFragments:[rect(20,120,135,67.2)],
  taglineRects:[rect(20,216,176,21),rect(20,244,60,21)],eyebrow:rect(20,32,260,15),actions:rect(20,310,265,90),art:rect(20,420,265,265)};
const build=m=>buildFlightPath({headerBottom:0},m);
it.each([false,true])('keeps compact measured rows and a complete four-quarter Jason orbit, wide=%s',wide=>{
  const m=fixture(wide),r=build(m);expect(r.ok).toBe(true);
  const j=m.jasonFragments[0],c=r.segments.filter(s=>s.phase==='C'),o=r.innerOrbit;
  expect(c).toHaveLength(4);expect(r.segments).toHaveLength(11);
  expect(c[c.length-1].p3).toEqual(c[0].p0);
  expect(o.cx).toBeCloseTo((j.left+j.right)/2,8);expect(o.cy).toBeCloseTo((j.top+j.bottom)/2,8);
  expect(c.map(s=>s.depth)).toEqual(['front','front','back','back']);
  expect(c[0].p3).toEqual({x:o.cx,y:o.bottom});expect(c[1].p3).toEqual({x:o.right,y:o.cy});
  expect(c[2].p3).toEqual({x:o.cx,y:o.top});expect(c[3].p3).toEqual({x:o.left,y:o.cy});
  // Deliberate glyph intersections do not create fake whitespace or block flight.
  expect(r.diagnostics.minimumClearance).toBeLessThan(0);
  expect(r.diagnostics.violations.length).toBeGreaterThan(0);
  expect(r.diagnostics.violations.every(v=>v.informational)).toBe(true);
  const b=r.diagnostics.bounds;r.arc.forEach(p=>{expect(p.x).toBeGreaterThanOrEqual(b.left-.05);expect(p.x).toBeLessThanOrEqual(b.right+.05);expect(p.y).toBeGreaterThanOrEqual(b.top-.05);expect(p.y).toBeLessThanOrEqual(b.bottom+.05);});
  const middle=r.phases[2],poses=[middle.startTime,(middle.startTime+middle.endTime)/2,middle.endTime+.01].map(t=>sampleFlight(r,t));
  expect(poses[0].depth).toBe('front');expect(poses[2].depth).toBe('front');
  const far=r.arc.find(a=>a.segment===6&&a.t>.5);expect(sampleDistance(r,far.distance).depth).toBe('back');
});
it('shares all endpoints and G1 direction without cusps',()=>{
  const r=build(fixture());expect(r.ok).toBe(true);
  for(let i=1;i<r.segments.length;i++){
    const a=r.segments[i-1],b=r.segments[i];expect(a.p3).toEqual(b.p0);
    const u=cubicTangent(a,1),v=cubicTangent(b,0),n=Math.hypot(u.x,u.y)*Math.hypot(v.x,v.y);
    expect(n).toBeGreaterThan(0);expect((u.x*v.x+u.y*v.y)/n).toBeGreaterThan(.999999);
  }
});
it('drives nine seconds by distance with continuous positive cruise velocity and no phase stops',()=>{
  const r=build(fixture(true));expect(r.ok).toBe(true);
  expect(sampleFlight(r,0).speed).toBe(0);expect(sampleFlight(r,9).speed).toBe(0);
  expect(sampleFlight(r,0).x).toBeCloseTo(r.origin.x,6);expect(sampleFlight(r,9).x).toBeCloseTo(r.origin.x,6);
  expect(sampleFlight(r,9).y).toBeCloseTo(r.origin.y,6);
  expect(r.phases.reduce((sum,p)=>sum+p.seconds,0)).toBeCloseTo(9,8);
  r.phases.slice(1).forEach(p=>expect(sampleFlight(r,p.startTime).speed).toBeGreaterThan(100));
  const centre=p=>sampleFlight(r,(p.startTime+p.endTime)/2).speed;
  expect(centre(r.phases[2])).toBeLessThan(centre(r.phases[1])*.8);
  for(let t=.02;t<=9;t+=.02){const a=sampleFlight(r,t-.02),b=sampleFlight(r,t);expect(Math.hypot(a.x-b.x,a.y-b.y)).toBeLessThan(15);}
});
it('never jumps to a preceding curve at an arc-table join',()=>{
  const r=build(fixture());r.segments.slice(1).forEach((s,index)=>{
    const boundary=r.arc.find(a=>a.segment===index+1).distance;
    const a=sampleDistance(r,boundary-.001),b=sampleDistance(r,boundary+.001);
    expect(Math.hypot(a.x-b.x,a.y-b.y)).toBeLessThan(.01);
  });
});
it('selects measured templates and fails only on physical conflicts',()=>{
  const m=fixture();expect(build(m).template).toBe('narrow-reflow');expect(build(fixture(true)).template).toBe('wide');
  expect(build({...m,jasonFragments:[rect(-500,120,135,67.2)]}).ok).toBe(false);
  expect(build({...m,art:rect(27,70,250,210)}).conflicts).toContain('Route intersects the large illustration exclusion region.');
});
it('keeps resize bridge endpoints and permits glyph crossings while excluding artwork',()=>{
  const r=build(fixture()),t=5,p=sampleFlight(r,t);
  const bridge=buildResizeBridge(r,{x:p.x+1,y:p.y},t,p.tangent);
  expect(bridge.ok).toBe(true);expect(bridge.segment.p3.x).toBeCloseTo(p.x);
  expect(buildResizeBridge(r,{x:100,y:450},t,p.tangent).ok).toBe(false);
});

it('matches both resize bridge endpoint velocity vectors at their time scale',()=>{
  const r=build(fixture()),target=sampleFlight(r,5),from={x:target.x+12,y:target.y+14},speed=target.speed*.8;
  const b=buildResizeBridge(r,from,5,target.tangent,speed);
  expect(b.ok).toBe(true);
  const start=cubicTangent(b.segment,0),end=cubicTangent(b.segment,1);
  expect(Math.hypot(start.x,start.y)/b.duration).toBeCloseTo(speed,6);
  expect(Math.hypot(end.x,end.y)/b.duration).toBeCloseTo(target.speed,6);
});
