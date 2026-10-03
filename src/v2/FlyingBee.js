import React, {createContext, useContext, useEffect, useRef, useState} from "react";
import {createPortal} from "react-dom";
import {buildFlightPath, buildResizeBridge, cubicPoint, cubicTangent, sampleFlight, unionRects} from "./beeFlight";
export const BeeFlightContext=createContext(null);
export function BeeFlightProvider({children}) {
  const controller=useRef(null),[status,setStatus]=useState('parked');
  return <BeeFlightContext.Provider value={{controller,status,setStatus}}>{children}</BeeFlightContext.Provider>;
}
const localRect=(r,o)=>({left:r.left-o.left,top:r.top-o.top,right:r.right-o.left,bottom:r.bottom-o.top,width:r.width,height:r.height});
const textRects=(element,origin)=>{
  if(typeof document.createRange!=='function')return [];
  const walker=document.createTreeWalker(element,4,null,false),rects=[];let node;
  while((node=walker.nextNode())) {
    if(node.parentElement.closest('svg,[data-bee-debug]'))continue;
    const text=node.textContent,begin=text.search(/\S/),end=text.search(/\s*$/);if(begin<0||end<=begin)continue;
    const range=document.createRange();range.setStart(node,begin);range.setEnd(node,end);
    Array.from(range.getClientRects()).forEach(r=>{if(r.width&&r.height)rects.push(localRect(r,origin));});
  }return rects;
};
const mergeLines=rects=>{const rows=[];rects.forEach(r=>{const row=rows.find(a=>Math.abs(a[0].top-r.top)<2);if(row)row.push(r);else rows.push([r]);});return rows.map(unionRects).sort((a,b)=>a.top-b.top);};
export function measureFlight(slot) {
  const hero=slot.closest('.v2-hero'),world=hero.getBoundingClientRect(),rest=slot.getBoundingClientRect(),header=hero.closest('.v2-site').querySelector('.v2-header').getBoundingClientRect();
  // Zero-sized SSR/test or hidden surfaces have no usable flight geometry.
  if(!world.width||!world.height||!rest.width||!rest.height) return {hero,layout:{headerBottom:0},measurements:{hero:{width:world.width,height:world.height},world,lines:[],jasonFragments:[],taglineRects:[],P:{x:0,y:0},bee:{width:0,height:0},actions:{top:0}}};
  const m={hero:{width:world.width,height:world.height},world,
    lines:mergeLines(textRects(hero.querySelector('h1'),world)),jasonFragments:textRects(hero.querySelector('.v2-hero-name'),world),taglineRects:textRects(hero.querySelector('.v2-hero-lead'),world),
    P:{x:rest.left-world.left+rest.width/2,y:rest.top-world.top+rest.height/2},bee:{width:rest.width,height:rest.height},
    actions:localRect(hero.querySelector('.v2-hero-actions').getBoundingClientRect(),world),art:localRect(hero.querySelector('.v2-hero-art').getBoundingClientRect(),world),
    eyebrow:unionRects(textRects(hero.querySelector('.v2-eyebrow'),world))};
  return {hero,layout:{headerBottom:Math.max(0,header.bottom-world.top)},measurements:m};
}
const reduced=()=>window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const unwrap=(a,b)=>{while(a-b>Math.PI)a-=Math.PI*2;while(a-b<-Math.PI)a+=Math.PI*2;return a;};
export default function FlyingBee() {
  const c=useContext(BeeFlightContext),context=useRef(c);context.current=c;
  const slotRef=useRef(null),positionRef=useRef(null),svgRef=useRef(null),faceRef=useRef(null);
  const [status,setStatus]=useState('parked'),[debugView,setDebugView]=useState(null),[Debug,setDebug]=useState(null);
  useEffect(()=>{
    const slot=slotRef.current,hero=slot.closest('.v2-hero');
    const s={route:null,time:0,last:null,frame:0,measureFrame:0,paused:true,speed:1,pose:null,bank:0,heading:0,facing:1,bridge:null,conflicts:[],disposed:false,debug:false,lastDebug:0};
    const mark=value=>{setStatus(value);context.current.setStatus(value);};
    const write=(pose,dt=1/60)=>{
      if(!s.route)return;s.pose=pose;const n=Math.hypot(pose.tangent.x,pose.tangent.y)||1;
      s.heading=unwrap(Math.atan2(pose.tangent.y,pose.tangent.x),s.heading);
      if(Math.abs(pose.tangent.x)/n>.22)s.facing=pose.tangent.x<0?-1:1;
      const edge=s.route.duration?Math.min(1,s.time/.45,(s.route.duration-s.time)/.6):0;
      s.bank+=(20*pose.tangent.y/n*s.facing*Math.max(0,edge)-s.bank)*(1-Math.exp(-dt/.13));
      positionRef.current.style.transform=`translate(${pose.x-s.route.origin.x}px, ${pose.y-s.route.origin.y}px)`;
      positionRef.current.style.zIndex=pose.depth==='back'?'1':'3';positionRef.current.dataset.flightDepth=pose.depth||'front';
      svgRef.current.style.transform=`rotate(${s.bank}deg) scale(${s.route.scale*(pose.depthScale||1)})`;faceRef.current.style.transform=`scaleX(${s.facing})`;
    };
    const publish=()=>{if(s.debug)setDebugView({route:s.route,time:s.time,status:s.paused?'paused':'flying',conflicts:s.conflicts,pose:s.pose,speed:s.speed});};
    const pause=()=>{s.paused=true;s.last=null;cancelAnimationFrame(s.frame);mark(s.conflicts.length?'blocked':s.route&&s.route.ok&&s.time>=s.route.duration?'parked':'paused');publish();};
    const park=()=>{s.paused=true;s.bridge=null;s.bank=0;s.facing=1;s.time=s.route&&s.route.ok?s.route.duration:0;
      if(s.route&&s.route.ok){write({...sampleFlight(s.route,s.route.duration),tangent:{x:1,y:0}},1);svgRef.current.style.transform=`rotate(0deg) scale(${s.route.scale})`;faceRef.current.style.transform='scaleX(1)';}
      mark('parked');publish();};
    const tick=stamp=>{
      if(s.disposed||s.paused||!s.route)return;
      const dt=s.last===null?0:Math.min(.05,(stamp-s.last)/1000);s.last=stamp;
      if(s.bridge){const b=s.bridge;b.time+=dt*s.speed;const t=Math.min(1,b.time/b.duration),p=cubicPoint(b.segment,t),tangent=cubicTangent(b.segment,t);write({...p,tangent,depth:b.depth,depthScale:b.depthScale,speed:Math.hypot(tangent.x,tangent.y)/b.duration},dt);if(t===1){s.time=b.targetTime;s.bridge=null;}}
      else{s.time=Math.min(s.route.duration,s.time+dt*s.speed);write(sampleFlight(s.route,s.time),dt);}
      if(s.debug&&stamp-s.lastDebug>80){publish();s.lastDebug=stamp;}
      if(s.time>=s.route.duration&&!s.bridge){park();return;}s.frame=requestAnimationFrame(tick);
    };
    const resume=()=>{if(!s.route||!s.route.ok||s.conflicts.length||reduced())return;s.paused=false;s.last=null;mark('flying');cancelAnimationFrame(s.frame);s.frame=requestAnimationFrame(tick);publish();};
    const build=(preserve=false)=>{
      const previous=s.route,pose=s.pose,oldTime=s.time,wasPaused=s.paused;
      const measured=measureFlight(slot),route=buildFlightPath(measured.layout,measured.measurements);s.conflicts=route.conflicts;
      if(!route.ok){if(!previous||!previous.ok)s.route=route;
        if(previous&&previous.ok&&pose){const from={x:previous.measurements.world.left+pose.x-measured.measurements.world.left,y:previous.measurements.world.top+pose.y-measured.measurements.world.top};positionRef.current.style.transform=`translate(${from.x-measured.measurements.P.x}px, ${from.y-measured.measurements.P.y}px)`;}pause();return;}s.route=route;
      if(preserve&&previous&&previous.ok&&pose&&oldTime>0&&oldTime<previous.duration){
        const phase=previous.phases.find(p=>oldTime>=p.startTime&&oldTime<=p.endTime)||previous.phases[4],fraction=(oldTime-phase.startTime)/(phase.seconds||1),next=route.phases.find(p=>p.id===phase.id),targetTime=next.startTime+next.seconds*fraction;
        const from={x:previous.measurements.world.left+pose.x-route.measurements.world.left,y:previous.measurements.world.top+pose.y-route.measurements.world.top};
        write({...from,tangent:pose.tangent,depth:pose.depth,depthScale:pose.depthScale},0);
        const bridge=buildResizeBridge(route,from,targetTime,pose.tangent,pose.speed);
        if(!bridge.ok){s.conflicts=[bridge.conflict];pause();return;}s.bridge=bridge.duration?{...bridge,time:0,depth:pose.depth,depthScale:pose.depthScale}:null;s.time=targetTime;if(!wasPaused)resume();else pause();
      }else{s.time=0;s.bridge=null;s.bank=0;s.facing=1;write(sampleFlight(route,0),1);
        // Initial ResizeObserver/font settling is a new dock, not an in-flight
        // displacement. Restart its clock there; preserve genuine flown poses.
        if(preserve&&previous&&previous.ok){if(oldTime>=previous.duration)park();else if(!wasPaused)resume();else publish();}else publish();}
    };
    const schedule=()=>{if(s.measureFrame)return;cancelAnimationFrame(s.frame);s.last=null;s.measureFrame=requestAnimationFrame(()=>{s.measureFrame=0;if(!s.disposed)build(true);});};
    const onKeyDown=event=>{if(event.key==='Escape'&&!s.paused)pause();};
    const replay=()=>{if(!reduced()&&(!s.route||s.time>=s.route.duration)){build();resume();}};
    const controller={toggle:()=>{if(s.conflicts.length){build(true);if(!s.conflicts.length)resume();}else if(s.paused&&s.route&&s.route.ok&&s.time<s.route.duration)resume();else if(!s.paused)pause();else{build();resume();}},replay:()=>{build();resume();},pause,resume,
      scrub:value=>{pause();if(s.route&&s.route.ok){s.time=value;write(sampleFlight(s.route,value),1);publish();}},speed:value=>{s.speed=value;publish();}};
    context.current.controller.current=controller;
    const motion=window.matchMedia?window.matchMedia('(prefers-reduced-motion: reduce)'):null,onMotion=()=>{if(motion.matches){cancelAnimationFrame(s.frame);park();}else{build();resume();}};
    const observer=typeof ResizeObserver==='function'?new ResizeObserver(schedule):null;if(observer){observer.observe(hero);observer.observe(hero.querySelector('h1'));observer.observe(hero.querySelector('.v2-hero-lead'));}
    window.addEventListener('keydown',onKeyDown);window.addEventListener('resize',schedule);hero.querySelector('.v2-hero-lead').addEventListener('mouseenter',replay);
    if(motion&&motion.addEventListener)motion.addEventListener('change',onMotion);else if(motion&&motion.addListener)motion.addListener(onMotion);
    if(document.fonts&&document.fonts.addEventListener)document.fonts.addEventListener('loadingdone',schedule);
    if(new URLSearchParams(window.location.search).get('beeDebug')==='1'){s.debug=true;import('./BeeFlightDebug').then(module=>{if(!s.disposed){setDebug(()=>module.default);publish();}});}
    const launch=()=>{if(s.disposed)return;build();if(!reduced())resume();else park();};if(document.fonts&&document.fonts.ready)document.fonts.ready.then(launch);else launch();
    return()=>{s.disposed=true;cancelAnimationFrame(s.frame);cancelAnimationFrame(s.measureFrame);if(observer)observer.disconnect();window.removeEventListener('keydown',onKeyDown);window.removeEventListener('resize',schedule);hero.querySelector('.v2-hero-lead').removeEventListener('mouseenter',replay);
      if(motion&&motion.removeEventListener)motion.removeEventListener('change',onMotion);else if(motion&&motion.removeListener)motion.removeListener(onMotion);if(document.fonts&&document.fonts.removeEventListener)document.fonts.removeEventListener('loadingdone',schedule);context.current.controller.current=null;};
  },[]);
  return <React.Fragment><span ref={slotRef} className="v2-bee-slot" aria-hidden="true"><span ref={positionRef} className="v2-bee-position">
    <svg ref={svgRef} className={`v2-flying-bee${status==='flying'?' v2-flying-bee--flying':''}${status==='paused'||status==='blocked'?' v2-flying-bee--paused':''}`} data-flight-status={status} viewBox="0 0 80 64" fill="none" aria-hidden="true" focusable="false"><g ref={faceRef} className="v2-bee-facing">
      <path className="v2-bee-trail" d="M3 43c4 1 7 0 10-2m-6 9 8-3"
        stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <g className="v2-bee-body" transform="rotate(-9 48 39)"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path className="v2-bee-wing v2-bee-wing-back"
          d="M41 28C28 24 21 13 27 8c8-7 17 5 18 17"
          fill="var(--v2-sky)" />
        <path className="v2-bee-wing v2-bee-wing-front"
          d="M42 27C39 17 43 6 51 8c12 3 7 16-9 19Z"
          fill="var(--v2-white)" />
        <path d="m23 40-5 3 6 3" fill="currentColor" />
        <path d="M22 42c0-12 10-19 25-19s27 7 27 19-12 19-27 19-25-7-25-19Z"
          fill="#ffda76" />
        <path d="M31 27c-5 9-5 20 1 29l6 3c-7-12-7-25-1-35ZM42 23c-5 12-4 25 2 38h6c-7-13-8-26-2-38Z"
          fill="currentColor" stroke="none" />
        <path d="M22 42c0-12 10-19 25-19s27 7 27 19-12 19-27 19-25-7-25-19Z" />
        <path d="M54 24c0-5-2-8-5-9m14 11c1-5 3-7 6-8" />
        <circle cx="49" cy="15" r="2.1" fill="currentColor" stroke="none" />
        <circle cx="69" cy="18" r="2.1" fill="currentColor" stroke="none" />
        <g fill="currentColor" stroke="none">
          <ellipse cx="54" cy="39" rx="2.3" ry="2.8" />
          <ellipse cx="65" cy="39" rx="2.3" ry="2.8" />
        </g>
        <g fill="var(--v2-coral)" stroke="none" opacity="0.8">
          <ellipse cx="51" cy="44" rx="2.8" ry="1.8" />
          <ellipse cx="68" cy="44" rx="2.8" ry="1.8" />
        </g>
        <path d="M57 45c1.3 2.2 3.7 2.2 5 0" />
      </g>

    </g></svg></span></span>{Debug&&debugView&&slotRef.current?createPortal(<Debug view={debugView} controller={context.current.controller.current}/>,slotRef.current.closest('.v2-hero')):null}</React.Fragment>;
}
