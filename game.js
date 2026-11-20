import * as THREE from 'three';

const mount = document.querySelector('#game');
const titleCard = document.querySelector('#title-card');
const startButton = document.querySelector('#start-button');
const hud = document.querySelector('#hud');
const prompt = document.querySelector('#prompt');
const notice = document.querySelector('#notice');
const cameraLabel = document.querySelector('#camera-label');
const headingText = document.querySelector('#heading');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x8fc3d3);
scene.fog = new THREE.Fog(0x8fc3d3, 90, 360);

const camera = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, 0.1, 900);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
mount.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xc9edff, 0x294454, 2.0));
const sun = new THREE.DirectionalLight(0xffedcf, 2.4);
sun.position.set(-55, 90, 35);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -100; sun.shadow.camera.right = 100;
sun.shadow.camera.top = 100; sun.shadow.camera.bottom = -100;
scene.add(sun);

const mat = (color, roughness=.78, metalness=0) => new THREE.MeshStandardMaterial({color, roughness, metalness});
const oceanMat = new THREE.MeshStandardMaterial({color:0x167c9a, roughness:.34, metalness:.12, flatShading:true});
const waterGeo = new THREE.PlaneGeometry(900,900,110,110);
waterGeo.rotateX(-Math.PI/2);
const water = new THREE.Mesh(waterGeo,oceanMat);
water.position.y=-1.2; water.receiveShadow=true; scene.add(water);
const waterPositions = waterGeo.attributes.position;
const waterBase = Float32Array.from(waterPositions.array);

const ship = new THREE.Group();
scene.add(ship);

// Hull and main deck
const hull = new THREE.Mesh(new THREE.BoxGeometry(17,4.4,43),mat(0x263f50,.48,.25));
hull.position.set(0,1.0,0); hull.castShadow=true; hull.receiveShadow=true; ship.add(hull);
const bow = new THREE.Mesh(new THREE.ConeGeometry(8.5,9,4),mat(0x263f50,.48,.25));
bow.rotation.x=Math.PI/2; bow.rotation.z=Math.PI/4; bow.scale.set(1,.48,1); bow.position.set(0,1,-24); bow.castShadow=true; ship.add(bow);
const deck = new THREE.Mesh(new THREE.BoxGeometry(16.4,.55,42),mat(0x9a8063));
deck.position.set(0,3.35,0); deck.receiveShadow=true; deck.castShadow=true; ship.add(deck);
const deckTrim = new THREE.Mesh(new THREE.BoxGeometry(17.3,.35,43.5),mat(0xd6a85f));
deckTrim.position.set(0,3.05,0); ship.add(deckTrim);

// Side rails
for(const side of [-1,1]){
  const rail = new THREE.Mesh(new THREE.BoxGeometry(.22,1.1,42),mat(0xe1e4dc));
  rail.position.set(side*8.1,4.15,0); rail.castShadow=true; ship.add(rail);
  for(let z=-19;z<=20;z+=4){
    const post=new THREE.Mesh(new THREE.BoxGeometry(.22,1.25,.22),mat(0x4a6471));
    post.position.set(side*8.1,4.1,z); ship.add(post);
  }
}

// Bridge at the stern
const bridgeBase = new THREE.Mesh(new THREE.BoxGeometry(12,4.2,10),mat(0xd9ded8));
bridgeBase.position.set(0,5.65,14); bridgeBase.castShadow=true; bridgeBase.receiveShadow=true; ship.add(bridgeBase);
const bridgeGlass = new THREE.Mesh(new THREE.BoxGeometry(12.1,1.8,10.1),mat(0x4c8999,.2,.35));
bridgeGlass.position.set(0,6.3,14); ship.add(bridgeGlass);
const bridgeRoof = new THREE.Mesh(new THREE.BoxGeometry(13, .55, 11),mat(0xf0a64b));
bridgeRoof.position.set(0,8.05,14); bridgeRoof.castShadow=true; ship.add(bridgeRoof);
const mast = new THREE.Mesh(new THREE.CylinderGeometry(.18,.28,7,8),mat(0xe7e8df));
mast.position.set(0,11.5,14); ship.add(mast);
for(let i=0;i<3;i++){const antenna=new THREE.Mesh(new THREE.BoxGeometry(2.8,.12,.12),mat(0x263f50));antenna.position.set(0,12.4+i*.5,14);ship.add(antenna);}

// Cargo containers
const containerColors=[0xd66b43,0x426d88,0xd4a34e,0x4d806f,0x9a5960,0x527f9b];
for(let row=0;row<2;row++){
  for(let col=0;col<2;col++){
    const c=new THREE.Mesh(new THREE.BoxGeometry(6.5,3.2,8.2),mat(containerColors[row*2+col]));
    c.position.set(col===0?-3.5:3.5,5.15,row===0?-5:-14);
    c.castShadow=true;c.receiveShadow=true;ship.add(c);
    for(let x=-2.7;x<=2.7;x+=.9){
      const rib=new THREE.Mesh(new THREE.BoxGeometry(.09,3,.08),mat(0x263f50));
      rib.position.set(c.position.x+x,5.15,c.position.z+4.12);ship.add(rib);
    }
  }
}

// Crane: pedestal, mast, rotating boom and hanging hook
const crane = new THREE.Group(); crane.position.set(-6.1,3.7,6); ship.add(crane);
const pedestal=new THREE.Mesh(new THREE.CylinderGeometry(1.1,1.35,1.3,12),mat(0x354c58));
pedestal.position.y=.65;pedestal.castShadow=true;crane.add(pedestal);
const tower=new THREE.Mesh(new THREE.BoxGeometry(1.1,7,1.1),mat(0xf0a64b));
tower.position.y=4.2;tower.castShadow=true;crane.add(tower);
const boomPivot=new THREE.Group();boomPivot.position.set(0,7.2,0);crane.add(boomPivot);
const boom=new THREE.Mesh(new THREE.BoxGeometry(1.05,.9,13),mat(0xe9a94f));
boom.position.z=-5.4;boom.castShadow=true;boomPivot.add(boom);
const brace=new THREE.Mesh(new THREE.BoxGeometry(.35,4,.35),mat(0x485f6a));
brace.position.set(0,-1.2,-4);brace.rotation.x=-.55;boomPivot.add(brace);
const cable=new THREE.Mesh(new THREE.CylinderGeometry(.045,.045,4,8),mat(0x182c38));
cable.position.set(0,-2.5,-11.3);boomPivot.add(cable);
const hook=new THREE.Mesh(new THREE.TorusGeometry(.42,.1,8,16,Math.PI*1.6),mat(0xf0b55f,.35,.5));
hook.rotation.z=Math.PI;hook.position.set(0,-4.7,-11.3);boomPivot.add(hook);
const crate=new THREE.Mesh(new THREE.BoxGeometry(2.6,2.4,2.6),mat(0xc18a4c));
crate.position.set(5,4.85,-19);crate.castShadow=true;crate.receiveShadow=true;ship.add(crate);
const crateStrap= new THREE.Mesh(new THREE.BoxGeometry(2.7,.12,2.7),mat(0x3a4850));crateStrap.position.set(5,6.1,-19);ship.add(crateStrap);

// Life rings and deck details
for(const x of [-7.8,7.8]){const ring=new THREE.Mesh(new THREE.TorusGeometry(.48,.13,8,18),mat(0xe5e4d7));ring.position.set(x,4.5,16);ring.rotation.y=Math.PI/2;ship.add(ring);}
for(let z=-21;z<20;z+=3){const seam=new THREE.Mesh(new THREE.BoxGeometry(15.8,.025,.035),mat(0x655b50));seam.position.set(0,3.64,z);ship.add(seam);}

const player = new THREE.Group();
const body = new THREE.Mesh(new THREE.CapsuleGeometry(.48,.8,5,10),mat(0xe1a15c));
body.position.y=1.35;body.castShadow=true;player.add(body);
const head = new THREE.Mesh(new THREE.SphereGeometry(.34,16,12),mat(0xd9a47d));
head.position.y=2.15;head.castShadow=true;player.add(head);
const vest = new THREE.Mesh(new THREE.BoxGeometry(.95,.65,.48),mat(0xe17a36));
vest.position.y=1.4;player.add(vest);
const legs = new THREE.Mesh(new THREE.BoxGeometry(.55,.65,.4),mat(0x263d51));
legs.position.y=.55;player.add(legs);
player.position.set(0,3.65,-1);
ship.add(player);

const keys={};
let yaw=0, pitch=-.12, firstPerson=false, started=false, locked=false;
let craneActive=false, craneAngle=0, hookHeight=4;
const clock=new THREE.Clock();
const raycaster=new THREE.Raycaster();
const center=new THREE.Vector2(0,0);
let noticeTimer=0;

function showNotice(text){
  notice.textContent=text;notice.style.opacity='1';noticeTimer=2.4;
}
function setCamera(){
  cameraLabel.textContent=firstPerson?'FIRST PERSON':'THIRD PERSON';
}
function updateCamera(dt){
  const eye=player.position.clone().add(new THREE.Vector3(0,firstPerson?2.05:2.6,0));
  const forward=new THREE.Vector3(Math.sin(yaw),0,-Math.cos(yaw));
  const target=eye.clone().add(forward.multiplyScalar(8));
  target.y+=Math.sin(pitch)*8;
  if(firstPerson){
    camera.position.copy(eye);
    camera.rotation.order='YXZ';camera.rotation.y=yaw;camera.rotation.x=pitch;
  }else{
    const offset=new THREE.Vector3(0,3.3,8.5);
    offset.applyAxisAngle(new THREE.Vector3(0,1,0),yaw);
    const desired=eye.clone().add(offset);
    camera.position.lerp(desired,1-Math.pow(.001,dt));
    camera.lookAt(target);
  }
}
function nearbyTarget(){
  const p=player.position;
  const candidates=[
    {name:'Ship steering wheel',desc:'Take the helm and steer the Wayfarer',pos:new THREE.Vector3(0,5.7,17),action:'helm'},
    {name:'Cargo crane controls',desc:'Operate the crane boom and hook',pos:new THREE.Vector3(-6,4,6),action:'crane'},
    {name:'Important package',desc:'A fragile delivery. Handle with care',pos:new THREE.Vector3(5,5,-19),action:'package'}
  ];
  let best=null,dist=4.2;
  for(const item of candidates){const d=p.distanceTo(item.pos);if(d<dist){dist=d;best=item;}}
  return best;
}
function interact(){
  const target=nearbyTarget();
  if(!target){showNotice('Nothing nearby to interact with.');return;}
  if(target.action==='helm')showNotice('The helm is ready. Ship steering arrives in Stage 3.');
  if(target.action==='crane'){
    craneActive=!craneActive;
    showNotice(craneActive?'Crane controls enabled · Arrow keys rotate · R/F raise or lower hook':'Crane controls released.');
  }
  if(target.action==='package')showNotice('PACKAGE STATUS: FRAGILE · Keep it dry and avoid hard impacts.');
}
function onKeyDown(e){
  keys[e.code]=true;
  if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();
  if(e.code==='KeyC'&&started){firstPerson=!firstPerson;setCamera();}
  if(e.code==='KeyE'&&started)interact();
  if(e.code==='Escape'){locked=false;}
}
function onKeyUp(e){keys[e.code]=false;}
addEventListener('keydown',onKeyDown);addEventListener('keyup',onKeyUp);
renderer.domElement.addEventListener('click',()=>{if(started&&!locked)renderer.domElement.requestPointerLock();});
document.addEventListener('pointerlockchange',()=>{locked=document.pointerLockElement===renderer.domElement;});
document.addEventListener('mousemove',e=>{
  if(!locked)return;
  yaw-=e.movementX*.0022;
  pitch=Math.max(-1.0,Math.min(.65,pitch-e.movementY*.0018));
});
startButton.addEventListener('click',()=>{
  started=true;titleCard.classList.add('hidden');hud.classList.remove('hidden');
  renderer.domElement.requestPointerLock();
  showNotice('Welcome aboard the Wayfarer. Take a look around.');
});
function updatePlayer(dt){
  if(!started)return;
  const move=new THREE.Vector3();
  const forward=new THREE.Vector3(Math.sin(yaw),0,-Math.cos(yaw));
  const right=new THREE.Vector3(Math.cos(yaw),0,Math.sin(yaw));
  if(keys.KeyW||keys.ArrowUp)move.add(forward);
  if(keys.KeyS||keys.ArrowDown)move.sub(forward);
  if(keys.KeyD||keys.ArrowRight)move.add(right);
  if(keys.KeyA||keys.ArrowLeft)move.sub(right);
  if(move.lengthSq()>0){
    move.normalize().multiplyScalar((keys.ShiftLeft?9:5.2)*dt);
    player.position.add(move);
    player.rotation.y=yaw;
  }
  // Keep the player on the walkable deck.
  player.position.x=THREE.MathUtils.clamp(player.position.x,-7.1,7.1);
  player.position.z=THREE.MathUtils.clamp(player.position.z,-20.3,20.2);
  player.position.y=3.65;
  if(craneActive){
    if(keys.ArrowLeft)craneAngle+=dt*.65;
    if(keys.ArrowRight)craneAngle-=dt*.65;
    if(keys.KeyR)hookHeight=Math.max(1,hookHeight-dt*2);
    if(keys.KeyF)hookHeight=Math.min(8,hookHeight+dt*2);
    boomPivot.rotation.y=craneAngle;
    cable.scale.y=hookHeight/4;
    cable.position.y=7.2-hookHeight/2;
    hook.position.y=7.2-hookHeight-.2;
  }
  const target=nearbyTarget();
  if(target){
    prompt.innerHTML='<b>[E]</b> '+target.name+' · '+target.desc;
    prompt.classList.remove('hidden');
  }else prompt.classList.add('hidden');
  headingText.textContent=String(Math.round((THREE.MathUtils.radToDeg(yaw)+360)%360)).padStart(3,'0')+'°';
}
function animateWater(t){
  for(let i=0;i<waterPositions.count;i++){
    const x=waterBase[i*3],z=waterBase[i*3+2];
    waterPositions.array[i*3+1]=Math.sin(x*.035+t*1.05)*.42+Math.cos(z*.045+t*.8)*.32+Math.sin((x+z)*.018+t*.55)*.25-1.2;
  }
  waterPositions.needsUpdate=true;waterGeo.computeVertexNormals();
}
function animate(){
  requestAnimationFrame(animate);
  const dt=Math.min(clock.getDelta(),.04),t=clock.elapsedTime;
  animateWater(t);
  ship.position.y=Math.sin(t*.8)*.12;
  ship.rotation.z=Math.sin(t*.65)*.008;
  ship.rotation.x=Math.sin(t*.52)*.006;
  updatePlayer(dt);
  updateCamera(dt);
  if(noticeTimer>0){noticeTimer-=dt;if(noticeTimer<=0)notice.style.opacity='0';}
  renderer.render(scene,camera);
}
camera.position.set(0,12,35);camera.lookAt(0,3,0);
animate();
addEventListener('resize',()=>{
  camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();
  renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,2));
});
