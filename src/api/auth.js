// src/api/auth.js
import { supabase } from "./supabaseClient";

// 회원가입
export const signup = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

// 로그인
export const login = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

// 로그아웃
export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};
