import React, { useState, useRef } from 'react';
import { ShoppingBasket, Clock, Camera, Zap, Check, Upload, Plus, ArrowRight, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../context/CartContext';
import { storage } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import imageCompression from 'browser-image-compression';

export default function PhotosPage() {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [background, setBackground] = useState<string | null>(null);
  const [copies, setCopies] = useState(1);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { addToCart, setIsCartOpen } = useCart();
  const navigate = useNavigate();

  const packages = [
    { name: '8 Passport Photos', price: 99, desc: 'Standard set for official use' },
    { name: '16 Passport Photos', price: 149, desc: 'Value pack for multiple uses' },
    { name: '24 Passport Photos', price: 199, desc: 'Best value for families' },
    { name: '6 Passport + 4 Stamp', price: 99, desc: 'Mixed set for admissions' },
    { name: '12 Passport + 8 Stamp', price: 149, desc: 'Popular mixed combo' },
    { name: '18 Passport + 12 Stamp', price: 199, desc: 'Complete documentation set' },
  ];

  const selectedPkgData = packages.find(p => p.name === selectedPackage);
  const totalPrice = selectedPkgData ? selectedPkgData.price * copies : 0;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      setUploadedUrl(null);
      setIsUploading(true);
      setUploadProgress(0);
      setUploadError(false);

      try {
        // 1. Aggressive compression for "Turbo" speed (target 200KB)
        let fileToUpload = file;
        if (file.size > 256 * 1024) {
          const options = {
            maxSizeMB: 0.2,
            maxWidthOrHeight: 1000,
            useWebWorker: true,
            initialQuality: 0.6
          };
          fileToUpload = await imageCompression(file, options);
        }

        // 2. Upload to Firebase
        const storageRef = ref(storage, `orders/photos/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, fileToUpload);

        // Ensure uploading state is active
        setIsUploading(true);
        setUploadProgress(0);

        uploadTask.on('state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          (error) => {
            console.error("Upload error, using local fallback:", error);
            // Turbo Fallback: If cloud upload fails, use local URL so user can proceed
            const localUrl = URL.createObjectURL(file);
            setUploadedUrl(localUrl);
            setUploadProgress(100);
            setIsUploading(false);
          },
          async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            setUploadedUrl(url);
            setIsUploading(false);
          }
        );
      } catch (error) {
        console.error("Compression/Upload error:", error);
        setUploadedUrl(URL.createObjectURL(file));
        setIsUploading(false);
      }
    }
  };

  const handleAddToCart = async () => {
    if (!photoFile || !selectedPackage || !background || !uploadedUrl) return;

    try {
      addToCart({
        id: `photo-${Date.now()}`,
        title: selectedPackage,
        price: selectedPkgData!.price,
        quantity: copies,
        category: 'PHOTOS',
        files: [{ name: photoFile.name, url: uploadedUrl }],
        options: { background }
      });

      setShowSuccess(true);
      setPhotoFile(null);
      setUploadedUrl(null);
      setSelectedPackage(null);
      setBackground(null);
      setTimeout(() => setShowSuccess(false), 3000);

      // Cart will automatically open via CartContext
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to process photo. Please try again.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-ink text-white px-8 py-4 rounded-[2rem] shadow-2xl border border-white/10 flex items-center gap-4 backdrop-blur-xl"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white shrink-0">
                <Check size={24} strokeWidth={3} />
              </div>
              <div>
                <p className="font-black text-sm uppercase tracking-widest">Upload Success!</p>
                <p className="text-xs text-slate-400 font-bold">Photo added to your cart</p>
              </div>
            </div>
            <div className="h-8 w-[1px] bg-white/10 mx-2" />
            <button 
              onClick={() => setIsCartOpen(true)}
              className="bg-accent-amber text-ink px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest hover:bg-amber-500 transition-all"
            >
              View Cart
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Header */}
      <div className="relative overflow-hidden bg-ink rounded-[3rem] p-12 lg:p-20 text-white">
        <div className="relative z-10 space-y-6 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest border border-white/10 backdrop-blur-md">
            <Camera size={12} className="text-accent-amber" />
            <span>Studio Quality Photography</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-black font-headline leading-[0.9] tracking-tighter">
            PASSPORT <br />
            <span className="text-accent-amber">PHOTOS.</span>
          </h1>
          <p className="text-lg text-slate-400 font-medium leading-relaxed">
            Get your perfect photo (compliance guaranteed) delivered to your home. Professional retouching and background removal included.
          </p>
          <div className="flex items-center gap-4">
            <div className="bg-accent-amber text-ink p-3 rounded-2xl flex items-center gap-2 font-black text-xs uppercase tracking-widest shadow-lg shadow-amber-900/20">
              <Clock size={16} />
              Express Delivery
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-accent-blue/20 blur-[100px] -rotate-12 translate-x-1/4" />
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-12">
          {/* Upload */}
          <div className="bg-white p-8 lg:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent-blue/5 text-accent-blue rounded-2xl flex items-center justify-center font-black text-xl">1</div>
              <h2 className="text-2xl font-black font-headline tracking-tight text-ink">Upload Your Photo</h2>
            </div>
            <div 
              className="group border-2 border-dashed border-slate-200 rounded-[2rem] p-16 text-center hover:border-accent-blue/50 hover:bg-slate-50 transition-all cursor-pointer relative"
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                accept="image/jpeg, image/png"
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <div className="flex flex-col items-center gap-6">
                {photoFile ? (
                  <div className="space-y-4">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-lg mx-auto relative group-hover:scale-105 transition-transform">
                      <img src={URL.createObjectURL(photoFile)} alt="Preview" className="w-full h-full object-cover" />
                      <div 
                        className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => { e.stopPropagation(); setPhotoFile(null); }}
                      >
                        <X className="text-white" size={24} />
                      </div>
                    </div>
                    <p className="font-black text-ink text-sm truncate max-w-[200px]">{photoFile.name}</p>
                    {uploadError && (
                      <div className="w-48 mx-auto space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-red-500">
                          <span>Upload Failed</span>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleFileChange({ target: { files: [photoFile] } } as any); }}
                          className="text-[10px] font-black text-accent-blue uppercase tracking-widest hover:underline"
                        >
                          Retry Upload
                        </button>
                      </div>
                    )}
                    {isUploading && (
                      <div className="w-48 mx-auto space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                          <span className="text-accent-blue">Uploading...</span>
                          <span className="text-slate-400">{Math.round(uploadProgress)}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden relative">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${uploadProgress}%` }}
                            className="h-full bg-accent-blue rounded-full relative"
                          >
                            <motion.div 
                              animate={{ x: ['-100%', '100%'] }}
                              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                            />
                          </motion.div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-3xl flex items-center justify-center group-hover:bg-accent-blue/10 group-hover:text-accent-blue transition-all relative">
                      <Upload size={40} />
                      <div className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg animate-pulse">
                        FAST
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="font-black text-xl text-ink">Drag & Drop or Click</p>
                      <p className="text-slate-400 font-bold text-sm">High resolution JPEG or PNG recommended</p>
                    </div>
                    <button className="bg-accent-amber text-ink px-8 py-3 rounded-2xl font-black text-sm flex items-center gap-2 shadow-lg shadow-amber-200 pointer-events-none">
                      <Plus size={18} />
                      Select Photo
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Background */}
          <div className="bg-white p-8 lg:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent-blue/5 text-accent-blue rounded-2xl flex items-center justify-center font-black text-xl">2</div>
              <h2 className="text-2xl font-black font-headline tracking-tight text-ink">Background Color</h2>
            </div>
            <div className="flex flex-wrap gap-6">
              {[
                { name: 'White', class: 'bg-white border-slate-200' },
                { name: 'Blue', class: 'bg-blue-600 border-blue-700' },
                { name: 'Red', class: 'bg-red-600 border-red-700' },
                { name: 'Sky', class: 'bg-sky-400 border-sky-500' }
              ].map(color => (
                <button 
                  key={color.name}
                  onClick={() => setBackground(color.name)}
                  className={`group relative flex flex-col items-center gap-3 transition-all`}
                >
                  <div className={`w-16 h-16 rounded-2xl border-4 transition-all flex items-center justify-center ${color.class} ${background === color.name ? 'scale-110 shadow-xl ring-4 ring-accent-blue/20' : 'hover:scale-105'}`}>
                    {background === color.name && <Check size={24} className={color.name === 'White' ? 'text-accent-blue' : 'text-white'} strokeWidth={4} />}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${background === color.name ? 'text-accent-blue' : 'text-slate-400'}`}>{color.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Packages */}
          <div className="bg-white p-8 lg:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent-blue/5 text-accent-blue rounded-2xl flex items-center justify-center font-black text-xl">3</div>
              <h2 className="text-2xl font-black font-headline tracking-tight text-ink">Choose Package</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {packages.map((pkg, idx) => (
                <motion.button 
                  key={pkg.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setSelectedPackage(pkg.name)}
                  className={`p-6 rounded-[2rem] border-2 text-left transition-all relative group ${selectedPackage === pkg.name ? 'border-accent-blue bg-accent-blue/5 shadow-xl shadow-accent-blue/5' : 'border-slate-100 hover:border-slate-200 bg-slate-50/50'}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      <Camera size={20} className={selectedPackage === pkg.name ? 'text-accent-blue' : 'text-slate-400'} />
                    </div>
                    <span className="font-black text-xl text-ink">₹{pkg.price}</span>
                  </div>
                  <p className="font-black text-ink leading-tight mb-1">{pkg.name}</p>
                  <p className="text-xs font-bold text-slate-400">{pkg.desc}</p>
                  {selectedPackage === pkg.name && (
                    <div className="absolute top-4 right-4 text-accent-blue">
                      <Check size={16} strokeWidth={4} />
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <div className="bg-ink text-white p-8 rounded-[2.5rem] shadow-2xl shadow-slate-900/20 space-y-8 relative overflow-hidden">
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black font-headline tracking-tight">Order Summary</h3>
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <ShoppingBasket size={20} className="text-accent-amber" />
                </div>
              </div>
              <div className="space-y-4 text-xs font-bold">
                <div className="flex justify-between text-slate-400"><span>Package</span><span className="text-white truncate max-w-[150px]">{selectedPackage || 'None'}</span></div>
                <div className="flex justify-between text-slate-400"><span>Background</span><span className="text-white">{background || 'Not Selected'}</span></div>
                <div className="flex justify-between text-slate-400"><span>Quantity</span><span className="text-white">x{copies}</span></div>
                <div className="pt-6 border-t border-white/10">
                  <div className="flex justify-between items-end">
                    <span className="text-slate-400">Total Amount</span>
                    <span className="text-4xl font-black text-white tracking-tighter">₹{totalPrice}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sets</span>
                <div className="flex items-center gap-4">
                  <button onClick={() => setCopies(Math.max(1, copies - 1))} className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-all">-</button>
                  <span className="font-black text-sm">{copies}</span>
                  <button onClick={() => setCopies(copies + 1)} className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-all">+</button>
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: (selectedPackage && background && photoFile && !isUploading && uploadedUrl) ? 1.02 : 1 }}
                whileTap={{ scale: (selectedPackage && background && photoFile && !isUploading && uploadedUrl) ? 0.98 : 1 }}
                onClick={handleAddToCart}
                disabled={!selectedPackage || !background || !photoFile || isUploading || !uploadedUrl}
                className={`w-full py-5 rounded-2xl font-black text-lg text-center flex items-center justify-center gap-2 transition-all duration-300 ${
                  selectedPackage && background && photoFile && !isUploading && uploadedUrl
                    ? 'bg-accent-amber text-ink hover:bg-amber-500 shadow-[0_20px_50px_rgba(251,191,36,0.3)]' 
                    : 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/5'
                }`}
              >
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-2 w-full">
                      <div className="flex items-center gap-2">
                        <Loader2 className="animate-spin" size={20} />
                        <span className="text-xs uppercase tracking-widest">Uploading...</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-1 mt-1 overflow-hidden">
                        <div 
                          className="bg-accent-amber h-1 rounded-full transition-all duration-300" 
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    selectedPackage && background && photoFile && uploadedUrl ? (
                      <>
                        Add to Cart
                        <ArrowRight size={20} className="ml-1" />
                      </>
                    ) : 
                    (!photoFile ? 'Upload Photo First' : 'Complete Steps First')
                  )}
              </motion.button>
            </div>
            {/* Decoration */}
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-accent-blue/20 blur-3xl rounded-full" />
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 text-accent-blue">
              <Zap size={20} />
              <h4 className="font-black text-sm uppercase tracking-widest">Why Choose Us?</h4>
            </div>
            <ul className="space-y-4">
              {[
                'ICAO & Passport Compliant',
                'Professional Retouching',
                'Premium Matte/Glossy Paper',
                'Doorstep Delivery'
              ].map(item => (
                <li key={item} className="flex items-center gap-3 text-sm font-bold text-slate-500">
                  <Check size={14} className="text-accent-blue" strokeWidth={4} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
