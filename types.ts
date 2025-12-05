
export enum AppRoute {
  DASHBOARD = 'dashboard',
  PRODUCTS = 'products',
  CONTENT = 'content',
  SETTINGS = 'settings',
  PROFILE = 'profile',
  HELP = 'help'
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  bio: string;
  avatarUrl: string;
  themePreference: 'light' | 'dark';
}

export interface WooCommerceConfig {
  baseUrl: string;
  consumerKey: string;
  consumerSecret: string;
  isConnected: boolean;
  lastSync?: string;
}

export interface SiteConfig {
  id: string;
  name: string;
  url: string;
  logoUrl?: string; // Custom logo URL
  telegramBotToken?: string;
  woocommerce?: WooCommerceConfig;
}

export interface Product {
  id: string;
  externalId?: string; // WooCommerce ID
  name: string;
  sku: string;
  price: number;
  stock: number;
  categories: string[]; // Supports multiple categories
  description: string;
  shortDescription?: string;
  tags?: string[];
  image: string;
  isActive: boolean;
  lastSyncedAt?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  externalId?: string; // WooCommerce Order ID
  customerName: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed' | 'cancelled';
  date: string; // ISO String
  items: OrderItem[];
}

export interface Article {
  id: string;
  title: string;
  status: 'draft' | 'published' | 'generating' | 'rejected';
  keyword: string;
  content: string; // Markdown/HTML
  createdAt: string;
  editedTitle?: string;
  editedContent?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: number;
  isThinking?: boolean;
}

export interface FinancialMetrics {
  totalRevenue: number;
  successCount: number;
  failedCount: number;
  avgOrderValue: number;
}

export interface DashboardData {
  weekly: FinancialMetrics;
  monthly: FinancialMetrics;
  topProducts: { name: string; sold: number; revenue: number }[];
  marketingInsight: string;
  activeProducts: number;
  totalProducts: number;
  articlesPublished: number;
}
