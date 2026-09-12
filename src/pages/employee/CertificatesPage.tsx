import React, { useState } from 'react';
import { CertificatesView } from '../../components/employee/CertificatesView';
import { CertificateModal } from '../../components/employee/CertificateModal';
import { useAppData } from '../../context/AppDataContext';
import { Course } from '../../types';

export const EmployeeCertificatesPage: React.FC = () => {
  const { currentUser, courses } = useAppData();
  const [certificateCourse, setCertificateCourse] = useState<Course | null>(null);

  if (!currentUser) return null;

  return (
    <>
      <CertificatesView currentUser={currentUser} courses={courses} onOpenCertificate={(c) => setCertificateCourse(c)} />
      {certificateCourse && (
        <CertificateModal course={certificateCourse} currentUser={currentUser} onClose={() => setCertificateCourse(null)} />
      )}
    </>
  );
};
