import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Bot,
  Eye,
  X,
  ShieldCheck,
  ShieldOff,
  Pencil,
  PencilOff,
  Trash2,
  Save,
  IdCard,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import Image from "next/image";

export default function UserDetailsDialog({
  open,
  onOpenChange,
  user,
  onDelete,
  onUpdate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (userId: any) => void;
  onUpdate: (updatedUser: any) => void;
  user: any;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [unlockFullname, setUnlockFullname] = useState(true);
  const [unlockType, setUnlockType] = useState(true);
  const [unlockEmail, setUnlockEmail] = useState(true);
  const [unlockNumber, setUnlockNumber] = useState(true);
  const [fullname, setFullname] = useState(user?.fullname ?? "");
  const [password, setPassword] = useState("");
  const [contactNumber, setContactNumber] = useState(user?.contactNumber ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [type, setType] = useState(user?.type ?? "");
  const [changePassword, setChangePassword] = useState(false);

  // Verification media overlay
  const [showMediaOverlay, setShowMediaOverlay] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<string>("");

  useEffect(() => {
    setFullname(user?.fullname || "");
    setEmail(user?.email || "");
    setContactNumber(user?.contactNumber || "");
    setType(user?.type || "");
    setPassword("");
    setChangePassword(false);
    setUnlockFullname(true);
    setUnlockEmail(true);
    setUnlockNumber(true);
    setUnlockType(true);
    setIsEditing(false);
    setVerificationStatus("");
  }, [user]);

  const deleteUser = async (userId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/users/delete/${userId}`, {
        credentials: "include",
        method: "DELETE",
      });
      if (!res.ok) {
        const { error } = await res.json();
        toast.error(error ?? "Error upon deleting user");
        return;
      }
      const { message } = await res.json();
      toast.success(message);
      onDelete(user?.id);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async () => {
    const formData = new FormData();
    let hasChanges = false;

    if (!unlockFullname && fullname !== user.fullname) {
      formData.append("fullname", fullname);
      hasChanges = true;
    }
    if (!unlockNumber && contactNumber !== user.contactNumber) {
      formData.append("contactNumber", contactNumber);
      hasChanges = true;
    }
    if (!unlockEmail && email !== user.email) {
      formData.append("email", email);
      hasChanges = true;
    }
    if (!unlockType && type !== user.type) {
      formData.append("type", type);
      hasChanges = true;
    }
    if (changePassword && password.trim() !== "") {
      formData.append("password", password);
      hasChanges = true;
    }

    if (!hasChanges) {
      toast.warning("No changes to save.");
      return;
    }

    try {
      const res = await fetch(`/api/users/update/${user?.id}`, {
        credentials: "include",
        method: "PATCH",
        body: formData,
      });
      if (!res.ok) {
        const { error } = await res.json();
        toast.error(error ?? "Error upon editing user");
        return;
      }
      const { message } = await res.json();
      onUpdate?.({ ...user, fullname, email, contactNumber, type });
      toast.success(message);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred.");
    }
  };

  // TODO: implement verification submission
  const handleVerificationSubmit = async () => {
    if (!verificationStatus) {
      toast.warning("Please select a verification status.");
      return;
    }
    try {
      setIsLoading(true);
      const res = await fetch(`/api/users/verify/${user?.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ verificationStatus }),
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(
          data.error || "Something went wrong upon verifying the user.",
        );
        return;
      }
      onOpenChange(false);
      setIsLoading(false);
      toast.success("Successful verification");
      return
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
    // unimplemented
  };

  const isResident = user?.type === "resident";
  const hasMedia = !!user?.verificationMedia;
  const isAI = user?.verificationMedia?.isAI === true;
  const mediaUrl = user?.verificationMedia?.url;

  const verifiedBadge = () => {
    if (!isResident) return null;
    if (user?.isVerified === true)
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
          <CheckCircle2 className="w-3 h-3" /> Verified
        </span>
      );
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
        <Clock className="w-3 h-3" /> Unverified
      </span>
    );
  };

  return (
    <>
      {/* ── Main Dialog ── */}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md p-0 overflow-hidden rounded-2xl border border-stone-200 shadow-xl gap-0 ">
          {/* ── ID Document Overlay (inside dialog to stay above it) ── */}
          {showMediaOverlay && (
            <div className="absolute inset-0 z-50 flex flex-col rounded-2xl overflow-hidden bg-white/95 backdrop-blur-sm">
              {/* Overlay header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-stone-100 bg-white shrink-0">
                <div className="flex items-center gap-2">
                  <IdCard className="w-4 h-4 text-stone-500" />
                  <span className="text-sm font-medium text-stone-700">
                    Verification Document
                  </span>
                  {isAI && (
                  <div className="absolute top-3 left-3 z-10">
                    <Badge
                      variant="destructive"
                      className="flex items-center gap-1 text-xs shadow-md"
                    >
                      <Bot className="w-3 h-3" />
                      AI Generated
                    </Badge>
                  </div>
                )}
                </div>
                <button
                  onClick={() => setShowMediaOverlay(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-stone-100 transition-colors text-stone-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {/* Verification action */}
              <div className="px-5 py-4 bg-white border-t border-stone-100 flex items-center gap-3 shrink-0">
                <Select
                  value={verificationStatus}
                  onValueChange={setVerificationStatus}
                >
                  <SelectTrigger className="flex-1 h-9 text-sm">
                    <SelectValue placeholder="Set verification status…" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approved">
                      <span className="flex items-center gap-2 text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                      </span>
                    </SelectItem>
                    <SelectItem value="rejected">
                      <span className="flex items-center gap-2 text-red-700">
                        <XCircle className="w-3.5 h-3.5" /> Rejected
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  onClick={handleVerificationSubmit}
                  disabled={!verificationStatus}
                  className="h-9 px-4 bg-stone-900 hover:bg-stone-800 text-white text-sm"
                >
                  Submit
                </Button>
              </div>
              {/* Image — fills available space */}
              <div className="relative flex-1 bg-stone-100 min-h-0">
                
                <img
                  src={mediaUrl}
                  alt="Verification document"
                  className="object-contain p-3"
                />
              </div>
            </div>
          )}

          {/* Title bar */}
          <DialogHeader className="px-6 pt-6 pb-4 bg-linear-to-b from-stone-50 to-white border-b border-stone-100">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-base font-semibold text-stone-900">
                  User Details
                </DialogTitle>
                <p className="text-xs text-stone-400 mt-0.5 font-light">
                  {user?.email}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {verifiedBadge()}
                {isResident && hasMedia && (
                  <button
                    onClick={() => setShowMediaOverlay(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full hover:bg-blue-100 transition-colors"
                  >
                    <Eye className="w-3 h-3" />
                    View ID
                  </button>
                )}
              </div>
            </div>
          </DialogHeader>

          {/* Body */}
          <div className="px-6 py-5 flex flex-col gap-4">
            {/* Email */}
            <FieldRow
              label="Email"
              locked={isEditing || unlockEmail}
              onUnlock={() => setUnlockEmail((v) => !v)}
              isEditing={isEditing}
            >
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isEditing || unlockEmail}
                className="h-9 text-sm disabled:bg-stone-50 disabled:text-stone-400"
              />
            </FieldRow>

            {/* Fullname */}
            <FieldRow
              label="Full Name"
              locked={isEditing || unlockFullname}
              onUnlock={() => setUnlockFullname((v) => !v)}
              isEditing={isEditing}
            >
              <Input
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                disabled={isEditing || unlockFullname}
                className="h-9 text-sm disabled:bg-stone-50 disabled:text-stone-400"
              />
            </FieldRow>

            {/* Contact */}
            <FieldRow
              label="Contact Number"
              locked={isEditing || unlockNumber}
              onUnlock={() => setUnlockNumber((v) => !v)}
              isEditing={isEditing}
            >
              <Input
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                disabled={isEditing || unlockNumber}
                className="h-9 text-sm disabled:bg-stone-50 disabled:text-stone-400"
              />
            </FieldRow>

            {/* Role */}
            <FieldRow
              label="Role"
              locked={isEditing || unlockType}
              onUnlock={() => setUnlockType((v) => !v)}
              isEditing={isEditing}
            >
              <Select
                value={type}
                onValueChange={setType}
                disabled={isEditing || unlockType}
              >
                <SelectTrigger className="h-9 text-sm w-full disabled:bg-stone-50 disabled:text-stone-400">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="barangay_official">
                    Barangay Official
                  </SelectItem>
                  <SelectItem value="resident">Resident</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </FieldRow>

            {/* Change password */}
            <div className="flex items-center gap-2 pt-1">
              <Checkbox
                id="change-pw"
                disabled={isEditing}
                checked={changePassword}
                onCheckedChange={(c) => setChangePassword(!!c)}
                className="data-[state=checked]:bg-stone-900 data-[state=checked]:border-stone-900"
              />
              <Label
                htmlFor="change-pw"
                className="text-sm text-stone-600 font-normal cursor-pointer"
              >
                Change password
              </Label>
            </div>

            {changePassword && !isEditing && (
              <Input
                type="password"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-9 text-sm"
              />
            )}

            <Separator className="my-1" />

            {/* Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 text-xs border-stone-200 hover:bg-stone-50"
                onClick={() => setIsEditing((v) => !v)}
              >
                {isEditing ? (
                  <>
                    <Pencil className="w-3 h-3" /> Enable Editing
                  </>
                ) : (
                  <>
                    <PencilOff className="w-3 h-3" /> Disable Editing
                  </>
                )}
              </Button>

              {!isEditing && (
                <Button
                  size="sm"
                  className="h-8 gap-1.5 text-xs bg-stone-900 hover:bg-stone-800 text-white"
                  disabled={isLoading}
                  onClick={handleEdit}
                >
                  <Save className="w-3 h-3" /> Save Changes
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                className={`h-8 gap-1.5 text-xs ml-auto border ${
                  user?.isActive
                    ? "border-red-200 text-red-600 hover:bg-red-50"
                    : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                }`}
                onClick={() => deleteUser(user?.id)}
                disabled={isLoading}
              >
                {user?.isActive ? (
                  <>
                    <ShieldOff className="w-3 h-3" /> Restrict
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3 h-3" /> Unrestrict
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

/* ── Reusable field row ── */
function FieldRow({
  label,
  locked,
  onUnlock,
  isEditing,
  children,
}: {
  label: string;
  locked: boolean;
  onUnlock: () => void;
  isEditing: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium text-stone-500 uppercase tracking-wide">
          {label}
        </Label>
        {!isEditing && (
          <div className="flex items-center gap-1.5">
            <Checkbox
              checked={!locked}
              onCheckedChange={onUnlock}
              className="w-3.5 h-3.5 data-[state=checked]:bg-stone-900 data-[state=checked]:border-stone-900"
            />
            <span className="text-[11px] text-stone-400">
              {locked ? "Locked" : "Unlocked"}
            </span>
          </div>
        )}
      </div>
      {children}
    </div>
  );
}
