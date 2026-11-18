import { mockStore } from './mock/store';
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

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

async function getAuthHeader(): Promise<Record<string, string>> {
  if (USE_MOCK) return {};
  if (!supabase) return {};
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      return { Authorization: `Bearer ${session.access_token}` };
    }
  } catch {
    // fall through
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

  if (res.status === 401 && !USE_MOCK) {
    if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/auth')) {
      window.location.href = '/auth/login?reason=session_expired';
    }
  }

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'API request failed');
  }
  return data.data;
}

export const api = {
  // Auth & Session
  auth: {
    getCurrentUser: async (): Promise<UserProfile> => {
      if (USE_MOCK) return mockStore.getCurrentUser();
      const res = await request<{ user: UserProfile }>('/auth/me');
      return res.user;
    },
    switchRole: (role: 'customer' | 'mechanic' | 'superadmin'): UserProfile => {
      return mockStore.setCurrentUserRole(role);
    },
  },

  // Vehicles
  vehicles: {
    getAll: async (): Promise<Vehicle[]> => {
      if (USE_MOCK) return mockStore.getVehicles();
      return request<Vehicle[]>('/vehicles');
    },
    create: async (data: Omit<Vehicle, 'id' | 'createdAt'>): Promise<Vehicle> => {
      if (USE_MOCK) return mockStore.addVehicle(data);
      return request<Vehicle>('/vehicles', { method: 'POST', body: JSON.stringify(data) });
    },
    update: async (id: string, data: Partial<Vehicle>): Promise<Vehicle | null> => {
      if (USE_MOCK) return mockStore.updateVehicle(id, data);
      return request<Vehicle>(`/vehicles/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    },
    delete: async (id: string): Promise<boolean> => {
      if (USE_MOCK) return mockStore.deleteVehicle(id);
      await request(`/vehicles/${id}`, { method: 'DELETE' });
      return true;
    },
  },

  // Services
  services: {
    getAll: async (): Promise<ServiceItem[]> => {
      if (USE_MOCK) return mockStore.getServices();
      return request<ServiceItem[]>('/services');
    },
    save: async (service: ServiceItem): Promise<ServiceItem> => {
      if (USE_MOCK) return mockStore.saveService(service);
      const isExisting = service.id && !service.id.startsWith('temp_');
      if (isExisting) {
        return request<ServiceItem>(`/services/${service.id}`, { method: 'PUT', body: JSON.stringify(service) });
      }
      return request<ServiceItem>('/services', { method: 'POST', body: JSON.stringify(service) });
    },
    delete: async (id: string): Promise<boolean> => {
      if (USE_MOCK) return mockStore.deleteService(id);
      await request(`/services/${id}`, { method: 'DELETE' });
      return true;
    },
  },

  // Bookings
  bookings: {
    getAll: async (): Promise<Booking[]> => {
      if (USE_MOCK) return mockStore.getBookings();
      return request<Booking[]>('/bookings');
    },
    getById: async (id: string): Promise<Booking> => {
      if (USE_MOCK) {
        const b = mockStore.getBookings().find(x => x.id === id || x.bookingReference === id);
        if (!b) throw new Error('Booking tidak ditemukan');
        return b;
      }
      return request<Booking>(`/bookings/${id}`);
    },
    getAvailableSlots: async (date: string): Promise<{ date: string; slots: Array<{ slot: string; available: boolean; capacity: number; remaining: number }> }> => {
      if (USE_MOCK) {
        const booked = mockStore.getBookings().filter(b => b.scheduledDate === date && b.status !== 'cancelled' && b.status !== 'rejected').map(b => b.scheduledTimeSlot);
        const slots = ['08:30 - 10:00', '10:00 - 11:30', '13:00 - 14:30', '14:30 - 16:00', '16:00 - 17:30'].map(slot => ({
          slot,
          available: booked.filter(s => s === slot).length < 2,
          capacity: 2,
          remaining: Math.max(0, 2 - booked.filter(s => s === slot).length),
        }));
        return { date, slots };
      }
      return request(`/bookings/available-slots?date=${encodeURIComponent(date)}`);
    },
    create: async (data: Parameters<typeof mockStore.createBooking>[0]): Promise<Booking> => {
      if (USE_MOCK) return mockStore.createBooking(data);
      return request<Booking>('/bookings', { method: 'POST', body: JSON.stringify(data) });
    },
    updateStatus: async (
      id: string,
      status: Booking['status'],
      notes?: { mechanicNotes?: string; rejectionReason?: string }
    ): Promise<Booking | null> => {
      if (USE_MOCK) return mockStore.updateBookingStatus(id, status, notes);
      return request<Booking>(`/bookings/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, ...notes }),
      });
    },
    updateNotes: async (id: string, mechanicNotes: string): Promise<{ id: string; mechanicNotes: string }> => {
      if (USE_MOCK) {
        mockStore.updateBookingStatus(id, undefined as any, { mechanicNotes });
        return { id, mechanicNotes };
      }
      return request(`/bookings/${id}/notes`, {
        method: 'PATCH',
        body: JSON.stringify({ mechanicNotes }),
      });
    },
  },

  // Products
  products: {
    getAll: async (): Promise<ProductItem[]> => {
      if (USE_MOCK) return mockStore.getProducts();
      return request<ProductItem[]>('/products');
    },
    save: async (prod: ProductItem): Promise<ProductItem> => {
      if (USE_MOCK) return mockStore.saveProduct(prod);
      const isExisting = prod.id && !prod.id.startsWith('temp_');
      if (isExisting) {
        return request<ProductItem>(`/products/${prod.id}`, { method: 'PUT', body: JSON.stringify(prod) });
      }
      return request<ProductItem>('/products', { method: 'POST', body: JSON.stringify(prod) });
    },
    delete: async (id: string): Promise<boolean> => {
      if (USE_MOCK) return mockStore.deleteProduct(id);
      await request(`/products/${id}`, { method: 'DELETE' });
      return true;
    },
  },

  // Cart
  cart: {
    get: (): CartItem[] => mockStore.getCart(),
    add: (product: ProductItem, qty = 1): CartItem[] => mockStore.addToCart(product, qty),
    remove: (productId: string): CartItem[] => mockStore.removeFromCart(productId),
    clear: (): void => mockStore.clearCart(),
  },

  // Orders
  orders: {
    getAll: async (): Promise<Order[]> => {
      if (USE_MOCK) return mockStore.getOrders();
      return request<Order[]>('/orders');
    },
    create: async (data: Parameters<typeof mockStore.createOrder>[0]): Promise<Order> => {
      if (USE_MOCK) return mockStore.createOrder(data);
      return request<Order>('/orders', { method: 'POST', body: JSON.stringify(data) });
    },
    updateStatus: async (id: string, status: Order['status']): Promise<{ id: string; status: Order['status'] }> => {
      if (USE_MOCK) {
        const orders = mockStore.getOrders();
        const o = orders.find(x => x.id === id);
        if (o) o.status = status;
        return { id, status };
      }
      return request(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
    },
  },

  // Loyalty
  loyalty: {
    getProfile: async (): Promise<LoyaltyProfile> => {
      if (USE_MOCK) return mockStore.getLoyalty();
      return request<LoyaltyProfile>('/loyalty/profile');
    },
    getRewards: async (): Promise<RewardItem[]> => {
      if (USE_MOCK) return mockStore.getRewards();
      return request<RewardItem[]>('/loyalty/rewards');
    },
    checkIn: async () => {
      if (USE_MOCK) return mockStore.dailyCheckIn();
      return request<any>('/loyalty/check-in', { method: 'POST' });
    },
    redeem: async (rewardId: string) => {
      if (USE_MOCK) return mockStore.redeemReward(rewardId);
      return request<any>('/loyalty/redeem', { method: 'POST', body: JSON.stringify({ rewardId }) });
    },
  },

  // Support Forum
  support: {
    getThreads: async (): Promise<SupportThread[]> => {
      if (USE_MOCK) return mockStore.getThreads();
      return request<SupportThread[]>('/support/threads');
    },
    createThread: async (subject: string, vehicleModel: string, initialMessage: string): Promise<SupportThread> => {
      if (USE_MOCK) return mockStore.createThread(subject, vehicleModel, initialMessage);
      return request<SupportThread>('/support/threads', {
        method: 'POST',
        body: JSON.stringify({ subject, vehicleModel, initialMessage }),
      });
    },
    sendMessage: async (threadId: string, content: string): Promise<SupportThread | null> => {
      if (USE_MOCK) return mockStore.sendMessage(threadId, content);
      return request<SupportThread>(`/support/threads/${threadId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ content }),
      });
    },
    updateStatus: async (threadId: string, status: SupportThread['status']): Promise<SupportThread | null> => {
      if (USE_MOCK) return mockStore.updateThreadStatus(threadId, status);
      return request<SupportThread>(`/support/threads/${threadId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    },
  },

  // Admin
  admin: {
    getCustomers: async () => {
      if (USE_MOCK) {
        return [
          { id: 'usr_mock_user', fullName: 'Budi Santoso', email: 'budi@meltune.id', phone: '+6281234567890', totalVehicles: 2, totalBookings: 2, loyaltyPoints: 420, status: 'active', registeredAt: '2026-09-15T08:00:00Z' },
          { id: 'usr_cust_danang', fullName: 'Danang Prasetyo', email: 'danang@example.com', phone: '+6281399887766', totalVehicles: 1, totalBookings: 1, loyaltyPoints: 120, status: 'active', registeredAt: '2026-10-02T11:20:00Z' },
        ];
      }
      return request<any[]>('/admin/customers');
    },
    updateCustomerStatus: async (id: string, status: 'active' | 'suspended') => {
      if (USE_MOCK) return { id, status };
      return request<any>(`/admin/customers/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
    },
    deleteCustomer: async (id: string) => {
      if (USE_MOCK) return { id };
      return request<any>(`/admin/customers/${id}`, { method: 'DELETE' });
    },
    getMechanics: async () => {
      if (USE_MOCK) {
        return [
          { id: 'usr_mech_hendra', fullName: 'Hendra Wijaya', email: 'hendra@meltune.id', phone: '+6281122334455', status: 'active', joinedAt: '2026-01-10T08:00:00Z' },
        ];
      }
      return request<any[]>('/admin/mechanics');
    },
    createMechanic: async (data: { fullName: string; email: string; password?: string; phone?: string }) => {
      if (USE_MOCK) return { id: `usr_mech_${Date.now()}`, ...data, status: 'active', joinedAt: new Date().toISOString() };
      return request<any>('/admin/mechanics', { method: 'POST', body: JSON.stringify(data) });
    },
    getSettings: async () => {
      if (USE_MOCK) {
        return {
          workshopName: 'MELTUNE AUTO Service & Parts',
          address: 'Kawasan Otomotif BSD Blok B3 No. 12, Tangerang Selatan, Banten 15310',
          phone: '+62 21 5590 8820',
          whatsapp: '+62 811 9876 543',
          operatingHours: 'Senin - Sabtu: 08:30 - 17:30 WIB (Minggu Libur)',
          maxBookingsPerSlot: 2,
          dailyCheckInBasePoints: 15,
          dailyStreakBonusMultiplier: 5,
          maxStreakBonusPoints: 25,
        };
      }
      return request<any>('/admin/settings');
    },
    updateSettings: async (settings: Record<string, any>) => {
      if (USE_MOCK) return settings;
      return request<any>('/admin/settings', { method: 'PUT', body: JSON.stringify(settings) });
    },
  },

  // Dashboard
  dashboard: {
    getAdminAnalytics: async () => {
      if (USE_MOCK) {
        return {
          overview: {
            totalRevenue: 48650000,
            dailyRevenue: 2450000,
            monthlyRevenue: 34800000,
            yearlyRevenue: 218500000,
            totalBookings: 148,
            completedBookings: 132,
            pendingBookings: 5,
            cancelledBookings: 11,
            totalCustomers: 86,
            totalMechanics: 4,
            productSalesCount: 64,
          },
          popularServices: [
            { name: 'Advanced Engine Tune-Up', bookingsCount: 54, sharePercent: 36, revenue: 35100000 },
            { name: 'Full Synthetic Fluid & Filter', bookingsCount: 42, sharePercent: 28, revenue: 35700000 },
            { name: 'Precision Brake Overhaul', bookingsCount: 26, sharePercent: 18, revenue: 14300000 },
            { name: 'Suspension Laser Alignment', bookingsCount: 16, sharePercent: 11, revenue: 7200000 },
            { name: 'Climate Purge & Ozone', bookingsCount: 10, sharePercent: 7, revenue: 5000000 },
          ],
          revenueTrends: [
            { month: 'Jun', serviceRevenue: 18200000, partsRevenue: 7500000 },
            { month: 'Jul', serviceRevenue: 21400000, partsRevenue: 9200000 },
            { month: 'Agu', serviceRevenue: 24000000, partsRevenue: 10100000 },
            { month: 'Sep', serviceRevenue: 22800000, partsRevenue: 8900000 },
            { month: 'Okt', serviceRevenue: 26500000, partsRevenue: 11400000 },
            { month: 'Nov', serviceRevenue: 23100000, partsRevenue: 11700000 },
          ],
        };
      }
      return request<any>('/dashboard/admin');
    },
    getMechanicDashboard: async () => {
      if (USE_MOCK) {
        return {
          todayBookingsCount: 4,
          pendingActionCount: 1,
          inProgressBayCount: 2,
          completedTodayCount: 1,
          activeBayAllocations: [
            { bayNumber: 'Bay 1', vehicle: 'Mazda 3 Hatchback (B 8832 KLO)', service: 'Suspension Laser Alignment', status: 'In Inspection', bookingReference: 'TRS-202611-0095' },
            { bayNumber: 'Bay 2', vehicle: 'Honda Civic Turbo (B 1045 TRS)', service: 'Advanced Engine Tune-Up', status: 'In Progress', bookingReference: 'TRS-202611-0081' },
            { bayNumber: 'Bay 3', vehicle: 'Toyota Fortuner (B 2291 TIK)', service: 'Brake Fluid Flushing', status: 'Completed', bookingReference: 'TRS-202611-0042' },
            { bayNumber: 'Bay 4', vehicle: 'Empty / Standby', service: '-', status: 'Idle', bookingReference: '' },
          ],
        };
      }
      return request<any>('/dashboard/mechanic');
    },
  },

  // Storage
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

      if (USE_MOCK || !supabase) {
        return URL.createObjectURL(file);
      }
      const ext = file.name.split('.').pop() || 'jpg';
      const cleanExt = ext.toLowerCase().replace(/[^a-z0-9]/g, '');
      const path = `problems/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${cleanExt}`;
      const { error } = await supabase.storage.from('vehicle-problems').upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });
      if (error) throw new Error(error.message);
      const { data } = supabase.storage.from('vehicle-problems').getPublicUrl(path);
      return data.publicUrl;
    },
  },
};
