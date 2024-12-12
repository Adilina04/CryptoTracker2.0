const API_KEY = process.env.API_KEY;
const BASE_URL = 'https://api.coingecko.com/api/v3';

interface APIOptions {
  currency?: string;
  limit?: number;
  page?: number;
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    throw new Error(`API Error: ${response.statusText}`);
  }
  return await response.json();
};

export const api = {
  fetchCoins: async ({ currency = 'usd', limit = 100, page = 1 }: APIOptions = {}) => {
    try {
      const response = await fetch(
        `${BASE_URL}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${limit}&page=${page}&sparkline=false&price_change_percentage=24h`
      );
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching coins:', error);
      throw error;
    }
  },

  fetchCoinDetails: async (coinId: string) => {
    try {
      const response = await fetch(
        `${BASE_URL}/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`
      );
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching coin details:', error);
      throw error;
    }
  },

  fetchCoinHistory: async (coinId: string, days: number = 7) => {
    try {
      const response = await fetch(
        `${BASE_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
      );
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching coin history:', error);
      throw error;
    }
  },

  searchCoins: async (query: string) => {
    try {
      const response = await fetch(
        `${BASE_URL}/search?query=${query}`
      );
      return await handleResponse(response);
    } catch (error) {
      console.error('Error searching coins:', error);
      throw error;
    }
  }
};