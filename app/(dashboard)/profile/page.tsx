"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Divider, Form, Input, Modal, Skeleton } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  changePassword,
  deleteProfile,
  getProfile,
  updateProfile,
} from "@/api/action";
import CustomButton from "@/components/CustomButton";
import { useAlert } from "@/context/AlertProvider";

const ProfilePage = () => {
  const router = useRouter();
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();

  interface Profile {
    username: string;
    firstname: string;
    lastname: string;
  }

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isProfileChanged, setIsProfileChanged] = useState<boolean>(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState<string>("");

  const {
    data: profileData,
    isFetching,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: () => getProfile(),
    refetchOnWindowFocus: false,
    retry: false,
  });

  const updateMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (updatedProfile) => {
      localStorage.removeItem("profile");
      localStorage.setItem("profile", JSON.stringify(profile));
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      showAlert("Амжилттай шинэчлэгдлээ", "success", "", true);
      setIsProfileChanged(false);
    },
    onError: (error: any) => {
      showAlert("Алдаа гарлаа", "error", "", true);
    },
  });

  const updateProf = () => {
    updateMutation.mutate(profile);
  };

  useEffect(() => {
    if (profileData) {
      setProfile(profileData);
    }
  }, [profileData]);

  useEffect(() => {
    if (profile && profileData) {
      const hasChanged =
        profile.username !== profileData.username ||
        profile.firstname !== profileData.firstname ||
        profile.lastname !== profileData.lastname;
      setIsProfileChanged(hasChanged);
    }
  }, [profile, profileData]);

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[@$!%*?&]/.test(password);

    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumber &&
      hasSpecialChar
    );
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswords((prev) => ({ ...prev, [field]: value }));

    if (field === "newPassword" || field === "confirmPassword") {
      const newPass = field === "newPassword" ? value : passwords.newPassword;
      const confirmPass =
        field === "confirmPassword" ? value : passwords.confirmPassword;

      if (newPass !== confirmPass) {
        setPasswordError("Шинэ нууц үгнүүд таарахгүй байна");
      } else {
        setPasswordError("");
      }

      if (field === "newPassword" && value && !validatePassword(value)) {
        setPasswordError(
          "Нууц үг дор хаяж 8 тэмдэгттэй, том жижиг үсэг, тоо, тусгай тэмдэгт агуулсан байх ёстой"
        );
      }
    }
  };

  const handleDeleteProf = async () => {
    try {
      const result = await deleteProfile();
      if (result.message === "Account successfully deleted") {
        showAlert("Хэрэглэгчийн бүртгэл амжилттай устлаа", "success", "", true);
        localStorage.removeItem("token");
        localStorage.removeItem("profile");
        queryClient.invalidateQueries({ queryKey: ["profile"] });
        setTimeout(() => {
          router.push("/login"); 
        }, 1500);
      }
    } catch (error: any) {
      showAlert(
        error.response?.data?.message || "Бүртгэл устгахад алдаа гарлаа",
        "error",
        "",
        true
      );
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const handleOk = async () => {
    if (
      passwords.newPassword === passwords.confirmPassword &&
      validatePassword(passwords.newPassword)
    ) {
      try {
        const result = await changePassword(passwords);
        console.log(result);
        if (result.message === "Current password doesn't match") {
          showAlert("Одоогийн нууц үг буруу байна");
        } else if (result.message === "Password changed successfully") {
          showAlert("Амжилттай солигдлоо");
          setIsModalOpen(false);
          setPasswords({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
          setPasswordError("");
        }
      } catch (error) {
        showAlert("Алдаа гарлаа");
        setIsModalOpen(false);
      }
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setPasswordError("");
  };

  const isOkButtonDisabled =
    !passwords.newPassword ||
    !passwords.confirmPassword ||
    passwords.newPassword !== passwords.confirmPassword ||
    !validatePassword(passwords.newPassword);

  if (isLoading) {
    return <Skeleton />;
  }

  if (error) {
    return (
      <div>
        <p>Алдаа гарлаа</p>
        <CustomButton
          title="Дахин оролдох"
          className="!text-xs px-4 bg-[#444] rounded-2xl text-white hover:cursor-pointer hover:bg-clicked"
        />
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center mt-20">
      <Card className="w-100" title="Хэрэглэгчийн мэдээлэл">
        <Form layout="vertical">
          <Form.Item label="Хэрэглэгчийн нэр">
            <Input
              value={profile?.username}
              onChange={(e) => {
                setProfile((prev: any) => ({
                  ...prev,
                  username: e.target.value,
                }));
              }}
            />
          </Form.Item>
          <Form.Item label="Нэр">
            <Input
              value={profile?.firstname}
              onChange={(e) => {
                setProfile((prev: any) => ({
                  ...prev,
                  firstname: e.target.value,
                }));
              }}
            />
          </Form.Item>
          <Form.Item label="Овог">
            <Input
              value={profile?.lastname}
              onChange={(e) => {
                setProfile((prev: any) => ({
                  ...prev,
                  lastname: e.target.value,
                }));
              }}
            />
          </Form.Item>
          <div className="flex flex-row gap-4">
            <CustomButton
              onClick={() => updateProf()}
              title="Өөрчлөх"
              className="px-4 bg-clicked text-white rounded-xl !text-xs hover:cursor-pointer hover:bg-main-purple"
              disabled={!isProfileChanged}
            />
            <CustomButton
              onClick={() => setIsModalOpen(true)}
              title="Нууц үг солих"
              className="px-4 bg-main-bg border text-black rounded-xl !text-xs hover:cursor-pointer hover:bg-[#888] hover:text-white"
            />
          </div>
        </Form>
        <Divider />
        <CustomButton
          onClick={() => setIsDeleteModalOpen(true)}
          title="Бүртгэл устгах"
          className="w-full px-4 bg-red-500 text-white rounded-xl !text-xs hover:cursor-pointer hover:bg-red-600"
        /> 
      </Card>
      <Modal
        title="Нууц үг солих"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Солих"
        cancelText="Болих"
        okButtonProps={{ disabled: isOkButtonDisabled }}
      >
        <Form>
          <Form.Item label="Хуучин нууц үг" required>
            <Input.Password
              value={passwords.currentPassword}
              onChange={(e) =>
                handlePasswordChange("currentPassword", e.target.value)
              }
            />
          </Form.Item>
          <Form.Item label="Шинэ нууц үг" required help={passwordError}>
            <Input.Password
              value={passwords.newPassword}
              onChange={(e) =>
                handlePasswordChange("newPassword", e.target.value)
              }
              status={passwordError ? "error" : undefined}
            />
          </Form.Item>
          <Form.Item label="Шинэ нууц үг давтах" required>
            <Input.Password
              value={passwords.confirmPassword}
              onChange={(e) =>
                handlePasswordChange("confirmPassword", e.target.value)
              }
              status={passwordError ? "error" : undefined}
            />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Бүртгэл устгах"
        open={isDeleteModalOpen}
        onOk={handleDeleteProf}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Устгах"
        cancelText="Болих"
        okButtonProps={{ danger: true }}
      >
        <p>
          Та бүртгэлээ устгахдаа итгэлтэй байна уу? Энэ үйлдлийг буцаах
          боломжгүй.
        </p>
      </Modal>
    </div>
  );
};

export default ProfilePage;
