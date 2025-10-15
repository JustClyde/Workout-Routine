// app.js - static client-side workout tracker

/* WORKOUT_PLAN copied from your React object */
const WORKOUT_PLAN = {
  title: "4-Week Women's Weight Loss & Lower Body Focused Gym Plan",
  note: "Goal: Small calorie deficit + protein, 6x workouts/week, focus on glutes & legs",
  schedule: [
    { id: "monday", name: "Monday: Glutes & Hamstrings", exercises: [
      { id: "m1", name: "Barbell Hip Thrusts", sets: "4 x 12" },
      { id: "m2", name: "Romanian Deadlifts", sets: "4 x 10" },
      { id: "m3", name: "Cable Kickbacks (per leg)", sets: "3 x 15" },
      { id: "m4", name: "Lying Hamstring Curls", sets: "3 x 12" },
      { id: "m5", name: "Walking Lunges (20 steps)", sets: "3 x 20 steps" },
      { id: "m6", name: "Finisher: 10 min Stairmaster", sets: "10 min" }
    ]},
    { id: "tuesday", name: "Tuesday: Quads & Core", exercises: [
      { id: "t1", name: "Barbell Back Squats", sets: "4 x 10" },
      { id: "t2", name: "Leg Press", sets: "4 x 12" },
      { id: "t3", name: "Bulgarian Split Squats", sets: "3 x 10 per leg" },
      { id: "t4", name: "Leg Extensions", sets: "3 x 15" },
      { id: "t5", name: "Hanging Leg Raises", sets: "3 x 15" },
      { id: "t6", name: "Plank", sets: "3 x 1 min" }
    ]},
    { id: "wednesday", name: "Wednesday: Glute Isolation + Cardio", exercises: [
      { id: "w1", name: "Cable Glute Kickbacks", sets: "4 x 15" },
      { id: "w2", name: "Dumbbell Step-Ups", sets: "3 x 12 per leg" },
      { id: "w3", name: "Glute Bridge (bodyweight)", sets: "4 x 20" },
      { id: "w4", name: "Side-Lying Leg Raises", sets: "3 x 20 per side" },
      { id: "w5", name: "30 min incline treadmill walk or cycling", sets: "30 min" }
    ]},
    { id: "thursday", name: "Thursday: Upper Body & Core", exercises: [
      { id: "th1", name: "Dumbbell Shoulder Press", sets: "3 x 12" },
      { id: "th2", name: "Lat Pulldown", sets: "3 x 10" },
      { id: "th3", name: "Seated Row", sets: "3 x 12" },
      { id: "th4", name: "Dumbbell Bicep Curl", sets: "3 x 12" },
      { id: "th5", name: "Tricep Rope Pushdown", sets: "3 x 15" },
      { id: "th6", name: "Russian Twists", sets: "3 x 20" },
      { id: "th7", name: "Cable Crunch", sets: "3 x 15" }
    ]},
    { id: "friday", name: "Friday: Glute & Leg Power Day", exercises: [
      { id: "f1", name: "Barbell Hip Thrust (heavy)", sets: "5 x 8" },
      { id: "f2", name: "Sumo Deadlifts", sets: "4 x 10" },
      { id: "f3", name: "Curtsy Lunges", sets: "3 x 12 per leg" },
      { id: "f4", name: "Leg Press (wide stance)", sets: "3 x 12" },
      { id: "f5", name: "Abductor Machine", sets: "4 x 20" },
      { id: "f6", name: "Stairmaster – 10 min high intensity", sets: "10 min" }
    ]},
    { id: "saturday", name: "Saturday: Cardio & Abs", exercises: [
      { id: "s1", name: "20–30 minutes HIIT", sets: "20-30 min" },
      { id: "s2", name: "Hanging Knee Raises", sets: "3 x 15" },
      { id: "s3", name: "Cable Twists", sets: "3 x 20" },
      { id: "s4", name: "Mountain Climbers", sets: "3 x 30 sec" },
      { id: "s5", name: "Plank Variations", sets: "3 rounds" }
    ]},
    { id: "sunday", name: "Sunday: Rest or Active Recovery", exercises: [] }
  ]
};

const STORAGE_KEY = "minnies_gym_v1";

/* Helpers for storage */
function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : { progress: {}, notes: {}, selected: WORKOUT_PLAN.schedule[0].id };
}
function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/* Render functions */
function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}

function renderDays(state, onSelect) {
  const container = document.getElementById("daysList");
  container.innerHTML = "";
  WORKOUT_PLAN.schedule.forEach(day => {
    const dayBtn = el("div", "day-btn");
    if (state.selected === day.id) dayBtn.classList.add("active");
    const left = el("div", "leftcol");
    const name = el("div", "day-name", day.name);
    const meta = el("div", "day-meta", `${day.exercises.length} exercises`);
    left.appendChild(name);
    left.appendChild(meta);

    const doneCount = (Object.values(state.progress[day.id] || {}).filter(Boolean) || []).length;
    const right = el("div", "day-count", `${doneCount}/${day.exercises.length}`);

    dayBtn.appendChild(left);
    dayBtn.appendChild(right);

    dayBtn.addEventListener("click", () => {
      state.selected = day.id;
      saveState(state);
      onSelect();
    });

    container.appendChild(dayBtn);
  });
}

function renderSelectedDay(state) {
  const planTitle = document.getElementById("planTitle");
  const exList = document.getElementById("exList");
  planTitle.textContent = "";
  exList.innerHTML = "";

  const day = WORKOUT_PLAN.schedule.find(d => d.id === state.selected);
  planTitle.textContent = day ? day.name : "";

  if (!day) return;

  if (!day.exercises || day.exercises.length === 0) {
    exList.appendChild(el("div", "exercise", "Rest or active recovery — light walk, stretch"));
    document.getElementById("notes").value = state.notes[day.id] || "";
    return;
  }

  day.exercises.forEach(ex => {
    const row = el("div", "exercise");
    const left = el("div", "left");
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = !!(state.progress[day.id] && state.progress[day.id][ex.id]);
    cb.addEventListener("change", () => {
      state.progress[day.id] = state.progress[day.id] || {};
      state.progress[day.id][ex.id] = cb.checked;
      saveState(state);
      renderDays(state, () => renderSelectedDay(state));
    });

    const details = el("div", "details");
    const name = el("div", "name", ex.name);
    const sets = el("div", "sets", ex.sets);
    sets.style.fontSize = "13px";
    sets.style.color = "#666";
    details.appendChild(name);
    details.appendChild(sets);

    left.appendChild(cb);
    left.appendChild(details);

    const right = el("div", "right");
    const markBtn = el("button", "btn", cb.checked ? "Done" : "Mark");
    markBtn.style.fontSize = "13px";
    markBtn.addEventListener("click", () => {
      cb.checked = !cb.checked;
      cb.dispatchEvent(new Event("change"));
      markBtn.textContent = cb.checked ? "Done" : "Mark";
    });

    row.appendChild(left);
    row.appendChild(markBtn);
    exList.appendChild(row);
  });

  // notes
  const notesEl = document.getElementById("notes");
  notesEl.value = state.notes[day.id] || "";
  notesEl.oninput = (e) => {
    state.notes[day.id] = e.target.value;
    saveState(state);
  };
}

/* Actions */
function markAllDone(state) {
  const day = WORKOUT_PLAN.schedule.find(d => d.id === state.selected);
  if (!day) return;
  state.progress[day.id] = state.progress[day.id] || {};
  day.exercises.forEach(ex => state.progress[day.id][ex.id] = true);
  saveState(state);
  renderDays(state, () => renderSelectedDay(state));
}
function clearDay(state) {
  const day = WORKOUT_PLAN.schedule.find(d => d.id === state.selected);
  if (!day) return;
  state.progress[day.id] = {};
  state.notes[day.id] = "";
  saveState(state);
  renderDays(state, () => renderSelectedDay(state));
}
function exportProgress(state) {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "minnies_progress.json";
  a.click();
  URL.revokeObjectURL(url);
}

/* Init */
(function init(){
  const state = loadState();

  // ensure structure
  state.progress = state.progress || {};
  state.notes = state.notes || {};
  if (!state.selected) state.selected = WORKOUT_PLAN.schedule[0].id;

  // render initial UI
  renderDays(state, () => renderSelectedDay(state));
  renderSelectedDay(state);

  // wire buttons
  document.getElementById("markAllBtn").addEventListener("click", () => { markAllDone(state); });
  document.getElementById("clearDayBtn").addEventListener("click", () => { if (confirm("Clear this day's progress and notes?")) clearDay(state); });
  document.getElementById("exportBtn").addEventListener("click", () => exportProgress(state));
  document.getElementById("resetBtn").addEventListener("click", () => { if (confirm("Reset all saved progress?")) { localStorage.removeItem(STORAGE_KEY); location.reload(); }});
})();
