export interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
}

export interface Task {
  id: number;
  name: string;
  description: string;
  completed: boolean;
  userId: string | undefined;
}
  
  