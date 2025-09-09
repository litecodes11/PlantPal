/* ===============================
   Plant Pal — App Logic
   Roles: Architect, Frontend, Data Curator, UX Writer
   =============================== */

// --- Data model: starter plants (extendable) ---
const PLANTS = [
  {
    id: "basil",
    name: "Basil",
    water: "Keep evenly moist; water when top 1–2 cm of soil is dry. Avoid wetting leaves at night.",
    light: "Full sun (6–8h). Indoors: brightest south window or strong grow light.",
    soil: "Rich, well-drained potting mix. Pinch tops to prevent bolting.",
    companions: "Tomato, pepper; avoid rue.",
    toxicity: "Non-toxic to pets and humans.",
    tips: "Harvest often to promote bushiness. Remove flower spikes for best flavor.",
    defaultReminderDays: 2
  },
  {
    id: "snake",
    name: "Snake Plant (Sansevieria)",
    water: "Infrequent—let soil dry fully. Every 2–3 weeks; monthly in winter.",
    light: "Low to bright indirect; tolerates low light well.",
    soil: "Cactus/succulent mix with excellent drainage.",
    companions: "Great with other low-water succulents.",
    toxicity: "Mildly toxic if chewed by pets.",
    tips: "Use a pot with drainage. Overwatering is the #1 killer.",
    defaultReminderDays: 14
  },
  {
    id: "spider",
    name: "Spider Plant",
    water: "Keep slightly moist; water when top 2–3 cm is dry. Likes occasional misting.",
    light: "Bright, indirect. Avoid harsh midday sun.",
    soil: "All-purpose potting mix with perlite for drainage.",
    companions: "Pairs with ferns/peperomia in similar light.",
    toxicity: "Non-toxic to pets.",
    tips: "Trim brown tips; propagate babies (‘spiderettes’) in water.",
    defaultReminderDays: 5
  },
  {
    id: "pothos",
    name: "Pothos (Devil’s Ivy)",
    water: "When top 3–5 cm dry. Tolerates missed waterings.",
    light: "Low–bright indirect. Variegation fades in low light.",
    soil: "Light, airy mix; don’t let sit in water.",
    companions: "Great shelf/hanging companion plant.",
    toxicity: "Toxic if ingested (oxalates).",
    tips: "Rotate pot weekly for even growth; easy to propagate from cuttings.",
    defaultReminderDays: 7
  },
  {
    id: "peace-lily",
    name: "Peace Lily",
    water: "Keep consistently moist; droops when thirsty—water and it perks up.",
    light: "Medium, indirect; blooms with brighter light.",
    soil: "Rich, moisture-retentive but draining mix.",
    companions: "Pairs with calatheas/philodendrons.",
    toxicity: "Toxic to pets if chewed.",
    tips: "Wipe leaves to prevent dust; yellow leaves = overwater.",
    defaultReminderDays: 4
  }
];

// --- Eco tips (rotates daily) ---
const ECO_TIPS = [
  "Collect cool tap water and let it sit overnight—chlorine dissipates and plants prefer room temp.",
  "Water early morning to reduce evaporation and fungal risk.",
  "Use a moisture meter or finger check to avoid overwatering.",
  "Group humidity-loving plants together to create a microclimate.",
  "Save coffee grounds for acid-lovers (azalea, blueberry) — use lightly and mix in soil."
];

// --- DOM refs ---
const plantSelect = document.getElementById('plantSelect');
const plantSearch = document.getElementById('plantSearch');
const details = document.getElementById('details');
const nameEl = document.getElementById('plantName');
const waterEl = document.getElementById('water');
const lightEl = document.getElementById('light');
const soilEl = document.getElementById('soil');
const companionsEl = document.getElementById('companions');
const toxicityEl = document.getElementById('toxicity');
const tipsEl = document.getElementById('tips');
const remindBtn = document.getElementById('remindBtn');
const remindersList = document.getElementById('remindersList');
const ecoTipEl = document.getElementById('ecoTip');

// --- Init select list ---
function populateSelect(list){
  plantSelect.innerHTML = "";
  list.forEach(p=>{
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = p.name;
    plantSelect.appendChild(opt);
  });
}
populateSelect(PLANTS);

// --- Simple search filter ---
plantSearch.addEventListener('input', () => {
  const q = plantSearch.value.toLowerCase().trim();
  const filtered = PLANTS.filter(p => p.name.toLowerCase().includes(q));
  populateSelect(filtered.length ? filtered : PLANTS);
});

// --- Update details when select changes ---
plantSelect.addEventListener('change', () => {
  const plant = PLANTS.find(p => p.id === plantSelect.value);
  if (!plant) return;
  showDetails(plant);
});
plantSelect.dispatchEvent(new Event('change')); // load first by default

function showDetails(plant){
  nameEl.textContent = plant.name;
  waterEl.textContent = plant.water;
  lightEl.textContent = plant.light;
  soilEl.textContent = plant.soil;
  companionsEl.textContent = plant.companions;
  toxicityEl.textContent = plant.toxicity;
  tipsEl.textContent = plant.tips;

  remindBtn.onclick = () => addReminder(plant.id, plant.name, plant.defaultReminderDays);
  details.classList.remove('hidden');
}

// --- Reminders (localStorage only) ---
const KEY = "plantpal.reminders";

function loadReminders(){
  try { return JSON.parse(localStorage.getItem(KEY)) || []; }
  catch { return []; }
}

function saveReminders(items){
  localStorage.setItem(KEY, JSON.stringify(items));
  renderReminders();
}

function addReminder(id, name, days){
  const items = loadReminders();
  const next = new Date();
  next.setDate(next.getDate() + days);
  items.push({ id, name, everyDays: days, nextISO: next.toISOString() });
  saveReminders(items);
}

function deleteReminder(idx){
  const items = loadReminders();
  items.splice(idx,1);
  saveReminders(items);
}

function humanDate(iso){
  const d = new Date(iso);
  return d.toLocaleDateString() + " " + d.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
}

function renderReminders(){
  const items = loadReminders();
  remindersList.innerHTML = "";
  if(!items.length){
    remindersList.innerHTML = "<li>No reminders yet. Add one from a plant card.</li>";
    return;
  }
  items.forEach((it, i)=>{
    const li = document.createElement('li');
    li.innerHTML = `
      <span><strong>${it.name}</strong> — every ${it.everyDays} day(s). Next: ${humanDate(it.nextISO)}</span>
      <button aria-label="Delete reminder">Remove ✕</button>
    `;
    li.querySelector('button').onclick = () => deleteReminder(i);
    remindersList.appendChild(li);
  });
}
renderReminders();

// --- Eco tip of the day ---
(function eco(){
  const dayIndex = Math.floor(Date.now()/(1000*60*60*24)) % ECO_TIPS.length;
  ecoTipEl.textContent = ECO_TIPS[dayIndex];
})();
