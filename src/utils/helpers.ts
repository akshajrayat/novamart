export const formatCurrency = (amount: number | string): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(num);
};

export const formatDate = (date: string): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
};

export const formatDateShort = (date: string): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
};

export const getDiscountPercentage = (price: number, comparePrice: number): number => {
  return Math.round(((comparePrice - price) / comparePrice) * 100);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};

export const generateStars = (rating: number): ('full' | 'half' | 'empty')[] => {
  const stars: ('full' | 'half' | 'empty')[] = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) stars.push('full');
    else if (i - 0.5 <= rating) stars.push('half');
    else stars.push('empty');
  }
  return stars;
};

export const getOrderStatusColor = (status: string): string => {
  switch (status) {
    case 'PENDING': return 'warning';
    case 'CONFIRMED': return 'info';
    case 'PROCESSING': return 'primary';
    case 'SHIPPED': return 'primary';
    case 'DELIVERED': return 'success';
    case 'CANCELLED': return 'error';
    default: return 'primary';
  }
};
