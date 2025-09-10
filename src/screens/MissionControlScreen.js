import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useData } from '../context/DataContext';

const { width } = Dimensions.get('window');

export default function MissionControlScreen() {
  const { drones, assignMission } = useData();
  const insets = useSafeAreaInsets();
  const drone = drones[0]; // Single VTOL drone
  const [isMapExpanded, setIsMapExpanded] = useState(false);

  const initialRegion = useMemo(() => ({
    latitude: drone?.coordinate.latitude || 37.78825,
    longitude: drone?.coordinate.longitude || -122.4324,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  }), [drone]);

  const missionTypes = [
    { id: 'recon', name: 'Reconnaissance', icon: 'eye', color: '#3B82F6' },
    { id: 'delivery', name: 'Delivery', icon: 'cube', color: '#10B981' },
    { id: 'surveillance', name: 'Surveillance', icon: 'videocam', color: '#8B5CF6' },
    { id: 'search', name: 'Search & Rescue', icon: 'search', color: '#F59E0B' },
  ];

  const assignMissionType = (missionType) => {
    assignMission(drone.id, missionType.name, `Assigned via Mission Control - ${missionType.name}`);
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={['#667eea', '#764ba2', '#f093fb']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <View style={styles.droneIcon}>
              <Ionicons name="airplane" size={24} color="#fff" />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>Mission Control</Text>
              <Text style={styles.headerSubtitle}>VTOL Operations Center</Text>
            </View>
            <TouchableOpacity 
              style={styles.expandButton}
              onPress={() => setIsMapExpanded(!isMapExpanded)}
            >
              <Ionicons name={isMapExpanded ? "chevron-down" : "chevron-up"} size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Map Section */}
        <View style={[styles.mapContainer, { height: isMapExpanded ? 300 : 200 }]}>
          <MapView style={styles.map} initialRegion={initialRegion}>
            <Marker
              coordinate={drone.coordinate}
              title={drone.name}
              description={`${drone.status} • ${drone.battery}%`}
              pinColor="blue"
            />
          </MapView>
        </View>

        {/* Drone Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={styles.droneInfo}>
              <Text style={styles.droneName}>VTOL</Text>
              <Text style={styles.droneId}>ID: {drone.id}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(drone.status) }]}>
              <Text style={styles.statusText}>{drone.status}</Text>
            </View>
          </View>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="battery-half" size={20} color="#10B981" />
              <Text style={styles.statValue}>{drone.battery}%</Text>
              <Text style={styles.statLabel}>Battery</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="trending-up" size={20} color="#3B82F6" />
              <Text style={styles.statValue}>{drone.altitude}m</Text>
              <Text style={styles.statLabel}>Altitude</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="speedometer" size={20} color="#8B5CF6" />
              <Text style={styles.statValue}>{drone.speed}m/s</Text>
              <Text style={styles.statLabel}>Speed</Text>
            </View>
          </View>
        </View>

        {/* Mission Types */}
        <View style={styles.missionSection}>
          <Text style={styles.sectionTitle}>Mission Types</Text>
          <View style={styles.missionGrid}>
            {missionTypes.map((mission) => (
              <TouchableOpacity
                key={mission.id}
                style={styles.missionCard}
                onPress={() => assignMissionType(mission)}
              >
                <LinearGradient
                  colors={[mission.color, `${mission.color}CC`]}
                  style={styles.missionGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name={mission.icon} size={32} color="#fff" />
                  <Text style={styles.missionText}>{mission.name}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <LinearGradient
                colors={['#10B981', '#059669']}
                style={styles.actionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="play" size={24} color="#fff" />
                <Text style={styles.actionText}>Take Off</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <LinearGradient
                colors={['#EF4444', '#DC2626']}
                style={styles.actionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="stop" size={24} color="#fff" />
                <Text style={styles.actionText}>Emergency Land</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <LinearGradient
                colors={['#3B82F6', '#1D4ED8']}
                style={styles.actionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="home" size={24} color="#fff" />
                <Text style={styles.actionText}>Return Home</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStatusColor = (status) => {
  switch (status) {
    case 'Idle': return '#10B981';
    case 'Patrolling': return '#3B82F6';
    case 'On Mission': return '#8B5CF6';
    case 'Charging': return '#F59E0B';
    case 'Returning': return '#EF4444';
    default: return '#6B7280';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f4ff',
  },
  header: {
    margin: 16,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  droneIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  expandButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapContainer: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  map: {
    flex: 1,
  },
  statusCard: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  droneInfo: {
    flex: 1,
  },
  droneName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 4,
  },
  droneId: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginTop: 2,
  },
  missionSection: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  missionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  missionCard: {
    width: (width - 56) / 2,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  missionGradient: {
    padding: 20,
    alignItems: 'center',
    minHeight: 100,
    justifyContent: 'center',
  },
  missionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 8,
    textAlign: 'center',
  },
  actionsSection: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionGradient: {
    padding: 16,
    alignItems: 'center',
    minHeight: 80,
    justifyContent: 'center',
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 8,
    textAlign: 'center',
  },
});



