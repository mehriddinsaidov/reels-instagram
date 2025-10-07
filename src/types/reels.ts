export type Reply = {
  id: string;
  userId: string;
  username: string;
  text: string;
  createdAt: string;
};

export type Comment = {
  id: string;
  userId: string;
  username: string;
  text: string;
  createdAt: string;
  replies?: Reply[];
};

export type Reel = {
  id: string;
  videoUrl: string;
  username: string;
  caption: string;
  likes: number;
  comments: Comment[];
  shares: number;
  createdAt: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
};


