
import React, { useState } from 'react';
import { Upload, Building2, FileText, CheckCircle2, ChevronRight, RefreshCw, X, Image as ImageIcon, Server, Leaf, Globe, DollarSign, Info } from 'lucide-react';

interface MintRWAProps {
  onBack: () => void;
}

export const MintRWA: React.FC<MintRWAProps> = ({ onBack }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Form State
  const [assetType, setAssetType] = useState('Real Estate');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [valuation, setValuation] = useState('');
  const [supply, setSupply] = useState('');
  const [apy, setApy] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleMint = () => {
    setLoading(true);
    // Simulate minting process
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 3000);
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 animate-in zoom-in-95">
        <div className="w-24 h-24 bg-deti-success/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(74,222,128,0.3)]">
           <CheckCircle2 className="w-12 h-12 text-deti-success" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Asset Tokenized Successfully!</h2>
        <p className="text-deti-subtext mb-8 text-center max-w-md">
           Your RWA <strong>"{title}"</strong> has been minted on the blockchain. Legal documents are being verified by our compliance team (approx. 24h).
        </p>
        <div className="flex gap-4">
           <button onClick={onBack} className="px-6 py-3 bg-deti-card border border-deti-border text-white rounded-xl font-bold hover:bg-white/5 transition-all">
              Return to Market
           </button>
           <button className="px-6 py-3 bg-deti-primary text-white rounded-xl font-bold shadow-glow hover:shadow-glow-gold transition-all">
              View Asset Dashboard
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto h-full flex flex-col">
       {/* Header */}
       <div className="flex items-center gap-4 mb-8">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-white/10 text-deti-subtext hover:text-white transition-colors">
             <ChevronRight className="rotate-180 w-6 h-6" />
          </button>
          <div>
             <h1 className="text-2xl md:text-3xl font-bold text-white">Tokenize Real World Asset</h1>
             <p className="text-sm text-deti-subtext">Convert physical assets into digital tokens on the blockchain.</p>
          </div>
       </div>

       <div className="grid lg:grid-cols-12 gap-8 h-full pb-8">
          
          {/* LEFT: Form */}
          <div className="lg:col-span-7 space-y-6 overflow-y-auto custom-scrollbar pr-2">
             
             {/* Asset Type Selector */}
             <div className="bg-deti-card border border-deti-border rounded-2xl p-6">
                <label className="text-xs font-bold text-deti-subtext uppercase mb-4 block">Select Asset Class</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                   {['Real Estate', 'Data Center', 'Carbon Credit', 'Infrastructure'].map(type => (
                      <button 
                        key={type}
                        onClick={() => setAssetType(type)}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${assetType === type ? 'border-deti-primary bg-deti-primary/10 text-white' : 'border-deti-border bg-deti-bg text-deti-subtext hover:border-deti-subtext'}`}
                      >
                         {type === 'Real Estate' && <Building2 className="mb-2 w-6 h-6" />}
                         {type === 'Data Center' && <Server className="mb-2 w-6 h-6" />}
                         {type === 'Carbon Credit' && <Leaf className="mb-2 w-6 h-6" />}
                         {type === 'Infrastructure' && <Globe className="mb-2 w-6 h-6" />}
                         <span className="text-xs font-bold">{type}</span>
                      </button>
                   ))}
                </div>
             </div>

             {/* Basic Info */}
             <div className="bg-deti-card border border-deti-border rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                   <Info size={18} className="text-deti-primary" /> Asset Details
                </h3>
                
                <div className="space-y-1">
                   <label className="text-xs font-bold text-deti-subtext ml-1">Asset Title</label>
                   <input 
                     type="text" 
                     placeholder="e.g. Luxury Apartment Complex NY"
                     value={title}
                     onChange={(e) => setTitle(e.target.value)}
                     className="w-full bg-deti-bg border border-deti-border rounded-xl px-4 py-3 text-sm text-white focus:border-deti-primary outline-none"
                   />
                </div>

                <div className="space-y-1">
                   <label className="text-xs font-bold text-deti-subtext ml-1">Description & Specs</label>
                   <textarea 
                     rows={4}
                     placeholder="Detailed description of the asset, location, specs, and utility..."
                     value={description}
                     onChange={(e) => setDescription(e.target.value)}
                     className="w-full bg-deti-bg border border-deti-border rounded-xl px-4 py-3 text-sm text-white focus:border-deti-primary outline-none resize-none"
                   />
                </div>

                <div className="space-y-1">
                   <label className="text-xs font-bold text-deti-subtext ml-1">Location / Jurisdiction</label>
                   <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-deti-subtext" />
                      <input 
                        type="text" 
                        placeholder="e.g. New York, USA"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full bg-deti-bg border border-deti-border rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-deti-primary outline-none"
                      />
                   </div>
                </div>
             </div>

             {/* Financials */}
             <div className="bg-deti-card border border-deti-border rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                   <DollarSign size={18} className="text-deti-success" /> Financials & Tokenomics
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <div className="space-y-1">
                      <label className="text-xs font-bold text-deti-subtext ml-1">Total Valuation (USDT)</label>
                      <input 
                        type="number" 
                        placeholder="1,000,000"
                        value={valuation}
                        onChange={(e) => setValuation(e.target.value)}
                        className="w-full bg-deti-bg border border-deti-border rounded-xl px-4 py-3 text-sm text-white focus:border-deti-primary outline-none font-mono"
                      />
                   </div>
                   <div className="space-y-1">
                      <label className="text-xs font-bold text-deti-subtext ml-1">Token Supply</label>
                      <input 
                        type="number" 
                        placeholder="10,000"
                        value={supply}
                        onChange={(e) => setSupply(e.target.value)}
                        className="w-full bg-deti-bg border border-deti-border rounded-xl px-4 py-3 text-sm text-white focus:border-deti-primary outline-none font-mono"
                      />
                   </div>
                   <div className="space-y-1">
                      <label className="text-xs font-bold text-deti-subtext ml-1">Estimated APY (%)</label>
                      <input 
                        type="number" 
                        placeholder="8.5"
                        value={apy}
                        onChange={(e) => setApy(e.target.value)}
                        className="w-full bg-deti-bg border border-deti-border rounded-xl px-4 py-3 text-sm text-white focus:border-deti-primary outline-none font-mono"
                      />
                   </div>
                </div>
                
                {valuation && supply && (
                   <div className="p-3 bg-deti-bg rounded-lg border border-deti-border flex justify-between items-center text-sm">
                      <span className="text-deti-subtext">Price per Token:</span>
                      <span className="font-bold text-deti-primary font-mono">
                         ${(parseFloat(valuation) / parseFloat(supply)).toLocaleString(undefined, {minimumFractionDigits: 2})}
                      </span>
                   </div>
                )}
             </div>

             {/* Documents */}
             <div className="bg-deti-card border border-deti-border rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                   <FileText size={18} className="text-blue-400" /> Legal & Documentation
                </h3>
                <div className="border-2 border-dashed border-deti-border hover:border-deti-primary rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer bg-deti-bg/30">
                   <Upload className="w-8 h-8 text-deti-subtext mb-2" />
                   <p className="text-sm font-bold text-white">Upload Ownership Proof</p>
                   <p className="text-xs text-deti-subtext mt-1">PDF, DOCX max 10MB. Deeds, audit reports, etc.</p>
                </div>
             </div>

          </div>

          {/* RIGHT: Preview */}
          <div className="lg:col-span-5 flex flex-col gap-6">
             <div className="sticky top-6">
                <h3 className="text-sm font-bold text-deti-subtext uppercase mb-3 ml-1">NFT Preview</h3>
                
                <div className="bg-deti-card border border-deti-border rounded-3xl overflow-hidden shadow-2xl brand-lighting-box group">
                   {/* Image Area */}
                   <div className="relative h-64 w-full bg-gray-800 flex items-center justify-center overflow-hidden">
                      {imagePreview ? (
                         <img src={imagePreview} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      ) : (
                         <div className="text-center p-6">
                            <ImageIcon className="w-12 h-12 text-deti-subtext mx-auto mb-2 opacity-20" />
                            <p className="text-xs text-deti-subtext">Upload cover image</p>
                         </div>
                      )}
                      
                      <label className="absolute bottom-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full cursor-pointer backdrop-blur-md transition-colors">
                         <Upload size={16} />
                         <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                      </label>

                      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10">
                         <span className="text-xs font-bold text-white flex items-center gap-1.5">
                            {assetType === 'Real Estate' && <Building2 size={12}/>}
                            {assetType === 'Data Center' && <Server size={12}/>}
                            {assetType === 'Carbon Credit' && <Leaf size={12}/>}
                            {assetType === 'Infrastructure' && <Globe size={12}/>}
                            {assetType}
                         </span>
                      </div>
                   </div>

                   {/* Card Content */}
                   <div className="p-6 space-y-4">
                      <div>
                         <h2 className="text-xl font-bold text-white mb-1">{title || 'Asset Title'}</h2>
                         <p className="text-xs text-deti-subtext flex items-center gap-1">
                            <Globe size={12} /> {location || 'Location'}
                         </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 py-4 border-y border-deti-border">
                         <div>
                            <div className="text-[10px] text-deti-subtext uppercase">Total Value</div>
                            <div className="text-sm font-bold text-white font-mono">
                               {valuation ? `$${parseInt(valuation).toLocaleString()}` : '---'}
                            </div>
                         </div>
                         <div className="text-right">
                            <div className="text-[10px] text-deti-subtext uppercase">Est. APY</div>
                            <div className="text-sm font-bold text-deti-success font-mono">
                               {apy ? `${apy}%` : '---'}
                            </div>
                         </div>
                         <div>
                            <div className="text-[10px] text-deti-subtext uppercase">Min Investment</div>
                            <div className="text-sm font-bold text-white font-mono">
                               {valuation && supply ? `$${(parseFloat(valuation) / parseFloat(supply)).toFixed(2)}` : '---'}
                            </div>
                         </div>
                         <div className="text-right">
                            <div className="text-[10px] text-deti-subtext uppercase">Risk Score</div>
                            <div className="text-sm font-bold text-deti-primary">Low-Medium</div>
                         </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-deti-subtext">
                         <span>Powered by DETI RWA Protocol</span>
                         <span className="flex items-center gap-1"><CheckCircle2 size={10} className="text-deti-primary" /> Verified</span>
                      </div>
                   </div>
                </div>

                <div className="mt-6">
                   <button 
                     onClick={handleMint}
                     disabled={loading || !title || !valuation}
                     className="w-full py-4 bg-gradient-brand text-white rounded-xl font-bold shadow-glow hover:shadow-glow-gold hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                      {loading ? <RefreshCw className="animate-spin w-5 h-5" /> : 'Mint RWA Token'}
                   </button>
                   <p className="text-center text-[10px] text-deti-subtext mt-3">
                      By minting, you agree to the Terms of Service for Asset Tokenization. <br/> A 0.5% protocol fee applies.
                   </p>
                </div>
             </div>
          </div>

       </div>
    </div>
  );
};
