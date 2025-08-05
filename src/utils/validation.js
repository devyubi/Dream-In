// src/utils/validation.js

/**
 * 유효성 검사 규칙 상수
 */
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 6,
  NICKNAME_MIN_LENGTH: 2,
  NICKNAME_MAX_LENGTH: 20,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ],
};

/**
 * 이메일 유효성 검사
 * @param {string} email
 * @returns {object} { isValid: boolean, message: string }
 */
export const validateEmail = email => {
  if (!email) {
    return { isValid: false, message: "이메일을 입력해주세요." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: "올바른 이메일 형식이 아닙니다." };
  }

  return { isValid: true, message: "" };
};

/**
 * 비밀번호 유효성 검사
 * @param {string} password
 * @returns {object} { isValid: boolean, errors: string[] }
 */
export const validatePassword = password => {
  const errors = [];

  if (!password) {
    errors.push("비밀번호를 입력해주세요.");
  } else if (password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
    errors.push(
      `비밀번호는 ${VALIDATION_RULES.PASSWORD_MIN_LENGTH}자 이상이어야 합니다.`,
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * 닉네임 유효성 검사
 * @param {string} nickname
 * @returns {object} { isValid: boolean, message: string }
 */
export const validateNickname = nickname => {
  if (!nickname) {
    return { isValid: false, message: "닉네임을 입력해주세요." };
  }

  if (
    nickname.length < VALIDATION_RULES.NICKNAME_MIN_LENGTH ||
    nickname.length > VALIDATION_RULES.NICKNAME_MAX_LENGTH
  ) {
    return {
      isValid: false,
      message: `닉네임은 ${VALIDATION_RULES.NICKNAME_MIN_LENGTH}-${VALIDATION_RULES.NICKNAME_MAX_LENGTH}자 사이여야 합니다.`,
    };
  }

  const nicknameRegex = /^[a-zA-Z0-9가-힣_-]+$/;
  if (!nicknameRegex.test(nickname)) {
    return {
      isValid: false,
      message: "닉네임은 한글, 영문, 숫자, -, _ 만 사용 가능합니다.",
    };
  }

  return { isValid: true, message: "" };
};

/**
 * 생년월일 유효성 검사
 * @param {string} birthdate
 * @returns {object} { isValid: boolean, message: string }
 */
export const validateBirthdate = birthdate => {
  if (!birthdate) {
    return { isValid: true, message: "" }; // 선택사항이므로
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(birthdate)) {
    return {
      isValid: false,
      message: "올바른 날짜 형식이 아닙니다. (YYYY-MM-DD)",
    };
  }

  const date = new Date(birthdate);
  const today = new Date();

  if (date > today) {
    return { isValid: false, message: "미래 날짜는 입력할 수 없습니다." };
  }

  // 100세 이상 체크
  const hundredYearsAgo = new Date();
  hundredYearsAgo.setFullYear(today.getFullYear() - 100);

  if (date < hundredYearsAgo) {
    return { isValid: false, message: "올바른 생년월일을 입력해주세요." };
  }

  return { isValid: true, message: "" };
};

/**
 * 프로필 이미지 파일 유효성 검사
 * @param {File} file
 * @returns {object} { isValid: boolean, message: string }
 */
export const validateProfileImage = file => {
  if (!file) {
    return { isValid: true, message: "" }; // 선택사항이므로
  }

  // 파일 타입 검사
  if (!VALIDATION_RULES.ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      isValid: false,
      message: "지원되지 않는 파일 형식입니다. (JPG, PNG, WebP, GIF만 가능)",
    };
  }

  // 파일 크기 검사
  if (file.size > VALIDATION_RULES.MAX_FILE_SIZE) {
    return {
      isValid: false,
      message: `파일 크기는 ${VALIDATION_RULES.MAX_FILE_SIZE / 1024 / 1024}MB 이하여야 합니다.`,
    };
  }

  return { isValid: true, message: "" };
};

/**
 * 비밀번호 확인 검사
 * @param {string} password
 * @param {string} confirmPassword
 * @returns {object} { isValid: boolean, message: string }
 */
export const validatePasswordConfirm = (password, confirmPassword) => {
  if (!confirmPassword) {
    return { isValid: false, message: "비밀번호 확인을 입력해주세요." };
  }

  if (password !== confirmPassword) {
    return { isValid: false, message: "비밀번호가 일치하지 않습니다." };
  }

  return { isValid: true, message: "" };
};

/**
 * 전체 회원가입 폼 유효성 검사
 * @param {object} formData
 * @returns {object} { isValid: boolean, errors: object }
 */
export const validateSignupForm = formData => {
  const errors = {};

  // 이메일 검사
  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.message;
  }

  // 비밀번호 검사
  const passwordValidation = validatePassword(formData.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.errors[0];
  }

  // 비밀번호 확인 검사
  const confirmPasswordValidation = validatePasswordConfirm(
    formData.password,
    formData.confirmPassword,
  );
  if (!confirmPasswordValidation.isValid) {
    errors.confirmPassword = confirmPasswordValidation.message;
  }

  // 닉네임 검사
  const nicknameValidation = validateNickname(formData.nickname);
  if (!nicknameValidation.isValid) {
    errors.nickname = nicknameValidation.message;
  }

  // 생년월일 검사
  const birthdateValidation = validateBirthdate(formData.birthdate);
  if (!birthdateValidation.isValid) {
    errors.birthdate = birthdateValidation.message;
  }

  // 프로필 이미지 검사
  const imageValidation = validateProfileImage(formData.profileImage);
  if (!imageValidation.isValid) {
    errors.profileImage = imageValidation.message;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * 로그인 폼 유효성 검사
 * @param {object} formData
 * @returns {object} { isValid: boolean, errors: object }
 */
export const validateLoginForm = formData => {
  const errors = {};

  // 이메일 검사
  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.message;
  }

  // 비밀번호 검사 (로그인 시에는 단순히 입력 여부만 확인)
  if (!formData.password) {
    errors.password = "비밀번호를 입력해주세요.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
