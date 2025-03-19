// Simple in-memory user storage for demonstration
// In a real app, this would be replaced with a database
interface User {
  id: string;
  email: string;
  name?: string;
  password: string; // In a real app, this would be hashed
}

const users: User[] = [];

export interface SignUpData {
  email: string;
  password: string;
  name?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: Omit<User, 'password'>;
  token?: string;
}

// Generate a simple token (in a real app, use a proper JWT library)
const generateToken = (userId: string): string => {
  return `token_${userId}_${Date.now()}`;
};

export const signUp = async (data: SignUpData): Promise<AuthResponse> => {
  // Check if user already exists
  const existingUser = users.find(user => user.email === data.email);
  if (existingUser) {
    return {
      success: false,
      message: 'User with this email already exists'
    };
  }

  // Create new user
  const newUser: User = {
    id: `user_${Date.now()}`,
    email: data.email,
    password: data.password, // Would be hashed in a real app
    name: data.name
  };

  users.push(newUser);

  // Generate token
  const token = generateToken(newUser.id);

  // Return user without password
  const { password, ...userWithoutPassword } = newUser;
  
  return {
    success: true,
    message: 'User created successfully',
    user: userWithoutPassword,
    token
  };
};

export const signIn = async (data: SignInData): Promise<AuthResponse> => {
  // Find user by email
  const user = users.find(user => user.email === data.email);
  
  // Check if user exists and password matches
  if (!user || user.password !== data.password) {
    return {
      success: false,
      message: 'Invalid email or password'
    };
  }

  // Generate token
  const token = generateToken(user.id);

  // Return user without password
  const { password, ...userWithoutPassword } = user;
  
  return {
    success: true,
    message: 'Signed in successfully',
    user: userWithoutPassword,
    token
  };
};

// For demo purposes - add a test user
signUp({
  email: 'test@example.com',
  password: 'password123',
  name: 'Test User'
}); 