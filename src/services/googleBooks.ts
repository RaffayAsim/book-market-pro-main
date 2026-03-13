import { useQuery } from "@tanstack/react-query";

const API_KEY = "AIzaSyABRaFPXJZVBP7UQ7FDmEw6rkv6qevZdMw";
const BASE_URL = "https://www.googleapis.com/books/v1/volumes";

export interface GoogleBook {
  id: string;
  title: string;
  authors: string[];
  description: string;
  thumbnail: string;
  infoLink: string;
  webReaderLink: string | null;
  publishedDate: string;
  publisher: string;
  pageCount: number;
  categories: string[];
  averageRating: number;
  ratingsCount: number;
  isAvailableForFree: boolean;
}

interface GoogleBooksResponse {
  items: Array<{
    id: string;
    volumeInfo: {
      title: string;
      authors?: string[];
      description?: string;
      imageLinks?: {
        thumbnail?: string;
        smallThumbnail?: string;
      };
      infoLink?: string;
      publishedDate?: string;
      publisher?: string;
      pageCount?: number;
      categories?: string[];
      averageRating?: number;
      ratingsCount?: number;
    };
    accessInfo: {
      webReaderLink?: string;
      pdf?: {
        isAvailable?: boolean;
      };
      epub?: {
        isAvailable?: boolean;
      };
    };
  }>;
  totalItems: number;
}

const mapGoogleBook = (item: GoogleBooksResponse["items"][0]): GoogleBook => ({
  id: item.id,
  title: item.volumeInfo?.title || "Untitled",
  authors: item.volumeInfo?.authors || ["Unknown Author"],
  description: item.volumeInfo?.description || "",
  thumbnail: item.volumeInfo?.imageLinks?.thumbnail || "",
  infoLink: item.volumeInfo?.infoLink || `https://books.google.com/books?id=${item.id}`,
  webReaderLink: item.accessInfo?.webReaderLink || null,
  publishedDate: item.volumeInfo?.publishedDate || "",
  publisher: item.volumeInfo?.publisher || "",
  pageCount: item.volumeInfo?.pageCount || 0,
  categories: item.volumeInfo?.categories || [],
  averageRating: item.volumeInfo?.averageRating || 0,
  ratingsCount: item.volumeInfo?.ratingsCount || 0,
  isAvailableForFree: !!(item.accessInfo?.pdf?.isAvailable || item.accessInfo?.epub?.isAvailable),
});

export const fetchBooksByQuery = async (query: string, maxResults: number = 20): Promise<GoogleBook[]> => {
  const params = new URLSearchParams({
    q: query,
    maxResults: String(maxResults),
    key: API_KEY,
  });
  
  const response = await fetch(`${BASE_URL}?${params}`);
  
  if (response.status === 429) {
    throw new Error("Search limit reached. Please try again later.");
  }
  
  if (!response.ok) {
    throw new Error("Failed to fetch books");
  }
  
  const data: GoogleBooksResponse = await response.json();
  return (data.items || []).map(mapGoogleBook);
};

export const fetchBestsellers = async (): Promise<GoogleBook[]> => {
  return fetchBooksByQuery("subject:fiction&orderBy=newest", 12);
};

export const fetchTrending = async (): Promise<GoogleBook[]> => {
  return fetchBooksByQuery("bestsellers&orderBy=relevance", 12);
};

export const fetchTopRated = async (): Promise<GoogleBook[]> => {
  return fetchBooksByQuery("subject:fiction", 20);
};

// React Query hooks
export const useGoogleBooksSearch = (query: string) => {
  return useQuery({
    queryKey: ["googleBooks", "search", query],
    queryFn: () => fetchBooksByQuery(query, 30),
    enabled: query.length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useFeaturedBooks = () => {
  return useQuery({
    queryKey: ["googleBooks", "featured"],
    queryFn: fetchBestsellers,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useTrendingBooks = () => {
  return useQuery({
    queryKey: ["googleBooks", "trending"],
    queryFn: fetchTrending,
    staleTime: 1000 * 60 * 10,
  });
};

export const useTopRatedBooks = () => {
  return useQuery({
    queryKey: ["googleBooks", "topRated"],
    queryFn: fetchTopRated,
    staleTime: 1000 * 60 * 10,
  });
};