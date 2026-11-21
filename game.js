import * as THREE from 'three';

const $=s=>document.querySelector(s);
const mount=$('#game'),intro=$('#intro'),hud=$('#hud'),prompt=$('#interaction'),promptText=$('#interaction-text'),message=$('#message');
const scene=new THREE.Scene();scene.background=new THREE.Color(0x9bcbd4);scene.fog=new THREE.Fog(0x9bcbd4,105,330);
const camera=new THREE.PerspectiveCamera(68,innerWidth/innerHeight,.1,650);
const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;mount.appendChild(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xdaf5ff,0x4b5c50,2.0));
const sun=new THREE.DirectionalLight(0xffedcf,2.6);sun.position.set(-75,110,-35);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-115;sun.shadow.camera.right=115;sun.shadow.camera.top=115;sun.shadow.camera.bottom=-115;scene.add(sun);
const material=(color,roughness=.8,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
const mats={concrete:material(0x858e88),paint:material(0xe7dfca),yellow:material(0xe7ad45),dark:material(0x253c48),steel:material(0x657c83,.45,.45),red:material(0xb84d3c),blue:material(0x3c7088),green:material(0x54806c),wood:material(0xb9854b),glass:new THREE.MeshStandardMaterial({color:0x9edce8,roughness:.16,metalness:.05,transparent:true,opacity:.16,depthWrite:false,side:THREE.DoubleSide}),white:material(0xe5e6dc),black:material(0x172b35)};
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
 g.userData={loaded:false,held:false,index:i,bayIndex:i};crates.push(g);
}

// The MV Wayfarer: a shaped cargo vessel with a walkable four-level layout.
const ship=group(scene,[33,0,0]);ship.userData.isShip=true;
const hullMat=material(0x263f50,.42,.28),hullDark=material(0x172d3a,.5,.35),deckMat=material(0x9b927e),interiorWall=material(0xd7d4c8),interiorTrim=material(0x435b65),floorMat=material(0x596a6b),warmLight=material(0xf0d7a5);
function makeDeckPlate(parent,name,x1,x2,z1,z2,y,holes,mat){
 const shape=new THREE.Shape();shape.moveTo(x1,-z2);shape.lineTo(x2,-z2);shape.lineTo(x2,-z1);shape.lineTo(x1,-z1);shape.closePath();
 for(const [hx1,hx2,hz1,hz2] of holes){const hole=new THREE.Path();hole.moveTo(hx1,-hz2);hole.lineTo(hx1,-hz1);hole.lineTo(hx2,-hz1);hole.lineTo(hx2,-hz2);hole.closePath();shape.holes.push(hole)}
 const geo=new THREE.ShapeGeometry(shape,1);geo.rotateX(-Math.PI/2);const mesh=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color:mat.color,roughness:mat.roughness,metalness:mat.metalness,side:THREE.DoubleSide}));mesh.name=name;mesh.position.y=y;mesh.receiveShadow=true;parent.add(mesh);return mesh;
}
function makeHull(){
 const stations=[[-55,.7],[-48,13],[-36,18],[-15,20],[15,20],[36,19],[48,16],[53,13]];
 const ring=[[-1,4],[1,4],[.88,-1.5],[0,-9],[-.88,-1.5]];
 const verts=[],indices=[];
 for(const [z,w] of stations)for(const [x,y] of ring)verts.push(x*w,y,z);
 for(let s=0;s<stations.length-1;s++)for(let k=0;k<ring.length;k++){
  const a=s*ring.length+k,b=s*ring.length+(k+1)%ring.length,c=(s+1)*ring.length+(k+1)%ring.length,d=(s+1)*ring.length+k;
  indices.push(a,b,d,b,c,d);
 }
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));geo.setIndex(indices);geo.computeVertexNormals();
 const mesh=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color:0x263f50,roughness:.43,metalness:.25,side:THREE.DoubleSide}));mesh.name='Tapered steel cargo ship hull';mesh.castShadow=true;mesh.receiveShadow=true;ship.add(mesh);
}
makeHull();
// Continuous shaped deck with a pointed bow instead of a rectangular floating platform.
const deckShape=new THREE.Shape();deckShape.moveTo(-20,-50);deckShape.lineTo(20,-50);deckShape.lineTo(20,42);deckShape.lineTo(0,55);deckShape.lineTo(-20,42);deckShape.closePath();
for(const [hx1,hx2,hz1,hz2] of [[5,9,29,44],[-9,-5,28,44]]){const hole=new THREE.Path();hole.moveTo(hx1,-hz2);hole.lineTo(hx1,-hz1);hole.lineTo(hx2,-hz1);hole.lineTo(hx2,-hz2);hole.closePath();deckShape.holes.push(hole)}
const deckGeo=new THREE.ShapeGeometry(deckShape,1);deckGeo.rotateX(-Math.PI/2);
const deckMesh=new THREE.Mesh(deckGeo,new THREE.MeshStandardMaterial({color:0x9b927e,roughness:.9,side:THREE.DoubleSide}));deckMesh.name='Shaped main cargo deck with stairwell openings';deckMesh.position.y=4.35;deckMesh.receiveShadow=true;ship.add(deckMesh);
box(ship,'Deck bow reinforcement',[.5,.25,18],[0,4.18,-39],mats.steel);
box(ship,'Red waterline stripe',[.28,.35,91],[0,-1.7,0],mats.red);
for(const side of [-1,1]){
 for(let z=-40;z<=43;z+=4){const taper=z<-35?Math.max(13,20+(z+35)*.65):z>39?18-(z-39)*.6:20;cylinder(ship,'Hull side rubbing strake',.12,.12,1.2,[side*taper,-1.3,z],mats.white,8).rotation.x=Math.PI/2}
 // Main deck safety rail, with the bow rails following the taper.
 for(let z=-39;z<=43;z+=4){const taper=z<-35?Math.max(13,20+(z+35)*.65):20;box(ship,'Ship rail post',[.18,1.45,.18],[side*taper,5.1,z],mats.white)}
 box(ship,'Ship side handrail',[.22,.2,82],[side*19.6,5.8,2],mats.white);
}
for(let x=-15;x<=15;x+=5){box(ship,'Stern rail post',[.18,1.45,.18],[x,5.1,48],mats.white)}
box(ship,'Stern handrail',[30,.2,.22],[0,5.8,48],mats.white);
// Anchor housings, lifeboats, deck winches and exterior service fittings.
for(const side of [-1,1]){
 box(ship,'Anchor hawse plate',[.5,1.2,2],[side*15,-.1,-47],mats.steel);
 const anchor=group(ship,[side*15,-.7,-47]);cylinder(anchor,'Anchor shank',.13,.13,2,[0,0,0],mats.dark,8);box(anchor,'Anchor crossbar',[1.6,.16,.18],[0,-.75,0],mats.dark);
 const boat=group(ship,[side*14,7.1,19]);box(boat,'Lifeboat hull',[5,.8,2],[0,0,0],material(0xe8e4d5));box(boat,'Lifeboat canopy',[3.8,1.2,1.7],[0,.8,0],material(0xe2a64f));for(const x of [-2,2])box(ship,'Lifeboat davit',[.25,3,.25],[side*14+x,6.4,19],mats.steel);
 for(const z of [-33,38]){cylinder(ship,'Deck mooring winch',.75,.75,1.2,[side*14,5.1,z],mats.dark,12);cylinder(ship,'Winch drum',.9,.9,.45,[side*14,5.1,z],mats.steel,12).rotation.x=Math.PI/2}
}
// Main-deck deckhouse: open entrance into the stair lobby.
const deckhouse=group(ship,[0,0,0]);
box(deckhouse,'Deckhouse port wall',[.6,5.7,19],[-9.3,7.7,37.5],interiorWall);
box(deckhouse,'Deckhouse starboard wall',[.6,5.7,19],[9.3,7.7,37.5],interiorWall);
box(deckhouse,'Deckhouse aft wall left pier',[6,5.7,.6],[-6,7.7,47],interiorWall);
box(deckhouse,'Deckhouse aft wall right pier',[6,5.7,.6],[6,7.7,47],interiorWall);
box(deckhouse,'Deckhouse aft doorway lintel',[6,.55,.6],[0,10.25,47],mats.yellow);
box(deckhouse,'Deckhouse forward wall left',[6,5.7,.6],[-6,7.7,28],interiorWall);
box(deckhouse,'Deckhouse forward wall right',[6,5.7,.6],[6,7.7,28],interiorWall);
box(deckhouse,'Deckhouse front lintel',[6,.55,.65],[0,10.25,28],mats.yellow);
box(deckhouse,'Deckhouse roof overhang',[20,.45,20],[0,10.7,37.5],mats.dark);
for(const side of [-1,1])for(const z of [31,36,41,45]){box(deckhouse,'Deckhouse side window frame',[.22,1.6,2.8],[side*9.65,8.3,z],mats.dark);box(deckhouse,'Deckhouse side window glass',[.12,1.25,2.45],[side*9.63,8.3,z],mats.glass)}
// Upper bridge level with wraparound glazing, wheel, navigation console and radar.
makeDeckPlate(ship,'Bridge upper floor with stair opening',-9,9,28.5,46.5,10.95,[[5,9,29,44]],mats.dark);
for(const side of [-1,1])box(ship,'Bridge panoramic side glass',[.22,3.5,17],[side*9,12.95,37.5],mats.glass);
box(ship,'Bridge forward panoramic glass',[18,3.5,.22],[0,12.95,28.8],mats.glass);
box(ship,'Bridge aft panoramic glass',[18,3.5,.22],[0,12.95,46.2],mats.glass);
for(const x of [-9,9])for(const z of [29,46])cylinder(ship,'Bridge corner support',.16,.16,4,[x,12.9,z],mats.steel,10);
box(ship,'Bridge roof',[20,.65,19],[0,14.95,37.5],mats.white);
box(ship,'Bridge roof brow',[21,.22,2],[0,14.55,28],mats.yellow);
const wheelBase=cylinder(ship,'Steering console pedestal',.45,.55,1,[0,11.7,34],mats.steel,12);
const wheel=new THREE.Mesh(new THREE.TorusGeometry(.95,.09,10,32),mats.dark);wheel.name='Ship steering wheel';wheel.position.set(0,12.45,34);wheel.rotation.x=Math.PI/2;ship.add(wheel);
for(let i=0;i<8;i++){const a=i*Math.PI/4;box(ship,'Steering wheel spoke',[.12,.12,1.8],[Math.cos(a)*.0,12.45,34+Math.sin(a)*.0],mats.steel)}
box(ship,'Navigation console',[6,.9,1.2],[0,11.55,30.5],mats.dark);
for(let x=-2;x<=2;x+=1)box(ship,'Navigation display',[.75,.08,.48],[x,12.05,30.25],mats.glass);
const radarScreen=group(ship,[5,11.65,30.8]);
cylinder(radarScreen,'Radar display housing',1.45,1.45,.18,[0,0,0],mats.dark,32);
const radarDisc=new THREE.Mesh(new THREE.CircleGeometry(1.25,32),new THREE.MeshBasicMaterial({color:0x123f45}));radarDisc.rotation.x=-Math.PI/2;radarDisc.position.y=.12;radarScreen.add(radarDisc);
for(let r=.4;r<1.2;r+=.4){const ring=new THREE.Mesh(new THREE.RingGeometry(r,r+.018,48),new THREE.MeshBasicMaterial({color:0x4bd1a1,side:THREE.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.y=.14;radarScreen.add(ring)}
const radarBeam=new THREE.Mesh(new THREE.BoxGeometry(.025,.025,1.15),new THREE.MeshBasicMaterial({color:0x78ffbd}));radarBeam.position.set(0,.16,-.55);radarScreen.add(radarBeam);
cylinder(ship,'Bridge mast',.22,.28,9,[0,19,37.5],mats.white,12);
for(let i=0;i<3;i++)box(ship,'Mast antenna',[3,.12,.12],[0,22+i*.55,37.5],mats.dark);
box(ship,'Funnel',[5,9,6],[9,14,17],mats.red);box(ship,'Funnel cap',[5.3,.7,6.3],[9,18.7,17],mats.dark);
for(const side of [-1,1]){box(ship,'Funnel exhaust brace',[.35,5,.35],[side*3,12.5,17],mats.steel)}
// Two lower internal decks inside the extended hull.
makeDeckPlate(ship,'Accommodation deck floor with engine stair opening',-14.5,14.5,-11,27,-1.5,[[-9,-5,12,28]],floorMat);
box(ship,'Engine room floor',[29,.45,39],[0,-6.8,8],floorMat);
makeDeckPlate(ship,'Accommodation ceiling with stairwell opening',-14.5,14.5,-11,27,3.05,[[-9,-5,12,28]],interiorTrim);
box(ship,'Engine room ceiling',[29,.35,39],[0,-4.05,8],interiorTrim);
for(const x of [-14.2,14.2]){box(ship,'Accommodation outer bulkhead',[.5,4.6,39],[x,.75,8],interiorWall);box(ship,'Engine room outer bulkhead',[.5,5.1,39],[x,-3.8,8],interiorTrim)}
// Accommodation rooms: galley, infirmary, crew bunks and captain's cabin.
box(ship,'Crew corridor partition',[.35,4.4,27],[0,.75,8],interiorWall);
box(ship,'Crew corridor doorway header',[4,.35,.35],[0,2.65,21.5],interiorWall);
box(ship,'Galley counter',[6,1.1,1.3],[-9,.15,19],mats.dark);
for(let x=-11;x<=-7;x+=2)box(ship,'Galley cabinet',[1.5,1.5,1.2],[x,-.65,18],interiorWall);
box(ship,'Galley worktop',[6,.18,1.5],[-9,.95,18],mats.steel);
box(ship,'Galley sink',[1.2,.12,.8],[-10,.08,18],mats.dark);
box(ship,'Mess table',[4,.25,2],[-8,-.1,10],mats.wood);
for(const x of [-10,-6])for(const z of [8,12])box(ship,'Mess bench',[.65,.55,2],[x,-.45,z],mats.wood);
for(const x of [7,11]){box(ship,'Crew bunk frame',[3,.25,6],[x,-.85,17],mats.dark);box(ship,'Crew mattress',[2.8,.3,5.7],[x,-.58,17],material(0x9eb5b6));box(ship,'Crew bunk upper frame',[3,.2,6],[x,.25,17],mats.dark);box(ship,'Crew bunk upper mattress',[2.8,.25,5.7],[x,.48,17],material(0x9eb5b6))}
box(ship,'Infirmary partition',[.3,4.4,10],[4,.75,-2],interiorWall);
for(const z of [-5,1]){box(ship,'Infirmary bed frame',[2.2,.35,4],[8,-.8,z],mats.white);box(ship,'Infirmary mattress',[2.1,.25,3.8],[8,-.5,z],material(0xd8e0dc));box(ship,'Infirmary pillow',[1.3,.25,.8],[8,-.32,z-1.35],mats.white)}
box(ship,'Captain cabin partition',[.3,4.4,12],[-4,.75,-1],interiorWall);
box(ship,'Captain bed frame',[3,.35,5],[-9,-.8,-4],mats.wood);box(ship,'Captain bed mattress',[2.8,.3,4.8],[-9,-.5,-4],material(0x8a9eae));
box(ship,'Captain desk',[3,.9,1.2],[-9,-.15,4],mats.wood);box(ship,'Captain locker',[1.2,2.6,1.2],[-12,-.2,-5],interiorTrim);
// Engine room: large machinery, pipes, gauges and service walkways.
for(const x of [-8,0,8]){
 box(ship,'Main engine block',[4,3.2,8],[x,-5.05,8],mats.dark);
 for(let z=5;z<=11;z+=2)cylinder(ship,'Engine cylinder',.65,.65,1.1,[x,-3.2,z],mats.steel,12);
 box(ship,'Engine warning stripe',[4.1,.16,.3],[x,-3.35,4],mats.yellow);
}
for(const x of [-11,-5,5,11]){cylinder(ship,'Engine pipe',.22,.22,28,[x,-5.2,8],mats.yellow,10).rotation.x=Math.PI/2;for(const z of [-7,0,7,14,21])box(ship,'Pipe support',[.4,.3,.4],[x,-6.25,z],mats.steel)}
box(ship,'Engine control panel',[5,2.2,.6],[0,-5.1,-10],mats.dark);
for(let x=-1.7;x<=1.7;x+=.85){cylinder(ship,'Engine gauge',.28,.28,.12,[x,-4.45,-10],mats.glass,16);box(ship,'Engine control lever',[.12,.8,.12],[x,-5.1,-9.5],mats.yellow)}
// Warm practical lighting makes the lower decks readable when the player enters.
for(const [x,y,z,intensity,distance] of [[0,1,22,2.2,24],[-9,1,9,1.5,16],[8,1,17,1.6,18],[8,1,-3,1.6,18],[-9,-4.8,18,2.4,22],[0,-4.8,4,2.2,24],[9,-4.8,-5,1.8,18],[0,12.5,37,1.4,24]]){
 const light=new THREE.PointLight(0xffd5a0,intensity,distance);light.position.set(x,y,z);ship.add(light)
}
// Stair flights and landings: starboard goes up to the bridge; port descends to both lower decks.
function stairFlight(x,zStart,zEnd,yStart,yEnd,count,label){
 const stepDepth=Math.abs(zEnd-zStart)/count;
 for(let i=0;i<count;i++){const t=(i+.5)/count,z=zStart+(zEnd-zStart)*t,y=yStart+(yEnd-yStart)*t;box(ship,label+' stair tread',[3,.22,stepDepth+.08],[x,y,z],mats.wood);box(ship,label+' stair riser',[3,.35,.16],[x,y-.16,z+(zEnd<zStart?stepDepth/2:-stepDepth/2)],interiorTrim)}
 box(ship,label+' stair handrail',[.12,.12,Math.abs(zEnd-zStart)],[x-1.7,(yStart+yEnd)/2+1,(zStart+zEnd)/2],mats.steel);
 box(ship,label+' stair handrail',[.12,.12,Math.abs(zEnd-zStart)],[x+1.7,(yStart+yEnd)/2+1,(zStart+zEnd)/2],mats.steel);
}
stairFlight(7,44,29,4.85,10.65,12,'Bridge access');
stairFlight(-7,44,28,4.7,-1.35,14,'Accommodation access');
stairFlight(-7,28,12,-1.35,-6.65,12,'Engine access');
box(ship,'Accommodation stair landing',[4,.25,3],[-7,-1.35,28],mats.wood);
box(ship,'Engine stair landing',[4,.25,3],[-7,-6.65,12],mats.wood);
// Four colour-coded loading bays stay in their existing positions for crane compatibility.
const craneBayColors=[0xc94b3d,0x347da1,0x4d936c,0xd39a37];
const craneBayNames=['RED','BLUE','GREEN','YELLOW'];
const craneBayPositions=craneBayColors.map((color,i)=>({x:(i%2===0?-4.3:4.3),z:(i<2?-25:-14),color}));
for(let i=0;i<4;i++){const p=craneBayPositions[i],lineMat=material(p.color,.72,0);
 for(const x of [-3.15,3.15])box(ship,'Decorative coloured loading line',[.12,.035,8.8],[p.x+x,4.73,p.z],lineMat,{cast:false});
 for(const z of [-4.4,4.4])box(ship,'Decorative coloured loading line',[6.3,.035,.12],[p.x,4.73,p.z+z],lineMat,{cast:false});
}
// Side-mounted crane operator tower with an enclosed control room and climb-through hatch.
const towerX=-45,towerZ=0,towerFloor=10.5;
const craneTower=group(scene,[towerX,0,towerZ]);
for(const x of [-4.6,4.6])for(const z of [-3.6,3.6])box(craneTower,'Crane tower steel column',[.65,10.7,.65],[x,5.25,z],mats.yellow);
for(const y of [3.2,6.5,9.8])for(const x of [-4.6,4.6])box(craneTower,'Tower cross beam',[.3,.3,7.4],[x,y,0],mats.steel);
for(const x of [-4.6,4.6])box(craneTower,'Tower side brace',[.28,9,.28],[x,5,0],mats.steel).rotation.z=x<0?.3:-.3;
const craneRoom=group(scene,[towerX,towerFloor,towerZ]);
// Solid floor and an open entrance at the top of the ladder.
box(craneRoom,'Control room floor',[10,.3,8],[0,0,0],mats.dark);
box(craneRoom,'Control room roof',[10,.35,8],[0,4.35,0],mats.dark);
box(craneRoom,'Rear wall left pier',[.3,4.2,1.1],[-4.85,2.1,-3.45],mats.dark);
box(craneRoom,'Rear wall right pier',[.3,4.2,1.1],[-4.85,2.1,3.45],mats.dark);
box(craneRoom,'Rear window lower frame',[.3,.45,5.8],[-4.85,.45,0],mats.yellow);
box(craneRoom,'Rear window upper frame',[.3,.45,5.8],[-4.85,3.95,0],mats.yellow);
box(craneRoom,'Control room back wall',[9.7,4.2,.3],[0,2.1,-3.85],mats.dark);
box(craneRoom,'Front wall left pier',[3.8,4.2,.3],[-3.0,2.1,3.85],mats.dark);
box(craneRoom,'Front wall right pier',[3.8,4.2,.3],[3.0,2.1,3.85],mats.dark);
box(craneRoom,'Front doorway lintel',[2.2,.55,.3],[0,3.93,3.85],mats.yellow);
for(const z of [-3.6,3.6])box(craneRoom,'Control room side wall',[.3,4.2,.5],[4.85,2.1,z],mats.dark);
// Large window faces east, directly toward the ship and cargo deck.
box(craneRoom,'Forward window lower frame',[.3,.35,7.6],[4.85,.45,0],mats.yellow);
box(craneRoom,'Forward window upper frame',[.3,.3,7.6],[4.85,4.0,0],mats.yellow);
box(craneRoom,'Panoramic forward window',[.12,3.25,7.35],[4.82,2.25,0],mats.glass);
for(const z of [-2.8,-1.4,0,1.4,2.8])box(craneRoom,'Forward window mullion',[.16,3.3,.12],[4.72,2.25,z],mats.steel);
box(craneRoom,'Rear observation window',[.12,2.8,5.8],[-4.82,2.3,0],mats.glass);
for(const x of [-.62,.62])box(scene,'Crane ladder side rail',[.18,10.7,.18],[towerX+x,5.25,4.45],mats.steel);
for(let y=.55;y<=10.1;y+=.72)box(scene,'Crane ladder rung',[1.45,.16,.2],[towerX,y,4.45],mats.yellow);
// Control panel and monitor face east (+X), toward the ship.
const craneConsole=group(scene,[towerX,towerFloor,towerZ]);
box(craneConsole,'Control panel cabinet',[.9,1.35,3.8],[2.15,.85,0],mats.dark);
box(craneConsole,'Crane control desk',[1.05,.18,4.0],[2.2,1.58,0],mats.steel);
box(craneConsole,'Screen frame facing ship',[.12,1.05,2.25],[2.78,2.15,0],mats.yellow);
box(craneConsole,'Crane monitor facing ship',[.08,.88,2.05],[2.86,2.15,0],mats.glass);
for(let z of [-1.45,-.85,-.25,.35,.95,1.45])cylinder(craneConsole,'Crane control button',.12,.12,.14,[2.55,1.72,z],mats.yellow,10);
cylinder(craneConsole,'Crane joystick',.1,.1,.48,[2.55,1.95,-1.75],mats.black,10);
// Loading-bay definitions and deck markings were created above.

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
let packageCollected=false,packageSecured=false,started=false,firstPerson=false,locked=false,yaw=-.76,pitch=-.1,noticeTimer=0,walking=0,savedPlayerYaw=yaw;
let paused=false,adminFly=false,adminNoclip=false;
let climbingLadder=false;
const keys={};const clock=new THREE.Clock();let nearest=null;
function say(text){message.textContent=text;message.style.opacity='1';noticeTimer=2.7}
function updateObjectives(){const count=crates.filter(c=>c.userData.loaded).length;$('#crate-count').textContent=count+' / 4';$('#crate-objective').classList.toggle('done',count===4);$('#package-state').textContent=packageCollected?'COLLECTED':'NOT COLLECTED';$('#package-objective').classList.toggle('done',packageCollected);$('#secure-state').textContent=packageSecured?'SECURED':'WAITING';$('#secure-objective').classList.toggle('done',packageSecured)}
function shipDeckAt(x,z){return x>12&&x<54&&Math.abs(z)<52}
function playerHeight(){const x=player.position.x,z=player.position.z,sx=x-33;
 if(x>towerX-5&&x<towerX+5&&z>-5.5&&z<5.5&&player.position.y>9.5)return towerFloor;
 if(sx>-15&&sx<15&&z>27&&z<47){
  if(sx>5.5&&sx<9&&z<=44&&z>=29)return 4.85+(44-z)/15*5.8;
  if(sx>-9&&sx<-5.5&&z<=44&&z>=28)return 4.7-(44-z)/16*6.05;
  if(player.position.y>8.5)return 10.65;
  return 4.75;
 }
 if(sx>-15&&sx<15&&z>=12&&z<=28&&sx>-9&&sx<-5.5)return -1.35-(28-z)/16*5.3;
 if(sx>-14&&sx<14&&z>-11&&z<27){return player.position.y<-4.1?-6.65:-1.35}
 if(shipDeckAt(x,z))return 4.75;
 if(x>14&&x<21&&z>27&&z<35){const t=THREE.MathUtils.clamp((x-14)/7,0,1);return t*4.75+.2}
 return .2}
function findTarget(){const p=player.position;let best=null,bestD=5.2;const near=(obj,pos,dist,action,label)=>{const d=p.distanceTo(new THREE.Vector3(...pos));if(d<dist&&d<bestD){bestD=d;best={obj,action,label,d}}};
 if(!packageCollected&&!packageSecured)near(packageMesh,[-61,1,-14],5.5,'package','Collect the special package');
 if(packageCollected&&!packageSecured&&shipDeckAt(p.x,p.z)&&Math.abs(p.x-33)<10&&Math.abs(p.z)<10)near(ship,[33,5,0],7,'secure','Secure the special package aboard');
 if(!craneMode&&p.y>10&&Math.abs(p.x-towerX)<4.3&&p.x>towerX+1.1&&Math.abs(p.z)<2.5)near(craneConsole,[towerX+2.5,12.2,0],4.3,'crane','Press E to use the crane control panel');
 if(!craneMode&&Math.abs(p.x-towerX)<2.2&&Math.abs(p.z-4.45)<2.1&&p.y<10.4)near(craneConsole,[towerX,2,4.45],4,'ladder','Walk to the ladder and hold W to climb to the control room');
 if(!craneMode&&!packageCollected)for(const c of crates)if(!c.userData.loaded&&!c.userData.held)near(c,c.position.toArray(),'crate','Inspect crate '+(c.userData.index+1));
 return best}
function setCamera(){ $('#mode-label').textContent=firstPerson?'FIRST PERSON':'THIRD PERSON';camera.rotation.order='YXZ';camera.rotation.set(pitch,yaw,0,'YXZ');cameraUpdate(0);}
function interact(){if(!nearest){say('Nothing close enough to interact with.');return}
 if(nearest.action==='crane'){craneMode=!craneMode;if(craneMode){savedPlayerYaw=yaw;yaw=-Math.PI/2;pitch=0}else{yaw=savedPlayerYaw}$('#area-name').textContent=craneMode?'CRANE CONTROL ROOM':'PORT TERMINAL';say(craneMode?'Crane controls active. Press C to switch between the control-room and overhead crane views. WASD moves the crane, R/F moves the hook, E attaches or releases a crate, Q exits.':'You step away from the control panel.');return}
 if(nearest.action==='ladder'){say('Hold W to climb all the way to the control room, then walk through the open doorway.');return}
 if(nearest.action==='package'){packageCollected=true;packageMesh.visible=false;heldVisual.visible=true;updateObjectives();say('Special package collected. Carry it aboard carefully.');return}
 if(nearest.action==='secure'){packageSecured=true;heldVisual.visible=false;packageMesh.position.set(33,5.1,0);packageMesh.visible=true;packageMesh.scale.set(.9,.9,.9);updateObjectives();say('Package secured! Keep it safe until delivery.');return}
 if(nearest.action==='crate'){say('Use the large port crane to lift this crate onto the ship.');return}
}
function attachOrRelease(){if(attachedCrate){const g=attachedCrate,target=craneBayPositions[g.userData.bayIndex],onShipDeck=trolleyX>14&&trolleyX<52&&Math.abs(trolleyZ)<50,distanceToBay=Math.hypot(trolleyX-(33+target.x),trolleyZ-target.z);if(onShipDeck&&hookY<17.8){say('Lower the hook until the crate is down at deck level before releasing it.');return}g.userData.held=false;g.userData.heldByCrane=false;if(onShipDeck){if(distanceToBay<=5.2){g.userData.loaded=true;g.position.set(33+target.x,4.75,target.z);g.rotation.set(0,0,0);say('Crate lowered and snapped into its matching '+craneBayNames[g.userData.bayIndex]+' bay.')}else{g.position.set(trolleyX,4.75,trolleyZ);g.rotation.set(0,0,0);say('Crate lowered onto the deck. Move it closer to its matching coloured bay to snap it into place.')}}else{g.position.set(trolleyX,.12,trolleyZ);g.rotation.set(0,0,0);say('Crate set down on the dock. Move it over the ship deck to load it.')}attachedCrate=null;updateObjectives();return}
 const candidates=crates.filter(c=>!c.userData.loaded&&!c.userData.held);let chosen=null,distance=5.2;for(const c of candidates){const d=Math.hypot(c.position.x-trolleyX,c.position.z-trolleyZ);if(d<distance&&hookY>17.4){chosen=c;distance=d}}
 if(chosen){attachedCrate=chosen;chosen.userData.held=true;chosen.userData.heldByCrane=true;say('Crate attached. Lift it and line it up with its matching coloured bay in the 2x2 layout.')}else say('Lower the hook over a crate on the marked staging pads first.')}
function movePlayer(dt){if(!started||craneMode)return;
 const onLadder=Math.abs(player.position.x-towerX)<1.25&&Math.abs(player.position.z-4.45)<1.15;
 if(onLadder&&((keys.KeyW&&player.position.y<towerFloor-.05)||(keys.KeyS&&player.position.y>.2))){
  climbingLadder=true;player.userData.velocityY=0;player.position.y=THREE.MathUtils.clamp(player.position.y+(keys.KeyW?1:-1)*5.2*dt,.2,towerFloor);
  if(player.position.y>=towerFloor-.05)player.position.y=towerFloor;
  yaw=0;player.rotation.y=0;
 }else{
  climbingLadder=false;
  const move=new THREE.Vector3();const forward=new THREE.Vector3(-Math.sin(yaw),0,-Math.cos(yaw)),right=new THREE.Vector3(Math.cos(yaw),0,-Math.sin(yaw));
  if(keys.KeyW)move.add(forward);if(keys.KeyS)move.sub(forward);if(keys.KeyD)move.add(right);if(keys.KeyA)move.sub(right);
  player.rotation.y=yaw;

  if(move.lengthSq()){move.normalize().multiplyScalar((keys.ShiftLeft?7.2:5.2)*dt);player.position.add(move);walking+=dt*10;legL.rotation.x=Math.sin(walking)*.55;legR.rotation.x=-Math.sin(walking)*.55;armL.rotation.x=-Math.sin(walking)*.32;armR.rotation.x=Math.sin(walking)*.32}
  if(!adminNoclip){player.position.x=THREE.MathUtils.clamp(player.position.x,-112,56);player.position.z=THREE.MathUtils.clamp(player.position.z,-72,72);}
  if(player.position.x>-48&&player.position.x<-43&&player.position.z>-31&&player.position.z<-9)player.position.x=-48;
  if(!adminNoclip&&player.position.x>17.8&&player.position.x<19&&!shipDeckAt(player.position.x,player.position.z)&&!(player.position.z>27&&player.position.z<35))player.position.x=17.8;
  const floor=playerHeight(),vy=player.userData.velocityY||0;
  if(adminFly){const vertical=(keys.Space?1:0)-(keys.ShiftLeft?1:0);player.position.y+=vertical*7*dt;player.userData.velocityY=0}else if(player.position.y<=floor+.025&&vy<=0){player.position.y=floor;player.userData.velocityY=0}
  else{player.userData.velocityY=vy-22*dt;player.position.y+=player.userData.velocityY*dt;if(player.position.y<floor){player.position.y=floor;player.userData.velocityY=0}}
 }
 if(packageCollected&&!packageSecured)heldVisual.position.set(0,1.45,-1.05);
}
function moveCrane(dt){if(!craneMode)return;const speed=12;if(keys.KeyA)trolleyX-=speed*dt;if(keys.KeyD)trolleyX+=speed*dt;if(keys.KeyW)trolleyZ-=speed*dt;if(keys.KeyS)trolleyZ+=speed*dt;if(keys.KeyR)hookY=Math.min(18.2,hookY+9*dt);if(keys.KeyF)hookY=Math.max(2,hookY-9*dt);trolleyX=THREE.MathUtils.clamp(trolleyX,-29,48);trolleyZ=THREE.MathUtils.clamp(trolleyZ,-32,32);updateCrane();if(attachedCrate){attachedCrate.position.set(trolleyX,22.8-hookY,trolleyZ);attachedCrate.rotation.y=0}}
function cameraUpdate(dt){for(const part of player.children)if(part!==armL&&part!==armR&&part!==heldVisual)part.visible=!firstPerson;if(craneMode){if(firstPerson){camera.position.set(towerX+3.55,towerFloor+2.15,towerZ);camera.rotation.order='YXZ';camera.rotation.set(pitch,yaw,0,'YXZ')}else{const desired=new THREE.Vector3(trolleyX-13,34,trolleyZ+18);camera.position.lerp(desired,1-Math.pow(.0001,dt));camera.lookAt(trolleyX,14,trolleyZ)}return}const eye=player.position.clone().add(new THREE.Vector3(0,firstPerson?1.78:2.65,0));const forward=new THREE.Vector3(-Math.sin(yaw),0,-Math.cos(yaw));if(firstPerson){camera.position.copy(eye);camera.rotation.order='YXZ';camera.rotation.y=yaw;camera.rotation.x=pitch}else{const behind=forward.clone().multiplyScalar(-8);const desired=eye.clone().add(behind).add(new THREE.Vector3(0,3.6,0));camera.position.lerp(desired,1-Math.pow(.0001,dt));const target=eye.clone().add(forward.multiplyScalar(8)).add(new THREE.Vector3(0,Math.sin(pitch)*5,0));camera.lookAt(target)}}
function areaLabel(){const x=player.position.x;if(x<-47&&player.position.z<-8&&player.position.z>-34)return ['WAREHOUSE','SPECIAL PACKAGE'];if(Math.abs(x-towerX)<7&&player.position.y>9)return ['CRANE CONTROL TOWER','CONTROL ROOM'];if(x>15)return ['MV WAYFARER','CARGO DECK'];if(craneMode)return ['PORT CRANE','LOADING AREA'];return ['PORT TERMINAL','DOCKSIDE']}
function openPauseMenu(){paused=true;locked=false;if(document.pointerLockElement)document.exitPointerLock();for(const k in keys)keys[k]=false;$('#pause-menu').classList.remove('hidden');$('#pause-main').classList.remove('hidden');$('#pause-settings').classList.add('hidden')};function closePauseMenu(){paused=false;$('#pause-menu').classList.add('hidden');if(started)renderer.domElement.requestPointerLock()};$('#resume-game').addEventListener('click',closePauseMenu);$('#pause-settings-button').addEventListener('click',()=>{$('#pause-main').classList.add('hidden');$('#pause-settings').classList.remove('hidden')});$('#settings-back').addEventListener('click',()=>{$('#pause-settings').classList.add('hidden');$('#pause-main').classList.remove('hidden')});$('#admin-unlock').addEventListener('click',()=>{if($('#admin-code').value==='password'){$('#admin-lock').classList.add('hidden');$('#admin-tools').classList.remove('hidden');$('#admin-error').textContent='ADMIN ACCESS GRANTED';$('#admin-error').style.color='#82e0a5'}else{$('#admin-error').textContent='Incorrect code';$('#admin-error').style.color='#ff8c7c'}});$('#admin-code').addEventListener('keydown',e=>{if(e.key==='Enter')$('#admin-unlock').click()});$('#admin-fly').addEventListener('change',e=>{adminFly=e.target.checked;if(!adminFly&&player.position.y>playerHeight()+.1){player.position.y=playerHeight();player.userData.velocityY=0}say(adminFly?'Admin flight enabled. Space rises; Shift descends.':'Admin flight disabled.')});$('#admin-noclip').addEventListener('change',e=>{adminNoclip=e.target.checked;say(adminNoclip?'Admin noclip enabled.':'Admin noclip disabled.')});$('#admin-autoload').addEventListener('click',()=>{crates.forEach((g,i)=>{const p=craneBayPositions[i];g.userData.loaded=true;g.userData.held=false;g.userData.heldByCrane=false;g.position.set(33+p.x,4.75,p.z);g.rotation.set(0,0,0)});attachedCrate=null;packageCollected=true;packageSecured=true;packageMesh.position.set(33,5.1,0);packageMesh.visible=true;heldVisual.visible=false;updateObjectives();say('ADMIN: all four containers loaded and the special package secured.');closePauseMenu()});
function tick(){requestAnimationFrame(tick);const rawDt=Math.min(clock.getDelta(),.04),dt=paused?0:rawDt,t=clock.elapsedTime;const pos=waterGeo.attributes.position;for(let i=0;i<pos.count;i++){const x=waterBase[i*3],z=waterBase[i*3+2];pos.array[i*3+1]=Math.sin(x*.04+t)*.28+Math.cos(z*.05+t*.7)*.2}pos.needsUpdate=true;waterGeo.computeVertexNormals();
 if(started&&!paused){movePlayer(dt);moveCrane(dt);nearest=craneMode?{action:'crane-controls',label:'Crane controls'}:findTarget();if(craneMode){prompt.classList.remove('hidden');promptText.textContent='W/S crane bridge · A/D trolley · R lower · F raise hook · E attach/release · Q exit'}else if(nearest){prompt.classList.remove('hidden');promptText.textContent=nearest.label}else prompt.classList.add('hidden');const [a,b]=areaLabel();$('#area-name').textContent=a;$('#coordinates').textContent=b;cameraUpdate(dt)}
 if(noticeTimer>0){noticeTimer-=dt;if(noticeTimer<=0)message.style.opacity='0'}renderer.render(scene,camera)}
addEventListener('keydown',e=>{keys[e.code]=true;if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();if(e.code==='KeyC'&&started){firstPerson=!firstPerson;setCamera()}if(e.code==='Space'&&started&&!paused&&!adminFly&&!craneMode&&!e.repeat&&!climbingLadder&&player.position.y<=playerHeight()+.04){player.userData.velocityY=8.5}if(e.code==='KeyE'&&started){if(craneMode)attachOrRelease();else interact()}if(e.code==='KeyQ'&&started&&craneMode){craneMode=false;yaw=savedPlayerYaw;for(const k in keys)keys[k]=false;say('Crane controls released. You can walk around again.')}if(e.code==='Escape'&&started){e.preventDefault();if(paused)closePauseMenu();else openPauseMenu();}if(e.code==='KeyF'&&started&&!craneMode)say('Shove: multiplayer player interactions will be added with online play.')});
addEventListener('keyup',e=>keys[e.code]=false);
renderer.domElement.addEventListener('click',()=>{if(started&&!paused&&!locked)renderer.domElement.requestPointerLock()});document.addEventListener('pointerlockchange',()=>{locked=document.pointerLockElement===renderer.domElement;if(!locked)for(const k in keys)keys[k]=false});document.addEventListener('mousemove',e=>{if(!locked)return;yaw-=e.movementX*.0022;pitch=THREE.MathUtils.clamp(pitch-e.movementY*.0018,-.9,.55)});
$('#start').addEventListener('click',()=>{started=true;intro.classList.add('hidden');hud.classList.remove('hidden');renderer.domElement.requestPointerLock();say('Welcome to the port. Load the four crates and collect the package.')});
camera.position.set(-78,8,15);camera.lookAt(-60,3,-5);updateObjectives();tick();
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,2))});
