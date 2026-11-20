import * as THREE from 'three';

const $=s=>document.querySelector(s);
const mount=$('#game'),intro=$('#intro'),hud=$('#hud'),prompt=$('#interaction'),promptText=$('#interaction-text'),message=$('#message');
const scene=new THREE.Scene();scene.background=new THREE.Color(0x9bcbd4);scene.fog=new THREE.Fog(0x9bcbd4,105,330);
const camera=new THREE.PerspectiveCamera(68,innerWidth/innerHeight,.1,650);
const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;mount.appendChild(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xdaf5ff,0x4b5c50,2.0));
const sun=new THREE.DirectionalLight(0xffedcf,2.6);sun.position.set(-75,110,-35);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-115;sun.shadow.camera.right=115;sun.shadow.camera.top=115;sun.shadow.camera.bottom=-115;scene.add(sun);
const material=(color,roughness=.8,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
const mats={concrete:material(0x858e88),paint:material(0xe7dfca),yellow:material(0xe7ad45),dark:material(0x253c48),steel:material(0x657c83,.45,.45),red:material(0xb84d3c),blue:material(0x3c7088),green:material(0x54806c),wood:material(0xb9854b),glass:material(0x4b8490,.22,.25),white:material(0xe5e6dc),black:material(0x172b35)};
function box(parent,name,size,pos,mat,opts={}){const m=new THREE.Mesh(new THREE.BoxGeometry(...size),mat);m.name=name;m.position.set(...pos);m.castShadow=opts.cast!==false;m.receiveShadow=true;parent.add(m);return m}
function cylinder(parent,name,r1,r2,h,pos,mat,segments=12){const m=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,segments),mat);m.name=name;m.position.set(...pos);m.castShadow=true;parent.add(m);return m}
function group(parent,pos=[0,0,0]){const g=new THREE.Group();g.position.set(...pos);parent.add(g);return g}

// Ocean and port land
const waterGeo=new THREE.PlaneGeometry(650,520,90,70);waterGeo.rotateX(-Math.PI/2);const waterMat=new THREE.MeshStandardMaterial({color:0x187f98,roughness:.32,metalness:.08,flatShading:true});const water=new THREE.Mesh(waterGeo,waterMat);water.position.set(90,-1.4,0);water.receiveShadow=true;scene.add(water);const waterBase=Float32Array.from(waterGeo.attributes.position.array);
box(scene,'Port land',[120,1,130],[-65,-.55,0],mats.concrete);
box(scene,'Dock apron',[32,1.2,92],[1,-.1,0],material(0x687c7d));
box(scene,'Quay edge',[1.2,2,94],[17.7,-.05,0],mats.white);
for(let z=-42;z<=42;z+=14){cylinder(scene,'Mooring bollard',.42,.48,1,[16.9,.5,z],mats.dark);box(scene,'Quay stripe',[.35,.04,5],[16.9,.55,z],mats.yellow)}
// painted lines and yard markings
for(let z=-37;z<=37;z+=12){box(scene,'Yard line',[.18,.025,7],[-42,.02,z],mats.yellow,{cast:false});box(scene,'Yard line',[.18,.025,7],[-8,.02,z],mats.yellow,{cast:false})}
for(let x=-85;x<-5;x+=10){box(scene,'Concrete expansion joint',[.08,.02,90],[x,.015,0],material(0x747e78),{cast:false})}

// Distant port skyline and storage tanks
for(let i=0;i<11;i++){const x=-108+(i%6)*17,z=-57+Math.floor(i/6)*114;const h=10+(i*7)%15;box(scene,'Port warehouse silhouette',[12,h,16],[x,h/2-.2,z],material(i%2?0x647b80:0x8a8f83));box(scene,'Warehouse roof',[12.8,.6,16.8],[x,h,z],mats.dark)}
for(let i=0;i<5;i++){cylinder(scene,'Fuel silo',4.2,4.2,12,[-100+i*13,5.5,48],material(0xa9b1a9),20);cylinder(scene,'Silo roof',4.3,0,2,[-100+i*13,12.5,48],mats.dark,20)}

// Warehouse building and package interior
const warehouse=group(scene,[-61,0,-20]);
box(warehouse,'Warehouse floor',[25,.6,23],[0,.3,0],material(0x737b75));
box(warehouse,'Warehouse back wall',[25,9,.8],[0,4.8,-11],material(0x9a9d91));
box(warehouse,'Warehouse left wall',[.8,9,23],[-12.5,4.8,0],material(0x9a9d91));
box(warehouse,'Warehouse right wall',[.8,9,23],[12.5,4.8,0],material(0x9a9d91));
box(warehouse,'Warehouse roof',[26,.7,24],[0,9.3,0],mats.dark);
box(warehouse,'Warehouse sign',[9,1.5,.25],[0,7.4,11.6],mats.yellow);
box(warehouse,'Warehouse sign lettering',[.4,.4,.12],[0,7.4,11.43],mats.black);
for(let x=-8;x<=8;x+=4){box(warehouse,'Storage rack',[.25,5,7],[x,2.8,-5],mats.dark);for(let y=1;y<=4;y+=1.5)box(warehouse,'Rack shelf',[3.5,.18,6],[x+1.5,y,-5],mats.yellow)}
const packageMesh=group(scene,[-61,1.0,-14]);
const packageBox=box(packageMesh,'Special package',[1.7,1.5,1.7],[0,.8,0],material(0xd8b16b));
for(let x of [-.44,.44])box(packageMesh,'Package strap',[.12,1.54,1.76],[x,.8,0],mats.red);
box(packageMesh,'Fragile label',[.55,.36,.035],[0,.8,.87],mats.white,{cast:false});
const packageGlow=new THREE.PointLight(0xffd38b,1.5,5);packageGlow.position.set(0,2.3,0);packageMesh.add(packageGlow);

// Port crane staging zone
for(let i=0;i<4;i++){const z=-24+i*16;box(scene,'Crate staging pad',[11,.12,12],[-24,.08,z],material(0x596b68));box(scene,'Pad border',[11.3,.08,.18],[-24,.18,z-6],mats.yellow);box(scene,'Pad border',[11.3,.08,.18],[-24,.18,z+6],mats.yellow)}
const crateColors=[0xc94b3d,0x347da1,0x4d936c,0xd39a37];
const crates=[];
for(let i=0;i<4;i++){
 const z=-24+i*16,g=group(scene,[-24,.12,z]),paint=material(crateColors[i],.42,.5),rib=material(0x263d48,.5,.65);
 box(g,'Coloured steel cargo container',[6,4.2,8],[0,2.1,0],paint);
 for(let x=-2.55;x<=2.56;x+=.42)box(g,'Steel corrugation',[.09,4.05,8.04],[x,2.1,0],rib,{cast:false});
 for(let x of [-2.9,2.9])for(let zz of [-3.9,3.9])box(g,'Container corner post',[.22,4.25,.22],[x,2.1,zz],mats.dark);
 box(g,'Container roof rim',[6.05,.14,8.05],[0,4.18,0],mats.steel);
 box(g,'Container door seam',[.08,3.8,.08],[0,2.1,4.04],mats.white);
 g.userData={loaded:false,held:false,index:i};crates.push(g);
}

// The larger docked cargo vessel
const ship=group(scene,[33,0,0]);ship.userData.isShip=true;
const hull=box(ship,'Cargo ship hull',[28,8,72],[0,0,0],material(0x263f50,.48,.22));hull.position.y=0;
const bow= new THREE.Mesh(new THREE.ConeGeometry(14,15,4),material(0x263f50,.48,.2));bow.rotation.x=Math.PI/2;bow.rotation.z=Math.PI/4;bow.scale.set(1,.55,1);bow.position.set(0,-.3,-41);bow.castShadow=true;ship.add(bow);
box(ship,'Red waterline stripe',[28,.65,72],[0,-3.5,0],mats.red);
box(ship,'Main deck',[27.2,.7,70],[0,4.35,0],material(0x9b927e));
box(ship,'Deck edge trim',[28.5,.3,71],[0,4.0,0],mats.white);
for(let side of [-1,1]){box(ship,'Ship rail',[.28,1.35,68],[side*13.35,5.2,0],mats.white);for(let z=-32;z<=32;z+=4)cylinder(ship,'Rail stanchion',.09,.09,1.4,[side*13.35,5.2,z],mats.steel,8)}
// Empty cargo deck: all cargo must be loaded by the players at the port.
// Bridge and windows at stern
box(ship,'Bridge lower deck',[17,5,12],[0,7.2,28],mats.white);
box(ship,'Bridge glazing',[17.2,2.3,12.1],[0,8.4,28],mats.glass);
box(ship,'Bridge roof',[18,.7,13],[0,9.9,28],mats.yellow);
for(let x=-7;x<=7;x+=2.8)box(ship,'Bridge window mullion',[.18,2.4,.18],[x,8.4,21.95],mats.dark);
cylinder(ship,'Ship mast',.22,.3,8,[0,14,28],mats.white);
for(let i=0;i<3;i++)box(ship,'Mast antenna',[3,.12,.12],[0,15+i*.55,28],mats.dark);
box(ship,'Funnel',[4,8,5],[7,13,15],mats.red);box(ship,'Funnel cap',[4.3,.7,5.3],[7,17.2,15],mats.dark);
// Deck markings and package bay
box(ship,'Cargo bay marking',[8,.04,8],[0,4.73,0],mats.yellow,{cast:false});
box(ship,'Package securing platform',[4,.18,4],[0,4.85,0],mats.dark);
for(let x of [-2,2])for(let z of [-2,2])cylinder(ship,'Package tie-down',.16,.16,.35,[x,5.05,z],mats.yellow,8);
// gangway from dock onto ship
const ramp=box(scene,'Boarding gangway',[7,.55,5],[17.8,2.35,31],material(0x9a9c91));ramp.position.y=2.35;ramp.rotation.z=.28;
for(let x=15;x<=20;x+=1.5)box(scene,'Gangway handrail',[.14,1.15,.14],[x,3.0,28.6],mats.white);

// Side-mounted crane operator tower with an enclosed control room and climb-through hatch.
const towerX=-45,towerZ=0,towerFloor=10.5;
const craneTower=group(scene,[towerX,0,towerZ]);
for(const x of [-4.6,4.6])for(const z of [-3.6,3.6])box(craneTower,'Crane tower steel column',[.65,10.7,.65],[x,5.25,z],mats.yellow);
for(const y of [3.2,6.5,9.8])for(const x of [-4.6,4.6])box(craneTower,'Tower cross beam',[.3,.3,7.4],[x,y,0],mats.steel);
for(const x of [-4.6,4.6])box(craneTower,'Tower side brace',[.28,9,.28],[x,5,0],mats.steel).rotation.z=x<0?.3:-.3;
const craneRoom=group(scene,[towerX,towerFloor,towerZ]);
box(craneRoom,'Control room floor left',[3.4,.3,8],[-3.3,0,0],mats.dark);
box(craneRoom,'Control room floor right',[3.4,.3,8],[3.3,0,0],mats.dark);
box(craneRoom,'Control room floor rear',[6.8,.3,1.8],[0,0,-3.1],mats.dark);
box(craneRoom,'Control room floor front',[6.8,.3,.9],[0,0,3.55],mats.dark);
box(craneRoom,'Control room roof',[10,.35,8],[0,4.35,0],mats.dark);
for(const x of [-4.85,4.85])box(craneRoom,'Control room side wall',[.3,4.2,8],[x,2.1,0],mats.dark);
box(craneRoom,'Observation window lower frame',[9.6,.35,.25],[0,.45,-3.85],mats.yellow);
box(craneRoom,'Observation window upper frame',[9.6,.3,.25],[0,4.0,-3.85],mats.yellow);
box(craneRoom,'Panoramic observation window',[9.3,3.25,.12],[0,2.25,-3.82],mats.glass);
for(const x of [-3.2,-1.6,0,1.6,3.2])box(craneRoom,'Window mullion',[.12,3.3,.16],[x,2.25,-3.72],mats.steel);
box(craneRoom,'Left observation window',[.12,2.8,5.8],[-4.82,2.3,0],mats.glass);
box(craneRoom,'Right observation window',[.12,2.8,5.8],[4.82,2.3,0],mats.glass);
let trapdoorOpen=false;
const hatchPivot=group(craneRoom,[0,.18,2.35]);
const trapdoor=box(hatchPivot,'Crane tower trapdoor',[3.1,.18,1.55],[0,0,.78],mats.yellow);
cylinder(hatchPivot,'Trapdoor handle',.07,.07,.25,[1.15,.12,1.25],mats.black,8);
for(const x of [-.62,.62])box(scene,'Crane ladder side rail',[.18,10.7,.18],[towerX+x,5.25,4.45],mats.steel);
for(let y=.55;y<=10.1;y+=.72)box(scene,'Crane ladder rung',[1.45,.16,.2],[towerX,y,4.45],mats.yellow);
const craneConsole=group(scene,[towerX,towerFloor,towerZ]);
box(craneConsole,'Control panel cabinet',[3.8,1.35,.9],[0,.85,-2.25],mats.dark);
box(craneConsole,'Crane control panel top',[4,.18,1.05],[0,1.58,-2.25],mats.steel);
box(craneConsole,'Crane console display',[2.1,.9,.1],[0,2.12,-2.7],mats.glass);
box(craneConsole,'Console display frame',[2.35,1.12,.1],[0,2.12,-2.76],mats.yellow);
for(let x of [-1.35,-.75,.75,1.35])cylinder(craneConsole,'Crane control button',.12,.12,.14,[x,1.72,-1.9],mats.yellow,10);
cylinder(craneConsole,'Crane joystick',.1,.1,.48,[1.65,1.92,-2.05],mats.black,10);
const craneBayColors=[0xc94b3d,0x347da1,0x4d936c,0xd39a37];
const craneBayNames=['RED','BLUE','GREEN','YELLOW'];
const craneBayPositions=craneBayColors.map((color,i)=>({x:33,z:-24+i*16,color}));
for(let i=0;i<4;i++){const p=craneBayPositions[i],bayMat=material(p.color,.7,0);box(ship,'Colour-coded cargo bay floor',[7,.035,9],[0,4.72,p.z],bayMat,{cast:false});for(const z of [-4.45,4.45])box(ship,'Cargo bay boundary',[7,.08,.16],[0,4.78,p.z+z],mats.white,{cast:false});for(const x of [-3.45,3.45])box(ship,'Cargo bay boundary',[.16,.08,9],[x,4.78,p.z],mats.white,{cast:false});box(ship,'Cargo bay label plate',[2.4,.07,.65],[0,4.8,p.z-3.65],mats.dark,{cast:false});}

// Massive shore gantry crane spanning the cargo loading area
const crane=group(scene,[0,0,0]);crane.userData.mode=false;
const railLeft=box(crane,'Crane runway left',[2,1,78],[-34,0,0],mats.dark);railLeft.position.y=.55;
const railRight=box(crane,'Crane runway right',[2,1,78],[50,.55,0],mats.dark);
for(let x of [-34,50])for(let z of [-34,34]){box(crane,'Gantry leg',[2,20,2],[x,10,z],mats.yellow);box(crane,'Gantry foot',[5,1.2,5],[x,.6,z],mats.dark);box(crane,'Crane diagonal brace',[.8,13,.8],[x<0?-30:46,8,z],mats.steel)}
box(crane,'Crane rail left',[.8,.8,72],[-34,20,0],mats.steel);box(crane,'Crane rail right',[.8,.8,72],[50,20,0],mats.steel);
const bridge=box(crane,'Crane moving bridge',[2.4,1.8,88],[8,21,0],mats.yellow);bridge.rotation.y=Math.PI/2; // decorative span, trolley track
const trolley=group(scene,[0,0,0]);
box(trolley,'Trolley housing',[4,2.2,4],[0,0,0],mats.dark);
const cable=cylinder(trolley,'Crane cable',.09,.09,7,[0,-4.4,0],mats.black,8);
const hook= new THREE.Mesh(new THREE.TorusGeometry(.65,.16,8,16,Math.PI*1.65),mats.yellow);hook.rotation.z=Math.PI;hook.position.set(0,-8.2,0);trolley.add(hook);
let trolleyX=-24,trolleyZ=-24,hookY=8,craneMode=false,attachedCrate=null;
function updateCrane(){bridge.position.z=trolleyZ;trolley.position.set(trolleyX,21,trolleyZ);cable.scale.y=hookY/7;cable.position.y=-hookY/2;hook.position.y=-hookY-.3;}
updateCrane();

// Dock details: bollards, lights, pallets, parked equipment
for(let z=-35;z<=35;z+=18){const lamp=group(scene,[13,0,z]);cylinder(lamp,'Lamp post',.12,.16,8,[0,4,0],mats.dark);box(lamp,'Lamp head',[1.4,.3,.8],[0,8,0],mats.yellow);const light=new THREE.PointLight(0xffd89c,.5,12);light.position.set(0,7.7,0);lamp.add(light)}
for(let i=0;i<6;i++){const p=group(scene,[-76+(i%3)*9,.1,31+Math.floor(i/3)*7]);box(p,'Pallet',[5,.3,5],[0,0,0],mats.wood);for(let y=0;y<2;y++)box(p,'Pallet cargo',[3,1.1,3],[0,.7+y*1.2,0],i%2?mats.blue:mats.green)}
// Decorative port office
box(scene,'Port office',[19,9,15],[-91,4.5,-25],material(0x879c9a));box(scene,'Office roof',[20,.8,16],[-91,9.4,-25],mats.dark);for(let x=-98;x<=-84;x+=7)box(scene,'Office window',[.15,3,.2],[x,5,-17.4],mats.glass);

// Stylised dock-worker with more natural proportions and layered workwear.
const player=group(scene,[-78,0,-2]);player.userData.velocityY=0;
const skin=material(0xc88f6b),jacket=material(0x243e50),hiVis=material(0xf08a32),trim=material(0xf5d46c),trousers=material(0x344c61),boots=material(0x172b35),glove=material(0x303d43);
const body=new THREE.Mesh(new THREE.CapsuleGeometry(.34,.72,5,12),jacket);body.position.y=1.48;body.castShadow=true;player.add(body);
const vest=box(player,'Reflective work vest',[.78,.78,.46],[0,1.55,-.015],hiVis);
for(const x of [-.31,.31])box(player,'Reflective vest stripe',[.09,.72,.48],[x,1.55,-.03],trim,{cast:false});
box(player,'Vest reflective waist band',[.8,.1,.48],[0,1.25,-.02],trim,{cast:false});
cylinder(player,'Neck',.13,.15,.22,[0,2.0,0],skin,12);
const head=new THREE.Mesh(new THREE.SphereGeometry(.29,20,16),skin);head.position.set(0,2.28,0);head.scale.set(1,1.08,.95);head.castShadow=true;player.add(head);
const helmet=group(player,[0,2.55,0]);const helmetShell=new THREE.Mesh(new THREE.SphereGeometry(.34,20,12,0,Math.PI*2,0,Math.PI/2),mats.yellow);helmetShell.position.y=.04;helmet.add(helmetShell);box(helmet,'Hard hat brim',[.72,.08,.62],[0,.02,-.02],mats.yellow);
const eyeMat=material(0x172b35,.5),eyes=[];for(const x of [-.105,.105]){const eye=new THREE.Mesh(new THREE.SphereGeometry(.026,10,8),eyeMat);eye.position.set(x,2.31,-.273);player.add(eye);eyes.push(eye)}
box(player,'Nose',[.07,.1,.08],[0,2.23,-.29],skin);
const legL=group(player,[-.22,.83,0]),legR=group(player,[.22,.83,0]);
for(const leg of [legL,legR]){box(leg,'Work trousers',[.27,.72,.3],[0,-.28,0],trousers);box(leg,'Work boot',[.31,.22,.42],[0,-.68,-.045],boots)}
const armL=group(player,[-.49,1.78,0]),armR=group(player,[.49,1.78,0]);
for(const arm of [armL,armR]){const sleeve=cylinder(arm,'Work jacket sleeve',.16,.19,.72,[0,-.34,0],jacket,10);sleeve.rotation.z=.12;const hand=new THREE.Mesh(new THREE.SphereGeometry(.13,12,10),glove);hand.position.set(0,-.76,-.015);arm.add(hand)}
const heldVisual=group(player,[0,1.4,-1.0]);heldVisual.visible=false;const heldBox=box(heldVisual,'Carried special package',[.9,.8,.9],[0,0,0],material(0xd8b16b));box(heldVisual,'Package ribbon',[.12,.85,.94],[0,0,0],mats.red);
let packageCollected=false,packageSecured=false,started=false,firstPerson=false,locked=false,yaw=-.76,pitch=-.1,noticeTimer=0,walking=0;
let climbingLadder=false;
const keys={};const clock=new THREE.Clock();let nearest=null;
function say(text){message.textContent=text;message.style.opacity='1';noticeTimer=2.7}
function updateObjectives(){const count=crates.filter(c=>c.userData.loaded).length;$('#crate-count').textContent=count+' / 4';$('#crate-objective').classList.toggle('done',count===4);$('#package-state').textContent=packageCollected?'COLLECTED':'NOT COLLECTED';$('#package-objective').classList.toggle('done',packageCollected);$('#secure-state').textContent=packageSecured?'SECURED':'WAITING';$('#secure-objective').classList.toggle('done',packageSecured)}
function shipDeckAt(x,z){return x>19&&x<47&&Math.abs(z)<35}
function playerHeight(){const x=player.position.x,z=player.position.z;if(x>towerX-5&&x<towerX+5&&z>-4&&z<4)return towerFloor;if(shipDeckAt(x,z))return 4.75;if(x>14&&x<21&&z>27&&z<35){const t=THREE.MathUtils.clamp((x-14)/7,0,1);return t*4.75+.2}return .2}
function findTarget(){const p=player.position;let best=null,bestD=5.2;const near=(obj,pos,dist,action,label)=>{const d=p.distanceTo(new THREE.Vector3(...pos));if(d<dist&&d<bestD){bestD=d;best={obj,action,label,d}}};
 if(!packageCollected&&!packageSecured)near(packageMesh,[-61,1,-14],5.5,'package','Collect the special package');
 if(packageCollected&&!packageSecured&&shipDeckAt(p.x,p.z)&&Math.abs(p.x-33)<10&&Math.abs(p.z)<10)near(ship,[33,5,0],7,'secure','Secure the special package aboard');
 if(!craneMode&&p.y>10&&Math.abs(p.x-towerX)<2.5&&Math.abs(p.z-2.35)<2.4&&!trapdoorOpen)near(trapdoor,[towerX,10.6,2.35],3.2,'hatch','Press E to open the tower trapdoor');
 if(!craneMode&&p.y>10&&Math.abs(p.x-towerX)<3.2&&p.z<-.5)near(craneConsole,[towerX,12.2,-2.2],4.2,'crane','Use the crane control panel');
 if(!craneMode&&Math.abs(p.x-towerX)<2.2&&Math.abs(p.z-4.45)<2.1&&p.y<10)near(craneConsole,[towerX,2,4.45],4,'ladder','Walk to the ladder and hold W to climb');
 if(!craneMode&&!packageCollected)for(const c of crates)if(!c.userData.loaded&&!c.userData.held)near(c,c.position.toArray(),'crate','Inspect crate '+(c.userData.index+1));
 return best}
function setCamera(){ $('#mode-label').textContent=firstPerson?'FIRST PERSON':'THIRD PERSON';camera.rotation.order='YXZ';camera.rotation.set(pitch,yaw,0,'YXZ');cameraUpdate(0);}
function interact(){if(!nearest){say('Nothing close enough to interact with.');return}
 if(nearest.action==='crane'){craneMode=!craneMode;$('#area-name').textContent=craneMode?'CRANE CONTROL ROOM':'PORT TERMINAL';say(craneMode?'Control panel active. Look through the windows; WASD moves the crane bridge and trolley, R/F moves the hook, E attaches or releases a crate, Q exits.':'You step away from the control panel.');return}
 if(nearest.action==='hatch'){trapdoorOpen=true;hatchPivot.rotation.x=-Math.PI/2;hatchPivot.rotation.z=-.12;say('Trapdoor open. Hold W to climb through into the control room.');return}
 if(nearest.action==='ladder'){say('Hold W to climb the ladder. At the top, press E to open the trapdoor.');return}
 if(nearest.action==='package'){packageCollected=true;packageMesh.visible=false;heldVisual.visible=true;updateObjectives();say('Special package collected. Carry it aboard carefully.');return}
 if(nearest.action==='secure'){packageSecured=true;heldVisual.visible=false;packageMesh.position.set(33,5.1,0);packageMesh.visible=true;packageMesh.scale.set(.9,.9,.9);updateObjectives();say('Package secured! Keep it safe until delivery.');return}
 if(nearest.action==='crate'){say('Use the large port crane to lift this crate onto the ship.');return}
}
function attachOrRelease(){if(attachedCrate){const g=attachedCrate;g.userData.held=false;g.userData.heldByCrane=false;const bay=craneBayPositions[g.userData.index],nearBay=Math.hypot(trolleyX-bay.x,trolleyZ-bay.z)<5.1,lowEnough=hookY>17.4;if(nearBay&&lowEnough){g.userData.loaded=true;g.position.set(bay.x,4.75,bay.z);g.rotation.set(0,0,0);say(craneBayNames[g.userData.index]+' crate snapped into its matching bay!');}else{g.position.set(trolleyX,.12,trolleyZ);if(!nearBay)say('Move this crate close to its matching '+craneBayNames[g.userData.index]+' floor bay.');else say('Lower the hook close to the deck before releasing.')}attachedCrate=null;updateObjectives();return}
 const candidates=crates.filter(c=>!c.userData.loaded&&!c.userData.held);let chosen=null,distance=5.2;for(const c of candidates){const d=Math.hypot(c.position.x-trolleyX,c.position.z-trolleyZ);if(d<distance&&hookY>17.4){chosen=c;distance=d}}
 if(chosen){attachedCrate=chosen;chosen.userData.held=true;chosen.userData.heldByCrane=true;say('Crate attached. Lift it slowly and move it over the ship.')}else say('Lower the hook over a crate on the marked staging pads first.')}
function movePlayer(dt){if(!started||craneMode)return;
 const onLadder=Math.abs(player.position.x-towerX)<1.25&&Math.abs(player.position.z-4.45)<1.15;
 if(onLadder&&(keys.KeyW||keys.KeyS)&&!(player.position.y>=towerFloor-.05&&trapdoorOpen&&keys.KeyW)){
  climbingLadder=true;player.userData.velocityY=0;player.position.y=THREE.MathUtils.clamp(player.position.y+(keys.KeyW?1:-1)*5.2*dt,.2,towerFloor);
  if(player.position.y>=towerFloor-.05)player.position.y=towerFloor;
  yaw=0;player.rotation.y=0;
 }else{
  climbingLadder=false;
  const move=new THREE.Vector3();const forward=new THREE.Vector3(-Math.sin(yaw),0,-Math.cos(yaw)),right=new THREE.Vector3(Math.cos(yaw),0,-Math.sin(yaw));
  if(keys.KeyW)move.add(forward);if(keys.KeyS)move.sub(forward);if(keys.KeyD)move.add(right);if(keys.KeyA)move.sub(right);
  player.rotation.y=yaw;
  if(!trapdoorOpen&&player.position.y>10&&Math.abs(player.position.x-towerX)<2.2&&player.position.z>2.8&&keys.KeyW)move.set(0,0,0);
  if(move.lengthSq()){move.normalize().multiplyScalar((keys.ShiftLeft?7.2:5.2)*dt);player.position.add(move);walking+=dt*10;legL.rotation.x=Math.sin(walking)*.55;legR.rotation.x=-Math.sin(walking)*.55;armL.rotation.x=-Math.sin(walking)*.32;armR.rotation.x=Math.sin(walking)*.32}
  player.position.x=THREE.MathUtils.clamp(player.position.x,-112,47);player.position.z=THREE.MathUtils.clamp(player.position.z,-58,58);
  if(player.position.x>-48&&player.position.x<-43&&player.position.z>-31&&player.position.z<-9)player.position.x=-48;
  if(player.position.x>17.8&&player.position.x<19&&!shipDeckAt(player.position.x,player.position.z)&&!(player.position.z>27&&player.position.z<35))player.position.x=17.8;
  const floor=playerHeight(),vy=player.userData.velocityY||0;
  if(player.position.y<=floor+.025&&vy<=0){player.position.y=floor;player.userData.velocityY=0}
  else{player.userData.velocityY=vy-22*dt;player.position.y+=player.userData.velocityY*dt;if(player.position.y<floor){player.position.y=floor;player.userData.velocityY=0}}
 }
 if(packageCollected&&!packageSecured)heldVisual.position.set(0,1.45,-1.05);
}
function moveCrane(dt){if(!craneMode)return;const speed=12;if(keys.KeyA)trolleyX-=speed*dt;if(keys.KeyD)trolleyX+=speed*dt;if(keys.KeyW)trolleyZ-=speed*dt;if(keys.KeyS)trolleyZ+=speed*dt;if(keys.KeyR)hookY=Math.min(18.2,hookY+9*dt);if(keys.KeyF)hookY=Math.max(2,hookY-9*dt);trolleyX=THREE.MathUtils.clamp(trolleyX,-29,48);trolleyZ=THREE.MathUtils.clamp(trolleyZ,-32,32);updateCrane();if(attachedCrate){attachedCrate.position.set(trolleyX,22.8-hookY,trolleyZ);attachedCrate.rotation.y=0}}
function cameraUpdate(dt){for(const part of player.children)if(part!==armL&&part!==armR&&part!==heldVisual)part.visible=!firstPerson;const eye=player.position.clone().add(new THREE.Vector3(0,firstPerson?1.78:2.65,0));const forward=new THREE.Vector3(-Math.sin(yaw),0,-Math.cos(yaw));if(firstPerson){camera.position.copy(eye);camera.rotation.order='YXZ';camera.rotation.y=yaw;camera.rotation.x=pitch}else{const behind=forward.clone().multiplyScalar(-8);const desired=eye.clone().add(behind).add(new THREE.Vector3(0,3.6,0));camera.position.lerp(desired,1-Math.pow(.0001,dt));const target=eye.clone().add(forward.multiplyScalar(8)).add(new THREE.Vector3(0,Math.sin(pitch)*5,0));camera.lookAt(target)}}
function areaLabel(){const x=player.position.x;if(x<-47&&player.position.z<-8&&player.position.z>-34)return ['WAREHOUSE','SPECIAL PACKAGE'];if(Math.abs(x-towerX)<7&&player.position.y>9)return ['CRANE CONTROL TOWER',trapdoorOpen?'CONTROL ROOM':'TRAPDOOR'];if(x>15)return ['MV WAYFARER','CARGO DECK'];if(craneMode)return ['PORT CRANE','LOADING AREA'];return ['PORT TERMINAL','DOCKSIDE']}
function tick(){requestAnimationFrame(tick);const dt=Math.min(clock.getDelta(),.04),t=clock.elapsedTime;const pos=waterGeo.attributes.position;for(let i=0;i<pos.count;i++){const x=waterBase[i*3],z=waterBase[i*3+2];pos.array[i*3+1]=Math.sin(x*.04+t)*.28+Math.cos(z*.05+t*.7)*.2}pos.needsUpdate=true;waterGeo.computeVertexNormals();
 if(started){movePlayer(dt);moveCrane(dt);nearest=craneMode?{action:'crane-controls',label:'Crane controls'}:findTarget();if(craneMode){prompt.classList.remove('hidden');promptText.textContent='W/S crane bridge · A/D trolley · R lower · F raise hook · E attach/release · Q exit'}else if(nearest){prompt.classList.remove('hidden');promptText.textContent=nearest.label}else prompt.classList.add('hidden');const [a,b]=areaLabel();$('#area-name').textContent=a;$('#coordinates').textContent=b;cameraUpdate(dt)}
 if(noticeTimer>0){noticeTimer-=dt;if(noticeTimer<=0)message.style.opacity='0'}renderer.render(scene,camera)}
addEventListener('keydown',e=>{keys[e.code]=true;if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();if(e.code==='KeyC'&&started&&!craneMode){firstPerson=!firstPerson;setCamera()}if(e.code==='Space'&&started&&!craneMode&&!e.repeat&&!climbingLadder&&player.position.y<=playerHeight()+.04){player.userData.velocityY=8.5}if(e.code==='KeyE'&&started){if(craneMode)attachOrRelease();else interact()}if(e.code==='KeyQ'&&started&&craneMode){craneMode=false;for(const k in keys)keys[k]=false;say('Crane controls released. You can walk around again.')}if(e.code==='Escape'){locked=false;for(const k in keys)keys[k]=false;}if(e.code==='KeyF'&&started&&!craneMode)say('Shove: multiplayer player interactions will be added with online play.')});
addEventListener('keyup',e=>keys[e.code]=false);
renderer.domElement.addEventListener('click',()=>{if(started&&!locked)renderer.domElement.requestPointerLock()});document.addEventListener('pointerlockchange',()=>{locked=document.pointerLockElement===renderer.domElement;if(!locked)for(const k in keys)keys[k]=false});document.addEventListener('mousemove',e=>{if(!locked)return;yaw-=e.movementX*.0022;pitch=THREE.MathUtils.clamp(pitch-e.movementY*.0018,-.9,.55)});
$('#start').addEventListener('click',()=>{started=true;intro.classList.add('hidden');hud.classList.remove('hidden');renderer.domElement.requestPointerLock();say('Welcome to the port. Load the four crates and collect the package.')});
camera.position.set(-78,8,15);camera.lookAt(-60,3,-5);updateObjectives();tick();
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,2))});
