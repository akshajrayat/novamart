// This file is kept for backward compatibility but is no longer the primary API layer.
// All API calls now go through Firebase Auth + Firestore directly.
// The individual API modules (auth.api.ts, products.api.ts, etc.) handle their own Firebase calls.

// If you need to make direct HTTP calls to external APIs, you can still use this client:
import axios from 'axios';

const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
