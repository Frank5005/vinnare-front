import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PaymentDetails from "../shopper/PaymentDetails";
import * as useCartHook from "../../hooks/useCart";
import toast from "react-hot-toast";

// Mocks
jest.mock("react-hot-toast", () => ({
  error: jest.fn(),
}));
jest.mock("../../hooks/useCart");

describe("PaymentDetails Component", () => {
  const mockUseCart = {
    buyingProducts: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useCartHook.useCart as jest.Mock).mockReturnValue(mockUseCart);
  });

  describe("Rendering", () => {
    it("renders Credit Card form by default", () => {
      render(<PaymentDetails />);
      expect(screen.getByPlaceholderText(/Cardholder Name/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Card Number/i)).toBeInTheDocument();
    });

    it("renders PayPal form when PayPal button is clicked", () => {
      render(<PaymentDetails />);
      const paypalButton = screen.getByRole("button", { name: /PayPal/i });
      fireEvent.click(paypalButton);
      expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Card Number/i)).toBeInTheDocument();
    });
  });

  describe("Form switching", () => {
    it("switches back to Credit Card form when Credit Card button is clicked", () => {
      render(<PaymentDetails />);
      const paypalButton = screen.getByRole("button", { name: /PayPal/i });
      fireEvent.click(paypalButton);
      const cardButton = screen.getByRole("button", { name: /Credit Card/i });
      fireEvent.click(cardButton);
      expect(screen.getByPlaceholderText(/Cardholder Name/i)).toBeInTheDocument();
    });
  });

  describe("Form validation", () => {
    it("shows error toast when card form is incomplete", async () => {
      render(<PaymentDetails />);
      const payButton = screen.getByRole("button", { name: /Pay with card/i });
      fireEvent.click(payButton);
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Please complete the information.");
      });
      expect(mockUseCart.buyingProducts).not.toHaveBeenCalled();
    });

    it("shows error toast when PayPal form is incomplete", async () => {
      render(<PaymentDetails />);
      const paypalButton = screen.getByRole("button", { name: /PayPal/i });
      fireEvent.click(paypalButton);
      const payButton = screen.getByRole("button", { name: /Pay Now/i });
      fireEvent.click(payButton);
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Please complete the information.");
      });
      expect(mockUseCart.buyingProducts).not.toHaveBeenCalled();
    });
  });

  describe("Successful submission", () => {
    it("calls buyingProducts when card form is valid", async () => {
      render(<PaymentDetails />);
      fireEvent.change(screen.getByPlaceholderText(/Cardholder Name/i), {
        target: { value: "John Doe" },
      });
      fireEvent.change(screen.getByPlaceholderText(/^Card Number$/i), {
        target: { value: "4111111111111111" },
      });
      fireEvent.change(screen.getByTitle("Month"), {
        target: { value: "01" },
      });
      fireEvent.change(screen.getByTitle("Year"), {
        target: { value: "2025" },
      });
      fireEvent.change(screen.getByPlaceholderText(/CVC/i), {
        target: { value: "123" },
      });

      const payButton = screen.getByRole("button", { name: /Pay with card/i });
      fireEvent.click(payButton);

      await waitFor(() => {
        expect(mockUseCart.buyingProducts).toHaveBeenCalled();
      });
    });

    it("calls buyingProducts when PayPal form is valid", async () => {
      render(<PaymentDetails />);
      const paypalButton = screen.getByRole("button", { name: /PayPal/i });
      fireEvent.click(paypalButton);

      fireEvent.change(screen.getByPlaceholderText(/Email/i), {
        target: { value: "test@example.com" },
      });
      fireEvent.change(screen.getByPlaceholderText(/^Card Number$/i), {
        target: { value: "4111111111111111" },
      });

      const payButton = screen.getByRole("button", { name: /Pay Now/i });
      fireEvent.click(payButton);

      await waitFor(() => {
        expect(mockUseCart.buyingProducts).toHaveBeenCalled();
      });
    });
  });

  describe("Save Card Toggle", () => {
    it("toggles saveCard state when button is clicked", () => {
      render(<PaymentDetails />);
      const toggleButton = screen.getByTitle("Save card");
      expect(toggleButton).toHaveClass("bg-gray-300");
      fireEvent.click(toggleButton);
      expect(toggleButton).toHaveClass("bg-black");
    });
  });
});
