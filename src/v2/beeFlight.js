// Hero-local coordinates; DOM access belongs to the player, never this module.
const K = 0.5522847498307936;
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
const mix = (a, b, t) => a + (b - a) * t;
const point = (x, y) => ({ x, y });
export const unionRects = (rects) => {
  if (!rects || !rects.length) return null;
  const left = Math.min(...rects.map(r => r.left)), top = Math.min(...rects.map(r => r.top));
  const right = Math.max(...rects.map(r => r.right)), bottom = Math.max(...rects.map(r => r.bottom));
  return { left, top, right, bottom, width: right - left, height: bottom - top };
};
export function cubicPoint(s, t) {
  const u = 1 - t;
  return point(u*u*u*s.p0.x + 3*u*u*t*s.p1.x + 3*u*t*t*s.p2.x + t*t*t*s.p3.x,
    u*u*u*s.p0.y + 3*u*u*t*s.p1.y + 3*u*t*t*s.p2.y + t*t*t*s.p3.y);
}
export function cubicTangent(s, t) {
  const u = 1 - t;
  return point(3*u*u*(s.p1.x-s.p0.x)+6*u*t*(s.p2.x-s.p1.x)+3*t*t*(s.p3.x-s.p2.x),
    3*u*u*(s.p1.y-s.p0.y)+6*u*t*(s.p2.y-s.p1.y)+3*t*t*(s.p3.y-s.p2.y));
}
const cubicCurvature = (s, t, tangent) => {
  const second=point(6*((1-t)*(s.p2.x-2*s.p1.x+s.p0.x)+t*(s.p3.x-2*s.p2.x+s.p1.x)),
    6*((1-t)*(s.p2.y-2*s.p1.y+s.p0.y)+t*(s.p3.y-2*s.p2.y+s.p1.y)));
  const speed=Math.hypot(tangent.x,tangent.y);
  return speed>1e-8?Math.abs(tangent.x*second.y-tangent.y*second.x)/(speed*speed*speed):0;
};
const distanceToRect = (p, r) => Math.hypot(Math.max(r.left-p.x, 0, p.x-r.right), Math.max(r.top-p.y, 0, p.y-r.bottom));
const smooth = t => { const x = clamp(t, 0, 1); return x*x*x*(10 + x*(-15 + 6*x)); };
const phaseMultiplier = { A: 1, B: 1, C: .7, D: .85, E: 1.05 };
const interpolateTable = (table, value, key) => {
  let lo = 0, hi = table.length - 1;
  while (hi-lo > 1) { const mid = (lo+hi)>>1; if (table[mid][key] < value) lo=mid; else hi=mid; }
  const a=table[lo], b=table[hi], t=(value-a[key])/(b[key]-a[key] || 1);
  return { a, b, t: clamp(t, 0, 1) };
};
export function sampleDistance(route, distance) {
  const { a,b,t }=interpolateTable(route.arc, clamp(distance, 0, route.length), 'distance');
  const segment = a.segment===b.segment ? a.segment : b.segment;
  const localT = a.segment===b.segment ? mix(a.t,b.t,t) : b.t*t;
  const s=route.segments[segment];
  const p=cubicPoint(s, localT), tangent=cubicTangent(s, localT);
  const depthScale=s.phase==='C'?1-.06*Math.max(0,(route.innerOrbit.cy-p.y)/route.innerOrbit.ry):1;
  return { ...p, tangent, curvature:cubicCurvature(s,localT,tangent), heading: Math.atan2(tangent.y,tangent.x), phase:s.phase, depth:s.depth||'front', depthScale, segment, distance:clamp(distance,0,route.length) };
}
export function sampleFlight(route, seconds) {
  const time=clamp(seconds,0,route.duration);
  const {a,b,t}=interpolateTable(route.clock,time,'time');
  const pose=sampleDistance(route,mix(a.distance,b.distance,t));
  return {...pose, time, speed:mix(a.speed,b.speed,t), progress:time/route.duration};
}
function buildClock(route, duration) {
  const phases = 'ABCDE'.split('').map(id => {
    const arcs=route.arc.filter(a=>route.segments[a.segment].phase===id);
    return {id, start:arcs[0].distance, end:arcs[arcs.length-1].distance, multiplier:phaseMultiplier[id]};
  });
  phases[0].start=0;
  phases.forEach((p,i)=>{if(i) p.start=phases[i-1].end;});
  const weights=phases.map(p=>(p.end-p.start)/p.multiplier), total=weights.reduce((a,b)=>a+b,0);
  let cumulative=0;
  const boundaries=weights.slice(0,-1).map(w=>{cumulative+=w;return duration*cumulative/total;});
  const dt=1/240;
  const integrate = turnAt => {
    const clock=[{time:0,distance:0,speed:0,turnFactor:1}];
    let integrated=0,lastVelocity=0;
    for(let i=1;i<=Math.ceil(duration/dt);i++) {
      const time=Math.min(duration,i*dt);
      let v=phaseMultiplier.A;
      boundaries.forEach((boundary,index)=> { v += (phases[index+1].multiplier-phases[index].multiplier)*smooth((time-boundary+.16)/.32); });
      const turnFactor=turnAt(time);
      v *= smooth(time/.45) * smooth((duration-time)/.6) * turnFactor;
      integrated+=(lastVelocity+v)*.5*(time-clock[clock.length-1].time);
      clock.push({time,distance:integrated,speed:v,turnFactor});lastVelocity=v;
    }
    const calibration=route.length/integrated;
    clock.forEach(row=>{row.distance*=calibration;row.speed*=calibration;});
    return {clock,calibration};
  };
  // Locate turns on a provisional distance clock, then anticipate them by 160ms.
  // A short symmetric time filter avoids speed steps at cubic/phase joins. This
  // only shapes A/B, and its bounded 14% reduction never masks a bad corner.
  const provisional=integrate(()=>1),guide={...route,clock:provisional.clock};
  const turnAt = time => {
    let severity=0,totalWeight=0;
    for(let i=-4;i<=4;i++) {
      const pose=sampleFlight(guide,time+.16+i*.05),weight=5-Math.abs(i);
      if(pose.phase==='A'||pose.phase==='B') severity+=weight*smooth((pose.curvature*route.r-.08)/.65);
      totalWeight+=weight;
    }
    return 1-.14*severity/totalWeight;
  };
  // Curvature may change abruptly at a G1 join even with an oval contour.
  // Forward/backward 100ms damping removes that sample step without delaying
  // the planned anticipation; integrate the smoothed factor, not raw curvature.
  const factors=provisional.clock.map(row=>turnAt(row.time)),alpha=1-Math.exp(-dt/.1);
  for(let i=1;i<factors.length;i++) factors[i]=mix(factors[i-1],factors[i],alpha);
  for(let i=factors.length-2;i>=0;i--) factors[i]=mix(factors[i+1],factors[i],alpha);
  const {clock,calibration}=integrate(time=>factors[Math.min(factors.length-1,Math.round(time/dt))]);
  // Locate real phase times in the integrated profile, rather than assert rough weights.
  let cursor=0;
  const timeAt = distance => {
    while(cursor<clock.length-2 && clock[cursor+1].distance<distance) cursor++;
    const a=clock[cursor],b=clock[cursor+1];
    return mix(a.time,b.time,(distance-a.distance)/(b.distance-a.distance||1));
  };
  phases.forEach(p=>{p.startTime=timeAt(p.start);p.endTime=timeAt(p.end);p.seconds=p.endTime-p.startTime;p.length=p.end-p.start;});
  return {clock,phases,calibration};
}

export function buildFlightPath(layout, measurements, params={}) {
  const m=measurements, H=unionRects(m.lines), J=unionRects(m.jasonFragments), G=unionRects(m.taglineRects);
  const fail=message=>({ok:false,conflicts:[message],measurements:m});
  if(!H||!J||!G||!m.P||!m.bee||!m.actions) return fail('Required text fragments or docking measurements are unavailable.');
  const narrow=layout.singleColumn === undefined ? !(m.art && m.art.top<m.actions.top && m.art.left>H.right) : layout.singleColumn;
  const template=narrow?'narrow-reflow':'wide';
  const minimumScale=Math.max(.8,24/m.bee.width), scale=clamp(params.beeScale || minimumScale,minimumScale,1);
  const width=m.bee.width*scale, height=m.bee.height*scale, r=Math.hypot(width,height)/2;
  const gap=params.gap === undefined ? (narrow?6:8) : params.gap;
  const bounds={left:r+2,right:m.hero.width-r-2,top:Math.max(0,layout.headerBottom||0)+r+2,bottom:Math.min(m.hero.height,m.actions.top)-r-2};
  // Text is allowed to intersect the flight. Only viewport/header, CTA and the
  // unchanged large illustration constrain its physical footprint.
  const artworkRightLimit=!narrow&&m.art ? m.art.left-r-2 : bounds.right;
  const rightLimit=Math.min(bounds.right,artworkRightLimit), cx=(J.left+J.right)/2, cy=(J.top+J.bottom)/2;
  const horizontalRoom=Math.min(cx-bounds.left,rightLimit-cx), verticalRoom=Math.min(cy-bounds.top,bounds.bottom-cy);
  const rx=Math.min(J.width/2+Math.min(10,r*.3),horizontalRoom*.92);
  const ry=Math.min(J.height*.38,verticalRoom*.9);
  if(rx<Math.max(18,J.width*.32)||ry<16) return fail('The complete Jason orbit cannot fit between the physical hero boundaries.');
  const innerOrbit={cx,cy,rx,ry,left:cx-rx,right:cx+rx,top:cy-ry,bottom:cy+ry};
  const outerLeft=Math.max(bounds.left,H.left-r-8);
  const outerRight=Math.min(rightLimit,Math.max(H.right+Math.max(24,H.width*(narrow?.12:.23)),m.P.x+16));
  const outerTop=Math.max(bounds.top,H.top-H.height*(narrow?.38:.48));
  if(outerRight<=outerLeft+40||outerTop>=cy-18||m.P.x<bounds.left||m.P.x>rightLimit||m.P.y>bounds.bottom) return fail('The title flight cannot fit the physical hero/CTA/illustration corridor.');
  const topX=mix(outerLeft,outerRight,.5);
  const rightY=mix(outerTop,cy,.52),entryY=mix(outerTop,cy,.62);
  const rightRadius=outerRight-topX,leftRadius=topX-outerLeft;
  const rightRise=rightY-outerTop,leftRise=entryY-outerTop;
  const returnY=Math.min(bounds.bottom,Math.max(m.P.y+12,G.bottom+8));
  const exitY=Math.min(returnY-12,Math.max(cy+24,innerOrbit.bottom+12));
  if(entryY>=cy||exitY<=cy||returnY<=exitY+2||returnY<=m.P.y+2) return fail('The Jason entry/exit and docking turn cannot fit above the CTA.');
  const segments=[]; let current=m.P;
  const add=(phase,p1,p2,p3,depth='front')=>{segments.push({phase,depth,p0:current,p1,p2,p3});current=p3;};
  // One continuous route: departure, the broad title contour, then a tighter
  // four-quarter oval centred on Jason's measured fragments. No forced row gaps.
  // The broad contour uses ellipse-sized handles rather than capped corners.
  // The departure is already climbing; its terminal handle matches the right
  // quarter's curvature before the top bow opens into the left descent.
  const departureX=mix(m.P.x,outerRight,.4),departureRise=m.P.y-rightY;
  const departureHandle=Math.min(departureRise*.75,
    K*rightRise*Math.sqrt((outerRight-departureX)/(rightRadius*(1-K))));
  add('A',point(departureX,m.P.y-departureRise*.28),point(outerRight,rightY+departureHandle),point(outerRight,rightY));
  add('B',point(outerRight,rightY-K*rightRise),point(topX+K*rightRadius,outerTop),point(topX,outerTop));
  add('B',point(topX-K*leftRadius,outerTop),point(outerLeft,entryY-K*leftRise),point(outerLeft,entryY));
  const entryHandle=Math.min(K*ry,(cy-entryY)*.45);
  add('B',point(outerLeft,entryY+(cy-entryY)*.4),point(innerOrbit.left,cy-entryHandle),point(innerOrbit.left,cy));
  add('C',point(innerOrbit.left,cy+K*ry),point(cx-K*rx,innerOrbit.bottom),point(cx,innerOrbit.bottom));
  add('C',point(cx+K*rx,innerOrbit.bottom),point(innerOrbit.right,cy+K*ry),point(innerOrbit.right,cy));
  add('C',point(innerOrbit.right,cy-K*ry),point(cx+K*rx,innerOrbit.top),point(cx,innerOrbit.top),'back');
  add('C',point(cx-K*rx,innerOrbit.top),point(innerOrbit.left,cy-K*ry),point(innerOrbit.left,cy),'back');
  add('D',point(innerOrbit.left,cy+(exitY-cy)*.35),point(outerLeft,exitY-(exitY-cy)*.35),point(outerLeft,exitY));
  const returnCorner=Math.min(72,(m.P.x-outerLeft)*.38,(returnY-exitY)*1.2);
  if(returnCorner<2) return fail('The docking lane has no room for a continuous return turn.');
  // Spread the lower turn across its available lane instead of a small corner.
  add('E',point(outerLeft,exitY+K*(returnY-exitY)),point(outerLeft+returnCorner*(1-K),returnY),point(outerLeft+returnCorner,returnY));
  add('E',point(mix(outerLeft+returnCorner,m.P.x,.5),returnY),point(m.P.x,m.P.y+(returnY-m.P.y)*.55),m.P);
  const arc=[{distance:0,segment:0,t:0,x:m.P.x,y:m.P.y}]; let length=0,previous=m.P;
  segments.forEach((s,index)=>{for(let i=1;i<=120;i++){const p=cubicPoint(s,i/120);length+=Math.hypot(p.x-previous.x,p.y-previous.y);arc.push({...p,distance:length,segment:index,t:i/120});previous=p;}});
  const conflicts=[],text=[...m.lines,...m.taglineRects,...(m.eyebrow?[m.eyebrow]:[])];
  let minimumClearance=Infinity,closest=null;const violations=[];
  arc.forEach(row=>{
    if(row.x<bounds.left-.05||row.x>bounds.right+.05||row.y<bounds.top-.05||row.y>bounds.bottom+.05){if(!conflicts.includes('Route exceeds the hero/CTA safety bounds.'))conflicts.push('Route exceeds the hero/CTA safety bounds.');}
    text.forEach((rect,index)=>{const clearance=distanceToRect(row,rect)-r;
      if(clearance<minimumClearance){minimumClearance=clearance;closest={...row,rect};}
      if(clearance<gap&&!violations.some(v=>v.segment===row.segment&&v.obstacle===index))violations.push({phase:segments[row.segment].phase,segment:row.segment,obstacle:index,clearance,x:row.x,y:row.y,rect,informational:true});
    });
    if(m.art&&distanceToRect(row,m.art)<r+2-1e-6){if(!conflicts.includes('Route intersects the large illustration exclusion region.'))conflicts.push('Route intersects the large illustration exclusion region.');}
  });
  const duration=clamp(params.duration||9,8,10),route={ok:!conflicts.length,conflicts,segments,arc,length,duration,origin:m.P,r,gap,scale,template,measurements:m,innerOrbit};
  const timing=buildClock(route,duration);Object.assign(route,timing);
  const minimumSpeed=timing.clock.filter(c=>c.time>.6&&c.time<duration-.7).reduce((a,b)=>b.speed<a.speed?b:a,timing.clock[160]);
  route.diagnostics={template,H,J,G,bee:{width,height,scale,r},gap,bounds,minimumClearance,closest,segmentCount:segments.length,innerOrbit,
    textOverlap:'Permitted; intersections are informational. The upper Jason arc renders behind the actual heading glyphs.',
    depthSequence:['front','back','front'],violations,phases:timing.phases,minimumCruise:{...minimumSpeed,pose:sampleFlight(route,minimumSpeed.time)}};
  return route;
}

// Rebuild bridges may cross text, but still fail closed against physical obstacles.
export function buildResizeBridge(route, from, targetTime, previousTangent, previousSpeed) {
  const target=sampleFlight(route,targetTime), length=Math.hypot(target.x-from.x,target.y-from.y);
  if(length<.5) return {ok:true,duration:0,segment:{p0:from,p1:from,p2:target,p3:target},targetTime};
  const norm=p=>{const n=Math.hypot(p.x,p.y)||1;return point(p.x/n,p.y/n);};
  const start=norm(previousTangent),end=norm(target.tangent);
  const startSpeed=Number.isFinite(previousSpeed)?Math.max(0,previousSpeed):target.speed;
  const endSpeed=target.speed;
  const duration=Math.max(1/60,(startSpeed+endSpeed)>1?2*length/(startSpeed+endSpeed):length/100);
  if(duration>2) return {ok:false,conflict:'Resize displacement exceeds the bounded safe transition; paused at the preserved screen pose.'};
  // Time-scaled Hermite handles preserve the actual endpoint velocity vectors.
  const segment={p0:from,p1:point(from.x+start.x*startSpeed*duration/3,from.y+start.y*startSpeed*duration/3),
    p2:point(target.x-end.x*endSpeed*duration/3,target.y-end.y*endSpeed*duration/3),p3:target};
  const bounds=route.diagnostics.bounds;
  for(let i=0;i<=100;i++) {const p=cubicPoint(segment,i/100);
    if(p.x<bounds.left||p.x>bounds.right||p.y<bounds.top||p.y>bounds.bottom||(route.measurements.art&&distanceToRect(p,route.measurements.art)<route.r+2)) return {ok:false,conflict:'Resize bridge has no safe direct corridor; flight paused at its preserved screen pose.'};
  }
  return {ok:true,segment,duration,targetTime,startSpeed,endSpeed};
}
