import React, { useEffect, useState } from 'react';
import { Users, Calendar, Activity, TrendingUp } from 'lucide-react';
import { Card, CardHeader, CardContent } from './ui';
import type { Patient, Visit } from '../types';
import { patientService } from '../services/patientService';
import { visitService } from '../services/visitService';
import { format, startOfWeek, startOfMonth } from 'date-fns';

interface DashboardProps {
  onPatientClick: (patientId: string) => void;
  onNewVisit: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onPatientClick, onNewVisit }) => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayPatients: 0,
    weekPatients: 0,
    monthPatients: 0,
  });
  const [recentPatients, setRecentPatients] = useState<Patient[]>([]);
  const [todayVisits, setTodayVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [allPatients, allVisits, recent] = await Promise.all([
        patientService.getAllPatients(),
        visitService.getAllVisits(),
        patientService.getRecentPatients(5),
      ]);

      const today = new Date();
      const weekStart = startOfWeek(today);
      const monthStart = startOfMonth(today);

      const todayVisitsList = allVisits.filter(
        (v) =>
          new Date(v.visitDate).toDateString() === today.toDateString()
      );

      const weekVisits = allVisits.filter(
        (v) => new Date(v.visitDate) >= weekStart
      );

      const monthVisits = allVisits.filter(
        (v) => new Date(v.visitDate) >= monthStart
      );

      // Get unique patient IDs
      const todayPatientIds = new Set(todayVisitsList.map((v) => v.patientId));
      const weekPatientIds = new Set(weekVisits.map((v) => v.patientId));
      const monthPatientIds = new Set(monthVisits.map((v) => v.patientId));

      setStats({
        totalPatients: allPatients.length,
        todayPatients: todayPatientIds.size,
        weekPatients: weekPatientIds.size,
        monthPatients: monthPatientIds.size,
      });

      setRecentPatients(recent);
      setTodayVisits(todayVisitsList);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 dark:text-gray-400">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Welcome back! Here's an overview of your practice.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Today's Patients
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                {stats.todayPatients}
              </p>
            </div>
            <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-full">
              <Calendar className="text-primary-600 dark:text-primary-400" size={24} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                This Week
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                {stats.weekPatients}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <Activity className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                This Month
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                {stats.monthPatients}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <TrendingUp className="text-green-600 dark:text-green-400" size={24} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Patients
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                {stats.totalPatients}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
              <Users className="text-purple-600 dark:text-purple-400" size={24} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Visits */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Today's Visits
            </h2>
          </CardHeader>
          <CardContent>
            {todayVisits.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="mx-auto text-gray-400 dark:text-gray-600 mb-2" size={48} />
                <p className="text-gray-500 dark:text-gray-400">No visits today</p>
                <button
                  onClick={onNewVisit}
                  className="mt-4 text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Record a visit
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {todayVisits.slice(0, 5).map((visit) => (
                  <TodayVisitItem key={visit.id} visit={visit} />
                ))}
                {todayVisits.length > 5 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center pt-2">
                    And {todayVisits.length - 5} more...
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recently Viewed Patients */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Recent Patients
            </h2>
          </CardHeader>
          <CardContent>
            {recentPatients.length === 0 ? (
              <div className="text-center py-8">
                <Users className="mx-auto text-gray-400 dark:text-gray-600 mb-2" size={48} />
                <p className="text-gray-500 dark:text-gray-400">No patients yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentPatients.map((patient) => (
                  <div
                    key={patient.id}
                    onClick={() => onPatientClick(patient.id)}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 dark:text-primary-400 font-semibold">
                          {patient.firstName[0]}
                          {patient.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {patient.firstName} {patient.lastName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {format(new Date(patient.dateOfBirth), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {patient.phone}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const TodayVisitItem: React.FC<{ visit: Visit }> = ({ visit }) => {
  const [patientName, setPatientName] = useState<string>('Loading...');

  useEffect(() => {
    const loadPatient = async () => {
      const patient = await patientService.getPatientById(visit.patientId);
      if (patient) {
        setPatientName(`${patient.firstName} ${patient.lastName}`);
      }
    };
    loadPatient();
  }, [visit.patientId]);

  return (
    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="font-medium text-gray-900 dark:text-gray-100">{patientName}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {visit.chiefComplaint}
          </p>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {format(new Date(visit.visitDate), 'HH:mm')}
        </span>
      </div>
    </div>
  );
};
