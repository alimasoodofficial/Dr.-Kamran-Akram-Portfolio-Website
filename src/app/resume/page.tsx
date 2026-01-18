"use client";
import ResumeHeader from '@/components/resume/ResumeHeader';
import ResumeAbout from '@/components/resume/ResumeAbout';
import ResumeExperience from '@/components/resume/ResumeExperience';
import ResumeEducation from '@/components/resume/ResumeEducation';
import ResumeAwards from '@/components/resume/ResumeAwards';

function ResumePage() {
  return (
    <div className="min-h-screen pb-20">
      
      

       <div className='pt-28 md:pt-36'></div>

      <main className="max-w-5xl mx-auto px-6 space-y-20">
         <ResumeHeader />
         <ResumeAbout />
         <ResumeExperience />
         <ResumeEducation />
         <ResumeAwards />
      </main>
      
    </div>
  )
}

export default ResumePage
