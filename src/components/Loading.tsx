import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b">
      <Card className="w-96 bg-white/90 backdrop-blur-md rounded-3xl shadow-xl border border-indigo-200">
        <CardContent className="flex flex-col items-center justify-center space-y-4 p-12">
          <Loader2 className="animate-spin h-24 w-24 text-indigo-600" />
          <p className="text-3xl font-semibold text-indigo-800 animate-pulse">
        
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Loading;
