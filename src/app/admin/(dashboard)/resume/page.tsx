import React from 'react';
import ResumeCVEditor from '@/components/admin/resume/ResumeCVEditor';
import ResumeEducationEditor from '@/components/admin/resume/ResumeEducationEditor';
import ResumeExperienceEditor from '@/components/admin/resume/ResumeExperienceEditor';
import ResumeAwardsEditor from '@/components/admin/resume/ResumeAwardsEditor';

export default function ResumeAdminPage() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Resume Management</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Manage your Education, Experience, and Awards sections dynamically. 
        </p>
      </div>

      <div className="grid gap-8">
        {/* CV Editor Section */}
        <ResumeCVEditor />

        {/* Education Section */}
        <ResumeEducationEditor />

        {/* Experience Section */}
        <ResumeExperienceEditor />

        {/* Awards Section */}
        <ResumeAwardsEditor />
      </div>
    </div>
  );
}
