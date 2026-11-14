export type UserRole = 'customer' | 'mechanic' | 'superadmin';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface Vehicle {
  id: string;
  userId: string;
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  transmission: 'manual' | 'automatic' | 'cvt';
  fuelType: 'petrol' | 'diesel' | 'hybrid' | 'electric';
  notes?: string;
  createdAt: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  category: 'maintenance' | 'diagnostics' | 'repair' | 'detailing' | 'performance';
  description: string;
  price: number;
  estimatedDurationMinutes: number;
  imageUrl?: string;
  isActive: boolean;
}

export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  bookingReference: string;
  userId: string;
  userName: string;
  userPhone?: string;
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
  status: BookingStatus;
  rejectionReason?: string;
  mechanicNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductItem {
  id: string;
  name: string;
  category: 'engine_oil' | 'car_care' | 'parts' | 'accessories' | 'maintenance';
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  isAvailable: boolean;
}

export interface CartItem {
  product: ProductItem;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  userName: string;
  userPhone?: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  shippingMethod: 'workshop_pickup' | 'express_courier';
  shippingAddress?: string;
  paymentMethod: 'qris' | 'bank_transfer' | 'workshop_cash';
  status: 'pending' | 'processing' | 'ready_for_pickup' | 'shipped' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface RewardItem {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  stock: number;
  imageUrl: string;
}

export interface LoyaltyProfile {
  userId: string;
  points: number;
  currentStreak: number;
  longestStreak: number;
  lastCheckInDate?: string;
  redemptionHistory: Array<{
    id: string;
    rewardId: string;
    rewardTitle: string;
    pointsSpent: number;
    redeemedAt: string;
    code: string;
  }>;
}

export interface SupportMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  content: string;
  createdAt: string;
}

export interface SupportThread {
  id: string;
  customerId: string;
  customerName: string;
  vehicleModel?: string;
  subject: string;
  status: 'open' | 'in_progress' | 'resolved';
  lastActivity: string;
  messages: SupportMessage[];
}

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  code?: string;
}
