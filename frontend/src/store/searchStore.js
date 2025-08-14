import { create } from 'zustand'

const useSearchStore = create((set) => ({
  // State
  searchData: {
    zipFrom: '',
    zipTo: '',
    moveDate: '',
    moveType: '',
  },
  searchResults: [],
  isSearching: false,
  error: null,

  // Actions
  updateSearchData: (data) => {
    set((state) => ({
      searchData: { ...state.searchData, ...data }
    }))
  },

  performSearch: async () => {
    // const { searchData } = get() // TODO: Use for actual API call
    set({ isSearching: true, error: null })

    try {
      // TODO: Replace with actual API call
      const mockResults = [
        {
          id: 1,
          type: 'full-service',
          title: 'Full-Service Moving Company',
          description: 'Professional movers handle everything',
          price: { min: 2400, max: 3200 },
          rating: 4.8,
          duration: '1 day',
          features: ['Packing', 'Loading', 'Transport', 'Unloading', 'Insurance'],
        },
        {
          id: 2,
          type: 'cross-loading',
          title: 'Truck + Helpers (Cross-loading)',
          description: 'Rent truck + hire local helpers',
          price: { min: 800, max: 1200 },
          rating: 4.6,
          duration: '1-2 days',
          features: ['Truck Rental', 'Loading Help', 'Unloading Help', 'Flexible timing'],
        },
        {
          id: 3,
          type: 'container-sharing',
          title: 'Container Sharing',
          description: 'Share container space with others',
          price: { min: 600, max: 900 },
          rating: 4.3,
          duration: '3-7 days',
          features: ['Shared transport', 'Door-to-door', 'Eco-friendly', 'Cost effective'],
        },
        {
          id: 4,
          type: 'diy-rental',
          title: 'DIY Truck Rental',
          description: 'Do it yourself with rental truck',
          price: { min: 300, max: 500 },
          rating: 4.1,
          duration: '1 day',
          features: ['Self-drive', 'Multiple sizes', 'Hourly/daily rates', 'Insurance options'],
        },
      ]

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      set({ 
        searchResults: mockResults, 
        isSearching: false 
      })
    } catch (error) {
      set({ 
        error: error.message, 
        isSearching: false 
      })
    }
  },

  clearSearch: () => {
    set({
      searchData: {
        zipFrom: '',
        zipTo: '',
        moveDate: '',
        moveType: '',
      },
      searchResults: [],
      error: null,
    })
  },

  clearError: () => {
    set({ error: null })
  },
}))

export default useSearchStore
