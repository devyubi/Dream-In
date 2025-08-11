// src/hooks/usePasswordChange.js
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../api/supabaseClient";

export const usePasswordChange = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();

  const isSocialUser = u =>
    Array.isArray(u?.identities) &&
    u.identities.some(i => i.provider && i.provider !== "email");

  const handlePasswordChange = async (currentPassword, newPassword) => {
    ("=== usePasswordChange 시작 ===");
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!user?.email) {
        const msg = "로그인이 필요합니다.";
        setError(msg);
        return { success: false, error: msg };
      }

      if (isSocialUser(user)) {
        const msg = "소셜 로그인 계정은 비밀번호를 변경할 수 없습니다.";
        setError(msg);
        return { success: false, error: msg };
      }

      const { error: reauthError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });
      if (reauthError) {
        const msg = reauthError.message || "현재 비밀번호가 올바르지 않습니다.";
        setError(msg);
        return { success: false, error: msg };
      }

      const { data: updateData, error: updateError } =
        await supabase.auth.updateUser({ password: newPassword });

      if (updateError) {
        const msg =
          updateError.message ||
          "비밀번호 변경에 실패했습니다. 잠시 후 다시 시도해주세요.";
        setError(msg);
        return { success: false, error: msg };
      }

      try {
        await supabase.auth.refreshSession();
      } catch (e) {}

      setSuccess(true);
      return {
        success: true,
        message: "비밀번호가 성공적으로 변경되었습니다.",
      };
    } catch (err) {
      const msg = "비밀번호 변경 중 오류가 발생했습니다.";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setError(null);
    setSuccess(false);
  };

  return { isLoading, error, success, handlePasswordChange, resetState };
};
