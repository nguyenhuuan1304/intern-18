import React, { useEffect } from "react";
import { Check, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { removeCartItem } from "@/store/cartSlice";
export const PaymentSuccess: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  useEffect(() => {
    const clearCartOnServer = async () => {
      try {
        await Promise.all(
          cartItems.map((item) => dispatch(removeCartItem(item.documentId)))
        );
      } catch (error) {
        console.error("Error clearing cart on server:", error);
      }
    };

    clearCartOnServer();
  }, [dispatch, cartItems, navigate]);

  return (
    <div className="flex min-h-[500px] w-full items-center justify-center p-4">
      <Card className="w-full max-w-md overflow-hidden border-none shadow-lg">
        <div className="bg-green-500 py-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white">
            <Check className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <CardHeader className="pb-2 text-center">
          <CardTitle className="text-2xl font-bold">
            Thanh toán thành công!
          </CardTitle>
          <CardDescription>Cảm ơn bạn đã đặt hàng</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600">
            <p className="flex items-center gap-2">
              <Check className="h-4 w-4" />
              Biên lai thanh toán đã được gửi đến email của bạn
            </p>
          </div>
        </CardContent>

        <CardFooter>
          <Button
            variant="ghost"
            onClick={() => navigate("/account")}
            className="w-full"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Quay lại
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
