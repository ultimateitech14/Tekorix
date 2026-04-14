import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminSecurityPage() {
  return (
    <div className="max-w-3xl">
      <Card className="border-[#D4E8FC] bg-[#F8FBFF] backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-xl text-slate-900">Security Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-[0.16em] text-slate-500">Current Password</Label>
            <Input type="password" className="border-[#D4E8FC] bg-[#F8FBFF] text-slate-900" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-[0.16em] text-slate-500">New Password</Label>
            <Input type="password" className="border-[#D4E8FC] bg-[#F8FBFF] text-slate-900" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-[0.16em] text-slate-500">Confirm New Password</Label>
            <Input type="password" className="border-[#D4E8FC] bg-[#F8FBFF] text-slate-900" />
          </div>
          <Button>Update Password</Button>
        </CardContent>
      </Card>
    </div>
  );
}

