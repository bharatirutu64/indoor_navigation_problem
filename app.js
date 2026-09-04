const nodes = {
  entrance:{x:405,y:635,name:"First Floor Entrance",floor:1},
  bottomJ:{x:610,y:635,name:"Bottom Corridor Junction",floor:1},
  leftJ1:{x:405,y:215,name:"Left Corridor Junction 1",floor:1},
  leftJ2:{x:405,y:310,name:"Left Corridor Junction 2",floor:1},
  leftJ3:{x:405,y:405,name:"Left Corridor Junction 3",floor:1},
  leftJ4:{x:405,y:500,name:"Left Corridor Junction 4",floor:1},
  leftBottom:{x:405,y:590,name:"Left Bottom Junction",floor:1},
  rightJ1:{x:815,y:235,name:"Right Corridor Junction 1",floor:1},
  rightJ2:{x:815,y:325,name:"Right Corridor Junction 2",floor:1},
  rightJ3:{x:815,y:415,name:"Right Corridor Junction 3",floor:1},
  rightJ4:{x:815,y:505,name:"Right Corridor Junction 4",floor:1},
  rightBottom:{x:815,y:590,name:"Right Bottom Junction",floor:1},
  topJ:{x:405,y:170,name:"Top Corridor Junction",floor:1},
  stair:{x:350,y:140,name:"Staircase",floor:1},

  vlab:{x:250,y:165,name:"VLSI & Embedded Laboratory",floor:1},
  vlsi2:{x:327,y:165,name:"VLSI & Embedded Laboratory 2",floor:1},
  class101:{x:300,y:215,name:"Class Room 101",floor:1},
  class102:{x:300,y:310,name:"Class Room 102",floor:1},
  rd:{x:300,y:405,name:"Research & Development Centre",floor:1},
  class103:{x:300,y:500,name:"Class Room 103",floor:1},
  class104:{x:300,y:590,name:"Class Room 104",floor:1},
  startup:{x:310,y:665,name:"Startup Cell / Center",floor:1},

  class105:{x:815,y:150,name:"Class Room 105",floor:1},
  iot:{x:780,y:235,name:"IoT Laboratory",floor:1},
  programming:{x:780,y:325,name:"Programming Laboratory",floor:1},
  language:{x:780,y:415,name:"Language Laboratory",floor:1},
  network:{x:780,y:505,name:"Computer Network Laboratory",floor:1},
  microprocessor:{x:780,y:590,name:"Microprocessor Laboratory",floor:1},
  os:{x:815,y:665,name:"Operating System Laboratory",floor:1},

  tutorial:{x:467,y:665,name:"Tutorial Room",floor:1},
  db:{x:602,y:665,name:"Database Laboratory",floor:1},
  web:{x:745,y:665,name:"Web Technology Laboratory",floor:1}
};

const edges = [
  ["entrance","bottomJ"],["bottomJ","leftBottom"],["leftBottom","leftJ4"],["leftJ4","leftJ3"],
  ["leftJ3","leftJ2"],["leftJ2","leftJ1"],["leftJ1","topJ"],["topJ","rightJ1"],
  ["rightJ1","rightJ2"],["rightJ2","rightJ3"],["rightJ3","rightJ4"],["rightJ4","rightBottom"],
  ["rightBottom","bottomJ"],["leftBottom","entrance"],

  ["leftJ1","class101"],["leftJ2","class102"],["leftJ3","rd"],["leftJ4","class103"],["leftBottom","class104"],
  ["topJ","vlab"],["topJ","vlsi2"],["stair","topJ"],

  ["rightJ1","iot"],["rightJ2","programming"],["rightJ3","language"],["rightJ4","network"],
  ["rightBottom","microprocessor"],

  ["bottomJ","tutorial"],["bottomJ","db"],["bottomJ","web"],
  ["rightBottom","os"],["bottomJ","rightBottom"],

  ["class105","rightJ1"],["startup","entrance"]
];

const locationNames = Object.fromEntries(Object.entries(nodes).map(([id,n])=>[id,n.name]));
const startSelect=document.getElementById("start");
const destinationSelect=document.getElementById("destination");
const routeLine=document.getElementById("routeLine");
const userMarker=document.getElementById("userMarker");
const destinationMarker=document.getElementById("destinationMarker");
const instructionsList=document.getElementById("instructionsList");
const positionText=document.getElementById("positionText");

function buildGraph(){
  const graph={};
  Object.keys(nodes).forEach(id=>graph[id]=[]);
  edges.forEach(([a,b])=>{
    const w=Math.hypot(nodes[a].x-nodes[b].x,nodes[a].y-nodes[b].y);
    graph[a].push({id:b,w}); graph[b].push({id:a,w});
  });
  return graph;
}
const graph=buildGraph();

function distance(a,b){return Math.hypot(nodes[a].x-nodes[b].x,nodes[a].y-nodes[b].y)}

function aStar(start,goal){
  const open=new Set([start]), came={}, g={}, f={};
  Object.keys(nodes).forEach(id=>{g[id]=Infinity;f[id]=Infinity});
  g[start]=0; f[start]=distance(start,goal);

  while(open.size){
    let current=[...open].sort((a,b)=>f[a]-f[b])[0];
    if(current===goal){
      const path=[current];
      while(came[current]){current=came[current];path.unshift(current)}
      return path;
    }
    open.delete(current);
    for(const neighbor of graph[current]){
      const tentative=g[current]+neighbor.w;
      if(tentative<g[neighbor.id]){
        came[neighbor.id]=current;
        g[neighbor.id]=tentative;
        f[neighbor.id]=tentative+distance(neighbor.id,goal);
        open.add(neighbor.id);
      }
    }
  }
  return null;
}

function fillSelects(){
  const rooms=Object.keys(nodes).filter(id=>!id.startsWith("left")&&!id.startsWith("right")&&!id.startsWith("top")&&!["bottomJ"].includes(id));
  const options=rooms.map(id=>`<option value="${id}">${nodes[id].name}</option>`).join("");
  startSelect.innerHTML=options;
  destinationSelect.innerHTML=options;
  startSelect.value="entrance";
  destinationSelect.value="programming";
}
fillSelects();

function drawRoute(path){
  routeLine.setAttribute("points",path.map(id=>`${nodes[id].x},${nodes[id].y}`).join(" "));
  routeLine.style.strokeDasharray="18 8";
  routeLine.style.animation="dash 1s linear infinite";
  userMarker.setAttribute("cx",nodes[path[0]].x); userMarker.setAttribute("cy",nodes[path[0]].y);
  destinationMarker.setAttribute("cx",nodes[path[path.length-1]].x); destinationMarker.setAttribute("cy",nodes[path[path.length-1]].y);
  userMarker.setAttribute("visibility","visible");
  destinationMarker.setAttribute("visibility","visible");
}

function direction(a,b){
  const dx=nodes[b].x-nodes[a].x, dy=nodes[b].y-nodes[a].y;
  if(Math.abs(dx)>Math.abs(dy)) return dx>0?"right":"left";
  return dy>0?"down":"up";
}

function showInstructions(path){
  instructionsList.innerHTML="";
  const first=document.createElement("li");
  first.innerHTML=`Start at <b>${nodes[path[0]].name}</b>.`;
  instructionsList.appendChild(first);
  for(let i=1;i<path.length;i++){
    const li=document.createElement("li");
    const d=direction(path[i-1],path[i]);
    const meters=Math.round(distance(path[i-1],path[i])/10);
    li.textContent=`Walk ${d} for about ${Math.max(meters,2)} m.`;
    instructionsList.appendChild(li);
  }
  const end=document.createElement("li");
  end.innerHTML=`Arrive at <b>${nodes[path[path.length-1]].name}</b>.`;
  instructionsList.appendChild(end);
}

document.getElementById("routeBtn").addEventListener("click",()=>{
  const start=startSelect.value, goal=destinationSelect.value;
  if(start===goal){alert("Start and destination are the same.");return}
  const path=aStar(start,goal);
  if(!path){alert("No walkable route found.");return}
  drawRoute(path); showInstructions(path);
  positionText.textContent=`Current position: ${nodes[start].name}`;
});

document.getElementById("clearBtn").addEventListener("click",()=>{
  routeLine.setAttribute("points","");
  userMarker.setAttribute("visibility","hidden");
  destinationMarker.setAttribute("visibility","hidden");
  instructionsList.innerHTML="<li>Select start and destination.</li><li>Click <b>Find Route</b>.</li>";
});

document.getElementById("qrBtn").addEventListener("click",()=>{
  const qrLocations=["entrance","leftJ2","rightJ2","rightBottom","bottomJ"];
  const id=qrLocations[Math.floor(Math.random()*qrLocations.length)];
  startSelect.value=id;
  positionText.textContent=`QR scan detected: ${nodes[id].name}`;
  userMarker.setAttribute("cx",nodes[id].x); userMarker.setAttribute("cy",nodes[id].y);
  userMarker.setAttribute("visibility","visible");
});

let zoom=1;
function applyZoom(){document.getElementById("mapCanvas").style.transform=`scale(${zoom})`}
document.getElementById("zoomIn").onclick=()=>{zoom=Math.min(1.8,zoom+.15);applyZoom()};
document.getElementById("zoomOut").onclick=()=>{zoom=Math.max(.65,zoom-.15);applyZoom()};
document.getElementById("resetZoom").onclick=()=>{zoom=1;applyZoom()};

document.querySelectorAll(".room").forEach(room=>{
  room.addEventListener("click",()=>{
    const id=room.dataset.node;
    if(nodes[id]){destinationSelect.value=id; document.getElementById("routeBtn").click()}
  });
});

const style=document.createElement("style");
style.textContent="@keyframes dash{to{stroke-dashoffset:-26px}}";
document.head.appendChild(style);

// Draw small debug nodes only when ?debug=1 is in the URL.
if(new URLSearchParams(location.search).has("debug")){
  const layer=document.getElementById("nodeLayer");
  Object.entries(nodes).forEach(([id,n])=>{
    const c=document.createElementNS("http://www.w3.org/2000/svg","circle");
    c.setAttribute("cx",n.x);c.setAttribute("cy",n.y);c.setAttribute("r",4);c.setAttribute("fill","#f59e0b");
    c.setAttribute("title",id);layer.appendChild(c);
  });
}
