import React, { useEffect, useState } from "react";

// Single-file React app (TailwindCSS classes used)
// Features:
// - Shows a 6-day-per-week plan (Monday-Saturday) plus rest day
// - Exercise checkboxes and per-exercise notes
// - Track sets completed, quick timer, and progress per day
// - Persist to localStorage and export progress JSON

const WORKOUT_PLAN = {
  title: "4-Week Women's Weight Loss & Lower Body Focused Gym Plan",
  note:
    "Goal: Small calorie deficit + protein, 6x workouts/week, focus on glutes & legs",
  schedule: [
    {
      id: "monday",
      name: "Monday – Glutes & Hamstrings",
      exercises: [
        { id: "m1", name: "Barbell Hip Thrusts", sets: "4 x 12" },
        { id: "m2", name: "Romanian Deadlifts", sets: "4 x 10" },
        { id: "m3", name: "Cable Kickbacks (per leg)", sets: "3 x 15" },
        { id: "m4", name: "Lying Hamstring Curls", sets: "3 x 12" },
        { id: "m5", name: "Walking Lunges (20 steps)", sets: "3 x 20 steps" },
        { id: "m6", name: "Finisher: 10 min Stairmaster", sets: "10 min" },
      ],
    },
    {
      id: "tuesday",
      name: "Tuesday – Quads & Core",
      exercises: [
        { id: "t1", name: "Barbell Back Squats", sets: "4 x 10" },
        { id: "t2", name: "Leg Press", sets: "4 x 12" },
        { id: "t3", name: "Bulgarian Split Squats", sets: "3 x 10 per leg" },
        { id: "t4", name: "Leg Extensions", sets: "3 x 15" },
        { id: "t5", name: "Hanging Leg Raises", sets: "3 x 15" },
        { id: "t6", name: "Plank", sets: "3 x 1 min" },
      ],
    },
    {
      id: "wednesday",
      name: "Wednesday – Glute Isolation + Cardio",
      exercises: [
        { id: "w1", name: "Cable Glute Kickbacks", sets: "4 x 15" },
        { id: "w2", name: "Dumbbell Step-Ups", sets: "3 x 12 per leg" },
        { id: "w3", name: "Glute Bridge (bodyweight)", sets: "4 x 20" },
        { id: "w4", name: "Side-Lying Leg Raises", sets: "3 x 20 per side" },
        { id: "w5", name: "30 min incline treadmill walk or cycling", sets: "30 min" },
      ],
    },
    {
      id: "thursday",
      name: "Thursday – Upper Body & Core",
      exercises: [
        { id: "th1", name: "Dumbbell Shoulder Press", sets: "3 x 12" },
        { id: "th2", name: "Lat Pulldown", sets: "3 x 10" },
        { id: "th3", name: "Seated Row", sets: "3 x 12" },
        { id: "th4", name: "Dumbbell Bicep Curl", sets: "3 x 12" },
        { id: "th5", name: "Tricep Rope Pushdown", sets: "3 x 15" },
        { id: "th6", name: "Russian Twists", sets: "3 x 20" },
        { id: "th7", name: "Cable Crunch", sets: "3 x 15" },
      ],
    },
    {
      id: "friday",
      name: "Friday – Glute & Leg Power Day",
      exercises: [
        { id: "f1", name: "Barbell Hip Thrust (heavy)", sets: "5 x 8" },
        { id: "f2", name: "Sumo Deadlifts", sets: "4 x 10" },
        { id: "f3", name: "Curtsy Lunges", sets: "3 x 12 per leg" },
        { id: "f4", name: "Leg Press (wide stance)", sets: "3 x 12" },
        { id: "f5", name: "Abductor Machine", sets: "4 x 20" },
        { id: "f6", name: "Stairmaster – 10 min high intensity", sets: "10 min" },
      ],
    },
    {
      id: "saturday",
      name: "Saturday – Cardio & Abs",
      exercises: [
        { id: "s1", name: "20–30 minutes HIIT", sets: "20-30 min" },
        { id: "s2", name: "Hanging Knee Raises", sets: "3 x 15" },
        { id: "s3", name: "Cable Twists", sets: "3 x 20" },
        { id: "s4", name: "Mountain Climbers", sets: "3 x 30 sec" },
        { id: "s5", name: "Plank Variations", sets: "3 rounds" },
      ],
    },
    { id: "sunday", name: "Sunday – Rest or Active Recovery", exercises: [] },
  ],
};

const STORAGE_KEY = "gym_plan_progress_v1";

function useLocalStorageState(key, initial) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch (e) {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (e) {
      // ignore
    }
  }, [key, state]);
  return [state, setState];
}

export default function App() {
  const [data, setData] = useLocalStorageState(STORAGE_KEY, {
    plan: WORKOUT_PLAN,
    progress: {},
    selectedDay: WORKOUT_PLAN.schedule[0].id,
  });

  useEffect(() => {
    // Initialize progress structure if empty
    const p = { ...data.progress };
    WORKOUT_PLAN.schedule.forEach((day) => {
      if (!p[day.id]) {
        p[day.id] = {
          completedExercises: {},
          notes: "",
          date: null,
        };
      }
    });
    if (Object.keys(p).length !== Object.keys(data.progress || {}).length) {
      setData((prev) => ({ ...prev, progress: p }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectDay = (dayId) => setData((d) => ({ ...d, selectedDay: dayId }));

  const toggleExercise = (dayId, exerciseId) => {
    setData((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      const dayProg = next.progress[dayId] || { completedExercises: {}, notes: "" };
      dayProg.completedExercises[exerciseId] = !dayProg.completedExercises[exerciseId];
      if (dayProg.completedExercises[exerciseId]) dayProg.date = new Date().toISOString();
      next.progress[dayId] = dayProg;
      return next;
    });
  };

  const setNote = (dayId, text) => {
    setData((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      next.progress[dayId] = next.progress[dayId] || { completedExercises: {}, notes: "" };
      next.progress[dayId].notes = text;
      return next;
    });
  };

  const completeAll = (dayId) => {
    setData((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      const day = WORKOUT_PLAN.schedule.find((d) => d.id === dayId);
      const comp = {};
      day.exercises.forEach((e) => (comp[e.id] = true));
      next.progress[dayId] = next.progress[dayId] || { completedExercises: {}, notes: "" };
      next.progress[dayId].completedExercises = comp;
      next.progress[dayId].date = new Date().toISOString();
      return next;
    });
  };

  const resetDay = (dayId) => {
    setData((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      next.progress[dayId] = { completedExercises: {}, notes: "", date: null };
      return next;
    });
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "gym_progress.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const selectedDayObj = WORKOUT_PLAN.schedule.find((d) => d.id === data.selectedDay);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <header className="max-w-4xl mx-auto mb-4">
        <h1 className="text-2xl font-bold">{WORKOUT_PLAN.title}</h1>
        <p className="text-sm text-gray-300 mt-1">{WORKOUT_PLAN.note}</p>
        <div className="mt-3 flex gap-2">
          <button
            onClick={exportJSON}
            className="px-3 py-1 bg-green-600 rounded hover:bg-green-500 text-white text-sm"
          >
            Export progress
          </button>
          <button
            onClick={() => {
              localStorage.removeItem(STORAGE_KEY);
              window.location.reload();
            }}
            className="px-3 py-1 bg-red-600 rounded hover:bg-red-500 text-white text-sm"
          >
            Reset app
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Sidebar: Days */}
        <aside className="md:col-span-1 bg-gray-800 rounded p-3">
          <h2 className="font-semibold mb-2">Weekly Schedule</h2>
          <ul className="space-y-2">
            {WORKOUT_PLAN.schedule.map((day) => {
              const prog = data.progress[day.id] || { completedExercises: {} };
              const completedCount = Object.values(prog.completedExercises || {}).filter(Boolean)
                .length;
              const total = day.exercises.length || 0;
              return (
                <li
                  key={day.id}
                  onClick={() => selectDay(day.id)}
                  className={`p-2 rounded cursor-pointer hover:bg-gray-700 ${
                    data.selectedDay === day.id ? "bg-gray-700" : ""
                  }`}
                >
                  <div className="flex justify-between">
                    <div>
                      <div className="font-medium">{day.name}</div>
                      <div className="text-xs text-gray-400">{total} exercises</div>
                    </div>
                    <div className="text-sm text-green-400">{completedCount}/{total}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Content: Selected day */}
        <section className="md:col-span-2 bg-gray-800 rounded p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold">{selectedDayObj.name}</h3>
              <p className="text-sm text-gray-400 mt-1">Tap exercises as you finish them.</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => completeAll(selectedDayObj.id)}
                className="px-2 py-1 bg-blue-600 rounded text-sm"
              >
                Complete All
              </button>
              <button
                onClick={() => resetDay(selectedDayObj.id)}
                className="px-2 py-1 bg-yellow-600 rounded text-sm"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {selectedDayObj.exercises.length === 0 ? (
              <div className="p-4 bg-gray-700 rounded">Rest or active recovery day — stretch & hydrate.</div>
            ) : (
              selectedDayObj.exercises.map((ex) => (
                <ExerciseRow
                  key={ex.id}
                  dayId={selectedDayObj.id}
                  exercise={ex}
                  progress={data.progress[selectedDayObj.id] || { completedExercises: {} }}
                  onToggle={() => toggleExercise(selectedDayObj.id, ex.id)}
                />
              ))
            )}
          </div>

          <div className="mt-6">
            <h4 className="font-semibold">Notes</h4>
            <textarea
              value={(data.progress[selectedDayObj.id] && data.progress[selectedDayObj.id].notes) || ""}
              onChange={(e) => setNote(selectedDayObj.id, e.target.value)}
              placeholder="Add workout notes, weights used, feelings, soreness, etc."
              className="w-full mt-2 p-2 bg-gray-900 border border-gray-700 rounded h-28"
            />
            <div className="mt-2 text-sm text-gray-400">Saved automatically to your browser.</div>
          </div>

          <div className="mt-6 flex gap-3 items-center">
            <QuickTimer />
            <div className="text-sm text-gray-300">Use the timer for rests or HIIT intervals.</div>
          </div>
        </section>
      </main>

      <footer className="max-w-4xl mx-auto mt-6 text-center text-xs text-gray-500">Made with ❤️ — Personal trainer mode</footer>
    </div>
  );
}

function ExerciseRow({ exercise, progress, dayId, onToggle }) {
  const completed = (progress.completedExercises || {})[exercise.id];
  return (
    <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={!!completed}
          onChange={onToggle}
          className="w-5 h-5 rounded focus:ring-0"
        />
        <div>
          <div className={`font-medium ${completed ? "line-through text-gray-400" : ""}`}>{exercise.name}</div>
          <div className="text-xs text-gray-300">{exercise.sets}</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onToggle}
          className={`px-2 py-1 rounded text-sm ${completed ? "bg-green-600" : "bg-gray-600"}`}
        >
          {completed ? "Done" : "Mark"}
        </button>
      </div>
    </div>
  );
}

function QuickTimer() {
  const [time, setTime] = useState(60);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setTime((t) => (t > 0 ? t - 1 : 0)), 1000);
    if (time === 0) setRunning(false);
    return () => clearInterval(id);
  }, [running, time]);

  const start = (s) => {
    setTime(s);
    setRunning(true);
  };

  return (
    <div className="bg-gray-700 p-3 rounded flex items-center gap-3">
      <div className="text-2xl font-mono">{formatTime(time)}</div>
      <div className="flex gap-2">
        <button onClick={() => start(60)} className="px-2 py-1 bg-blue-600 rounded text-sm">60s</button>
        <button onClick={() => start(30)} className="px-2 py-1 bg-blue-600 rounded text-sm">30s</button>
        <button onClick={() => setRunning((r) => !r)} className="px-2 py-1 bg-yellow-600 rounded text-sm">
          {running ? "Pause" : "Start"}
        </button>
        <button onClick={() => { setRunning(false); setTime(60); }} className="px-2 py-1 bg-red-600 rounded text-sm">Reset</button>
      </div>
    </div>
  );
}

function formatTime(sec) {
  const m = Math.floor(sec / 60)
    .toString()
    .padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
