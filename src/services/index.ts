import { mockStore } from './mock/store';
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

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
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
      return request<UserProfile>('/auth/me');
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
  },

  // Products
  products: {
    getAll: async (): Promise<ProductItem[]> => {
      if (USE_MOCK) return mockStore.getProducts();
      return request<ProductItem[]>('/products');
    },
    save: async (prod: ProductItem): Promise<ProductItem> => {
      if (USE_MOCK) return mockStore.saveProduct(prod);
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
};
