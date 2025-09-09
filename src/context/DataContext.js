import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';

const DataContext = createContext(null);

const initialDrones = [
  { id: 'DR-001', name: 'Falcon One', status: 'Idle', battery: 82, altitude: 0, speed: 0, coordinate: { latitude: 37.78825, longitude: -122.4324 } },
  { id: 'DR-002', name: 'Eagle Scout', status: 'Patrolling', battery: 64, altitude: 120, speed: 14, coordinate: { latitude: 37.78925, longitude: -122.4314 } },
  { id: 'DR-003', name: 'Hawk Eye', status: 'Charging', battery: 32, altitude: 0, speed: 0, coordinate: { latitude: 37.78725, longitude: -122.4334 } },
];

const initialMissions = [
  { id: 'MS-1001', droneId: 'DR-002', type: 'Surveillance', status: 'Completed', timestamp: new Date().toISOString(), notes: 'Perimeter sweep' },
  { id: 'MS-1002', droneId: 'DR-001', type: 'Delivery', status: 'Completed', timestamp: new Date().toISOString(), notes: 'Delivered meds' },
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



