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
box(scene,'Dock apron',[32,1.2,92],[5,-.1,0],material(0x687c7d));
box(scene,'Quay edge',[1.4,2,94],[20,-.05,0],mats.white);
for(let z=-42;z<=42;z+=14){cylinder(scene,'Mooring bollard',.42,.48,1,[18.7,.5,z],mats.dark);box(scene,'Quay stripe',[.35,.04,5],[17.8,.55,z],mats.yellow)}
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
for(let i=0;i<4;i++){const z=-24+i*16;box(scene,'Crate staging pad',[8,.12,8],[-24,.08,z],material(0x596b68));box(scene,'Pad border',[8.3,.08,.18],[-24,.18,z-4],mats.yellow);box(scene,'Pad border',[8.3,.08,.18],[-24,.18,z+4],mats.yellow)}
const crateColors=[0xc58c4f,0x9e7449,0xc49a5e,0xb27d45];
const crates=[];
for(let i=0;i<4;i++){const z=-24+i*16;const g=group(scene,[-24,0,z]);const body=box(g,'Cargo crate',[3.4,3.1,3.4],[0,1.55,0],material(crateColors[i]));for(let x of [-1.2,1.2])box(g,'Crate reinforcement',[.16,3.15,3.48],[x,1.55,0],mats.dark);for(let zz of [-1.2,1.2])box(g,'Crate reinforcement',[3.48,3.15,.16],[0,1.55,zz],mats.dark);box(g,'Crate lid band',[3.45,.16,3.45],[0,3.05,0],mats.yellow);g.userData={loaded:false,held:false,index:i};crates.push(g)}

// The larger docked cargo vessel
const ship=group(scene,[29,0,0]);ship.userData.isShip=true;
const hull=box(ship,'Cargo ship hull',[28,8,72],[0,0,0],material(0x263f50,.48,.22));hull.position.y=0;
const bow= new THREE.Mesh(new THREE.ConeGeometry(14,15,4),material(0x263f50,.48,.2));bow.rotation.x=Math.PI/2;bow.rotation.z=Math.PI/4;bow.scale.set(1,.55,1);bow.position.set(0,-.3,-41);bow.castShadow=true;ship.add(bow);
box(ship,'Red waterline stripe',[28,.65,72],[0,-3.5,0],mats.red);
box(ship,'Main deck',[27.2,.7,70],[0,4.35,0],material(0x9b927e));
box(ship,'Deck edge trim',[28.5,.3,71],[0,4.0,0],mats.white);
for(let side of [-1,1]){box(ship,'Ship rail',[.28,1.35,68],[side*13.35,5.2,0],mats.white);for(let z=-32;z<=32;z+=4)cylinder(ship,'Rail stanchion',.09,.09,1.4,[side*13.35,5.2,z],mats.steel,8)}
// Fore and aft cargo containers, leaving a broad central working lane
const shipContainerColors=[mats.red,mats.blue,mats.green,mats.yellow];
for(let row=0;row<2;row++){for(let side of [-1,1]){const x=side*7.2,z=row===0?-20:20;const c=box(ship,'Container',[10,7,15],[x,8.1,z],shipContainerColors[row*2+(side===1?1:0)]);for(let zz=-6;zz<=6;zz+=1.2)box(ship,'Container corrugation',[10.04,6.6,.08],[x,8.1,z+zz],mats.dark,{cast:false})}}
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
const ramp=box(scene,'Boarding gangway',[14,.55,5],[12,2.05,31],material(0x9a9c91));ramp.rotation.z=-.2;
for(let x=6;x<=18;x+=2)box(scene,'Gangway handrail',[.14,1.15,.14],[x,2.9,28.6],mats.white);

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
let trolleyX=8,trolleyZ=0,hookY=8,craneMode=false,attachedCrate=null;
function updateCrane(){trolley.position.set(trolleyX,21-hookY,trolleyZ);cable.scale.y=hookY/7;cable.position.y=-hookY/2;hook.position.y=-hookY-.3;}
updateCrane();

// Dock details: bollards, lights, pallets, parked equipment
for(let z=-35;z<=35;z+=18){const lamp=group(scene,[13,0,z]);cylinder(lamp,'Lamp post',.12,.16,8,[0,4,0],mats.dark);box(lamp,'Lamp head',[1.4,.3,.8],[0,8,0],mats.yellow);const light=new THREE.PointLight(0xffd89c,.5,12);light.position.set(0,7.7,0);lamp.add(light)}
for(let i=0;i<6;i++){const p=group(scene,[-76+(i%3)*9,.1,31+Math.floor(i/3)*7]);box(p,'Pallet',[5,.3,5],[0,0,0],mats.wood);for(let y=0;y<2;y++)box(p,'Pallet cargo',[3,1.1,3],[0,.7+y*1.2,0],i%2?mats.blue:mats.green)}
// Decorative port office
box(scene,'Port office',[19,9,15],[-91,4.5,-25],material(0x879c9a));box(scene,'Office roof',[20,.8,16],[-91,9.4,-25],mats.dark);for(let x=-98;x<=-84;x+=7)box(scene,'Office window',[.15,3,.2],[x,5,-17.4],mats.glass);

// Player character
const player=group(scene,[-78,0,-2]);player.userData.velocityY=0;
const body= new THREE.Mesh(new THREE.CapsuleGeometry(.48,.95,5,10),material(0xe3a36c));body.position.y=1.45;body.castShadow=true;player.add(body);
const vest=box(player,'Hi-vis vest',[.95,.72,.55],[0,1.5,0],material(0xe27b32));
const head= new THREE.Mesh(new THREE.SphereGeometry(.36,18,14),material(0xd8a17c));head.position.y=2.45;head.castShadow=true;player.add(head);
const helmet= new THREE.Mesh(new THREE.SphereGeometry(.4,18,10,0,Math.PI*2,0,Math.PI/2),mats.yellow);helmet.position.y=2.62;player.add(helmet);
const legL=box(player,'Left leg',[.27,.75,.32],[-.25,.55,0],mats.blue),legR=box(player,'Right leg',[.27,.75,.32],[.25,.55,0],mats.blue);
const heldVisual=group(player,[0,1.4,-1.0]);heldVisual.visible=false;const heldBox=box(heldVisual,'Carried special package',[.9,.8,.9],[0,0,0],material(0xd8b16b));box(heldVisual,'Package ribbon',[.12,.85,.94],[0,0,0],mats.red);
let packageCollected=false,packageSecured=false,started=false,firstPerson=false,locked=false,yaw=0,pitch=-.1,noticeTimer=0,walking=0;
const keys={};const clock=new THREE.Clock();let nearest=null;
function say(text){message.textContent=text;message.style.opacity='1';noticeTimer=2.7}
function updateObjectives(){const count=crates.filter(c=>c.userData.loaded).length;$('#crate-count').textContent=count+' / 4';$('#crate-objective').classList.toggle('done',count===4);$('#package-state').textContent=packageCollected?'COLLECTED':'NOT COLLECTED';$('#package-objective').classList.toggle('done',packageCollected);$('#secure-state').textContent=packageSecured?'SECURED':'WAITING';$('#secure-objective').classList.toggle('done',packageSecured)}
function shipDeckAt(x,z){return x>15&&x<43&&Math.abs(z)<35}
function playerHeight(){const x=player.position.x,z=player.position.z;if(shipDeckAt(x,z))return 4.75;if(x>5&&x<19&&z>25&&z<36){const t=THREE.MathUtils.clamp((x-5)/14,0,1);return t*4.75+.2}return .2}
function findTarget(){const p=player.position;let best=null,bestD=5.2;const near=(obj,pos,dist,action,label)=>{const d=p.distanceTo(new THREE.Vector3(...pos));if(d<dist&&d<bestD){bestD=d;best={obj,action,label,d}}};
 if(!packageCollected&&!packageSecured)near(packageMesh,[-61,1,-14],5.5,'package','Collect the special package');
 if(packageCollected&&!packageSecured&&shipDeckAt(p.x,p.z)&&Math.abs(p.x-29)<10&&Math.abs(p.z)<10)near(ship,[29,5,0],7,'secure','Secure the special package aboard');
 if(!craneMode)near(crane,[-5,1,0],6,'crane','Operate the port crane');
 if(craneMode)near(crane,[-5,1,0],6,'crane','Leave crane controls');
 if(!craneMode&&!packageCollected)for(const c of crates)if(!c.userData.loaded&&!c.userData.held)near(c,c.position.toArray(),'crate','Inspect crate '+(c.userData.index+1));
 return best}
function setCamera(){ $('#mode-label').textContent=firstPerson?'FIRST PERSON':'THIRD PERSON';}
function interact(){if(!nearest){say('Nothing close enough to interact with.');return}
 if(nearest.action==='crane'){craneMode=!craneMode;$('#area-name').textContent=craneMode?'PORT CRANE CONTROLS':'PORT TERMINAL';say(craneMode?'Crane controls: W/S move along dock · A/D move across · R/F raise/lower · E attach or release':'You step away from the crane controls.');return}
 if(nearest.action==='package'){packageCollected=true;packageMesh.visible=false;heldVisual.visible=true;updateObjectives();say('Special package collected. Carry it aboard carefully.');return}
 if(nearest.action==='secure'){packageSecured=true;heldVisual.visible=false;packageMesh.position.set(29,5.1,0);packageMesh.visible=true;packageMesh.scale.set(.9,.9,.9);updateObjectives();say('Package secured! Keep it safe until delivery.');return}
 if(nearest.action==='crate'){say('Use the large port crane to lift this crate onto the ship.');return}
}
function attachOrRelease(){if(attachedCrate){const g=attachedCrate;g.userData.held=false;g.userData.heldByCrane=false;g.position.set(trolleyX,Math.max(.1,21-hookY-1.7),trolleyZ);if(trolleyX>15&&trolleyX<43&&Math.abs(trolleyZ)<33&&hookY<14){g.userData.loaded=true;g.position.set(trolleyX,5.0,trolleyZ);g.rotation.y=0;say('Crate '+(g.userData.index+1)+' loaded aboard!');}else{g.position.y=1.6;say('Crate set down on the dock. Move it over the ship to load it.')}attachedCrate=null;updateObjectives();return}
 const candidates=crates.filter(c=>!c.userData.loaded&&!c.userData.held);let chosen=null,distance=4.3;for(const c of candidates){const d=Math.hypot(c.position.x-trolleyX,c.position.z-trolleyZ);if(d<distance&&hookY>13){chosen=c;distance=d}}
 if(chosen){attachedCrate=chosen;chosen.userData.held=true;chosen.userData.heldByCrane=true;say('Crate attached. Lift it slowly and move it over the ship.')}else say('Lower the hook over a crate on the marked staging pads first.')}
function movePlayer(dt){if(!started)return;const move=new THREE.Vector3();const forward=new THREE.Vector3(Math.sin(yaw),0,-Math.cos(yaw)),right=new THREE.Vector3(Math.cos(yaw),0,Math.sin(yaw));if(keys.KeyW)move.add(forward);if(keys.KeyS)move.sub(forward);if(keys.KeyD)move.add(right);if(keys.KeyA)move.sub(right);if(move.lengthSq()){move.normalize().multiplyScalar((keys.ShiftLeft?9:6.2)*dt);player.position.add(move);player.rotation.y=yaw;walking+=dt*10;legL.rotation.x=Math.sin(walking)*.55;legR.rotation.x=-Math.sin(walking)*.55}
 player.position.x=THREE.MathUtils.clamp(player.position.x,-112,17.8);player.position.z=THREE.MathUtils.clamp(player.position.z,-58,58);
 // Do not walk into the warehouse walls; its front doorway is left open.
 if(player.position.x>-48&&player.position.x<-43&&player.position.z>-31&&player.position.z<-9){player.position.x=-48}
 // The quay is a solid edge except at the boarding ramp.
 if(player.position.x>19&& !shipDeckAt(player.position.x,player.position.z))player.position.x=19;
 player.position.y=playerHeight();
 if(packageCollected&&!packageSecured){heldVisual.position.set(0,1.45,-1.05)}
}
function moveCrane(dt){if(!craneMode)return;const speed=12;if(keys.KeyA)trolleyX-=speed*dt;if(keys.KeyD)trolleyX+=speed*dt;if(keys.KeyW)trolleyZ-=speed*dt;if(keys.KeyS)trolleyZ+=speed*dt;if(keys.KeyR)hookY=Math.max(2,hookY-9*dt);if(keys.KeyF)hookY=Math.min(17,hookY+9*dt);trolleyX=THREE.MathUtils.clamp(trolleyX,-29,45);trolleyZ=THREE.MathUtils.clamp(trolleyZ,-32,32);updateCrane();if(attachedCrate){attachedCrate.position.set(trolleyX,21-hookY-1.7,trolleyZ);attachedCrate.rotation.y=0}}
function cameraUpdate(dt){const eye=player.position.clone().add(new THREE.Vector3(0,firstPerson?2.35:3.1,0));if(firstPerson){camera.position.copy(eye);camera.rotation.order='YXZ';camera.rotation.y=yaw;camera.rotation.x=pitch}else{const offset=new THREE.Vector3(0,4.8,10).applyAxisAngle(new THREE.Vector3(0,1,0),yaw);camera.position.lerp(eye.clone().add(offset),1-Math.pow(.001,dt));const target=eye.clone().add(new THREE.Vector3(Math.sin(yaw)*6,Math.sin(pitch)*5,-Math.cos(yaw)*6));camera.lookAt(target)}}
function areaLabel(){const x=player.position.x;if(x<-47&&player.position.z<-8&&player.position.z>-34)return ['WAREHOUSE','SPECIAL PACKAGE'];if(x>15)return ['MV WAYFARER','CARGO DECK'];if(craneMode)return ['PORT CRANE','LOADING AREA'];return ['PORT TERMINAL','DOCKSIDE']}
function tick(){requestAnimationFrame(tick);const dt=Math.min(clock.getDelta(),.04),t=clock.elapsedTime;const pos=waterGeo.attributes.position;for(let i=0;i<pos.count;i++){const x=waterBase[i*3],z=waterBase[i*3+2];pos.array[i*3+1]=Math.sin(x*.04+t)*.28+Math.cos(z*.05+t*.7)*.2}pos.needsUpdate=true;waterGeo.computeVertexNormals();
 if(started){movePlayer(dt);moveCrane(dt);nearest=craneMode?{action:'crane-controls',label:'Crane controls'}:findTarget();if(craneMode){prompt.classList.remove('hidden');promptText.textContent='W/S bridge · A/D trolley · R/F hook · E attach/release'}else if(nearest){prompt.classList.remove('hidden');promptText.textContent=nearest.label}else prompt.classList.add('hidden');const [a,b]=areaLabel();$('#area-name').textContent=a;$('#coordinates').textContent=b;cameraUpdate(dt)}
 if(noticeTimer>0){noticeTimer-=dt;if(noticeTimer<=0)message.style.opacity='0'}renderer.render(scene,camera)}
addEventListener('keydown',e=>{keys[e.code]=true;if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();if(e.code==='KeyC'&&started&&!craneMode){firstPerson=!firstPerson;setCamera()}if(e.code==='KeyE'&&started){if(craneMode)attachOrRelease();else interact()}if(e.code==='Escape')locked=false;if(e.code==='KeyF'&&started&&!craneMode)say('Shove: multiplayer player interactions will be added with online play.')});
addEventListener('keyup',e=>keys[e.code]=false);
renderer.domElement.addEventListener('click',()=>{if(started&&!locked)renderer.domElement.requestPointerLock()});document.addEventListener('pointerlockchange',()=>locked=document.pointerLockElement===renderer.domElement);document.addEventListener('mousemove',e=>{if(!locked||craneMode)return;yaw-=e.movementX*.0022;pitch=THREE.MathUtils.clamp(pitch-e.movementY*.0018,-.9,.55)});
$('#start').addEventListener('click',()=>{started=true;intro.classList.add('hidden');hud.classList.remove('hidden');renderer.domElement.requestPointerLock();say('Welcome to the port. Load the four crates and collect the package.')});
camera.position.set(-78,8,15);camera.lookAt(-60,3,-5);updateObjectives();tick();
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,2))});
