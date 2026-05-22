import { useState, useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
/* FIREBASE IMPORTS */
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail } from "firebase/auth";
import { getDatabase, ref, set, get, push, onValue, off, remove, update } from "firebase/database";
import { getStorage, ref as sRef, uploadString, getDownloadURL } from "firebase/storage";
/* FIREBASE CONFIG */
const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
     databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.europe-west1.firebasedatabase.app",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_PROJECT_ID.appspot.com",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const storage = getStorage(app);
const TR = { fr: { appName: "TAGANI IMMO", appSub: "Systeme d'Inspection de Terrain", login: "Se Connecter", logout: "Deconnexion" }, en: { appName: "TAGANI IMMO", appSub: "Field Inspection System", login: "Sign In", logout: "Logout" } };
const GUINEA_LOCATIONS = [{ region: "Conakry", prefectures: [{ prefecture: "Kaloum", communes: ["Almamya","Sandervalia"] }] }];
const GUINEA_DOCS_LAND = [{ id: "tf", label: "Titre Foncier (TF)", labelEn: "Land Title (TF)" }];
const GUINEA_DOCS_HOUSE = [{ id: "tf_maison", label: "Titre Foncier (TF) de la Parcelle", labelEn: "Land Title of the Plot" }];
const FEATURES_FR = ["Piscine","Poste de Securite"];
const FEATURES_EN = ["Swimming Pool","Security Post"];
const FLOORS_FR = ["Rez-de-Chaussee","1er Etage","2eme Etage"];
const RTYPES_FR = ["Salon","Chambre"];
const RTYPES_EN = ["Living Room","Bedroom"];
const RCOLORS = {"Salon":"#3d85c8","Living Room":"#3d85c8"};
const INIT_AGENTS = [{id:"admin",name:"Administrateur",pin:"0000",role:"admin"},{id:"a001",name:"Agent Un",pin:"1111",role:"agent"}];
const GOLD="#C9A84C", GOLD_LIGHT="#B8960A";
const ld=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d;}catch{return d;}};
const sv=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const uid=()=>Math.random().toString(36).slice(2,10);
const fmt=ts=>new Date(ts).toLocaleString("fr-GN");
const makeStyles=(dark)=>({
     bg: dark?"#0d1117":"#f6f8fa",
     bg2: dark?"#161b22":"#ffffff",
     border: dark?"#30363d":"#d0d7de",
     text: dark?"#e6edf3":"#1f2328",
     text2: dark?"#8b949e":"#656d76",
     gold: dark?GOLD:GOLD_LIGHT
});
function LocationSelector({value,onChange,dark,t}){const[manual,setManual]=useState(false);const S=makeStyles(dark);const sel=value||{};const regions=GUINEA_LOCATIONS.map(r=>r.region);return(<div><label>Location</label>label></div>div>);}
function OwnerForm({data,onChange,dark,t,lang}){const S=makeStyles(dark);return(<div><label>Owner</label>label></div>div>);}
function Canvas2D({elements,onChange,dark,lang,t}){const ref=useRef(null);return(<div><canvas ref={ref} width={340} height={270}/></div>div>);}
function Canvas3D({floorPlans,dark,t}){const mountRef=useRef(null);return(<div><div ref={mountRef} style={{width:"100%",height:290}}/></div>div>);}
function LandCanvas({points,onChange,gps,dark,t}){const ref=useRef(null);return(<div><canvas ref={ref} width={340} height={235}/></div>div>);}
function ChatPanel({user,dark,t,lang}){const[msgs,setMsgs]=useState([]);return(<div><div>Chat Panel</div>div></div>div>);}
function GuideScreen({dark,t,lang,onBack}){return(<div><button onClick={onBack}>Back</button>button><div>Guide</div>div></div>div>);}
const CSS="*{box-sizing:border-box;}";</div>
   export default function TaganiImmo(){const[dark,setDark]=useState(true);const[lang,setLang]=useState("fr");const t=TR[lang];const S=makeStyles(dark);const[fbUser,setFbUser]=useState(null);const[userDoc,setUserDoc]=useState(null);const[authLoading,setAuthLoading]=useState(true);const[view,setView]=useState("login");const[gps,setGps]=useState(null);const[gpsStatus,setGpsStatus]=useState("loading");const watchRef=useRef(null);const[inspections,setInspections]=useState([]);const[adminTab,setAdminTab]=useState("live");const[allUsers,setAllUsers]=useState({});const[agentLocs,setAgentLocs]=useState({});const[draft,setDraft]=useState(null);const[inspTab,setInspTab]=useState("details");const[photos,setPhotos]=useState([]);const[docPhotos,setDocPhotos]=useState({});const[ownerIdPh,setOwnerIdPh]=useState(null);const[floorPlans,setFloorPlans]=useState({});const[floorNum,setFloorNum]=useState(0);const[landPts,setLandPts]=useState([]);const[docs,setDocs]=useState({});const[feats,setFeats]=useState([]);const[locVal,setLocVal]=useState({});const photoRef=useRef(null);useEffect(()=>{return onAuthStateChanged(auth,async fbU=>{if(fbU){setFbUser(fbU);const doc=await get(ref(db,`users/${fbU.uid}`));if(doc.exists()){const uDoc={...doc.val(),uid:fbU.uid};setUserDoc(uDoc);setView(uDoc.role==="admin"?"admin":"dashboard");}else{setView("login");}}else{setFbUser(null);setUserDoc(null);setView("login");}setAuthLoading(false);});},[]);useEffect(()=>{if(!navigator.geolocation)return;setGpsStatus("loading");watchRef.current=navigator.geolocation.watchPosition(pos=>{const loc={lat:pos.coords.latitude,lng:pos.coords.longitude,acc:Math.round(pos.coords.accuracy),ts:Date.now()};setGps(loc);setGpsStatus("active");},{},);},[fbUser]);if(authLoading)return(<div style={{maxWidth:430,margin:"0 auto",minHeight:"100vh",background:S.bg,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{color:GOLD,fontSize:20,fontWeight:700}}>{t.appName}</div>div></div>div>);if(view==="login")return(<div style={{maxWidth:430,margin:"0 auto",minHeight:"100vh",background:S.bg}}><style>{CSS}</style>style><div style={{padding:20,textAlign:"center"}}><div style={{color:GOLD,fontSize:24,fontWeight:700,marginBottom:20}}>{t.appName}</div>div><div style={{color:S.text2,fontSize:14,marginBottom:20}}>Field Inspection System</div>div></div>div></div>div>);if(view==="dashboard")return(<div style={{maxWidth:430,margin:"0 auto",minHeight:"100vh",background:S.bg}}><style>{CSS}</style>style><div style={{padding:20}}><div style={{fontSize:18,fontWeight:700,marginBottom:20}}>Dashboard</div>div><div style={{color:S.text2}}>Welcome {userDoc?.displayName||fbUser?.email}</div>div></div>div></div>div>);if(view==="admin")return(<div style={{maxWidth:430,margin:"0 auto",minHeight:"100vh",background:S.bg}}><style>{CSS}</style>style><div style={{padding:20}}><div style={{fontSize:18,fontWeight:700}}>Admin Dashboard</div>div></div>div></div>div>);return(<div style={{maxWidth:430,margin:"0 auto",minHeight:"100vh",background:S.bg,padding:20}}><div>Unknown View</div>div></div>div>);}</style>
export default function TaganiImmo(){const[dark,setDark]=useState(true);const[lang,setLang]=useState("fr");const t=TR[lang];const S=makeStyles(dark);const[fbUser,setFbUser]=useState(null);const[view,setView]=useState("login");const[gps,setGps]=useState(null);useEffect(()=>{return onAuthStateChanged(auth,async fbU=>{if(fbU)setFbUser(fbU);else setView("login");});},[]);if(view==="login")return(<div style={{maxWidth:430,margin:"0 auto",minHeight:"100vh",background:S.bg,padding:20}}><style>{CSS}</style>style><div style={{textAlign:"center",marginTop:100}}><div style={{fontSize:28,fontWeight:700,color:GOLD,marginBottom:20}}>TAGANI IMMO</div>div><div style={{fontSize:14,color:S.text2}}>Field Inspection System</div>div><div style={{marginTop:40}}>Loading...</div>div></div>div></div>div>);if(view==="dashboard")return(<div style={{maxWidth:430,margin:"0 auto",minHeight:"100vh",background:S.bg,padding:20}}><div style={{fontSize:20,fontWeight:700,marginBottom:20}}>Dashboard</div>div><div>Welcome</div>div></div>div>);return(<div style={{maxWidth:430,margin:"0 auto",padding:20}}><div>App</div>div></div>div>);}</style>
