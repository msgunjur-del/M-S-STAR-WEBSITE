import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { db, storage, auth } from '../firebase';
import { doc, getDoc, collection, query, where, limit, getDocs, updateDoc, arrayUnion, arrayRemove, addDoc, serverTimestamp, orderBy, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useCart } from '../context/CartContext';
import imageCompression from 'browser-image-compression';
import * as pdfjs from 'pdfjs-dist';
import ProductCard from '../components/ProductCard';
import { 
  ChevronRight, Upload, Eye, EyeOff, Plus, 
  ShoppingBag, CheckCircle2, Info, ShoppingBasket,
  ShieldAlert, Zap, ArrowRight, Loader2, X, Check,
  Heart, Star, MessageSquare, User,
  ShieldCheck, Cpu, Printer, Layers, Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Configure PDF.js worker using Vite's URL import
// @ts-ignore
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

interface UploadedFile {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'done' | 'error';
  url?: string;
  thumbnail?: string;
}

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, setIsCartOpen } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'description' | 'features' | 'reviews'>('description');
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  // Reviews State
  const [reviews, setReviews] = useState<any[]>([]);
  const [isEligibleToReview, setIsEligibleToReview] = useState(false);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const generateThumbnail = async (file: File): Promise<string | undefined> => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    
    if (file.type === 'application/pdf') {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);
        
        const viewport = page.getViewport({ scale: 0.5 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        if (context) {
          await (page as any).render({ canvasContext: context, viewport }).promise;
          return canvas.toDataURL();
        }
      } catch (error: any) {
        console.error('Error generating PDF thumbnail:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.log('Error type:', typeof error, 'Error:', error);
        
        const isPasswordError = 
          (error && typeof error === 'object' && 'name' in error && error.name === 'PasswordException') ||
          errorMessage.toLowerCase().includes('password') ||
          errorMessage.toLowerCase().includes('no password given');

        if (isPasswordError) {
          alert(`The file "${file.name}" is password protected. Please upload an unprotected file.`);
        }
      }
    }
    return undefined;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []) as File[];
    const newFiles: UploadedFile[] = selectedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      progress: 0,
      status: 'pending' as const
    }));
    
    setFiles(prev => [...prev, ...newFiles]);

    // Start uploading and generating thumbnails
    newFiles.forEach(fileObj => {
      uploadFile(fileObj);
      generateThumbnail(fileObj.file).then(thumbnail => {
        if (thumbnail) {
          setFiles(prev => prev.map(f => f.id === fileObj.id ? { ...f, thumbnail } : f));
        }
      });
    });
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
          initialQuality: 0.6,
          alwaysKeepResolution: true
        };
        try {
          fileToUpload = await imageCompression(fileToUpload, options);
        } catch (e) {
          console.warn("Compression failed, using original", e);
        }
      }

      const storageRef = ref(storage, `orders/temp/${Date.now()}_${fileObj.file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, fileToUpload);

      // Set status to uploading immediately
      setFiles(prev => prev.map(f => f.id === fileObj.id ? { ...f, status: 'uploading', progress: 0 } : f));

      // Safety Timeout: If stuck at 0% for 10 seconds, mark as error
      const timeoutId = setTimeout(() => {
        setFiles(prev => {
          const current = prev.find(f => f.id === fileObj.id);
          if (current && current.status === 'uploading' && (current.progress || 0) === 0) {
            console.error("Upload timed out");
            return prev.map(f => f.id === fileObj.id ? { ...f, status: 'error' } : f);
          }
          return prev;
        });
      }, 10000);

      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setFiles(prev => prev.map(f => f.id === fileObj.id ? { ...f, progress, status: 'uploading' } : f));
        },
        (error) => {
          clearTimeout(timeoutId);
          console.error("Upload error:", error);
          setFiles(prev => prev.map(f => f.id === fileObj.id ? { ...f, status: 'error' } : f));
        },
        async () => {
          clearTimeout(timeoutId);
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          setFiles(prev => prev.map(f => f.id === fileObj.id ? { ...f, url, status: 'done', progress: 100 } : f));
        }
      );
    } catch (error) {
      console.error("Process error:", error);
      setFiles(prev => prev.map(f => f.id === fileObj.id ? { ...f, status: 'error' } : f));
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const clearAllFiles = () => {
    setFiles([]);
  };

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
        name: f.file.name,
        url: f.url || ''
      }));

      addToCart({
        id: product.id || id!,
        title: product.title,
        price: product.price,
        quantity: 1,
        category: product.category,
        files: uploadedFiles,
        options: { password }
      });

      setShowSuccess(true);
      setFiles([]);
      setPassword('');
      setTimeout(() => setShowSuccess(false), 3000);

      // Cart will automatically open via CartContext
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to process files. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProduct = async () => {
      if (!id) return;
      
      const fallbacks: any = {
        'pvc-1': { title: 'Aadhar PVC Card Printing', price: 99, category: 'PVC CARDS', description: 'High-quality Aadhar card printing on durable PVC material.', imageUrl: 'https://images.unsplash.com/photo-1633265486064-086b219458ce?w=800&q=80' },
        'pvc-2': { title: 'PAN Card PVC Printing', price: 99, category: 'PVC CARDS', description: 'Get your PAN card printed on a premium PVC card.', imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80' },
        'pvc-3': { title: 'Voter ID PVC Card', price: 99, category: 'PVC CARDS', description: 'Durable and waterproof Voter ID PVC card printing.', imageUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&q=80' },
        'pvc-4': { title: 'Custom ID Card', price: 149, category: 'PVC CARDS', description: 'Custom ID cards for schools, colleges, and corporate offices.', imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&q=80' },
        'pvc-5': { title: 'PVC Smart ID Card', price: 75, category: 'PVC CARDS', description: 'Custom institutional or corporate employee IDs with HD print.', imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&q=80' },
        'photo-1': { title: 'Passport Size Photo (Set of 8)', price: 40, category: 'PHOTOS', description: 'Premium quality studio finish passport photos for all official uses.', imageUrl: '/images/sample-girl.png' },
        'photo-2': { title: '4x6 Photo Print', price: 15, category: 'PHOTOS', description: 'High-gloss 4x6 inch photographic memories for your albums.', imageUrl: '/images/sample-boy.png' },
        'photo-3': { title: 'Stamp Size Photo (Set of 16)', price: 30, category: 'PHOTOS', description: 'Set of 16 precision-cut stamp size photos for admission forms.', imageUrl: '/images/sample-6-4.png' }
      };

      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        let currentProductData = null;

        if (docSnap.exists()) {
          currentProductData = { id: docSnap.id, ...docSnap.data() } as any;
          setProduct(currentProductData);
          setSelectedImage(currentProductData.imageUrl || '');
        } else {
          if (fallbacks[id]) {
            currentProductData = { id, ...fallbacks[id] };
            setProduct(currentProductData);
            setSelectedImage(currentProductData.imageUrl);
          }
        }

        // Fetch related products
        if (currentProductData) {
          const q = query(
            collection(db, 'products'),
            where('category', '==', currentProductData.category),
            limit(5)
          );
          const querySnapshot = await getDocs(q);
          const related = querySnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(p => p.id !== id)
            .slice(0, 4);
          
          if (related.length > 0) {
            setRelatedProducts(related);
          } else {
            // If no related products in DB, use fallbacks from same category
            const categoryFallbacks = Object.entries(fallbacks)
              .filter(([fid, f]: [string, any]) => f.category === currentProductData.category && fid !== id)
              .map(([fid, f]: [string, any]) => ({ id: fid, ...f }))
              .slice(0, 4);
            setRelatedProducts(categoryFallbacks);
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        if (fallbacks[id]) {
          setProduct(fallbacks[id]);
          setSelectedImage(fallbacks[id].imageUrl);
        }
      }
    };
    fetchProduct();
    fetchReviews();
  }, [id]);

  const fetchReviews = async () => {
    if (!id) return;
    setReviewsLoading(true);
    try {
      const q = query(
        collection(db, 'reviews'),
        where('productId', '==', id),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const fetchedReviews = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReviews(fetchedReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const checkReviewEligibility = async (uid: string) => {
    if (!id) return;
    try {
      const q = query(
        collection(db, 'orders'),
        where('userId', '==', uid),
        where('status', '==', 'Delivered')
      );
      const querySnapshot = await getDocs(q);
      
      // Check if any delivered order contains this product
      const hasPurchased = querySnapshot.docs.some(doc => {
        const orderData = doc.data();
        return orderData.items?.some((item: any) => item.id === id || item.productId === id);
      });

      // Also check if user already reviewed
      const reviewQuery = query(
        collection(db, 'reviews'),
        where('productId', '==', id),
        where('userId', '==', uid)
      );
      const reviewSnapshot = await getDocs(reviewQuery);
      
      setIsEligibleToReview(hasPurchased && reviewSnapshot.empty);
    } catch (error) {
      console.error("Error checking review eligibility:", error);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id) return;
    if (reviewComment.trim().length < 5) {
      alert("Please write a more detailed review (at least 5 characters).");
      return;
    }

    setIsSubmittingReview(true);
    try {
      await addDoc(collection(db, 'reviews'), {
        productId: id,
        userId: user.uid,
        userName: user.displayName || 'Anonymous User',
        userPhoto: user.photoURL || '',
        rating: reviewRating,
        comment: reviewComment,
        createdAt: serverTimestamp()
      });

      setReviewComment('');
      setReviewRating(5);
      setIsReviewFormOpen(false);
      setIsEligibleToReview(false);
      fetchReviews();
      alert("Thank you for your review!");
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser && id) {
        checkWishlistStatus(currentUser.uid, id);
        checkReviewEligibility(currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, [id]);

  const checkWishlistStatus = async (uid: string, productId: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const wishlist = userDoc.data().wishlist || [];
        setIsInWishlist(wishlist.includes(productId));
      }
    } catch (error) {
      console.error("Error checking wishlist status:", error);
    }
  };

  const toggleWishlist = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setIsWishlistLoading(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      if (isInWishlist) {
        await setDoc(userRef, {
          wishlist: arrayRemove(id)
        }, { merge: true });
        setIsInWishlist(false);
      } else {
        await setDoc(userRef, {
          wishlist: arrayUnion(id)
        }, { merge: true });
        setIsInWishlist(true);
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      alert("Failed to update wishlist. Please try again.");
    } finally {
      setIsWishlistLoading(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-accent-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const gallery = Array.from(new Set([
    product.imageUrl, 
    ...(product.galleryImages || []),
    ...files.map(f => f.thumbnail || f.url).filter(Boolean)
  ])).filter(Boolean);

  return (
    <div className="min-h-screen bg-slate-50/30">
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
                <p className="text-xs text-slate-400 font-bold">Item added to your cart</p>
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
      {/* Header Section */}
      <div className="relative bg-ink py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1557683316-973673baf926?w=1600&q=80" 
            alt="Background" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-ink/50 to-ink"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <nav className="flex items-center gap-2 text-white/40 text-[10px] font-black uppercase tracking-widest mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={10} />
            <span className="text-white/80">{product.title}</span>
          </nav>
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest border border-white/10 backdrop-blur-md text-accent-amber">
              <Zap size={12} />
              <span>Premium Quality Service</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-white font-headline tracking-tighter leading-[0.9]">
              {product.title.split(' ').map((word: string, i: number) => (
                <span key={i} className={i === product.title.split(' ').length - 1 ? 'text-accent-amber' : ''}>
                  {word}{' '}
                </span>
              ))}
            </h1>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 w-1/2 h-full bg-accent-blue/20 blur-[120px] -rotate-12 translate-x-1/4 translate-y-1/4" />
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-20 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column - Gallery */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white border border-slate-100 rounded-[3rem] p-4 lg:p-8 shadow-xl shadow-slate-200/50">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Thumbnails */}
                <div className="flex md:flex-col gap-4 order-2 md:order-1 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0 scrollbar-hide">
                  {gallery.map((url, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => setSelectedImage(url)}
                      className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${selectedImage === url ? 'border-accent-blue ring-4 ring-accent-blue/10' : 'border-slate-100 hover:border-slate-300'}`}
                    >
                      <img 
                        src={url} 
                        alt="Thumbnail" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  ))}
                </div>

                {/* Main Image */}
                <div className="flex-1 bg-slate-50 rounded-[2rem] p-8 flex items-center justify-center min-h-[400px] lg:min-h-[500px] order-1 md:order-2">
                  <motion.div 
                    key={selectedImage}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative group"
                  >
                    <img 
                      src={selectedImage || product.imageUrl} 
                      alt={product.title} 
                      className="max-w-full max-h-[450px] object-contain rounded-xl drop-shadow-2xl transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Details Tabs */}
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="flex border-b border-slate-100 px-8 overflow-x-auto scrollbar-hide">
                {['description', 'features', 'reviews'].map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-8 py-6 font-black text-[10px] uppercase tracking-[0.2em] transition-all relative whitespace-nowrap ${activeTab === tab ? 'text-accent-blue' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    {tab}
                    {tab === 'reviews' && reviews.length > 0 && (
                      <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] transition-colors ${activeTab === tab ? 'bg-accent-blue/10 text-accent-blue' : 'bg-slate-100 text-slate-500'}`}>
                        {reviews.length}
                      </span>
                    )}
                    {activeTab === tab && <motion.div layoutId="tab" className="absolute bottom-0 left-0 w-full h-1 bg-accent-blue rounded-t-full" />}
                  </button>
                ))}
              </div>

              <div className="p-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {activeTab === 'description' ? (
                      <p className="text-lg text-slate-500 font-medium leading-relaxed">{product.description}</p>
                    ) : activeTab === 'features' ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(product.features || "High-quality material\nWaterproof and durable\nStandard size\nHigh-resolution printing").split('\n').map((feature: string, i: number) => (
                          <div key={i} className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="w-10 h-10 bg-accent-blue/5 text-accent-blue rounded-xl flex items-center justify-center flex-shrink-0">
                              <CheckCircle2 size={18} />
                            </div>
                            <span className="font-black text-ink text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-8">
                        {/* Review Summary & Action */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-slate-100">
                          <div className="space-y-2">
                            <div className="flex items-center gap-4">
                              <h3 className="text-4xl font-black text-ink">
                                {reviews.length > 0 
                                  ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
                                  : '0.0'}
                              </h3>
                              <div className="space-y-1">
                                <div className="flex gap-1 text-accent-amber">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Zap 
                                      key={star} 
                                      size={16} 
                                      fill={star <= (reviews.length > 0 ? Math.round(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length) : 0) ? "currentColor" : "none"} 
                                    />
                                  ))}
                                </div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Based on {reviews.length} reviews</p>
                              </div>
                            </div>
                          </div>

                          {isEligibleToReview && !isReviewFormOpen && (
                            <button 
                              onClick={() => setIsReviewFormOpen(true)}
                              className="bg-accent-blue text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center gap-2"
                            >
                              <Star size={18} />
                              Write a Review
                            </button>
                          )}
                        </div>

                        {/* Review Form */}
                        <AnimatePresence>
                          {isReviewFormOpen && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              <form onSubmit={handleSubmitReview} className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-6">
                                <div className="flex justify-between items-center">
                                  <h4 className="text-xl font-black text-ink">Your Review</h4>
                                  <button 
                                    type="button"
                                    onClick={() => setIsReviewFormOpen(false)}
                                    className="text-slate-400 hover:text-red-500 transition-colors"
                                  >
                                    <X size={20} />
                                  </button>
                                </div>

                                <div className="space-y-3">
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Rating</label>
                                  <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <button
                                        key={star}
                                        type="button"
                                        onClick={() => setReviewRating(star)}
                                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${reviewRating >= star ? 'bg-accent-amber text-white shadow-lg shadow-amber-100' : 'bg-white text-slate-300 border border-slate-100'}`}
                                      >
                                        <Zap size={24} fill={reviewRating >= star ? "currentColor" : "none"} />
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                <div className="space-y-3">
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Comment</label>
                                  <textarea 
                                    required
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                    placeholder="Share your experience with this product..."
                                    className="w-full p-5 bg-white border border-slate-200 rounded-2xl focus:border-accent-blue focus:ring-0 outline-none font-bold text-sm transition-all min-h-[120px]"
                                  />
                                </div>

                                <button 
                                  type="submit"
                                  disabled={isSubmittingReview}
                                  className="w-full bg-accent-blue text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                  {isSubmittingReview ? (
                                    <Loader2 className="animate-spin" size={24} />
                                  ) : (
                                    <>
                                      Submit Review
                                      <ArrowRight size={20} />
                                    </>
                                  )}
                                </button>
                              </form>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Reviews List */}
                        <div className="space-y-6">
                          {reviewsLoading ? (
                            <div className="flex justify-center py-12">
                              <Loader2 className="animate-spin text-accent-blue" size={32} />
                            </div>
                          ) : reviews.length > 0 ? (
                            reviews.map((review) => (
                              <div key={review.id} className="bg-white p-6 rounded-3xl border border-slate-50 space-y-4">
                                <div className="flex justify-between items-start">
                                  <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center">
                                      {review.userPhoto ? (
                                        <img src={review.userPhoto} alt={review.userName} className="w-full h-full object-cover" />
                                      ) : (
                                        <User className="text-slate-400" size={24} />
                                      )}
                                    </div>
                                    <div>
                                      <p className="font-black text-ink">{review.userName}</p>
                                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        {review.createdAt?.seconds 
                                          ? new Date(review.createdAt.seconds * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                                          : 'Just now'}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex gap-0.5 text-accent-amber">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Zap 
                                        key={star} 
                                        size={12} 
                                        fill={star <= review.rating ? "currentColor" : "none"} 
                                      />
                                    ))}
                                  </div>
                                </div>
                                <p className="text-slate-600 font-medium leading-relaxed">{review.comment}</p>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-12 space-y-4">
                              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                                <MessageSquare className="text-slate-300" size={32} />
                              </div>
                              <div className="space-y-1">
                                <p className="font-black text-ink">No reviews yet</p>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Be the first to share your experience!</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Service Details Section */}
              <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden p-10 space-y-10">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 bg-accent-blue/5 px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest text-accent-blue">
                    <Info size={14} />
                    <span>Service Details</span>
                  </div>
                  <h2 className="text-3xl font-black text-ink tracking-tight">Quality & Technical Specifications</h2>
                  <p className="text-slate-500 font-medium leading-relaxed">
                    We combine industrial-grade technology with premium materials to ensure your prints meet professional standards.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-accent-blue border border-slate-100 shadow-sm">
                      <Layers size={24} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-black text-ink">Material Standards</h3>
                      <p className="text-sm text-slate-500 font-medium leading-relaxed">
                        {product.category === 'PVC CARDS' 
                          ? 'CR80 standard high-density PVC for durable, waterproof smart cards with a premium finish.' 
                          : '75-100 GSM high-whiteness premium paper stock for crisp, professional documents.'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-accent-blue border border-slate-100 shadow-sm">
                      <Cpu size={24} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-black text-ink">Printing Technology</h3>
                      <p className="text-sm text-slate-500 font-medium leading-relaxed">
                        {product.category === 'PHOTOS' || product.category === 'PVC CARDS'
                          ? 'Epson High-Definition 6-color ink systems for vibrant, true-to-life color reproduction.'
                          : 'Industrial-grade Canon iR series laser printing for precision and high-speed documentation.'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-accent-blue border border-slate-100 shadow-sm">
                      <ShieldCheck size={24} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-black text-ink">Quality Assurance</h3>
                      <p className="text-sm text-slate-500 font-medium leading-relaxed">
                        CMYK calibrated workflows for 95% color accuracy and manual 3-point inspection (Alignment, Color, Surface).
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-accent-blue border border-slate-100 shadow-sm">
                      <Shield size={24} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-black text-ink">Data Privacy</h3>
                      <p className="text-sm text-slate-500 font-medium leading-relaxed">
                        Strict data security measures with automatic file purging from our servers 24 hours after delivery.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Purchase Options */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white p-8 lg:p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-8">
              <div className="space-y-2">
                <span className="text-[10px] font-black text-accent-blue uppercase tracking-widest bg-accent-blue/5 px-3 py-1 rounded-lg">
                  {product.category}
                </span>
                <h2 className="text-3xl font-black text-ink font-headline tracking-tight">{product.title}</h2>
              </div>

              {/* Warning Message */}
              {product.category === 'PVC CARDS' && (
                <div className="bg-accent-amber/5 border border-accent-amber/20 p-6 rounded-[2rem] space-y-3">
                  <div className="flex items-center gap-3 text-accent-amber">
                    <ShieldAlert size={20} />
                    <span className="font-black text-xs uppercase tracking-widest">Important Disclaimer</span>
                  </div>
                  <p className="text-xs text-amber-900/70 font-bold leading-relaxed">
                    We print exactly what you upload without any modifications. Ensure your file matches the product image. 
                    Read our <Link to="/terms-conditions" className="underline hover:text-amber-900">Terms & Conditions</Link> for more details.
                  </p>
                </div>
              )}

              {/* Upload Section */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Upload Your Documents</label>
                <div className="group border-2 border-dashed border-slate-200 rounded-[2rem] p-10 text-center bg-slate-50/50 hover:bg-slate-50 hover:border-accent-blue/50 transition-all relative cursor-pointer">
                  <input 
                    type="file" 
                    multiple 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    onChange={handleFileSelect}
                  />
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform relative">
                    <Upload className="text-accent-blue" size={32} />
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white text-[8px] font-black px-2 py-1 rounded-full shadow-lg animate-pulse">
                      FAST
                    </div>
                  </div>
                  <p className="text-ink font-black text-lg">Drop Files or Click</p>
                  <p className="text-slate-400 font-bold text-xs mt-1">Max 2MB per file • Unlimited files</p>
                  
                  {files.length > 0 && (
                    <div className="mt-6 space-y-3 relative z-10">
                      <div className="flex justify-between items-center px-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Files ({files.length})</span>
                        <button 
                          onClick={(e) => { e.stopPropagation(); clearAllFiles(); }}
                          className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline"
                        >
                          Clear All
                        </button>
                      </div>
                      {files.map((fileObj, i) => (
                        <div key={i} className="flex flex-col bg-white p-3 rounded-xl border border-slate-100 shadow-sm text-left">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 overflow-hidden">
                              <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center overflow-hidden border border-slate-100 shrink-0">
                                {fileObj.thumbnail ? (
                                  <img src={fileObj.thumbnail} alt="Preview" className="w-full h-full object-cover" />
                                ) : fileObj.status === 'done' ? (
                                  <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                                ) : fileObj.status === 'uploading' ? (
                                  <Loader2 size={16} className="text-accent-blue animate-spin shrink-0" />
                                ) : (
                                  <div className="w-4 h-4 rounded-full bg-slate-100 shrink-0" />
                                )}
                              </div>
                              <span className="truncate text-xs font-bold text-slate-700">{fileObj.file.name}</span>
                            </div>
                            <button 
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeFile(fileObj.id); }}
                              disabled={fileObj.status === 'uploading'}
                              className="text-slate-400 hover:text-red-500 transition-colors disabled:opacity-50"
                            >
                              <X size={16} />
                            </button>
                          </div>
                          {(fileObj.status === 'uploading' || fileObj.status === 'done' || fileObj.status === 'error') && (
                            <div className="space-y-1.5 mt-2">
                              <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                                <span className={
                                  fileObj.status === 'done' ? 'text-green-500' : 
                                  fileObj.status === 'error' ? 'text-red-500' : 
                                  'text-accent-blue'
                                }>
                                  {fileObj.status === 'done' ? 'Complete' : 
                                   fileObj.status === 'error' ? 'Failed' : 
                                   'Uploading...'}
                                </span>
                                <span className="text-slate-400">{Math.round(fileObj.progress || 0)}%</span>
                              </div>
                              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden relative">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${fileObj.progress || 0}%` }}
                                  transition={{ type: "spring", stiffness: 50, damping: 20 }}
                                  className={`h-full rounded-full relative ${
                                    fileObj.status === 'done' ? 'bg-green-500' : 
                                    fileObj.status === 'error' ? 'bg-red-500' : 
                                    'bg-accent-blue'
                                  }`}
                                >
                                  {fileObj.status === 'uploading' && (
                                    <motion.div 
                                      animate={{ x: ['-100%', '100%'] }}
                                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                    />
                                  )}
                                </motion.div>
                              </div>
                              {fileObj.status === 'error' && (
                                <button 
                                  onClick={() => uploadFile(fileObj)}
                                  className="text-[8px] font-black text-accent-blue uppercase tracking-widest hover:underline"
                                >
                                  Retry
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Password Section */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">File Security</label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="File Password (if any)" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl focus:border-accent-blue focus:ring-0 outline-none font-bold text-sm transition-all"
                    />
                    <button 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <button className="bg-accent-blue text-white w-16 h-16 rounded-2xl flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 shrink-0">
                    <Plus size={24} />
                  </button>
                </div>
              </div>

              {/* Pricing & Checkout */}
              <div className="pt-8 border-t border-slate-100 space-y-8">
                <div className="flex items-end justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Price</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-ink tracking-tighter">₹{product.price}</span>
                      <span className="text-xs font-bold text-slate-400">+ ₹40 Courier*</span>
                    </div>
                  </div>
                  <div className="w-14 h-14 bg-accent-amber/10 text-accent-amber rounded-2xl flex items-center justify-center">
                    <ShoppingBasket size={28} />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <motion.button 
                      whileHover={{ scale: !(isUploading || (files.length > 0 && files.some(f => f.status !== 'done'))) ? 1.02 : 1 }}
                      whileTap={{ scale: !(isUploading || (files.length > 0 && files.some(f => f.status !== 'done'))) ? 0.98 : 1 }}
                      onClick={handleAddToCart}
                      disabled={isUploading || (files.length > 0 && files.some(f => f.status !== 'done'))}
                      className="flex-1 bg-accent-blue text-white py-6 rounded-[2rem] font-black text-xl hover:bg-blue-700 transition-all shadow-[0_20px_50px_rgba(59,130,246,0.3)] flex items-center justify-center gap-3 group disabled:opacity-50"
                    >
                      {isUploading || (files.length > 0 && files.some(f => f.status !== 'done')) ? (
                        <div className="flex items-center gap-3">
                          <Loader2 className="animate-spin" size={24} />
                          <span>{files.some(f => f.status !== 'done') ? 'Uploading...' : 'Processing...'}</span>
                        </div>
                      ) : (
                        <>
                          Add to Cart
                          <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                        </>
                      )}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={toggleWishlist}
                      disabled={isWishlistLoading}
                      className={`w-20 h-20 rounded-[2rem] flex items-center justify-center transition-all shadow-lg shrink-0 ${
                        isInWishlist 
                          ? 'bg-red-500 text-white shadow-red-200' 
                          : 'bg-white border-2 border-slate-100 text-slate-300 hover:text-red-500 hover:border-red-100'
                      }`}
                      title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                    >
                      {isWishlistLoading ? (
                        <Loader2 size={24} className="animate-spin" />
                      ) : (
                        <Heart size={24} fill={isInWishlist ? "currentColor" : "none"} strokeWidth={isInWishlist ? 0 : 2.5} />
                      )}
                    </motion.button>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 space-y-3">
                    <div className="flex items-center gap-3 text-ink">
                      <ShieldAlert size={18} className="text-accent-amber" />
                      <span className="font-black text-[10px] uppercase tracking-widest">Final Confirmation</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold leading-relaxed">
                      By clicking purchase, you agree that the uploaded file is correct and ready for printing. No modifications will be made.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: <CheckCircle2 size={16} />, label: 'Verified Quality' },
                { icon: <ShoppingBag size={16} />, label: 'Secure Checkout' }
              ].map((badge, i) => (
                <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-3 shadow-sm">
                  <div className="text-accent-blue">{badge.icon}</div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 pb-24">
          <div className="flex items-center justify-between mb-12">
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-accent-blue">
                <ShoppingBag size={20} />
                <span className="font-black text-xs uppercase tracking-widest">You might also like</span>
              </div>
              <h2 className="text-4xl font-black text-ink font-headline tracking-tighter">Related Products</h2>
            </div>
            <Link 
              to={product.category === 'PVC CARDS' ? '/pvc-cards' : '/'} 
              className="group flex items-center gap-3 bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all"
            >
              <span className="font-black text-xs uppercase tracking-widest text-ink">View All</span>
              <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-accent-blue group-hover:text-white transition-all">
                <ArrowRight size={16} />
              </div>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                title={p.title}
                description={p.description}
                price={p.price}
                category={p.category}
                imageUrl={p.imageUrl}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

