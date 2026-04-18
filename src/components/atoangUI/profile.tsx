"use client";
import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit2,
  Save,
  X,
  Camera,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useAuth } from "@/contexts/authContext";
import { profileSchema, profileSchemaType } from "@/defs/definitions";
import { uploadFiles } from "@/lib/uploadthing";

interface ProfileData {
  fullname?: string;
  email?: string;
  phone?: string;
  address?: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string>(
    user?.profilePhoto ?? "",
  );

  const [profile, setProfile] = useState<ProfileData>({
    fullname: user?.fullname,
    email: user?.email,
    phone: user?.contactNumber,
    address: user?.address,
  });
  const [editedProfile, setEditedProfile] = useState<ProfileData>(profile);

  // Password change state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoUploading(true);
    try {
      const uploaded = await uploadFiles("profilePhotoUploader", {
        files: [file],
      });
      if (!uploaded?.length) throw new Error("Upload failed");

      const url = uploaded[0].ufsUrl;

      // This route now handles deleting the old photo + saving new one
      const res = await fetch(`/api/users/update-photo/${user?.id}`, {
        method: "PATCH",
        body: JSON.stringify({ profilePhoto: url }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error);
        return;
      }

      const data = await res.json();
      setProfilePhoto(data.profilePhoto);
      toast.success("Profile photo updated!");
    } catch {
      toast.error("Failed to upload photo.");
    } finally {
      setPhotoUploading(false);
      // Reset input so same file can be re-selected if needed
      e.target.value = "";
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const result = profileSchema.safeParse(editedProfile);
      if (!result.success) {
        toast.warning(result.error.issues[0].message);
        return;
      }
      const updatedFields: Partial<profileSchemaType> = {};
      (Object.keys(result.data) as (keyof profileSchemaType)[]).forEach(
        (key) => {
          if (result.data[key] !== profile[key])
            updatedFields[key] = result.data[key];
        },
      );
      if (Object.keys(updatedFields).length === 0) {
        toast.info("No changes detected.");
        setIsEditing(false);
        return;
      }
      const res = await fetch(`/api/users/update/${user?.id}`, {
        method: "PATCH",
        body: JSON.stringify(result.data),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error);
        return;
      }
      setProfile(editedProfile);
      toast.success("Profile updated successfully.");
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsEditing(false);
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    setPasswordLoading(true);
    try {
      const res = await fetch(`/api/users/change-password/${user?.id}`, {
        method: "POST",
        body: JSON.stringify(passwordForm),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error);
        return;
      }
      toast.success("Password changed successfully.");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordForm(false);
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Profile Card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-primary">
                My Profile
              </CardTitle>
              <CardDescription>
                Manage your personal information
              </CardDescription>
            </div>
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                className="gap-2"
              >
                <Edit2 className="h-4 w-4" /> Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setEditedProfile(profile);
                    setIsEditing(false);
                  }}
                  variant="ghost"
                  size="icon"
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button
                  disabled={isLoading}
                  onClick={handleSave}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" /> Save
                </Button>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profilePhoto} />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {profile.fullname?.[0] ?? "U"}
                </AvatarFallback>
              </Avatar>
              <label
                htmlFor="photo-upload"
                className="absolute inset-0 flex items-center justify-center
                           bg-black/40 rounded-full opacity-0 group-hover:opacity-100
                           transition-opacity cursor-pointer"
              >
                {photoUploading ? (
                  <span className="text-white text-xs">...</span>
                ) : (
                  <Camera className="h-6 w-6 text-white" />
                )}
              </label>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
                disabled={photoUploading}
              />
            </div>
            <div>
              <p className="font-semibold text-lg">{profile.fullname}</p>
              <p className="text-sm text-muted-foreground capitalize">
                {user?.type?.replace("_", " ")}
              </p>
            </div>
          </div>

          <Separator />

          {/* Fields */}
          <div className="grid gap-5 grid-cols-1 md:grid-cols-2">
            {[
              {
                id: "fullname",
                label: "Full Name",
                icon: User,
                type: "text",
                field: "fullname" as keyof ProfileData,
              },
              {
                id: "email",
                label: "Email Address",
                icon: Mail,
                type: "email",
                field: "email" as keyof ProfileData,
              },
              {
                id: "phone",
                label: "Phone Number",
                icon: Phone,
                type: "text",
                field: "phone" as keyof ProfileData,
              },
              {
                id: "address",
                label: "Address",
                icon: MapPin,
                type: "text",
                field: "address" as keyof ProfileData,
              },
            ].map(({ id, label, icon: Icon, type, field }) => (
              <div key={id} className="space-y-2">
                <Label htmlFor={id} className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground" /> {label}
                </Label>
                {isEditing ? (
                  <Input
                    id={id}
                    type={type}
                    value={editedProfile[field] ?? ""}
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        [field]: e.target.value,
                      })
                    }
                  />
                ) : (
                  <p className="text-foreground py-2">
                    {profile[field] ?? "—"}
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Change Password Card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" /> Change Password
              </CardTitle>
              <CardDescription>Update your account password</CardDescription>
            </div>
            {!showPasswordForm && (
              <Button
                onClick={() => setShowPasswordForm(true)}
                variant="outline"
                className="gap-2"
              >
                <Edit2 className="h-4 w-4" /> Change
              </Button>
            )}
          </div>
        </CardHeader>

        {showPasswordForm && (
          <CardContent className="space-y-4">
            {[
              {
                id: "currentPassword",
                label: "Current Password",
                show: showCurrent,
                toggle: () => setShowCurrent((p) => !p),
                field: "currentPassword" as keyof PasswordForm,
              },
              {
                id: "newPassword",
                label: "New Password",
                show: showNew,
                toggle: () => setShowNew((p) => !p),
                field: "newPassword" as keyof PasswordForm,
              },
              {
                id: "confirmPassword",
                label: "Confirm New Password",
                show: showConfirm,
                toggle: () => setShowConfirm((p) => !p),
                field: "confirmPassword" as keyof PasswordForm,
              },
            ].map(({ id, label, show, toggle, field }) => (
              <div key={id} className="space-y-2">
                <Label htmlFor={id}>{label}</Label>
                <div className="relative">
                  <Input
                    id={id}
                    type={show ? "text" : "password"}
                    value={passwordForm[field]}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        [field]: e.target.value,
                      })
                    }
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={toggle}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {show ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}

            <div className="flex gap-2 pt-2">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowPasswordForm(false);
                  setPasswordForm({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                }}
              >
                Cancel
              </Button>
              <Button disabled={passwordLoading} onClick={handlePasswordChange}>
                {passwordLoading ? "Saving..." : "Save Password"}
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
