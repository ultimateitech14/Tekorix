import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminSecurityPage() {
  return (
    <div className="max-w-3xl">
      <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-xl text-white">Security Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-[0.16em] text-slate-400">Current Password</Label>
            <Input type="password" className="border-white/15 bg-white/5 text-slate-100" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-[0.16em] text-slate-400">New Password</Label>
            <Input type="password" className="border-white/15 bg-white/5 text-slate-100" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-[0.16em] text-slate-400">Confirm New Password</Label>
            <Input type="password" className="border-white/15 bg-white/5 text-slate-100" />
          </div>
          <Button>Update Password</Button>
        </CardContent>
      </Card>
    </div>
  );
}
