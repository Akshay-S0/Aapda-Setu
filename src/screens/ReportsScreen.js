import React from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useData } from '../context/DataContext';

export default function ReportsScreen() {
  const { missions, drones } = useData();
  const insets = useSafeAreaInsets();

  const getDroneName = (id) => drones.find(d => d.id === id)?.name || id;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return '#10B981';
      case 'In Progress': return '#3B82F6';
      case 'Failed': return '#EF4444';
      case 'Pending': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const getMissionIcon = (type) => {
    switch (type) {
      case 'Reconnaissance': return 'eye';
      case 'Delivery': return 'cube';
      case 'Surveillance': return 'videocam';
      case 'Search & Rescue': return 'search';
      default: return 'document';
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.missionInfo}>
          <View style={styles.missionIconContainer}>
            <Ionicons name={getMissionIcon(item.type)} size={24} color="#fff" />
          </View>
          <View style={styles.missionDetails}>
            <Text style={styles.title}>{item.type}</Text>
            <Text style={styles.droneName}>VTOL Drone</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      
      <View style={styles.cardContent}>
        <View style={styles.metaRow}>
          <Ionicons name="time" size={16} color="#6B7280" />
          <Text style={styles.metaText}>{new Date(item.timestamp).toLocaleString()}</Text>
        </View>
        
        {item.notes && (
          <View style={styles.metaRow}>
            <Ionicons name="document-text" size={16} color="#6B7280" />
            <Text style={styles.metaText}>{item.notes}</Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerIcon}>
              <Ionicons name="document-text" size={28} color="#fff" />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>Mission Reports</Text>
              <Text style={styles.headerSubtitle}>VTOL Operations History</Text>
            </View>
            <View style={styles.missionCount}>
              <Text style={styles.countText}>{missions.length}</Text>
              <Text style={styles.countLabel}>Missions</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Summary Stats */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={styles.summaryGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="checkmark-circle" size={24} color="#fff" />
              <Text style={styles.summaryValue}>
                {missions.filter(m => m.status === 'Completed').length}
              </Text>
              <Text style={styles.summaryLabel}>Completed</Text>
            </LinearGradient>
          </View>

          <View style={styles.summaryCard}>
            <LinearGradient
              colors={['#3B82F6', '#1D4ED8']}
              style={styles.summaryGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="time" size={24} color="#fff" />
              <Text style={styles.summaryValue}>
                {missions.filter(m => m.status === 'In Progress').length}
              </Text>
              <Text style={styles.summaryLabel}>In Progress</Text>
            </LinearGradient>
          </View>

          <View style={styles.summaryCard}>
            <LinearGradient
              colors={['#F59E0B', '#D97706']}
              style={styles.summaryGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="hourglass" size={24} color="#fff" />
              <Text style={styles.summaryValue}>
                {missions.filter(m => m.status === 'Pending').length}
              </Text>
              <Text style={styles.summaryLabel}>Pending</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Mission List */}
        <View style={styles.missionsContainer}>
          <Text style={styles.sectionTitle}>Recent Missions</Text>
          <FlatList
            data={missions}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            scrollEnabled={false}
            contentContainerStyle={styles.missionsList}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
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
  headerIcon: {
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
  missionCount: {
    alignItems: 'center',
  },
  countText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
  },
  countLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  summaryContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 20,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryGradient: {
    padding: 16,
    alignItems: 'center',
    minHeight: 100,
    justifyContent: 'center',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
    marginTop: 4,
  },
  missionsContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  missionsList: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  missionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  missionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#667eea',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  missionDetails: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  droneName: {
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
  cardContent: {
    gap: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
    flex: 1,
  },
});



