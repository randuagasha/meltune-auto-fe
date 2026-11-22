import { supabase } from '@/lib/supabase';
import {
  UserProfile,
  Vehicle,
  ServiceItem,
  Booking,
  ProductItem,
  Order,
  RewardItem,
  LoyaltyProfile,
  SupportThread,
  CartItem,
} from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
const CART_STORAGE_KEY = 'meltune_cart';

// Client-side cart helper for store checkout
function getLocalCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setLocalCart(cart: CartItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (err) {
    console.error('Failed to save cart to localStorage:', err);
  }
}

async function getAuthHeader(): Promise<Record<string, string>> {
  if (!supabase) return {};
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      return { Authorization: `Bearer ${session.access_token}` };
    }
  } catch {
    // Session retrieval error - proceed without header
  }
  return {};
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const authHeader = await getAuthHeader();
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeader,
      ...options?.headers,
    },
  });

  if (res.status === 401) {
    if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/auth')) {
      window.location.href = '/auth/login?reason=session_expired';
    }
  }

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Permintaan API gagal');
  }
  return data.data;
}

export const api = {
  // Auth & Session
  auth: {
    getCurrentUser: async (): Promise<UserProfile> => {
      const res = await request<{ user: UserProfile }>('/auth/me');
      return res.user;
    },
    updateProfile: async (data: { fullName?: string; phone?: string }): Promise<UserProfile> => {
      return request<UserProfile>('/auth/profile', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
  },

  // Vehicles
  vehicles: {
    getAll: async (): Promise<Vehicle[]> => {
      return request<Vehicle[]>('/vehicles');
    },
    create: async (data: Omit<Vehicle, 'id' | 'createdAt'>): Promise<Vehicle> => {
      return request<Vehicle>('/vehicles', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    update: async (id: string, data: Partial<Vehicle>): Promise<Vehicle | null> => {
      return request<Vehicle>(`/vehicles/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    delete: async (id: string): Promise<boolean> => {
      await request(`/vehicles/${id}`, { method: 'DELETE' });
      return true;
    },
  },

  // Services
  services: {
    getAll: async (): Promise<ServiceItem[]> => {
      return request<ServiceItem[]>('/services');
    },
    getById: async (id: string): Promise<ServiceItem> => {
      return request<ServiceItem>(`/services/${id}`);
    },
    save: async (service: ServiceItem): Promise<ServiceItem> => {
      const isExisting = service.id && !service.id.startsWith('temp_') && !service.id.startsWith('srv_' + Date.now().toString().slice(0, 6));
      if (isExisting) {
        return request<ServiceItem>(`/services/${service.id}`, {
          method: 'PUT',
          body: JSON.stringify(service),
        });
      }
      return request<ServiceItem>('/services', {
        method: 'POST',
        body: JSON.stringify(service),
      });
    },
    delete: async (id: string): Promise<boolean> => {
      await request(`/services/${id}`, { method: 'DELETE' });
      return true;
    },
  },

  // Bookings
  bookings: {
    getAll: async (): Promise<Booking[]> => {
      return request<Booking[]>('/bookings');
    },
    getById: async (id: string): Promise<Booking> => {
      return request<Booking>(`/bookings/${id}`);
    },
    getAvailableSlots: async (date: string): Promise<{ date: string; slots: Array<{ slot: string; available: boolean; capacity: number; remaining: number }> }> => {
      return request(`/bookings/available-slots?date=${encodeURIComponent(date)}`);
    },
    create: async (data: {
      vehicleId: string;
      vehicleName?: string;
      licensePlate?: string;
      serviceIds: string[];
      serviceNames?: string[];
      totalPrice: number;
      totalDurationMinutes: number;
      scheduledDate: string;
      scheduledTimeSlot: string;
      problemDescription: string;
      photoUrls?: string[];
    }): Promise<Booking> => {
      return request<Booking>('/bookings', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    updateStatus: async (
      id: string,
      status: Booking['status'],
      notes?: { mechanicNotes?: string; rejectionReason?: string }
    ): Promise<Booking | null> => {
      return request<Booking>(`/bookings/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, ...notes }),
      });
    },
    updateNotes: async (id: string, mechanicNotes: string): Promise<{ id: string; mechanicNotes: string }> => {
      return request(`/bookings/${id}/notes`, {
        method: 'PATCH',
        body: JSON.stringify({ mechanicNotes }),
      });
    },
  },

  // Products
  products: {
    getAll: async (params?: { category?: string; search?: string }): Promise<ProductItem[]> => {
      const query = new URLSearchParams();
      if (params?.category && params.category !== 'all') query.set('category', params.category);
      if (params?.search) query.set('search', params.search);
      const qs = query.toString();
      return request<ProductItem[]>(`/products${qs ? `?${qs}` : ''}`);
    },
    getById: async (id: string): Promise<ProductItem> => {
      return request<ProductItem>(`/products/${id}`);
    },
    save: async (prod: ProductItem): Promise<ProductItem> => {
      const isExisting = prod.id && !prod.id.startsWith('temp_') && !prod.id.startsWith('prd_' + Date.now().toString().slice(0, 6));
      if (isExisting) {
        return request<ProductItem>(`/products/${prod.id}`, {
          method: 'PUT',
          body: JSON.stringify(prod),
        });
      }
      return request<ProductItem>('/products', {
        method: 'POST',
        body: JSON.stringify(prod),
      });
    },
    delete: async (id: string): Promise<boolean> => {
      await request(`/products/${id}`, { method: 'DELETE' });
      return true;
    },
  },

  // Cart (Client-side persisted store)
  cart: {
    get: (): CartItem[] => {
      return getLocalCart();
    },
    add: (product: ProductItem, qty = 1): CartItem[] => {
      const current = getLocalCart();
      const idx = current.findIndex(item => item.product.id === product.id);
      if (idx > -1) {
        current[idx].quantity += qty;
      } else {
        current.push({ product, quantity: qty });
      }
      setLocalCart(current);
      return current;
    },
    remove: (productId: string): CartItem[] => {
      const current = getLocalCart();
      const updated = current.filter(item => item.product.id !== productId);
      setLocalCart(updated);
      return updated;
    },
    clear: (): void => {
      setLocalCart([]);
    },
  },

  // Orders
  orders: {
    getAll: async (): Promise<Order[]> => {
      return request<Order[]>('/orders');
    },
    create: async (data: {
      items: Array<{ productId: string; productName?: string; price: number; quantity: number }>;
      shippingMethod: 'workshop_pickup' | 'express_courier';
      shippingAddress?: string;
      paymentMethod: 'qris' | 'bank_transfer' | 'workshop_cash';
    }): Promise<Order> => {
      const res = await request<Order>('/orders', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      // Clear cart on successful order
      setLocalCart([]);
      return res;
    },
    updateStatus: async (id: string, status: Order['status']): Promise<{ id: string; status: Order['status'] }> => {
      return request(`/orders/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    },
  },

  // Loyalty
  loyalty: {
    getProfile: async (): Promise<LoyaltyProfile> => {
      return request<LoyaltyProfile>('/loyalty/profile');
    },
    getRewards: async (): Promise<RewardItem[]> => {
      return request<RewardItem[]>('/loyalty/rewards');
    },
    checkIn: async (): Promise<{ pointsEarned: number; currentPoints: number; currentStreak: number; message: string; success: boolean }> => {
      try {
        const res = await request<any>('/loyalty/check-in', { method: 'POST' });
        return { ...res, success: true };
      } catch (err: any) {
        return {
          pointsEarned: 0,
          currentPoints: 0,
          currentStreak: 0,
          message: err.message || 'Gagal melakukan check-in harian.',
          success: false,
        };
      }
    },
    redeem: async (rewardId: string): Promise<{ success: boolean; message: string; code?: string }> => {
      try {
        const res = await request<any>('/loyalty/redeem', {
          method: 'POST',
          body: JSON.stringify({ rewardId }),
        });
        return { success: true, message: res.message || 'Reward berhasil ditukar', code: res.redemptionCode };
      } catch (err: any) {
        return { success: false, message: err.message || 'Gagal menukarkan reward' };
      }
    },
  },

  // Support Forum
  support: {
    getThreads: async (): Promise<SupportThread[]> => {
      return request<SupportThread[]>('/support/threads');
    },
    createThread: async (subject: string, vehicleModel: string, initialMessage: string): Promise<SupportThread> => {
      return request<SupportThread>('/support/threads', {
        method: 'POST',
        body: JSON.stringify({ subject, vehicleModel, initialMessage }),
      });
    },
    sendMessage: async (threadId: string, content: string): Promise<any> => {
      return request(`/support/threads/${threadId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ content }),
      });
    },
    updateStatus: async (threadId: string, status: SupportThread['status']): Promise<any> => {
      return request(`/support/threads/${threadId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    },
  },

  // Admin Operations
  admin: {
    getCustomers: async (): Promise<any[]> => {
      return request<any[]>('/admin/customers');
    },
    updateCustomerStatus: async (id: string, status: 'active' | 'suspended'): Promise<any> => {
      return request<any>(`/admin/customers/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    },
    deleteCustomer: async (id: string): Promise<any> => {
      return request<any>(`/admin/customers/${id}`, { method: 'DELETE' });
    },
    getMechanics: async (): Promise<any[]> => {
      return request<any[]>('/admin/mechanics');
    },
    createMechanic: async (data: { fullName: string; email: string; password?: string; phone?: string }): Promise<any> => {
      return request<any>('/admin/mechanics', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    updateMechanic: async (id: string, data: { fullName?: string; phone?: string; status?: 'active' | 'inactive' }): Promise<any> => {
      return request<any>(`/admin/mechanics/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },
    getSettings: async (): Promise<any> => {
      return request<any>('/admin/settings');
    },
    updateSettings: async (settings: Record<string, any>): Promise<any> => {
      return request<any>('/admin/settings', {
        method: 'PUT',
        body: JSON.stringify(settings),
      });
    },
  },

  // Dashboard Analytics
  dashboard: {
    getAdminAnalytics: async (): Promise<any> => {
      return request<any>('/dashboard/admin');
    },
    getMechanicDashboard: async (): Promise<any> => {
      return request<any>('/dashboard/mechanic');
    },
  },

  // Storage Upload
  storage: {
    uploadProblemPhoto: async (file: File): Promise<string> => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Format file tidak didukung. Harap unggah file JPG, PNG, atau WEBP.');
      }
      const maxSizeBytes = 5 * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        throw new Error('Ukuran file maksimal adalah 5MB.');
      }

      if (!supabase) {
        throw new Error('Koneksi Supabase belum terkonfigurasi.');
      }

      const ext = file.name.split('.').pop() || 'jpg';
      const cleanExt = ext.toLowerCase().replace(/[^a-z0-9]/g, '');
      const path = `problems/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${cleanExt}`;
      const { error } = await supabase.storage.from('vehicle-problems').upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });

      if (error) {
        throw new Error(`Gagal mengunggah foto: ${error.message}`);
      }

      const { data } = supabase.storage.from('vehicle-problems').getPublicUrl(path);
      return data.publicUrl;
    },
  },
};
