import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut, updateProfile } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, ShoppingBag, Settings, LogOut, 
  ChevronRight, Package, Calendar, CreditCard,
  Mail, Phone, MapPin, Camera
} from 'lucide-react';

export default function UserDashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'settings'>('orders');
  const navigate = useNavigate();

  // Profile Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchUserProfile(currentUser.uid);
        await fetchUserOrders(currentUser.uid);
      } else {
        navigate('/login');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  const fetchUserProfile = async (uid: string) => {
    try {
      const docSnap = await getDoc(doc(db, 'users', uid));
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProfile(data);
        setEditName(data.displayName || auth.currentUser?.displayName || '');
        setEditPhone(data.phone || '');
        setEditAddress(data.address || '');
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchUserOrders = async (userId: string) => {
    try {
      const q = query(collection(db, 'orders'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const userOrders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(userOrders.sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        displayName: editName,
        phone: editPhone,
        address: editAddress
      });
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: editName });
      }
      setProfile({ ...profile, displayName: editName, phone: editPhone, address: editAddress });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200 pt-12 pb-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-blue-100 rounded-3xl flex items-center justify-center text-blue-600 shadow-inner">
              <User size={40} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 font-headline">
                {profile?.displayName || user?.displayName || 'User'}
              </h1>
              <p className="text-slate-500 font-medium">{user?.email}</p>
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button 
              onClick={() => setActiveTab('settings')}
              className="flex-1 md:flex-none bg-slate-100 text-slate-700 px-6 py-3 rounded-2xl font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
            >
              <Settings size={18} />
              Settings
            </button>
            <button 
              onClick={handleLogout}
              className="flex-1 md:flex-none bg-red-50 text-red-600 px-6 py-3 rounded-2xl font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1 space-y-2">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold transition-all ${activeTab === 'orders' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
          >
            <div className="flex items-center gap-3">
              <ShoppingBag size={20} />
              My Orders
            </div>
            <ChevronRight size={18} className={activeTab === 'orders' ? 'opacity-100' : 'opacity-30'} />
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold transition-all ${activeTab === 'profile' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
          >
            <div className="flex items-center gap-3">
              <User size={20} />
              Profile Details
            </div>
            <ChevronRight size={18} className={activeTab === 'profile' ? 'opacity-100' : 'opacity-30'} />
          </button>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 font-headline">Order History</h2>
              
              {orders.length > 0 ? (
                <div className="grid gap-4">
                  {orders.map(order => (
                    <div key={order.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <span className="bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md">Order #{order.id.slice(-6)}</span>
                            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md ${
                              order.status === 'Delivered' ? 'bg-green-50 text-green-700' :
                              order.status === 'Shipped' ? 'bg-purple-50 text-purple-700' :
                              'bg-orange-50 text-orange-700'
                            }`}>
                              {order.status || 'Processing'}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-slate-900">₹{order.totalPrice}</h3>
                          <div className="flex flex-wrap gap-4 text-sm text-slate-500 font-medium">
                            <div className="flex items-center gap-1.5">
                              <Calendar size={14} />
                              {order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() : 'Recent'}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Package size={14} />
                              {order.items?.length || 0} Items
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Link to={`/track-order?id=${order.id}`} className="w-full md:w-auto bg-slate-900 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors text-center">
                            Track Order
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-16 rounded-[2.5rem] text-center border border-slate-100">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShoppingBag size={40} className="text-slate-300" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">No orders yet</h3>
                  <p className="text-slate-500 mb-8 max-w-xs mx-auto">Looks like you haven't placed any orders with us yet.</p>
                  <Link to="/" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                    Start Shopping
                  </Link>
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-8 md:p-12">
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-2xl font-bold text-slate-900 font-headline">Personal Information</h2>
                  {!isEditing && (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="text-blue-600 font-bold hover:underline flex items-center gap-1"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                        <input 
                          type="text" 
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
                        <input 
                          type="tel" 
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                          placeholder="+91 00000 00000"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Delivery Address</label>
                      <textarea 
                        value={editAddress}
                        onChange={(e) => setEditAddress(e.target.value)}
                        rows={3}
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Enter your full address"
                      />
                    </div>
                    <div className="flex gap-4 pt-4">
                      <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200">
                        Save Changes
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setIsEditing(false)}
                        className="bg-slate-100 text-slate-600 px-8 py-3 rounded-2xl font-bold hover:bg-slate-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                          <User size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name</p>
                          <p className="text-lg font-bold text-slate-900">{profile?.displayName || user?.displayName || 'Not set'}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                          <Mail size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</p>
                          <p className="text-lg font-bold text-slate-900">{user?.email}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                          <Phone size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Phone Number</p>
                          <p className="text-lg font-bold text-slate-900">{profile?.phone || 'Not set'}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                          <MapPin size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Address</p>
                          <p className="text-lg font-bold text-slate-900">{profile?.address || 'Not set'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 font-headline">Account Settings</h2>
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                    <div>
                      <p className="font-bold text-slate-900">Email Notifications</p>
                      <p className="text-sm text-slate-500">Receive updates about your orders</p>
                    </div>
                    <div className="w-12 h-6 bg-blue-600 rounded-full relative">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                    <div>
                      <p className="font-bold text-slate-900">SMS Alerts</p>
                      <p className="text-sm text-slate-500">Get tracking info via SMS</p>
                    </div>
                    <div className="w-12 h-6 bg-slate-300 rounded-full relative">
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="pt-6 border-t border-slate-100">
                    <button className="text-red-600 font-bold hover:underline">Delete Account</button>
                    <p className="text-xs text-slate-400 mt-2">This action is permanent and cannot be undone.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

