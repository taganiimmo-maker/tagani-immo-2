import { useState, useEffect, useRef, useCallback } from "react";
import * as THREE from "three";

/* ═══════════════════════════════════════════════════
   TRANSLATIONS
═══════════════════════════════════════════════════ */
const TR = {
  fr: {
    appName:"TAGANI IMMO", appSub:"Système d'Inspection de Terrain",
    login:"Se Connecter", logout:"Déconnexion", selectAgent:"Sélectionnez votre nom",
    pinLabel:"Code PIN", pinPlaceholder:"• • • •", loginError:"PIN incorrect. Réessayez.",
    teamOnly:"Accès Équipe Uniquement", demoHint:"Admin: 0000 · Agent 1: 1111 · Agent 2: 2222",
    dashboard:"Tableau de Bord", newInspection:"+ Nouvelle Inspection de Propriété",
    myInspections:"Mes Inspections", total:"Total", submitted:"Soumises", drafts:"Brouillons",
    gpsLocation:"📍 Votre Position Actuelle", gpsActive:"● GPS ACTIF", refresh:"🔄 Actualiser",
    chat:"💬 Chat", guide:"❓ Guide",
    inspection:"INSPECTION", save:"Sauvegarder", submit:"Soumettre ✓",
    tabs:{ details:"📋 Détails", owner:"👤 Propriétaire", photos:"📸 Photos", docs:"📄 Docs", plan:"🏗 Plan", land:"🌐 Terrain" },
    address:"Adresse complète *", addressPh:"Ex: 12 Rue des Acacias, Conakry",
    propType:"Type de Propriété", condition:"État Général",
    propTypes:{ house:"Maison", apartment:"Appartement", villa:"Villa", land:"Terrain", commercial:"Commercial", warehouse:"Entrepôt" },
    conditions:{ excellent:"Excellent", good:"Bon", fair:"Correct", poor:"Mauvais", renovation:"À rénover" },
    rooms:"Nombre de Pièces",
    roomLabels:{ bedrooms:"🛏 Chambres", bathrooms:"🚿 Salles de bain", livingRooms:"🛋 Salons", kitchens:"🍳 Cuisines", diningRooms:"🍽 Salles à manger", garages:"🚗 Garages", offices:"💼 Bureaux", laundryRooms:"🧺 Buanderies", balconies:"🌿 Balcons", storageRooms:"📦 Débarras", hallways:"🚪 Couloirs", staircases:"🪜 Escaliers" },
    measurements:"Mesures et Prix", floorArea:"Surface habitable (m²)", landArea:"Surface terrain (m²)", landHectares:"Superficie (hectares)", yearBuilt:"Année de construction", listPrice:"Prix de vente (GNF)",
    features:"Équipements et Caractéristiques", agentNotes:"Notes de l'Agent",
    notesPh:"Observations sur l'état, le quartier, travaux recommandés...",
    gpsCoords:"📍 Coordonnées GPS", detectGPS:"📍 Détecter Ma Position", openMaps:"Ouvrir dans Google Maps →",
    location:"Localisation", region:"Région", prefecture:"Préfecture", commune:"Commune", neighborhood:"Quartier", manualLocation:"Saisie manuelle", manualPh:"Entrez le nom du lieu...",
    ownerInfo:"Informations du Propriétaire", ownerName:"Nom complet", ownerFirstName:"Prénom(s)", ownerDOB:"Date de naissance", ownerPOB:"Lieu de naissance", ownerPhone:"Téléphone", ownerPhone2:"Téléphone 2 (optionnel)", ownerEmail:"Email", ownerNationality:"Nationalité", ownerIdType:"Type de pièce d'identité", ownerIdNum:"Numéro de la pièce d'identité", ownerAddress:"Adresse du propriétaire", ownerRelation:"Relation à la propriété", ownerOccupation:"Profession",
    idTypes:{ cni:"CNI (Carte Nationale d'Identité)", passport:"Passeport", dl:"Permis de conduire", residence:"Carte de résident" },
    relations:{ owner:"Propriétaire", coowner:"Co-propriétaire", family:"Représentant familial", lawyer:"Représentant légal / Avocat", agent:"Agent immobilier", tenant:"Locataire", caretaker:"Gardien / Gérant", executor:"Exécuteur testamentaire" },
    photoOwnerID:"📸 Photo de la Pièce d'Identité", photographID:"📷 Photographier la Pièce d'Identité",
    idInstr:"Photographiez la CNI, le passeport ou le permis de conduire du propriétaire",
    visitDate:"Date de visite", ownerAskingPrice:"Prix demandé par le propriétaire (GNF)", negotiationNotes:"Notes de négociation", negoPh:"Points clés, motivation du vendeur, flexibilité sur le prix...",
    photoTitle:"Photos de la Propriété", photoMin:"minimum requis", photoMet:"✓ Exigence respectée", photoNeed:"Encore besoin de", camera:"📷 Caméra", upload:"📁 Importer",
    photoChecklist:["Façade extérieure avant","Façade extérieure arrière","Salon principal","Cuisine","Chambre principale","Autres chambres","Salles de bain","Garage / Parking","Jardin / Cour","Vue de la rue / Quartier","Équipements spéciaux","Défauts / Dommages éventuels"],
    docsTitle:"Liste de Contrôle des Documents", docsSub:"Cochez les documents disponibles, puis photographiez chacun.",
    plan2D:"✏ Plan 2D", plan3D:"🧊 Vue 3D", floor:"Étage",
    floors:["Rez-de-Chaussée","1er Étage","2ème Étage","3ème Étage","4ème Étage"],
    drawWall:"✏ Mur", drawRoom:"⬜ Pièce", undo:"↩ Annuler", clear:"🗑 Effacer",
    clearConfirm:"Effacer le plan ?", floorSummary:"Résumé des Étages", elements:"éléments",
    view3D:"Vue 3D Interactive", view3DSub:"Glissez pour orbiter · Scroll pour zoomer · Basé sur votre plan 2D",
    landMap:"Carte du Périmètre du Terrain", landSub:"Appuyez pour marquer les coins du terrain. Marchez jusqu'à chaque coin et enregistrez un point GPS.",
    addGPS:"+ Point GPS", gpsPoints:"Points GPS des Frontières", gpsCalc:"Calcul de Surface GPS",
    area_m2:"m²", area_ft2:"Pieds²", area_acres:"Acres", area_ha:"Hectares",
    chatTitle:"Chat d'Équipe + IA", chatPh:"Poser une question à l'IA ou écrire à l'équipe...", clearChat:"Effacer", thinking:"En cours de réflexion...",
    adminDash:"TABLEAU DE BORD ADMIN", exportCSV:"📊 CSV", downloadPhotos:"📥 Photos",
    liveFeed:"🔴 Direct", submissions:"📋 Soumissions", tracking:"📍 Localisation", teamMgmt:"👥 Équipe",
    liveTitle:"Flux en Direct", liveRefresh:"● Actualisation 4s", liveDesc:"Toutes les sauvegardes et soumissions des agents apparaissent ici en temps réel.",
    addAgent:"Ajouter un Nouvel Agent", agentFullName:"Nom complet de l'agent", agentPIN:"PIN 4 chiffres", addAgentBtn:"Ajouter l'Agent ✓", currentTeam:"Équipe Actuelle",
    remove:"Supprimer", removeConfirm:"Supprimer cet agent ?",
    deleteInsp:"Supprimer cette inspection ?",
    guideTitle:"Comment Utiliser Tagani Immo",
    submitted_badge:"✓ Soumise", draft_badge:"Brouillon",
    photos_count:"photos", docs_count:"docs",
    noInspections:"Aucune inspection. Appuyez ci-dessus pour commencer.",
    noAgentLocs:"Aucune localisation. Les agents apparaissent ici dès leur connexion.",
    accuracy:"Précision", lastSeen:"Vu il y a", active:"● Actif", away:"● Absent",
    trackBtn:"Suivre →", ownerSection:"Propriétaire", featuresSection:"Équipements",
    availDocs:"Documents Disponibles", agentNotesSection:"Notes Agent",
    ownerIDPhoto:"Photo de la Pièce d'Identité",
    saveOK:"✅ Sauvegardé !", submitOK:"✅ Inspection soumise à Tagani Immo !",
    submitErrAddress:"⚠ Entrez l'adresse de la propriété.", submitErrPhotos:"⚠ Minimum 10 photos requises. Vous en avez",
    registerOwner:"Enregistrer Propriétaire",
  },
  en: {
    appName:"TAGANI IMMO", appSub:"Field Inspection System",
    login:"Sign In", logout:"Logout", selectAgent:"Select your name",
    pinLabel:"PIN Code", pinPlaceholder:"• • • •", loginError:"Incorrect PIN. Please try again.",
    teamOnly:"Authorised Team Access Only", demoHint:"Admin: 0000 · Agent 1: 1111 · Agent 2: 2222",
    dashboard:"Dashboard", newInspection:"+ New Property Inspection",
    myInspections:"My Inspections", total:"Total", submitted:"Submitted", drafts:"Drafts",
    gpsLocation:"📍 Your Current Location", gpsActive:"● GPS ACTIVE", refresh:"🔄 Refresh",
    chat:"💬 Chat", guide:"❓ Guide",
    inspection:"INSPECTION", save:"Save", submit:"Submit ✓",
    tabs:{ details:"📋 Details", owner:"👤 Owner", photos:"📸 Photos", docs:"📄 Docs", plan:"🏗 Plan", land:"🌐 Land" },
    address:"Full address *", addressPh:"e.g. 12 Rue des Acacias, Conakry",
    propType:"Property Type", condition:"General Condition",
    propTypes:{ house:"House", apartment:"Apartment", villa:"Villa", land:"Land", commercial:"Commercial", warehouse:"Warehouse" },
    conditions:{ excellent:"Excellent", good:"Good", fair:"Fair", poor:"Poor", renovation:"Needs Renovation" },
    rooms:"Room Count",
    roomLabels:{ bedrooms:"🛏 Bedrooms", bathrooms:"🚿 Bathrooms", livingRooms:"🛋 Living Rooms", kitchens:"🍳 Kitchens", diningRooms:"🍽 Dining Rooms", garages:"🚗 Garages", offices:"💼 Offices", laundryRooms:"🧺 Laundry", balconies:"🌿 Balconies", storageRooms:"📦 Storage", hallways:"🚪 Hallways", staircases:"🪜 Staircases" },
    measurements:"Measurements & Price", floorArea:"Floor area (m²)", landArea:"Land area (m²)", landHectares:"Land size (hectares)", yearBuilt:"Year built", listPrice:"Listing price (GNF)",
    features:"Features & Amenities", agentNotes:"Agent Notes",
    notesPh:"Property condition, neighbourhood, recommended work...",
    gpsCoords:"📍 GPS Coordinates", detectGPS:"📍 Detect My Location", openMaps:"Open in Google Maps →",
    location:"Location", region:"Region", prefecture:"Prefecture", commune:"Commune", neighborhood:"Neighbourhood", manualLocation:"Manual entry", manualPh:"Enter location name...",
    ownerInfo:"Owner Information", ownerName:"Last name", ownerFirstName:"First name(s)", ownerDOB:"Date of birth", ownerPOB:"Place of birth", ownerPhone:"Phone", ownerPhone2:"Phone 2 (optional)", ownerEmail:"Email", ownerNationality:"Nationality", ownerIdType:"ID document type", ownerIdNum:"ID document number", ownerAddress:"Owner's address", ownerRelation:"Relationship to property", ownerOccupation:"Occupation",
    idTypes:{ cni:"NID (National Identity Card)", passport:"Passport", dl:"Driver's Licence", residence:"Resident Card" },
    relations:{ owner:"Owner", coowner:"Co-owner", family:"Family Representative", lawyer:"Legal Representative / Lawyer", agent:"Real Estate Agent", tenant:"Tenant", caretaker:"Caretaker / Manager", executor:"Estate Executor" },
    photoOwnerID:"📸 Owner ID Photo", photographID:"📷 Photograph Owner ID",
    idInstr:"Photograph the owner's NID, passport or driver's licence",
    visitDate:"Visit date", ownerAskingPrice:"Owner's asking price (GNF)", negotiationNotes:"Negotiation notes", negoPh:"Key discussion points, seller motivation, price flexibility...",
    photoTitle:"Property Photos", photoMin:"minimum required", photoMet:"✓ Requirement met", photoNeed:"Still need", camera:"📷 Camera", upload:"📁 Upload",
    photoChecklist:["Front exterior","Rear exterior","Living room","Kitchen","Master bedroom","Other bedrooms","Bathrooms","Garage / Parking","Garden / Yard","Street view","Special features","Damage / Issues"],
    docsTitle:"Document Checklist", docsSub:"Check available documents, then photograph each one.",
    plan2D:"✏ 2D Plan", plan3D:"🧊 3D View", floor:"Floor",
    floors:["Ground Floor","1st Floor","2nd Floor","3rd Floor","4th Floor"],
    drawWall:"✏ Wall", drawRoom:"⬜ Room", undo:"↩ Undo", clear:"🗑 Clear",
    clearConfirm:"Clear floor plan?", floorSummary:"Floor Summary", elements:"elements",
    view3D:"Interactive 3D View", view3DSub:"Drag to orbit · Scroll to zoom · Built from your 2D plan",
    landMap:"Land Boundary Map", landSub:"Tap to mark boundary corners. Walk to each corner and record a GPS point.",
    addGPS:"+ GPS Point", gpsPoints:"Boundary GPS Points", gpsCalc:"GPS Area Calculation",
    area_m2:"m²", area_ft2:"Sq Ft", area_acres:"Acres", area_ha:"Hectares",
    chatTitle:"Team Chat + AI", chatPh:"Ask the AI a question or message your team...", clearChat:"Clear", thinking:"Thinking...",
    adminDash:"ADMIN DASHBOARD", exportCSV:"📊 CSV", downloadPhotos:"📥 Photos",
    liveFeed:"🔴 Live", submissions:"📋 Submissions", tracking:"📍 Tracking", teamMgmt:"👥 Team",
    liveTitle:"Live Feed", liveRefresh:"● Refresh 4s", liveDesc:"All agent saves and submissions appear here in real time.",
    addAgent:"Add New Agent", agentFullName:"Agent full name", agentPIN:"4-digit PIN", addAgentBtn:"Add Agent ✓", currentTeam:"Current Team",
    remove:"Remove", removeConfirm:"Remove this agent?",
    deleteInsp:"Delete this inspection?",
    guideTitle:"How to Use Tagani Immo",
    submitted_badge:"✓ Submitted", draft_badge:"Draft",
    photos_count:"photos", docs_count:"docs",
    noInspections:"No inspections yet. Tap above to begin.",
    noAgentLocs:"No location data. Agents appear here when they log in.",
    accuracy:"Accuracy", lastSeen:"Last seen", active:"● Active", away:"● Away",
    trackBtn:"Track →", ownerSection:"Owner", featuresSection:"Features",
    availDocs:"Available Documents", agentNotesSection:"Agent Notes",
    ownerIDPhoto:"Owner ID Photo",
    saveOK:"✅ Saved!", submitOK:"✅ Inspection submitted to Tagani Immo!",
    submitErrAddress:"⚠ Enter the property address.", submitErrPhotos:"⚠ Minimum 10 photos required. You have",
    registerOwner:"Register Owner",
  }
};

/* ═══════════════════════════════════════════════════
   GUINEA (CONAKRY) — COMPLETE LOCATION DATA
═══════════════════════════════════════════════════ */
const GUINEA_LOCATIONS = [
  {
    region:"Conakry", prefectures:[
      { prefecture:"Kaloum", communes:["Almamya","Sandervalia","Coronthie","Boulbinet","Tombo","Centre Commercial","Port de Conakry","Plateau"] },
      { prefecture:"Dixinn", communes:["Dixinn Centre","Coleah","Landreah","Donka","Camayenne","Belle-Vue","Minière","Cameroun","Dixinn Mosquée","Sangoya","Hamdallaye Dixinn"] },
      { prefecture:"Matam", communes:["Madina","Enco-5","Enta","Kobaya","Taouyah","Hafia","Dar-es-Salam","Matam Centre","Bambéto Nord","Kolomy"] },
      { prefecture:"Ratoma", communes:["Kipé","Sonfonia","Koloma","Bambeto","Cosa","Gbessia","Kaporo","Lambanyi","Ratoma Centre","Simbaya","Wanindara","Kagbelen","Koliagbe","Dabondy","Centa"] },
      { prefecture:"Matoto", communes:["Matoto Centre","Kissosso","Nongo","Cimenterie","Kobayah","Sangoyah","Yimbaya","Soronkoni","Tombolia","Démoudoula","Yénédouno","Kagbélen","Simbaya Gare"] },
    ]
  },
  {
    region:"Kindia", prefectures:[
      { prefecture:"Kindia", communes:["Kindia Centre","Kolente","Souguéta","Damakanya","Mambia","Fermessadou","Kolenté"] },
      { prefecture:"Coyah", communes:["Coyah Centre","Mafanco","Wonkifong","Kouriya","Manéah"] },
      { prefecture:"Dubréka", communes:["Dubréka Centre","Kassa","Fotoba","Benty"] },
      { prefecture:"Forécariah", communes:["Forécariah Centre","Benty","Coyah Sud","Moussayah"] },
      { prefecture:"Télimélé", communes:["Télimélé Centre","Bourouwal","Fello Koundoua","Santou"] },
    ]
  },
  {
    region:"Boké", prefectures:[
      { prefecture:"Boké", communes:["Boké Centre","Boké Mity","Sangarédi","Kamsar","Dabiss","Kolaboui","Tamita"] },
      { prefecture:"Boffa", communes:["Boffa Centre","Koba","Mankountan","Tamita"] },
      { prefecture:"Fria", communes:["Fria Centre","Banguigni","Tormelin"] },
      { prefecture:"Gaoual", communes:["Gaoual Centre","Touba","Koumbia","Wendou M'Bour"] },
      { prefecture:"Koundara", communes:["Koundara Centre","Sambailo","Termessé","Youkounkoun"] },
    ]
  },
  {
    region:"Labé", prefectures:[
      { prefecture:"Labé", communes:["Labé Centre","Hafia","Kouramangui","Popodara","Lélouma"] },
      { prefecture:"Koubia", communes:["Koubia Centre","Pitta","Mboulo"] },
      { prefecture:"Lélouma", communes:["Lélouma Centre","Dalein","Diari","Maci"] },
      { prefecture:"Mali", communes:["Mali Centre","Dontari","Fello Koundoua","Yembereng"] },
      { prefecture:"Tougué", communes:["Tougué Centre","Bhouria","Kolangui"] },
    ]
  },
  {
    region:"Mamou", prefectures:[
      { prefecture:"Mamou", communes:["Mamou Centre","Sériba","Timbo","Porédaka","Konkouré"] },
      { prefecture:"Dalaba", communes:["Dalaba Centre","Ditinn","Kaalan","Mboula"] },
      { prefecture:"Pita", communes:["Pita Centre","Timbi-Madina","Timbi-Touni","Pellel","Mitty"] },
    ]
  },
  {
    region:"Faranah", prefectures:[
      { prefecture:"Faranah", communes:["Faranah Centre","Banian","Niandankoro","Tiro","Sandenia"] },
      { prefecture:"Dabola", communes:["Dabola Centre","Arfamoussaya","Kankama"] },
      { prefecture:"Dinguiraye", communes:["Dinguiraye Centre","Gagnakali","Lansanaya","Sélouma"] },
      { prefecture:"Kissidougou", communes:["Kissidougou Centre","Fermessadou","Kondiadou","Yendé Millimou"] },
    ]
  },
  {
    region:"Kankan", prefectures:[
      { prefecture:"Kankan", communes:["Kankan Centre","Babila","Baté","Cissékoro","Koumana","Missamana","Sabadou Baranama","Tondon"] },
      { prefecture:"Kérouané", communes:["Kérouané Centre","Damaro","Sibiribaro","Koumandou"] },
      { prefecture:"Kouroussa", communes:["Kouroussa Centre","Doura","Komola","Sanguiana","Tinti-Coulibaly"] },
      { prefecture:"Mandiana", communes:["Mandiana Centre","Dialakoro","Faralako","Morodou","Niantanina"] },
      { prefecture:"Siguiri", communes:["Siguiri Centre","Doko","Kiniébakoura","Norassoba","Seguelen","Naboun"] },
    ]
  },
  {
    region:"Nzérékoré", prefectures:[
      { prefecture:"Nzérékoré", communes:["Nzérékoré Centre","Gouécké","Lainé","Samoe","Zébéla","Gbèmou"] },
      { prefecture:"Beyla", communes:["Beyla Centre","Diassodou","Gbondapi","Moussadou","Sinko"] },
      { prefecture:"Guéckédou", communes:["Guéckédou Centre","Bagadou","Fangamadou","Nongoa","Tékoulo"] },
      { prefecture:"Lola", communes:["Lola Centre","Bossou","Diécké","Nzo","Tounkarata"] },
      { prefecture:"Macenta", communes:["Macenta Centre","Bengore","Bofossou","Sengbédou","Vonkoro"] },
      { prefecture:"Yomou", communes:["Yomou Centre","Banie","Bignamou","Doromou","Kassadou"] },
    ]
  },
];

/* ═══════════════════════════════════════════════════
   GUINEA REAL ESTATE DOCUMENTS (CONAKRY SPECIFIC)
═══════════════════════════════════════════════════ */
const GUINEA_DOCS_LAND = [
  { id:"tf", label:"Titre Foncier (TF)", labelEn:"Land Title (TF)", desc:"Document foncier officiel — le plus important", descEn:"Official land title — most important document" },
  { id:"cadastre", label:"Plan Cadastral / Plan de Bornage", labelEn:"Cadastral Plan / Survey Plan", desc:"Délimitation officielle de la parcelle par le cadastre", descEn:"Official land boundary survey" },
  { id:"permis_occuper", label:"Permis d'Occuper (PO)", labelEn:"Occupation Permit (PO)", desc:"Si le Titre Foncier est en cours d'établissement", descEn:"If land title is being processed" },
  { id:"non_litige", label:"Attestation de Non-Litige", labelEn:"Non-Dispute Certificate", desc:"Délivrée par le Conseil de Quartier ou la Mairie", descEn:"Issued by neighbourhood council or town hall" },
  { id:"taxe_fonciere", label:"Quittance de la Taxe Foncière (DGI)", labelEn:"Property Tax Receipt (DGI)", desc:"Reçu de paiement de la taxe foncière annuelle", descEn:"Annual property tax payment receipt" },
  { id:"attestation_cession", label:"Attestation de Cession / Vente", labelEn:"Transfer / Sale Certificate", desc:"Signée par les deux parties devant témoins", descEn:"Signed by both parties before witnesses" },
  { id:"legalisation", label:"Légalisation de Signature", labelEn:"Signature Legalisation", desc:"Par la Mairie, le Notaire ou le Tribunal", descEn:"By town hall, notary or court" },
  { id:"attestation_commune", label:"Attestation de la Commune / Mairie", labelEn:"Municipality Certificate", desc:"Validation locale de la transaction", descEn:"Local validation of the transaction" },
];

const GUINEA_DOCS_HOUSE = [
  { id:"tf_maison", label:"Titre Foncier (TF) de la Parcelle", labelEn:"Land Title of the Plot", desc:"Document foncier de base de la propriété", descEn:"Base land title of the property" },
  { id:"permis_construire", label:"Permis de Construire", labelEn:"Building Permit", desc:"Délivré par le Ministère de l'Urbanisme et de l'Habitat", descEn:"Issued by Ministry of Urban Planning and Housing" },
  { id:"certificat_conformite", label:"Certificat de Conformité / Réception", labelEn:"Conformity Certificate", desc:"Réception des travaux par l'autorité compétente", descEn:"Work acceptance by competent authority" },
  { id:"plan_arch", label:"Plan Architectural Approuvé", labelEn:"Approved Architectural Plan", desc:"Approuvé par le BCRB ou le Ministère", descEn:"Approved by BCRB or Ministry" },
  { id:"quittance_seg", label:"Quittances SEG (Eau)", labelEn:"Water Bills (SEG)", desc:"Factures récentes de la Société des Eaux de Guinée", descEn:"Recent water utility bills" },
  { id:"quittance_edg", label:"Quittances EDG (Électricité)", labelEn:"Electricity Bills (EDG)", desc:"Factures récentes d'Électricité de Guinée", descEn:"Recent electricity utility bills" },
  { id:"acte_vente", label:"Acte de Vente Notarié", labelEn:"Notarized Sale Deed", desc:"Obligatoire pour tout transfert de propriété légal", descEn:"Required for any legal property transfer" },
  { id:"non_hypotheque", label:"Attestation de Non-Hypothèque", labelEn:"Non-Mortgage Certificate", desc:"DGI ou Registre Foncier National", descEn:"DGI or National Land Registry" },
  { id:"attestation_fiscale", label:"Attestation Fiscale (DGI)", labelEn:"Tax Certificate (DGI)", desc:"Régularité fiscale du vendeur", descEn:"Seller's tax compliance certificate" },
];

/* ═══════════════════════════════════════════════════
   FEATURES LIST
═══════════════════════════════════════════════════ */
const FEATURES_FR = ["Piscine","Poste de Sécurité / Gardiennage","Clôture Périmétrique","Forage / Puits d'eau","Groupe Électrogène","Système Solaire","Caméras CCTV","Maison Connectée (Smart Home)","Jardin Paysager","Parking Multiple","Salle de Sport","Ascenseur / Lift","Logement Gardien (BQ)","Terrasse sur Toit","Climatisation Centrale","Cuisine Ouverte / Îlot","Dressing Walk-in","Salles de Bain Attenantes","Sols en Marbre / Carrelage Haut de Gamme","Faux Plafond / POP","Fibre Optique Internet","Réservoir d'Eau Supplémentaire","Home Cinéma","Aire de Jeux pour Enfants","Générateur Automatique","Système d'Alarme"];
const FEATURES_EN = ["Swimming Pool","Security Post / Guard","Perimeter Fence","Borehole / Water Well","Diesel Generator","Solar System","CCTV Cameras","Smart Home System","Landscaped Garden","Multiple Parking","Gym / Fitness Room","Elevator / Lift","Guard's Quarters (BQ)","Rooftop Terrace","Central Air Conditioning","Open Kitchen / Island","Walk-in Wardrobe","En-suite Bathrooms","Marble / Premium Tiling","False / POP Ceiling","Fibre Optic Internet","Backup Water Tank","Home Theatre","Children Play Area","Auto Generator","Alarm System"];

const FLOORS_FR = ["Rez-de-Chaussée","1er Étage","2ème Étage","3ème Étage","4ème Étage"];
const RTYPES_FR = ["Salon","Chambre Principale","Chambre","Salle de Bain","Cuisine","Salle à Manger","Bureau","Garage","Buanderie","Balcon","Débarras","Couloir","Escalier","Toilettes","Véranda","Salle de Prière"];
const RTYPES_EN = ["Living Room","Master Bedroom","Bedroom","Bathroom","Kitchen","Dining Room","Office","Garage","Laundry","Balcony","Storage","Hallway","Staircase","Toilet","Veranda","Prayer Room"];
const RCOLORS = {"Salon":"#3d85c8","Living Room":"#3d85c8","Chambre Principale":"#6d3b8e","Master Bedroom":"#6d3b8e","Chambre":"#8e44ad","Bedroom":"#8e44ad","Salle de Bain":"#1e8449","Bathroom":"#1e8449","Cuisine":"#ca6f1e","Kitchen":"#ca6f1e","Salle à Manger":"#c0392b","Dining Room":"#c0392b","Bureau":"#1a6b9e","Office":"#1a6b9e","Garage":"#616a6b","Buanderie":"#0e7c63","Laundry":"#0e7c63","Balcon":"#196f3d","Balcony":"#196f3d","Débarras":"#797d7f","Storage":"#797d7f","Couloir":"#a6acaf","Hallway":"#a6acaf","Escalier":"#b7950b","Staircase":"#b7950b","Toilettes":"#2e86ab","Toilet":"#2e86ab","Véranda":"#117a65","Veranda":"#117a65","Salle de Prière":"#784212","Prayer Room":"#784212"};

/* ═══════════════════════════════════════════════════
   INITIAL DATA
═══════════════════════════════════════════════════ */
const INIT_AGENTS = [
  {id:"admin",name:"Administrateur",pin:"0000",role:"admin"},
  {id:"a001",name:"Agent Un",pin:"1111",role:"agent"},
  {id:"a002",name:"Agent Deux",pin:"2222",role:"agent"},
  {id:"a003",name:"Agent Trois",pin:"3333",role:"agent"},
];
const GOLD="#C9A84C", GOLD_LIGHT="#B8960A";

/* ═══════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════ */
const ld=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d;}catch{return d;}};
const sv=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const uid=()=>Math.random().toString(36).slice(2,10);
const fmt=ts=>new Date(ts).toLocaleString("fr-GN");

const gpsArea=pts=>{
  if(pts.length<3)return null;
  const R=6371000;let area=0;const n=pts.length;
  for(let i=0;i<n;i++){
    const j=(i+1)%n;
    const lat1=pts[i].lat*Math.PI/180,lat2=pts[j].lat*Math.PI/180;
    const dLng=(pts[j].lng-pts[i].lng)*Math.PI/180;
    area+=Math.sin(dLng)*(2+Math.sin(lat1)+Math.sin(lat2));
  }
  const sqM=Math.abs(area*R*R/2);
  return{sqM:sqM.toFixed(0),sqFt:(sqM*10.764).toFixed(0),acres:(sqM/4047).toFixed(4),ha:(sqM/10000).toFixed(4)};
};

const exportCSV=(inspections,t)=>{
  const H=["ID","Agent","Date","Région","Préfecture","Commune","Quartier","Adresse","Type","Chambres","SdB","Salons","Cuisines","Surfaces(m²)","Terrain(m²)","Hectares","Année","Prix(GNF)","État","Équipements","Documents","Photos","Owner ID","Lat","Lng","Nom Propriétaire","Prénom","Tel Propriétaire","Notes"];
  const rows=inspections.map(i=>{
    const p=i.property||{}, loc=i.location||{};
    const docs=Object.keys(i.documents||{}).filter(d=>i.documents[d]?.available).join("; ");
    return [i.id,i.agentName,fmt(i.timestamp),p.region||"",p.prefecture||"",p.commune||"",p.neighborhood||"",p.address||"",p.type||"",p.bedrooms||0,p.bathrooms||0,p.livingRooms||0,p.kitchens||0,p.totalArea||"",p.landArea||"",p.landHectares||"",(p.yearBuilt||""),(p.listPrice||""),(p.condition||""),(p.features||[]).join("; "),docs,(i.photos||[]).length,i.ownerIdPhoto?"Oui":"Non",(loc.lat||""),(loc.lng||""),(p.ownerName||""),(p.ownerFirstName||""),(p.ownerPhone||""),(p.notes||"").replace(/,/g,";")];
  });
  const csv=[H,...rows].map(r=>r.map(v=>`"${v}"`).join(",")).join("\n");
  const a=document.createElement("a");
  a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));
  a.download=`tagani_immo_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
};

const downloadPhotos=inspections=>{
  let i=0;
  inspections.forEach(ins=>{
    (ins.photos||[]).forEach((ph,j)=>{
      const a=document.createElement("a");a.href=ph.dataUrl;
      a.download=`${(ins.property?.address||ins.id).replace(/\s+/g,"_")}_photo_${j+1}.jpg`;
      setTimeout(()=>a.click(),i*150);i++;
    });
  });
  if(!i)alert("Aucune photo à télécharger.");
};

/* ═══════════════════════════════════════════════════
   THEME STYLES
═══════════════════════════════════════════════════ */
const makeStyles=(dark)=>({
  bg: dark?"#0d1117":"#f6f8fa",
  bg2: dark?"#161b22":"#ffffff",
  bg3: dark?"#1c2128":"#ffffff",
  border: dark?"#30363d":"#d0d7de",
  text: dark?"#e6edf3":"#1f2328",
  text2: dark?"#8b949e":"#656d76",
  gold: dark?GOLD:GOLD_LIGHT,
  success: dark?"#2ea043":"#1a7f37",
  error: dark?"#f85149":"#cf222e",
  info: dark?"#58a6ff":"#0969da",
  warning: dark?"#e67e22":"#9a6700",
  card:{background:dark?"#1c2128":"#ffffff",borderRadius:14,padding:14,marginBottom:10,border:`1px solid ${dark?"#30363d":"#d0d7de"}`},
  inp:{width:"100%",padding:"9px 12px",borderRadius:8,border:`1px solid ${dark?"#30363d":"#d0d7de"}`,background:dark?"#0d1117":"#f6f8fa",color:dark?"#e6edf3":"#1f2328",fontSize:14,display:"block",fontFamily:"inherit"},
  app:{maxWidth:430,margin:"0 auto",minHeight:"100vh",fontFamily:"'Segoe UI',system-ui,sans-serif"},
  hdr:{background:dark?"#0d1117":"#fff",borderBottom:`1px solid ${dark?"#C9A84C33":"#C9A84C44"}`,padding:"10px 15px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:10},
});

/* ═══════════════════════════════════════════════════
   LOCATION SELECTOR COMPONENT
═══════════════════════════════════════════════════ */
function LocationSelector({value, onChange, dark, t}){
  const [manual,setManual]=useState(false);
  const S=makeStyles(dark);
  const sel=value||{};
  const regions=GUINEA_LOCATIONS.map(r=>r.region);
  const prefData=GUINEA_LOCATIONS.find(r=>r.region===sel.region)?.prefectures||[];
  const prefs=prefData.map(p=>p.prefecture);
  const communes=(prefData.find(p=>p.prefecture===sel.prefecture)?.communes)||[];

  const upd=(k,v)=>{
    const next={...sel,[k]:v};
    if(k==="region"){delete next.prefecture;delete next.commune;delete next.neighborhood;}
    if(k==="prefecture"){delete next.commune;delete next.neighborhood;}
    if(k==="commune"){delete next.neighborhood;}
    onChange(next);
  };

  const selectStyle={width:"100%",padding:"9px 12px",borderRadius:8,border:`1px solid ${S.border}`,background:dark?"#0d1117":"#f6f8fa",color:S.text,fontSize:13,marginBottom:8,fontFamily:"inherit"};

  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <span style={{color:S.text2,fontSize:10,letterSpacing:0.8,textTransform:"uppercase"}}>{t.location}</span>
        <button onClick={()=>setManual(!manual)} style={{padding:"3px 8px",borderRadius:5,border:`1px solid ${S.border}`,background:"transparent",color:S.gold,fontSize:10,cursor:"pointer"}}>
          {manual?"📍 Sélectionner":t.manualLocation}
        </button>
      </div>
      {manual?(
        <input value={sel.manual||""} onChange={e=>onChange({...sel,manual:e.target.value})}
          placeholder={t.manualPh} style={{...selectStyle,marginBottom:0}}/>
      ):(
        <>
          <select value={sel.region||""} onChange={e=>upd("region",e.target.value)} style={selectStyle}>
            <option value="">{t.region}...</option>
            {regions.map(r=><option key={r}>{r}</option>)}
          </select>
          {sel.region&&(
            <select value={sel.prefecture||""} onChange={e=>upd("prefecture",e.target.value)} style={selectStyle}>
              <option value="">{t.prefecture}...</option>
              {prefs.map(p=><option key={p}>{p}</option>)}
            </select>
          )}
          {sel.prefecture&&(
            <select value={sel.commune||""} onChange={e=>upd("commune",e.target.value)} style={selectStyle}>
              <option value="">{t.commune} / {t.neighborhood}...</option>
              {communes.map(c=><option key={c}>{c}</option>)}
            </select>
          )}
          {sel.commune&&(
            <input value={sel.neighborhood||""} onChange={e=>upd("neighborhood",e.target.value)}
              placeholder={`${t.neighborhood} (optionnel)`}
              style={{...selectStyle,marginBottom:0}}/>
          )}
        </>
      )}
      {(sel.region||sel.manual)&&(
        <div style={{marginTop:6,padding:"5px 10px",background:dark?"#0d1117":"#f0f8ff",borderRadius:6,border:`1px solid ${S.gold}33`,fontSize:11,color:S.gold,fontFamily:"monospace"}}>
          📍 {sel.manual||[sel.region,sel.prefecture,sel.commune,sel.neighborhood].filter(Boolean).join(" › ")}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   OWNER REGISTRATION FORM
═══════════════════════════════════════════════════ */
function OwnerForm({data, onChange, dark, t, lang, onPhotoCapture, ownerIdPhoto, onRemovePhoto}){
  const S=makeStyles(dark);
  const ownerRef=useRef(null);
  const u=(k,v)=>onChange({...data,[k]:v});
  const inp={display:"block",width:"100%",padding:"9px 12px",borderRadius:8,border:`1px solid ${S.border}`,background:dark?"#0d1117":"#f6f8fa",color:S.text,fontSize:13,marginBottom:10,fontFamily:"inherit"};
  const sel={...inp};
  const lbl={color:S.text2,fontSize:9,letterSpacing:0.8,textTransform:"uppercase",display:"block",marginBottom:3,marginTop:8};
  const idTypeOptions=[["cni",t.idTypes.cni],["passport",t.idTypes.passport],["dl",t.idTypes.dl],["residence",t.idTypes.residence]];
  const relOptions=[["owner",t.relations.owner],["coowner",t.relations.coowner],["family",t.relations.family],["lawyer",t.relations.lawyer],["agent",t.relations.agent],["tenant",t.relations.tenant],["caretaker",t.relations.caretaker],["executor",t.relations.executor]];
  return(
    <div>
      <div style={{background:dark?"#1c2128":"#fff",borderRadius:14,padding:14,marginBottom:10,border:`1px solid ${S.border}`}}>
        <span style={{color:S.text2,fontSize:10,letterSpacing:0.8,textTransform:"uppercase",display:"block",marginBottom:10}}>{t.ownerInfo}</span>
        <label style={lbl}>{t.ownerName}</label>
        <input value={data.ownerName||""} onChange={e=>u("ownerName",e.target.value)} placeholder="ex: DIALLO" style={inp}/>
        <label style={lbl}>{t.ownerFirstName}</label>
        <input value={data.ownerFirstName||""} onChange={e=>u("ownerFirstName",e.target.value)} placeholder="ex: Mamadou Alpha" style={inp}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          <div>
            <label style={lbl}>{t.ownerDOB}</label>
            <input type="date" value={data.ownerDOB||""} onChange={e=>u("ownerDOB",e.target.value)} style={inp}/>
          </div>
          <div>
            <label style={lbl}>{t.ownerPOB}</label>
            <input value={data.ownerPOB||""} onChange={e=>u("ownerPOB",e.target.value)} placeholder="ex: Conakry" style={inp}/>
          </div>
        </div>
        <label style={lbl}>{t.ownerNationality}</label>
        <input value={data.ownerNationality||""} onChange={e=>u("ownerNationality",e.target.value)} placeholder="ex: Guinéenne" style={{...inp}}/>
        <label style={lbl}>{t.ownerOccupation}</label>
        <input value={data.ownerOccupation||""} onChange={e=>u("ownerOccupation",e.target.value)} placeholder="ex: Commerçant" style={inp}/>
        <label style={lbl}>{t.ownerPhone}</label>
        <input value={data.ownerPhone||""} onChange={e=>u("ownerPhone",e.target.value)} placeholder="ex: +224 622 000 000" style={inp}/>
        <label style={lbl}>{t.ownerPhone2}</label>
        <input value={data.ownerPhone2||""} onChange={e=>u("ownerPhone2",e.target.value)} placeholder="ex: +224 655 000 000" style={inp}/>
        <label style={lbl}>{t.ownerEmail}</label>
        <input type="email" value={data.ownerEmail||""} onChange={e=>u("ownerEmail",e.target.value)} placeholder="ex: proprietaire@email.com" style={inp}/>
        <label style={lbl}>{t.ownerAddress}</label>
        <textarea value={data.ownerAddress||""} onChange={e=>u("ownerAddress",e.target.value)} placeholder="ex: Quartier Madina, Commune de Matam, Conakry" style={{...inp,minHeight:56,resize:"vertical"}}/>
        <label style={lbl}>{t.ownerIdType}</label>
        <select value={data.ownerIdType||""} onChange={e=>u("ownerIdType",e.target.value)} style={sel}>
          <option value="">-- Sélectionnez --</option>
          {idTypeOptions.map(([v,l])=><option key={v} value={v}>{l}</option>)}
        </select>
        <label style={lbl}>{t.ownerIdNum}</label>
        <input value={data.ownerIdNum||""} onChange={e=>u("ownerIdNum",e.target.value)} placeholder="Numéro de la pièce d'identité" style={inp}/>
        <label style={lbl}>{t.ownerRelation}</label>
        <select value={data.ownerRelation||""} onChange={e=>u("ownerRelation",e.target.value)} style={sel}>
          <option value="">-- Sélectionnez --</option>
          {relOptions.map(([v,l])=><option key={v} value={v}>{l}</option>)}
        </select>
      </div>

      {/* ID PHOTO */}
      <div style={{background:dark?"#1c2128":"#fff",borderRadius:14,padding:14,marginBottom:10,border:`1px solid ${S.border}`}}>
        <span style={{color:S.text2,fontSize:10,letterSpacing:0.8,textTransform:"uppercase",display:"block",marginBottom:8}}>{t.photoOwnerID}</span>
        <p style={{color:S.text2,fontSize:11,marginBottom:10}}>{t.idInstr}</p>
        {ownerIdPhoto?(
          <div style={{position:"relative"}}>
            <img src={ownerIdPhoto.dataUrl} alt="ID" style={{width:"100%",borderRadius:8,border:`1px solid ${S.border}`,display:"block"}}/>
            <div style={{position:"absolute",top:6,right:6,display:"flex",gap:4}}>
              <button onClick={onRemovePhoto} style={{background:"#c0392bcc",color:"#fff",border:"none",borderRadius:"50%",width:24,height:24,cursor:"pointer",fontSize:12}}>✕</button>
            </div>
            <div style={{color:S.text2,fontSize:10,marginTop:4}}>{fmt(ownerIdPhoto.ts)} · {ownerIdPhoto.w}×{ownerIdPhoto.h}px HD</div>
          </div>
        ):(
          <>
            <input ref={ownerRef} type="file" accept="image/*" capture="environment" onChange={e=>onPhotoCapture(e,"ownerid")} style={{display:"none"}}/>
            <button onClick={()=>ownerRef.current?.click()} style={{width:"100%",padding:"11px",borderRadius:8,border:`1.5px solid ${S.gold}`,background:S.gold+"1a",color:S.gold,cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"inherit"}}>
              📷 {t.photographID}
            </button>
          </>
        )}
      </div>

      {/* VISIT DETAILS */}
      <div style={{background:dark?"#1c2128":"#fff",borderRadius:14,padding:14,marginBottom:10,border:`1px solid ${S.border}`}}>
        <span style={{color:S.text2,fontSize:10,letterSpacing:0.8,textTransform:"uppercase",display:"block",marginBottom:8}}>{t.visitDate}</span>
        <input type="date" value={data.visitDate||""} onChange={e=>u("visitDate",e.target.value)} style={inp}/>
        <label style={lbl}>{t.ownerAskingPrice}</label>
        <input type="number" value={data.ownerAskingPrice||""} onChange={e=>u("ownerAskingPrice",e.target.value)} placeholder="0" style={inp}/>
        <label style={lbl}>{t.negotiationNotes}</label>
        <textarea value={data.negotiationNotes||""} onChange={e=>u("negotiationNotes",e.target.value)} placeholder={t.negoPh} style={{...inp,minHeight:70,resize:"vertical"}}/>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   IMAGE COMPRESSION — HD + OPTIMIZED
═══════════════════════════════════════════════════ */
const compressImage=(file,maxW=1920,maxH=1080,quality=0.88)=>new Promise(resolve=>{
  const reader=new FileReader();
  reader.onload=e=>{
    const img=new Image();
    img.onload=()=>{
      let w=img.width,h=img.height;
      /* keep HD resolution, only scale down if enormous */
      if(w>maxW||h>maxH){
        const ratio=Math.min(maxW/w,maxH/h);
        w=Math.round(w*ratio);
        h=Math.round(h*ratio);
      }
      const canvas=document.createElement("canvas");
      canvas.width=w; canvas.height=h;
      const ctx=canvas.getContext("2d");
      ctx.imageSmoothingEnabled=true;
      ctx.imageSmoothingQuality="high";
      /* sharpen pass */
      ctx.filter="contrast(1.04) saturate(1.05) brightness(1.01)";
      ctx.drawImage(img,0,0,w,h);
      /* compressed JPEG at 88% — good quality, ~60-70% smaller than original */
      resolve({dataUrl:canvas.toDataURL("image/jpeg",quality),w,h,size:Math.round(canvas.toDataURL("image/jpeg",quality).length*0.75/1024)});
    };
    img.src=e.target.result;
  };
  reader.readAsDataURL(file);
});

/* ═══════════════════════════════════════════════════
   FLOOR PLAN CANVAS 2D
═══════════════════════════════════════════════════ */
function Canvas2D({elements,onChange,dark,lang,t}){
  const ref=useRef(null);
  const [tool,setTool]=useState("wall");
  const [rtype,setRtype]=useState(lang==="fr"?RTYPES_FR[0]:RTYPES_EN[0]);
  const [dragging,setDragging]=useState(false);
  const [s0,setS0]=useState(null);
  const G=20,snap=n=>Math.round(n/G)*G;
  const rtypes=lang==="fr"?RTYPES_FR:RTYPES_EN;

  const getXY=e=>{
    const c=ref.current,r=c.getBoundingClientRect(),src=e.touches?e.touches[0]:e;
    return{x:snap(Math.max(0,Math.min(c.width,src.clientX-r.left))),y:snap(Math.max(0,Math.min(c.height,src.clientY-r.top)))};
  };

  const paint=useCallback((els,prev)=>{
    const c=ref.current;if(!c)return;
    const ctx=c.getContext("2d"),W=c.width,H=c.height;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle=dark?"#1c2128":"#fafaf8";ctx.fillRect(0,0,W,H);
    ctx.strokeStyle=dark?"#30363d44":"#e0ddd5";ctx.lineWidth=0.5;
    for(let x=0;x<=W;x+=G){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    for(let y=0;y<=H;y+=G){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
    els.forEach(el=>{
      if(el.type==="wall"){ctx.strokeStyle=dark?"#e6edf3":"#1a1a2e";ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(el.x1,el.y1);ctx.lineTo(el.x2,el.y2);ctx.stroke();}
      else if(el.type==="room"){
        const x=Math.min(el.x1,el.x2),y=Math.min(el.y1,el.y2),w=Math.abs(el.x2-el.x1),h=Math.abs(el.y2-el.y1);
        ctx.fillStyle=el.color+"44";ctx.strokeStyle=el.color;ctx.lineWidth=2;
        ctx.fillRect(x,y,w,h);ctx.strokeRect(x,y,w,h);
        if(w>30&&h>14){ctx.fillStyle=el.color;ctx.font="bold 9px sans-serif";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(el.label,x+w/2,y+h/2);}
      }
    });
    if(prev){
      ctx.strokeStyle=GOLD;ctx.lineWidth=2;ctx.setLineDash([5,3]);
      if(tool==="wall"){ctx.beginPath();ctx.moveTo(prev.x1,prev.y1);ctx.lineTo(prev.x2,prev.y2);ctx.stroke();}
      else{const x=Math.min(prev.x1,prev.x2),y=Math.min(prev.y1,prev.y2);ctx.strokeRect(x,y,Math.abs(prev.x2-prev.x1),Math.abs(prev.y2-prev.y1));}
      ctx.setLineDash([]);
    }
  },[tool,dark]);

  useEffect(()=>{paint(elements,null);},[elements,paint]);
  const onDown=e=>{e.preventDefault();const p=getXY(e);setDragging(true);setS0(p);};
  const onMove=e=>{e.preventDefault();if(!dragging||!s0)return;const p=getXY(e);paint(elements,{x1:s0.x,y1:s0.y,x2:p.x,y2:p.y});};
  const onUp=e=>{
    e.preventDefault();if(!dragging||!s0)return;
    const c=ref.current,r=c.getBoundingClientRect(),src=e.changedTouches?e.changedTouches[0]:e;
    const p={x:snap(src.clientX-r.left),y:snap(src.clientY-r.top)};
    const dx=Math.abs(p.x-s0.x),dy=Math.abs(p.y-s0.y);
    if(tool==="wall"&&(dx>5||dy>5)) onChange([...elements,{id:uid(),type:"wall",x1:s0.x,y1:s0.y,x2:p.x,y2:p.y}]);
    else if(tool==="room"&&dx>20&&dy>15) onChange([...elements,{id:uid(),type:"room",x1:s0.x,y1:s0.y,x2:p.x,y2:p.y,label:rtype,color:RCOLORS[rtype]||"#888"}]);
    setDragging(false);setS0(null);
  };
  const S=makeStyles(dark);
  return(
    <div>
      <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:7}}>
        {["wall","room"].map(tt=>(
          <button key={tt} onClick={()=>setTool(tt)} style={{padding:"5px 11px",borderRadius:6,border:`1.5px solid ${tool===tt?S.gold:S.border}`,background:tool===tt?S.gold+"1a":"transparent",color:tool===tt?S.gold:S.text2,fontSize:11,cursor:"pointer",fontWeight:700}}>
            {tt==="wall"?t.drawWall:t.drawRoom}
          </button>
        ))}
        <button onClick={()=>onChange(elements.slice(0,-1))} style={{padding:"5px 9px",borderRadius:6,border:`1px solid ${S.border}`,background:"transparent",color:S.text2,fontSize:11,cursor:"pointer"}}>{t.undo}</button>
        <button onClick={()=>{if(window.confirm(t.clearConfirm))onChange([]);}} style={{padding:"5px 9px",borderRadius:6,border:"1px solid #fcc",background:"transparent",color:"#c0392b",fontSize:11,cursor:"pointer"}}>{t.clear}</button>
      </div>
      {tool==="room"&&<select value={rtype} onChange={e=>setRtype(e.target.value)} style={{width:"100%",padding:"7px 8px",borderRadius:6,border:`1px solid ${S.border}`,fontSize:12,marginBottom:7,background:dark?"#0d1117":"#fff",color:S.text,fontFamily:"inherit"}}>{rtypes.map(r=><option key={r}>{r}</option>)}</select>}
      <canvas ref={ref} width={340} height={270} style={{display:"block",width:"100%",borderRadius:8,border:`1px solid ${S.border}`,touchAction:"none",cursor:"crosshair"}} onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}/>
      <div style={{display:"flex",gap:6,marginTop:6,flexWrap:"wrap"}}>
        {(lang==="fr"?RTYPES_FR:RTYPES_EN).slice(0,8).map(r=>(
          <div key={r} style={{display:"flex",alignItems:"center",gap:3,fontSize:9,color:S.text2}}>
            <div style={{width:9,height:9,borderRadius:2,background:RCOLORS[r]||"#888"}}/>
            {r}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   FLOOR PLAN 3D (THREE.JS)
═══════════════════════════════════════════════════ */
function Canvas3D({floorPlans,dark,t}){
  const mountRef=useRef(null);
  const cleanRef=useRef(null);

  useEffect(()=>{
    const container=mountRef.current;if(!container)return;
    const W=340,H=290;
    const scene=new THREE.Scene();
    scene.background=new THREE.Color(dark?0x0d1117:0xf0f4f8);
    scene.fog=new THREE.Fog(dark?0x0d1117:0xf0f4f8,50,90);
    const camera=new THREE.PerspectiveCamera(48,W/H,0.1,200);
    const renderer=new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(W,H);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xfff5e0,0.55));
    const sun=new THREE.DirectionalLight(0xffefd5,1.1);
    sun.position.set(20,30,20);sun.castShadow=true;scene.add(sun);
    const fill=new THREE.DirectionalLight(0x8ab4d4,0.35);fill.position.set(-15,10,-10);scene.add(fill);
    scene.add(new THREE.GridHelper(60,30,dark?0x1e293b:0xd0d7de,dark?0x1e293b:0xd0d7de));
    const gnd=new THREE.Mesh(new THREE.PlaneGeometry(60,60),new THREE.MeshLambertMaterial({color:dark?0x0f172a:0xe8edf0}));
    gnd.rotation.x=-Math.PI/2;gnd.position.y=-0.01;gnd.receiveShadow=true;scene.add(gnd);

    const SC=0.065,FH=3.2;
    const allEls=Object.entries(floorPlans).flatMap(([fn,els])=>els.map(e=>({...e,floor:parseInt(fn)})));
    const roomEls=allEls.filter(e=>e.type==="room");
    const rooms=[];

    const buildRoom=(el)=>{
      const x=Math.min(el.x1,el.x2)*SC,z=Math.min(el.y1,el.y2)*SC;
      const w=Math.abs(el.x2-el.x1)*SC,d=Math.abs(el.y2-el.y1)*SC;
      const fY=(el.floor||0)*FH;
      const color=new THREE.Color(el.color||"#888");
      rooms.push({x,z,w,d,fY,color,label:el.label});
      const WH=FH*0.87,T=0.1;
      const floorMat=new THREE.MeshLambertMaterial({color});
      const fm=new THREE.Mesh(new THREE.BoxGeometry(w,0.13,d),floorMat);
      fm.position.set(x+w/2,fY,z+d/2);fm.castShadow=true;fm.receiveShadow=true;scene.add(fm);
      const wc=color.clone().lerp(new THREE.Color(0xffffff),0.28);
      const wm=new THREE.MeshLambertMaterial({color:wc,transparent:true,opacity:0.8,side:THREE.DoubleSide});
      [[w,WH,T,x+w/2,fY+WH/2,z],[w,WH,T,x+w/2,fY+WH/2,z+d],[T,WH,d,x,fY+WH/2,z+d/2],[T,WH,d,x+w,fY+WH/2,z+d/2]].forEach(([ww,wh,wd,wx,wy,wz])=>{
        const m=new THREE.Mesh(new THREE.BoxGeometry(ww,wh,wd),wm);m.position.set(wx,wy,wz);m.castShadow=true;scene.add(m);
      });
    };

    if(roomEls.length>0){roomEls.forEach(buildRoom);}
    else{
      [{x1:0,y1:0,x2:155,y2:100,label:"Salon",color:RCOLORS["Salon"],floor:0},{x1:155,y1:0,x2:255,y2:100,label:"Cuisine",color:RCOLORS["Cuisine"],floor:0},{x1:0,y1:100,x2:120,y2:190,label:"Chambre",color:RCOLORS["Chambre"],floor:0},{x1:120,y1:100,x2:255,y2:190,label:"Salle de Bain",color:RCOLORS["Salle de Bain"],floor:0},{x1:0,y1:0,x2:130,y2:110,label:"Chambre Principale",color:RCOLORS["Chambre Principale"],floor:1},{x1:130,y1:0,x2:255,y2:110,label:"Bureau",color:RCOLORS["Bureau"],floor:1}].forEach(buildRoom);
    }

    const cx=rooms.length?rooms.reduce((s,r)=>s+r.x+r.w/2,0)/rooms.length:8;
    const cz=rooms.length?rooms.reduce((s,r)=>s+r.z+r.d/2,0)/rooms.length:8;
    let theta=0.75,phi=Math.PI/3.1,radius=27,lx=0,ly=0,isDown=false;

    const updateCam=()=>{
      camera.position.set(cx+radius*Math.sin(phi)*Math.sin(theta),radius*Math.cos(phi),cz+radius*Math.sin(phi)*Math.cos(theta));
      camera.lookAt(cx,FH,cz);
    };
    updateCam();

    const onD=e=>{isDown=true;const s=e.touches?e.touches[0]:e;lx=s.clientX;ly=s.clientY;};
    const onM=e=>{if(!isDown)return;const s=e.touches?e.touches[0]:e;theta-=(s.clientX-lx)*0.012;phi=Math.max(0.08,Math.min(Math.PI/2.1,phi+(s.clientY-ly)*0.012));lx=s.clientX;ly=s.clientY;updateCam();};
    const onU=()=>isDown=false;
    const onW=e=>{radius=Math.max(6,Math.min(60,radius+e.deltaY*0.04));updateCam();};
    const el=renderer.domElement;
    el.addEventListener("mousedown",onD);el.addEventListener("mousemove",onM);el.addEventListener("mouseup",onU);
    el.addEventListener("touchstart",onD,{passive:true});el.addEventListener("touchmove",onM,{passive:true});el.addEventListener("touchend",onU);
    el.addEventListener("wheel",onW,{passive:true});

    let animId;
    const animate=()=>{animId=requestAnimationFrame(animate);renderer.render(scene,camera);};
    animate();

    cleanRef.current=()=>{
      cancelAnimationFrame(animId);
      [onD,onM,onU].forEach(fn=>{el.removeEventListener("mousedown",fn);el.removeEventListener("mousemove",fn);el.removeEventListener("mouseup",fn);el.removeEventListener("touchstart",fn);el.removeEventListener("touchmove",fn);el.removeEventListener("touchend",fn);});
      el.removeEventListener("wheel",onW);
      renderer.dispose();
      if(container.contains(el))container.removeChild(el);
    };
  },[floorPlans,dark]);

  useEffect(()=>()=>{cleanRef.current?.();},[]);
  const S=makeStyles(dark);
  return(
    <div>
      <div ref={mountRef} style={{width:"100%",height:290,borderRadius:10,overflow:"hidden",border:`1px solid ${S.border}`}}/>
      <p style={{color:S.text2,fontSize:10,textAlign:"center",marginTop:4}}>{t.view3DSub}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   LAND MAP CANVAS
═══════════════════════════════════════════════════ */
function LandCanvas({points,onChange,gps,dark,t}){
  const ref=useRef(null);
  const S=makeStyles(dark);
  const draw=useCallback(()=>{
    const c=ref.current;if(!c)return;
    const ctx=c.getContext("2d");
    ctx.clearRect(0,0,c.width,c.height);
    ctx.fillStyle=dark?"#0d2010":"#e8f5e9";ctx.fillRect(0,0,c.width,c.height);
    ctx.strokeStyle=dark?"#1a3a1a":"#c8e6c9";ctx.lineWidth=0.5;
    for(let x=0;x<=c.width;x+=20){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,c.height);ctx.stroke();}
    for(let y=0;y<=c.height;y+=20){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(c.width,y);ctx.stroke();}
    if(points.length===0){ctx.fillStyle=dark?"#555":"#888";ctx.font="12px sans-serif";ctx.textAlign="center";ctx.fillText(t.landSub?.split(".")[0]||"Appuyez pour marquer les coins",c.width/2,c.height/2);return;}
    ctx.beginPath();points.forEach((p,i)=>i===0?ctx.moveTo(p.px,p.py):ctx.lineTo(p.px,p.py));
    if(points.length>2)ctx.closePath();
    ctx.fillStyle="#43a04726";ctx.fill();ctx.strokeStyle="#2e7d32";ctx.lineWidth=2.5;ctx.stroke();
    for(let i=0;i<points.length;i++){
      const j=(i+1)%points.length;
      if(i<points.length-1||(points.length>2)){
        const mx=(points[i].px+points[j].px)/2,my=(points[i].py+points[j].py)/2;
        const dist=Math.sqrt((points[j].px-points[i].px)**2+(points[j].py-points[i].py)**2);
        ctx.fillStyle="#1b5e20";ctx.font="8px sans-serif";ctx.textAlign="center";
        ctx.fillText(`${(dist*0.3).toFixed(1)}m`,mx,my-5);
      }
    }
    points.forEach((p,i)=>{
      ctx.fillStyle=GOLD;ctx.beginPath();ctx.arc(p.px,p.py,7,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle="#fff";ctx.lineWidth=1.5;ctx.stroke();
      ctx.fillStyle="#111";ctx.font="bold 9px sans-serif";ctx.textAlign="center";ctx.textBaseline="middle";
      ctx.fillText(i+1,p.px,p.py);
    });
  },[points,dark]);
  useEffect(()=>{draw();},[draw]);
  const onClick=e=>{
    const c=ref.current,r=c.getBoundingClientRect(),src=e.touches?e.touches[0]:e;
    onChange([...points,{px:src.clientX-r.left,py:src.clientY-r.top,lat:gps?.lat||null,lng:gps?.lng||null}]);
  };
  let areaInfo=null;
  if(points.length>=3){
    let a=0;const n=points.length;
    for(let i=0;i<n;i++){const j=(i+1)%n;a+=points[i].px*points[j].py-points[j].px*points[i].py;}
    const sqM=Math.abs(a/2)*0.09;
    areaInfo={sqM:sqM.toFixed(0),sqFt:(sqM*10.764).toFixed(0),acres:(sqM/4047).toFixed(4),ha:(sqM/10000).toFixed(4)};
  }
  const gpsPts=points.filter(p=>p.lat);
  const realArea=gpsPts.length>=3?gpsArea(gpsPts):null;
  const area=realArea||areaInfo;
  return(
    <div>
      <canvas ref={ref} width={340} height={235} style={{display:"block",width:"100%",borderRadius:8,border:`1px solid ${S.border}`,touchAction:"none",cursor:"crosshair"}} onClick={onClick} onTouchEnd={onClick}/>
      {area&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:5,marginTop:8}}>
          {[[t.area_m2,area.sqM],[t.area_ft2,area.sqFt],[t.area_acres,area.acres],[t.area_ha,area.ha]].map(([l,v])=>(
            <div key={l} style={{background:dark?"#071a07":"#f0f8f0",borderRadius:7,padding:"6px 4px",textAlign:"center",border:`1px solid ${dark?"#1b5e2033":"#c8e6c9"}`}}>
              <div style={{color:S.text2,fontSize:8,textTransform:"uppercase"}}>{l}</div>
              <div style={{color:dark?"#4ade80":"#2e7d32",fontSize:12,fontWeight:700}}>{v}</div>
            </div>
          ))}
        </div>
      )}
      <div style={{display:"flex",gap:8,marginTop:8,alignItems:"center"}}>
        <span style={{color:S.text2,fontSize:11}}>Points: {points.length}</span>
        {points.length>0&&<button onClick={()=>onChange([])} style={{padding:"4px 10px",borderRadius:6,border:"1px solid #fcc",background:"transparent",color:"#c0392b",fontSize:11,cursor:"pointer"}}>{t.clear}</button>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   CHAT PANEL WITH AI
═══════════════════════════════════════════════════ */
function ChatPanel({user,dark,t,lang}){
  const [msgs,setMsgs]=useState(ld("ti_chat",[]));
  const [txt,setTxt]=useState("");
  const [loading,setLoading]=useState(false);
  const scrlRef=useRef(null);
  const bcRef=useRef(null);
  const S=makeStyles(dark);
  useEffect(()=>{
    try{bcRef.current=new BroadcastChannel("ti_chat_ch");bcRef.current.onmessage=e=>{if(e.data?.type==="msg"){setMsgs(prev=>{const n=[...prev,e.data.msg];sv("ti_chat",n);return n;});}};}catch(e){}
    return()=>{try{bcRef.current?.close();}catch(e){}};
  },[]);
  useEffect(()=>{if(scrlRef.current)scrlRef.current.scrollTop=scrlRef.current.scrollHeight;},[msgs]);
  const send=async()=>{
    const text=txt.trim();if(!text)return;
    const m={id:uid(),from:user.name,role:user.role,text,ts:Date.now()};
    const next=[...msgs,m];setMsgs(next);sv("ti_chat",next);
    try{bcRef.current?.postMessage({type:"msg",msg:m});}catch(e){}
    setTxt("");
    const isQ=text.includes("?")||/^(comment|que|quand|où|pourquoi|qui|quel|how|what|when|where|why|who)/i.test(text);
    if(isQ){
      setLoading(true);
      try{
        const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:350,system:`Tu es un assistant immobilier expert pour Tagani Immo en Guinée (Conakry). Réponds en ${lang==="fr"?"français":"English"}, de façon concise et professionnelle. Tu aides les agents sur le terrain avec : évaluation immobilière, documents fonciers guinéens, procédures d'inspection, droit foncier de Guinée, prix du marché immobilier à Conakry.`,messages:[{role:"user",content:text}]})});
        const d=await r.json();
        const aiM={id:uid(),from:"Tagani IA",role:"ai",text:d.content?.[0]?.text||"...",ts:Date.now()};
        const withAI=[...next,aiM];setMsgs(withAI);sv("ti_chat",withAI);
        try{bcRef.current?.postMessage({type:"msg",msg:aiM});}catch(e){}
      }catch(e){}
      setLoading(false);
    }
  };
  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
        <span style={{color:S.text2,fontSize:10,letterSpacing:0.8,textTransform:"uppercase"}}>{t.chatTitle}</span>
        <button onClick={()=>{if(window.confirm(t.clearChat+"?")){{setMsgs([]);sv("ti_chat",[]);}}}} style={{padding:"3px 8px",borderRadius:4,border:`1px solid ${S.border}`,background:"transparent",color:S.text2,fontSize:10,cursor:"pointer"}}>{t.clearChat}</button>
      </div>
      <div ref={scrlRef} style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:8,marginBottom:10,minHeight:180,maxHeight:380}}>
        {msgs.length===0&&<div style={{color:S.text2,textAlign:"center",padding:30,fontSize:12}}>Posez une question à l'IA ou écrivez à votre équipe.</div>}
        {msgs.map(m=>(
          <div key={m.id} style={{display:"flex",flexDirection:m.from===user.name?"row-reverse":"row",gap:8,alignItems:"flex-end"}}>
            <div style={{width:26,height:26,borderRadius:"50%",background:m.role==="ai"?GOLD+"22":m.role==="admin"?"#1d4ed822":"#16532222",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:m.role==="ai"?GOLD:m.role==="admin"?"#60a5fa":"#4ade80",flexShrink:0}}>
              {m.role==="ai"?"IA":m.from.slice(0,2).toUpperCase()}
            </div>
            <div style={{maxWidth:"74%",background:m.from===user.name?GOLD+"1a":dark?"#1c2128":"#f6f8fa",borderRadius:10,padding:"8px 10px",border:`1px solid ${m.from===user.name?GOLD+"33":S.border}`}}>
              {m.from!==user.name&&<div style={{color:S.text2,fontSize:9,marginBottom:2}}>{m.from}</div>}
              <div style={{color:S.text,fontSize:12,lineHeight:1.5}}>{m.text}</div>
              <div style={{color:S.text2,fontSize:8,marginTop:2}}>{fmt(m.ts)}</div>
            </div>
          </div>
        ))}
        {loading&&<div style={{display:"flex",gap:8,alignItems:"center"}}><div style={{width:26,height:26,borderRadius:"50%",background:GOLD+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:GOLD,fontWeight:700}}>IA</div><div style={{background:dark?"#1c2128":"#f6f8fa",borderRadius:10,padding:"8px 12px",border:`1px solid ${GOLD}22`}}><span style={{color:GOLD,fontSize:12}}>{t.thinking}</span></div></div>}
      </div>
      <div style={{display:"flex",gap:8}}>
        <input value={txt} onChange={e=>setTxt(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder={t.chatPh} style={{flex:1,padding:"9px 12px",borderRadius:8,border:`1px solid ${S.border}`,background:dark?"#0d1117":"#fff",color:S.text,fontSize:13,fontFamily:"inherit"}}/>
        <button onClick={send} style={{padding:"9px 14px",borderRadius:8,border:"none",background:GOLD,color:"#0d1117",cursor:"pointer",fontWeight:700,fontSize:15}}>→</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   USER GUIDE
═══════════════════════════════════════════════════ */
function GuideScreen({dark,t,lang,onBack}){
  const [open,setOpen]=useState(null);
  const S=makeStyles(dark);
  const sections=[
    {title:lang==="fr"?"🔐 Se Connecter":"🔐 Signing In",body:lang==="fr"?"Choisissez votre nom dans la liste, entrez votre PIN à 4 chiffres, appuyez 'Se Connecter'. Le GPS démarre automatiquement. NE PARTAGEZ JAMAIS votre PIN.":"Select your name from the list, enter your 4-digit PIN, tap 'Sign In'. GPS starts automatically. NEVER share your PIN."},
    {title:lang==="fr"?"🏠 Créer une Inspection":"🏠 Creating an Inspection",body:lang==="fr"?"Appuyez sur '+ Nouvelle Inspection'. Remplissez les 6 onglets : Détails → Propriétaire → Photos → Documents → Plan → Terrain. Sauvegardez régulièrement.":"Tap '+ New Inspection'. Fill in the 6 tabs: Details → Owner → Photos → Documents → Plan → Land. Save regularly."},
    {title:lang==="fr"?"📋 Renseigner les Détails":"📋 Filling in Details",body:lang==="fr"?"Sélectionnez la Région, Préfecture et Commune dans les menus. Entrez l'adresse. Comptez les pièces avec +/−. Activez le GPS pour enregistrer les coordonnées exactes.":"Select Region, Prefecture and Commune from the menus. Enter the address. Count rooms with +/−. Enable GPS to record exact coordinates."},
    {title:lang==="fr"?"📸 Photos HD & Compressées":"📸 HD & Compressed Photos",body:lang==="fr"?"Minimum 10 photos requises. Utilisez 📷 Caméra pour une photo directe en haute définition (1920×1080, JPEG 88%). Chaque photo est géolocalisée automatiquement. La compression réduit la taille de 60-70% tout en conservant la qualité.":"Minimum 10 photos required. Use 📷 Camera for a direct HD photo (1920×1080, JPEG 88%). Each photo is auto-geotagged. Compression reduces file size by 60-70% while preserving quality."},
    {title:lang==="fr"?"👤 Enregistrer le Propriétaire":"👤 Registering the Owner",body:lang==="fr"?"Remplissez nom, prénom, date/lieu de naissance, CNI/passeport, téléphone, adresse. Photographiez la pièce d'identité. Notez le prix demandé et les points de négociation.":"Fill in last name, first name, DOB/POB, NID/passport, phone, address. Photograph the ID document. Note asking price and negotiation points."},
    {title:lang==="fr"?"📄 Documents Fonciers (Guinée)":"📄 Land Documents (Guinea)",body:lang==="fr"?"Cochez chaque document disponible (Titre Foncier, Plan de Bornage, Permis d'Occuper, etc.). Photographiez chaque document coché. Le Titre Foncier est le document le plus important en Guinée.":"Check each available document (Land Title, Survey Plan, Occupation Permit, etc.). Photograph each checked document. The Titre Foncier is the most important document in Guinea."},
    {title:lang==="fr"?"🏗 Plan 2D et Vue 3D":"🏗 2D Plan & 3D View",body:lang==="fr"?"Dessinez les murs avec '✏ Mur' et placez les pièces avec '⬜ Pièce'. Changez d'étage avec le sélecteur. Basculez en '🧊 Vue 3D' pour voir le rendu interactif. Faites pivoter en glissant.":"Draw walls with '✏ Wall' and place rooms with '⬜ Room'. Change floors with the selector. Switch to '🧊 3D View' for interactive rendering. Rotate by dragging."},
    {title:lang==="fr"?"🌐 Mesurer le Terrain":"🌐 Measuring the Land",body:lang==="fr"?"Appuyez sur le canvas pour placer les coins. Pour mesurer précisément : marchez à chaque coin et appuyez '+ Point GPS'. L'app calcule automatiquement en m², pieds², acres et hectares.":"Tap the canvas to place corners. For precise measurement: walk to each corner and tap '+ GPS Point'. The app auto-calculates in m², sq ft, acres and hectares."},
    {title:lang==="fr"?"💬 Chat IA":"💬 AI Chat",body:lang==="fr"?"Appuyez 💬 Chat. Posez une question (ex: 'Quelle est la valeur d'un TF à Ratoma ?'). L'IA répond automatiquement en français sur l'immobilier guinéen. Toute l'équipe voit le chat.":"Tap 💬 Chat. Ask a question (e.g. 'What is a TF worth in Ratoma?'). AI responds automatically about Guinean real estate. The entire team sees the chat."},
    {title:lang==="fr"?"✅ Soumettre":"✅ Submitting",body:lang==="fr"?"Vérifiez : adresse renseignée + minimum 10 photos. Appuyez 'Soumettre ✓'. L'inspection apparaît immédiatement dans le tableau de bord admin. Une soumission est définitive.":"Check: address entered + minimum 10 photos. Tap 'Submit ✓'. The inspection appears immediately in the admin dashboard. A submission is final."},
    {title:lang==="fr"?"👨‍💼 Pour l'Administrateur":"👨‍💼 For the Administrator",body:lang==="fr"?"PIN 0000. Onglet 🔴 Direct : activités en temps réel (4s). Onglet 📋 Soumissions : toutes les inspections complètes. Onglet 📍 Localisation : position GPS des agents. CSV et téléchargement photos disponibles.":"PIN 0000. 🔴 Live tab: real-time activity (4s). 📋 Submissions tab: all complete inspections. 📍 Tracking: agent GPS locations. CSV and photo download available."},
    {title:lang==="fr"?"⚠ Conseils Importants":"⚠ Important Tips",body:lang==="fr"?"Sauvegardez régulièrement. Activez le GPS avant de commencer. Minimum 10 photos. Soumettez uniquement quand tout est complet. PIN confidentiel. L'app fonctionne hors ligne — soumettez avec du réseau.":"Save regularly. Enable GPS before starting. Minimum 10 photos. Submit only when everything is complete. Keep PIN confidential. App works offline — submit when connected."},
  ];
  return(
    <div style={{background:S.bg,minHeight:"100vh"}}>
      <div style={{background:dark?"#0d1117":"#fff",borderBottom:`1px solid ${GOLD}33`,padding:"10px 15px",display:"flex",alignItems:"center",gap:12,position:"sticky",top:0,zIndex:10}}>
        <button onClick={onBack} style={{background:"none",border:"none",color:GOLD,cursor:"pointer",fontSize:22}}>←</button>
        <span style={{color:GOLD,fontWeight:700,fontSize:14,letterSpacing:1.5}}>{t.guideTitle}</span>
      </div>
      <div style={{padding:14}}>
        {sections.map((s,i)=>(
          <div key={i} style={{background:dark?"#1c2128":"#fff",borderRadius:12,marginBottom:8,border:`1px solid ${S.border}`,overflow:"hidden"}}>
            <button onClick={()=>setOpen(open===i?null:i)} style={{width:"100%",padding:"12px 14px",background:"transparent",border:"none",color:S.text,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:13,fontWeight:600,fontFamily:"inherit",textAlign:"left"}}>
              {s.title}
              <span style={{color:GOLD,fontSize:16}}>{open===i?"▲":"▼"}</span>
            </button>
            {open===i&&<div style={{padding:"0 14px 14px",color:S.text2,fontSize:12,lineHeight:1.7,borderTop:`1px solid ${S.border}`}}><br/>{s.body}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   GLOBAL CSS
═══════════════════════════════════════════════════ */
const CSS=`*{box-sizing:border-box;margin:0;padding:0;}::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-thumb{background:#333;border-radius:2px;}input,select,textarea,button{font-family:inherit;}`;

/* ═══════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════ */
export default function TaganiImmo(){
  const [dark,setDark]=useState(true);
  const [lang,setLang]=useState("fr");
  const t=TR[lang];
  const S=makeStyles(dark);

  const [agents,setAgents]=useState(ld("ti_agents",INIT_AGENTS));
  const [inspections,setInspections]=useState(ld("ti_inspections",[]));
  const [agentLocs,setAgentLocs]=useState(ld("ti_locs",{}));

  const [view,setView]=useState("login");
  const [user,setUser]=useState(null);
  const [selId,setSelId]=useState("");
  const [pinIn,setPinIn]=useState("");
  const [loginErr,setLoginErr]=useState("");

  const [draft,setDraft]=useState(null);
  const [photos,setPhotos]=useState([]);
  const [docPhotos,setDocPhotos]=useState({});
  const [ownerIdPh,setOwnerIdPh]=useState(null);
  const [floorPlans,setFloorPlans]=useState({});
  const [floorNum,setFloorNum]=useState(0);
  const [floorMode,setFloorMode]=useState("2d");
  const [landPts,setLandPts]=useState([]);
  const [docs,setDocs]=useState({});
  const [feats,setFeats]=useState([]);
  const [tab,setTab]=useState("details");
  const [locVal,setLocVal]=useState({});
  const [docType,setDocType]=useState("land");

  const [gps,setGps]=useState(null);
  const [gpsLoad,setGpsLoad]=useState(false);
  const [adminTab,setAdminTab]=useState("live");
  const [expanded,setExpanded]=useState(null);
  const [newAgName,setNewAgName]=useState("");
  const [newAgPin,setNewAgPin]=useState("");

  const photoRef=useRef(null);
  const bcRef=useRef(null);
  const watchRef=useRef(null);

  useEffect(()=>{sv("ti_agents",agents);},[agents]);
  useEffect(()=>{sv("ti_inspections",inspections);},[inspections]);

  useEffect(()=>{
    try{bcRef.current=new BroadcastChannel("ti_live_ch");bcRef.current.onmessage=e=>{if(e.data?.type==="inspection")setInspections(prev=>{const r=prev.filter(i=>i.id!==e.data.data.id);return[...r,e.data.data];});if(e.data?.type==="loc")setAgentLocs(prev=>({...prev,[e.data.agentId]:e.data}));};}catch(e){}
    return()=>{try{bcRef.current?.close();}catch(e){}};
  },[]);

  useEffect(()=>{
    if(user?.role!=="admin")return;
    const iv=setInterval(()=>{setAgentLocs(ld("ti_locs",{}));setInspections(ld("ti_inspections",[]));},4000);
    return()=>clearInterval(iv);
  },[user]);

  const fetchGPS=useCallback(u=>{
    if(!navigator.geolocation)return;
    setGpsLoad(true);
    navigator.geolocation.getCurrentPosition(pos=>{
      const loc={lat:pos.coords.latitude,lng:pos.coords.longitude,acc:Math.round(pos.coords.accuracy),ts:Date.now()};
      setGps(loc);setGpsLoad(false);
      if(u){const locs=ld("ti_locs",{});locs[u.id]={...loc,name:u.name};sv("ti_locs",locs);setAgentLocs({...locs});try{bcRef.current?.postMessage({type:"loc",agentId:u.id,...loc,name:u.name});}catch(e){}}
    },()=>setGpsLoad(false),{enableHighAccuracy:true,timeout:15000,maximumAge:0});
  },[]);

  useEffect(()=>{
    if(!user||user.role==="admin")return;
    if(!navigator.geolocation)return;
    watchRef.current=navigator.geolocation.watchPosition(pos=>{
      const loc={lat:pos.coords.latitude,lng:pos.coords.longitude,acc:Math.round(pos.coords.accuracy),ts:Date.now()};
      setGps(loc);
      const locs=ld("ti_locs",{});locs[user.id]={...loc,name:user.name};sv("ti_locs",locs);
      try{bcRef.current?.postMessage({type:"loc",agentId:user.id,...loc,name:user.name});}catch(e){}
    },null,{enableHighAccuracy:true,maximumAge:0});
    return()=>{if(watchRef.current)navigator.geolocation.clearWatch(watchRef.current);};
  },[user]);

  const login=()=>{
    const ag=agents.find(a=>a.id===selId&&a.pin===pinIn);
    if(ag){setUser(ag);setLoginErr("");setPinIn("");setView(ag.role==="admin"?"admin":"dashboard");fetchGPS(ag);}
    else setLoginErr(t.loginError);
  };
  const logout=()=>{setUser(null);setView("login");setGps(null);setPinIn("");setSelId("");if(watchRef.current)navigator.geolocation.clearWatch(watchRef.current);};

  const blankDraft=()=>({
    id:uid(),agentId:user.id,agentName:user.name,timestamp:Date.now(),location:gps,status:"draft",
    property:{address:"",type:"house",region:"",prefecture:"",commune:"",neighborhood:"",bedrooms:0,bathrooms:0,livingRooms:0,kitchens:0,diningRooms:0,garages:0,offices:0,laundryRooms:0,balconies:0,storageRooms:0,hallways:0,staircases:0,totalArea:"",landArea:"",landHectares:"",yearBuilt:"",listPrice:"",condition:"good",features:[],ownerName:"",ownerFirstName:"",ownerDOB:"",ownerPOB:"",ownerNationality:"Guinéenne",ownerOccupation:"",ownerPhone:"",ownerPhone2:"",ownerEmail:"",ownerAddress:"",ownerRelation:"",ownerIdType:"",ownerIdNum:"",visitDate:"",ownerAskingPrice:"",negotiationNotes:"",notes:""},
    photos:[],docPhotos:{},ownerIdPhoto:null,documents:{},floorPlans:{},landPts:[],
  });

  const newInspection=()=>{
    const ins=blankDraft();
    setDraft(ins);setPhotos([]);setDocPhotos({});setOwnerIdPh(null);
    setFloorPlans({});setLandPts([]);setDocs({});setFeats([]);setFloorNum(0);setFloorMode("2d");setTab("details");setLocVal({});setDocType("land");
    setView("inspect");
  };
  const openInspection=ins=>{
    setDraft(ins);setPhotos(ins.photos||[]);setDocPhotos(ins.docPhotos||{});setOwnerIdPh(ins.ownerIdPhoto||null);
    setFloorPlans(ins.floorPlans||{});setLandPts(ins.landPts||[]);setDocs(ins.documents||{});setFeats(ins.property?.features||[]);
    setLocVal({region:ins.property?.region,prefecture:ins.property?.prefecture,commune:ins.property?.commune,neighborhood:ins.property?.neighborhood});
    setDocType(ins.docType||"land");setFloorNum(0);setFloorMode("2d");setTab("details");setView("inspect");
  };

  const upd=(k,v)=>setDraft(prev=>({...prev,property:{...prev.property,[k]:v}}));
  const persist=(status)=>{
    const p={...draft.property,...locVal,features:feats};
    const updated={...draft,photos,docPhotos,ownerIdPhoto:ownerIdPh,floorPlans,landPts:Array.isArray(landPts)?landPts:[],documents:docs,location:gps,property:p,docType,status:status||draft.status,lastSaved:Date.now()};
    if(status==="submitted")updated.submittedAt=Date.now();
    setDraft(updated);
    setInspections(prev=>{const r=prev.filter(i=>i.id!==updated.id);return[...r,updated];});
    try{bcRef.current?.postMessage({type:"inspection",data:updated});}catch(e){}
    return updated;
  };
  const save=()=>{persist();alert(t.saveOK);};
  const submit=()=>{
    if(!draft.property.address){alert(t.submitErrAddress);setTab("details");return;}
    if(photos.length<10){alert(`${t.submitErrPhotos} ${photos.length}.`);setTab("photos");return;}
    persist("submitted");alert(t.submitOK);setView("dashboard");
  };

  /* HD PHOTO HANDLER */
  const handlePhoto=async(e,type,docId)=>{
    const files=Array.from(e.target.files);
    for(const file of files){
      const loc=gps?{lat:gps.lat,lng:gps.lng}:null;
      const locationLabel=locVal.manual||[locVal.region,locVal.prefecture,locVal.commune,locVal.neighborhood].filter(Boolean).join(", ")||draft?.property?.address||"";
      const compressed=await compressImage(file,1920,1080,0.88);
      const photoData={...compressed,ts:Date.now(),loc,locationLabel,fileName:file.name};
      if(type==="main") setPhotos(prev=>[...prev,photoData]);
      else if(type==="ownerid") setOwnerIdPh(photoData);
      else if(type==="doc"&&docId) setDocPhotos(prev=>({...prev,[docId]:[...(prev[docId]||[]),photoData]}));
    }
    e.target.value="";
  };

  const toggleDoc=id=>setDocs(prev=>({...prev,[id]:{...prev[id],available:!prev[id]?.available}}));
  const toggleFeat=f=>setFeats(prev=>prev.includes(f)?prev.filter(x=>x!==f):[...prev,f]);
  const addAgent=()=>{
    if(!newAgName.trim()||newAgPin.length!==4){alert("Nom et PIN à 4 chiffres requis.");return;}
    setAgents(prev=>[...prev,{id:"a"+uid().slice(0,4),name:newAgName.trim(),pin:newAgPin,role:"agent"}]);
    setNewAgName("");setNewAgPin("");alert(`✅ Agent "${newAgName.trim()}" ajouté.`);
  };
  const delInsp=id=>{if(window.confirm(t.deleteInsp))setInspections(prev=>prev.filter(i=>i.id!==id));};
  const currentDocs=docType==="land"?GUINEA_DOCS_LAND:GUINEA_DOCS_HOUSE;
  const goldBadge=(c)=>({display:"inline-block",padding:"2px 7px",borderRadius:12,fontSize:9,fontWeight:700,background:c+"22",color:c,border:`1px solid ${c}44`});
  const btn=(bg,col,bdr,extra={})=>({padding:"9px 14px",borderRadius:8,border:`1.5px solid ${bdr||bg}`,background:bg,color:col,cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"inherit",...extra});
  const tabBtn=(a)=>({padding:"6px 10px",borderRadius:6,border:`1.5px solid ${a?S.gold:S.border}`,background:a?S.gold+"1a":"transparent",color:a?S.gold:S.text2,cursor:"pointer",fontSize:10,fontWeight:700,whiteSpace:"nowrap",fontFamily:"inherit"});
  const cardStyle={background:S.bg3,borderRadius:14,padding:14,marginBottom:10,border:`1px solid ${S.border}`};
  const lblStyle={color:S.text2,fontSize:9,letterSpacing:0.8,textTransform:"uppercase",display:"block",marginBottom:4};
  const inpStyle={width:"100%",padding:"9px 12px",borderRadius:8,border:`1px solid ${S.border}`,background:dark?"#0d1117":"#f6f8fa",color:S.text,fontSize:14,display:"block",fontFamily:"inherit"};
  const rowStyle={display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:`1px solid ${S.border}`};
  const sbtn=(a)=>({width:27,height:27,borderRadius:"50%",border:`1px solid ${a?S.gold+"44":S.border}`,background:a?S.gold+"1a":"transparent",color:a?S.gold:S.text2,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"});

  /* ── GUIDE ── */
  if(view==="guide")return<GuideScreen dark={dark} t={t} lang={lang} onBack={()=>setView(user?.role==="admin"?"admin":"dashboard")}/>;

  /* ── CHAT ── */
  if(view==="chat_view")return(
    <div style={{background:S.bg,maxWidth:430,margin:"0 auto",minHeight:"100vh"}}>
      <style>{CSS}</style>
      <div style={{background:dark?"#0d1117":"#fff",borderBottom:`1px solid ${GOLD}33`,padding:"10px 15px",display:"flex",alignItems:"center",gap:12,position:"sticky",top:0,zIndex:10}}>
        <button onClick={()=>setView(user?.role==="admin"?"admin":"dashboard")} style={{background:"none",border:"none",color:GOLD,cursor:"pointer",fontSize:22}}>←</button>
        <span style={{color:GOLD,fontWeight:700,fontSize:14,letterSpacing:1.5}}>{t.chatTitle}</span>
        <div style={{marginLeft:"auto",display:"flex",gap:6}}>
          <button onClick={()=>setLang(lang==="fr"?"en":"fr")} style={{...btn("transparent",S.gold,S.gold),padding:"4px 9px",fontSize:10}}>🌐 {lang==="fr"?"EN":"FR"}</button>
          <button onClick={()=>setDark(!dark)} style={{...btn("transparent",S.text2,S.border),padding:"4px 9px",fontSize:10}}>{dark?"☀":"🌙"}</button>
        </div>
      </div>
      <div style={{padding:14,height:"calc(100vh - 54px)",display:"flex",flexDirection:"column"}}>
        <ChatPanel user={user} dark={dark} t={t} lang={lang}/>
      </div>
    </div>
  );

  /* ══════════════════════════════
     LOGIN
  ══════════════════════════════ */
  if(view==="login")return(
    <div style={{maxWidth:430,margin:"0 auto",minHeight:"100vh",background:S.bg,color:S.text,fontFamily:"'Segoe UI',system-ui,sans-serif"}}>
      <style>{CSS}</style>
      <div style={{position:"absolute",top:12,right:16,display:"flex",gap:6}}>
        <button onClick={()=>setLang(lang==="fr"?"en":"fr")} style={{...btn("transparent",S.gold,S.gold),padding:"4px 9px",fontSize:10}}>🌐 {lang==="fr"?"EN":"FR"}</button>
        <button onClick={()=>setDark(!dark)} style={{...btn("transparent",S.text2,S.border),padding:"4px 9px",fontSize:10}}>{dark?"☀":"🌙"}</button>
      </div>
      <div style={{padding:"0 22px",paddingTop:56}}>
        <div style={{textAlign:"center",marginBottom:36}}>
          <div style={{width:74,height:74,borderRadius:"50%",background:GOLD+"1a",border:`2px solid ${GOLD}55`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",fontSize:32}}>🏠</div>
          <div style={{color:GOLD,fontWeight:700,fontSize:23,letterSpacing:3}}>{t.appName}</div>
          <div style={{color:GOLD+"99",fontSize:10,marginTop:3,letterSpacing:2}}>{t.appSub}</div>
          <div style={{color:S.text2,fontSize:11,marginTop:10,padding:"5px 14px",background:dark?"#161b22":"#fff",borderRadius:20,display:"inline-block",border:`1px solid ${S.border}`}}>🔒 {t.teamOnly}</div>
        </div>
        <div style={cardStyle}>
          <label style={lblStyle}>{t.selectAgent}</label>
          <select value={selId} onChange={e=>setSelId(e.target.value)} style={{...inpStyle,marginBottom:14}}>
            <option value="">-- {t.selectAgent} --</option>
            {agents.map(a=><option key={a.id} value={a.id}>{a.name}{a.role==="admin"?" (Admin)":""}</option>)}
          </select>
          <label style={lblStyle}>{t.pinLabel}</label>
          <input type="password" inputMode="numeric" maxLength={4} value={pinIn} onChange={e=>setPinIn(e.target.value)} placeholder={t.pinPlaceholder} onKeyDown={e=>e.key==="Enter"&&login()} style={{...inpStyle,letterSpacing:12,fontSize:28,textAlign:"center",marginBottom:18}}/>
          {loginErr&&<div style={{color:S.error,fontSize:12,textAlign:"center",marginBottom:12}}>{loginErr}</div>}
          <button onClick={login} style={{...btn(GOLD,"#0d1117"),width:"100%",padding:14,fontSize:15,borderRadius:10}}>
            {t.login} →
          </button>
          <div style={{color:S.text2,fontSize:10,textAlign:"center",marginTop:14}}>{t.demoHint}</div>
        </div>
        <div style={{textAlign:"center",color:S.text2,fontSize:10,marginTop:16}}>© {new Date().getFullYear()} Tagani Immo · Conakry, Guinée</div>
      </div>
    </div>
  );

  /* ══════════════════════════════
     DASHBOARD (AGENT)
  ══════════════════════════════ */
  if(view==="dashboard"){
    const mine=[...inspections].filter(i=>i.agentId===user.id).reverse();
    return(
      <div style={{maxWidth:430,margin:"0 auto",minHeight:"100vh",background:S.bg,color:S.text,fontFamily:"'Segoe UI',system-ui,sans-serif"}}>
        <style>{CSS}</style>
        <div style={{background:dark?"#0d1117":"#fff",borderBottom:`1px solid ${GOLD}33`,padding:"10px 15px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:10}}>
          <div>
            <div style={{color:GOLD,fontWeight:700,fontSize:13,letterSpacing:2}}>{t.appName}</div>
            <div style={{color:S.text2,fontSize:10}}>{lang==="fr"?"Bonjour":"Hello"}, {user.name}</div>
          </div>
          <div style={{display:"flex",gap:5,flexWrap:"wrap",justifyContent:"flex-end"}}>
            {gps&&<span style={goldBadge("#27ae60")}>{t.gpsActive}</span>}
            <button onClick={()=>setView("guide")} style={{...btn("transparent",S.gold,S.gold),padding:"4px 8px",fontSize:10}}>{t.guide}</button>
            <button onClick={()=>setView("chat_view")} style={{...btn(GOLD+"1a",GOLD,GOLD+"44"),padding:"5px 8px",fontSize:10}}>{t.chat}</button>
            <button onClick={()=>setLang(lang==="fr"?"en":"fr")} style={{...btn("transparent",S.text2,S.border),padding:"4px 7px",fontSize:10}}>🌐</button>
            <button onClick={()=>setDark(!dark)} style={{...btn("transparent",S.text2,S.border),padding:"4px 7px",fontSize:10}}>{dark?"☀":"🌙"}</button>
            <button onClick={logout} style={{...btn("transparent",S.text2,S.border),padding:"5px 8px",fontSize:10}}>{t.logout}</button>
          </div>
        </div>
        <div style={{padding:14}}>
          {/* GPS */}
          <div style={{...cardStyle,border:`1px solid ${GOLD}22`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <label style={lblStyle}>{t.gpsLocation}</label>
                {gps?<div style={{fontFamily:"monospace",fontSize:11,color:GOLD}}>{gps.lat.toFixed(6)}°N · {gps.lng.toFixed(6)}°E <span style={{color:S.text2}}>±{gps.acc}m</span></div>
                    :<div style={{color:S.text2,fontSize:12}}>{gpsLoad?"Détection...":"Non détectée"}</div>}
              </div>
              <button onClick={()=>fetchGPS(user)} disabled={gpsLoad} style={{...btn(GOLD+"1a",GOLD,GOLD+"44"),padding:"6px 10px",fontSize:11}}>{gpsLoad?"...":t.refresh}</button>
            </div>
          </div>
          <button onClick={newInspection} style={{...btn(GOLD,"#0d1117"),width:"100%",padding:15,fontSize:15,marginBottom:12,borderRadius:10}}>{t.newInspection}</button>
          {/* STATS */}
          <div style={{display:"flex",gap:7,marginBottom:12}}>
            {[[t.total,mine.length,GOLD],[t.submitted,mine.filter(i=>i.status==="submitted").length,"#27ae60"],[t.drafts,mine.filter(i=>i.status!=="submitted").length,"#e67e22"]].map(([l,n,c])=>(
              <div key={l} style={{flex:1,background:dark?"#161b22":"#fff",borderRadius:10,padding:"9px 5px",textAlign:"center",border:`1px solid ${c}22`}}>
                <div style={{color:c,fontSize:20,fontWeight:700}}>{n}</div>
                <div style={{color:S.text2,fontSize:9}}>{l}</div>
              </div>
            ))}
          </div>
          <label style={{...lblStyle,marginBottom:8}}>{t.myInspections}</label>
          {mine.length===0&&<div style={{color:S.text2,textAlign:"center",padding:40,fontSize:12}}>{t.noInspections}</div>}
          {mine.map(ins=>(
            <div key={ins.id} style={{...cardStyle,cursor:"pointer"}} onClick={()=>openInspection(ins)}>
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,fontSize:13,marginBottom:3}}>{ins.property?.address||"Sans adresse"}</div>
                  <div style={{color:S.text2,fontSize:10}}>{ins.property?.region&&`${ins.property.region} › `}{ins.property?.commune||""}</div>
                  <div style={{color:S.text2,fontSize:10,marginTop:2}}>{fmt(ins.timestamp)}</div>
                  <div style={{color:S.text2,fontSize:10,marginTop:2}}>🛏{ins.property?.bedrooms||0} 🚿{ins.property?.bathrooms||0} 📸{ins.photos?.length||0}{ins.ownerIdPhoto?" 👤✓":""}</div>
                </div>
                <span style={goldBadge(ins.status==="submitted"?"#27ae60":"#e67e22")}>{ins.status==="submitted"?t.submitted_badge:t.draft_badge}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ══════════════════════════════
     INSPECTION
  ══════════════════════════════ */
  if(view==="inspect"&&draft){
    const TABS_DEF=[
      {id:"details",label:t.tabs.details},
      {id:"owner",label:t.tabs.owner},
      {id:"photos",label:`${t.tabs.photos} (${photos.length})`},
      {id:"docs",label:t.tabs.docs},
      {id:"plan",label:t.tabs.plan},
      {id:"land",label:t.tabs.land},
    ];
    const p=draft.property;
    const featuresList=lang==="fr"?FEATURES_FR:FEATURES_EN;
    const floorList=lang==="fr"?FLOORS_FR:t.floors;

    return(
      <div style={{maxWidth:430,margin:"0 auto",minHeight:"100vh",background:S.bg,color:S.text,fontFamily:"'Segoe UI',system-ui,sans-serif"}}>
        <style>{CSS}</style>
        <div style={{background:dark?"#0d1117":"#fff",borderBottom:`1px solid ${GOLD}33`,padding:"9px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:10}}>
          <button onClick={()=>setView("dashboard")} style={{background:"none",border:"none",color:GOLD,cursor:"pointer",fontSize:22}}>←</button>
          <span style={{color:GOLD,fontWeight:700,fontSize:12,letterSpacing:1.5}}>{t.inspection}</span>
          <div style={{display:"flex",gap:4}}>
            <button onClick={()=>setLang(lang==="fr"?"en":"fr")} style={{...btn("transparent",S.text2,S.border),padding:"4px 7px",fontSize:10}}>🌐</button>
            <button onClick={()=>setDark(!dark)} style={{...btn("transparent",S.text2,S.border),padding:"4px 7px",fontSize:10}}>{dark?"☀":"🌙"}</button>
            <button onClick={save} style={{...btn(GOLD+"1a",GOLD,GOLD+"44"),padding:"5px 8px",fontSize:10}}>{t.save}</button>
            <button onClick={submit} style={{...btn(GOLD,"#0d1117"),padding:"5px 8px",fontSize:10}}>{t.submit}</button>
          </div>
        </div>
        {gps&&<div style={{background:dark?"#071a07":"#f0fff4",padding:"4px 14px",fontSize:10,display:"flex",gap:12,borderBottom:`1px solid ${dark?"#1b5e20":"#c8e6c9"}`}}>
          <span style={{color:"#27ae60"}}>📍 {gps.lat.toFixed(5)}, {gps.lng.toFixed(5)}</span>
          <span style={{color:S.text2}}>±{gps.acc}m</span>
        </div>}
        <div style={{display:"flex",gap:4,padding:"7px 10px",borderBottom:`1px solid ${S.border}`,overflowX:"auto"}}>
          {TABS_DEF.map(tt=><button key={tt.id} onClick={()=>setTab(tt.id)} style={tabBtn(tab===tt.id)}>{tt.label}</button>)}
        </div>

        <div style={{padding:14,paddingBottom:90,overflowY:"auto"}}>

          {/* ── DETAILS ── */}
          {tab==="details"&&<>
            <div style={cardStyle}>
              <label style={lblStyle}>{t.address}</label>
              <input value={p.address} onChange={e=>upd("address",e.target.value)} placeholder={t.addressPh} style={{...inpStyle,marginBottom:12}}/>
              <LocationSelector value={locVal} onChange={v=>{setLocVal(v);upd("region",v.region||"");upd("prefecture",v.prefecture||"");upd("commune",v.commune||"");upd("neighborhood",v.neighborhood||"");}} dark={dark} t={t}/>
            </div>
            <div style={cardStyle}>
              <label style={lblStyle}>{t.propType}</label>
              <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                {Object.entries(t.propTypes).map(([k,v])=>(
                  <button key={k} onClick={()=>upd("type",k)} style={{padding:"6px 10px",borderRadius:6,border:`1.5px solid ${p.type===k?S.gold:S.border}`,background:p.type===k?S.gold+"1a":"transparent",color:p.type===k?S.gold:S.text2,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>{v}</button>
                ))}
              </div>
            </div>
            <div style={cardStyle}>
              <label style={{...lblStyle,marginBottom:10}}>{t.rooms}</label>
              {Object.entries(t.roomLabels).map(([k,lbl])=>(
                <div key={k} style={rowStyle}>
                  <span style={{fontSize:12}}>{lbl}</span>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <button onClick={()=>upd(k,Math.max(0,(p[k]||0)-1))} style={sbtn(false)}>−</button>
                    <span style={{color:GOLD,fontWeight:700,fontSize:16,minWidth:20,textAlign:"center"}}>{p[k]||0}</span>
                    <button onClick={()=>upd(k,(p[k]||0)+1)} style={sbtn(true)}>+</button>
                  </div>
                </div>
              ))}
            </div>
            <div style={cardStyle}>
              <label style={lblStyle}>{t.measurements}</label>
              {[[t.floorArea,"totalArea"],[t.landArea,"landArea"],[t.landHectares,"landHectares"],[t.yearBuilt,"yearBuilt"],[t.listPrice,"listPrice"]].map(([lbl,k])=>(
                <div key={k} style={{marginBottom:10}}>
                  <label style={{...lblStyle,fontSize:8}}>{lbl}</label>
                  <input type="number" value={p[k]||""} onChange={e=>upd(k,e.target.value)} placeholder="0" style={inpStyle}/>
                </div>
              ))}
            </div>
            <div style={cardStyle}>
              <label style={lblStyle}>{t.condition}</label>
              <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                {Object.entries(t.conditions).map(([k,v])=>(
                  <button key={k} onClick={()=>upd("condition",k)} style={{padding:"6px 10px",borderRadius:6,border:`1.5px solid ${p.condition===k?S.gold:S.border}`,background:p.condition===k?S.gold+"1a":"transparent",color:p.condition===k?S.gold:S.text2,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>{v}</button>
                ))}
              </div>
            </div>
            <div style={cardStyle}>
              <label style={lblStyle}>{t.features}</label>
              <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                {featuresList.map((f,i)=>(
                  <button key={i} onClick={()=>toggleFeat(f)} style={{padding:"5px 9px",borderRadius:6,border:`1.5px solid ${feats.includes(f)?S.gold:S.border}`,background:feats.includes(f)?S.gold+"1a":"transparent",color:feats.includes(f)?S.gold:S.text2,fontSize:10,cursor:"pointer",fontFamily:"inherit"}}>{f}</button>
                ))}
              </div>
            </div>
            <div style={cardStyle}>
              <label style={lblStyle}>{t.agentNotes}</label>
              <textarea value={p.notes||""} onChange={e=>upd("notes",e.target.value)} placeholder={t.notesPh} style={{...inpStyle,minHeight:80,resize:"vertical"}}/>
            </div>
            <div style={{...cardStyle,border:`1px solid ${GOLD}22`}}>
              <label style={lblStyle}>{t.gpsCoords}</label>
              {gps?(
                <div>
                  <div style={{display:"flex",gap:6,marginBottom:5}}>
                    {[["LAT",gps.lat.toFixed(7)],["LNG",gps.lng.toFixed(7)]].map(([l,v])=>(
                      <div key={l} style={{flex:1,background:dark?"#0d1117":"#f6f8fa",borderRadius:8,padding:"7px",textAlign:"center",border:`1px solid ${S.border}`}}>
                        <div style={{color:S.text2,fontSize:9}}>{l}</div>
                        <div style={{color:GOLD,fontSize:12,fontFamily:"monospace",fontWeight:700}}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{color:S.text2,fontSize:10,marginBottom:3}}>{t.accuracy}: ±{gps.acc}m</div>
                  <a href={`https://maps.google.com/?q=${gps.lat},${gps.lng}`} target="_blank" rel="noreferrer" style={{color:S.info,fontSize:11}}>{t.openMaps}</a>
                </div>
              ):(<button onClick={()=>fetchGPS(user)} disabled={gpsLoad} style={{...btn(GOLD,"#0d1117"),width:"100%"}}>{gpsLoad?"Détection...":t.detectGPS}</button>)}
            </div>
          </>}

          {/* ── OWNER ── */}
          {tab==="owner"&&<OwnerForm data={draft.property} onChange={p=>setDraft(prev=>({...prev,property:{...prev.property,...p}}))} dark={dark} t={t} lang={lang} onPhotoCapture={handlePhoto} ownerIdPhoto={ownerIdPh} onRemovePhoto={()=>setOwnerIdPh(null)}/>}

          {/* ── PHOTOS ── */}
          {tab==="photos"&&<>
            <div style={{...cardStyle,border:`1px solid ${photos.length>=10?S.success+"44":S.warning+"44"}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <div>
                  <label style={lblStyle}>{t.photoTitle}</label>
                  <div style={{fontSize:11,color:photos.length>=10?S.success:S.warning}}>
                    {photos.length}/10 {t.photoMin} {photos.length>=10?"· "+t.photoMet:"· "+t.photoNeed+" "+(10-photos.length)}
                  </div>
                </div>
                <span style={goldBadge(photos.length>=10?"#27ae60":"#e67e22")}>{photos.length}</span>
              </div>
              {/* progress bar */}
              <div style={{background:S.border,borderRadius:4,height:5,marginBottom:10}}>
                <div style={{background:photos.length>=10?"#27ae60":GOLD,height:5,borderRadius:4,width:`${Math.min(100,(photos.length/10)*100)}%`,transition:"width 0.3s"}}/>
              </div>
              <input ref={photoRef} type="file" accept="image/*" multiple onChange={e=>handlePhoto(e,"main")} style={{display:"none"}}/>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>{if(photoRef.current){photoRef.current.setAttribute("capture","environment");photoRef.current.click();}}} style={{...btn(GOLD,"#0d1117"),flex:1,fontSize:13}}>📷 {t.camera}</button>
                <button onClick={()=>{if(photoRef.current){photoRef.current.removeAttribute("capture");photoRef.current.click();}}} style={{...btn(dark?"#161b22":"#f6f8fa",GOLD,GOLD+"44"),flex:1,fontSize:13}}>📁 {t.upload}</button>
              </div>
              {(locVal.region||locVal.manual)&&<div style={{marginTop:8,fontSize:10,color:S.text2}}>📍 Location auto-tag: <span style={{color:GOLD}}>{locVal.manual||[locVal.region,locVal.prefecture,locVal.commune].filter(Boolean).join(" › ")}</span></div>}
            </div>
            <div style={{...cardStyle,background:dark?"#0d1117":"#f6f8fa"}}>
              <label style={lblStyle}>{lang==="fr"?"Checklist des Prises":"Shot Checklist"}</label>
              {t.photoChecklist.map((item,i)=>(
                <div key={i} style={{display:"flex",gap:10,alignItems:"center",padding:"5px 0",borderBottom:`1px solid ${S.border}`}}>
                  <span style={{color:photos.length>i?S.success:S.text2,fontSize:13}}>{photos.length>i?"✓":"○"}</span>
                  <span style={{fontSize:12,color:photos.length>i?S.text:S.text2}}>{item}</span>
                </div>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {photos.map((ph,i)=>(
                <div key={i} style={{position:"relative",borderRadius:8,overflow:"hidden",background:S.bg3,aspectRatio:"4/3",border:`1px solid ${S.border}`}}>
                  <img src={ph.dataUrl} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                  <div style={{position:"absolute",top:3,left:3,background:GOLD+"dd",color:"#000",fontSize:9,fontWeight:700,padding:"2px 5px",borderRadius:3}}>#{i+1}</div>
                  <button onClick={()=>setPhotos(prev=>prev.filter((_,j)=>j!==i))} style={{position:"absolute",top:3,right:3,background:"#c0392bdd",color:"#fff",border:"none",borderRadius:"50%",width:20,height:20,cursor:"pointer",fontSize:10}}>✕</button>
                  <div style={{position:"absolute",bottom:0,left:0,right:0,background:"#000a",padding:"2px 4px"}}>
                    {ph.loc&&<div style={{color:GOLD,fontSize:7,fontFamily:"monospace"}}>{ph.loc.lat.toFixed(4)},{ph.loc.lng.toFixed(4)}</div>}
                    {ph.locationLabel&&<div style={{color:"#ccc",fontSize:7}}>{ph.locationLabel.slice(0,28)}</div>}
                    <div style={{color:"#888",fontSize:7}}>{ph.w}×{ph.h} · {ph.size}KB</div>
                  </div>
                </div>
              ))}
            </div>
          </>}

          {/* ── DOCUMENTS ── */}
          {tab==="docs"&&<>
            <div style={cardStyle}>
              <label style={lblStyle}>{t.docsTitle}</label>
              <p style={{color:S.text2,fontSize:11,marginBottom:10}}>{t.docsSub}</p>
              <div style={{display:"flex",gap:6,marginBottom:12}}>
                {[["land",lang==="fr"?"Terrain / Sol":"Land"],["house",lang==="fr"?"Maison / Bâtiment":"House / Building"]].map(([v,l])=>(
                  <button key={v} onClick={()=>setDocType(v)} style={{flex:1,padding:"7px",borderRadius:7,border:`1.5px solid ${docType===v?GOLD:S.border}`,background:docType===v?GOLD+"1a":"transparent",color:docType===v?GOLD:S.text2,fontSize:11,cursor:"pointer",fontWeight:700,fontFamily:"inherit"}}>{l}</button>
                ))}
              </div>
              {currentDocs.map(doc=>(
                <div key={doc.id} style={{marginBottom:12,paddingBottom:12,borderBottom:`1px solid ${S.border}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                    <div style={{flex:1,display:"flex",gap:9,alignItems:"flex-start"}}>
                      <button onClick={()=>toggleDoc(doc.id)} style={{width:20,height:20,borderRadius:4,border:`2px solid ${docs[doc.id]?.available?GOLD:S.border}`,background:docs[doc.id]?.available?GOLD:"transparent",color:"#0d1117",cursor:"pointer",fontSize:12,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}}>
                        {docs[doc.id]?.available?"✓":""}
                      </button>
                      <div>
                        <div style={{fontSize:12,fontWeight:600,color:docs[doc.id]?.available?S.text:S.text2}}>{lang==="fr"?doc.label:doc.labelEn}</div>
                        <div style={{fontSize:10,color:S.text2}}>{lang==="fr"?doc.desc:doc.descEn}</div>
                      </div>
                    </div>
                    {docs[doc.id]?.available&&(
                      <div style={{display:"flex",gap:5,alignItems:"center",flexShrink:0}}>
                        <span style={goldBadge("#27ae60")}>{(docPhotos[doc.id]||[]).length} ph</span>
                        <label htmlFor={`dp-${doc.id}`} style={{...btn(GOLD+"1a",GOLD,GOLD+"44"),padding:"4px 9px",fontSize:10,cursor:"pointer",borderRadius:6,display:"inline-block"}}>📷</label>
                        <input id={`dp-${doc.id}`} type="file" accept="image/*" capture="environment" onChange={e=>handlePhoto(e,"doc",doc.id)} style={{display:"none"}}/>
                      </div>
                    )}
                  </div>
                  {docs[doc.id]?.available&&(docPhotos[doc.id]||[]).length>0&&(
                    <div style={{display:"flex",gap:4,marginTop:8,flexWrap:"wrap"}}>
                      {(docPhotos[doc.id]||[]).map((ph,i)=>(
                        <div key={i} style={{position:"relative"}}>
                          <img src={ph.dataUrl} alt="" style={{width:54,height:54,objectFit:"cover",borderRadius:4,border:`1px solid ${S.border}`}}/>
                          <div style={{position:"absolute",bottom:0,right:0,background:"#000a",color:"#ccc",fontSize:7,padding:"1px 3px"}}>{ph.size}KB</div>
                          <button onClick={()=>setDocPhotos(prev=>({...prev,[doc.id]:prev[doc.id].filter((_,j)=>j!==i)}))} style={{position:"absolute",top:-4,right:-4,background:"#c0392b",color:"#fff",border:"none",borderRadius:"50%",width:16,height:16,cursor:"pointer",fontSize:9}}>✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>}

          {/* ── PLAN ── */}
          {tab==="plan"&&<>
            <div style={{display:"flex",gap:6,marginBottom:10}}>
              <button onClick={()=>setFloorMode("2d")} style={tabBtn(floorMode==="2d")}>{t.plan2D}</button>
              <button onClick={()=>setFloorMode("3d")} style={tabBtn(floorMode==="3d")}>{t.plan3D}</button>
            </div>
            {floorMode==="2d"&&<>
              <div style={{display:"flex",gap:4,marginBottom:10,overflowX:"auto"}}>
                {floorList.map((f,i)=><button key={i} onClick={()=>setFloorNum(i)} style={{...tabBtn(floorNum===i),padding:"5px 8px"}}>{f}</button>)}
              </div>
              <div style={cardStyle}>
                <label style={lblStyle}>{floorList[floorNum]}</label>
                <Canvas2D elements={floorPlans[floorNum]||[]} onChange={els=>setFloorPlans(prev=>({...prev,[floorNum]:els}))} dark={dark} lang={lang} t={t}/>
              </div>
              <div style={{...cardStyle,background:dark?"#0d1117":"#f6f8fa"}}>
                <label style={lblStyle}>{t.floorSummary}</label>
                {floorList.map((f,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:`1px solid ${S.border}`}}>
                    <span style={{fontSize:12}}>{f}</span>
                    <span style={{fontSize:11,color:(floorPlans[i]||[]).length>0?GOLD:S.text2}}>{(floorPlans[i]||[]).length>0?`${floorPlans[i].length} ${t.elements}`:"—"}</span>
                  </div>
                ))}
              </div>
            </>}
            {floorMode==="3d"&&<div style={cardStyle}>
              <label style={lblStyle}>{t.view3D}</label>
              <Canvas3D floorPlans={floorPlans} dark={dark} t={t}/>
            </div>}
          </>}

          {/* ── LAND ── */}
          {tab==="land"&&<>
            <div style={cardStyle}>
              <label style={lblStyle}>{t.landMap}</label>
              <p style={{color:S.text2,fontSize:11,marginBottom:10}}>{t.landSub}</p>
              <LandCanvas points={Array.isArray(landPts)?landPts:[]} onChange={setLandPts} gps={gps} dark={dark} t={t}/>
            </div>
            <div style={cardStyle}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <label style={lblStyle}>{t.gpsPoints}</label>
                <button onClick={()=>{
                  if(!gps){alert("Activez le GPS d'abord.");return;}
                  const pts=Array.isArray(landPts)?landPts:[];
                  setLandPts([...pts,{px:40+(pts.length*38)%240,py:55+Math.floor(pts.length*38/240)*45,lat:gps.lat,lng:gps.lng}]);
                }} style={{...btn(GOLD+"1a",GOLD,GOLD+"44"),padding:"5px 10px",fontSize:10}}>{t.addGPS}</button>
              </div>
              {gps&&<div style={{background:dark?"#0d1117":"#f6f8fa",borderRadius:6,padding:"7px 10px",fontFamily:"monospace",fontSize:11,color:GOLD,marginBottom:8}}>{gps.lat.toFixed(7)}°N, {gps.lng.toFixed(7)}°E ±{gps.acc}m</div>}
              {Array.isArray(landPts)&&landPts.filter(p=>p.lat).length>0&&(()=>{
                const gpsPts=landPts.filter(p=>p.lat);
                const area=gpsPts.length>=3?gpsArea(gpsPts):null;
                return(
                  <div>
                    {gpsPts.map((pt,i)=><div key={i} style={{fontFamily:"monospace",fontSize:9,color:S.text2,padding:"2px 0"}}>P{i+1}: {pt.lat.toFixed(7)}, {pt.lng.toFixed(7)}</div>)}
                    {area&&(
                      <div style={{background:dark?"#071a07":"#f0fff4",borderRadius:8,padding:"10px",marginTop:8,border:`1px solid ${dark?"#1b5e2033":"#c8e6c9"}`}}>
                        <div style={{color:dark?"#4ade80":"#2e7d32",fontSize:12,fontWeight:700,marginBottom:6}}>{t.gpsCalc}</div>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:5}}>
                          {[[t.area_m2,area.sqM],[t.area_ft2,area.sqFt],[t.area_acres,area.acres],[t.area_ha,area.ha]].map(([l,v])=>(
                            <div key={l} style={{textAlign:"center"}}>
                              <div style={{color:S.text2,fontSize:8}}>{l}</div>
                              <div style={{color:dark?"#4ade80":"#2e7d32",fontSize:12,fontWeight:700}}>{v}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <a href={`https://maps.google.com/?q=${gpsPts[0].lat},${gpsPts[0].lng}`} target="_blank" rel="noreferrer" style={{color:S.info,fontSize:11,display:"block",marginTop:8}}>📍 {t.openMaps}</a>
                  </div>
                );
              })()}
            </div>
          </>}

        </div>
      </div>
    );
  }

  /* ══════════════════════════════
     ADMIN DASHBOARD
  ══════════════════════════════ */
  if(view==="admin"){
    const submitted=inspections.filter(i=>i.status==="submitted");
    const locs=ld("ti_locs",{});
    return(
      <div style={{maxWidth:430,margin:"0 auto",minHeight:"100vh",background:S.bg,color:S.text,fontFamily:"'Segoe UI',system-ui,sans-serif"}}>
        <style>{CSS}</style>
        <div style={{background:dark?"#0d1117":"#fff",borderBottom:`1px solid ${GOLD}33`,padding:"9px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:10}}>
          <div>
            <div style={{color:GOLD,fontWeight:700,fontSize:12,letterSpacing:2}}>{t.appName}</div>
            <div style={{color:S.text2,fontSize:9,letterSpacing:0.8}}>{t.adminDash}</div>
          </div>
          <div style={{display:"flex",gap:5,flexWrap:"wrap",justifyContent:"flex-end"}}>
            <button onClick={()=>exportCSV(inspections,t)} style={{...btn("#27ae601a","#27ae60","#27ae6033"),padding:"5px 8px",fontSize:10}}>{t.exportCSV}</button>
            <button onClick={()=>downloadPhotos(inspections)} style={{...btn("#58a6ff1a","#58a6ff","#58a6ff33"),padding:"5px 8px",fontSize:10}}>{t.downloadPhotos}</button>
            <button onClick={()=>setView("guide")} style={{...btn("transparent",S.gold,S.gold),padding:"5px 8px",fontSize:10}}>{t.guide}</button>
            <button onClick={()=>setView("chat_view")} style={{...btn(GOLD+"1a",GOLD,GOLD+"33"),padding:"5px 8px",fontSize:10}}>{t.chat}</button>
            <button onClick={()=>setLang(lang==="fr"?"en":"fr")} style={{...btn("transparent",S.text2,S.border),padding:"4px 7px",fontSize:10}}>🌐</button>
            <button onClick={()=>setDark(!dark)} style={{...btn("transparent",S.text2,S.border),padding:"4px 7px",fontSize:10}}>{dark?"☀":"🌙"}</button>
            <button onClick={logout} style={{...btn("transparent",S.text2,S.border),padding:"5px 8px",fontSize:10}}>{t.logout}</button>
          </div>
        </div>
        {/* STATS */}
        <div style={{display:"flex",gap:6,padding:"10px 14px"}}>
          {[[t.total,inspections.length,GOLD],[t.submitted,submitted.length,"#27ae60"],[t.drafts,inspections.length-submitted.length,"#e67e22"],["Agents",agents.filter(a=>a.role==="agent").length,"#58a6ff"]].map(([l,n,c])=>(
            <div key={l} style={{flex:1,background:dark?"#161b22":"#fff",borderRadius:9,padding:"8px 4px",textAlign:"center",border:`1px solid ${c}22`}}>
              <div style={{color:c,fontSize:20,fontWeight:700}}>{n}</div>
              <div style={{color:S.text2,fontSize:9}}>{l}</div>
            </div>
          ))}
        </div>
        {/* ADMIN TABS */}
        <div style={{display:"flex",gap:4,padding:"0 14px",marginBottom:10,overflowX:"auto"}}>
          {[[t.liveFeed,"live"],[t.submissions,"submissions"],[t.tracking,"tracking"],[t.teamMgmt,"team"]].map(([l,id])=>(
            <button key={id} onClick={()=>setAdminTab(id)} style={{...tabBtn(adminTab===id),whiteSpace:"nowrap"}}>{l}</button>
          ))}
        </div>
        <div style={{padding:"0 14px",paddingBottom:40}}>

          {/* LIVE FEED */}
          {adminTab==="live"&&<>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <label style={lblStyle}>{t.liveTitle}</label>
              <span style={goldBadge("#27ae60")}>{t.liveRefresh}</span>
            </div>
            <p style={{color:S.text2,fontSize:11,marginBottom:10}}>{t.liveDesc}</p>
            {[...inspections].sort((a,b)=>(b.lastSaved||b.timestamp)-(a.lastSaved||a.timestamp)).map(ins=>(
              <div key={ins.id} style={cardStyle}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div>
                    <div style={{display:"flex",gap:7,alignItems:"center",marginBottom:3}}>
                      <div style={{width:26,height:26,borderRadius:"50%",background:GOLD+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:GOLD}}>{ins.agentName?.slice(0,2).toUpperCase()}</div>
                      <span style={{fontSize:12,fontWeight:600}}>{ins.agentName}</span>
                    </div>
                    <div style={{color:S.text,fontSize:11}}>{ins.property?.address||"Sans adresse"}</div>
                    {ins.property?.region&&<div style={{color:S.text2,fontSize:10}}>{ins.property.region}{ins.property.commune?" › "+ins.property.commune:""}</div>}
                    <div style={{color:S.text2,fontSize:10,marginTop:2}}>📸{ins.photos?.length||0} · 📄{Object.keys(ins.documents||{}).filter(d=>ins.documents[d]?.available).length}{ins.ownerIdPhoto?" · 👤✓":""}{ins.location?" · 📍✓":""}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <span style={goldBadge(ins.status==="submitted"?"#27ae60":"#e67e22")}>{ins.status==="submitted"?t.submitted_badge:t.draft_badge}</span>
                    <div style={{color:S.text2,fontSize:9,marginTop:3}}>{fmt(ins.lastSaved||ins.timestamp)}</div>
                  </div>
                </div>
              </div>
            ))}
            {inspections.length===0&&<div style={{color:S.text2,textAlign:"center",padding:40}}>En attente d'activité...</div>}
          </>}

          {/* SUBMISSIONS */}
          {adminTab==="submissions"&&<>
            {[...inspections].reverse().map(ins=>(
              <div key={ins.id} style={cardStyle}>
                <div onClick={()=>setExpanded(expanded===ins.id?null:ins.id)} style={{cursor:"pointer"}}>
                  <div style={{display:"flex",justifyContent:"space-between"}}>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:600,fontSize:13}}>{ins.property?.address||"Sans adresse"}</div>
                      {ins.property?.region&&<div style={{color:S.text2,fontSize:10}}>{ins.property.region}{ins.property.commune?" › "+ins.property.commune:""}</div>}
                      <div style={{color:S.text2,fontSize:10,marginTop:1}}>Par <span style={{color:GOLD}}>{ins.agentName}</span> · {fmt(ins.timestamp)}</div>
                      <div style={{display:"flex",gap:7,marginTop:3}}>
                        <span style={{color:S.text2,fontSize:10}}>🛏{ins.property?.bedrooms||0}</span>
                        <span style={{color:S.text2,fontSize:10}}>📸{ins.photos?.length||0}</span>
                        {ins.ownerIdPhoto&&<span style={{color:GOLD,fontSize:10}}>👤✓</span>}
                        {ins.location&&<span style={{color:"#27ae60",fontSize:10}}>📍✓</span>}
                      </div>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:4,alignItems:"flex-end"}}>
                      <span style={goldBadge(ins.status==="submitted"?"#27ae60":"#e67e22")}>{ins.status==="submitted"?t.submitted_badge:t.draft_badge}</span>
                      <button onClick={e=>{e.stopPropagation();delInsp(ins.id);}} style={{...btn("transparent","#f85149","#f8514933"),padding:"2px 6px",fontSize:9}}>{t.remove}</button>
                    </div>
                  </div>
                </div>
                {expanded===ins.id&&(
                  <div style={{marginTop:12,paddingTop:12,borderTop:`1px solid ${S.border}`}}>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5,marginBottom:10}}>
                      {[["Type",ins.property?.type],["État",ins.property?.condition],["Chambres",ins.property?.bedrooms],["SdB",ins.property?.bathrooms],["Salons",ins.property?.livingRooms],["Cuisine",ins.property?.kitchens],["Surface",ins.property?.totalArea?ins.property.totalArea+" m²":"—"],["Terrain",ins.property?.landHectares?ins.property.landHectares+" ha":"—"],["Année",ins.property?.yearBuilt||"—"],["Prix",ins.property?.listPrice?ins.property.listPrice+" GNF":"—"]].map(([l,v])=>(
                        <div key={l} style={{background:dark?"#0d1117":"#f6f8fa",borderRadius:5,padding:"5px 8px"}}>
                          <div style={{color:S.text2,fontSize:9,textTransform:"uppercase"}}>{l}</div>
                          <div style={{color:S.text,fontSize:11,fontWeight:600,textTransform:"capitalize"}}>{v||"—"}</div>
                        </div>
                      ))}
                    </div>
                    {ins.property?.ownerName&&<div style={{background:dark?"#0d1117":"#f6f8fa",borderRadius:6,padding:"8px",marginBottom:8}}>
                      <div style={{color:S.text2,fontSize:9}}>{t.ownerSection}</div>
                      <div style={{color:S.text,fontSize:12}}>{ins.property.ownerFirstName} {ins.property.ownerName}</div>
                      {ins.property.ownerPhone&&<div style={{color:S.text2,fontSize:11}}>{ins.property.ownerPhone}</div>}
                      {ins.property.ownerIdNum&&<div style={{color:S.text2,fontSize:10}}>ID: {ins.property.ownerIdNum}</div>}
                    </div>}
                    {ins.property?.features?.length>0&&<div style={{background:dark?"#0d1117":"#f6f8fa",borderRadius:6,padding:"8px",marginBottom:8}}>
                      <div style={{color:S.text2,fontSize:9}}>{t.featuresSection}</div>
                      <div style={{color:S.text,fontSize:11}}>{ins.property.features.join(" · ")}</div>
                    </div>}
                    {Object.keys(ins.documents||{}).filter(d=>ins.documents[d]?.available).length>0&&<div style={{background:dark?"#0d1117":"#f6f8fa",borderRadius:6,padding:"8px",marginBottom:8}}>
                      <div style={{color:S.text2,fontSize:9}}>{t.availDocs}</div>
                      <div style={{color:S.success,fontSize:11}}>{Object.keys(ins.documents).filter(d=>ins.documents[d]?.available).map(d=>([...GUINEA_DOCS_LAND,...GUINEA_DOCS_HOUSE]).find(x=>x.id===d)?.[lang==="fr"?"label":"labelEn"]||d).join(" · ")}</div>
                    </div>}
                    {ins.location&&<div style={{background:dark?"#0d1117":"#f6f8fa",borderRadius:6,padding:"8px",marginBottom:8}}>
                      <div style={{color:S.text2,fontSize:9}}>GPS</div>
                      <div style={{color:GOLD,fontFamily:"monospace",fontSize:11}}>{ins.location.lat.toFixed(7)}°N, {ins.location.lng.toFixed(7)}°E</div>
                      <a href={`https://maps.google.com/?q=${ins.location.lat},${ins.location.lng}`} target="_blank" rel="noreferrer" style={{color:S.info,fontSize:10}}>{t.openMaps}</a>
                    </div>}
                    {ins.ownerIdPhoto&&<div style={{marginBottom:8}}>
                      <div style={{color:S.text2,fontSize:9,marginBottom:4}}>{t.ownerIDPhoto}</div>
                      <img src={ins.ownerIdPhoto.dataUrl} alt="ID" style={{width:"100%",borderRadius:6,border:`1px solid ${S.border}`}}/>
                    </div>}
                    {ins.photos?.length>0&&<div>
                      <div style={{color:S.text2,fontSize:9,marginBottom:5}}>PHOTOS ({ins.photos.length})</div>
                      <div style={{display:"flex",gap:4,overflowX:"auto",paddingBottom:4}}>
                        {ins.photos.map((ph,i)=>(
                          <div key={i} style={{position:"relative",flexShrink:0}}>
                            <img src={ph.dataUrl} alt="" style={{width:60,height:60,objectFit:"cover",borderRadius:4,border:`1px solid ${S.border}`}}/>
                            <div style={{position:"absolute",bottom:0,left:0,right:0,background:"#000a",color:"#ccc",fontSize:7,padding:"1px 3px",textAlign:"center"}}>{ph.size}KB</div>
                          </div>
                        ))}
                      </div>
                    </div>}
                    {ins.property?.notes&&<div style={{background:dark?"#0d1117":"#f6f8fa",borderRadius:6,padding:"8px",marginTop:8}}>
                      <div style={{color:S.text2,fontSize:9}}>{t.agentNotesSection}</div>
                      <div style={{color:S.text2,fontSize:12}}>{ins.property.notes}</div>
                    </div>}
                  </div>
                )}
              </div>
            ))}
            {inspections.length===0&&<div style={{color:S.text2,textAlign:"center",padding:40}}>Aucune inspection.</div>}
          </>}

          {/* TRACKING */}
          {adminTab==="tracking"&&<>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <label style={lblStyle}>{lang==="fr"?"Localisation en Direct":"Live Agent Tracking"}</label>
              <span style={goldBadge("#27ae60")}>{t.liveRefresh}</span>
            </div>
            {Object.values(locs).length===0&&<div style={{color:S.text2,textAlign:"center",padding:30,fontSize:12}}>{t.noAgentLocs}</div>}
            {Object.values(locs).map((loc,i)=>(
              <div key={i} style={cardStyle}>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <div>
                    <div style={{fontWeight:600,fontSize:13,marginBottom:3}}>{loc.name}</div>
                    <div style={{color:GOLD,fontFamily:"monospace",fontSize:10}}>{loc.lat?.toFixed(6)}°N, {loc.lng?.toFixed(6)}°E</div>
                    <div style={{color:S.text2,fontSize:10,marginTop:2}}>{t.lastSeen}: {fmt(loc.ts)} · ±{loc.acc}m</div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:6,alignItems:"flex-end"}}>
                    <span style={goldBadge(Date.now()-loc.ts<600000?"#27ae60":"#e74c3c")}>{Date.now()-loc.ts<600000?t.active:t.away}</span>
                    <a href={`https://maps.google.com/?q=${loc.lat},${loc.lng}`} target="_blank" rel="noreferrer" style={{color:S.info,fontSize:10}}>{t.trackBtn}</a>
                  </div>
                </div>
              </div>
            ))}
            <div style={{...cardStyle,background:dark?"#0d1117":"#f6f8fa",marginTop:6}}>
              <label style={lblStyle}>{t.currentTeam}</label>
              {agents.filter(a=>a.role==="agent").map(a=>(
                <div key={a.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:`1px solid ${S.border}`}}>
                  <span style={{fontSize:12}}>{a.name}</span>
                  <span style={goldBadge(locs[a.id]&&Date.now()-locs[a.id]?.ts<600000?"#27ae60":"#555")}>{locs[a.id]&&Date.now()-locs[a.id]?.ts<600000?t.active.replace("●","●"):"○ Hors ligne"}</span>
                </div>
              ))}
            </div>
          </>}

          {/* TEAM */}
          {adminTab==="team"&&<>
            <div style={cardStyle}>
              <label style={lblStyle}>{t.addAgent}</label>
              <label style={{...lblStyle,fontSize:8,marginTop:8}}>{t.agentFullName}</label>
              <input value={newAgName} onChange={e=>setNewAgName(e.target.value)} placeholder="ex: Mamadou Kouyaté" style={{...inpStyle,marginBottom:10}}/>
              <label style={{...lblStyle,fontSize:8}}>{t.agentPIN}</label>
              <input type="password" inputMode="numeric" maxLength={4} value={newAgPin} onChange={e=>setNewAgPin(e.target.value)} placeholder="• • • •" style={{...inpStyle,letterSpacing:8,fontSize:22,textAlign:"center",marginBottom:14}}/>
              <button onClick={addAgent} style={{...btn(GOLD,"#0d1117"),width:"100%",fontSize:14}}>{t.addAgentBtn}</button>
            </div>
            <div style={{...cardStyle,background:dark?"#0d1117":"#f6f8fa"}}>
              <label style={lblStyle}>{t.currentTeam} ({agents.length})</label>
              {agents.map(a=>(
                <div key={a.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${S.border}`}}>
                  <div>
                    <span style={{fontSize:12}}>{a.name}</span>
                    <span style={{...goldBadge(a.role==="admin"?GOLD:"#555"),marginLeft:6,fontSize:8}}>{a.role}</span>
                  </div>
                  <div style={{display:"flex",gap:6,alignItems:"center"}}>
                    <span style={{color:S.text2,fontSize:10}}>PIN: {a.pin}</span>
                    {a.role!=="admin"&&<button onClick={()=>{if(window.confirm(t.removeConfirm))setAgents(prev=>prev.filter(ag=>ag.id!==a.id));}} style={{...btn("transparent","#f85149","#f8514933"),padding:"3px 6px",fontSize:9}}>{t.remove}</button>}
                  </div>
                </div>
              ))}
            </div>
          </>}
        </div>
      </div>
    );
  }

  return <div style={{maxWidth:430,margin:"0 auto",minHeight:"100vh",background:S.bg,padding:20,color:S.text2}}><style>{CSS}</style>Chargement...</div>;
}
/* ═══════════════════════════════════════
   MAIN APP
═══════════════════════════════════════ */
export default function TaganiImmo(){
  const[dark,setDark]=useState(true);
  const[lang,setLang]=useState("fr");
  const t=TR[lang];
  const S=makeS(dark);

  /* ── AUTH STATE ── */
  const[fbUser,setFbUser]=useState(null);
  const[userDoc,setUserDoc]=useState(null);
  const[authLoading,setAuthLoading]=useState(true);

  /* ── NAVIGATION ── */
  const[view,setView]=useState("login");
  const[authMode,setAuthMode]=useState("login");

  /* ── GPS (auto-start on mount) ── */
  const[gps,setGps]=useState(null);
  const[gpsStatus,setGpsStatus]=useState("loading");
  const watchRef=useRef(null);

  /* ── INSPECTIONS ── */
  const[inspections,setInspections]=useState([]);
  const[allInspections,setAllInspections]=useState([]);

  /* ── ADMIN ── */
  const[adminTab,setAdminTab]=useState("live");
  const[allUsers,setAllUsers]=useState({});
  const[agentLocs,setAgentLocs]=useState({});
  const[expandedInsp,setExpandedInsp]=useState(null);

  /* ── DRAFT INSPECTION ── */
  const[draft,setDraft]=useState(null);
  const[inspTab,setInspTab]=useState("details");
  const[photos,setPhotos]=useState([]);
  const[docPhotos,setDocPhotos]=useState({});
  const[ownerIdPh,setOwnerIdPh]=useState(null);
  const[floorPlans,setFloorPlans]=useState({});
  const[floorNum,setFloorNum]=useState(0);
  const[floorMode,setFloorMode]=useState("2d");
  const[landPts,setLandPts]=useState([]);
  const[docs,setDocs]=useState({});
  const[feats,setFeats]=useState([]);
  const[locVal,setLocVal]=useState({});
  const[docType,setDocType]=useState("land");
  const[voiceNotes,setVoiceNotes]=useState([]);
  const[lastSaved,setLastSaved]=useState(null);
  const[photoTypeModal,setPhotoTypeModal]=useState(null);
  const[showCameraMeasure,setShowCameraMeasure]=useState(false);
  const[showLightbox,setShowLightbox]=useState(null);

  /* ── FORMS ── */
  const[email,setEmail]=useState("");
  const[password,setPassword]=useState("");
  const[name,setName]=useState("");
  const[phone,setPhone]=useState("");
  const[teamPin,setTeamPin]=useState("");
  const[authError,setAuthError]=useState("");
  const[newAgentPwd,setNewAgentPwd]=useState("");
  const[changePwdUid,setChangePwdUid]=useState(null);

  /* ── PWA INSTALL ── */
  const[installPrompt,setInstallPrompt]=useState(null);
  const[showInstall,setShowInstall]=useState(false);

  /* ── OFFLINE ── */
  const[offline,setOffline]=useState(!navigator.onLine);

  /* ── REFS ── */
  const photoRef=useRef(null);
  const ownerIdRef=useRef(null);
  const autoSaveRef=useRef(null);

  /* ── CSS ── */
  const inp={width:"100%",padding:"12px 14px",borderRadius:8,border:`1px solid ${S.border}`,background:dark?"#0d1117":"#f6f8fa",color:S.text,fontSize:16,display:"block",fontFamily:"inherit",marginBottom:12};
  const card={background:S.bg3,borderRadius:14,padding:14,marginBottom:10,border:`1px solid ${S.border}`};
  const lbl={color:S.text2,fontSize:11,letterSpacing:0.8,textTransform:"uppercase",display:"block",marginBottom:6};
  const primaryBtn={width:"100%",padding:"14px",borderRadius:10,border:"none",background:GOLD,color:"#0d1117",cursor:"pointer",fontSize:16,fontWeight:700,fontFamily:"inherit"};
  const secondaryBtn=(extra={})=>({padding:"10px 16px",borderRadius:8,border:`1.5px solid ${S.border}`,background:"transparent",color:S.text2,cursor:"pointer",fontSize:14,fontFamily:"inherit",...extra});
  const tabBtn=active=>({padding:"7px 12px",borderRadius:6,border:`1.5px solid ${active?S.gold:S.border}`,background:active?S.gold+"1a":"transparent",color:active?S.gold:S.text2,cursor:"pointer",fontSize:11,fontWeight:700,whiteSpace:"nowrap",fontFamily:"inherit"});
  const bdg=c=>({display:"inline-block",padding:"2px 8px",borderRadius:12,fontSize:10,fontWeight:700,background:c+"22",color:c,border:`1px solid ${c}44`});
  const rowStyle={display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:`1px solid ${S.border}`};
  const sbtn=active=>({width:36,height:36,borderRadius:"50%",border:`1px solid ${active?S.gold+"44":S.border}`,background:active?S.gold+"1a":"transparent",color:active?S.gold:S.text2,cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center"});

  /* ══════════════════════════
     LIFECYCLE EFFECTS
  ══════════════════════════ */
  /* Auth listener */
  useEffect(()=>{
    return onAuthStateChanged(auth,async fbU=>{
      if(fbU){
        setFbUser(fbU);
        const doc=await get(ref(db,`users/${fbU.uid}`));
        if(doc.exists()){
          const uDoc={...doc.val(),uid:fbU.uid};
          setUserDoc(uDoc);
          if(uDoc.status==="pending") setView("pending");
          else if(uDoc.status==="suspended") {setView("suspended");}
          else setView(uDoc.role==="admin"?"admin":"dashboard");
        } else {
          setView("login");
        }
      } else {
        setFbUser(null);setUserDoc(null);setView("login");
      }
      setAuthLoading(false);
    });
  },[]);

  /* GPS auto-start */
  useEffect(()=>{
    if(!navigator.geolocation)return;
    setGpsStatus("loading");
    watchRef.current=navigator.geolocation.watchPosition(pos=>{
      const loc={lat:pos.coords.latitude,lng:pos.coords.longitude,acc:Math.round(pos.coords.accuracy),ts:Date.now()};
      setGps(loc);setGpsStatus("active");
      if(fbUser&&userDoc?.role!=="admin"){
        set(ref(db,`agentLocations/${fbUser.uid}`),{...loc,name:userDoc?.displayName||fbUser.email,uid:fbUser.uid}).catch(()=>{});
      }
    },()=>setGpsStatus("error"),{enableHighAccuracy:true,maximumAge:0,timeout:15000});
    return()=>{if(watchRef.current)navigator.geolocation.clearWatch(watchRef.current);};
  },[fbUser,userDoc]);

  /* Offline detection */
  useEffect(()=>{
    const on=()=>setOffline(true);const off2=()=>setOffline(false);
    window.addEventListener("offline",on);window.addEventListener("online",off2);
    return()=>{window.removeEventListener("offline",on);window.removeEventListener("online",off2);};
  },[]);

  /* PWA install prompt */
  useEffect(()=>{
    const handler=e=>{e.preventDefault();setInstallPrompt(e);setShowInstall(true);};
    window.addEventListener("beforeinstallprompt",handler);
    return()=>window.removeEventListener("beforeinstallprompt",handler);
  },[]);

  /* Load inspections */
  useEffect(()=>{
    if(!fbUser)return;
    if(userDoc?.role==="admin"){
      const r=ref(db,"inspections");
      onValue(r,snap=>{const val=snap.val();setAllInspections(val?Object.values(val).sort((a,b)=>(b.lastSaved||b.timestamp)-(a.lastSaved||a.timestamp)):[]);});
      const ur=ref(db,"users");
      onValue(ur,snap=>{setAllUsers(snap.val()||{});});
      const lr=ref(db,"agentLocations");
      onValue(lr,snap=>{setAgentLocs(snap.val()||{});});
      return()=>{off(ref(db,"inspections"));off(ref(db,"users"));off(ref(db,"agentLocations"));};
    } else {
      const r=ref(db,"inspections");
      onValue(r,snap=>{const val=snap.val();const mine=val?Object.values(val).filter(i=>i.agentUid===fbUser.uid).sort((a,b)=>(b.lastSaved||b.timestamp)-(a.lastSaved||a.timestamp)):[];setInspections(mine);});
      return()=>off(ref(db,"inspections"));
    }
  },[fbUser,userDoc]);

  /* Auto-save every 30s */
  useEffect(()=>{
    if(!draft||view!=="inspect")return;
    autoSaveRef.current=setInterval(()=>{saveInspection(false);setLastSaved(new Date());},30000);
    return()=>clearInterval(autoSaveRef.current);
  },[draft,view,photos,docPhotos,ownerIdPh,floorPlans,landPts,docs,feats,locVal,voiceNotes]);

  /* ══════════════════════════
     AUTH FUNCTIONS
  ══════════════════════════ */
  const doLogin=async()=>{
    setAuthError("");
    try{
      await signInWithEmailAndPassword(auth,email,password);
    }catch(e){
      setAuthError(e.code==="auth/invalid-credential"?"Email ou mot de passe incorrect.":"Erreur: "+e.message);
    }
  };

  const doRegister=async()=>{
    setAuthError("");
    if(!name.trim()){setAuthError("Entrez votre nom complet.");return;}
    if(password.length<8){setAuthError("Le mot de passe doit contenir au moins 8 caractères.");return;}
    try{
      const settings=await get(ref(db,"settings"));
      const correctPin=settings.exists()?settings.val().teamPin:"1234";
      if(teamPin!==correctPin){setAuthError("PIN d'équipe incorrect. Contactez l'administrateur.");return;}
      const cred=await createUserWithEmailAndPassword(auth,email,password);
      const uDoc={uid:cred.user.uid,displayName:name.trim(),email,phone,role:"agent",status:"pending",createdAt:Date.now(),lastLogin:Date.now(),totalInspections:0};
      await set(ref(db,`users/${cred.user.uid}`),uDoc);
    }catch(e){
      setAuthError(e.code==="auth/email-already-in-use"?"Cet email est déjà utilisé.":"Erreur: "+e.message);
    }
  };

  const doLogout=async()=>{await signOut(auth);setView("login");setDraft(null);setPhotos([]);};

  const doForgotPwd=()=>{if(!email){setAuthError("Entrez votre email.");return;}sendPasswordResetEmail(auth,email).then(()=>alert("Email de réinitialisation envoyé.")).catch(e=>setAuthError(e.message));};

  /* ══════════════════════════
     ADMIN FUNCTIONS
  ══════════════════════════ */
  const approveUser=async uid2=>{await update(ref(db,`users/${uid2}`),{status:"active"});};
  const suspendUser=async uid2=>{await update(ref(db,`users/${uid2}`),{status:"suspended"});};
  const unsuspendUser=async uid2=>{await update(ref(db,`users/${uid2}`),{status:"active"});};
  const deleteUserDB=async uid2=>{if(window.confirm("Supprimer cet utilisateur?"))await remove(ref(db,`users/${uid2}`));};
  const adminChangePwd=async(uid2,newPwd)=>{alert("Pour changer le mot de passe, envoyez un email de réinitialisation ou utilisez Firebase Console → Authentication.");};

  /* ══════════════════════════
     INSPECTION FUNCTIONS
  ══════════════════════════ */
  const blankDraft=()=>({id:uid(),agentUid:fbUser.uid,agentName:userDoc?.displayName||fbUser.email,timestamp:Date.now(),location:gps,status:"draft",docType:"land",property:{address:"",type:"house",bedrooms:0,bathrooms:0,livingRooms:0,kitchens:0,diningRooms:0,garages:0,offices:0,laundryRooms:0,balconies:0,storageRooms:0,hallways:0,staircases:0,totalArea:"",landArea:"",landHectares:"",yearBuilt:"",listPrice:"",condition:"good",features:[],ownerName:"",ownerFirstName:"",ownerDOB:"",ownerPOB:"",ownerNationality:"Guinéenne",ownerOccupation:"",ownerPhone:"",ownerPhone2:"",ownerEmail:"",ownerAddress:"",ownerRelation:"",ownerIdType:"",ownerIdNum:"",visitDate:"",ownerAskingPrice:"",negotiationNotes:"",notes:""},photos:[],docPhotos:{},ownerIdPhoto:null,documents:{},floorPlans:{},landPts:[],voiceNotes:[]});

  const newInspection=()=>{
    const ins=blankDraft();setDraft(ins);setPhotos([]);setDocPhotos({});setOwnerIdPh(null);setFloorPlans({});setLandPts([]);setDocs({});setFeats([]);setLocVal({});setVoiceNotes([]);setFloorNum(0);setFloorMode("2d");setInspTab("details");setLastSaved(null);setView("inspect");
  };
  const openInspection=ins=>{setDraft(ins);setPhotos(ins.photos||[]);setDocPhotos(ins.docPhotos||{});setOwnerIdPh(ins.ownerIdPhoto||null);setFloorPlans(ins.floorPlans||{});setLandPts(ins.landPts||[]);setDocs(ins.documents||{});setFeats(ins.property?.features||[]);setLocVal({region:ins.property?.region,prefecture:ins.property?.prefecture,commune:ins.property?.commune,neighborhood:ins.property?.neighborhood,manual:ins.property?.manualLocation});setVoiceNotes(ins.voiceNotes||[]);setDocType(ins.docType||"land");setFloorNum(0);setFloorMode("2d");setInspTab("details");setView("inspect");};

  const updProp=(k,v)=>setDraft(prev=>({...prev,property:{...prev.property,[k]:v}}));

  const saveInspection=async(showAlert=true)=>{
    if(!draft)return;
    const updated={...draft,photos,docPhotos,ownerIdPhoto:ownerIdPh,floorPlans,landPts:Array.isArray(landPts)?landPts:[],documents:docs,location:gps,voiceNotes,property:{...draft.property,...(locVal.manual?{manualLocation:locVal.manual}:{region:locVal.region||"",prefecture:locVal.prefecture||"",commune:locVal.commune||"",neighborhood:locVal.neighborhood||""}),features:feats},status:draft.status||"draft",lastSaved:Date.now()};
    setDraft(updated);
    try{await set(ref(db,`inspections/${updated.id}`),updated);}catch(e){sv("ti_draft_"+updated.id,JSON.stringify(updated));}
    if(showAlert)alert(t.saveOK);
  };

  const submitInspection=async()=>{
    if(!draft.property.address){alert(t.errAddress);setInspTab("details");return;}
    if(photos.length<10){alert(t.errPhotos+" ("+photos.length+"/10)");setInspTab("photos");return;}
    const updated={...draft,photos,docPhotos,ownerIdPhoto:ownerIdPh,floorPlans,landPts:Array.isArray(landPts)?landPts:[],documents:docs,location:gps,voiceNotes,property:{...draft.property,...(locVal.manual?{manualLocation:locVal.manual}:{region:locVal.region||"",prefecture:locVal.prefecture||"",commune:locVal.commune||"",neighborhood:locVal.neighborhood||""}),features:feats},status:"submitted",submittedAt:Date.now(),lastSaved:Date.now()};
    try{await set(ref(db,`inspections/${updated.id}`),updated);alert(t.submitOK);setView("dashboard");}catch(e){alert("Erreur. Vérifiez votre connexion.");}
  };

  const handlePhoto=async(e,type,docId)=>{
    const files=Array.from(e.target.files);
    for(const file of files){
      const ph=await processPhoto(file,userDoc?.displayName||fbUser?.email||"Agent",gps,draft?.property?.address||"");
      if(type==="main"){const idx=photos.length;setPhotos(prev=>[...prev,{...ph,agentUid:fbUser.uid,agentName:userDoc?.displayName||"",type:""}]);setPhotoTypeModal(idx);}
      else if(type==="ownerid")setOwnerIdPh(ph);
      else if(type==="doc"&&docId)setDocPhotos(prev=>({...prev,[docId]:[...(prev[docId]||[]),ph]}));
    }
    e.target.value="";
  };

  const setPhotoType=(idx,type)=>{setPhotos(prev=>prev.map((p,i)=>i===idx?{...p,type}:p));setPhotoTypeModal(null);};
  const toggleDoc=id=>setDocs(prev=>({...prev,[id]:{...prev[id],available:!prev[id]?.available}}));
  const toggleFeat=f=>setFeats(prev=>prev.includes(f)?prev.filter(x=>x!==f):[...prev,f]);
  const delInspection=async id=>{if(window.confirm("Supprimer cette inspection?"))await remove(ref(db,`inspections/${id}`));};
  const handleVoiceNote=(blob,url,secs)=>setVoiceNotes(prev=>[...prev,{id:uid(),url,secs,ts:Date.now(),agentName:userDoc?.displayName||""}]);

  const currentDocs=docType==="land"?DOCS_LAND:DOCS_HOUSE;
  const gpsLabel=gpsStatus==="active"?t.gpsOn:gpsStatus==="loading"?t.gpsLoad:t.gpsOff;
  const gpsColor=gpsStatus==="active"?"#27ae60":gpsStatus==="loading"?S.warning:S.error;
  const completionPct=draft?Math.round([draft.property?.address?1:0,photos.length>=10?1:0,draft.property?.ownerName?1:0,Object.keys(docs).some(d=>docs[d]?.available)?1:0,Object.values(floorPlans).flat().length>0?1:0,landPts.length>=3?1:0].reduce((a,b)=>a+b,0)/6*100):0;

  const myInspections=inspections;
  const submittedInsp=allInspections.filter(i=>i.status==="submitted");

  /* ══════════════════════════
     SPLASH
  ══════════════════════════ */
  if(authLoading)return(
    <div style={{...JSON.parse("{}"),maxWidth:430,margin:"0 auto",minHeight:"100vh",background:S.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:20}}>
      <style>{CSS}</style>
      <div style={{color:GOLD,fontWeight:700,fontSize:26,letterSpacing:4}}>{t.appName}</div>
      <div style={{color:S.text2,fontSize:13}}>{t.appSub}</div>
      <div style={{width:36,height:36,border:`3px solid ${GOLD}`,borderTop:"3px solid transparent",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );

  /* ══════════════════════════
     PENDING APPROVAL
  ══════════════════════════ */
  if(view==="pending")return(
    <div style={{maxWidth:430,margin:"0 auto",minHeight:"100vh",background:S.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24}}>
      <style>{CSS}</style>
      <div style={{fontSize:56,marginBottom:20}}>⏳</div>
      <div style={{color:GOLD,fontWeight:700,fontSize:20,letterSpacing:2,marginBottom:12}}>{t.pendingTitle}</div>
      <div style={{background:S.bg3,borderRadius:14,padding:24,border:`1px solid ${S.border}`,textAlign:"center"}}>
        <p style={{color:S.text,fontSize:15,lineHeight:1.7,marginBottom:16}}>{t.pendingMsg}</p>
        <p style={{color:S.text2,fontSize:13}}>{fbUser?.email}</p>
      </div>
      <button onClick={doLogout} style={{...secondaryBtn(),marginTop:20,width:"100%"}}>{t.logout}</button>
    </div>
  );

  if(view==="suspended")return(
    <div style={{maxWidth:430,margin:"0 auto",minHeight:"100vh",background:S.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24}}>
      <style>{CSS}</style>
      <div style={{fontSize:56,marginBottom:20}}>⊘</div>
      <div style={{color:S.error,fontWeight:700,fontSize:18,marginBottom:12}}>Compte suspendu</div>
      <div style={{background:S.bg3,borderRadius:14,padding:24,border:`1px solid ${S.error}44`,textAlign:"center",color:S.text,fontSize:15,lineHeight:1.7}}>{t.suspendedMsg}</div>
      <button onClick={doLogout} style={{...secondaryBtn(),marginTop:20,width:"100%"}}>{t.logout}</button>
    </div>
  );

  /* ══════════════════════════
     LOGIN / REGISTER
  ══════════════════════════ */
  if(view==="login")return(
    <div style={{maxWidth:430,margin:"0 auto",minHeight:"100vh",background:S.bg,fontFamily:"system-ui,sans-serif"}}>
      <style>{CSS}</style>
      <div style={{padding:"0 22px",paddingTop:authMode==="login"?60:30}}>
        {/* Header */}
        <div style={{position:"absolute",top:14,right:16,display:"flex",gap:8}}>
          <button onClick={()=>setLang(lang==="fr"?"en":"fr")} style={{...secondaryBtn(),padding:"5px 10px",fontSize:11}}>🌐 {lang==="fr"?"EN":"FR"}</button>
          <button onClick={()=>setDark(!dark)} style={{...secondaryBtn(),padding:"5px 10px",fontSize:11}}>{dark?"☀":"🌙"}</button>
        </div>
        {/* Logo */}
        <div style={{textAlign:"center",marginBottom:authMode==="login"?36:24}}>
          <div style={{width:74,height:74,borderRadius:"50%",background:GOLD+"1a",border:`2px solid ${GOLD}55`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",fontSize:32}}>🏠</div>
          <div style={{color:GOLD,fontWeight:700,fontSize:22,letterSpacing:3}}>{t.appName}</div>
          <div style={{color:GOLD+"88",fontSize:11,marginTop:3,letterSpacing:2}}>{t.appSub}</div>
          <div style={{color:S.text2,fontSize:11,marginTop:10,padding:"5px 14px",background:S.bg3,borderRadius:20,display:"inline-block",border:`1px solid ${S.border}`}}>🔒 Accès Équipe Uniquement</div>
        </div>
        {/* Auth Card */}
        <div style={{...card}}>
          {authMode==="login"?(
            <>
              <label style={lbl}>{t.email}</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="votre@email.com" style={inp} autoComplete="email"/>
              <label style={lbl}>{t.password}</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doLogin()} placeholder="••••••••" style={inp} autoComplete="current-password"/>
              {authError&&<div style={{color:S.error,fontSize:13,marginBottom:12,padding:"8px 12px",background:S.error+"15",borderRadius:6,border:`1px solid ${S.error}44`}}>{authError}</div>}
              <button onClick={doLogin} style={primaryBtn}>{t.login}</button>
              <div style={{textAlign:"center",marginTop:14,display:"flex",justifyContent:"space-between"}}>
                <button onClick={doForgotPwd} style={{background:"none",border:"none",color:S.text2,fontSize:13,cursor:"pointer"}}>{t.forgotPwd}</button>
                <button onClick={()=>{setAuthMode("register");setAuthError("");}} style={{background:"none",border:"none",color:S.gold,fontSize:13,cursor:"pointer",fontWeight:600}}>{t.createAccount}</button>
              </div>
            </>
          ):(
            <>
              <label style={lbl}>{t.fullName}</label>
              <input value={name} onChange={e=>setName(e.target.value)} placeholder="Jean-Pierre Diallo" style={inp}/>
              <label style={lbl}>{t.email}</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="votre@email.com" style={inp}/>
              <label style={lbl}>{t.password} (min 8 caractères)</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" style={inp}/>
              <label style={lbl}>{t.phone} (optionnel)</label>
              <input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+224 622 000 000" style={{...inp,marginBottom:8}}/>
              <label style={lbl}>{t.teamPIN}</label>
              <input type="password" inputMode="numeric" maxLength={4} value={teamPin} onChange={e=>setTeamPin(e.target.value)} placeholder="• • • •" style={{...inp,letterSpacing:8,fontSize:22,textAlign:"center"}}/>
              <p style={{color:S.text2,fontSize:12,marginBottom:12,lineHeight:1.5}}>Le PIN d'équipe est fourni par votre administrateur. Votre compte sera activé après approbation.</p>
              {authError&&<div style={{color:S.error,fontSize:13,marginBottom:12,padding:"8px 12px",background:S.error+"15",borderRadius:6}}>{authError}</div>}
              <button onClick={doRegister} style={primaryBtn}>{t.registerBtn}</button>
              <button onClick={()=>{setAuthMode("login");setAuthError("");}} style={{...secondaryBtn(),width:"100%",marginTop:10}}>{t.backLogin}</button>
            </>
          )}
        </div>
        <div style={{textAlign:"center",color:S.text2,fontSize:10,marginTop:16}}>© {new Date().getFullYear()} Tagani Immo · Conakry, République de Guinée</div>
      </div>
    </div>
  );

  /* ══════════════════════════
     CHAT VIEW
  ══════════════════════════ */
  if(view==="chat")return(
    <div style={{maxWidth:430,margin:"0 auto",minHeight:"100vh",background:S.bg,fontFamily:"system-ui,sans-serif"}}>
      <style>{CSS}</style>
      <div style={{background:dark?"#0d1117":"#fff",borderBottom:`1px solid ${GOLD}33`,padding:"10px 15px",display:"flex",alignItems:"center",gap:12,position:"sticky",top:0,zIndex:10}}>
        <button onClick={()=>setView(userDoc?.role==="admin"?"admin":"dashboard")} style={{background:"none",border:"none",color:GOLD,cursor:"pointer",fontSize:22}}>←</button>
        <div style={{color:GOLD,fontWeight:700,fontSize:14,letterSpacing:1.5}}>{t.chat}</div>
        <div style={{marginLeft:"auto",display:"flex",gap:6}}>
          <button onClick={()=>setLang(lang==="fr"?"en":"fr")} style={{...secondaryBtn(),padding:"4px 8px",fontSize:10}}>🌐</button>
          <button onClick={()=>setDark(!dark)} style={{...secondaryBtn(),padding:"4px 8px",fontSize:10}}>{dark?"☀":"🌙"}</button>
        </div>
      </div>
      <div style={{padding:14,height:"calc(100vh - 54px)",display:"flex",flexDirection:"column"}}>
        <ChatPanel user={{...fbUser,role:userDoc?.role,displayName:userDoc?.displayName}} dark={dark} t={t}/>
      </div>
    </div>
  );

  /* ══════════════════════════
     AGENT DASHBOARD
  ══════════════════════════ */
  if(view==="dashboard"){
    return(
      <div style={{maxWidth:430,margin:"0 auto",minHeight:"100vh",background:S.bg,fontFamily:"system-ui,sans-serif",paddingBottom:70}}>
        <style>{CSS+`@keyframes pulse{0%,100%{opacity:1;}50%{opacity:.4;}}`}</style>
        {/* Offline banner */}
        {offline&&<div style={{background:S.warning+"22",borderBottom:`1px solid ${S.warning}44`,padding:"8px 16px",fontSize:12,color:S.warning,textAlign:"center"}}>{t.offlineBanner}</div>}
        {/* Install banner */}
        {showInstall&&<div style={{background:GOLD+"1a",borderBottom:`1px solid ${GOLD}44`,padding:"8px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:12,color:S.text}}>{t.installBanner}</span>
          <div style={{display:"flex",gap:6}}>
            <button onClick={()=>{installPrompt?.prompt();setShowInstall(false);}} style={{padding:"4px 10px",borderRadius:6,background:GOLD,color:"#000",border:"none",cursor:"pointer",fontSize:11,fontWeight:700}}>{t.installBtn}</button>
            <button onClick={()=>setShowInstall(false)} style={{...secondaryBtn(),padding:"4px 8px",fontSize:11}}>{t.laterBtn}</button>
          </div>
        </div>}
        {/* Header */}
        <div style={{background:dark?"#0d1117":"#fff",borderBottom:`1px solid ${GOLD}33`,padding:"10px 15px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:10}}>
          <div><div style={{color:GOLD,fontWeight:700,fontSize:13,letterSpacing:2}}>{t.appName}</div><div style={{color:S.text2,fontSize:10}}>Bonjour, {userDoc?.displayName||fbUser?.email}</div></div>
          <div style={{display:"flex",gap:6}}>
            <span style={{...bdg(gpsColor),fontSize:9}}>{gpsLabel}</span>
            <button onClick={()=>setLang(lang==="fr"?"en":"fr")} style={{...secondaryBtn(),padding:"4px 7px",fontSize:10}}>🌐</button>
            <button onClick={()=>setDark(!dark)} style={{...secondaryBtn(),padding:"4px 7px",fontSize:10}}>{dark?"☀":"🌙"}</button>
            <button onClick={doLogout} style={{...secondaryBtn(),padding:"5px 8px",fontSize:11}}>{t.logout}</button>
          </div>
        </div>
        <div style={{padding:14}}>
          {/* GPS card */}
          <div style={{...card,border:`1px solid ${GOLD}22`}}>
            <label style={lbl}>📍 {t.gpsTab}</label>
            {gps?<div style={{fontFamily:"monospace",fontSize:13,color:GOLD}}>{gps.lat.toFixed(6)}°N · {gps.lng.toFixed(6)}°E <span style={{color:S.text2,fontSize:11}}>±{gps.acc}m</span></div>:<div style={{color:S.text2,fontSize:13}}>{gpsLabel}</div>}
          </div>
          {/* Stats */}
          <div style={{display:"flex",gap:8,marginBottom:12}}>
            {[[myInspections.length,"Total",GOLD],[myInspections.filter(i=>i.status==="submitted").length,t.submitted_b,"#27ae60"],[myInspections.filter(i=>i.status!=="submitted").length,t.draft_b,"#e67e22"]].map(([n,l,c])=>(
              <div key={l} style={{flex:1,background:S.bg3,borderRadius:10,padding:"9px 5px",textAlign:"center",border:`1px solid ${c}22`}}>
                <div style={{color:c,fontSize:20,fontWeight:700}}>{n}</div>
                <div style={{color:S.text2,fontSize:9}}>{l}</div>
              </div>
            ))}
          </div>
          {/* New inspection button */}
          <button onClick={newInspection} style={{...primaryBtn,marginBottom:14,borderRadius:12,fontSize:17}}>{t.newInsp}</button>
          {/* My inspections */}
          <label style={{...lbl,marginBottom:8}}>{t.myInsp}</label>
          {myInspections.length===0&&<div style={{color:S.text2,textAlign:"center",padding:40,fontSize:13}}>Aucune inspection. Appuyez ci-dessus pour commencer.</div>}
          {myInspections.map(ins=>(
            <div key={ins.id} style={{...card,cursor:"pointer"}} onClick={()=>openInspection(ins)}>
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,fontSize:14,marginBottom:3}}>{ins.property?.address||"Sans adresse"}</div>
                  <div style={{color:S.text2,fontSize:11}}>{ins.property?.region||""}{ins.property?.commune?" › "+ins.property.commune:""}</div>
                  <div style={{color:S.text2,fontSize:11,marginTop:2}}>{fmt(ins.timestamp)}</div>
                  <div style={{color:S.text2,fontSize:11,marginTop:2}}>🛏{ins.property?.bedrooms||0} 🚿{ins.property?.bathrooms||0} 📸{ins.photos?.length||0}</div>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:6,alignItems:"flex-end"}}>
                  <span style={bdg(ins.status==="submitted"?"#27ae60":"#e67e22")}>{ins.status==="submitted"?t.submitted_b:t.draft_b}</span>
                  {ins.photos?.[0]?.dataUrl&&<img src={ins.photos[0].dataUrl} alt="" style={{width:56,height:56,objectFit:"cover",borderRadius:6,border:`1px solid ${S.border}`}} loading="lazy"/>}
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Bottom Nav */}
        <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:dark?"#161b22":"#fff",borderTop:`1px solid ${S.border}`,display:"flex",justifyContent:"space-around",padding:"8px 0 12px",zIndex:20}}>
          {[[t.home,"🏠","dashboard"],[t.inspections,"📋","dashboard"],[t.gpsTab,"📍","dashboard"],[t.chat,"💬","chat"],[t.profile,"👤","dashboard"]].map(([label,icon,v])=>(
            <button key={label} onClick={()=>setView(v)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,background:"none",border:"none",cursor:"pointer",color:v===view&&label===t.home?S.gold:S.text2,fontSize:10,minWidth:52}}>
              <span style={{fontSize:20}}>{icon}</span>
              {label}
              {v===view&&label===t.home&&<div style={{width:4,height:4,borderRadius:"50%",background:GOLD}}/>}
            </button>
          ))}
        </div>
      </div>
    );
  }

