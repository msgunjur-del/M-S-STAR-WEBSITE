import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, Upload, FileText, ArrowRight, ShoppingBag, Loader2, Download } from 'lucide-react';
import { db, storage } from '../firebase';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import imageCompression from 'browser-image-compression';

interface UploadedFile {
  id: string;
  name: string;
  url: string;
  uploadedAt: string;
}

export default function OrderSuccessPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      try {
        const docSnap = await getDoc(doc(db, 'orders', orderId));
        if (docSnap.exists()) {
          setOrder({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !orderId) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      let fileToUpload = file;
      
      // Turbo Compression for images
      if (file.type.startsWith('image/') && file.size > 256 * 1024) {
        const options = {
          maxSizeMB: 0.2,
          maxWidthOrHeight: 1000,
          useWebWorker: true,
          initialQuality: 0.6
        };
        try {
          fileToUpload = await imageCompression(file, options);
        } catch (e) {
          console.warn("Compression failed", e);
        }
      }

      const storageRef = ref(storage, `orders/${orderId}/customer/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, fileToUpload);

      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Upload error:", error);
          setUploading(false);
          alert("Upload failed. Please try again.");
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          const newFile: UploadedFile = {
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            url,
            uploadedAt: new Date().toISOString()
          };

          await updateDoc(doc(db, 'orders', orderId), {
            files: arrayUnion(newFile)
          });

          setOrder((prev: any) => ({
            ...prev,
            files: [...(prev.files || []), newFile]
          }));
          
          setUploading(false);
          setUploadProgress(0);
        }
      );
    } catch (error) {
      console.error("Error in upload flow:", error);
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-3xl font-black mb-4">Order Not Found</h1>
        <p className="text-slate-500 mb-8">We couldn't find the order you're looking for.</p>
        <Link to="/" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
      <div className="text-center space-y-4">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto"
        >
          <CheckCircle2 size={48} />
        </motion.div>
        <h1 className="text-5xl font-extrabold font-headline tracking-tight">
          {order.paymentMethod === 'cash' ? 'Order Placed!' : 'Payment Successful!'}
        </h1>
        <p className="text-xl text-slate-600">Your order <span className="font-black text-blue-600">#{order.id}</span> has been placed successfully.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
          <h2 className="text-2xl font-bold font-headline">Order Summary</h2>
          <div className="space-y-4">
            {order.items?.map((item: any, i: number) => (
              <div key={i} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0">
                <div>
                  <p className="font-black text-slate-900">{item.title}</p>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Qty: {item.quantity}</p>
                </div>
                <p className="font-black text-slate-900">₹{item.price * item.quantity}</p>
              </div>
            ))}
            <div className="pt-4 flex justify-between items-center border-t border-slate-100">
              <span className="font-bold text-slate-500">{order.paymentMethod === 'cash' ? 'Amount to Pay' : 'Total Paid'}</span>
              <span className="text-2xl font-black text-blue-600">₹{order.totalPrice}</span>
            </div>
            {order.paymentMethod === 'cash' && (
              <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl mt-4">
                <p className="text-xs font-bold text-amber-800 flex items-center gap-2">
                  <CheckCircle2 size={14} />
                  Cash on Pickup Selected
                </p>
                <p className="text-[10px] text-amber-700 mt-1">Please pay the amount at the store when you pick up your order.</p>
              </div>
            )}
          </div>
        </div>

        {/* File Upload Section */}
        <div className="bg-blue-900 text-white p-8 rounded-[2.5rem] shadow-xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-800 rounded-full -mr-16 -mt-16 opacity-50 blur-3xl" />
          
          <h2 className="text-2xl font-bold font-headline relative z-10">Upload Files</h2>
          <p className="text-blue-100 text-sm relative z-10">
            If you missed any files or want to add more documents for printing, you can upload them here.
          </p>

          <div className="space-y-4 relative z-10">
            {order.files?.map((file: any, i: number) => (
              <div key={i} className="flex items-center justify-between bg-white/10 p-3 rounded-xl border border-white/10">
                <div className="flex items-center gap-3 overflow-hidden">
                  <FileText size={18} className="text-blue-300 shrink-0" />
                  <span className="truncate text-xs font-bold">{file.name}</span>
                </div>
                <CheckCircle2 size={16} className="text-green-400 shrink-0" />
              </div>
            ))}

            <div className="relative group">
              <input 
                type="file" 
                onChange={handleFileUpload}
                disabled={uploading}
                className="absolute inset-0 opacity-0 cursor-pointer z-20"
              />
              <div className={`border-2 border-dashed border-blue-400/50 rounded-2xl p-6 text-center transition-all ${uploading ? 'bg-blue-800/50' : 'group-hover:bg-blue-800/30'}`}>
                {uploading ? (
                  <div className="space-y-3">
                    <Loader2 className="animate-spin mx-auto" size={24} />
                    <p className="text-xs font-bold">Uploading... {Math.round(uploadProgress)}%</p>
                    <div className="w-full bg-blue-950 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-400 h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="mx-auto text-blue-300" size={24} />
                    <p className="text-sm font-bold">Add More Files</p>
                    <p className="text-[10px] text-blue-300 uppercase tracking-widest font-black">PDF, Images, Docs</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-8">
        <Link to="/track-order" className="flex items-center gap-2 text-slate-600 font-bold hover:text-blue-600 transition-colors">
          Track Order Status <ArrowRight size={18} />
        </Link>
        <Link to="/" className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
          <ShoppingBag size={20} />
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
