
import { Product, Article, DashboardData, Order, UserProfile, SiteConfig } from '../types';

// Initial Mock Data
const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    externalId: 'wc_501',
    name: 'کفش ورزشی نایک مدل پگاسوس',
    sku: 'NK-001',
    price: 4500000,
    stock: 45,
    categories: ['کفش', 'ورزشی'],
    description: 'کفش ورزشی راحت برای دویدن روزانه با کفی طبی.',
    shortDescription: 'کفش دویدن حرفه‌ای',
    tags: ['ورزشی', 'نایک', 'دویدن', 'تخفیف'],
    image: 'https://picsum.photos/200/200?random=1',
    isActive: true,
    lastSyncedAt: new Date().toISOString()
  },
  {
    id: '2',
    externalId: 'wc_502',
    name: 'هدفون سونی WH-1000XM5',
    sku: 'SN-Head-5',
    price: 12500000,
    stock: 12,
    categories: ['الکترونیک', 'لوازم جانبی'],
    description: 'بهترین هدفون نویز کنسلینگ بازار با باتری ۳۰ ساعته.',
    image: 'https://picsum.photos/200/200?random=2',
    isActive: true,
    lastSyncedAt: new Date().toISOString()
  },
  {
    id: '3',
    externalId: 'wc_503',
    name: 'چای سبز ارگانیک (بسته ۵۰ تایی)',
    sku: 'TEA-GR-50',
    price: 150000,
    stock: 200,
    categories: ['مواد غذایی', 'نوشیدنی'],
    description: 'چای سبز طبیعی بدون افزودنی.',
    image: 'https://picsum.photos/200/200?random=3',
    isActive: true,
    lastSyncedAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'دمبل قابل تنظیم',
    sku: 'GYM-DB-01',
    price: 2900000,
    stock: 0,
    categories: ['ورزش', 'تجهیزات خانگی'],
    description: 'دمبل متغیر برای استفاده در خانه.',
    image: 'https://picsum.photos/200/200?random=4',
    isActive: false
  }
];

const INITIAL_ARTICLES: Article[] = [
  {
    id: '101',
    title: '۱۰ مدل برتر کفش دوندگی در سال ۱۴۰۳',
    status: 'published',
    keyword: 'بهترین کفش دوندگی',
    content: '## مقدمه\nانتخاب کفش مناسب برای دویدن بسیار مهم است...\n\n## مدل‌های برتر\n1. نایک پگاسوس\n2. آدیداس اولترابوست...',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: '102',
    title: 'خواص شگفت‌انگیز چای سبز',
    status: 'draft',
    keyword: 'خواص چای سبز',
    content: '## چای سبز چیست؟\nچای سبز یکی از سالم‌ترین نوشیدنی‌های روی کره زمین است...',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
  }
];

const INITIAL_ORDERS: Order[] = [
  { 
    id: 'O-1001', externalId: '9801', customerName: 'علی رضایی', amount: 4500000, status: 'completed', date: new Date(Date.now() - 86400000 * 1).toISOString(),
    items: [{ productId: '1', productName: 'کفش ورزشی نایک', quantity: 1, unitPrice: 4500000 }]
  },
  { 
    id: 'O-1002', externalId: '9802', customerName: 'مریم احمدی', amount: 150000, status: 'completed', date: new Date(Date.now() - 86400000 * 3).toISOString(),
    items: [{ productId: '3', productName: 'چای سبز', quantity: 1, unitPrice: 150000 }]
  },
  { 
    id: 'O-1003', externalId: '9805', customerName: 'سارا کریمی', amount: 12500000, status: 'pending', date: new Date(Date.now() - 86400000 * 5).toISOString(),
    items: [{ productId: '2', productName: 'هدفون سونی', quantity: 1, unitPrice: 12500000 }]
  },
  { 
    id: 'O-1004', customerName: 'امید نوری', amount: 2900000, status: 'cancelled', date: new Date(Date.now() - 86400000 * 10).toISOString(),
    items: [{ productId: '4', productName: 'دمبل', quantity: 1, unitPrice: 2900000 }]
  },
  { 
    id: 'O-1005', customerName: 'رضا کمالی', amount: 450000, status: 'failed', date: new Date(Date.now() - 86400000 * 15).toISOString(),
    items: [{ productId: '3', productName: 'چای سبز', quantity: 3, unitPrice: 150000 }]
  },
  { 
    id: 'O-1006', customerName: 'کیوان', amount: 9000000, status: 'completed', date: new Date(Date.now() - 86400000 * 2).toISOString(),
    items: [{ productId: '1', productName: 'کفش ورزشی نایک', quantity: 2, unitPrice: 4500000 }]
  }
];

const INITIAL_USER: UserProfile = {
  id: 'u1',
  name: 'محمد محمدی',
  email: 'admin@autocommerce.ir',
  role: 'مدیر فروشگاه',
  bio: 'متخصص سئو و دیجیتال مارکتینگ با ۵ سال تجربه.',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  themePreference: 'light'
};

const INITIAL_SITE_CONFIG: SiteConfig = {
  id: 's1',
  name: 'فروشگاه نمونه',
  url: 'https://example.com',
  logoUrl: '', // Default empty, will use built-in logo
  telegramBotToken: '',
  woocommerce: {
    baseUrl: '',
    consumerKey: '',
    consumerSecret: '',
    isConnected: false,
    lastSync: ''
  }
};

class MockDatabase {
  private products: Product[] = [...INITIAL_PRODUCTS];
  private articles: Article[] = [...INITIAL_ARTICLES];
  private orders: Order[] = [...INITIAL_ORDERS];
  private user: UserProfile = { ...INITIAL_USER };
  private siteConfig: SiteConfig = { ...INITIAL_SITE_CONFIG };

  // --- Products ---
  getProducts(search?: string): Promise<Product[]> {
    return new Promise((resolve) => {
      let result = this.products;
      if (search) {
        const lower = search.toLowerCase();
        result = result.filter(p => 
          p.name.toLowerCase().includes(lower) || 
          p.sku.toLowerCase().includes(lower) ||
          p.categories.some(c => c.includes(lower)) ||
          (p.tags && p.tags.some(t => t.includes(lower)))
        );
      }
      setTimeout(() => resolve([...result]), 300);
    });
  }

  addProduct(product: Product): Promise<Product> {
    return new Promise((resolve) => {
      // Simulate pushing to WooCommerce if connected
      if (this.siteConfig.woocommerce?.isConnected) {
          console.log("Simulating WooCommerce Push: Creating Product", product.name);
          product.externalId = `wc_${Math.floor(Math.random() * 10000)}`;
          product.lastSyncedAt = new Date().toISOString();
      }
      this.products.unshift(product);
      resolve(product);
    });
  }

  updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    return new Promise((resolve, reject) => {
      const index = this.products.findIndex(p => p.id === id);
      if (index === -1) {
        reject(new Error('Product not found'));
        return;
      }
      // Simulate pushing to WooCommerce if connected
      if (this.siteConfig.woocommerce?.isConnected) {
        console.log("Simulating WooCommerce Push: Updating Product", id, updates);
        updates.lastSyncedAt = new Date().toISOString();
      }

      this.products[index] = { ...this.products[index], ...updates };
      resolve(this.products[index]);
    });
  }

  // --- Articles ---
  createArticle(article: Article): Promise<Article> {
    return new Promise(resolve => {
      this.articles.unshift(article);
      resolve(article);
    });
  }

  getArticles(search?: string): Promise<Article[]> {
    return new Promise(resolve => {
        let result = this.articles;
        if (search) {
            const lower = search.toLowerCase();
            result = result.filter(a => a.title.toLowerCase().includes(lower) || a.keyword.toLowerCase().includes(lower));
        }
        setTimeout(() => resolve([...result]), 300);
    });
  }

  updateArticleStatus(id: string, status: Article['status']): Promise<void> {
      return new Promise(resolve => {
          const index = this.articles.findIndex(a => a.id === id);
          if (index !== -1) {
              this.articles[index].status = status;
          }
          resolve();
      });
  }

  updateArticle(id: string, updates: Partial<Article>): Promise<Article> {
    return new Promise((resolve, reject) => {
        const index = this.articles.findIndex(a => a.id === id);
        if (index === -1) {
            reject(new Error("Article not found"));
            return;
        }
        this.articles[index] = { ...this.articles[index], ...updates };
        resolve(this.articles[index]);
    });
  }

  // --- User & Config ---
  getUserProfile(): Promise<UserProfile> {
    return new Promise(resolve => resolve({...this.user}));
  }

  updateUserProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    return new Promise(resolve => {
      this.user = { ...this.user, ...updates };
      resolve({...this.user});
    });
  }

  getSiteConfig(): Promise<SiteConfig> {
    return new Promise(resolve => resolve({...this.siteConfig}));
  }

  updateSiteConfig(updates: Partial<SiteConfig>): Promise<SiteConfig> {
    return new Promise(resolve => {
      this.siteConfig = { ...this.siteConfig, ...updates };
      resolve({...this.siteConfig});
    });
  }

  // --- WooCommerce Simulation ---
  testWooConnection(): Promise<boolean> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (this.siteConfig.woocommerce?.baseUrl && this.siteConfig.woocommerce.consumerKey) {
                this.siteConfig.woocommerce.isConnected = true;
                resolve(true);
            } else {
                reject(new Error("تنظیمات ووکامرس کامل نیست."));
            }
        }, 1500);
    });
  }

  syncWooProducts(): Promise<number> {
    return new Promise(resolve => {
        setTimeout(() => {
            // Simulate fetching new products from Woo
            const newSyncedProducts: Product[] = [
                {
                    id: Date.now().toString(),
                    externalId: 'wc_new_888',
                    name: 'ست هودی و شلوار (وارداتی از ووکامرس)',
                    sku: 'IMP-WOO-1',
                    price: 980000,
                    stock: 5,
                    categories: ['پوشاک', 'زمستانی'],
                    description: 'محصول همگام‌سازی شده از فروشگاه ووکامرس.',
                    image: 'https://picsum.photos/200/200?random=10',
                    isActive: true,
                    lastSyncedAt: new Date().toISOString()
                }
            ];
            this.products = [...newSyncedProducts, ...this.products];
            if (this.siteConfig.woocommerce) {
                this.siteConfig.woocommerce.lastSync = new Date().toISOString();
            }
            resolve(newSyncedProducts.length);
        }, 2000);
    });
  }

  syncWooOrders(): Promise<number> {
    return new Promise(resolve => {
        setTimeout(() => {
            // Simulate fetching new orders
            const newOrder: Order = {
                id: `O-${Date.now()}`,
                externalId: 'wc_ord_999',
                customerName: 'کاربر ووکامرس',
                amount: 980000,
                status: 'completed',
                date: new Date().toISOString(),
                items: [{ productId: 'wc_new_888', productName: 'ست هودی', quantity: 1, unitPrice: 980000 }]
            };
            this.orders.unshift(newOrder);
            resolve(1);
        }, 2000);
    });
  }

  // --- Dashboard Data ---
  getDashboardData(): Promise<DashboardData> {
    return new Promise(resolve => {
        const now = Date.now();
        const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
        const oneMonthAgo = now - 30 * 24 * 60 * 60 * 1000;

        const calcMetrics = (cutoff: number) => {
            const relevantOrders = this.orders.filter(o => new Date(o.date).getTime() > cutoff);
            const completed = relevantOrders.filter(o => o.status === 'completed');
            const totalRev = completed.reduce((acc, o) => acc + o.amount, 0);
            return {
                totalRevenue: totalRev,
                successCount: completed.length,
                failedCount: relevantOrders.filter(o => ['failed', 'cancelled'].includes(o.status)).length,
                avgOrderValue: completed.length ? totalRev / completed.length : 0
            };
        };

        // Top Products Logic
        const productSales: Record<string, {name: string, sold: number, revenue: number}> = {};
        this.orders.forEach(order => {
            if (order.status === 'completed') {
                order.items.forEach(item => {
                    if (!productSales[item.productId]) {
                        productSales[item.productId] = { name: item.productName, sold: 0, revenue: 0 };
                    }
                    productSales[item.productId].sold += item.quantity;
                    productSales[item.productId].revenue += item.quantity * item.unitPrice;
                });
            }
        });
        const topProducts = Object.values(productSales).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

        // Simple insight
        const topProduct = topProducts[0];
        const marketingInsight = topProduct 
            ? `محصول "${topProduct.name}" پرفروش‌ترین محصول این ماه است. پیشنهاد می‌کنیم یک کمپین محتوایی حول این محصول ایجاد کنید.`
            : "برای دریافت پیشنهادات هوشمند، نیاز به ثبت سفارشات بیشتری است.";

        resolve({
            weekly: calcMetrics(oneWeekAgo),
            monthly: calcMetrics(oneMonthAgo),
            topProducts,
            marketingInsight,
            activeProducts: this.products.filter(p => p.isActive).length,
            totalProducts: this.products.length,
            articlesPublished: this.articles.filter(a => a.status === 'published').length
        });
    });
  }
}

export const db = new MockDatabase();
