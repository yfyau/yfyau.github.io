import React from 'react';
import ReactDOM from 'react-dom';
import {act,Simulate} from 'react-dom/test-utils';
import FlyingBee,{BeeFlightProvider,BeeFlightContext,measureFlight} from './FlyingBee';
import {buildFlightPath} from './beeFlight';
// Test-only control harness exercises the player without shipping retired UI.
function BeeFlightControl() {
  const c=React.useContext(BeeFlightContext);
  return <button type="button" className="v2-bee-control" aria-pressed={c.status==='paused'} aria-label={c.status==='flying'?'Pause bee animation':c.status==='paused'?'Resume bee animation':c.status==='blocked'?'Recheck bee animation after resize':'Replay bee animation'}
    onClick={()=>c.controller.current&&c.controller.current.toggle()}>{c.status==='flying'?'Pause bee':c.status==='paused'?'Resume bee':c.status==='blocked'?'Recheck bee':'Replay bee'}</button>;
}
const rect=(left,top,width,height)=>({left,top,right:left+width,bottom:top+height,width,height});
function setup({reduced=false,invalid=false,debug=false,scrollX=0,scrollY=0,headerHeight=0}={}) {
  const previousURL=window.location.href;if(debug)window.history.replaceState({},'','?beeDebug=1');
  const model={P:{x:108,y:256},J:rect(20,120,135,67.2),invalid,scroll:{x:scrollX,y:scrollY},world:{x:0,y:headerHeight},headerHeight};
  const scrollDescriptors=['scrollX','scrollY'].map(key=>Object.getOwnPropertyDescriptor(window,key));
  Object.defineProperty(window,'scrollX',{configurable:true,get:()=>model.scroll.x});
  Object.defineProperty(window,'scrollY',{configurable:true,get:()=>model.scroll.y});
  const fontsDescriptor=Object.getOwnPropertyDescriptor(document,'fonts'),fonts=document.createElement('div');
  Object.defineProperty(document,'fonts',{configurable:true,value:fonts});
  const oldObserver=window.ResizeObserver;let observeResize;
  window.ResizeObserver=class {constructor(callback){observeResize=callback;}observe(){}disconnect(){}};
  const inViewport=r=>rect(r.left+model.world.x-model.scroll.x,r.top+model.world.y-model.scroll.y,r.width,r.height);
  const oldMedia=window.matchMedia;window.matchMedia=()=>({matches:reduced,addListener(){},removeListener(){}});
  let stamp=0,id=0;const pending=new Map();
  const request=jest.spyOn(window,'requestAnimationFrame').mockImplementation(callback=>{pending.set(++id,callback);return id;});
  const cancel=jest.spyOn(window,'cancelAnimationFrame').mockImplementation(value=>pending.delete(value));
  const bounds=jest.spyOn(Element.prototype,'getBoundingClientRect').mockImplementation(function(){
    if(model.invalid)return rect(0,0,0,0);
    if(this.classList.contains('v2-site'))return rect(-model.scroll.x,-model.scroll.y,305,3000);
    if(this.classList.contains('v2-hero'))return inViewport(rect(0,0,305,1100));
    if(this.classList.contains('v2-header'))return rect(-model.scroll.x,Math.max(0,-model.scroll.y),305,model.headerHeight);
    if(this.classList.contains('v2-bee-slot'))return inViewport(rect(model.P.x-49.275/2,model.P.y-39.4125/2,49.275,39.4125));
    if(this.classList.contains('v2-hero-actions'))return inViewport(rect(20,310,265,90));
    if(this.classList.contains('v2-hero-art'))return inViewport(rect(20,420,265,265));
    return rect(0,0,0,0);
  });
  const previousRange=document.createRange;
  document.createRange=jest.fn(()=>{
    let node;return {setStart(n){node=n;},setEnd(){},getClientRects(){
      const text=node.textContent.trim();
      if(text==='Jason')return [inViewport(model.J)];
      if(text.includes('Hi,'))return [inViewport(rect(20,64,245,67.2))];
      if(text.includes('Yau')||text==='.')return [inViewport(rect(155,120,115,67.2))];
      if(text.includes('The person'))return [inViewport(rect(20,216,176,21))];
      if(text==='finding.')return [inViewport(rect(20,244,60,21))];
      return [inViewport(rect(20,32,260,15))];
    }};
  });
  const container=document.createElement('div');document.body.appendChild(container);
  act(()=>{ReactDOM.render(<div className="v2-site"><header className="v2-header"/><BeeFlightProvider><section className="v2-hero">
    <p className="v2-eyebrow">A CURIOUS MIND. A STUBBORN STREAK.</p><h1><span>Hi, I’m </span><span className="v2-hero-name">Jason</span><span> Yau.</span></h1>
    <p className="v2-hero-lead">The person bugs keep <span>finding.<FlyingBee/></span></p>
    <div className="v2-hero-actions"><BeeFlightControl/></div><div className="v2-hero-art"/>
  </section></BeeFlightProvider></div>,container);});
  const step=ms=>{for(let elapsed=0;elapsed<ms;elapsed+=20){stamp+=20;const callbacks=Array.from(pending.values());pending.clear();act(()=>callbacks.forEach(callback=>callback(stamp)));}};
  const bee=()=>container.querySelector('.v2-flying-bee'),button=()=>container.querySelector('.v2-bee-control'),position=()=>container.querySelector('.v2-bee-position').style.transform;
  const rebuild=source=>act(()=>{if(source==='font')fonts.dispatchEvent(new Event('loadingdone'));else if(source==='observer')observeResize();else window.dispatchEvent(new Event('resize'));});
  const documentPoint=()=>{const offset=position().match(/-?[\d.]+/g).map(Number);return {x:model.world.x+model.P.x+offset[0],y:model.world.y+model.P.y+offset[1]};};
  const cleanup=()=>{window.history.replaceState({},'',previousURL);act(()=>{ReactDOM.unmountComponentAtNode(container);});container.remove();bounds.mockRestore();if(previousRange)document.createRange=previousRange;else delete document.createRange;request.mockRestore();cancel.mockRestore();window.matchMedia=oldMedia;window.ResizeObserver=oldObserver;
    if(fontsDescriptor)Object.defineProperty(document,'fonts',fontsDescriptor);else delete document.fonts;
    ['scrollX','scrollY'].forEach((key,i)=>{if(scrollDescriptors[i])Object.defineProperty(window,key,scrollDescriptors[i]);else delete window[key];});};
  return {model,container,step,bee,button,position,rebuild,documentPoint,cleanup};
}
it('plays once, supports an accessible pause/resume and replays only from the dock',()=>{
  const f=setup();try{
    expect(f.bee().dataset.flightStatus).toBe('flying');f.step(1000);const pose=f.position();
    act(()=>Simulate.click(f.button()));expect(f.bee().dataset.flightStatus).toBe('paused');expect(f.button().getAttribute('aria-pressed')).toBe('true');
    f.step(1000);expect(f.position()).toBe(pose);
    act(()=>Simulate.click(f.button()));f.step(1000);expect(f.position()).not.toBe(pose);
    f.step(9000);expect(f.bee().dataset.flightStatus).toBe('parked');expect(f.position()).toBe('translate(0px, 0px)');
    expect(f.bee().style.transform).toContain('rotate(0deg)');
    act(()=>Simulate.click(f.button()));expect(f.bee().dataset.flightStatus).toBe('flying');expect(f.position()).toBe('translate(0px, 0px)');
    f.step(500);expect(f.position()).not.toBe('translate(0px, 0px)');
  }finally{f.cleanup();}
});
it('ignores wing animation end events and keeps a single master clock',()=>{
  const f=setup();try{f.step(1000);act(()=>Simulate.animationEnd(f.bee().querySelector('.v2-bee-wing-front')));expect(f.bee().dataset.flightStatus).toBe('flying');f.step(8500);expect(f.bee().dataset.flightStatus).toBe('parked');}finally{f.cleanup();}
});
it.each([false,true])('keeps reduced motion static even when geometry is invalid=%s',invalid=>{
  const f=setup({reduced:true,invalid});try{expect(f.bee().classList.contains('v2-flying-bee--flying')).toBe(false);act(()=>Simulate.click(f.button()));f.step(2000);expect(f.bee().classList.contains('v2-flying-bee--flying')).toBe(false);expect(f.container.querySelector('.v2-hero-lead').textContent).toBe('The person bugs keep finding.');}finally{f.cleanup();}
});
it('preserves the screen point and blocks resume when resize removes a safe corridor',()=>{
  const f=setup();try{
    f.step(4000);const before=f.position().match(/-?[\d.]+/g).map(Number),screen={x:f.model.P.x+before[0],y:f.model.P.y+before[1]};
    f.model.P.x+=40;f.model.J=rect(-500,120,135,67.2);act(()=>{window.dispatchEvent(new Event('resize'));});f.step(20);
    const after=f.position().match(/-?[\d.]+/g).map(Number);expect(f.model.P.x+after[0]).toBeCloseTo(screen.x,6);expect(f.model.P.y+after[1]).toBeCloseTo(screen.y,6);
    expect(f.bee().dataset.flightStatus).toBe('blocked');const blocked=f.position();act(()=>Simulate.click(f.button()));f.step(1000);expect(f.bee().dataset.flightStatus).toBe('blocked');expect(f.position()).toBe(blocked);
  }finally{f.cleanup();}
});
it('renders the far Jason arc behind the actual heading then returns to front',()=>{
  const f=setup();try{
    const layers=[];for(let t=0;t<9200;t+=100){f.step(100);const p=f.container.querySelector('.v2-bee-position');if(layers[layers.length-1]!==p.dataset.flightDepth)layers.push(p.dataset.flightDepth);expect(p.style.zIndex).toBe(p.dataset.flightDepth==='back'?'1':'3');}
    expect(layers).toEqual(['front','back','front']);expect(f.bee().dataset.flightStatus).toBe('parked');
  }finally{f.cleanup();}
});
it('coalesces startup dock settling at zero distance without an unsafe resize bridge',()=>{
  const f=setup();try{
    expect(f.position()).toBe('translate(0px, 0px)');f.model.P.x+=36;
    act(()=>{window.dispatchEvent(new Event('resize'));});f.step(20);
    expect(f.bee().dataset.flightStatus).toBe('flying');expect(f.position()).toBe('translate(0px, 0px)');
    f.step(500);expect(f.position()).not.toBe('translate(0px, 0px)');expect(f.bee().dataset.flightStatus).toBe('flying');
  }finally{f.cleanup();}
});
it('uses the slow master-clock timebase for a safe in-flight resize bridge',async()=>{
  const f=setup({debug:true});try{
    await act(async()=>{await Promise.resolve();});
    const click=text=>{const button=Array.from(f.container.querySelectorAll('button')).find(b=>b.textContent===text);expect(button).toBeTruthy();act(()=>Simulate.click(button));};
    click('0.25 speed');f.step(18000);
    const before=f.position().match(/-?[\d.]+/g).map(Number),screen={x:f.model.P.x+before[0],y:f.model.P.y+before[1]};
    f.model.J={...f.model.J,left:f.model.J.left+12,right:f.model.J.right+12};
    act(()=>{window.dispatchEvent(new Event('resize'));});f.step(20);
    const frozen=f.position().match(/-?[\d.]+/g).map(Number);expect(f.model.P.x+frozen[0]).toBeCloseTo(screen.x,6);expect(f.model.P.y+frozen[1]).toBeCloseTo(screen.y,6);
    expect(f.bee().dataset.flightStatus).toBe('flying');
    const positions=[];for(let i=0;i<60;i++){f.step(20);positions.push(f.position().match(/-?[\d.]+/g).map(Number));}
    // At quarter speed, including the bridge, no twenty-ms step may jump more
    // than the expected cruise displacement. A normal-speed bridge failed this.
    positions.forEach((p,i)=>{if(i)expect(Math.hypot(p[0]-positions[i-1][0],p[1]-positions[i-1][1])).toBeLessThan(1.5);});
  }finally{f.cleanup();}
});

it('pauses flight with Escape without requiring the visible control',()=>{
  const f=setup();try{f.step(1000);const pose=f.position();act(()=>{window.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape'}));});f.step(1000);expect(f.bee().dataset.flightStatus).toBe('paused');expect(f.position()).toBe(pose);}finally{f.cleanup();}
});

const expectPoint=(actual,expected)=>{expect(actual.x).toBeCloseTo(expected.x,6);expect(actual.y).toBeCloseTo(expected.y,6);};
it('keeps hero-local flight geometry unchanged when the header sticks after scrolling',()=>{
  const f=setup({headerHeight:76});try{
    const measure=()=>measureFlight(f.container.querySelector('.v2-bee-slot'));
    const initial=measure(),route=buildFlightPath(initial.layout,initial.measurements);expect(route.ok).toBe(true);
    f.model.scroll={x:32,y:760};const scrolled=measure(),next=buildFlightPath(scrolled.layout,scrolled.measurements);
    expect(scrolled.layout).toEqual(initial.layout);expect(next.ok).toBe(true);expect(next.segments).toEqual(route.segments);
  }finally{f.cleanup();}
});
it.each(['resize','font','observer'])('stays anchored and returns home after scrolling during a %s rebuild',source=>{
  const f=setup({headerHeight:76});try{
    f.step(4000);const before=f.documentPoint();f.model.scroll={x:32,y:760};
    f.rebuild(source);f.step(20);expectPoint(f.documentPoint(),before);expect(f.bee().dataset.flightStatus).toBe('flying');
    // Multiple callbacks after a mobile toolbar viewport change must also leave
    // the locally anchored pose in place, even when the hero is off screen.
    f.rebuild(source);f.step(20);expectPoint(f.documentPoint(),before);expect(f.bee().dataset.flightStatus).toBe('flying');
    f.step(9500);expect(f.bee().dataset.flightStatus).toBe('parked');expect(f.position()).toBe('translate(0px, 0px)');
    f.model.scroll={x:0,y:0};f.rebuild(source);f.step(20);
    expect(f.bee().dataset.flightStatus).toBe('parked');expect(f.position()).toBe('translate(0px, 0px)');
  }finally{f.cleanup();}
});
it('starts while scrolled and replays from the dock before returning to the hero',()=>{
  const f=setup({headerHeight:76,scrollY:760});try{
    expect(f.bee().dataset.flightStatus).toBe('flying');f.step(9500);
    expect(f.bee().dataset.flightStatus).toBe('parked');expect(f.position()).toBe('translate(0px, 0px)');
    act(()=>{f.container.querySelector('.v2-hero-lead').dispatchEvent(new Event('mouseenter'));});
    expect(f.bee().dataset.flightStatus).toBe('flying');f.step(1000);expect(f.position()).not.toBe('translate(0px, 0px)');
    f.model.scroll.y=0;f.step(9000);expect(f.bee().dataset.flightStatus).toBe('parked');expect(f.position()).toBe('translate(0px, 0px)');
  }finally{f.cleanup();}
});
it('preserves a paused pose through scroll callbacks and resumes to the dock',()=>{
  const f=setup({headerHeight:76});try{
    f.step(4000);act(()=>{window.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape'}));});const before=f.documentPoint();
    f.model.scroll.y=760;f.rebuild('font');f.step(20);
    expectPoint(f.documentPoint(),before);expect(f.bee().dataset.flightStatus).toBe('paused');f.step(1000);expectPoint(f.documentPoint(),before);
    act(()=>Simulate.click(f.button()));f.step(9500);expect(f.bee().dataset.flightStatus).toBe('parked');expect(f.position()).toBe('translate(0px, 0px)');
  }finally{f.cleanup();}
});
it('keeps a safe real layout-resize bridge after scrolling away',()=>{
  const f=setup({headerHeight:76});try{
    f.step(4500);const before=f.documentPoint();f.model.scroll.y=760;
    f.model.J={...f.model.J,left:f.model.J.left+12,right:f.model.J.right+12};f.rebuild('resize');f.step(20);
    expectPoint(f.documentPoint(),before);expect(f.bee().dataset.flightStatus).toBe('flying');
    f.step(9500);expect(f.bee().dataset.flightStatus).toBe('parked');expect(f.position()).toBe('translate(0px, 0px)');
  }finally{f.cleanup();}
});
it('preserves the document point and fails closed for an unsafe layout resize while scrolled',()=>{
  const f=setup({headerHeight:76});try{
    f.step(4000);const before=f.documentPoint();f.model.scroll.y=760;f.model.P.x+=40;f.model.J=rect(-500,120,135,67.2);
    f.rebuild('observer');f.step(20);expectPoint(f.documentPoint(),before);expect(f.bee().dataset.flightStatus).toBe('blocked');
    f.model.scroll.y=0;f.rebuild('resize');f.step(20);expectPoint(f.documentPoint(),before);
    expect(f.bee().dataset.flightStatus).toBe('blocked');
  }finally{f.cleanup();}
});
it('keeps reduced motion docked when launched and rebuilt while scrolled',()=>{
  const f=setup({reduced:true,headerHeight:76,scrollY:760});try{
    expect(f.bee().dataset.flightStatus).toBe('parked');expect(f.position()).toBe('translate(0px, 0px)');
    f.rebuild('observer');f.step(1000);expect(f.bee().dataset.flightStatus).toBe('parked');expect(f.position()).toBe('translate(0px, 0px)');
  }finally{f.cleanup();}
});

it('preserves the accepted route and timing at the unscrolled dock',()=>{
  const f=setup({headerHeight:76});try{
    const measured=measureFlight(f.container.querySelector('.v2-bee-slot'));
    // The accepted pre-fix local measurements at scroll zero.
    const baseline=buildFlightPath({headerBottom:0},{hero:{width:305,height:1100},world:rect(0,76,305,1100),
      lines:[rect(20,64,245,67.2),rect(20,120,250,67.2)],jasonFragments:[rect(20,120,135,67.2)],
      taglineRects:[rect(20,216,176,21),rect(20,244,60,21)],P:{x:108,y:256},bee:{width:49.275,height:39.4125},
      actions:rect(20,310,265,90),art:rect(20,420,265,265),eyebrow:rect(20,32,260,15)});
    const route=buildFlightPath(measured.layout,measured.measurements);
    expect(route.ok).toBe(true);expect(route.segments).toEqual(baseline.segments);
    expect(route.clock).toEqual(baseline.clock);expect(route.phases).toEqual(baseline.phases);
  }finally{f.cleanup();}
});
