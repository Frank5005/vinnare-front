import { getUsers, createEmployee, getJobs, reviewJob } from './adminService';
import api from './api';
import { EmployeeData } from '../types/EmployeeData';

jest.mock('./api', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

describe('adminService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUsers', () => {
    it('should fetch users successfully', async () => {
      const mockUsers = [{ id: 1, name: 'John Doe' }];
      (api.get as jest.Mock).mockResolvedValueOnce({ data: mockUsers });

      const result = await getUsers();

      expect(api.get).toHaveBeenCalledWith('/api/user/list');
      expect(result).toEqual(mockUsers);
    });

    it('should handle errors when fetching users', async () => {
      const mockError = new Error('Failed to fetch users');
      (api.get as jest.Mock).mockRejectedValueOnce(mockError);

      await expect(getUsers()).rejects.toThrow('Failed to fetch users');
      expect(api.get).toHaveBeenCalledWith('/api/user/list');
    });
  });

  describe('createEmployee', () => {
    const mockEmployeeData: EmployeeData = {
      name: 'John Doe',
      email: 'john@example.com',
      username: 'johndoe',
      password: 'password123',
      address: '123 Main St',
      securityQuestion: 'What is your favorite color?',
      securityAnswer: 'blue',
      role: 'employee'
    };

    it('should create employee successfully', async () => {
      const mockResponse = { id: 1, ...mockEmployeeData };
      (api.post as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

      const result = await createEmployee(mockEmployeeData);

      expect(api.post).toHaveBeenCalledWith('/api/admin/auth', mockEmployeeData);
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors when creating employee', async () => {
      const mockError = new Error('Failed to create employee');
      (api.post as jest.Mock).mockRejectedValueOnce(mockError);

      await expect(createEmployee(mockEmployeeData)).rejects.toThrow('Failed to create employee');
      expect(api.post).toHaveBeenCalledWith('/api/admin/auth', mockEmployeeData);
    });
  });

  describe('getJobs', () => {
    it('should fetch jobs successfully', async () => {
      const mockJobs = [{ id: 1, title: 'Job 1' }];
      (api.get as jest.Mock).mockResolvedValueOnce({ data: mockJobs });

      const result = await getJobs();

      expect(api.get).toHaveBeenCalledWith('/api/jobs');
      expect(result).toEqual(mockJobs);
    });

    it('should handle errors when fetching jobs', async () => {
      const mockError = new Error('Failed to fetch jobs');
      (api.get as jest.Mock).mockRejectedValueOnce(mockError);

      await expect(getJobs()).rejects.toThrow('Failed to fetch jobs');
      expect(api.get).toHaveBeenCalledWith('/api/jobs');
    });
  });

  describe('reviewJob', () => {
    const mockReviewData = {
      id: 1,
      type: 'approve',
      action: 'accept'
    };

    it('should review job successfully', async () => {
      const mockResponse = { success: true };
      (api.post as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

      const result = await reviewJob(
        mockReviewData.id,
        mockReviewData.type,
        mockReviewData.action
      );

      expect(api.post).toHaveBeenCalledWith(
        'api/jobs/review-job',
        mockReviewData
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors when reviewing job', async () => {
      const mockError = new Error('Failed to review job');
      (api.post as jest.Mock).mockRejectedValueOnce(mockError);

      await expect(
        reviewJob(mockReviewData.id, mockReviewData.type, mockReviewData.action)
      ).rejects.toThrow('Failed to review job');
      expect(api.post).toHaveBeenCalledWith(
        'api/jobs/review-job',
        mockReviewData
      );
    });
  });
});
