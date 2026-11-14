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
import {
  DEMO_USERS,
  INITIAL_VEHICLES,
  INITIAL_SERVICES,
  INITIAL_BOOKINGS,
  INITIAL_PRODUCTS,
  INITIAL_REWARDS,
  INITIAL_LOYALTY,
  INITIAL_THREADS,
} from './fixtures';

const STORAGE_KEYS = {
  CURRENT_USER: 'torsi_current_user',
  VEHICLES: 'torsi_vehicles',
  SERVICES: 'torsi_services',
  BOOKINGS: 'torsi_bookings',
  PRODUCTS: 'torsi_products',
  ORDERS: 'torsi_orders',
  LOYALTY: 'torsi_loyalty',
  REWARDS: 'torsi_rewards',
  THREADS: 'torsi_threads',
  CART: 'torsi_cart',
};

function getStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event('torsi-storage-update'));
  } catch (e) {
    console.error('Storage write error:', e);
  }
}

export const mockStore = {
  // User Session
  getCurrentUser(): UserProfile {
    return getStorage<UserProfile>(STORAGE_KEYS.CURRENT_USER, DEMO_USERS.customer);
  },
  setCurrentUserRole(role: 'customer' | 'mechanic' | 'superadmin'): UserProfile {
    const user = DEMO_USERS[role];
    setStorage(STORAGE_KEYS.CURRENT_USER, user);
    return user;
  },

  // Vehicles
  getVehicles(): Vehicle[] {
    return getStorage<Vehicle[]>(STORAGE_KEYS.VEHICLES, INITIAL_VEHICLES);
  },
  addVehicle(vehicle: Omit<Vehicle, 'id' | 'createdAt'>): Vehicle {
    const current = this.getVehicles();
    const newVehicle: Vehicle = {
      ...vehicle,
      id: `veh_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newVehicle, ...current];
    setStorage(STORAGE_KEYS.VEHICLES, updated);
    return newVehicle;
  },
  updateVehicle(id: string, updates: Partial<Vehicle>): Vehicle | null {
    const current = this.getVehicles();
    const idx = current.findIndex(v => v.id === id);
    if (idx === -1) return null;
    current[idx] = { ...current[idx], ...updates };
    setStorage(STORAGE_KEYS.VEHICLES, current);
    return current[idx];
  },
  deleteVehicle(id: string): boolean {
    const current = this.getVehicles();
    const filtered = current.filter(v => v.id !== id);
    setStorage(STORAGE_KEYS.VEHICLES, filtered);
    return true;
  },

  // Services
  getServices(): ServiceItem[] {
    return getStorage<ServiceItem[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
  },
  saveService(service: ServiceItem): ServiceItem {
    const current = this.getServices();
    const idx = current.findIndex(s => s.id === service.id);
    if (idx !== -1) {
      current[idx] = service;
    } else {
      current.push(service);
    }
    setStorage(STORAGE_KEYS.SERVICES, current);
    return service;
  },
  deleteService(id: string): boolean {
    const filtered = this.getServices().filter(s => s.id !== id);
    setStorage(STORAGE_KEYS.SERVICES, filtered);
    return true;
  },

  // Bookings
  getBookings(): Booking[] {
    return getStorage<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
  },
  createBooking(data: {
    vehicleId: string;
    vehicleName: string;
    licensePlate: string;
    serviceIds: string[];
    serviceNames: string[];
    totalPrice: number;
    totalDurationMinutes: number;
    scheduledDate: string;
    scheduledTimeSlot: string;
    problemDescription: string;
    photoUrls?: string[];
  }): Booking {
    const current = this.getBookings();
    const user = this.getCurrentUser();
    const dateCode = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingRef = `TRS-${dateCode}-${randomSuffix}`;

    const newBooking: Booking = {
      id: `bkg_${Date.now()}`,
      bookingReference: bookingRef,
      userId: user.id,
      userName: user.fullName,
      userPhone: user.phone,
      vehicleId: data.vehicleId,
      vehicleName: data.vehicleName,
      licensePlate: data.licensePlate,
      serviceIds: data.serviceIds,
      serviceNames: data.serviceNames,
      totalPrice: data.totalPrice,
      totalDurationMinutes: data.totalDurationMinutes,
      scheduledDate: data.scheduledDate,
      scheduledTimeSlot: data.scheduledTimeSlot,
      problemDescription: data.problemDescription,
      photoUrls: data.photoUrls || [],
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newBooking, ...current];
    setStorage(STORAGE_KEYS.BOOKINGS, updated);
    return newBooking;
  },
  updateBookingStatus(
    id: string,
    status: Booking['status'],
    notes?: { mechanicNotes?: string; rejectionReason?: string }
  ): Booking | null {
    const current = this.getBookings();
    const idx = current.findIndex(b => b.id === id);
    if (idx === -1) return null;
    current[idx].status = status;
    if (notes?.mechanicNotes !== undefined) current[idx].mechanicNotes = notes.mechanicNotes;
    if (notes?.rejectionReason !== undefined) current[idx].rejectionReason = notes.rejectionReason;
    current[idx].updatedAt = new Date().toISOString();
    setStorage(STORAGE_KEYS.BOOKINGS, current);
    return current[idx];
  },

  // Products
  getProducts(): ProductItem[] {
    return getStorage<ProductItem[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  },
  saveProduct(prod: ProductItem): ProductItem {
    const current = this.getProducts();
    const idx = current.findIndex(p => p.id === prod.id);
    if (idx !== -1) {
      current[idx] = prod;
    } else {
      current.push(prod);
    }
    setStorage(STORAGE_KEYS.PRODUCTS, current);
    return prod;
  },
  deleteProduct(id: string): boolean {
    const filtered = this.getProducts().filter(p => p.id !== id);
    setStorage(STORAGE_KEYS.PRODUCTS, filtered);
    return true;
  },

  // Cart
  getCart(): CartItem[] {
    return getStorage<CartItem[]>(STORAGE_KEYS.CART, []);
  },
  addToCart(product: ProductItem, quantity = 1): CartItem[] {
    const cart = this.getCart();
    const idx = cart.findIndex(c => c.product.id === product.id);
    if (idx !== -1) {
      cart[idx].quantity += quantity;
    } else {
      cart.push({ product, quantity });
    }
    setStorage(STORAGE_KEYS.CART, cart);
    return cart;
  },
  removeFromCart(productId: string): CartItem[] {
    const filtered = this.getCart().filter(c => c.product.id !== productId);
    setStorage(STORAGE_KEYS.CART, filtered);
    return filtered;
  },
  clearCart(): void {
    setStorage(STORAGE_KEYS.CART, []);
  },

  // Orders
  getOrders(): Order[] {
    return getStorage<Order[]>(STORAGE_KEYS.ORDERS, []);
  },
  createOrder(data: {
    items: { productId: string; productName: string; price: number; quantity: number }[];
    shippingMethod: 'workshop_pickup' | 'express_courier';
    shippingAddress?: string;
    paymentMethod: 'qris' | 'bank_transfer' | 'workshop_cash';
  }): Order {
    const user = this.getCurrentUser();
    const subtotal = data.items.reduce((acc, i) => acc + i.price * i.quantity, 0);
    const shippingFee = data.shippingMethod === 'express_courier' ? 25000 : 0;
    const orderNumber = `TRS-ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      orderNumber,
      userId: user.id,
      userName: user.fullName,
      userPhone: user.phone,
      items: data.items,
      subtotal,
      shippingFee,
      totalAmount: subtotal + shippingFee,
      shippingMethod: data.shippingMethod,
      shippingAddress: data.shippingAddress,
      paymentMethod: data.paymentMethod,
      status: 'processing',
      createdAt: new Date().toISOString(),
    };

    const current = this.getOrders();
    setStorage(STORAGE_KEYS.ORDERS, [newOrder, ...current]);
    this.clearCart();
    return newOrder;
  },

  // Loyalty
  getLoyalty(): LoyaltyProfile {
    return getStorage<LoyaltyProfile>(STORAGE_KEYS.LOYALTY, INITIAL_LOYALTY);
  },
  getRewards(): RewardItem[] {
    return getStorage<RewardItem[]>(STORAGE_KEYS.REWARDS, INITIAL_REWARDS);
  },
  dailyCheckIn(): { success: boolean; earned: number; message: string; profile: LoyaltyProfile } {
    const profile = this.getLoyalty();
    const today = new Date().toISOString().slice(0, 10);
    if (profile.lastCheckInDate === today) {
      return { success: false, earned: 0, message: 'Sudah check-in hari ini', profile };
    }

    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    if (profile.lastCheckInDate === yesterday) {
      profile.currentStreak += 1;
    } else {
      profile.currentStreak = 1;
    }

    if (profile.currentStreak > profile.longestStreak) {
      profile.longestStreak = profile.currentStreak;
    }

    const bonus = Math.min(profile.currentStreak * 5, 25);
    const earned = 15 + bonus;
    profile.points += earned;
    profile.lastCheckInDate = today;

    setStorage(STORAGE_KEYS.LOYALTY, profile);
    return {
      success: true,
      earned,
      message: `Check-in berhasil! +${earned} poin (Streak ${profile.currentStreak} hari)`,
      profile,
    };
  },
  redeemReward(rewardId: string): { success: boolean; code?: string; message: string } {
    const profile = this.getLoyalty();
    const rewards = this.getRewards();
    const reward = rewards.find(r => r.id === rewardId);

    if (!reward) return { success: false, message: 'Reward tidak ditemukan' };
    if (reward.stock <= 0) return { success: false, message: 'Stok reward habis' };
    if (profile.points < reward.pointsCost) return { success: false, message: 'Poin belum cukup' };

    profile.points -= reward.pointsCost;
    reward.stock -= 1;
    const code = `TRS-RWD-${Math.floor(1000 + Math.random() * 9000)}`;

    profile.redemptionHistory.unshift({
      id: `rdm_${Date.now()}`,
      rewardId: reward.id,
      rewardTitle: reward.title,
      pointsSpent: reward.pointsCost,
      redeemedAt: new Date().toISOString(),
      code,
    });

    setStorage(STORAGE_KEYS.LOYALTY, profile);
    setStorage(STORAGE_KEYS.REWARDS, rewards);
    return { success: true, code, message: 'Reward berhasil ditukarkan' };
  },

  // Support Threads
  getThreads(): SupportThread[] {
    return getStorage<SupportThread[]>(STORAGE_KEYS.THREADS, INITIAL_THREADS);
  },
  createThread(subject: string, vehicleModel: string, initialMessage: string): SupportThread {
    const user = this.getCurrentUser();
    const newThread: SupportThread = {
      id: `thr_${Date.now()}`,
      customerId: user.id,
      customerName: user.fullName,
      vehicleModel,
      subject,
      status: 'open',
      lastActivity: new Date().toISOString(),
      messages: [
        {
          id: `msg_${Date.now()}`,
          senderId: user.id,
          senderName: user.fullName,
          senderRole: user.role,
          content: initialMessage,
          createdAt: new Date().toISOString(),
        },
      ],
    };
    const current = this.getThreads();
    setStorage(STORAGE_KEYS.THREADS, [newThread, ...current]);
    return newThread;
  },
  sendMessage(threadId: string, content: string): SupportThread | null {
    const current = this.getThreads();
    const thread = current.find(t => t.id === threadId);
    if (!thread) return null;

    const user = this.getCurrentUser();
    thread.messages.push({
      id: `msg_${Date.now()}`,
      senderId: user.id,
      senderName: user.fullName,
      senderRole: user.role,
      content,
      createdAt: new Date().toISOString(),
    });
    thread.lastActivity = new Date().toISOString();
    if (user.role === 'mechanic' && thread.status === 'open') {
      thread.status = 'in_progress';
    }
    setStorage(STORAGE_KEYS.THREADS, current);
    return thread;
  },
  updateThreadStatus(threadId: string, status: SupportThread['status']): SupportThread | null {
    const current = this.getThreads();
    const thread = current.find(t => t.id === threadId);
    if (!thread) return null;
    thread.status = status;
    setStorage(STORAGE_KEYS.THREADS, current);
    return thread;
  },
};
