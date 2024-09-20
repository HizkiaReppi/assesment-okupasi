/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { assessmentApi, Assessment } from '../api/assessment-api';

interface AssessmentContextType {
  assessments: Assessment[];
  totalPages: number;
  refreshAssessments: () => void;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(
  undefined,
);

export const useAssessments = () => {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error('useAssessments must be used within an AssessmentProvider');
  }
  return context;
};

interface AssessmentProviderProps {
  children: React.ReactNode;
}

export const AssessmentProvider: React.FC<AssessmentProviderProps> = ({
  children,
}) => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAssessments = async () => {
    try {
      const fetchedAssessments = await assessmentApi.getAll();
      setAssessments(fetchedAssessments);
      setTotalPages(Math.ceil(fetchedAssessments.length / 10));
    } catch (error) {
      console.error('Failed to fetch assessments:', error);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  return (
    <AssessmentContext.Provider
      value={{ assessments, totalPages, refreshAssessments: fetchAssessments }}
    >
      {children}
    </AssessmentContext.Provider>
  );
};
