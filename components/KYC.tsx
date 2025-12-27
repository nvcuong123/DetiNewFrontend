
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Shield, Upload, CheckCircle2, AlertCircle, ChevronRight, User, Globe, Calendar, CreditCard, RefreshCw } from 'lucide-react';

interface KYCProps {
  user: UserProfile;
  onUpdateStatus: (status: UserProfile['kycStatus']) => void;
}

export const KYC: React.FC<KYCProps> = ({ user, onUpdateStatus }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Step 1: Info
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    country: '',
    dob: ''
  });

  // Step 2: Documents (Mock)
  const [docs, setDocs] = useState<{ front: File | null; back: File | null; selfie: File | null }>({
    front: null,
    back: null,
    selfie: null
  });

  const handleFileUpload = (type: 'front' | 'back' | 'selfie', e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
       setDocs({ ...docs, [type]: e.target.files[0] });
    }
  };

  const submitKYC = () => {
     setLoading(true);
     // Simulate processing
     setTimeout(() => {
        setLoading(false);
        setStep(3); // Go to pending/success view
        onUpdateStatus('Pending');
     }, 2000);
  };

  if (user.kycStatus === 'Verified') {
     return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
           <div className="w-24 h-24 bg-deti-success/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(74,222,128,0.3)] animate-in zoom-in">
              <CheckCircle2 className="w-12 h-12 text-deti-success" />
           </div>
           <h2 className="text-3xl font-semibold tracking-tighter text-white mb-2">Account Verified</h2>
           <p className="text-deti-subtext max-w-md mx-auto mb-8">
              Congratulations! Your identity has been verified. You now have full access to higher withdrawal limits, fiat deposits, and P2P trading.
           </p>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
              <FeatureCard icon={<Globe />} title="Global Access" desc="Trade from 180+ countries" />
              <FeatureCard icon={<CreditCard />} title="Fiat Gateway" desc="Unlimited deposits" />
              <FeatureCard icon={<Shield />} title="Pro Security" desc="Enhanced protection" />
           </div>
        </div>
     );
  }

  if (user.kycStatus === 'Pending' && step !== 3) {
      // If user comes back while pending
      return <PendingView />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-10 space-y-8">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
             <h1 className="text-3xl md:text-4xl font-semibold tracking-tighter text-white flex items-center gap-3">
                <Shield className="text-deti-primary w-8 h-8" /> Identity Verification (KYC)
             </h1>
             <p className="text-deti-subtext mt-1">Complete verification to unlock full platform features.</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-deti-card border border-deti-border rounded-full text-sm">
             <span className={`w-2.5 h-2.5 rounded-full ${user.kycStatus === 'Unverified' ? 'bg-gray-500' : 'bg-yellow-500'}`}></span>
             <span className="text-deti-text font-bold">Status: {user.kycStatus}</span>
          </div>
       </div>

       {/* Stepper */}
       <div className="w-full bg-deti-card border border-deti-border rounded-2xl p-6 lg:p-8 shadow-lg">
          {step === 3 ? <PendingView /> : (
            <>
              {/* Progress Bar */}
              <div className="flex items-center mb-10 relative">
                 <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-deti-border -z-0"></div>
                 <div 
                   className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-deti-primary transition-all duration-500 -z-0" 
                   style={{ width: step === 1 ? '50%' : '100%' }}
                 ></div>
                 
                 <div className="flex justify-between w-full z-10">
                    <StepIndicator num={1} title="Personal Info" current={step} />
                    <StepIndicator num={2} title="Document Upload" current={step} />
                    <StepIndicator num={3} title="Review" current={step} />
                 </div>
              </div>

              {step === 1 && (
                 <div className="space-y-6 animate-in slide-in-from-right-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <InputGroup 
                          label="First Name" 
                          icon={<User size={16} />} 
                          value={formData.firstName} 
                          onChange={(v: string) => setFormData({...formData, firstName: v})} 
                       />
                       <InputGroup 
                          label="Last Name" 
                          icon={<User size={16} />} 
                          value={formData.lastName} 
                          onChange={(v: string) => setFormData({...formData, lastName: v})} 
                       />
                       <InputGroup 
                          label="Date of Birth" 
                          icon={<Calendar size={16} />} 
                          type="date"
                          value={formData.dob} 
                          onChange={(v: string) => setFormData({...formData, dob: v})} 
                       />
                       <div className="space-y-1">
                          <label className="text-xs font-bold text-deti-subtext uppercase ml-1">Country / Region</label>
                          <div className="relative">
                             <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-deti-subtext" />
                             <select 
                               className="w-full bg-deti-bg border border-deti-border rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:border-deti-primary outline-none appearance-none"
                               value={formData.country}
                               onChange={(e) => setFormData({...formData, country: e.target.value})}
                             >
                                <option value="">Select Country</option>
                                <option value="US">United States</option>
                                <option value="UK">United Kingdom</option>
                                <option value="VN">Vietnam</option>
                                <option value="AE">United Arab Emirates</option>
                             </select>
                             <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-deti-subtext rotate-90" />
                          </div>
                       </div>
                    </div>
                    
                    <div className="flex justify-end pt-4">
                       <button 
                         disabled={!formData.firstName || !formData.lastName || !formData.country}
                         onClick={() => setStep(2)}
                         className="px-8 py-3 bg-deti-primary text-white rounded-xl font-bold hover:bg-deti-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                       >
                          Next Step <ChevronRight size={18} />
                       </button>
                    </div>
                 </div>
              )}

              {step === 2 && (
                 <div className="space-y-8 animate-in slide-in-from-right-4">
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex gap-3 text-yellow-500 text-sm">
                       <AlertCircle className="shrink-0" />
                       <p>Please ensure all documents are clearly visible, valid, and not expired. We accept Passport, ID Card, or Driver's License.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       <UploadBox label="Front of ID" file={docs.front} onChange={(e) => handleFileUpload('front', e)} />
                       <UploadBox label="Back of ID" file={docs.back} onChange={(e) => handleFileUpload('back', e)} />
                       <UploadBox label="Selfie with ID" file={docs.selfie} onChange={(e) => handleFileUpload('selfie', e)} />
                    </div>

                    <div className="flex justify-between pt-4">
                       <button 
                         onClick={() => setStep(1)}
                         className="px-8 py-3 bg-deti-bg border border-deti-border text-white rounded-xl font-bold hover:bg-white/5 transition-all"
                       >
                          Back
                       </button>
                       <button 
                         disabled={!docs.front || !docs.back || !docs.selfie || loading}
                         onClick={submitKYC}
                         className="px-8 py-3 bg-gradient-brand text-white rounded-xl font-bold shadow-glow hover:shadow-glow-gold disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                       >
                          {loading ? <RefreshCw className="animate-spin" /> : 'Submit Verification'}
                       </button>
                    </div>
                 </div>
              )}
            </>
          )}
       </div>
    </div>
  );
};

// Sub-components

interface StepIndicatorProps {
  num: number;
  title: string;
  current: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ num, title, current }) => (
   <div className={`flex flex-col items-center gap-2 relative transition-colors duration-300 ${current >= num ? 'text-deti-primary' : 'text-deti-subtext'}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all duration-300 bg-deti-card ${current >= num ? 'border-deti-primary bg-deti-primary text-white' : 'border-deti-border'}`}>
         {current > num ? <CheckCircle2 size={16} /> : num}
      </div>
      <span className="text-xs font-bold uppercase tracking-wide">{title}</span>
   </div>
);

interface InputGroupProps {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (val: string) => void;
  type?: string;
}

const InputGroup: React.FC<InputGroupProps> = ({ label, icon, value, onChange, type = "text" }) => (
   <div className="space-y-1">
      <label className="text-xs font-bold text-deti-subtext uppercase ml-1">{label}</label>
      <div className="relative group">
         <div className="absolute left-4 top-1/2 -translate-y-1/2 text-deti-subtext group-focus-within:text-deti-primary transition-colors">
            {icon}
         </div>
         <input 
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-deti-bg border border-deti-border rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:border-deti-primary outline-none transition-all"
         />
      </div>
   </div>
);

interface UploadBoxProps {
  label: string;
  file: File | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const UploadBox: React.FC<UploadBoxProps> = ({ label, file, onChange }) => (
   <div className="border-2 border-dashed border-deti-border hover:border-deti-primary rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-colors cursor-pointer relative bg-deti-bg/30 hover:bg-deti-bg/50">
      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={onChange} accept="image/*" />
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${file ? 'bg-deti-success/20 text-deti-success' : 'bg-deti-card text-deti-subtext'}`}>
         {file ? <CheckCircle2 /> : <Upload />}
      </div>
      <span className="font-bold text-sm text-white mb-1">{file ? file.name : label}</span>
      <span className="text-xs text-deti-subtext">{file ? 'Click to change' : 'PNG, JPG up to 5MB'}</span>
   </div>
);

const PendingView: React.FC = () => (
   <div className="text-center py-12 animate-in zoom-in">
      <div className="relative w-24 h-24 mx-auto mb-6">
         <div className="absolute inset-0 border-4 border-deti-border rounded-full"></div>
         <div className="absolute inset-0 border-4 border-deti-primary rounded-full border-t-transparent animate-spin"></div>
         <div className="absolute inset-0 flex items-center justify-center">
            <Shield className="w-8 h-8 text-deti-primary" />
         </div>
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Verification In Progress</h2>
      <p className="text-deti-subtext max-w-sm mx-auto">
         We are reviewing your documents. This process typically takes 5-10 minutes. You will be notified once completed.
      </p>
   </div>
);

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, desc }) => (
   <div className="bg-deti-card p-4 rounded-xl border border-deti-border text-left">
      <div className="text-deti-primary mb-2">{icon}</div>
      <div className="font-bold text-white text-sm">{title}</div>
      <div className="text-xs text-deti-subtext">{desc}</div>
   </div>
);
