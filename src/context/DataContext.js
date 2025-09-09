import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';

const DataContext = createContext(null);

const initialDrones = [
  { 
    id: 'VTOL-001', 
    name: 'VTOL', 
    status: 'Idle', 
    battery: 85, 
    altitude: 0, 
    speed: 0, 
    coordinate: { latitude: 37.78825, longitude: -122.4324 },
    signal: 'Strong',
    temperature: 22,
    windSpeed: 8,
    flightTime: 0
  },
];

const initialMissions = [
  { id: 'MS-1001', droneId: 'VTOL-001', type: 'Surveillance', status: 'Completed', timestamp: new Date().toISOString(), notes: 'Perimeter sweep' },
  { id: 'MS-1002', droneId: 'VTOL-001', type: 'Delivery', status: 'Completed', timestamp: new Date().toISOString(), notes: 'Delivered meds' },
];

export function DataProvider({ children }) {
  const [drones, setDrones] = useState(initialDrones);
  const [missions, setMissions] = useState(initialMissions);

  const updateDrone = useCallback((droneId, updates) => {
    setDrones(prev => prev.map(d => (d.id === droneId ? { ...d, ...updates } : d)));
  }, []);

  const assignMission = useCallback((droneId, missionType, notes) => {
    const missionId = `MS-${Math.floor(1000 + Math.random() * 9000)}`;
    const newMission = {
      id: missionId,
      droneId,
      type: missionType,
      status: 'In Progress',
      timestamp: new Date().toISOString(),
      notes: notes || '',
    };
    setMissions(prev => [newMission, ...prev]);
    updateDrone(droneId, { status: 'On Mission' });
  }, [updateDrone]);

  const value = useMemo(() => ({
    drones,
    missions,
    updateDrone,
    assignMission,
  }), [drones, missions, updateDrone, assignMission]);

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within a DataProvider');
  return ctx;
}



