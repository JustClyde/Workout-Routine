import React, { useState, useEffect } from 'react';

const workouts = [
  { day: 'Day 1: Glutes & Hamstrings', exercises: ['Barbell Hip Thrusts', 'Romanian Deadlifts', 'Cable Kickbacks', 'Glute Bridges'] },
  { day: 'Day 2: Quads & Calves', exercises: ['Squats', 'Leg Press', 'Walking Lunges', 'Standing Calf Raises'] },
  { day: 'Day 3: Core & Cardio', exercises: ['Plank', 'Russian Twists', 'Mountain Climbers', 'Bicycle Crunches'] },
  { day: 'Day 4: Glute Isolation', exercises: ['Hip Abductions', 'Step-Ups', 'Donkey Kicks', 'Sumo Deadlifts'] },
  { day: 'Day 5: Lower Body Power', exercises: ['Bulgarian Split Squats', 'Front Squats', 'Jump Squats', 'Kettlebell Swings'] },
  { day: 'Day 6: Active Recovery', exercises: ['Light Jog', 'Stretching', 'Foam Rolling'] },
];

export default function App() {
  const [progress, setProgress] = useState(() => JSON.parse(localStorage.getItem('progress') || '{}'));
  const [notes, setNotes] = useState(() => JSON.parse(localStorage.getItem('notes') || '{}'));

  useEffect(() => {
    localStorage.setItem('progress', JSON.stringify(progress));
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [progress, notes]);

  const toggleExercise = (day, ex) => {
    setProgress(prev => ({ ...prev, [day]: { ...prev[day], [ex]: !prev[day]?.[ex] } }));
  };

  const reset = () => {
    if (confirm('Reset all progress?')) {
      setProgress({});
      setNotes({});
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-pink-200 p-6">
      <h1 className="text-3xl font-bold text-center text-pink-700 mb-6">Minnie's Workout Routine 💪</h1>
      <div className="flex justify-center mb-6">
        <button onClick={reset} className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg shadow">
          Reset Progress
        </button>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {workouts.map(({ day, exercises }) => (
          <div key={day} className="bg-white rounded-2xl shadow-lg p-4">
            <h2 className="text-xl font-semibold text-pink-600 mb-2">{day}</h2>
            <ul className="space-y-2">
              {exercises.map(ex => (
                <li key={ex} className="flex items-center">
                  <input type="checkbox" checked={progress[day]?.[ex] || false} onChange={() => toggleExercise(day, ex)} className="mr-2 w-5 h-5 text-pink-500" />
                  <span>{ex}</span>
                </li>
              ))}
            </ul>
            <textarea value={notes[day] || ''} onChange={e => setNotes(p => ({ ...p, [day]: e.target.value }))} placeholder="Notes..." className="w-full mt-3 p-2 border rounded-lg text-sm focus:ring-2 focus:ring-pink-400"></textarea>
          </div>
        ))}
      </div>
      <p className="text-center text-gray-600 mt-8">Progress auto-saves locally 💾</p>
    </div>
  );
}
