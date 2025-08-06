// src/hooks/useForm.js
import { useState, useCallback, useRef } from "react";
import {
  hasErrors,
  setFieldError as setFieldErrorUtil,
  clearFieldError as clearFieldErrorUtil,
  clearAllErrors,
} from "../utils/errorHandler";

/**
 * 폼 상태 관리를 위한 커스텀 훅
 * @param {object} initialValues - 초기 폼 값
 * @param {Function} validationFunction - 유효성 검사 함수
 * @param {object} options - 옵션 설정
 * @returns {object} 폼 관리 객체
 */
export const useForm = (
  initialValues = {},
  validationFunction = null,
  options = {},
) => {
  const {
    validateOnChange = false,
    validateOnBlur = true,
    resetOnSubmit = false,
    debounceMs = 300,
  } = options;

  // 상태 관리
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);

  // 디바운싱을 위한 ref
  const debounceTimeouts = useRef({});

  /**
   * 특정 필드 값 변경
   */
  const setValue = useCallback((name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  /**
   * 여러 필드 값 일괄 변경
   */
  const setMultipleValues = useCallback(newValues => {
    setValues(prev => ({
      ...prev,
      ...newValues,
    }));
  }, []);

  /**
   * 특정 필드 에러 설정
   */
  const setFieldError = useCallback((name, message) => {
    setErrors(prev => setFieldErrorUtil(prev, name, message));
  }, []);

  /**
   * 특정 필드 에러 제거
   */
  const clearFieldError = useCallback(name => {
    setErrors(prev => clearFieldErrorUtil(prev, name));
  }, []);

  /**
   * 모든 에러 제거
   */
  const clearErrors = useCallback(() => {
    setErrors(clearAllErrors());
  }, []);

  /**
   * 특정 필드가 터치되었음을 표시
   */
  const setFieldTouched = useCallback((name, isTouched = true) => {
    setTouched(prev => ({
      ...prev,
      [name]: isTouched,
    }));
  }, []);

  /**
   * 디바운싱된 유효성 검사
   */
  const debouncedValidation = useCallback(
    (fieldName, value) => {
      if (!validationFunction || !debounceMs) return;

      // 이전 타임아웃 제거
      if (debounceTimeouts.current[fieldName]) {
        clearTimeout(debounceTimeouts.current[fieldName]);
      }

      // 새 타임아웃 설정
      debounceTimeouts.current[fieldName] = setTimeout(() => {
        const fieldValidation = validationFunction({ [fieldName]: value });

        if (fieldValidation.errors && fieldValidation.errors[fieldName]) {
          setFieldError(fieldName, fieldValidation.errors[fieldName]);
        } else {
          clearFieldError(fieldName);
        }
      }, debounceMs);
    },
    [validationFunction, debounceMs, setFieldError, clearFieldError],
  );

  /**
   * 입력 값 변경 핸들러
   */
  const handleChange = useCallback(
    e => {
      const { name, value, type, checked, files } = e.target;

      let fieldValue = value;

      // 체크박스 처리
      if (type === "checkbox") {
        fieldValue = checked;
      }
      // 파일 처리
      else if (type === "file") {
        fieldValue = files ? files[0] : null;
      }

      // 값 업데이트
      setValue(name, fieldValue);

      // 변경 시 유효성 검사
      if (validateOnChange && validationFunction) {
        if (debounceMs > 0) {
          debouncedValidation(name, fieldValue);
        } else {
          const fieldValidation = validationFunction({ [name]: fieldValue });
          if (fieldValidation.errors && fieldValidation.errors[name]) {
            setFieldError(name, fieldValidation.errors[name]);
          } else {
            clearFieldError(name);
          }
        }
      }
    },
    [
      setValue,
      validateOnChange,
      validationFunction,
      debounceMs,
      debouncedValidation,
      setFieldError,
      clearFieldError,
    ],
  );

  /**
   * 포커스 해제 핸들러
   */
  const handleBlur = useCallback(
    e => {
      const { name, value } = e.target;

      // 터치 상태 업데이트
      setFieldTouched(name, true);

      // 블러 시 유효성 검사
      if (validateOnBlur && validationFunction) {
        const fieldValidation = validationFunction({ [name]: value });
        if (fieldValidation.errors && fieldValidation.errors[name]) {
          setFieldError(name, fieldValidation.errors[name]);
        } else {
          clearFieldError(name);
        }
      }
    },
    [
      validateOnBlur,
      validationFunction,
      setFieldTouched,
      setFieldError,
      clearFieldError,
    ],
  );

  /**
   * 전체 폼 유효성 검사
   */
  const validateForm = useCallback(() => {
    if (!validationFunction) {
      return { isValid: true, errors: {} };
    }

    const validation = validationFunction(values);

    setErrors(validation.errors || {});

    return {
      isValid: validation.isValid,
      errors: validation.errors || {},
    };
  }, [validationFunction, values]);

  /**
   * 폼 제출 핸들러
   */
  const handleSubmit = useCallback(
    onSubmit => {
      return async e => {
        if (e) {
          e.preventDefault();
        }

        setIsSubmitting(true);
        setSubmitCount(prev => prev + 1);

        try {
          // 전체 유효성 검사
          const validation = validateForm();

          if (!validation.isValid) {
            // 모든 필드를 터치된 상태로 설정
            const touchedFields = Object.keys(values).reduce((acc, key) => {
              acc[key] = true;
              return acc;
            }, {});
            setTouched(touchedFields);

            return {
              success: false,
              errors: validation.errors,
            };
          }

          // 제출 함수 실행
          const result = await onSubmit(values);

          // 성공 시 폼 리셋 (옵션에 따라)
          if (result.success && resetOnSubmit) {
            reset();
          }

          return result;
        } catch (error) {
          return {
            success: false,
            error: error.message || "제출 중 오류가 발생했습니다.",
          };
        } finally {
          setIsSubmitting(false);
        }
      };
    },
    [validateForm, values, resetOnSubmit],
  );

  /**
   * 폼 리셋
   */
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors(clearAllErrors());
    setTouched({});
    setIsSubmitting(false);
    setSubmitCount(0);

    // 디바운스 타임아웃 제거
    Object.values(debounceTimeouts.current).forEach(clearTimeout);
    debounceTimeouts.current = {};
  }, [initialValues]);

  /**
   * 특정 필드 리셋
   */
  const resetField = useCallback(
    name => {
      setValue(name, initialValues[name] || "");
      clearFieldError(name);
      setFieldTouched(name, false);

      // 해당 필드의 디바운스 타임아웃 제거
      if (debounceTimeouts.current[name]) {
        clearTimeout(debounceTimeouts.current[name]);
        delete debounceTimeouts.current[name];
      }
    },
    [initialValues, setValue, clearFieldError, setFieldTouched],
  );

  /**
   * 필드의 유효성 상태 확인
   */
  const getFieldState = useCallback(
    name => {
      return {
        value: values[name],
        error: errors[name],
        touched: touched[name],
        hasError: !!errors[name],
        showError: !!errors[name] && (touched[name] || submitCount > 0),
      };
    },
    [values, errors, touched, submitCount],
  );

  /**
   * 폼의 전체 상태
   */
  const formState = {
    isValid: !hasErrors(errors),
    isDirty: JSON.stringify(values) !== JSON.stringify(initialValues),
    isSubmitting,
    submitCount,
    hasErrors: hasErrors(errors),
    touchedFields: Object.keys(touched).filter(key => touched[key]),
    errorCount: Object.keys(errors).length,
  };

  // 정리 함수 (컴포넌트 언마운트 시)
  const cleanup = useCallback(() => {
    Object.values(debounceTimeouts.current).forEach(clearTimeout);
  }, []);

  return {
    // 상태
    values,
    errors,
    touched,
    formState,

    // 핸들러
    handleChange,
    handleBlur,
    handleSubmit,

    // 유틸리티 함수
    setValue,
    setMultipleValues, // setValues 대신 setMultipleValues로 변경
    setFieldError,
    clearFieldError,
    clearErrors,
    setFieldTouched,
    validateForm,
    reset,
    resetField,
    getFieldState,
    cleanup,
  };
};
