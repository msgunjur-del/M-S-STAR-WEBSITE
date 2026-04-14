import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db, auth, storage } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { 
  LayoutDashboard, ShoppingCart, ClipboardList, FileText, Package, 
  CreditCard, Briefcase, Camera, File, Image as ImageIcon, Users, 
  Settings, LogOut, DollarSign, PackageOpen, Upload, ShieldCheck,
  Search, Download
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
  { name: 'Mon', revenue: 0 },
  { name: 'Tue', revenue: 0 },
  { name: 'Wed', revenue: 0 },
  { name: 'Thu', revenue: 2000 },
  { name: 'Fri', revenue: 500 },
  { name: 'Sat', revenue: 1000 },
  { name: 'Sun', revenue: 0 },
];

const recentUploads = [
  { name: 'Gemini_Generated_Image_ezvu9zezvu9zezvu...', date: '3/21/2026' },
  { name: 'Untitled-42 copy.jpg', date: '3/21/2026' },
  { name: 'untitled_43_copy_dimdcr4ect.jpg', date: '3/21/2026' },
  { name: 'untitled_42_copy_vggwhutu4g.jpg', date: '3/21/2026' },
  { name: 'SUDE2013.pdf', date: '3/21/2026' },
  { name: 'sova2007_j9hp0hehvc.pdf', date: '3/21/2026' },
  { name: 'SOVA2007.pdf', date: '3/21/2026' },
  { name: 'PAN.pdf', date: '3/21/2026' },
  { name: 'New Microsoft Word Document.docx', date: '3/21/2026' },
  { name: 'New Microsoft Word Document (6).docx', date: '3/21/2026' },
];

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({
    pricePerPrintBW: 2,
    pricePerPrintColor: 10,
    spiralBindingCost: 50,
    stapledBindingCost: 10,
    courierCharges: 40,
    pvcBasePrice: 99
  });
  const [user, setUser] = useState<any>(null);
  const [accessDenied, setAccessDenied] = useState(false);
  
  // Authentication State
  const [isAuthorized, setIsAuthorized] = useState(sessionStorage.getItem('admin_auth') === 'true');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const ADMIN_EMAIL = 'shankarboss3@gmail.com';

  // Existing state for Products/Orders
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [editingOrder, setEditingOrder] = useState<any | null>(null);
  const [viewingOrder, setViewingOrder] = useState<any | null>(null);
  const [newProduct, setNewProduct] = useState<any | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [uploadingOrderFile, setUploadingOrderFile] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser?.email === ADMIN_EMAIL) {
        setIsAuthorized(true);
        sessionStorage.setItem('admin_auth', 'true');
        fetchData();
      } else if (currentUser) {
        // Logged in but not admin
        setIsAuthorized(false);
        setAccessDenied(true);
      } else {
        // Not logged in
        setIsAuthorized(false);
        setAccessDenied(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsAuthenticating(true);
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      if (userCredential.user.email !== ADMIN_EMAIL) {
        setLoginError("Access denied. This account does not have administrative privileges.");
        await signOut(auth);
      }
    } catch (error: any) {
      console.error("Admin login error:", error);
      setLoginError("Invalid email or password.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoginError('');
    setIsAuthenticating(true);
    const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user.email !== ADMIN_EMAIL) {
        setLoginError("Access denied. This Google account is not authorized.");
        await signOut(auth);
      }
    } catch (error) {
      console.error("Google login error:", error);
      setLoginError("Failed to sign in with Google.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const fetchData = async () => {
    try {
      const productsSnapshot = await getDocs(collection(db, 'products'));
      setProducts(productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      
      const ordersSnapshot = await getDocs(collection(db, 'orders'));
      setOrders(ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const usersSnapshot = await getDocs(collection(db, 'users'));
      setUsers(usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const settingsSnap = await getDoc(doc(db, 'settings', 'global'));
      if (settingsSnap.exists()) {
        setSettings(settingsSnap.data());
      }
      
      setAccessDenied(false);
    } catch (error: any) {
      console.error("Error fetching admin data:", error);
      // No longer setting accessDenied here as we use local auth for UI
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setIsAuthorized(false);
    sessionStorage.removeItem('admin_auth');
    window.location.href = '/';
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isNewProduct: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingImage(true);
    try {
      const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      if (isNewProduct) {
        setNewProduct({ ...newProduct, imageUrl: downloadURL });
      } else {
        setEditingProduct({ ...editingProduct, imageUrl: downloadURL });
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>, product: any) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploadingGallery(true);
    try {
      const newImageUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const storageRef = ref(storage, `products/gallery/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        newImageUrls.push(downloadURL);
      }
      
      const updatedGallery = [...(product.galleryImages || []), ...newImageUrls];
      await updateDoc(doc(db, 'products', product.id), { 
        galleryImages: updatedGallery,
        adminKey: 'Ammu@6231' // Include secret key for rules bypass
      });
      fetchData();
    } catch (error) {
      console.error("Error uploading gallery images:", error);
      alert("Failed to upload gallery images.");
    } finally {
      setUploadingGallery(false);
    }
  };

  const removeGalleryImage = async (productId: string, imageUrl: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const updatedGallery = (product.galleryImages || []).filter((url: string) => url !== imageUrl);
    await updateDoc(doc(db, 'products', productId), { 
      galleryImages: updatedGallery,
      adminKey: 'Ammu@6231' // Include secret key for rules bypass
    });
    fetchData();
  };

  const handleOrderFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isDirect: boolean = false, isProcessed: boolean = false) => {
    const file = e.target.files?.[0];
    const targetOrder = isDirect ? viewingOrder : editingOrder;
    if (!file || !targetOrder) return;
    
    setUploadingOrderFile(true);
    try {
      const folder = isProcessed ? 'processed' : 'customer';
      const storageRef = ref(storage, `orders/${targetOrder.id}/${folder}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      const fileObj = { name: file.name, url: downloadURL, uploadedAt: new Date().toISOString() };
      
      if (isProcessed) {
        const newProcessedFiles = [...(targetOrder.processedFiles || []), fileObj];
        if (isDirect) {
          await updateDoc(doc(db, 'orders', targetOrder.id), {
            processedFiles: newProcessedFiles,
            adminKey: 'Ammu@6231'
          });
          setViewingOrder({ ...targetOrder, processedFiles: newProcessedFiles });
          fetchData();
        } else {
          setEditingOrder({ ...targetOrder, processedFiles: newProcessedFiles });
        }
      } else {
        const newFiles = [...(targetOrder.files || []), fileObj];
        if (isDirect) {
          await updateDoc(doc(db, 'orders', targetOrder.id), {
            files: newFiles,
            adminKey: 'Ammu@6231'
          });
          setViewingOrder({ ...targetOrder, files: newFiles });
          fetchData();
        } else {
          setEditingOrder({ ...targetOrder, files: newFiles });
        }
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file. Please try again.");
    } finally {
      setUploadingOrderFile(false);
    }
  };

  // --- Existing Functions ---
  const deleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteDoc(doc(db, 'products', id));
        fetchData();
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product. System admin permissions required.");
      }
    }
  };

  const addProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const imageUrl = newProduct.imageUrl || `https://images.unsplash.com/photo-1562564055-71e051d33c19?w=800&q=80`;
    await addDoc(collection(db, 'products'), {
      title: newProduct.title,
      description: newProduct.description,
      price: Number(newProduct.price),
      category: newProduct.category,
      imageUrl: imageUrl,
      adminKey: 'Ammu@6231'
    });
    setNewProduct(null);
    fetchData();
  };

  const updateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const imageUrl = editingProduct.imageUrl || `https://images.unsplash.com/photo-1562564055-71e051d33c19?w=800&q=80`;
    await updateDoc(doc(db, 'products', editingProduct.id), {
      title: editingProduct.title,
      description: editingProduct.description,
      price: Number(editingProduct.price),
      category: editingProduct.category,
      imageUrl: imageUrl,
      adminKey: 'Ammu@6231'
    });
    setEditingProduct(null);
    fetchData();
  };

  const updateOrderStatus = async (id: string, status: string) => {
    await updateDoc(doc(db, 'orders', id), { 
      status
    });
    fetchData();
  };

  const deleteOrder = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      try {
        await deleteDoc(doc(db, 'orders', id));
        fetchData();
      } catch (error) {
        console.error("Error deleting order:", error);
        alert("Failed to delete order.");
      }
    }
  };

  const updateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, 'settings', 'global'), {
        ...settings,
        adminKey: 'Ammu@6231'
      });
      alert("Settings updated successfully!");
      fetchData();
    } catch (error) {
      console.error("Error updating settings:", error);
      // If document doesn't exist, create it
      const { setDoc } = await import('firebase/firestore');
      await setDoc(doc(db, 'settings', 'global'), {
        ...settings,
        adminKey: 'Ammu@6231'
      });
      alert("Settings initialized and updated!");
      fetchData();
    }
  };

  const updateOrderDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;
    try {
      await updateDoc(doc(db, 'orders', editingOrder.id), {
        customerName: editingOrder.customerName || '',
        customerEmail: editingOrder.customerEmail || '',
        customerPhone: editingOrder.customerPhone || '',
        deliveryAddress: editingOrder.deliveryAddress || '',
        totalPrice: Number(editingOrder.totalPrice) || 0,
        items: editingOrder.items || [],
        files: editingOrder.files || [],
        processedFiles: editingOrder.processedFiles || [],
        trackingNumber: editingOrder.trackingNumber || '',
        adminKey: 'Ammu@6231'
      });
      setEditingOrder(null);
      fetchData();
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    const orderDate = new Date(order.createdAt?.seconds * 1000 || 0);
    const matchesStartDate = !startDate || orderDate >= new Date(startDate);
    const end = endDate ? new Date(endDate) : null;
    if (end) end.setHours(23, 59, 59, 999);
    const matchesEndDate = !end || orderDate <= end;
    const matchesSearch = !searchQuery || 
      order.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      order.customerEmail?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesStartDate && matchesEndDate && matchesSearch;
  });

  // --- Dashboard Stats ---
  const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.totalPrice) || 0), 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'Pending' || !o.status).length;
  
  // Daily Sales (Today)
  const today = new Date().toLocaleDateString();
  const todaySales = orders.filter(o => {
    if (!o.createdAt) return false;
    const orderDate = o.createdAt.toDate ? o.createdAt.toDate().toLocaleDateString() : new Date(o.createdAt).toLocaleDateString();
    return orderDate === today;
  }).reduce((sum, o) => sum + (Number(o.totalPrice) || 0), 0);

  // Top Products
  const productCounts: { [key: string]: { count: number, revenue: number } } = {};
  orders.forEach(order => {
    (order.items || []).forEach((item: any) => {
      if (!productCounts[item.title]) {
        productCounts[item.title] = { count: 0, revenue: 0 };
      }
      productCounts[item.title].count += (item.quantity || 1);
      productCounts[item.title].revenue += (Number(item.price) * (item.quantity || 1));
    });
  });

  const topProducts = Object.entries(productCounts)
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const totalFiles = orders.reduce((sum, o) => sum + (o.files?.length || 0), 0);

  const renderSidebarItem = (name: string, Icon: any) => (
    <button 
      onClick={() => setActiveTab(name)}
      className={`w-full flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
        activeTab === name 
          ? 'bg-blue-900 text-white rounded-r-full mr-4' 
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      <Icon size={18} />
      {name}
    </button>
  );

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-900">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-slate-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3">
              <Settings size={32} />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 font-headline">Admin Access</h1>
            <p className="text-slate-500 mt-2">Enter your credentials to manage msstar</p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Admin Email</label>
              <input 
                type="email" 
                value={loginEmail} 
                onChange={e => setLoginEmail(e.target.value)} 
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                placeholder="admin@example.com"
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Password</label>
              <input 
                type="password" 
                value={loginPassword} 
                onChange={e => setLoginPassword(e.target.value)} 
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                placeholder="••••••••"
                required 
              />
            </div>

            {loginError && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-medium border border-red-100 animate-shake">
                {loginError}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isAuthenticating}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isAuthenticating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Authenticating...
                </>
              ) : 'Login to Dashboard'}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-xs font-bold uppercase">
              <span className="bg-white px-4 text-slate-400">Or</span>
            </div>
          </div>

          <button 
            onClick={handleGoogleLogin}
            disabled={isAuthenticating}
            className="w-full bg-white border border-slate-200 text-slate-700 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/pwa/google.svg" alt="Google" className="w-5 h-5" />
            Sign in with Google
          </button>

          <div className="mt-8 text-center">
            <Link to="/" className="text-sm text-slate-400 hover:text-blue-600 font-medium transition-colors">
              ← Back to Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-6 bg-slate-50 -mt-24 pt-24">
        <div className="bg-white p-12 rounded-3xl shadow-xl text-center max-w-md border border-slate-100">
          <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <LogOut size={32} />
          </div>
          <h1 className="text-3xl font-extrabold font-headline mb-4">Access Denied</h1>
          <p className="text-slate-600 mb-4">You do not have permission to view the Admin Panel. Please sign in with an administrator account.</p>
          {user && (
            <p className="text-sm font-bold text-slate-900 mb-8 bg-slate-100 p-3 rounded-lg">
              Currently logged in as: <br/><span className="text-blue-600">{user.email}</span>
            </p>
          )}
          <button onClick={() => window.location.href = '/dashboard'} className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition-colors w-full">
            Go to User Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 -mt-24 pt-24">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full z-40">
        <div className="p-6">
          <h1 className="text-2xl font-extrabold text-blue-900 tracking-tight">msstar Admin</h1>
          <p className="text-xs text-slate-500 mt-1">Management Portal</p>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 space-y-1 pr-4">
          {renderSidebarItem('Dashboard', LayoutDashboard)}
          {renderSidebarItem('Orders', ShoppingCart)}
          {renderSidebarItem('Service Orders', ClipboardList)}
          {renderSidebarItem('Files', FileText)}
          {renderSidebarItem('Products', Package)}
          {renderSidebarItem('PVC Services', CreditCard)}
          {renderSidebarItem('Other Services', Briefcase)}
          {renderSidebarItem('Service Photos', Camera)}
          {renderSidebarItem('Pages', File)}
          {renderSidebarItem('Banners', ImageIcon)}
          {renderSidebarItem('Users', Users)}
          {renderSidebarItem('Settings', Settings)}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
              {user?.email?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 truncate w-32">{user?.email || 'admin@example.com'}</p>
              <p className="text-xs text-slate-500">Admin</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {activeTab === 'Dashboard' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold font-headline text-slate-900">Dashboard Overview</h2>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-sm border-l-4 border-l-blue-600">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Total Revenue</p>
                    <h3 className="text-2xl font-bold text-slate-900">₹{totalRevenue.toFixed(2)}</h3>
                    <p className="text-xs text-slate-400 mt-2">Life time earnings</p>
                  </div>
                  <DollarSign className="text-blue-600" size={20} />
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-green-200 shadow-sm border-l-4 border-l-green-500">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Today's Sales</p>
                    <h3 className="text-2xl font-bold text-slate-900">₹{todaySales.toFixed(2)}</h3>
                    <p className="text-xs text-slate-400 mt-2">Revenue generated today</p>
                  </div>
                  <Briefcase className="text-green-500" size={20} />
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-amber-200 shadow-sm border-l-4 border-l-amber-500">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Pending Orders</p>
                    <h3 className="text-2xl font-bold text-slate-900">{pendingOrders}</h3>
                    <p className="text-xs text-slate-400 mt-2">Requires attention</p>
                  </div>
                  <PackageOpen className="text-amber-500" size={20} />
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-slate-400">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Customer Files</p>
                    <h3 className="text-2xl font-bold text-slate-900">{totalFiles}</h3>
                    <p className="text-xs text-slate-400 mt-2">Total uploads received</p>
                  </div>
                  <FileText className="text-slate-500" size={20} />
                </div>
              </div>
            </div>

            {/* Charts & Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <span className="text-blue-600">↗</span> Revenue Overview (Last 7 Days)
                </h3>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(value) => `₹${value}`} />
                      <Tooltip />
                      <Area type="monotone" dataKey="revenue" stroke="#1e3a8a" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <span className="text-amber-500">★</span> Top Selling Products
                </h3>
                <div className="space-y-4">
                  {topProducts.length > 0 ? topProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-xs">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 truncate max-w-[120px]">{product.name}</p>
                          <p className="text-[10px] text-slate-500 font-bold">{product.count} orders</p>
                        </div>
                      </div>
                      <p className="text-sm font-black text-slate-900">₹{product.revenue.toFixed(0)}</p>
                    </div>
                  )) : (
                    <p className="text-sm text-slate-500 text-center py-12">No sales data yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold font-headline text-slate-900">Manage Products</h2>
              <button onClick={() => setNewProduct({ title: '', description: '', price: '', category: 'PVC CARDS', imageUrl: '' })} className="bg-blue-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-800 transition-colors">Add New Product</button>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="p-4 font-medium">Image</th>
                    <th className="p-4 font-medium">Product Name</th>
                    <th className="p-4 font-medium">Category</th>
                    <th className="p-4 font-medium">Price</th>
                    <th className="p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.length > 0 ? (
                    products.map(product => (
                      <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4">
                          <img 
                            src={product.imageUrl || `https://images.unsplash.com/photo-1562564055-71e051d33c19?w=100&q=80`} 
                            alt={product.title} 
                            className="w-12 h-12 object-cover rounded-lg border border-slate-100" 
                            referrerPolicy="no-referrer" 
                          />
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-slate-900">{product.title}</p>
                          <p className="text-xs text-slate-500 truncate max-w-[200px]">{product.description}</p>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold uppercase tracking-wider">
                            {product.category}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-blue-700">₹{product.price}</td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button onClick={() => setEditingProduct(product)} className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-100">Edit</button>
                            <button onClick={() => deleteProduct(product.id)} className="bg-red-50 text-red-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-100">Remove</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500">No products found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'Orders' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold font-headline text-slate-900">Manage Orders</h2>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-center">
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by name or email..." className="border border-slate-200 rounded-lg p-2 text-sm flex-1 min-w-[200px]" />
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-slate-200 rounded-lg p-2 text-sm">
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">From:</span>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="border border-slate-200 rounded-lg p-2 text-sm" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">To:</span>
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="border border-slate-200 rounded-lg p-2 text-sm" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="p-4 font-medium">Customer & Order ID</th>
                    <th className="p-4 font-medium">Email</th>
                    <th className="p-4 font-medium">Date/Time</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map(order => (
                      <React.Fragment key={order.id}>
                        <tr className="hover:bg-slate-50 transition-colors">
                          <td className="p-4">
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-900">{order.customerName || 'N/A'}</span>
                              <span className="font-mono text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded self-start mt-1">
                                #{order.id}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 text-slate-600">{order.customerEmail || 'N/A'}</td>
                          <td className="p-4 text-slate-500 text-xs">
                            {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleString() : 'N/A'}
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                              order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                              order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                              order.status === 'Ready' ? 'bg-indigo-100 text-indigo-700' :
                              order.status === 'Printing' ? 'bg-purple-100 text-purple-700' :
                              order.status === 'Processing' ? 'bg-sky-100 text-sky-700' :
                              'bg-amber-100 text-amber-700'
                            }`}>
                              {order.status || 'Pending'}
                            </span>
                          </td>
                          <td className="p-4 flex gap-2">
                            <button onClick={() => setViewingOrder(order)} className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-200">
                              View
                            </button>
                            <button onClick={() => setEditingOrder(JSON.parse(JSON.stringify(order)))} className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-100">
                              Edit
                            </button>
                            <select onChange={(e) => updateOrderStatus(order.id, e.target.value)} value={order.status || 'Pending'} className="border border-slate-200 rounded-lg p-1.5 text-xs bg-white font-bold">
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Printing">Printing</option>
                              <option value="Ready">Ready</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                            <button onClick={() => deleteOrder(order.id)} className="bg-red-50 text-red-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-100">
                              Delete
                            </button>
                          </td>
                        </tr>
                      </React.Fragment>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500">No orders found matching your criteria.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'PVC Services' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold font-headline text-slate-900">PVC Card Services</h2>
              <button onClick={() => setNewProduct({ title: '', description: '', price: '', category: 'PVC CARDS', imageUrl: '' })} className="bg-blue-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-800 transition-colors">Add New PVC Card</button>
            </div>
            
            <div className="grid grid-cols-1 gap-8">
              {products.filter(p => p.category === 'PVC CARDS').map(product => (
                <div key={product.id} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <img src={product.imageUrl || `https://images.unsplash.com/photo-1562564055-71e051d33c19?w=400&q=80`} alt={product.title} className="w-32 h-32 object-cover rounded-xl border border-slate-100" referrerPolicy="no-referrer" />
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-slate-900">{product.title}</h3>
                      <p className="text-slate-600 mt-1">{product.description}</p>
                      <p className="text-blue-700 font-bold mt-2">₹{product.price}</p>
                      <div className="flex gap-3 mt-4">
                        <button onClick={() => setEditingProduct(product)} className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors">Edit Details</button>
                        <button onClick={() => deleteProduct(product.id)} className="bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors">Delete</button>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-6">
                    <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <ImageIcon size={18} className="text-blue-600" />
                      Product Gallery (Multi-Image Upload)
                    </h4>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
                      {product.galleryImages?.map((url: string, idx: number) => (
                        <div key={idx} className="relative group">
                          <img src={url} alt={`Gallery ${idx}`} className="w-full h-24 object-cover rounded-lg border border-slate-200" referrerPolicy="no-referrer" />
                          <button 
                            onClick={() => removeGalleryImage(product.id, url)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      
                      <div className="relative border-2 border-dashed border-slate-200 rounded-lg h-24 flex flex-col items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer">
                        <Upload size={20} className="text-slate-400 mb-1" />
                        <span className="text-[10px] text-slate-500 font-bold">{uploadingGallery ? 'Uploading...' : 'Add Images'}</span>
                        <input 
                          type="file" 
                          multiple 
                          accept="image/*" 
                          onChange={(e) => handleGalleryUpload(e, product)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          disabled={uploadingGallery}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 italic">These images will be displayed as thumbnails on the product details page.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Files' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold font-headline text-slate-900">All Customer Files</h2>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search files..." 
                    className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="p-4 font-medium">File Name</th>
                    <th className="p-4 font-medium">Order ID</th>
                    <th className="p-4 font-medium">Customer</th>
                    <th className="p-4 font-medium">Date/Time</th>
                    <th className="p-4 font-medium">Password</th>
                    <th className="p-4 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.flatMap(o => (o.files || []).map((f: any) => ({ 
                    ...f, 
                    orderId: o.id, 
                    customerName: o.customerName,
                    createdAt: o.createdAt,
                    password: o.options?.password || 'N/A' // Assuming password might be in options
                  })))
                  .filter(f => !searchQuery || f.name.toLowerCase().includes(searchQuery.toLowerCase()) || f.orderId.toLowerCase().includes(searchQuery.toLowerCase()))
                  .length > 0 ? (
                    orders.flatMap(o => (o.files || []).map((f: any) => ({ 
                      ...f, 
                      orderId: o.id, 
                      customerName: o.customerName,
                      createdAt: o.createdAt,
                      password: o.options?.password || 'N/A'
                    })))
                    .filter(f => !searchQuery || f.name.toLowerCase().includes(searchQuery.toLowerCase()) || f.orderId.toLowerCase().includes(searchQuery.toLowerCase()))
                    .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
                    .map((file, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded flex items-center justify-center">
                              <FileText size={16} />
                            </div>
                            <span className="font-bold text-slate-900 truncate max-w-[250px]">{file.name}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <button 
                            onClick={() => {
                              const order = orders.find(o => o.id === file.orderId);
                              if (order) setViewingOrder(order);
                            }}
                            className="font-mono text-xs text-blue-600 hover:underline"
                          >
                            #{file.orderId}
                          </button>
                        </td>
                        <td className="p-4 text-slate-600 font-medium">{file.customerName || 'N/A'}</td>
                        <td className="p-4 text-slate-400 text-xs">
                          {file.createdAt?.toDate ? file.createdAt.toDate().toLocaleString() : 'N/A'}
                        </td>
                        <td className="p-4 text-slate-900 font-mono text-xs font-bold">
                          {file.password}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            {file.url ? (
                              <a href={file.url} target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-700 flex items-center gap-1.5">
                                <Download size={12} />
                                Download
                              </a>
                            ) : (
                              <span className="text-xs text-red-500 font-bold">URL Missing</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500">No files found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'Users' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold font-headline text-slate-900">Registered Users</h2>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="p-4 font-medium">Name</th>
                    <th className="p-4 font-medium">Email</th>
                    <th className="p-4 font-medium">Role</th>
                    <th className="p-4 font-medium">Joined At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.length > 0 ? (
                    users.map(u => (
                      <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs">
                              {u.displayName?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <span className="font-bold text-slate-900">{u.displayName || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="p-4 text-slate-600">{u.email}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${u.role === 'admin' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                            {u.role || 'customer'}
                          </span>
                        </td>
                        <td className="p-4 text-slate-500 text-xs">
                          {u.createdAt?.toDate ? u.createdAt.toDate().toLocaleDateString() : new Date(u.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-slate-500">No users found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'Settings' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold font-headline text-slate-900">Global Settings & Pricing</h2>
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm max-w-2xl">
              <form onSubmit={updateSettings} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Price Per Print (B&W)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                      <input 
                        type="number" 
                        value={settings.pricePerPrintBW} 
                        onChange={e => setSettings({...settings, pricePerPrintBW: Number(e.target.value)})}
                        className="w-full pl-8 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Price Per Print (Color)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                      <input 
                        type="number" 
                        value={settings.pricePerPrintColor} 
                        onChange={e => setSettings({...settings, pricePerPrintColor: Number(e.target.value)})}
                        className="w-full pl-8 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Spiral Binding Cost</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                      <input 
                        type="number" 
                        value={settings.spiralBindingCost} 
                        onChange={e => setSettings({...settings, spiralBindingCost: Number(e.target.value)})}
                        className="w-full pl-8 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Stapled Binding Cost</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                      <input 
                        type="number" 
                        value={settings.stapledBindingCost} 
                        onChange={e => setSettings({...settings, stapledBindingCost: Number(e.target.value)})}
                        className="w-full pl-8 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Courier Charges</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                      <input 
                        type="number" 
                        value={settings.courierCharges} 
                        onChange={e => setSettings({...settings, courierCharges: Number(e.target.value)})}
                        className="w-full pl-8 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">PVC Base Price</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                      <input 
                        type="number" 
                        value={settings.pvcBasePrice} 
                        onChange={e => setSettings({...settings, pvcBasePrice: Number(e.target.value)})}
                        className="w-full pl-8 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                      />
                    </div>
                  </div>
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                  Save All Settings
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Placeholder for other tabs */}
        {!['Dashboard', 'Products', 'Orders', 'PVC Services', 'Settings'].includes(activeTab) && (
          <div className="flex flex-col items-center justify-center h-96 text-slate-500 space-y-4">
            <LayoutDashboard size={48} className="opacity-20" />
            <h2 className="text-2xl font-bold text-slate-400">{activeTab} Module</h2>
            <p>This section is currently under development.</p>
          </div>
        )}
      </main>

      {/* Modals for Add/Edit Product */}
      {newProduct && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <form onSubmit={addProduct} className="bg-white p-8 rounded-2xl w-full max-w-lg space-y-4 shadow-xl">
            <h2 className="text-2xl font-bold text-slate-900">Add New Product</h2>
            <input type="text" value={newProduct.title} onChange={e => setNewProduct({...newProduct, title: e.target.value})} className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Title" required />
            <textarea value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Description" required rows={3} />
            <input type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Price" required />
            <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="PVC CARDS">PVC CARDS</option>
              <option value="PHOTOS">PHOTOS</option>
              <option value="DOCUMENTS">DOCUMENTS</option>
            </select>
            
            <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center relative hover:bg-slate-50 transition-colors">
              {newProduct.imageUrl ? (
                <div className="relative inline-block">
                  <img src={newProduct.imageUrl} alt="Preview" className="h-32 object-contain rounded" />
                  <button type="button" onClick={() => setNewProduct({...newProduct, imageUrl: ''})} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-sm hover:bg-red-600">×</button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="mx-auto text-slate-400" size={24} />
                  <p className="text-sm text-slate-500">{uploadingImage ? 'Uploading...' : 'Click to upload product image'}</p>
                </div>
              )}
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => handleImageUpload(e, true)} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={uploadingImage}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button type="button" onClick={() => setNewProduct(null)} className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-lg font-bold hover:bg-slate-200 transition-colors">Cancel</button>
              <button type="submit" disabled={uploadingImage} className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50">Add Product</button>
            </div>
          </form>
        </div>
      )}

      {editingProduct && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <form onSubmit={updateProduct} className="bg-white p-8 rounded-2xl w-full max-w-lg space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-slate-900">Edit Product</h2>
            <input type="text" value={editingProduct.title} onChange={e => setEditingProduct({...editingProduct, title: e.target.value})} className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Title" required />
            <textarea value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Description" required rows={3} />
            <input type="number" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: e.target.value})} className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Price" required />
            <select value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})} className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="PVC CARDS">PVC CARDS</option>
              <option value="PHOTOS">PHOTOS</option>
              <option value="DOCUMENTS">DOCUMENTS</option>
            </select>

            <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center relative hover:bg-slate-50 transition-colors">
              {editingProduct.imageUrl ? (
                <div className="relative inline-block">
                  <img src={editingProduct.imageUrl} alt="Preview" className="h-32 object-contain rounded" />
                  <button type="button" onClick={() => setEditingProduct({...editingProduct, imageUrl: ''})} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-sm hover:bg-red-600">×</button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="mx-auto text-slate-400" size={24} />
                  <p className="text-sm text-slate-500">{uploadingImage ? 'Uploading...' : 'Click to upload new image'}</p>
                </div>
              )}
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => handleImageUpload(e, false)} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={uploadingImage}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button type="button" onClick={() => setEditingProduct(null)} className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-lg font-bold hover:bg-slate-200 transition-colors">Cancel</button>
              <button type="submit" disabled={uploadingImage} className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50">Save Changes</button>
            </div>
          </form>
        </div>
      )}

      {editingOrder && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <form onSubmit={updateOrderDetails} className="bg-white p-8 rounded-2xl w-full max-w-2xl space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-slate-900">Edit Order #{editingOrder.id}</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Customer Name</label>
                <input type="text" value={editingOrder.customerName || ''} onChange={e => setEditingOrder({...editingOrder, customerName: e.target.value})} className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Customer Email</label>
                <input type="email" value={editingOrder.customerEmail || ''} onChange={e => setEditingOrder({...editingOrder, customerEmail: e.target.value})} className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <input type="text" value={editingOrder.customerPhone || ''} onChange={e => setEditingOrder({...editingOrder, customerPhone: e.target.value})} className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Total Price (₹)</label>
                <input type="number" value={editingOrder.totalPrice || 0} onChange={e => setEditingOrder({...editingOrder, totalPrice: e.target.value})} className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Delivery Address</label>
              <textarea value={editingOrder.deliveryAddress || ''} onChange={e => setEditingOrder({...editingOrder, deliveryAddress: e.target.value})} className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" rows={3} />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Items</label>
              {editingOrder.items?.map((item: any, index: number) => (
                <div key={index} className="flex gap-2 items-center">
                  <input type="text" value={item.title || ''} onChange={(e) => {
                    const newItems = [...(editingOrder.items || [])];
                    newItems[index].title = e.target.value;
                    setEditingOrder({...editingOrder, items: newItems});
                  }} className="flex-1 p-2 border border-slate-200 rounded-lg text-sm" placeholder="Item Title" />
                  <input type="number" value={item.quantity || 0} onChange={(e) => {
                    const newItems = [...(editingOrder.items || [])];
                    newItems[index].quantity = Number(e.target.value);
                    setEditingOrder({...editingOrder, items: newItems});
                  }} className="w-20 p-2 border border-slate-200 rounded-lg text-sm" placeholder="Qty" />
                  <input type="number" value={item.price || 0} onChange={(e) => {
                    const newItems = [...(editingOrder.items || [])];
                    newItems[index].price = Number(e.target.value);
                    setEditingOrder({...editingOrder, items: newItems});
                  }} className="w-24 p-2 border border-slate-200 rounded-lg text-sm" placeholder="Price" />
                  <button type="button" onClick={() => {
                    const newItems = editingOrder.items.filter((_: any, i: number) => i !== index);
                    setEditingOrder({...editingOrder, items: newItems});
                  }} className="p-2 text-red-600 hover:bg-red-50 rounded-lg font-bold">X</button>
                </div>
              ))}
              <button type="button" onClick={() => {
                setEditingOrder({...editingOrder, items: [...(editingOrder.items || []), {title: 'New Item', quantity: 1, price: 0}]});
              }} className="text-sm text-blue-600 font-bold hover:underline">+ Add Item</button>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Attached Files</label>
              <div className="space-y-2">
                {editingOrder.files?.map((file: any, index: number) => (
                  <div key={index} className="flex justify-between items-center p-2 border border-slate-200 rounded-lg text-sm">
                    <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate max-w-[80%] flex items-center gap-2">
                      <FileText size={14} />
                      {file.name}
                    </a>
                    <button type="button" onClick={() => {
                      const newFiles = editingOrder.files.filter((_: any, i: number) => i !== index);
                      setEditingOrder({...editingOrder, files: newFiles});
                    }} className="text-red-600 hover:bg-red-50 p-1 rounded font-bold">X</button>
                  </div>
                ))}
                <div className="relative border-2 border-dashed border-slate-200 rounded-lg p-4 text-center hover:bg-slate-50 transition-colors">
                  <p className="text-sm text-slate-500">{uploadingOrderFile ? 'Uploading...' : '+ Upload File (Design, Document, etc.)'}</p>
                  <input 
                    type="file" 
                    onChange={(e) => handleOrderFileUpload(e, false)} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={uploadingOrderFile}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tracking Number / Courier ID</label>
              <input type="text" value={editingOrder.trackingNumber || ''} onChange={e => setEditingOrder({...editingOrder, trackingNumber: e.target.value})} className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Enter tracking number if shipped" />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Processed Files (For Customer Download)</label>
              <div className="space-y-2">
                {editingOrder.processedFiles?.map((file: any, index: number) => (
                  <div key={index} className="flex justify-between items-center p-2 border border-green-200 bg-green-50 rounded-lg text-sm">
                    <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-green-700 hover:underline truncate max-w-[80%] flex items-center gap-2">
                      <ShieldCheck size={14} />
                      {file.name}
                    </a>
                    <button type="button" onClick={() => {
                      const newFiles = editingOrder.processedFiles.filter((_: any, i: number) => i !== index);
                      setEditingOrder({...editingOrder, processedFiles: newFiles});
                    }} className="text-red-600 hover:bg-red-50 p-1 rounded font-bold">X</button>
                  </div>
                ))}
                <div className="relative border-2 border-dashed border-green-200 rounded-lg p-4 text-center hover:bg-green-50 transition-colors">
                  <p className="text-sm text-green-600 font-bold">{uploadingOrderFile ? 'Uploading...' : '+ Upload Processed File (Final Print/Design)'}</p>
                  <input 
                    type="file" 
                    onChange={(e) => handleOrderFileUpload(e, false, true)} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={uploadingOrderFile}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button type="button" onClick={() => setEditingOrder(null)} className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-lg font-bold hover:bg-slate-200 transition-colors">Cancel</button>
              <button type="submit" disabled={uploadingOrderFile} className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50">Save Order</button>
            </div>
          </form>
        </div>
      )}

      {viewingOrder && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-white p-8 rounded-2xl w-full max-w-2xl space-y-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-slate-900">Order Details</h2>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  viewingOrder.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {viewingOrder.status || 'Pending'}
                </span>
              </div>
              <button onClick={() => setViewingOrder(null)} className="text-slate-400 hover:text-slate-600 font-bold text-xl">&times;</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Customer Information</h3>
                <div className="space-y-2 text-sm">
                  <p><strong className="text-slate-700">Order ID:</strong> <span className="text-slate-600">{viewingOrder.id}</span></p>
                  <p><strong className="text-slate-700">Name:</strong> <span className="text-slate-600">{viewingOrder.customerName || 'N/A'}</span></p>
                  <p><strong className="text-slate-700">Email:</strong> <span className="text-slate-600">{viewingOrder.customerEmail}</span></p>
                  <p><strong className="text-slate-700">Phone:</strong> <span className="text-slate-600">{viewingOrder.customerPhone || 'N/A'}</span></p>
                  <p><strong className="text-slate-700">Address:</strong> <span className="text-slate-600">{viewingOrder.deliveryAddress || 'N/A'}</span></p>
                  <p><strong className="text-slate-700">Delivery:</strong> <span className="text-slate-600">{viewingOrder.deliveryMethod || 'Home Delivery'}</span></p>
                  <p><strong className="text-slate-700">Tracking:</strong> <span className="text-blue-600 font-bold">{viewingOrder.trackingNumber || 'Not Shipped'}</span></p>
                  <p><strong className="text-slate-700">Payment Status:</strong> <span className={`font-bold ${viewingOrder.paymentStatus?.includes('Pending') ? 'text-amber-600' : 'text-green-600'}`}>{viewingOrder.paymentStatus || 'Paid'}</span></p>
                  <p><strong className="text-slate-700">Payment Method:</strong> <span className="text-slate-600 uppercase text-xs font-bold">{viewingOrder.paymentMethod || 'Online'}</span></p>
                  <p><strong className="text-slate-700">Status:</strong> <span className="text-slate-600">{viewingOrder.status || 'Pending'}</span></p>
                  <p><strong className="text-slate-700">Total Price:</strong> <span className="text-slate-900 font-bold text-lg">₹{viewingOrder.totalPrice}</span></p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Items Ordered</h3>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <ul className="space-y-3">
                    {viewingOrder.items?.map((item: any, index: number) => (
                      <li key={index} className="flex justify-between text-sm text-slate-600 border-b border-slate-200 pb-3 last:border-0 last:pb-0">
                        <div>
                          <p className="font-medium text-slate-900">{item.title}</p>
                          <p className="text-xs text-slate-500">Qty: {item.quantity} × ₹{item.price}</p>
                        </div>
                        <span className="font-bold text-slate-900">₹{item.price * item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2 flex justify-between items-center">
                  Customer Files
                  <div className="relative">
                    <button className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold hover:bg-blue-100 flex items-center gap-1">
                      <Upload size={12} />
                      {uploadingOrderFile ? 'Uploading...' : 'Upload New'}
                    </button>
                    <input 
                      type="file" 
                      onChange={(e) => handleOrderFileUpload(e, true)} 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={uploadingOrderFile}
                    />
                  </div>
                </h3>
                {viewingOrder.files && viewingOrder.files.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {viewingOrder.files.map((file: any, index: number) => (
                      <a key={index} href={file.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors border border-blue-100">
                        <FileText size={14} />
                        <span className="truncate max-w-[150px]">{file.name}</span>
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">No files attached.</p>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2 flex justify-between items-center">
                  Processed Files
                  <div className="relative">
                    <button className="bg-green-50 text-green-700 px-3 py-1 rounded-lg text-xs font-bold hover:bg-green-100 flex items-center gap-1">
                      <Upload size={12} />
                      {uploadingOrderFile ? 'Uploading...' : 'Upload Final'}
                    </button>
                    <input 
                      type="file" 
                      onChange={(e) => handleOrderFileUpload(e, true, true)} 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={uploadingOrderFile}
                    />
                  </div>
                </h3>
                {viewingOrder.processedFiles && viewingOrder.processedFiles.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {viewingOrder.processedFiles.map((file: any, index: number) => (
                      <a key={index} href={file.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-green-100 transition-colors border border-green-100">
                        <ShieldCheck size={14} />
                        <span className="truncate max-w-[150px]">{file.name}</span>
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">No processed files yet.</p>
                )}
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button onClick={() => setViewingOrder(null)} className="bg-slate-100 text-slate-700 px-6 py-2 rounded-lg font-bold hover:bg-slate-200 transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
