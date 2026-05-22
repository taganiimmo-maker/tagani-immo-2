import { useState, useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import { initializeApp } from "firebase/app";
import {
  getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signOut, onAuthStateChanged, sendPasswordResetEmail
} from "firebase/auth";
import {
  getDatabase, ref, set, get, push, onValue, off, update
} from "firebase/database";
import {
  getStorage, ref as sRef, uploadString, getDownloadURL
} from "firebase/storage";

/* ─── FIREBASE CONFIG — REPLACE WITH YOUR VALUES ─── */
const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL:       "https://YOUR_PROJECT_ID-default-rtdb.europe-west1.firebasedatabase.app",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId:             "YOUR_APP_ID"
};
const firebaseApp = initializeApp(firebaseConfig);
const auth    = getAuth(firebaseApp);
const db      = getDatabase(firebaseApp);
const storage = getStorage(firebaseApp);

/* ═══════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════ */
const GOLD = "#C9A84C";

const TR = {
  fr: {
    appName:"TAGANI IMMO", login:"Se Connecter", register:"S'inscrire",
    email:"Adresse email", password:"Mot de passe", name:"Nom complet",
    teamPin:"PIN d'équipe", loginBtn:"Connexion", registerBtn:"Créer mon compte",
    logout:"Déconnexion", newInspection:"+ Nouvelle Inspection",
    myInspections:"Mes Inspections", allInspections:"Toutes les Inspections",
    submit:"Soumettre", save:"Sauvegarder", cancel:"Annuler", back:"← Retour",
    address:"Adresse complète", region:"Région", prefecture:"Préfecture",
    commune:"Commune", propType:"Type de propriété", condition:"État général",
    bedrooms:"Chambres", bathrooms:"Salles de bain", livingRooms:"Salons",
    kitchens:"Cuisines", garages:"Garages", offices:"Bureaux",
    balconies:"Balcons", totalArea:"Surface habitable (m²)",
    landArea:"Surface terrain (m²)", price:"Prix de vente (GNF)",
    yearBuilt:"Année de construction", features:"Équipements",
    ownerName:"Nom", ownerFirst:"Prénom(s)", ownerPhone:"Téléphone",
    ownerNat:"Nationalité", ownerJob:"Profession", ownerIdType:"Type de pièce d'identité",
    ownerIdNum:"Numéro de la pièce", ownerRel:"Relation à la propriété",
    photoId:"Photo pièce d'identité", photos:"Photos", documents:"Documents",
    notes:"Notes", voiceNotes:"Notes vocales", plan2d:"Plan 2D",
    plan3d:"Vue 3D", land:"Terrain", chat:"Chat", profile:"Profil",
    home:"Accueil", admin:"Administration", agents:"Agents",
    pending:"En attente", active:"Actif", suspended:"Suspendu",
    approve:"Approuver", suspend:"Suspendre", reactivate:"Réactiver",
    draft:"Brouillon", submitted:"Soumise", excellent:"Excellent",
    good:"Bon", fair:"Correct", poor:"Mauvais", renovation:"À rénover",
    house:"Maison", apartment:"Appartement", villa:"Villa",
    land_type:"Terrain", commercial:"Commercial", warehouse:"Entrepôt",
    minPhotos:"Minimum 10 photos requises", photoAdded:"Photo ajoutée",
    recordHold:"Maintenir pour enregistrer", saved:"Sauvegardé",
    submitted_ok:"Inspection soumise!", error:"Erreur",
    darkMode:"Mode sombre", lightMode:"Mode clair", fr:"Français", en:"English",
    gpsActive:"GPS ACTIF", gpsWaiting:"GPS en attente...",
    teamChat:"Chat d'équipe", askAI:"Poser une question à l'IA",
    aiResponse:"Réponse IA", settings:"Paramètres", teamPinSetting:"PIN d'équipe",
    updatePin:"Mettre à jour le PIN", exportCsv:"Exporter CSV",
    tracking:"Suivi GPS", liveView:"Flux en direct",
    submissions:"Soumissions", noInspections:"Aucune inspection",
  },
  en: {
    appName:"TAGANI IMMO", login:"Sign In", register:"Register",
    email:"Email address", password:"Password", name:"Full name",
    teamPin:"Team PIN", loginBtn:"Sign In", registerBtn:"Create account",
    logout:"Sign Out", newInspection:"+ New Inspection",
    myInspections:"My Inspections", allInspections:"All Inspections",
    submit:"Submit", save:"Save", cancel:"Cancel", back:"← Back",
    address:"Full address", region:"Region", prefecture:"Prefecture",
    commune:"Commune", propType:"Property type", condition:"Condition",
    bedrooms:"Bedrooms", bathrooms:"Bathrooms", livingRooms:"Living rooms",
    kitchens:"Kitchens", garages:"Garages", offices:"Offices",
    balconies:"Balconies", totalArea:"Living area (m²)",
    landArea:"Land area (m²)", price:"Sale price (GNF)",
    yearBuilt:"Year built", features:"Features",
    ownerName:"Last name", ownerFirst:"First name(s)", ownerPhone:"Phone",
    ownerNat:"Nationality", ownerJob:"Occupation", ownerIdType:"ID type",
    ownerIdNum:"ID number", ownerRel:"Relation to property",
    photoId:"ID photo", photos:"Photos", documents:"Documents",
    notes:"Notes", voiceNotes:"Voice notes", plan2d:"2D Plan",
    plan3d:"3D View", land:"Land", chat:"Chat", profile:"Profile",
    home:"Home", admin:"Admin", agents:"Agents",
    pending:"Pending", active:"Active", suspended:"Suspended",
    approve:"Approve", suspend:"Suspend", reactivate:"Reactivate",
    draft:"Draft", submitted:"Submitted", excellent:"Excellent",
    good:"Good", fair:"Fair", poor:"Poor", renovation:"Needs work",
    house:"House", apartment:"Apartment", villa:"Villa",
    land_type:"Land", commercial:"Commercial", warehouse:"Warehouse",
    minPhotos:"Minimum 10 photos required", photoAdded:"Photo added",
    recordHold:"Hold to record", saved:"Saved",
    submitted_ok:"Inspection submitted!", error:"Error",
    darkMode:"Dark mode", lightMode:"Light mode", fr:"Français", en:"English",
    gpsActive:"GPS ACTIVE", gpsWaiting:"Waiting for GPS...",
    teamChat:"Team chat", askAI:"Ask the AI a question",
    aiResponse:"AI Response", settings:"Settings", teamPinSetting:"Team PIN",
    updatePin:"Update PIN", exportCsv:"Export CSV",
    tracking:"GPS Tracking", liveView:"Live feed",
    submissions:"Submissions", noInspections:"No inspections yet",
  }
};

const GUINEA_REGIONS = ["","Conakry","Kindia","Boké","Labé","Mamou","Faranah","Kankan","Nzérékoré"];
const GUINEA_PREFECTURES = {
  "Conakry":["Kaloum","Dixinn","Matam","Ratoma","Matoto"],
  "Kindia":["Kindia","Coyah","Dubréka","Forécariah","Télimélé"],
  "Boké":["Boké","Boffa","Fria","Gaoual","Koundara"],
  "Labé":["Labé","Dalaba","Mali","Pita","Tougué"],
  "Mamou":["Mamou","Dabola","Kissidougou"],
  "Faranah":["Faranah","Dinguiraye","Kouroussa","Siguiri"],
  "Kankan":["Kankan","Kérouané","Mandiana","Kinkira"],
  "Nzérékoré":["Nzérékoré","Beyla","Guéckédou","Lola","Macenta","Yomou"]
};
const GUINEA_COMMUNES = {
  "Kaloum":["Almamya","Sandervalia","Coronthie","Boulbinet","Tombo"],
  "Dixinn":["Coleah","Donka","Camayenne","Landréah","Minière","Belle-Vue","Hamdallaye"],
  "Matam":["Madina","Enco-5","Taouyah","Hafia","Dar-es-Salam","Enta","Kobaya"],
  "Ratoma":["Kipé","Sonfonia","Koloma","Bambeto","Gbessia","Kaporo","Lambanyi","Cosa","Simbaya"],
  "Matoto":["Kissosso","Nongo","Cimenterie","Sangoyah","Yimbaya","Matoto Centre"]
};

const GUINEA_DOCS_LAND = [
  {id:"tf",     label:"Titre Foncier (TF)"},
  {id:"bornage",label:"Plan de Bornage / Cadastral"},
  {id:"po",     label:"Permis d'Occuper (PO)"},
  {id:"nl",     label:"Attestation de Non-Litige"},
  {id:"taxe",   label:"Quittance Taxe Foncière (DGI)"},
  {id:"cession",label:"Attestation de Cession/Vente"},
  {id:"legal",  label:"Légalisation de Signature"},
  {id:"commune",label:"Attestation Commune/Mairie"},
];
const GUINEA_DOCS_HOUSE = [
  {id:"tf_h",   label:"Titre Foncier de la Parcelle"},
  {id:"permis", label:"Permis de Construire"},
  {id:"conf",   label:"Certificat de Conformité"},
  {id:"plan_a", label:"Plan Architectural Approuvé"},
  {id:"seg",    label:"Quittances SEG (Eau)"},
  {id:"edg",    label:"Quittances EDG (Électricité)"},
  {id:"acte",   label:"Acte de Vente Notarié"},
  {id:"hypo",   label:"Attestation Non-Hypothèque"},
  {id:"fiscal", label:"Attestation Fiscale (DGI)"},
];

const PROPERTY_FEATURES = [
  "Piscine","Sécurité/Gardien","Clôture Périmétrique","Forage / Puits",
  "Groupe Électrogène","Système Solaire","Caméras CCTV","Maison Connectée",
  "Jardin Paysager","Parking Multiple","Salle de Sport","Ascenseur",
  "Logement Gardien","Terrasse sur Toit","Climatisation Centrale",
  "Cuisine Ouverte","Dressing Walk-in","SdB Attenantes","Sols en Marbre",
  "Faux Plafond","Fibre Optique","Réservoir d'Eau","Home Cinéma","Aire de Jeux"
];

const SHOT_TYPES = [
  "Façade avant","Façade arrière","Salon","Cuisine","Chambre principale",
  "Autres chambres","Salle de bain","Garage","Jardin / Cour","Vue de la rue",
  "Équipement spécial","Dégâts / Problème","Terrain","Document","Autre"
];

const SHOT_COLORS = {
  "Façade avant":"#3d85c8","Façade arrière":"#2e7d9a","Salon":"#6d3b8e",
  "Cuisine":"#ca6f1e","Chambre principale":"#8e44ad","Autres chambres":"#7d3c98",
  "Salle de bain":"#1e8449","Garage":"#616a6b","Jardin / Cour":"#27ae60",
  "Vue de la rue":"#7f8c8d","Équipement spécial":"#d35400","Dégâts / Problème":"#c0392b",
  "Terrain":"#2e7d32","Document":"#1a5276","Autre":"#555555"
};

const ROOM_KEYS = ["bedrooms","bathrooms","livingRooms","kitchens","diningRooms","garages","offices","laundryRooms","balconies","storageRooms"];

const CSS_GLOBAL = `
  *{box-sizing:border-box;margin:0;padding:0;}
  ::-webkit-scrollbar{width:3px;}
  ::-webkit-scrollbar-thumb{background:#333;border-radius:2px;}
  input,select,textarea,button{font-family:inherit;}
  body{-webkit-font-smoothing:antialiased;}
`;

/* ═══════════════════════════════════════════════════
   HELPER FUNCTIONS
═══════════════════════════════════════════════════ */
function uid() { return Math.random().toString(36).slice(2,10); }

function fmtTime(ts) {
  if(!ts) return "";
  return new Date(ts).toLocaleTimeString("fr-GN",{hour:"2-digit",minute:"2-digit"});
}

function fmtDate(ts) {
  if(!ts) return "";
  return new Date(ts).toLocaleString("fr-GN",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"});
}

function fmtDuration(secs) {
  const m = Math.floor(secs/60);
  const s = String(secs%60).padStart(2,"0");
  return `${m}:${s}`;
}

function sanitizeStr(str) {
  if(typeof str !== "string") return str;
  return str.replace(/[\uD800-\uDFFF]/g,"").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,"");
}

function sanitizeObj(obj) {
  if(!obj || typeof obj !== "object") return obj;
  const out = {};
  for(const k in obj){
    const v = obj[k];
    if(typeof v === "string") out[k] = sanitizeStr(v);
    else if(typeof v === "object" && v !== null) out[k] = sanitizeObj(v);
    else out[k] = v;
  }
  return out;
}

function calcLandArea(pts) {
  if(!pts || pts.length < 3) return null;
  let a = 0;
  for(let i=0; i<pts.length; i++){
    const j=(i+1)%pts.length;
    a += pts[i].px * pts[j].py;
    a -= pts[j].px * pts[i].py;
  }
  const sqM = Math.abs(a/2) * 0.09;
  return {
    sqM:  sqM.toFixed(0),
    sqFt: (sqM*10.764).toFixed(0),
    acres:(sqM/4047).toFixed(4),
    ha:   (sqM/10000).toFixed(4)
  };
}

async function processPhoto(dataUrl, agentName, gpsCoords) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      const MAX = 1920;
      const scale = Math.min(1, MAX/img.width, MAX/img.height);
      const w = Math.round(img.width*scale);
      const h = Math.round(img.height*scale);
      const canvas = document.createElement("canvas");
      canvas.width=w; canvas.height=h;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img,0,0,w,h);
      // Watermark
      ctx.fillStyle="rgba(0,0,0,0.55)";
      ctx.fillRect(0, h-44, w, 44);
      ctx.fillStyle="#C9A84C";
      ctx.font=`bold ${Math.max(11,w/90)}px system-ui,sans-serif`;
      const ts = new Date().toLocaleString("fr-GN");
      const gpsText = gpsCoords ? `${gpsCoords.lat.toFixed(5)},${gpsCoords.lng.toFixed(5)}` : "";
      ctx.fillText(`TAGANI IMMO · ${agentName} · ${ts} · ${gpsText}`, 8, h-14);
      resolve(canvas.toDataURL("image/jpeg",0.85));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

function makeStyles(dark) {
  return {
    bg:    dark ? "#0d1117" : "#ffffff",
    bg2:   dark ? "#161b22" : "#f6f8fa",
    bg3:   dark ? "#1c2128" : "#ffffff",
    bdr:   dark ? "#30363d" : "#d0d7de",
    txt:   dark ? "#e6edf3" : "#1f2328",
    txt2:  dark ? "#8b949e" : "#656d76",
    card:  dark ? "#1c2128" : "#ffffff",
    inp:   dark ? "#0d1117" : "#ffffff",
    gold:  GOLD,
    green: "#27ae60",
    red:   "#e74c3c",
    blue:  "#58a6ff",
    orange:"#e67e22",
  };
}

/* ═══════════════════════════════════════════════════
   SUB-COMPONENTS
═══════════════════════════════════════════════════ */

function LocationSelector({ value, onChange, S }) {
  const reg  = value.region||"";
  const pref = value.pref||"";
  const com  = value.commune||"";
  const prefs = GUINEA_PREFECTURES[reg]||[];
  const coms  = GUINEA_COMMUNES[pref]||[];
  const selStyle = {
    width:"100%", padding:"10px 12px", borderRadius:8,
    border:`1px solid ${S.bdr}`, background:S.inp, color:S.txt,
    fontSize:14, marginBottom:6, outline:"none", appearance:"none",
    WebkitAppearance:"none", minHeight:46
  };
  return (
    <div>
      <select value={reg} onChange={e=>onChange({region:e.target.value,pref:"",commune:""})} style={selStyle}>
        <option value="">-- Région --</option>
        {GUINEA_REGIONS.filter(r=>r).map(r=><option key={r} value={r}>{r}</option>)}
      </select>
      {reg && (
        <select value={pref} onChange={e=>onChange({region:reg,pref:e.target.value,commune:""})} style={selStyle}>
          <option value="">-- Préfecture --</option>
          {prefs.map(p=><option key={p} value={p}>{p}</option>)}
        </select>
      )}
      {pref && (
        <select value={com} onChange={e=>onChange({region:reg,pref,commune:e.target.value})} style={selStyle}>
          <option value="">-- Commune --</option>
          {(coms.length ? coms : [pref+" Centre"]).map(c=><option key={c} value={c}>{c}</option>)}
        </select>
      )}
      {(reg||com) && (
        <div style={{padding:"5px 9px",background:S.bg,borderRadius:6,border:`1px solid ${GOLD}33`,fontSize:11,color:GOLD,fontFamily:"monospace",marginTop:4}}>
          📍 {[reg,pref,com].filter(Boolean).join(" › ")}
        </div>
      )}
    </div>
  );
}

function OwnerForm({ prop, onChange, S }) {
  const inp = {
    width:"100%", padding:"11px 13px", borderRadius:8,
    border:`1px solid ${S.bdr}`, background:S.inp, color:S.txt,
    fontSize:14, outline:"none", marginBottom:6, minHeight:48
  };
  const lbl = {
    color:S.txt2, fontSize:10, letterSpacing:.5,
    textTransform:"uppercase", display:"block", marginBottom:4, marginTop:8
  };
  const fields = [
    ["ownerName","Nom","DIALLO"],
    ["ownerFirst","Prénom(s)","Mamadou Alpha"],
    ["ownerPhone","Téléphone","+224 6XX XXX XXX"],
    ["ownerEmail","Email","owner@exemple.com"],
    ["ownerNat","Nationalité","Guinéenne"],
    ["ownerJob","Profession","Commerçant"],
  ];
  return (
    <div>
      {fields.map(([k,label,ph])=>(
        <div key={k}>
          <label style={lbl}>{label}</label>
          <input style={inp} value={prop[k]||""} onChange={e=>onChange(k,e.target.value)} placeholder={ph}/>
        </div>
      ))}
      <label style={lbl}>Type de pièce d'identité</label>
      <select style={{...inp}} value={prop.ownerIdType||""} onChange={e=>onChange("ownerIdType",e.target.value)}>
        <option value="">-- Sélectionnez --</option>
        {["CNI (Carte Nationale d'Identité)","Passeport","Permis de conduire","Carte de résident"].map(r=><option key={r}>{r}</option>)}
      </select>
      <label style={lbl}>Numéro de la pièce</label>
      <input style={inp} value={prop.ownerIdNum||""} onChange={e=>onChange("ownerIdNum",e.target.value)} placeholder="Numéro de la pièce d'identité"/>
      <label style={lbl}>Relation à la propriété</label>
      <select style={{...inp}} value={prop.ownerRel||""} onChange={e=>onChange("ownerRel",e.target.value)}>
        <option value="">-- Sélectionnez --</option>
        {["Propriétaire","Co-propriétaire","Représentant familial","Représentant légal","Agent immobilier","Locataire"].map(r=><option key={r}>{r}</option>)}
      </select>
    </div>
  );
}

function Canvas2D({ rooms, S }) {
  const canvasRef = useRef(null);
  useEffect(()=>{
    const cv = canvasRef.current;
    if(!cv) return;
    const ctx = cv.getContext("2d");
    const W=cv.width, H=cv.height;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle = S.bg2;
    ctx.fillRect(0,0,W,H);
    // Grid
    ctx.strokeStyle = S.bdr;
    ctx.lineWidth=0.5;
    for(let x=0;x<W;x+=20){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    for(let y=0;y<H;y+=20){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
    // Demo room layout
    const layout=[
      {x:20,y:15,w:130,h:95,color:"#3d85c8",label:"Salon"},
      {x:150,y:15,w:100,h:90,color:"#8e44ad",label:"Ch. Principale"},
      {x:250,y:15,w:75,h:90,color:"#1e8449",label:"SdB"},
      {x:20,y:110,w:90,h:95,color:"#ca6f1e",label:"Cuisine"},
      {x:110,y:110,w:100,h:95,color:"#8e44ad",label:"Chambre 2"},
      {x:210,y:110,w:115,h:95,color:"#c0392b",label:"Salle à manger"},
    ];
    layout.forEach(r=>{
      ctx.fillStyle=r.color+"44";
      ctx.fillRect(r.x,r.y,r.w,r.h);
      ctx.strokeStyle=r.color;
      ctx.lineWidth=2;
      ctx.strokeRect(r.x,r.y,r.w,r.h);
      ctx.fillStyle=r.color;
      ctx.font="bold 10px system-ui";
      ctx.textAlign="center";
      ctx.fillText(r.label,r.x+r.w/2,r.y+r.h/2+4);
    });
  },[S]);
  return (
    <div>
      <canvas ref={canvasRef} width={340} height={220}
        style={{width:"100%",borderRadius:8,border:`1px solid ${S.bdr}`,display:"block"}}/>
      <p style={{color:S.txt2,fontSize:11,marginTop:6}}>Dans l'app réelle : dessinez murs et pièces en glissant votre doigt (snap-to-grid activé).</p>
    </div>
  );
}

function Canvas3D({ S }) {
  const mountRef = useRef(null);
  useEffect(()=>{
    const el = mountRef.current;
    if(!el) return;
    const W=el.clientWidth||340, H=200;
    const renderer = new THREE.WebGLRenderer({antialias:true,alpha:true});
    renderer.setSize(W,H);
    renderer.shadowMap.enabled=true;
    el.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(S.bg==="dark"?"#0d1117":"#eef2f7");
    const camera = new THREE.PerspectiveCamera(45,W/H,0.1,200);
    camera.position.set(12,10,12);
    camera.lookAt(0,0,0);
    // Lights
    scene.add(new THREE.AmbientLight(0xffffff,0.6));
    const sun=new THREE.DirectionalLight(0xfff8e1,1.2);
    sun.position.set(10,20,10);
    scene.add(sun);
    // Floor
    const floor=new THREE.Mesh(new THREE.PlaneGeometry(12,10),new THREE.MeshLambertMaterial({color:0xd4a843}));
    floor.rotation.x=-Math.PI/2;
    scene.add(floor);
    // Walls
    const wallMat=new THREE.MeshLambertMaterial({color:0xf5f0e8});
    [[12,3,0.2,0,1.5,-5],[12,3,0.2,0,1.5,5],[0.2,3,10,-6,1.5,0],[0.2,3,10,6,1.5,0]].forEach(([w,h,d,x,y,z])=>{
      const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),wallMat);
      mesh.position.set(x,y,z);
      scene.add(mesh);
    });
    // Roof
    const roof=new THREE.Mesh(new THREE.ConeGeometry(9,3,4),new THREE.MeshLambertMaterial({color:0xc0392b}));
    roof.position.set(0,4.5,0);
    roof.rotation.y=Math.PI/4;
    scene.add(roof);
    // Animate rotation
    let frame, angle=0;
    const animate=()=>{
      frame=requestAnimationFrame(animate);
      angle+=0.008;
      camera.position.x=Math.sin(angle)*16;
      camera.position.z=Math.cos(angle)*16;
      camera.lookAt(0,0,0);
      renderer.render(scene,camera);
    };
    animate();
    return ()=>{ cancelAnimationFrame(frame); renderer.dispose(); if(el.contains(renderer.domElement)) el.removeChild(renderer.domElement); };
  },[]);
  return <div ref={mountRef} style={{width:"100%",height:200,borderRadius:8,overflow:"hidden",border:`1px solid ${S.bdr}`}}/>;
}

function LandCanvas({ pts, onChange, S }) {
  const canvasRef=useRef(null);
  const area = calcLandArea(pts);
  useEffect(()=>{
    const cv=canvasRef.current;
    if(!cv) return;
    const ctx=cv.getContext("2d");
    const W=cv.width,H=cv.height;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle="#071a07";
    ctx.fillRect(0,0,W,H);
    // Grid
    ctx.strokeStyle="#1a3a1a";
    ctx.lineWidth=0.5;
    for(let x=0;x<W;x+=15){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    for(let y=0;y<H;y+=15){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
    if(pts.length>=2){
      ctx.beginPath();
      ctx.moveTo(pts[0].px,pts[0].py);
      pts.forEach(p=>ctx.lineTo(p.px,p.py));
      if(pts.length>=3) ctx.closePath();
      ctx.fillStyle="#43a04726";
      ctx.fill();
      ctx.strokeStyle="#2e7d32";
      ctx.lineWidth=2;
      ctx.stroke();
    }
    pts.forEach((p,i)=>{
      ctx.beginPath();
      ctx.arc(p.px,p.py,8,0,Math.PI*2);
      ctx.fillStyle=GOLD;
      ctx.fill();
      ctx.fillStyle="#111";
      ctx.font="bold 9px system-ui";
      ctx.textAlign="center";
      ctx.fillText(i+1,p.px,p.py+3);
    });
    if(pts.length===0){
      ctx.fillStyle="#555";
      ctx.font="12px system-ui";
      ctx.textAlign="center";
      ctx.fillText("Appuyez pour marquer les coins du terrain",W/2,H/2);
    }
  },[pts]);
  const handleClick = useCallback(e=>{
    const r=canvasRef.current.getBoundingClientRect();
    onChange([...pts,{px:e.clientX-r.left,py:e.clientY-r.top}]);
  },[pts,onChange]);
  return (
    <div>
      <canvas ref={canvasRef} width={340} height={175} onClick={handleClick}
        style={{width:"100%",height:175,borderRadius:8,border:`1px solid #1a3a1a`,cursor:"crosshair",display:"block"}}/>
      {area && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:5,marginTop:8}}>
          {[["m²",area.sqM],["ft²",area.sqFt],["Acres",area.acres],["Ha",area.ha]].map(([l,v])=>(
            <div key={l} style={{background:"#071a07",borderRadius:7,padding:"6px 4px",textAlign:"center",border:"1px solid #1b5e2033"}}>
              <div style={{color:S.txt2,fontSize:9}}>{l}</div>
              <div style={{color:GOLD,fontSize:13,fontWeight:700}}>{v}</div>
            </div>
          ))}
        </div>
      )}
      <div style={{display:"flex",gap:8,marginTop:8,alignItems:"center"}}>
        <span style={{color:S.txt2,fontSize:11}}>Points: {pts.length}</span>
        {pts.length>0 && <button onClick={()=>onChange([])} style={{padding:"4px 10px",borderRadius:6,border:"1px solid #fcc",background:"transparent",color:"#c0392b",fontSize:11,cursor:"pointer"}}>Effacer</button>}
        <button onClick={()=>onChange([...pts,{px:40+(pts.length*45)%200,py:35+Math.floor(pts.length*45/200)*35}])} style={{padding:"4px 10px",borderRadius:6,border:`1px solid ${GOLD}44`,background:`${GOLD}1a`,color:GOLD,fontSize:11,cursor:"pointer"}}>+ Point GPS</button>
      </div>
    </div>
  );
}

function ChatPanel({ messages, currentUser, onSend, S, t }) {
  const [msg,setMsg]=useState("");
  const [aiThinking,setAiThinking]=useState(false);
  const endRef=useRef(null);
  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:"smooth"}); },[messages,aiThinking]);
  const send=async()=>{
    const txt=msg.trim();
    if(!txt) return;
    setMsg("");
    onSend(txt);
    const isQ=txt.includes("?")||/^(comment|que|quand|où|pourquoi|qui|quel|combien)/i.test(txt);
    if(isQ){
      setAiThinking(true);
      await new Promise(r=>setTimeout(r,1400));
      const answers=[
        "Pour vérifier un Titre Foncier à Conakry, rendez-vous à la DGI avec le numéro TF. Délai: 2-5 jours ouvrables.",
        "Le prix moyen au m² à Conakry varie de 1,5M à 4M GNF selon le quartier. Coleah et Camayenne sont les plus prisés.",
        "L'attestation de non-litige s'obtient au conseil de quartier ou à la Mairie. Document indispensable pour toute transaction.",
        "Le Permis de Construire s'obtient au Ministère de l'Urbanisme. Délai moyen: 3-6 semaines avec dossier complet.",
        "Pour une bonne inspection, vérifiez: TF, conformité du bâtiment, réseaux SEG/EDG, et bornage cadastral.",
      ];
      onSend(answers[Math.floor(Math.random()*answers.length)],true);
      setAiThinking(false);
    }
  };
  const bubbleStyle=(mine,isAI)=>({
    maxWidth:"75%",background:mine?`${GOLD}1a`:isAI?`${GOLD}0d`:S.bg2,
    borderRadius:10,padding:"8px 11px",
    border:`1px solid ${mine?`${GOLD}33`:S.bdr}`
  });
  return (
    <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 140px)"}}>
      <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:8,padding:"10px 0"}}>
        <div style={{textAlign:"center",color:S.txt2,fontSize:10,padding:"6px 0"}}>
          💬 {t.teamChat} — {t.askAI}
        </div>
        {messages.map(m=>{
          const mine=m.uid===currentUser?.uid;
          const isAI=m.role==="ai";
          return(
            <div key={m.id} style={{display:"flex",flexDirection:mine?"row-reverse":"row",gap:6,alignItems:"flex-end"}}>
              <div style={{width:26,height:26,borderRadius:"50%",background:isAI?`${GOLD}22`:mine?`#1d4ed822`:"#16532222",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:isAI?GOLD:mine?"#60a5fa":"#4ade80",flexShrink:0}}>
                {isAI?"IA":(m.from||"?").slice(0,2).toUpperCase()}
              </div>
              <div style={bubbleStyle(mine,isAI)}>
                {!mine && <div style={{color:S.txt2,fontSize:9,marginBottom:3}}>{m.from}</div>}
                <div style={{color:S.txt,fontSize:13,lineHeight:1.5}}>{m.text}</div>
                <div style={{color:S.txt2,fontSize:9,marginTop:3}}>{fmtTime(m.ts)}</div>
              </div>
            </div>
          );
        })}
        {aiThinking && (
          <div style={{display:"flex",gap:6,alignItems:"flex-end"}}>
            <div style={{width:26,height:26,borderRadius:"50%",background:`${GOLD}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:GOLD}}>IA</div>
            <div style={{background:S.bg2,borderRadius:10,padding:"9px 12px",border:`1px solid ${GOLD}22`}}>
              <span style={{color:GOLD,fontSize:12}}>En cours de réflexion…</span>
            </div>
          </div>
        )}
        <div ref={endRef}/>
      </div>
      <div style={{paddingTop:8,borderTop:`1px solid ${S.bdr}`,display:"flex",gap:8}}}>
        <input value={msg} onChange={e=>setMsg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}
placeholder={`${t.askAI}…`} />          style={{flex:1,padding:"11px 13px",borderRadius:8,border:`1px solid ${S.bdr}`,background:S.inp,color:S.txt,fontSize:14,outline:"none",minHeight:48}}/>
        <button onClick={send} style={{padding:"0 16px",borderRadius:8,background:GOLD,color:"#0d1117",border:"none",cursor:"pointer",fontSize:18,fontWeight:700,minWidth:48,minHeight:48}}>→</button>
      </div>
    </div>
  );
}

function GuideScreen({ S, t, onClose }) {
  const steps=[
    {icon:"📋",title:"Détails de la propriété",desc:"Remplissez l'adresse, le type, les pièces et le prix. Sélectionnez la région et la commune en Guinée."},
    {icon:"👤",title:"Informations du propriétaire",desc:"Saisissez le nom, les coordonnées et photographiez la pièce d'identité du propriétaire."},
    {icon:"📸",title:"Photos (minimum 10)",desc:"Photographiez chaque partie de la propriété. Chaque photo est automatiquement marquée avec votre nom et GPS."},
    {icon:"📄",title:"Documents",desc:"Cochez les documents disponibles (TF, permis, etc.) et photographiez chacun."},
    {icon:"🏗",title:"Plan 2D / 3D",desc:"Dessinez le plan de la propriété. La vue 3D se génère automatiquement."},
    {icon:"🌐",title:"Terrain",desc:"Marquez les coins du terrain sur la carte pour calculer la superficie automatiquement."},
    {icon:"📝",title:"Notes & Notes vocales",desc:"Ajoutez des observations écrites ou des notes vocales en maintenant le bouton micro."},
  ];
  return(
    <div style={{padding:14}}>
      <div style={{textAlign:"center",marginBottom:20}}>
        <div style={{color:GOLD,fontWeight:700,fontSize:18,letterSpacing:2}}>GUIDE D'INSPECTION</div>
        <div style={{color:S.txt2,fontSize:12,marginTop:4}}>Comment remplir une inspection complète</div>
      </div>
      {steps.map((s,i)=>(
        <div key={i} style={{background:S.bg3,borderRadius:12,padding:"12px 14px",marginBottom:10,border:`1px solid ${S.bdr}`,display:"flex",gap:12,alignItems:"flex-start"}}>
          <div style={{fontSize:28,flexShrink:0}}>{s.icon}</div>
          <div>
            <div style={{fontWeight:600,fontSize:14,color:S.txt,marginBottom:4}}>{i+1}. {s.title}</div>
            <div style={{color:S.txt2,fontSize:12,lineHeight:1.6}}>{s.desc}</div>
          </div>
        </div>
      ))}
      <button onClick={onClose} style={{width:"100%",padding:"13px 16px",borderRadius:8,background:GOLD,color:"#0d1117",border:"none",fontWeight:700,fontSize:15,cursor:"pointer",marginTop:8}}>
        Commencer une inspection →
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════ */
export default function TaganiImmo() {
  const [dark,setDark] = useState(true);
  const [lang,setLang] = useState("fr");
  const t = TR[lang];
  const S = makeStyles(dark);

  /* ── AUTH ── */
  const [fbUser,setFbUser]       = useState(null);
  const [userDoc,setUserDoc]     = useState(null);
  const [authLoading,setAuthLoading] = useState(true);
  const [view,setView]           = useState("login");
  const [authMode,setAuthMode]   = useState("login");

  /* ── AUTH FORM ── */
  const [authName,setAuthName]   = useState("");
  const [authEmail,setAuthEmail] = useState("");
  const [authPwd,setAuthPwd]     = useState("");
  const [authPin,setAuthPin]     = useState("");
  const [authErr,setAuthErr]     = useState("");
  const [showPwd,setShowPwd]     = useState(false);

  /* ── DATA ── */
  const [inspections,setInspections]   = useState([]);
  const [allInspections,setAllInspections] = useState([]);
  const [allUsers,setAllUsers]         = useState({});
  const [agentLocs,setAgentLocs]       = useState({});
  const [chatMessages,setChatMessages] = useState([]);

  /* ── NAVIGATION ── */
  const [navTab,setNavTab]   = useState("home");
  const [adminTab,setAdminTab] = useState("live");
  const [inspId,setInspId]   = useState(null);
  const [inspTab,setInspTab] = useState("details");

  /* ── INSPECTION STATE ── */
  const [prop,setProp]       = useState({});
  const [locVal,setLocVal]   = useState({region:"",pref:"",commune:""});
  const [photos,setPhotos]   = useState([]);
  const [docs,setDocs]       = useState({});
  const [docType,setDocType] = useState("land");
  const [feats,setFeats]     = useState([]);
  const [voiceNotes,setVoiceNotes] = useState([]);
  const [landPts,setLandPts] = useState([]);
  const [planMode,setPlanMode] = useState("2d");
  const [inspNotes,setInspNotes] = useState("");
  const [autoSaved,setAutoSaved] = useState(null);
  const [lightbox,setLightbox]   = useState(null);
  const [showPhotoSheet,setShowPhotoSheet] = useState(null);

  /* ── RECORDING ── */
  const [recording,setRecording] = useState(false);
  const [recSec,setRecSec]       = useState(0);
  const recTimerRef = useRef(null);
  const mediaRef    = useRef(null);
  const chunksRef   = useRef([]);

  /* ── GPS ── */
  const [gps,setGps]       = useState(null);
  const [gpsErr,setGpsErr] = useState(false);

  /* ── UI ── */
  const [toastMsg,setToastMsg] = useState(null);
  const [expanded,setExpanded] = useState(null);
  const [showGuide,setShowGuide] = useState(false);
  const [unread,setUnread]     = useState(0);

  /* ── GPS WATCHER ── */
  useEffect(()=>{
    if(!navigator.geolocation) return;
    const wid=navigator.geolocation.watchPosition(
      pos=>setGps({lat:pos.coords.latitude,lng:pos.coords.longitude,acc:Math.round(pos.coords.accuracy)}),
      ()=>setGpsErr(true),
      {enableHighAccuracy:true,timeout:15000,maximumAge:5000}
    );
    return()=>navigator.geolocation.clearWatch(wid);
  },[]);

  /* ── AUTH LISTENER ── */
  useEffect(()=>{
    return onAuthStateChanged(auth, async fbU=>{
      if(fbU){
        setFbUser(fbU);
        const snap=await get(ref(db,`users/${fbU.uid}`));
        if(snap.exists()){
          const doc=snap.val();
          setUserDoc(doc);
          if(doc.status==="pending")setView("pending");
          else if(doc.status==="suspended")setView("suspended");
          else if(doc.role==="admin")setView("admin");
          else setView("agent");
        } else {
          setView("login");
        }
      } else {
        setFbUser(null); setUserDoc(null); setView("login");
      }
      setAuthLoading(false);
    });
  },[]);

  /* ── DATA LISTENERS ── */
  useEffect(()=>{
    if(!fbUser||!userDoc) return;
    if(userDoc.role==="admin"){
      const r1=ref(db,"inspections");
      onValue(r1,snap=>{const v=snap.val();setAllInspections(v?Object.values(v).sort((a,b)=>(b.lastSaved||b.timestamp)-(a.lastSaved||a.timestamp)):[]));});
      const r2=ref(db,"users");
      onValue(r2,snap=>setAllUsers(snap.val()||{}));
      const r3=ref(db,"agentLocations");
      onValue(r3,snap=>setAgentLocs(snap.val()||{}));
    } else {
      const r1=ref(db,"inspections");
      onValue(r1,snap=>{const v=snap.val();const mine=v?Object.values(v).filter(i=>i.agentUid===fbUser.uid).sort((a,b)=>(b.lastSaved||b.timestamp)-(a.lastSaved||a.timestamp)):[];setInspections(mine);});
    }
    const rc=ref(db,"chat");
    onValue(rc,snap=>{const v=snap.val();const msgs=v?Object.values(v).sort((a,b)=>a.ts-b.ts):[];setChatMessages(msgs);});
    return()=>{off(ref(db,"inspections"));off(ref(db,"users"));off(ref(db,"agentLocations"));off(ref(db,"chat"));};
  },[fbUser,userDoc]);

  /* ── GPS TRACKING ── */
  useEffect(()=>{
    if(!fbUser||!gps||!userDoc||userDoc.status!=="active") return;
    const r=ref(db,`agentLocations/${fbUser.uid}`);
    set(r,{lat:gps.lat,lng:gps.lng,acc:gps.acc,ts:Date.now(),name:userDoc.displayName||fbUser.email,uid:fbUser.uid}).catch(()=>{});
  },[gps,fbUser,userDoc]);

  /* ── AUTO SAVE ── */
  useEffect(()=>{
    if(!inspId||view!=="inspect") return;
    const t=setInterval(()=>{ saveInsp(); },[30000]);
    return()=>clearInterval(t);
  },[inspId,view,prop,locVal,photos,docs,feats,voiceNotes,landPts,inspNotes]);

  /* ── TOAST ── */
  const showToast=useCallback((msg,type="ok")=>{
    setToastMsg({msg,type});
    setTimeout(()=>setToastMsg(null),2800);
  },[]);

  /* ── AUTH ACTIONS ── */
  const doLogin=async()=>{
    setAuthErr("");
    try{
      await signInWithEmailAndPassword(auth,authEmail,authPwd);
    }catch(e){
      setAuthErr(e.code==="auth/invalid-credential"||e.code==="auth/user-not-found"||e.code==="auth/wrong-password"?"Email ou mot de passe incorrect.":"Erreur: "+e.message);
    }
  };

  const doRegister=async()=>{
    setAuthErr("");
    if(!authName.trim()){setAuthErr("Entrez votre nom complet.");return;}
    if(authPwd.length<8){setAuthErr("Mot de passe minimum 8 caractères.");return;}
    try{
      const snap=await get(ref(db,"settings"));
      const pin=snap.exists()?snap.val().teamPin:"1234";
      if(authPin!==pin){setAuthErr("PIN d'équipe incorrect. Contactez l'administrateur.");return;}
      const cred=await createUserWithEmailAndPassword(auth,authEmail,authPwd);
      const uDoc={uid:cred.user.uid,displayName:authName.trim(),email:authEmail,role:"agent",status:"pending",createdAt:Date.now()};
      await set(ref(db,`users/${cred.user.uid}`),uDoc);
    }catch(e){
      setAuthErr(e.code==="auth/email-already-in-use"?"Cet email est déjà utilisé.":"Erreur: "+e.message);
    }
  };

  const doLogout=async()=>{ await signOut(auth); setView("login"); setAuthEmail(""); setAuthPwd(""); };

  /* ── INSPECTION ACTIONS ── */
  const startNew=()=>{
    const id=uid();
    setInspId(id);
    setProp({address:"",type:"house",bedrooms:0,bathrooms:0,livingRooms:0,kitchens:0,diningRooms:0,garages:0,offices:0,laundryRooms:0,balconies:0,storageRooms:0,totalArea:"",landArea:"",landHa:"",yearBuilt:"",listPrice:"",condition:"good",ownerName:"",ownerFirst:"",ownerPhone:"",ownerEmail:"",ownerNat:"",ownerJob:"",ownerIdType:"",ownerIdNum:"",ownerRel:""});
    setLocVal({region:"",pref:"",commune:""});
    setPhotos([]); setDocs({}); setDocType("land"); setFeats([]);
    setVoiceNotes([]); setLandPts([]); setInspNotes(""); setAutoSaved(null);
    setInspTab("details"); setView("inspect");
  };

  const openInsp=useCallback((ins)=>{
    setInspId(ins.id);
    setProp({...ins.property});
    setLocVal({region:ins.property?.region||"",pref:ins.property?.pref||"",commune:ins.property?.commune||""});
    setPhotos(ins.photos||[]);
    setDocs(ins.documents||{});
    setDocType(ins.docType||"land");
    setFeats(ins.property?.features||[]);
    setVoiceNotes(ins.voiceNotes||[]);
    setLandPts(ins.landPts||[]);
    setInspNotes(ins.property?.notes||"");
    setAutoSaved(null); setInspTab("details"); setView("inspect");
  },[]);

  const saveInsp=useCallback(async(status)=>{
    if(!inspId||!fbUser) return;
    const cleaned=sanitizeObj({
      id:inspId, agentUid:fbUser.uid,
      agentName:userDoc?.displayName||fbUser.email,
      timestamp:Date.now(), lastSaved:Date.now(),
      status:status||"draft",
      location:gps||null,
      property:{...prop,...locVal,features:feats,notes:sanitizeStr(inspNotes)},
      photos, documents:docs, docType, voiceNotes, landPts,
      ...(status==="submitted"?{submittedAt:Date.now()}:{})
    });
    await set(ref(db,`inspections/${inspId}`),cleaned);
    setAutoSaved(fmtTime(Date.now()));
    if(status==="submitted"){ showToast("✅ "+t.submitted_ok); setView("agent"); setNavTab("home"); }
    else showToast("💾 "+t.saved);
  },[inspId,fbUser,userDoc,gps,prop,locVal,feats,inspNotes,photos,docs,docType,voiceNotes,landPts]);

  const submitInsp=()=>{
    if(!prop.address){showToast("⚠ Entrez l'adresse de la propriété.","err");setInspTab("details");return;}
    if(photos.length<10){showToast(`⚠ ${t.minPhotos}. Vous en avez ${photos.length}.`,"err");setInspTab("photos");return;}
    saveInsp("submitted");
  };

  const addPhoto=()=>{
    const type=SHOT_TYPES[photos.length%SHOT_TYPES.length];
    const ph={id:uid(),ts:Date.now(),type,color:SHOT_COLORS[type]||"#555",sizeKB:Math.floor(Math.random()*150)+150,loc:gps,agentName:userDoc?.displayName||""};
    setPhotos(prev=>[...prev,ph]);
    setShowPhotoSheet(photos.length);
  };

  const setPhotoType=(index,type)=>{
    setPhotos(prev=>prev.map((p,i)=>i===index?{...p,type,color:SHOT_COLORS[type]||"#555"}:p));
    setShowPhotoSheet(null);
  };

  const toggleFeat=(f)=>setFeats(prev=>prev.includes(f)?prev.filter(x=>x!==f):[...prev,f]);
  const toggleDoc=(id)=>setDocs(prev=>({...prev,[id]:!prev[id]}));
  const upProp=(k,v)=>setProp(prev=>({...prev,[k]:v}));
  const adjRoom=(k,d)=>setProp(prev=>({...prev,[k]:Math.max(0,(prev[k]||0)+d)}));

  /* ── VOICE RECORDING ── */
  const startRec=async()=>{
    if(recording) return;
    try{
      const stream=await navigator.mediaDevices.getUserMedia({audio:true});
      const mr=new MediaRecorder(stream);
      chunksRef.current=[];
      mr.ondataavailable=e=>chunksRef.current.push(e.data);
      mr.onstop=()=>{
        const blob=new Blob(chunksRef.current,{type:"audio/webm"});
        const url=URL.createObjectURL(blob);
        setVoiceNotes(prev=>[...prev,{id:uid(),url,duration:recSec,ts:Date.now()}]);
        stream.getTracks().forEach(t=>t.stop());
      };
      mr.start();
      mediaRef.current=mr;
      setRecording(true); setRecSec(0);
      recTimerRef.current=setInterval(()=>setRecSec(s=>s+1),1000);
    }catch(e){ showToast("Microphone non disponible","err"); }
  };

  const stopRec=()=>{
    if(!recording) return;
    clearInterval(recTimerRef.current);
    mediaRef.current?.stop();
    setRecording(false); setRecSec(0);
  };

  /* ── CHAT ── */
  const sendChat=async(text,isAI=false)=>{
    const m={id:uid(),from:isAI?"Tagani IA":(userDoc?.displayName||fbUser?.email||""),uid:isAI?"ai":fbUser?.uid,role:isAI?"ai":userDoc?.role,text,ts:Date.now()};
    await push(ref(db,"chat"),m);
    if(!isAI) setUnread(0);
  };

  /* ── ADMIN ACTIONS ── */
  const approveUser=async(uid2)=>{ await update(ref(db,`users/${uid2}`),{status:"active"}); showToast("✅ Agent approuvé!"); };
  const suspendUser=async(uid2)=>{ await update(ref(db,`users/${uid2}`),{status:"suspended"}); showToast("⊘ Agent suspendu","err"); };
  const reactivateUser=async(uid2)=>{ await update(ref(db,`users/${uid2}`),{status:"active"}); showToast("✅ Agent réactivé!"); };

  /* ════ STYLES ════ */
  const card={background:S.card,borderRadius:12,padding:"12px 14px",marginBottom:10,border:`1px solid ${S.bdr}`};
  const inp={width:"100%",padding:"11px 13px",borderRadius:8,border:`1px solid ${S.bdr}`,background:S.inp,color:S.txt,fontSize:15,outline:"none",minHeight:48};
  const lbl={color:S.txt2,fontSize:10,letterSpacing:.5,textTransform:"uppercase",display:"block",marginBottom:5,marginTop:10};
  const goldBtn={background:GOLD,color:"#0d1117",border:"none",borderRadius:8,padding:"12px 16px",fontWeight:700,fontSize:14,cursor:"pointer",width:"100%",minHeight:48};
  const ghostBtn={background:"transparent",color:S.txt2,border:`1px solid ${S.bdr}`,borderRadius:8,padding:"10px 14px",fontSize:13,cursor:"pointer",width:"100%",minHeight:46};
  const bdg=(color,text)=><span style={{display:"inline-block",padding:"2px 8px",borderRadius:10,fontSize:9,fontWeight:700,background:`${color}22`,color,border:`1px solid ${color}44`}}>{text}</span>;
  const tabBtnSt=(a)=>({padding:"6px 10px",borderRadius:6,border:`1.5px solid ${a?GOLD:S.bdr}`,background:a?`${GOLD}1a`:"transparent",color:a?GOLD:S.txt2,cursor:"pointer",fontSize:11,fontWeight:700,whiteSpace:"nowrap",minHeight:36});

  if(authLoading) return(
    <div style={{maxWidth:430,margin:"0 auto",minHeight:"100vh",background:S.bg,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16}}>
      <style>{CSS_GLOBAL}</style>
      <div style={{width:60,height:60,borderRadius:"50%",border:`3px solid ${GOLD}`,borderTopColor:"transparent",animation:"spin 1s linear infinite"}}/>
      <div style={{color:GOLD,fontWeight:700,letterSpacing:2}}>TAGANI IMMO</div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  /* ════════════════════════════════════════════════
     SHARED HEADER
  ════════════════════════════════════════════════ */
  const Header=({back,title,sub,right})=>(
    <div style={{background:S.bg,borderBottom:`1px solid ${GOLD}33`,padding:"10px 14px",display:"flex",alignItems:"center",gap:8,position:"sticky",top:0,zIndex:20}}>
      {back?<button onClick={back} style={{background:"none",border:"none",color:GOLD,cursor:"pointer",fontSize:22,padding:"4px 8px 4px 0",minWidth:36}}>←</button>:<div style={{width:8}}/>}
      <div style={{flex:1}}>
        <div style={{color:GOLD,fontWeight:700,fontSize:13,letterSpacing:2}}>{title}</div>
        {sub&&<div style={{color:S.txt2,fontSize:10}}>{sub}</div>}
      </div>
      <div style={{display:"flex",gap:6,alignItems:"center"}}>{right}</div>
    </div>
  );

  const GpsBar=()=>(
    <div style={{background:dark?"#071a07":"#f0fff4",padding:"4px 14px",fontSize:10,fontFamily:"monospace",borderBottom:`1px solid ${dark?"#27ae6022":"#c8e6c9"}`,color:"#27ae60",flexShrink:0}}>
      {gps?`● ${t.gpsActive} · ${gps.lat.toFixed(5)}°N · ${gps.lng.toFixed(5)}°E · ±${gps.acc}m`:`⌛ ${t.gpsWaiting}`}
    </div>
  );

  const BottomNav=({active})=>{
    const items=[
      {id:"home",icon:"🏠",label:t.home},
      {id:"inspections",icon:"📋",label:t.myInspections.split(" ")[0]},
      {id:"map",icon:"📍",label:"GPS"},
      {id:"chat",icon:"💬",label:t.chat},
      {id:"profile",icon:"👤",label:t.profile},
    ];
    return(
      <div style={{background:S.bg2,borderTop:`1px solid ${S.bdr}`,display:"flex",justifyContent:"space-around",padding:"6px 0 14px",position:"sticky",bottom:0,zIndex:20,flexShrink:0}}>
        {items.map(it=>(
          <button key={it.id} onClick={()=>{setNavTab(it.id);if(it.id==="chat")setUnread(0);}} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2,background:"transparent",border:"none",cursor:"pointer",padding:"3px 0",position:"relative"}}>
            <span style={{fontSize:22}}>{it.icon}</span>
            <span style={{fontSize:9,color:active===it.id?GOLD:S.txt2,fontWeight:active===it.id?700:400}}>{it.label}</span>
            {active===it.id&&<div style={{position:"absolute",bottom:0,width:20,height:2,background:GOLD,borderRadius:1}}/>}
            {it.id==="chat"&&unread>0&&<div style={{position:"absolute",top:0,right:"16%",background:"#e74c3c",color:"#fff",fontSize:8,fontWeight:700,minWidth:14,height:14,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 2px"}}>{unread}</div>}
          </button>
        ))}
      </div>
    );
  };

  const themeBtn=<button onClick={()=>setDark(d=>!d)} style={{background:"transparent",border:`1px solid ${S.bdr}`,color:S.txt2,borderRadius:6,padding:"4px 8px",cursor:"pointer",fontSize:11}}>{dark?"☀":"🌙"}</button>;
  const langBtn=<button onClick={()=>setLang(l=>l==="fr"?"en":"fr")} style={{background:"transparent",border:`1px solid ${S.bdr}`,color:S.txt2,borderRadius:6,padding:"4px 8px",cursor:"pointer",fontSize:11}}>{lang==="fr"?"EN":"FR"}</button>;
  const logoutBtn=<button onClick={doLogout} style={{background:"transparent",border:`1px solid ${S.bdr}`,color:S.txt2,borderRadius:6,padding:"4px 8px",cursor:"pointer",fontSize:11}}>↩</button>;

  /* ════════════════════════════════════════════════
     LOGIN SCREEN
  ════════════════════════════════════════════════ */
  if(view==="login") return(
    <div style={{maxWidth:430,margin:"0 auto",minHeight:"100vh",background:S.bg,color:S.txt,fontFamily:"system-ui,sans-serif"}}>
      <style>{CSS_GLOBAL}</style>
      {toastMsg&&<div style={{position:"fixed",top:16,left:"50%",transform:"translateX(-50%)",background:toastMsg.type==="err"?"#c0392b":GOLD,color:toastMsg.type==="err"?"#fff":"#0d1117",padding:"10px 20px",borderRadius:20,fontWeight:700,fontSize:13,zIndex:9999,whiteSpace:"nowrap",boxShadow:"0 4px 20px rgba(0,0,0,.5)"}}>{toastMsg.msg}</div>}
      <div style={{position:"absolute",top:14,right:16,display:"flex",gap:6}}>{themeBtn}{langBtn}</div>
      <div style={{padding:"0 22px",paddingTop:60}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{width:80,height:80,borderRadius:"50%",background:`${GOLD}1a`,border:`2px solid ${GOLD}44`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",fontSize:38}}>🏠</div>
          <div style={{color:GOLD,fontWeight:700,fontSize:24,letterSpacing:3}}>{t.appName}</div>
          <div style={{color:S.txt2,fontSize:12,marginTop:4,letterSpacing:1}}>Inspection Immobilière · Guinée</div>
        </div>
        <div style={{display:"flex",gap:6,marginBottom:16}}>
          {["login","register"].map(m=>(
            <button key={m} onClick={()=>{setAuthMode(m);setAuthErr("");}} style={{flex:1,padding:"10px",borderRadius:8,border:`1.5px solid ${authMode===m?GOLD:S.bdr}`,background:authMode===m?`${GOLD}1a`:"transparent",color:authMode===m?GOLD:S.txt2,cursor:"pointer",fontWeight:700,fontSize:13}}>
              {m==="login"?t.login:t.register}
            </button>
          ))}
        </div>
        <div style={card}>
          {authMode==="register"&&(
            <>
              <label style={lbl}>{t.name}</label>
              <input style={inp} value={authName} onChange={e=>setAuthName(e.target.value)} placeholder="Ex: Mamadou Diallo"/>
            </>
          )}
          <label style={lbl}>{t.email}</label>
          <input style={inp} type="email" value={authEmail} onChange={e=>setAuthEmail(e.target.value)} placeholder="email@exemple.com" onKeyDown={e=>e.key==="Enter"&&(authMode==="login"?doLogin():doRegister())}/>
          <label style={{...lbl,marginTop:10}}>{t.password}</label>
          <div style={{position:"relative"}}>
            <input style={{...inp,paddingRight:75}} type={showPwd?"text":"password"} value={authPwd} onChange={e=>setAuthPwd(e.target.value)} placeholder="••••••••" onKeyDown={e=>e.key==="Enter"&&(authMode==="login"?doLogin():doRegister())}/>
            <button onClick={()=>setShowPwd(p=>!p)} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:S.txt2,cursor:"pointer",fontSize:11}}>{showPwd?"Masquer":"Afficher"}</button>
          </div>
          {authMode==="register"&&(
            <>
              <label style={{...lbl,marginTop:10}}>{t.teamPin}</label>
              <input style={inp} type="password" inputMode="numeric" maxLength={4} value={authPin} onChange={e=>setAuthPin(e.target.value)} placeholder="PIN 4 chiffres"/>
            </>
          )}
          {authErr&&<div style={{color:"#e74c3c",fontSize:12,marginTop:8,padding:"7px 10px",background:"#e74c3c12",borderRadius:6}}>{authErr}</div>}
          <button onClick={authMode==="login"?doLogin:doRegister} style={{...goldBtn,marginTop:12}}>
            {authMode==="login"?t.loginBtn:t.registerBtn}
          </button>
        </div>
        <div style={{textAlign:"center",color:S.txt2,fontSize:11,marginTop:8}}>© 2024 Tagani Immo · Conakry, Guinée</div>
      </div>
    </div>
  );

  /* ════════════════════════════════════════════════
     PENDING / SUSPENDED
  ════════════════════════════════════════════════ */
  if(view==="pending"||view==="suspended") return(
    <div style={{maxWidth:430,margin:"0 auto",minHeight:"100vh",background:S.bg,color:S.txt,fontFamily:"system-ui,sans-serif",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,textAlign:"center"}}>
      <style>{CSS_GLOBAL}</style>
      <div style={{fontSize:60,marginBottom:16}}>{view==="pending"?"⏳":"⊘"}</div>
      <div style={{color:GOLD,fontSize:20,fontWeight:700,marginBottom:12}}>{view==="pending"?"Compte en attente":"Compte suspendu"}</div>
      <div style={{color:S.txt2,fontSize:14,lineHeight:1.7,maxWidth:300,marginBottom:24}}>
        {view==="pending"?"L'administrateur doit approuver votre accès.":"Votre compte a été suspendu. Contactez l'administrateur."}
      </div>
      <div style={{color:S.txt2,fontSize:12,marginBottom:20}}>{fbUser?.email}</div>
      <button onClick={doLogout} style={{...ghostBtn,width:"auto",padding:"10px 24px"}}>← {t.logout}</button>
    </div>
  );

  /* ════════════════════════════════════════════════
     INSPECTION SCREEN
  ════════════════════════════════════════════════ */
  if(view==="inspect") {
    const TABS=["details","owner","photos","docs","plan","land","notes"];
    const TLBLS={details:`📋 Détails`,owner:`👤 Propriétaire`,photos:`📸 Photos(${photos.length})`,docs:`📄 Documents`,plan:`🏗 Plan`,land:`🌐 Terrain`,notes:`📝 Notes`};
    const doneCount=TABS.filter(tt=>(tt==="details"&&prop.address)||(tt==="photos"&&photos.length>=10)||(tt==="owner"&&prop.ownerName)||(!["details","photos","owner"].includes(tt))).length;
    const currentDocs=docType==="land"?GUINEA_DOCS_LAND:GUINEA_DOCS_HOUSE;

    return(
      <div style={{maxWidth:430,margin:"0 auto",minHeight:"100vh",background:S.bg,color:S.txt,fontFamily:"system-ui,sans-serif",display:"flex",flexDirection:"column"}}>
        <style>{CSS_GLOBAL}</style>
        {toastMsg&&<div style={{position:"fixed",top:16,left:"50%",transform:"translateX(-50%)",background:toastMsg.type==="err"?"#c0392b":GOLD,color:toastMsg.type==="err"?"#fff":"#0d1117",padding:"10px 20px",borderRadius:20,fontWeight:700,fontSize:13,zIndex:9999,whiteSpace:"nowrap",boxShadow:"0 4px 20px rgba(0,0,0,.5)"}}>{toastMsg.msg}</div>}

        {/* Photo type sheet */}
        {showPhotoSheet!==null&&(
          <div style={{position:"fixed",inset:0,zIndex:500,background:"rgba(0,0,0,.7)",display:"flex",alignItems:"flex-end"}} onClick={()=>setShowPhotoSheet(null)}>
            <div onClick={e=>e.stopPropagation()} style={{background:S.bg3,borderRadius:"16px 16px 0 0",padding:18,width:"100%",maxWidth:430,margin:"0 auto"}}>
              <div style={{fontWeight:600,fontSize:14,marginBottom:12}}>Type de photo #{showPhotoSheet+1}</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {SHOT_TYPES.map(tp=>(
                  <button key={tp} onClick={()=>setPhotoType(showPhotoSheet,tp)} style={{padding:"7px 11px",borderRadius:7,border:`1px solid ${photos[showPhotoSheet]?.type===tp?GOLD:S.bdr}`,background:photos[showPhotoSheet]?.type===tp?`${GOLD}1a`:S.bg2,color:photos[showPhotoSheet]?.type===tp?GOLD:S.txt,cursor:"pointer",fontSize:12}}>{tp}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Lightbox */}
        {lightbox!==null&&(
          <div style={{position:"fixed",inset:0,zIndex:600,background:"rgba(0,0,0,.96)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}} onClick={()=>setLightbox(null)}>
            <div onClick={e=>e.stopPropagation()} style={{display:"flex",flexDirection:"column",alignItems:"center",padding:20}}>
              <div style={{width:300,height:200,background:photos[lightbox]?.color||"#333",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:60,opacity:.35}}>🏠</div>
              <div style={{color:GOLD,fontSize:11,margin:"8px 0",fontFamily:"monospace"}}>TAGANI IMMO · {userDoc?.displayName} · {fmtDate(photos[lightbox]?.ts)}</div>
              <div style={{color:"#ccc",fontSize:11}}>{photos[lightbox]?.type} · {photos[lightbox]?.sizeKB}KB · 1920×1080</div>
              <div style={{display:"flex",gap:10,marginTop:12}}>
                {lightbox>0&&<button onClick={()=>setLightbox(l=>l-1)} style={{padding:"9px 18px",borderRadius:8,background:"#333",color:"#fff",border:"none",cursor:"pointer",fontSize:18}}>‹</button>}
                <button onClick={()=>setLightbox(null)} style={{padding:"9px 18px",borderRadius:8,background:GOLD,color:"#0d1117",border:"none",cursor:"pointer",fontWeight:700}}>✕ Fermer</button>
                {lightbox<photos.length-1&&<button onClick={()=>setLightbox(l=>l+1)} style={{padding:"9px 18px",borderRadius:8,background:"#333",color:"#fff",border:"none",cursor:"pointer",fontSize:18}}>›</button>}
              </div>
              <div style={{color:"#666",fontSize:11,marginTop:6}}>{lightbox+1} / {photos.length}</div>
            </div>
          </div>
        )}

        <Header back={()=>setView("agent")} title="INSPECTION" sub={autoSaved?`💾 Sauvegardé à ${autoSaved}`:undefined}
          right={<><button onClick={()=>saveInsp()} style={{background:`${GOLD}1a`,border:`1px solid ${GOLD}44`,color:GOLD,borderRadius:6,padding:"5px 9px",cursor:"pointer",fontSize:11,fontWeight:700}}>Sauver</button><button onClick={submitInsp} style={{background:GOLD,border:"none",color:"#0d1117",borderRadius:6,padding:"5px 9px",cursor:"pointer",fontSize:11,fontWeight:700,marginLeft:4}}>Soumettre ✓</button></>}/>
        <GpsBar/>

        {/* Progress */}
        <div style={{padding:"5px 14px 4px",background:S.bg,borderBottom:`1px solid ${S.bdr}`,flexShrink:0}}>
          <div style={{display:"flex",gap:2,marginBottom:3}}>
            {TABS.map(tt=>{const done=(tt==="details"&&prop.address)||(tt==="photos"&&photos.length>=10)||(tt==="owner"&&prop.ownerName)||(!["details","photos","owner"].includes(tt));return<div key={tt} style={{flex:1,height:3,borderRadius:2,background:done?GOLD:S.bdr}}/>;})}</div>
          <div style={{color:S.txt2,fontSize:9}}>{doneCount} / {TABS.length} sections complètes</div>
        </div>

        {/* Tab bar */}
        <div style={{display:"flex",gap:4,padding:"6px 8px",borderBottom:`1px solid ${S.bdr}`,overflowX:"auto",background:S.bg,flexShrink:0,scrollbarWidth:"none"}}>
          {TABS.map(tt=><button key={tt} onClick={()=>setInspTab(tt)} style={tabBtnSt(inspTab===tt)}>{TLBLS[tt]}</button>)}
        </div>

        <div style={{flex:1,overflowY:"auto",padding:14}}>

          {/* DETAILS TAB */}
          {inspTab==="details"&&<>
            <div style={card}>
              <label style={lbl}>Adresse complète *</label>
              <input style={inp} value={prop.address||""} onChange={e=>upProp("address",e.target.value)} placeholder="Ex: 12 Rue des Acacias, Coleah, Conakry"/>
              <label style={{...lbl,marginTop:10}}>Localisation</label>
              <LocationSelector value={locVal} onChange={setLocVal} S={S}/>
            </div>
            <div style={card}>
              <label style={lbl}>Type de propriété</label>
              <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                {[["house","Maison"],["apartment","Appartement"],["villa","Villa"],["land","Terrain"],["commercial","Commercial"],["warehouse","Entrepôt"]].map(([k,v])=>(
                  <button key={k} onClick={()=>upProp("type",k)} style={{padding:"8px 12px",borderRadius:6,border:`1.5px solid ${prop.type===k?GOLD:S.bdr}`,background:prop.type===k?`${GOLD}1a`:"transparent",color:prop.type===k?GOLD:S.txt2,fontSize:12,cursor:"pointer",minHeight:38}}>{v}</button>
                ))}
              </div>
            </div>
            <div style={card}>
              <label style={lbl}>Nombre de pièces</label>
              {[["🛏 Chambres","bedrooms"],["🚿 Salles de bain","bathrooms"],["🛋 Salons","livingRooms"],["🍳 Cuisines","kitchens"],["🍽 Salles à manger","diningRooms"],["🚗 Garages","garages"],["💼 Bureaux","offices"],["🧺 Buanderies","laundryRooms"],["🌿 Balcons","balconies"],["📦 Débarras","storageRooms"]].map(([l,k])=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:`1px solid ${S.bdr}22`}}>
                  <span style={{fontSize:13}}>{l}</span>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <button onClick={()=>adjRoom(k,-1)} style={{width:32,height:32,borderRadius:"50%",border:`1px solid ${S.bdr}`,background:"transparent",color:S.txt2,cursor:"pointer",fontSize:18}}>−</button>
                    <span style={{color:GOLD,fontWeight:700,fontSize:18,width:24,textAlign:"center"}}>{prop[k]||0}</span>
                    <button onClick={()=>adjRoom(k,1)} style={{width:32,height:32,borderRadius:"50%",border:`1px solid ${GOLD}44`,background:`${GOLD}1a`,color:GOLD,cursor:"pointer",fontSize:18}}>+</button>
                  </div>
                </div>
              ))}
            </div>
            <div style={card}>
              <label style={lbl}>Mesures &amp; Prix</label>
              {[["Surface habitable (m²)","totalArea"],["Surface terrain (m²)","landArea"],["Superficie (hectares)","landHa"],["Année de construction","yearBuilt"],["Prix de vente (GNF)","listPrice"]].map(([l,k])=>(
                <div key={k}><label style={{...lbl,fontSize:9}}>{l}</label><input type="number" style={{...inp,marginBottom:6}} value={prop[k]||""} onChange={e=>upProp(k,e.target.value)} placeholder="0"/></div>
              ))}
            </div>
            <div style={card}>
              <label style={lbl}>État général</label>
              <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                {[["excellent","Excellent"],["good","Bon"],["fair","Correct"],["poor","Mauvais"],["renovation","À rénover"]].map(([k,v])=>(
                  <button key={k} onClick={()=>upProp("condition",k)} style={{padding:"7px 12px",borderRadius:6,border:`1.5px solid ${prop.condition===k?GOLD:S.bdr}`,background:prop.condition===k?`${GOLD}1a`:"transparent",color:prop.condition===k?GOLD:S.txt2,fontSize:12,cursor:"pointer",minHeight:38}}>{v}</button>
                ))}
              </div>
            </div>
            <div style={card}>
              <label style={lbl}>Équipements ({feats.length} sélectionnés)</label>
              <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                {PROPERTY_FEATURES.map(f=>(
                  <button key={f} onClick={()=>toggleFeat(f)} style={{padding:"6px 10px",borderRadius:6,border:`1.5px solid ${feats.includes(f)?GOLD:S.bdr}`,background:feats.includes(f)?`${GOLD}1a`:"transparent",color:feats.includes(f)?GOLD:S.txt2,fontSize:11,cursor:"pointer",minHeight:36}}>{f}</button>
                ))}
              </div>
            </div>
            {gps&&<div style={{...card,border:`1px solid ${GOLD}22`}}>
              <label style={lbl}>📍 GPS Propriété</label>
              <div style={{display:"flex",gap:6,marginBottom:8}}>
                {[["LAT",gps.lat.toFixed(7)],["LNG",gps.lng.toFixed(7)]].map(([l,v])=>(
                  <div key={l} style={{flex:1,background:S.bg2,borderRadius:8,padding:"8px",textAlign:"center",border:`1px solid ${S.bdr}`}}>
                    <div style={{color:S.txt2,fontSize:9}}>{l}</div>
                    <div style={{color:GOLD,fontSize:11,fontFamily:"monospace",fontWeight:700}}>{v}</div>
                  </div>
                ))}
              </div>
              <a href={`https://maps.google.com/?q=${gps.lat},${gps.lng}`} target="_blank" rel="noreferrer" style={{color:"#58a6ff",fontSize:12}}>Ouvrir dans Google Maps →</a>
            </div>}
          </>}

          {/* OWNER TAB */}
          {inspTab==="owner"&&<>
            <div style={card}>
              <OwnerForm prop={prop} onChange={upProp} S={S}/>
            </div>
            <div style={card}>
              <label style={lbl}>📷 Photo pièce d'identité</label>
              <div onClick={()=>showToast("📷 Dans l'app: caméra s'ouvre pour photographier la CNI/Passeport")} style={{background:S.bg2,border:`2px dashed ${GOLD}44`,borderRadius:8,padding:22,textAlign:"center",cursor:"pointer"}}>
                <div style={{fontSize:36,marginBottom:6}}>📷</div>
                <div style={{color:GOLD,fontSize:12,fontWeight:600}}>Photographier la pièce d'identité</div>
                <div style={{color:S.txt2,fontSize:10,marginTop:4}}>CNI · Passeport · Permis de conduire</div>
              </div>
            </div>
          </>}

          {/* PHOTOS TAB */}
          {inspTab==="photos"&&<>
            <div style={{...card,border:`1px solid ${photos.length>=10?"#27ae6044":"#e67e2244"}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <div>
                  <label style={{...lbl,marginTop:0}}>Photos de la propriété</label>
                  <div style={{color:photos.length>=10?"#27ae60":"#e67e22",fontSize:11}}>{photos.length}/10 minimum {photos.length>=10?"· ✓ Exigence respectée":""}</div>
                </div>
                {bdg(photos.length>=10?"#27ae60":"#e67e22",photos.length)}
              </div>
              <div style={{background:S.bdr,borderRadius:3,height:4,marginBottom:10}}><div style={{width:`${Math.min(100,(photos.length/10)*100)}%`,height:"100%",background:photos.length>=10?"#27ae60":GOLD,borderRadius:3,transition:"width .3s"}}/></div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={addPhoto} style={{...goldBtn,flex:2,fontSize:13}}>📷 Ajouter photo</button>
                <button onClick={()=>showToast("📁 Dans l'app réelle: galerie du téléphone")} style={{flex:1,padding:"11px",borderRadius:8,background:S.bg3,color:GOLD,border:`1px solid ${GOLD}44`,cursor:"pointer",fontSize:13}}>📁</button>
              </div>
            </div>
            <div style={{...card,background:S.bg2,marginBottom:12}}>
              <label style={lbl}>Checklist des prises requises</label>
              {SHOT_TYPES.slice(0,12).map(item=>{const done=photos.some(p=>p.type===item);return(
                <div key={item} style={{display:"flex",gap:10,alignItems:"center",padding:"5px 0",borderBottom:`1px solid ${S.bdr}22`}}>
                  <span style={{color:done?"#27ae60":S.txt2,fontSize:16}}>{done?"✓":"○"}</span>
                  <span style={{fontSize:12,color:done?S.txt:S.txt2}}>{item}</span>
                </div>
              );})}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:5}}>
              {photos.map((ph,i)=>(
                <div key={i} onClick={()=>setLightbox(i)} style={{position:"relative",aspectRatio:"4/3",borderRadius:7,overflow:"hidden",cursor:"pointer",background:`linear-gradient(135deg,${ph.color||"#333"}44,${ph.color||"#333"}99)`,border:`1px solid ${S.bdr}22`}}>
                  <div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,opacity:.35}}>🏠</div>
                  <div style={{position:"absolute",top:3,left:3,background:`${GOLD}ee`,color:"#0d1117",fontSize:7,fontWeight:700,padding:"1px 4px",borderRadius:3}}>#{i+1}</div>
                  {ph.type&&<div style={{position:"absolute",bottom:0,left:0,right:0,background:"rgba(0,0,0,.7)",color:"#fff",fontSize:7,padding:"2px 4px",textAlign:"center"}}>{ph.type}</div>}
                  <button onClick={e=>{e.stopPropagation();setPhotos(prev=>prev.filter((_,j)=>j!==i));}} style={{position:"absolute",top:2,right:2,background:"#c0392bcc",color:"#fff",border:"none",borderRadius:"50%",width:16,height:16,cursor:"pointer",fontSize:9,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
                </div>
              ))}
              <div onClick={addPhoto} style={{aspectRatio:"4/3",borderRadius:7,border:`2px dashed ${GOLD}55`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",background:`${GOLD}08`,gap:4}}>
                <span style={{fontSize:20,opacity:.6}}>📷</span>
                <span style={{fontSize:8,color:GOLD,fontWeight:700}}>AJOUTER</span>
              </div>
            </div>
          </>}

          {/* DOCS TAB */}
          {inspTab==="docs"&&<div style={card}>
            <label style={lbl}>Documents disponibles</label>
            <p style={{color:S.txt2,fontSize:11,marginBottom:10}}>Cochez les documents disponibles, puis photographiez chacun.</p>
            <div style={{display:"flex",gap:6,marginBottom:12}}>
              {[["land","⬛ Terrain / Sol"],["house","🏠 Maison / Bâtiment"]].map(([k,l])=>(
                <button key={k} onClick={()=>setDocType(k)} style={{flex:1,padding:"9px",borderRadius:7,border:`1.5px solid ${docType===k?GOLD:S.bdr}`,background:docType===k?`${GOLD}1a`:"transparent",color:docType===k?GOLD:S.txt2,fontSize:11,cursor:"pointer",fontWeight:700,minHeight:42}}>{l}</button>
              ))}
            </div>
            {currentDocs.map(doc=>(
              <div key={doc.id} style={{marginBottom:10,paddingBottom:10,borderBottom:`1px solid ${S.bdr}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{display:"flex",gap:10,alignItems:"center",flex:1}}>
                    <button onClick={()=>toggleDoc(doc.id)} style={{width:24,height:24,borderRadius:5,border:`2px solid ${docs[doc.id]?GOLD:S.bdr}`,background:docs[doc.id]?GOLD:"transparent",color:"#0d1117",cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{docs[doc.id]?"✓":""}</button>
                    <div style={{fontSize:12,fontWeight:600,color:docs[doc.id]?S.txt:S.txt2}}>{doc.label}</div>
                  </div>
                  {docs[doc.id]&&<button onClick={()=>showToast("📷 Dans l'app: caméra s'ouvre pour photographier ce document")} style={{padding:"5px 10px",borderRadius:6,background:`${GOLD}1a`,color:GOLD,border:`1px solid ${GOLD}44`,cursor:"pointer",fontSize:11,minHeight:34}}>📷 Photo</button>}
                </div>
              </div>
            ))}
          </div>}

          {/* PLAN TAB */}
          {inspTab==="plan"&&<>
            <div style={{display:"flex",gap:6,marginBottom:10}}>
              {[["2d","✏ Plan 2D"],["3d","🧊 Vue 3D"]].map(([k,l])=><button key={k} onClick={()=>setPlanMode(k)} style={tabBtnSt(planMode===k)}>{l}</button>)}
            </div>
            <div style={card}>
              {planMode==="2d"?<Canvas2D rooms={ROOM_KEYS.map(k=>({key:k,count:prop[k]||0}))} S={S}/>:<Canvas3D S={S}/>}
            </div>
          </>}

          {/* LAND TAB */}
          {inspTab==="land"&&<>
            <div style={card}>
              <label style={lbl}>Carte du périmètre — Appuyez pour marquer les coins</label>
              <LandCanvas pts={landPts} onChange={setLandPts} S={S}/>
            </div>
            <div style={card}>
              <button onClick={()=>showToast("📐 Dans l'app: caméra avec overlay jaune MESURE EN COURS — TAGANI IMMO")} style={{...goldBtn,background:`${GOLD}1a`,color:GOLD,border:`1px solid ${GOLD}44`,fontSize:13,marginBottom:8}}>📐 Mesurer avec caméra</button>
              <div style={{background:"#000",borderRadius:8,overflow:"hidden",height:80,position:"relative"}}>
                <div style={{position:"absolute",inset:8,border:`2px dashed ${GOLD}`,borderRadius:4}}/>
                <div style={{position:"absolute",top:2,left:0,right:0,textAlign:"center",background:"rgba(0,0,0,.7)",color:GOLD,fontSize:9,fontWeight:700,fontFamily:"monospace",padding:"2px 0"}}>📐 MESURE EN COURS — TAGANI IMMO</div>
                <div style={{position:"absolute",bottom:5,left:0,right:0,textAlign:"center",color:GOLD,fontSize:10,fontFamily:"monospace"}}>~18.5m × ~14.2m ≈ 263m²</div>
              </div>
            </div>
          </>}

          {/* NOTES TAB */}
          {inspTab==="notes"&&<>
            <div style={card}>
              <label style={lbl}>Notes supplémentaires</label>
              <textarea style={{...inp,minHeight:100,resize:"vertical"}} value={inspNotes} onChange={e=>setInspNotes(e.target.value)} placeholder="Observations, état, quartier, travaux recommandés…"/>
            </div>
            <div style={card}>
              <label style={lbl}>Notes vocales ({voiceNotes.length})</label>
              <button onMouseDown={startRec} onMouseUp={stopRec} onTouchStart={e=>{e.preventDefault();startRec();}} onTouchEnd={e=>{e.preventDefault();stopRec();}}
                style={{width:"100%",padding:"12px",borderRadius:8,border:`1.5px solid ${recording?"#e74c3c":S.bdr}`,background:recording?"#e74c3c1a":"transparent",color:recording?"#e74c3c":S.txt2,cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",gap:10,justifyContent:"center",minHeight:50,userSelect:"none",WebkitUserSelect:"none"}}>
                <span style={{fontSize:22}}>🎙</span>
                {recording?`⏹ ${fmtDuration(recSec)} — Relâcher pour envoyer`:"Maintenir pour enregistrer"}
              </button>
              <div style={{marginTop:10,display:"flex",flexDirection:"column",gap:8}}>
                {voiceNotes.map((vn,i)=>(
                  <div key={vn.id||i} style={{background:S.bg2,borderRadius:8,padding:"10px 12px",border:`1px solid ${S.bdr}`}}>
                    <div style={{color:S.txt2,fontSize:10,marginBottom:6}}>{fmtDate(vn.ts)}</div>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <button onClick={()=>{if(vn.url){const a=new Audio(vn.url);a.play();}}} style={{width:32,height:32,borderRadius:"50%",background:GOLD,color:"#0d1117",border:"none",cursor:"pointer",fontSize:13}}>▶</button>
                      <div style={{flex:1,height:4,background:S.bdr,borderRadius:2}}/>
                      <span style={{color:S.txt2,fontSize:11,fontFamily:"monospace"}}>{fmtDuration(vn.duration)}</span>
                      <button onClick={()=>setVoiceNotes(prev=>prev.filter((_,j)=>j!==i))} style={{background:"transparent",border:"none",color:"#c0392b",cursor:"pointer",fontSize:16}}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>}
        </div>
      </div>
    );
  }

  /* ════════════════════════════════════════════════
     AGENT DASHBOARD
  ════════════════════════════════════════════════ */
  if(view==="agent") {
    const mine=inspections;
    return(
      <div style={{maxWidth:430,margin:"0 auto",minHeight:"100vh",background:S.bg,color:S.txt,fontFamily:"system-ui,sans-serif",display:"flex",flexDirection:"column"}}>
        <style>{CSS_GLOBAL}</style>
        {toastMsg&&<div style={{position:"fixed",top:16,left:"50%",transform:"translateX(-50%)",background:toastMsg.type==="err"?"#c0392b":GOLD,color:toastMsg.type==="err"?"#fff":"#0d1117",padding:"10px 20px",borderRadius:20,fontWeight:700,fontSize:13,zIndex:9999,boxShadow:"0 4px 20px rgba(0,0,0,.5)"}}>{toastMsg.msg}</div>}

        <Header title={t.appName} sub={`Bonjour, ${userDoc?.displayName?.split(" ")[0]||""} 👋`} right={<>{themeBtn}{langBtn}{logoutBtn}</>}/>
        <GpsBar/>

        <div style={{flex:1,overflowY:"auto",paddingBottom:65}}>
          {showGuide&&<GuideScreen S={S} t={t} onClose={()=>{setShowGuide(false);startNew();}}/>}

          {/* HOME */}
          {navTab==="home"&&!showGuide&&<div style={{padding:14}}>
            <div style={{display:"flex",gap:8,marginBottom:12}}>
              {[[mine.length,"Total",GOLD],[mine.filter(i=>i.status==="submitted").length,"Soumises","#27ae60"],[mine.filter(i=>i.status!=="submitted").length,"Brouillons","#e67e22"]].map(([n,l,c])=>(
                <div key={l} style={{flex:1,background:S.bg3,borderRadius:10,padding:"10px 6px",textAlign:"center",border:`1px solid ${c}22`}}>
                  <div style={{color:c,fontSize:24,fontWeight:700}}>{n}</div>
                  <div style={{color:S.txt2,fontSize:10}}>{l}</div>
                </div>
              ))}
            </div>
            <button onClick={()=>setShowGuide(true)} style={{...goldBtn,marginBottom:10}}>+ {t.newInspection}</button>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
              <button onClick={()=>{setNavTab("chat");setUnread(0);}} style={{...ghostBtn,fontSize:13}}>💬 Chat d'équipe</button>
              <button onClick={()=>setNavTab("map")} style={{...ghostBtn,fontSize:13}}>📍 Ma position</button>
            </div>
            <div style={{color:S.txt2,fontSize:10,letterSpacing:.5,textTransform:"uppercase",marginBottom:8}}>Mes Inspections ({mine.length})</div>
            {mine.map(ins=>(
              <div key={ins.id} style={{...card,cursor:"pointer"}} onClick={()=>openInsp(ins)}>
                <div style={{display:"flex",justifyContent:"space-between",gap:8}}>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:600,fontSize:14,marginBottom:3}}>{ins.property?.address||"Sans adresse"}</div>
                    <div style={{color:S.txt2,fontSize:11}}>{[ins.property?.region,ins.property?.commune].filter(Boolean).join(" › ")}</div>
                    <div style={{color:S.txt2,fontSize:11,marginTop:2}}>📸 {ins.photos?.length||0} · 🛏 {ins.property?.bedrooms||0} · 🚿 {ins.property?.bathrooms||0}</div>
                    <div style={{color:S.txt2,fontSize:10,marginTop:2}}>{fmtDate(ins.timestamp)}</div>
                  </div>
                  <div>{bdg(ins.status==="submitted"?"#27ae60":"#e67e22",ins.status==="submitted"?"✓ Soumise":"Brouillon")}</div>
                </div>
              </div>
            ))}
            {mine.length===0&&<div style={{color:S.txt2,textAlign:"center",padding:40,fontSize:13}}>Aucune inspection. Commencez ci-dessus.</div>}
          </div>}

          {/* INSPECTIONS */}
          {navTab==="inspections"&&<div style={{padding:14}}>
            <div style={{color:S.txt2,fontSize:10,textTransform:"uppercase",marginBottom:10}}>Toutes mes inspections ({mine.length})</div>
            {mine.map(ins=>(
              <div key={ins.id} style={{...card,cursor:"pointer"}} onClick={()=>openInsp(ins)}>
                <div style={{fontWeight:600,fontSize:14}}>{ins.property?.address||"Sans adresse"}</div>
                <div style={{color:S.txt2,fontSize:11,marginTop:3,display:"flex",gap:8,alignItems:"center"}}>
                  <span>{fmtDate(ins.timestamp)}</span>{bdg(ins.status==="submitted"?"#27ae60":"#e67e22",ins.status==="submitted"?"✓":"Brouillon")}
                </div>
                <div style={{color:S.txt2,fontSize:11,marginTop:4}}>📸{ins.photos?.length||0} · {ins.property?.type} · 🛏{ins.property?.bedrooms||0}</div>
              </div>
            ))}
            {mine.length===0&&<div style={{color:S.txt2,textAlign:"center",padding:40}}>Aucune inspection</div>}
          </div>}

          {/* MAP */}
          {navTab==="map"&&<div style={{padding:14}}>
            <div style={{...card,border:`1px solid ${GOLD}22`}}>
              <div style={{color:S.txt2,fontSize:10,textTransform:"uppercase",marginBottom:8}}>📍 Position actuelle</div>
              {gps?<>
                <div style={{fontFamily:"monospace",fontSize:14,color:GOLD,marginBottom:6}}>{gps.lat.toFixed(7)}°N, {gps.lng.toFixed(7)}°E</div>
                <div style={{color:S.txt2,fontSize:12,marginBottom:10}}>Précision: ±{gps.acc}m</div>
                <a href={`https://maps.google.com/?q=${gps.lat},${gps.lng}`} target="_blank" rel="noreferrer" style={{color:"#58a6ff",fontSize:12}}>Ouvrir dans Google Maps →</a>
              </>:<div style={{color:S.txt2,fontSize:12}}>En attente du signal GPS…</div>}
            </div>
            {mine.filter(i=>i.location).map(ins=>(
              <div key={ins.id} style={card}>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <div><div style={{fontSize:13}}>{ins.property?.address||"—"}</div><div style={{fontSize:10,color:S.txt2,fontFamily:"monospace"}}>{ins.location?.lat?.toFixed(5)}, {ins.location?.lng?.toFixed(5)}</div></div>
                  <a href={`https://maps.google.com/?q=${ins.location?.lat},${ins.location?.lng}`} target="_blank" rel="noreferrer" style={{color:"#58a6ff",fontSize:13,alignSelf:"center"}}>→</a>
                </div>
              </div>
            ))}
          </div>}

          {/* CHAT */}
          {navTab==="chat"&&<div style={{padding:"10px 14px"}}>
            <ChatPanel messages={chatMessages} currentUser={fbUser?{uid:fbUser.uid}:null} onSend={sendChat} S={S} t={t}/>
          </div>}

          {/* PROFILE */}
          {navTab==="profile"&&<div style={{padding:14}}>
            <div style={{...card,textAlign:"center",padding:24}}>
              <div style={{width:72,height:72,borderRadius:"50%",background:`${GOLD}22`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px",fontSize:28,color:GOLD,fontWeight:700}}>{(userDoc?.displayName||"?")[0]}</div>
              <div style={{fontSize:18,fontWeight:600}}>{userDoc?.displayName}</div>
              <div style={{color:S.txt2,fontSize:13,marginTop:4}}>{fbUser?.email}</div>
              <div style={{marginTop:8}}>{bdg("#27ae60","● Agent actif")}</div>
            </div>
            <div style={card}>
              {[["📋 Inspections",mine.length],["📸 Photos",mine.reduce((s,i)=>s+(i.photos?.length||0),0)],["✓ Soumises",mine.filter(i=>i.status==="submitted").length],["🎙 Notes vocales",mine.reduce((s,i)=>s+(i.voiceNotes?.length||0),0)]].map(([l,n])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:`1px solid ${S.bdr}`}}><span style={{fontSize:13}}>{l}</span><span style={{color:GOLD,fontWeight:700,fontSize:17}}>{n}</span></div>
              ))}
            </div>
            <button onClick={doLogout} style={{...ghostBtn,color:"#e74c3c",borderColor:"#e74c3c44",marginTop:4}}>↩ {t.logout}</button>
          </div>}
        </div>
        <BottomNav active={navTab}/>
      </div>
    );
  }

  /* ════════════════════════════════════════════════
     ADMIN DASHBOARD
  ════════════════════════════════════════════════ */
  if(view==="admin") {
    const allUsersArr=Object.values(allUsers);
    const pending=allUsersArr.filter(u=>u.status==="pending");
    const agents=allUsersArr.filter(u=>u.role==="agent");

    const exportCsv=()=>{
      const rows=[["ID","Agent","Adresse","Type","Région","Prix","Photos","Statut","Date"],...allInspections.map(i=>[i.id,i.agentName,i.property?.address||"",i.property?.type||"",i.property?.region||"",i.property?.listPrice||"",i.photos?.length||0,i.status,fmtDate(i.timestamp)])];
      const csv=rows.map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");
      const blob=new Blob([csv],{type:"text/csv;charset=utf-8;"});
      const url=URL.createObjectURL(blob);
      const a=document.createElement("a");a.href=url;a.download="tagani_inspections.csv";a.click();
      showToast("📊 CSV exporté!");
    };

    return(
      <div style={{maxWidth:430,margin:"0 auto",minHeight:"100vh",background:S.bg,color:S.txt,fontFamily:"system-ui,sans-serif",display:"flex",flexDirection:"column"}}>
        <style>{CSS_GLOBAL}</style>
        {toastMsg&&<div style={{position:"fixed",top:16,left:"50%",transform:"translateX(-50%)",background:toastMsg.type==="err"?"#c0392b":GOLD,color:toastMsg.type==="err"?"#fff":"#0d1117",padding:"10px 20px",borderRadius:20,fontWeight:700,fontSize:13,zIndex:9999,boxShadow:"0 4px 20px rgba(0,0,0,.5)"}}>{toastMsg.msg}</div>}

        <Header title={t.appName} sub={`ADMIN · ${userDoc?.displayName}`} right={<>{themeBtn}{langBtn}{logoutBtn}</>}/>
        <GpsBar/>

        {/* Stats */}
        <div style={{display:"flex",gap:6,padding:"10px 14px",flexShrink:0}}>
          {[[allInspections.length,"Inspections",GOLD],[allInspections.filter(i=>i.status==="submitted").length,"Soumises","#27ae60"],[pending.length,"En attente","#e67e22"],[agents.length,"Agents","#58a6ff"]].map(([n,l,c])=>(
            <div key={l} style={{flex:1,background:S.bg3,borderRadius:9,padding:"8px 4px",textAlign:"center",border:`1px solid ${c}22`}}>
              <div style={{color:c,fontSize:22,fontWeight:700}}>{n}</div>
              <div style={{color:S.txt2,fontSize:9}}>{l}</div>
            </div>
          ))}
        </div>

        {/* Pending alert */}
        {pending.length>0&&(
          <div style={{margin:"0 14px 8px",padding:"10px 14px",background:"#e67e2212",border:"1px solid #e67e2244",borderRadius:10}}>
            <div style={{color:"#e67e22",fontWeight:600,fontSize:12,marginBottom:8}}>⏳ {pending.length} compte(s) en attente d'approbation</div>
            {pending.map(u=>(
              <div key={u.uid} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0"}}>
                <div><div style={{fontSize:12,fontWeight:600}}>{u.displayName}</div><div style={{fontSize:10,color:S.txt2}}>{u.email}</div></div>
                <button onClick={()=>approveUser(u.uid)} style={{padding:"6px 12px",background:"#27ae60",color:"#fff",border:"none",borderRadius:6,cursor:"pointer",fontSize:11,fontWeight:700}}>✅ Approuver</button>
              </div>
            ))}
          </div>
        )}

        {/* Admin tabs */}
        <div style={{display:"flex",gap:4,padding:"0 14px",marginBottom:8,overflowX:"auto",flexShrink:0,scrollbarWidth:"none"}}>
          {[["🔴 Flux","live"],["📋 Soumissions","submissions"],["📍 Tracking","tracking"],["👥 Équipe","team"],["⚙ Paramètres","settings"]].map(([l,id])=>(
            <button key={id} onClick={()=>setAdminTab(id)} style={{...tabBtnSt(adminTab===id),padding:"6px 8px"}}>{l}</button>
          ))}
        </div>

        <div style={{flex:1,overflowY:"auto",padding:"0 14px 20px"}}>

          {/* LIVE */}
          {adminTab==="live"&&<>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <div style={{color:S.txt2,fontSize:10,textTransform:"uppercase"}}>Toutes les inspections</div>
              {bdg("#27ae60","● Temps réel")}
            </div>
            {[...allInspections].map(ins=>(
              <div key={ins.id} style={card}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div>
                    <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:4}}>
                      <div style={{width:26,height:26,borderRadius:"50%",background:`${GOLD}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:GOLD}}>{(ins.agentName||"?").slice(0,2).toUpperCase()}</div>
                      <span style={{fontSize:12,fontWeight:600}}>{ins.agentName}</span>
                    </div>
                    <div style={{fontSize:12}}>{ins.property?.address||"Sans adresse"}</div>
                    <div style={{color:S.txt2,fontSize:10,marginTop:2}}>📸{ins.photos?.length||0} {ins.location?"· 📍✓":""}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    {bdg(ins.status==="submitted"?"#27ae60":"#e67e22",ins.status==="submitted"?"✓ Soumise":"Brouillon")}
                    <div style={{color:S.txt2,fontSize:9,marginTop:4}}>{fmtDate(ins.lastSaved||ins.timestamp)}</div>
                  </div>
                </div>
              </div>
            ))}
            {allInspections.length===0&&<div style={{color:S.txt2,textAlign:"center",padding:40}}>Aucune inspection enregistrée</div>}
          </>}

          {/* SUBMISSIONS */}
          {adminTab==="submissions"&&allInspections.map(ins=>(
            <div key={ins.id} style={card}>
              <div onClick={()=>setExpanded(expanded===ins.id?null:ins.id)} style={{cursor:"pointer"}}>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:600,fontSize:13}}>{ins.property?.address||"Sans adresse"}</div>
                    <div style={{color:S.txt2,fontSize:11,marginTop:2}}>Par <span style={{color:GOLD}}>{ins.agentName}</span> · {fmtDate(ins.timestamp)}</div>
                    <div style={{color:S.txt2,fontSize:10,marginTop:3}}>🛏{ins.property?.bedrooms||0} 🚿{ins.property?.bathrooms||0} 📸{ins.photos?.length||0}{ins.voiceNotes?.length?` 🎙${ins.voiceNotes.length}`:""}</div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:5,alignItems:"flex-end"}}>
                    {bdg(ins.status==="submitted"?"#27ae60":"#e67e22",ins.status==="submitted"?"✓ Soumise":"Brouillon")}
                    <span style={{color:S.txt2,fontSize:11}}>{expanded===ins.id?"▲":"▼"}</span>
                  </div>
                </div>
              </div>
              {expanded===ins.id&&(
                <div style={{marginTop:12,paddingTop:12,borderTop:`1px solid ${S.bdr}`}}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5,marginBottom:10}}>
                    {[["Type",ins.property?.type],["État",ins.property?.condition],["Chambres",ins.property?.bedrooms],["SdB",ins.property?.bathrooms],["Surface",ins.property?.totalArea?ins.property.totalArea+"m²":"—"],["Prix",ins.property?.listPrice?parseInt(ins.property.listPrice).toLocaleString()+" GNF":"—"]].map(([l,v])=>(
                      <div key={l} style={{background:S.bg2,borderRadius:5,padding:"6px 8px"}}><div style={{color:S.txt2,fontSize:9,textTransform:"uppercase"}}>{l}</div><div style={{color:S.txt,fontSize:12,fontWeight:600,textTransform:"capitalize"}}>{v||"—"}</div></div>
                    ))}
                  </div>
                  {ins.property?.ownerName&&<div style={{background:S.bg2,borderRadius:6,padding:"8px",marginBottom:8}}><div style={{color:S.txt2,fontSize:9}}>PROPRIÉTAIRE</div><div style={{color:S.txt,fontSize:13}}>{ins.property.ownerFirst||""} {ins.property.ownerName}</div>{ins.property.ownerPhone&&<div style={{color:S.txt2,fontSize:11}}>{ins.property.ownerPhone}</div>}</div>}
                  {ins.location&&<div style={{background:S.bg2,borderRadius:6,padding:"8px",marginBottom:8}}><div style={{color:S.txt2,fontSize:9}}>GPS</div><div style={{color:GOLD,fontFamily:"monospace",fontSize:11}}>{ins.location.lat.toFixed(7)}°N, {ins.location.lng.toFixed(7)}°E</div><a href={`https://maps.google.com/?q=${ins.location.lat},${ins.location.lng}`} target="_blank" rel="noreferrer" style={{color:"#58a6ff",fontSize:11}}>Google Maps →</a></div>}
                  {ins.property?.features?.length>0&&<div style={{background:S.bg2,borderRadius:6,padding:"8px",marginBottom:8}}><div style={{color:S.txt2,fontSize:9,marginBottom:4}}>ÉQUIPEMENTS</div><div style={{display:"flex",flexWrap:"wrap",gap:4}}>{ins.property.features.map(f=><span key={f} style={{background:`${GOLD}22`,color:GOLD,fontSize:9,padding:"2px 7px",borderRadius:4}}>{f}</span>)}</div></div>}
                  {ins.property?.notes&&<div style={{background:S.bg2,borderRadius:6,padding:"8px"}}><div style={{color:S.txt2,fontSize:9}}>NOTES</div><div style={{color:S.txt,fontSize:12,lineHeight:1.5}}>{ins.property.notes}</div></div>}
                </div>
              )}
            </div>
          ))}

          {/* TRACKING */}
          {adminTab==="tracking"&&<>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <div style={{color:S.txt2,fontSize:10,textTransform:"uppercase"}}>Localisation des agents</div>
              {bdg("#27ae60","● Live")}
            </div>
            {Object.values(agentLocs).map(loc=>(
              <div key={loc.uid} style={card}>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <div>
                    <div style={{fontWeight:600,fontSize:13,marginBottom:3}}>{loc.name}</div>
                    <div style={{color:GOLD,fontFamily:"monospace",fontSize:11}}>{loc.lat?.toFixed(6)}°N, {loc.lng?.toFixed(6)}°E</div>
                    <div style={{color:S.txt2,fontSize:10,marginTop:2}}>Vu: {fmtDate(loc.ts)} · ±{loc.acc}m</div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:5,alignItems:"flex-end"}}>
                    {bdg(Date.now()-loc.ts<600000?"#27ae60":"#e74c3c",Date.now()-loc.ts<600000?"● Actif":"● Absent")}
                    {loc.lat&&<a href={`https://maps.google.com/?q=${loc.lat},${loc.lng}`} target="_blank" rel="noreferrer" style={{color:"#58a6ff",fontSize:11}}>Suivre →</a>}
                  </div>
                </div>
              </div>
            ))}
            {Object.keys(agentLocs).length===0&&<div style={{color:S.txt2,textAlign:"center",padding:40}}>Aucun agent en ligne</div>}
          </>}

          {/* TEAM */}
          {adminTab==="team"&&<>
            <div style={card}>
              <div style={{color:S.txt2,fontSize:10,textTransform:"uppercase",marginBottom:10}}>Équipe ({allUsersArr.length} membres)</div>
              {allUsersArr.map(u=>(
                <div key={u.uid} style={{padding:"10px 0",borderBottom:`1px solid ${S.bdr}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                    <div>
                      <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:4}}>
                        <div style={{width:30,height:30,borderRadius:"50%",background:`${GOLD}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:GOLD}}>{(u.displayName||"?")[0]}</div>
                        <div><div style={{fontSize:13,fontWeight:600}}>{u.displayName}</div><div style={{fontSize:10,color:S.txt2}}>{u.email}</div></div>
                      </div>
                      <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                        {bdg(u.role==="admin"?GOLD:"#666",u.role)}
                        {bdg(u.status==="active"?"#27ae60":u.status==="pending"?"#e67e22":"#e74c3c",u.status==="active"?"● Actif":u.status==="pending"?"⏳ En attente":"⊘ Suspendu")}
                      </div>
                    </div>
                    {u.uid!==fbUser?.uid&&(
                      <div style={{display:"flex",flexDirection:"column",gap:3}}>
                        {u.status==="pending"&&<button onClick={()=>approveUser(u.uid)} style={{padding:"4px 10px",background:"#27ae601a",color:"#27ae60",border:"1px solid #27ae6044",borderRadius:5,cursor:"pointer",fontSize:10,fontWeight:700}}>✅ Approuver</button>}
                        {u.status==="active"&&<button onClick={()=>suspendUser(u.uid)} style={{padding:"4px 10px",background:"#e67e221a",color:"#e67e22",border:"1px solid #e67e2244",borderRadius:5,cursor:"pointer",fontSize:10}}>⊘ Suspendre</button>}
                        {u.status==="suspended"&&<button onClick={()=>reactivateUser(u.uid)} style={{padding:"4px 10px",background:"#27ae601a",color:"#27ae60",border:"1px solid #27ae6044",borderRadius:5,cursor:"pointer",fontSize:10}}>▶ Réactiver</button>}
                        <button onClick={()=>sendPasswordResetEmail(auth,u.email).then(()=>showToast("🔑 Email envoyé!")).catch(()=>showToast("Erreur","err"))} style={{padding:"4px 10px",background:"transparent",color:"#58a6ff",border:"1px solid #58a6ff44",borderRadius:5,cursor:"pointer",fontSize:10}}>🔑 Réinit. MDP</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>}

          {/* SETTINGS */}
          {adminTab==="settings"&&<>
            <div style={card}>
              <label style={lbl}>Code PIN d'inscription</label>
              <p style={{color:S.txt2,fontSize:11,marginBottom:10}}>Les nouveaux agents doivent entrer ce PIN pour créer leur compte.</p>
              <input style={inp} type="password" inputMode="numeric" maxLength={4} id="pin-inp" placeholder="Nouveau PIN (4 chiffres)"/>
              <button onClick={async()=>{const v=document.getElementById("pin-inp")?.value;if(!v||v.length!==4){showToast("PIN doit avoir 4 chiffres","err");return;}await set(ref(db,"settings/teamPin"),v);showToast("✅ PIN mis à jour!");}} style={goldBtn}>Mettre à jour le PIN</button>
            </div>
            <div style={card}>
              <label style={lbl}>Export &amp; Partage</label>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                <button onClick={exportCsv} style={{padding:"10px 14px",borderRadius:8,background:"#27ae601a",color:"#27ae60",border:"1px solid #27ae6044",cursor:"pointer",fontSize:12}}>📊 Exporter CSV</button>
              </div>
            </div>
            <div style={card}>
              <label style={lbl}>Résumé Firebase</label>
              {[["Auth Email/Password","✅"],["Realtime Database","✅ europe-west1"],["Storage Photos","✅"],["Hosting","✅ HTTPS"],["Version","v3.0 · Complète"]].map(([l,v])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${S.bdr}`}}>
                  <span style={{fontSize:12,color:S.txt2}}>{l}</span>
                  <span style={{fontSize:11,color:GOLD,fontWeight:600}}>{v}</span>
                </div>
              ))}
            </div>
          </>}
        </div>
      </div>
    );
  }

  return <div style={{maxWidth:430,margin:"0 auto",minHeight:"100vh",background:S.bg,color:S.txt,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"system-ui,sans-serif"}}><style>{CSS_GLOBAL}</style>Chargement…</div>;
}
