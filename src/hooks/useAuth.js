// src/hooks/useAuth.js
import { useState } from "react";
import { changePassword, resetPassword } from "../api/auth.js";

export const usePasswordChange = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handlePasswordChange = async (currentPassword, newPassword) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await changePassword(currentPassword, newPassword);

      if (result.success) {
        setSuccess(true);
        return { success: true, message: result.message };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMessage = "비밀번호 변경 중 오류가 발생했습니다.";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async email => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await resetPassword(email);

      if (result.success) {
        setSuccess(true);
        return { success: true, message: result.message };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMessage = "이메일 발송 중 오류가 발생했습니다.";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setError(null);
    setSuccess(false);
  };

  return {
    isLoading,
    error,
    success,
    handlePasswordChange,
    handlePasswordReset,
    resetState,
  };
};
