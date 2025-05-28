import { renderHook, act } from "@testing-library/react";
import { useAllUsers } from "./useAllUsers";
import { getUsers } from "../services/adminService";
import { useNavigate } from "react-router-dom";
import { User } from "../types/User";
import React from 'react';

jest.mock("../services/adminService", () => ({
  getUsers: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

const mockUsers: User[] = [
  {
    id: "3f2504e0-4f89-11d3-9a0c-0305e82c3301",
    username: "johndoe",
    email: "johndoe@example.com",
    role: "Admin",
    date: "2025-05-27T02:41:09.695455+00:00",
  },
  {
    id: "1c6e9d3a-8156-4b21-8c76-749ef9ef1e57",
    username: "janedoe",
    email: "janedoe@example.com",
    role: "Shopper",
    date: "2025-05-27T02:40:48.278166+00:00",
  },
  {
    id: "5b7b56f7-9248-4e87-90cd-df0c3a4c2369",
    username: "franksmith",
    email: "frank.smith@example.com",
    role: "Seller",
    date: "2025-05-26T02:58:02.626150+00:00",
  },
  {
    id: "dc76d4e9-96d2-4e2b-a3e5-118df2780d33",
    username: "lucywhite",
    email: "lucy.white@example.com",
    role: "Shopper",
    date: "2025-05-25T23:09:01.822283+00:00",
  },
];

describe("useAllUsers", () => {
  const mockNavigate = jest.fn();
  const mockSetData = jest.fn();
  const mockData = {};

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  describe("Initial State and User Loading", () => {
    it("should initialize with empty user list and loading state", async () => {
      (getUsers as jest.Mock).mockResolvedValue([]);

      const { result } = renderHook(() => useAllUsers());

      expect(result.current.loading).toBe(true);
      expect(result.current.users).toEqual([]);
      expect(result.current.error).toBeNull();
    });

    it("should load user list successfully", async () => {
      (getUsers as jest.Mock).mockResolvedValue(mockUsers);

      const { result } = renderHook(() => useAllUsers());

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(result.current.users).toEqual(mockUsers);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it("should handle user list loading error", async () => {
      const errorMessage = "Error fetching users";
      (getUsers as jest.Mock).mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useAllUsers());

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(result.current.error).toBe(errorMessage);
      expect(result.current.loading).toBe(false);
    });
  });
});
