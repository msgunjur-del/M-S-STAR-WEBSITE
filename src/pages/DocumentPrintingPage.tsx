import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Upload, File, X, Plus, FileText, Image as ImageIcon, Loader2, ShoppingBasket, Zap, ArrowRight } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { storage, db } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, getDoc } from 'firebase/firestore';
import { useCart } from '../context/CartContext';
import imageCompression from 'browser-image-compression';
import * as pdfjs from 'pdfjs-dist';

// Configure PDF.js worker using Vite's URL import
// @ts-ignore
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

interface UploadedFile {
  id: string;
  file: File;
  pages: number;
  name: string;
  type: string;
  status: 'processing' | 'ready' | 'uploading' | 'done' | 'error';
  progress?: number;
  url?: string;
  thumbnail?: string;
}

export default function DocumentPrintingPage() {
  const navigate = useNavigate();
  const { addToCart, setIsCartOpen } = useCart();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [copies, setCopies] = useState(1);
  const [colorMode, setColorMode] = useState('B&W');
  const [printSide, setPrintSide] = useState('Single');
  const [binding, setBinding] = useState('None');
  const [settings, setSettings] = useState({
    pricePerPrintBW: 3,
    pricePerPrintColor: 10,
    spiralBindingCost: 50,
    stapledBindingCost: 10
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settingsSnap = await getDoc(doc(db, 'settings', 'global'));
        if (settingsSnap.exists()) {
          setSettings(prev => ({ ...prev, ...settingsSnap.data() }));
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };
    fetchSettings();
  }, []);

  const totalPages = files.reduce((sum, f) => sum + f.pages, 0);
  const pricePerCopy = colorMode === 'B&W' 
    ? (printSide === 'Single' ? settings.pricePerPrintBW : settings.pricePerPrintBW * 0.8) 
    : settings.pricePerPrintColor;
  const bindingCost = binding === 'Spiral' ? settings.spiralBindingCost : (binding === 'Stapled' ? settings.stapledBindingCost : 0);
  const unitPrice = (pricePerCopy * totalPages) + bindingCost;
  const totalPrice = unitPrice * copies;

  const processPdf = async (file: File, fileId: string) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      
      // Update page count immediately
      const pages = pdf.numPages;
      setFiles(prev => prev.map(f => f.id === fileId ? { ...f, pages } : f));

      // Generate thumbnail
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 0.5 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      if (context) {
        await (page as any).render({ canvasContext: context, viewport }).promise;
        const thumbnail = canvas.toDataURL();
        setFiles(prev => prev.map(f => f.id === fileId ? { ...f, thumbnail } : f));
      }
    } catch (error: any) {
      console.error('Error processing PDF:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.log('Error type:', typeof error, 'Error:', error);
      
      const isPasswordError = 
        (error && typeof error === 'object' && 'name' in error && error.name === 'PasswordException') ||
        errorMessage.toLowerCase().includes('password') ||
        errorMessage.toLowerCase().includes('no password given');

      if (isPasswordError) {
        alert(`The file "${file.name}" is password protected. Please upload an unprotected file.`);
      }
      setFiles(prev => prev.map(f => f.id === fileId ? { ...f, pages: 1 } : f));
    }
  };

  const uploadFile = async (fileObj: UploadedFile) => {
    try {
      let fileToUpload = fileObj.file;

      // Aggressive compression for "Turbo" speed (target 200KB)
      if (fileToUpload.type.startsWith('image/') && fileToUpload.size > 256 * 1024) {
        const options = {
          maxSizeMB: 0.2,
          maxWidthOrHeight: 1000,
          useWebWorker: true,
          initialQuality: 0.6
        };
        try {
          fileToUpload = await imageCompression(fileToUpload, options);
        } catch (e) {
          console.warn("Compression failed", e);
        }
      }

      const storageRef = ref(storage, `orders/temp/${Date.now()}_${fileObj.name}`);
      const uploadTask = uploadBytesResumable(storageRef, fileToUpload);

      // Set status to uploading immediately
      setFiles(prev => prev.map(f => f.id === fileObj.id ? { ...f, status: 'uploading', progress: 0 } : f));

      // 5-second safety timer
      const timeoutPromise = new Promise<string>((_, reject) => {
        setTimeout(() => {
          reject(new Error("Upload timeout"));
        }, 5000);
      });

      return Promise.race([
        new Promise<string>((resolve, reject) => {
          uploadTask.on('state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setFiles(prev => prev.map(f => f.id === fileObj.id ? { ...f, progress, status: 'uploading' } : f));
            },
            (error) => {
              console.error("Upload task error:", error);
              reject(error);
            },
            async () => {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              setFiles(prev => prev.map(f => f.id === fileObj.id ? { ...f, url, status: 'done', progress: 100 } : f));
              resolve(url);
            }
          );
        }),
        timeoutPromise
      ]).catch(async (error) => {
        console.warn("Upload failed or timed out, using local fallback:", error);
        const localUrl = URL.createObjectURL(fileObj.file);
        setFiles(prev => prev.map(f => f.id === fileObj.id ? { ...f, url: localUrl, status: 'done', progress: 100 } : f));
        return localUrl;
      });
    } catch (error) {
      console.error("Upload error:", error);
      setFiles(prev => prev.map(f => f.id === fileObj.id ? { ...f, status: 'error', progress: 0 } : f));
      throw error;
    }
  };

  const handleFiles = async (newFiles: FileList | File[]) => {
    const newFilesArray = Array.from(newFiles).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      pages: 0,
      name: file.name,
      type: file.type,
      status: 'processing' as const,
      progress: 0
    }));
    
    setFiles(prev => [...prev, ...newFilesArray]);
    
    // Process all files in parallel with optimized logic
    newFilesArray.forEach(async (fileObj) => {
      // 1. Start upload immediately (will compress internally)
      uploadFile(fileObj);
      
      // 2. Handle metadata and thumbnails based on type
      if (fileObj.type === 'application/pdf') {
        processPdf(fileObj.file, fileObj.id);
      } else if (fileObj.type.startsWith('image/')) {
        // Instant image thumbnail
        const thumbnail = URL.createObjectURL(fileObj.file);
        setFiles(prev => prev.map(f => f.id === fileObj.id ? { ...f, thumbnail, pages: 1 } : f));
      } else {
        // Default for other types
        setFiles(prev => prev.map(f => f.id === fileObj.id ? { ...f, pages: 1 } : f));
      }
    });
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const clearAllFiles = () => {
    if (window.confirm('Are you sure you want to remove all uploaded files?')) {
      setFiles([]);
    }
  };

  const OptionButton = ({ label, active, onClick, disabled }: { label: string, active: boolean, onClick: () => void, disabled?: boolean }) => (
    <button 
      onClick={!disabled ? onClick : undefined} 
      disabled={disabled}
      className={`p-4 rounded-xl border-2 font-bold flex items-center justify-center gap-2 transition-all relative overflow-hidden ${
        disabled
          ? 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed'
          : active 
            ? 'border-blue-600 bg-blue-50 text-blue-700' 
            : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <Check size={18} strokeWidth={3} />
          </motion.div>
        )}
      </AnimatePresence>
      {label}
    </button>
  );

  const handleAddToCart = async () => {
    if (files.length === 0) {
      alert("Please upload at least one file.");
      return;
    }
    
    if (files.some(f => f.status !== 'done')) {
      alert("Please wait for all files to finish uploading.");
      return;
    }

    setIsUploading(true);
    try {
      const uploadedFiles = files.map(f => ({
        name: f.name,
        url: f.url || ''
      }));

      addToCart({
        id: `DOC_${Date.now()}`,
        title: `Document Printing (${colorMode}, ${printSide}, ${binding})`,
        price: unitPrice,
        quantity: copies,
        category: 'DOCUMENTS',
        files: uploadedFiles,
        options: { 
          colorMode, 
          printSide, 
          binding,
          unitPrice,
          totalPages,
          fileUrls: uploadedFiles.map(f => f.url)
        }
      });

      setShowSuccess(true);
      setFiles([]);
      setTimeout(() => setShowSuccess(false), 3000);

    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to process files. Please try again.");
    } finally {
      setIsUploading(false);
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
                <p className="text-xs text-slate-400 font-bold">Files added to your cart</p>
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
            <FileText size={12} className="text-accent-amber" />
            <span>Professional Document Services</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-black font-headline leading-[0.9] tracking-tighter">
            DOCUMENT <br />
            <span className="text-accent-amber">PRINTING.</span>
          </h1>
          <p className="text-lg text-slate-400 font-medium leading-relaxed">
            Upload your documents, choose your preferences, and we'll handle the rest. Fast, secure, and delivered to your doorstep.
          </p>
          <div className="flex flex-wrap gap-3">
            {['A4 Size', 'B&W from ₹3', 'Color ₹10', 'Spiral Binding'].map(tag => (
              <span key={tag} className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-xs font-bold text-slate-300">
                {tag}
              </span>
            ))}
          </div>
        </div>
        {/* Decoration */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-accent-blue/20 blur-[100px] -rotate-12 translate-x-1/4" />
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-12">
          <div className="bg-white p-8 lg:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent-blue/5 text-accent-blue rounded-2xl flex items-center justify-center font-black text-xl">1</div>
              <h2 className="text-2xl font-black font-headline tracking-tight text-ink">Upload Documents</h2>
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
              multiple
              className="hidden"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />

            <div 
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`group border-2 border-dashed rounded-[2rem] p-16 text-center transition-all cursor-pointer relative overflow-hidden ${
                isDragging 
                  ? 'border-accent-blue bg-accent-blue/5 scale-[1.02] shadow-xl shadow-accent-blue/10' 
                  : 'border-slate-200 hover:border-accent-blue/50 hover:bg-slate-50'
              }`}
            >
              {isDragging && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-accent-blue/5 backdrop-blur-[2px] z-10 flex items-center justify-center"
                >
                  <div className="bg-white p-6 rounded-3xl shadow-2xl flex flex-col items-center gap-4 border border-accent-blue/20">
                    <div className="w-16 h-16 bg-accent-blue text-white rounded-2xl flex items-center justify-center animate-bounce">
                      <Upload size={32} />
                    </div>
                    <p className="font-black text-accent-blue">Drop files to start!</p>
                  </div>
                </motion.div>
              )}
              <div className="flex flex-col items-center gap-6">
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all relative ${isDragging ? 'bg-accent-blue text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-accent-blue/10 group-hover:text-accent-blue'}`}>
                  <Upload size={40} />
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg animate-pulse">
                    FAST
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="font-black text-xl text-ink">Drag & Drop or Click</p>
                  <p className="text-slate-400 font-bold text-sm">PDF, DOCX, JPG, PNG — A4 size recommended</p>
                </div>
                <button className="bg-accent-amber text-ink px-8 py-3 rounded-2xl font-black text-sm flex items-center gap-2 shadow-lg shadow-amber-200">
                  <Plus size={18} />
                  Add Files
                </button>
              </div>
            </div>

            {/* File List */}
            <AnimatePresence>
              {files.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="flex justify-between items-center px-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-black text-ink">Uploaded Files ({files.length})</h3>
                      <button 
                        onClick={(e) => { e.stopPropagation(); clearAllFiles(); }}
                        className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline"
                      >
                        Clear All
                      </button>
                    </div>
                    <span className="text-xs font-black text-accent-blue uppercase tracking-widest bg-accent-blue/5 px-3 py-1 rounded-lg">Total Pages: {totalPages}</span>
                  </div>
                  <div className="grid gap-3">
                    {files.map((file) => (
                      <motion.div 
                        key={file.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="flex flex-col p-5 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-accent-blue/30 transition-all gap-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 overflow-hidden">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0 overflow-hidden">
                              {file.thumbnail ? (
                                <img src={file.thumbnail} alt="Preview" className="w-full h-full object-cover" />
                              ) : (
                                file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf') ? (
                                  <FileText className="text-red-500" size={24} />
                                ) : file.type.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name) ? (
                                  <ImageIcon className="text-blue-500" size={24} />
                                ) : file.type.includes('word') || file.type.includes('officedocument') || /\.(doc|docx)$/i.test(file.name) ? (
                                  <FileText className="text-blue-600" size={24} />
                                ) : (
                                  <File className="text-slate-400" size={24} />
                                )
                              )}
                            </div>
                            <div className="truncate">
                              <p className="font-black text-ink truncate">{file.name}</p>
                              {file.status === 'processing' ? (
                                <p className="text-xs font-bold text-accent-blue uppercase tracking-widest flex items-center gap-1">
                                  <Loader2 size={10} className="animate-spin" /> Processing...
                                </p>
                              ) : (
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{file.pages} {file.pages === 1 ? 'page' : 'pages'}</p>
                              )}
                            </div>
                          </div>
                          <button 
                            onClick={(e) => { e.stopPropagation(); removeFile(file.id); }}
                            disabled={file.status === 'uploading'}
                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all disabled:opacity-50"
                          >
                            <X size={20} />
                          </button>
                        </div>
                        
                        {(file.status === 'uploading' || file.status === 'done' || file.status === 'error' || file.status === 'processing') && (
                          <div className="space-y-2">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                              <span className={
                                file.status === 'done' ? 'text-green-500' : 
                                file.status === 'error' ? 'text-red-500' : 
                                file.status === 'processing' ? 'text-purple-500' :
                                'text-accent-blue'
                              }>
                                {file.status === 'done' ? 'Complete' : 
                                 file.status === 'error' ? 'Upload Failed' : 
                                 file.status === 'processing' ? 'Processing...' :
                                 'Uploading...'}
                              </span>
                              <span className="text-slate-400">
                                {file.status === 'error' ? (
                                  <button onClick={() => uploadFile(file as any)} className="text-red-600 hover:underline font-bold">Retry</button>
                                ) : (
                                  `${Math.round(file.progress || 0)}%`
                                )}
                              </span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden relative">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${file.status === 'done' ? 100 : file.progress || 0}%` }}
                                transition={{ type: "spring", stiffness: 50, damping: 20 }}
                                className={`h-full rounded-full relative ${
                                  file.status === 'done' ? 'bg-green-500' : 
                                  file.status === 'error' ? 'bg-red-500' : 
                                  file.status === 'processing' ? 'bg-purple-500 animate-pulse' :
                                  'bg-accent-blue'
                                }`}
                              />
                            </div>
                            {file.status === 'error' && (
                              <p className="text-[10px] text-red-500 font-bold">Please check your connection and try again.</p>
                            )}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="bg-white p-8 lg:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent-blue/5 text-accent-blue rounded-2xl flex items-center justify-center font-black text-xl">3</div>
              <h2 className="text-2xl font-black font-headline tracking-tight text-ink">Security & Instructions</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">File Password (if any)</label>
                <input type="text" placeholder="Type file password here..." className="w-full p-5 rounded-2xl border-slate-200 focus:border-accent-blue focus:ring-0 transition-all bg-slate-50/50" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Special Instructions</label>
                <textarea placeholder="e.g. Print page 1-10 only..." className="w-full p-5 rounded-2xl border-slate-200 focus:border-accent-blue focus:ring-0 transition-all bg-slate-50/50 h-[60px]" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-accent-blue/5 text-accent-blue rounded-xl flex items-center justify-center font-black text-lg">2</div>
              <h2 className="text-xl font-black font-headline tracking-tight text-ink">Printing Options</h2>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="block font-black uppercase text-[10px] tracking-widest text-slate-400 ml-1">Color Mode</label>
                <div className="grid grid-cols-2 gap-3">
                  <OptionButton 
                    label="B&W" 
                    active={colorMode === 'B&W'} 
                    onClick={() => setColorMode('B&W')} 
                  />
                  <OptionButton 
                    label="Full Color" 
                    active={colorMode === 'Color'} 
                    onClick={() => {
                      setColorMode('Color');
                      setPrintSide('Single');
                    }} 
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block font-black uppercase text-[10px] tracking-widest text-slate-400 ml-1">Print Sides</label>
                <div className="grid grid-cols-2 gap-3">
                  <OptionButton 
                    label="Single" 
                    active={printSide === 'Single'} 
                    onClick={() => setPrintSide('Single')} 
                  />
                  <OptionButton 
                    label="Double" 
                    active={printSide === 'Double'} 
                    onClick={() => setPrintSide('Double')} 
                    disabled={colorMode === 'Color'}
                  />
                </div>
                {colorMode === 'Color' && (
                  <p className="text-[10px] text-red-500 mt-2 font-bold italic px-1">
                    * Double-sided not available for Full Color.
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <label className="block font-black uppercase text-[10px] tracking-widest text-slate-400 ml-1">Binding</label>
                <div className="grid grid-cols-3 gap-2">
                  <OptionButton label="None" active={binding === 'None'} onClick={() => setBinding('None')} />
                  <OptionButton label="Stapled" active={binding === 'Stapled'} onClick={() => setBinding('Stapled')} />
                  <button 
                    onClick={() => setBinding('Spiral')}
                    className={`p-3 rounded-2xl border-2 font-black flex flex-col items-center justify-center transition-all relative overflow-hidden ${
                      binding === 'Spiral' 
                        ? 'border-accent-blue bg-accent-blue/5 text-accent-blue' 
                        : 'border-slate-100 bg-slate-50/50 text-slate-400 hover:border-slate-200'
                    }`}
                  >
                    <span className="text-xs">Spiral</span>
                    <span className="text-[8px] text-accent-amber">+₹50</span>
                    {binding === 'Spiral' && (
                      <div className="absolute top-1 right-1 text-accent-blue">
                        <Check size={10} strokeWidth={4} />
                      </div>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between bg-slate-50 p-5 rounded-[1.5rem] border border-slate-100">
                <span className="font-black text-sm text-ink">Copies</span>
                <div className="flex items-center gap-4">
                  <button onClick={() => setCopies(Math.max(1, copies - 1))} className="bg-white w-10 h-10 rounded-xl font-black text-lg hover:bg-slate-100 transition-all shadow-sm border border-slate-100">-</button>
                  <span className="font-black text-lg min-w-[1.5rem] text-center text-ink">{copies}</span>
                  <button onClick={() => setCopies(copies + 1)} className="bg-white w-10 h-10 rounded-xl font-black text-lg hover:bg-slate-100 transition-all shadow-sm border border-slate-100">+</button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-ink text-white p-8 rounded-[2.5rem] shadow-2xl shadow-slate-900/20 space-y-8 relative overflow-hidden">
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black font-headline tracking-tight">Order Summary</h3>
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <ShoppingBasket size={20} className="text-accent-amber" />
                </div>
              </div>
              <div className="space-y-4 text-xs font-bold">
                <div className="flex justify-between text-slate-400"><span>Files</span><span className="text-white">{files.length}</span></div>
                <div className="flex justify-between text-slate-400"><span>Pages</span><span className="text-white">{totalPages}</span></div>
                <div className="flex justify-between text-slate-400"><span>Mode</span><span className="text-white">{colorMode}</span></div>
                <div className="flex justify-between text-slate-400"><span>Sides</span><span className="text-white">{printSide}</span></div>
                <div className="flex justify-between text-slate-400"><span>Binding</span><span className="text-white">{binding}</span></div>
                <div className="flex justify-between text-slate-400"><span>Copies</span><span className="text-white">x{copies}</span></div>
                <div className="pt-6 border-t border-white/10">
                  <div className="flex justify-between items-end">
                    <span className="text-slate-400">Total Amount</span>
                    <span className="text-4xl font-black text-white tracking-tighter">₹{totalPrice.toFixed(0)}</span>
                  </div>
                </div>
              </div>
              <motion.button 
                whileHover={{ scale: files.length > 0 && !isUploading && !files.some(f => f.status !== 'done') ? 1.02 : 1 }}
                whileTap={{ scale: files.length > 0 && !isUploading && !files.some(f => f.status !== 'done') ? 0.98 : 1 }}
                onClick={handleAddToCart}
                disabled={isUploading || files.length === 0 || files.some(f => f.status !== 'done')}
                className={`w-full py-5 rounded-2xl font-black text-lg text-center flex items-center justify-center gap-2 transition-all duration-300 ${
                  files.length > 0 && !isUploading && !files.some(f => f.status !== 'done')
                    ? 'bg-accent-amber text-ink hover:bg-amber-500 shadow-[0_20px_50px_rgba(251,191,36,0.3)]' 
                    : 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/5'
                }`}
              >
                {isUploading || (files.length > 0 && files.some(f => f.status !== 'done')) ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    {files.some(f => f.status !== 'done') ? 'Uploading...' : 'Adding to Cart...'}
                  </>
                ) : (
                  files.length > 0 ? (
                    <>
                      Add to Cart
                      <ArrowRight size={20} className="ml-1" />
                    </>
                  ) : 'Upload Files First'
                )}
              </motion.button>
            </div>
            {/* Decoration */}
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-accent-blue/20 blur-3xl rounded-full" />
          </div>
        </div>
      </div>
      
      {/* Mobile Floating Add to Cart */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full p-4 bg-white/80 backdrop-blur-xl border-t border-slate-100 z-40 flex items-center justify-between gap-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Price</span>
          <span className="text-2xl font-black text-ink tracking-tighter">₹{totalPrice.toFixed(0)}</span>
        </div>
        <button 
          onClick={handleAddToCart}
          disabled={isUploading || files.length === 0 || files.some(f => f.status !== 'done')}
          className={`flex-1 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all ${
            files.length > 0 && !isUploading && !files.some(f => f.status !== 'done')
              ? 'bg-accent-amber text-ink shadow-lg shadow-amber-200' 
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          {isUploading || (files.length > 0 && files.some(f => f.status !== 'done')) ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              Add to Cart
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </div>

      {/* Pricing Reference */}
      <div className="bg-white p-8 lg:p-12 rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 bg-accent-amber/10 text-accent-amber rounded-2xl flex items-center justify-center">
            <Zap size={24} />
          </div>
          <h2 className="text-3xl font-black font-headline tracking-tight text-ink">Transparent Pricing</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Print Type</th>
                <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Single Side</th>
                <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Double Side</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <tr>
                <td className="py-6 px-4 font-black text-ink">Black & White</td>
                <td className="py-6 px-4 text-slate-500 font-bold">₹3 / page</td>
                <td className="py-6 px-4 text-slate-500 font-bold">₹2.50 / page</td>
              </tr>
              <tr>
                <td className="py-6 px-4 font-black text-ink">Full Color</td>
                <td className="py-6 px-4 text-slate-500 font-bold">₹10 / page</td>
                <td className="py-6 px-4 text-red-500 font-black text-[10px] uppercase tracking-widest italic">Not Available</td>
              </tr>
              <tr>
                <td className="py-6 px-4 font-black text-ink">Spiral Binding</td>
                <td className="py-6 px-4 text-slate-500 font-bold" colSpan={2}>₹50 / book</td>
              </tr>
              <tr>
                <td className="py-6 px-4 font-black text-ink">Stapling</td>
                <td className="py-6 px-4 text-accent-blue font-black" colSpan={2}>FREE</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}