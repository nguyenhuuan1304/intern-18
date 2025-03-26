import React from "react";
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

// Types
interface PaymentStatusProps {
  orderNumber?: string;
  amount?: string;
  date?: string;
  email?: string;

  onTryAgain?: () => void;
}

// PaymentSuccess Component
export const PaymentSuccess: React.FC<PaymentStatusProps> = ({
  orderNumber = "ORD-12345",
  amount = "$128.00",
  date = new Date().toLocaleDateString(),
  email = "example@email.com",
}) => {
  const navigate = useNavigate();
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
          <div className="rounded-md bg-slate-50 p-4">
            <div className="flex items-center justify-between py-1">
              <span className="text-sm text-slate-500">Mã đơn hàng:</span>
              <span className="font-medium">{orderNumber}</span>
            </div>
            <div className="flex items-center justify-between border-t border-dashed border-slate-200 py-1">
              <span className="text-sm text-slate-500">Số tiền:</span>
              <span className="font-medium">{amount}</span>
            </div>
            <div className="flex items-center justify-between border-t border-dashed border-slate-200 py-1">
              <span className="text-sm text-slate-500">Ngày:</span>
              <span className="font-medium">{date}</span>
            </div>
            <div className="flex items-center justify-between border-t border-dashed border-slate-200 py-1">
              <span className="text-sm text-slate-500">Email:</span>
              <span className="font-medium">{email}</span>
            </div>
          </div>

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
            onClick={() => navigate("/cart")}
            className="w-full"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Quay lại
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
