"use client";

import { changePassword, getProfile, updateProfile } from "@/api/action";
import CustomButton from "@/components/CustomButton";
import { useAlert } from "@/context/AlertProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, Modal, Skeleton } from "antd";
import { useEffect, useState } from "react";

const ProfilePage = () => {
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();
  
  interface Profile {
    username: string;
    firstname: string;
    lastname: string;
  }
  
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
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

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

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
      const confirmPass = field === "confirmPassword" ? value : passwords.confirmPassword;

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

  const handleOk = async () => {
    if (passwords.newPassword === passwords.confirmPassword && validatePassword(passwords.newPassword)) {
      try {
        await changePassword({passwords});
        showAlert("Амжилттай солигдлоо");
        setIsModalOpen(false);
        setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setPasswordError("");
      } catch (error) {
        showAlert("Алдаа гарлаа");
        setIsModalOpen(false);
      }
      // Here you would typically call an API to update the password

    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setPasswords({ currentPassword:"", newPassword: "", confirmPassword: "" });
    setPasswordError("");
  };

  const isOkButtonDisabled = !passwords.newPassword ||
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
    <div>
      <Button onClick={() => setIsModalOpen(true)} title="hello"/>
      <Form>
        <Form.Item label="username">
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
        <Form.Item>
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
        <Form.Item>
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
        <Form.Item>
          <Button type="primary" onClick={updateProf}>
            Өөрчлөх
          </Button>
          <Button onClick={() => setIsModalOpen(true)} style={{ marginLeft: 8 }}>
            Нууц үг солих
          </Button>
        </Form.Item>
      </Form>
      <Modal
        title="Нууц үг солих"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{ disabled: isOkButtonDisabled }}
      >
        <Form>
          <Form.Item label="Хуучин нууц үг" required>
            <Input.Password
              value={passwords.currentPassword}
              onChange={(e) => handlePasswordChange("currentPasswort", e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Шинэ нууц үг" required help={passwordError}>
            <Input.Password
              value={passwords.newPassword}
              onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
              status={passwordError ? "error" : undefined}
            />
          </Form.Item>
          <Form.Item label="Шинэ нууц үг давтах" required>
            <Input.Password
              value={passwords.confirmPassword}
              onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
              status={passwordError ? "error" : undefined}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProfilePage;