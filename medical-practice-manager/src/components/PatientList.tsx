import React, { useEffect, useState } from 'react';
import { Search, Download, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, Input, Button } from './ui';
import type { Patient, SearchFilters, SortField } from '../types';
import { patientService } from '../services/patientService';
import { exportService } from '../services/exportService';
import { format } from 'date-fns';

interface PatientListProps {
  onPatientClick: (patientId: string) => void;
}

export const PatientList: React.FC<PatientListProps> = ({ onPatientClick }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: '',
    sortField: 'lastName',
    sortOrder: 'asc',
  });

  useEffect(() => {
    loadPatients();
  }, [filters]);

  const loadPatients = async () => {
    setLoading(true);
    try {
      const results = await patientService.searchPatients(filters);
      setPatients(results);
    } catch (error) {
      console.error('Error loading patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: SortField) => {
    setFilters((prev) => ({
      ...prev,
      sortField: field,
      sortOrder:
        prev.sortField === field && prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleExport = async () => {
    await exportService.exportPatientsToCSV(patients);
  };

  const SortIcon: React.FC<{ field: SortField }> = ({ field }) => {
    if (filters.sortField !== field) return null;
    return filters.sortOrder === 'asc' ? (
      <ChevronUp size={16} />
    ) : (
      <ChevronDown size={16} />
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Patients
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {patients.length} patient{patients.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <Button onClick={handleExport} variant="secondary" size="sm">
          <Download size={16} className="mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <Input
                  type="text"
                  placeholder="Search patients by name, email, phone, or DOB..."
                  value={filters.searchTerm}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, searchTerm: e.target.value }))
                  }
                  className="pl-10"
                  fullWidth
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-gray-400" />
              <label className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <input
                  type="checkbox"
                  checked={filters.recentVisitsOnly || false}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      recentVisitsOnly: e.target.checked,
                    }))
                  }
                  className="rounded"
                />
                <span>Recent visits only</span>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patient Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('lastName')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Name</span>
                    <SortIcon field="lastName" />
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('dateOfBirth')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Date of Birth</span>
                    <SortIcon field="dateOfBirth" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Insurance
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('updatedAt')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Last Visit</span>
                    <SortIcon field="updatedAt" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    Loading patients...
                  </td>
                </tr>
              ) : patients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    No patients found
                  </td>
                </tr>
              ) : (
                patients.map((patient) => (
                  <tr
                    key={patient.id}
                    onClick={() => onPatientClick(patient.id)}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mr-3">
                          <span className="text-primary-600 dark:text-primary-400 font-semibold">
                            {patient.firstName[0]}
                            {patient.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {patient.firstName} {patient.lastName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {patient.gender}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {format(new Date(patient.dateOfBirth), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-100">
                        {patient.email}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {patient.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {patient.insurance || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {format(new Date(patient.updatedAt), 'MMM dd, yyyy')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
