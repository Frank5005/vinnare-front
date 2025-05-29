import { signup, login, getRoleFromToken, verifyEmail, getSecurityQuestions, resetPassword, isAuthenticated } from './authService';
import api from './api';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

jest.mock('./api');
jest.mock('js-cookie');
jest.mock('jwt-decode');

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    (jwtDecode as jest.Mock).mockClear();
  });

  describe('signup', () => {
    const mockSignUpData = {
      name: 'John Doe',
      email: 'john@example.com',
      username: 'johndoe',
      password: 'password123',
      address: '123 Main St',
      securityQuestion: 'What is your favorite color?',
      securityAnswer: 'blue'
    };

    it('should sign up successfully', async () => {
      const mockResponse = { success: true };
      (api.post as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

      const result = await signup(mockSignUpData);

      expect(api.post).toHaveBeenCalledWith('/api/auth', mockSignUpData);
      expect(result).toEqual(mockResponse);
    });

    it('should handle signup errors', async () => {
      const mockError = new Error('Signup failed');
      (api.post as jest.Mock).mockRejectedValueOnce(mockError);

      await expect(signup(mockSignUpData)).rejects.toThrow('Signup failed');
      expect(api.post).toHaveBeenCalledWith('/api/auth', mockSignUpData);
    });
  });

  describe('login', () => {
    const mockLoginData = {
      email: 'john@example.com',
      password: 'password123',
      remember: true
    };

    const mockToken = 'fake-token-123';
    const mockResponse = {
      token: mockToken,
      username: 'johndoe',
      id: '123'
    };

    beforeEach(() => {
      (jwtDecode as jest.Mock).mockReturnValue({
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': 'user'
      });
    });

    it('should login successfully and store data', async () => {
      (api.post as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

      const result = await login(mockLoginData);

      expect(api.post).toHaveBeenCalledWith('/api/login', {
        email: mockLoginData.email,
        password: mockLoginData.password
      });
      expect(localStorage.getItem('token')).toBe(mockToken);
      expect(localStorage.getItem('userName')).toBe('johndoe');
      expect(localStorage.getItem('userEmail')).toBe('john@example.com');
      expect(localStorage.getItem('userId')).toBe('123');
      expect(localStorage.getItem('userRole')).toBe('user');
      expect(api.defaults.headers.common['Authorization']).toBe(`Bearer ${mockToken}`);
      expect(Cookies.set).toHaveBeenCalledWith('token', mockToken, { expires: 1 });
      expect(Cookies.set).toHaveBeenCalledWith('userName', 'johndoe', { expires: 1 });
      expect(Cookies.set).toHaveBeenCalledWith('userEmail', 'john@example.com', { expires: 1 });
      expect(Cookies.set).toHaveBeenCalledWith('userId', '123', { expires: 1 });
      expect(result).toEqual(mockResponse);
    });

    it('should login without remember me', async () => {
      (api.post as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

      await login({ ...mockLoginData, remember: false });

      expect(Cookies.set).not.toHaveBeenCalled();
    });

    it('should handle login errors', async () => {
      const mockError = new Error('Login failed');
      (api.post as jest.Mock).mockRejectedValueOnce(mockError);

      await expect(login(mockLoginData)).rejects.toThrow('Login failed');
    });
  });

  describe('getRoleFromToken', () => {
    it('should extract role from token', () => {
      const mockToken = 'fake-token';
      const mockDecodedToken = {
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': 'admin'
      };
      (jwtDecode as jest.Mock).mockReturnValue(mockDecodedToken);

      const role = getRoleFromToken(mockToken);

      expect(jwtDecode).toHaveBeenCalledWith(mockToken);
      expect(role).toBe('admin');
    });

    it('should return null for invalid token', () => {
      (jwtDecode as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const role = getRoleFromToken('invalid-token');

      expect(role).toBeNull();
    });
  });

  describe('verifyEmail', () => {
    const mockVerifyData = {
      email: 'john@example.com',
      securityQuestion: 'What is your favorite color?',
      securityAnswer: 'blue'
    };

    it('should verify email successfully', async () => {
      const mockResponse = { success: true };
      (api.post as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

      const result = await verifyEmail(
        mockVerifyData.email,
        mockVerifyData.securityQuestion,
        mockVerifyData.securityAnswer
      );

      expect(api.post).toHaveBeenCalledWith('/api/user/verify', mockVerifyData);
      expect(result).toEqual(mockResponse);
    });

    it('should handle verification errors', async () => {
      const mockError = new Error('Verification failed');
      (api.post as jest.Mock).mockRejectedValueOnce(mockError);

      await expect(
        verifyEmail(
          mockVerifyData.email,
          mockVerifyData.securityQuestion,
          mockVerifyData.securityAnswer
        )
      ).rejects.toThrow('Verification failed');
    });
  });

  describe('getSecurityQuestions', () => {
    it('should fetch and format security questions', async () => {
      const mockQuestions = [
        { id: 1, name: 'favoriteColor' },
        { id: 2, name: 'birthCity' }
      ];
      (api.get as jest.Mock).mockResolvedValueOnce({ data: mockQuestions });

      const result = await getSecurityQuestions();

      expect(api.get).toHaveBeenCalledWith('/api/securityquestions');
      expect(result).toEqual([
        { value: 'favoriteColor', label: 'Favorite Color' },
        { value: 'birthCity', label: 'Birth City' }
      ]);
    });

    it('should handle errors when fetching questions', async () => {
      const mockError = new Error('Failed to fetch questions');
      (api.get as jest.Mock).mockRejectedValueOnce(mockError);

      await expect(getSecurityQuestions()).rejects.toThrow('Failed to fetch questions');
    });
  });

  describe('resetPassword', () => {
    const mockResetData = {
      password: 'newPassword123',
      token: 'reset-token-123'
    };

    it('should reset password successfully', async () => {
      const mockResponse = { success: true };
      (api.put as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

      const result = await resetPassword(mockResetData.password, mockResetData.token);

      expect(api.put).toHaveBeenCalledWith(
        '/api/user',
        { password: mockResetData.password },
        {
          headers: {
            Authorization: `Bearer ${mockResetData.token}`
          }
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle reset password errors', async () => {
      const mockError = new Error('Reset failed');
      (api.put as jest.Mock).mockRejectedValueOnce(mockError);

      await expect(
        resetPassword(mockResetData.password, mockResetData.token)
      ).rejects.toThrow('Reset failed');
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when token exists', () => {
      localStorage.setItem('token', 'fake-token');
      expect(isAuthenticated()).toBe(true);
    });

    it('should return false when token does not exist', () => {
      localStorage.removeItem('token');
      expect(isAuthenticated()).toBe(false);
    });
  });
});
