// src/hooks/useImageUpload.js
import { useState, useCallback, useRef } from "react";
import { validateProfileImage } from "../utils/validation";

/**
 * 이미지 업로드 관리를 위한 커스텀 훅
 * @param {object} options - 설정 옵션
 * @returns {object} 이미지 업로드 관리 객체
 */
export const useImageUpload = (options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB
    allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ],
    autoValidate = true,
  } = options;

  // 상태 관리
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  // FileReader 참조
  const fileReaderRef = useRef(null);

  /**
   * 파일 유효성 검사
   */
  const validateFile = useCallback(
    selectedFile => {
      if (!selectedFile) {
        return { isValid: true, error: null };
      }

      if (autoValidate) {
        const validation = validateProfileImage(selectedFile);
        return {
          isValid: validation.isValid,
          error: validation.isValid ? null : validation.message,
        };
      }

      return { isValid: true, error: null };
    },
    [autoValidate],
  );

  /**
   * 미리보기 생성
   */
  const createPreview = useCallback(selectedFile => {
    if (!selectedFile || !selectedFile.type.startsWith("image/")) {
      setPreview(null);
      return;
    }

    // 이전 FileReader 정리
    if (fileReaderRef.current) {
      fileReaderRef.current.abort();
    }

    const reader = new FileReader();
    fileReaderRef.current = reader;

    reader.onload = e => {
      setPreview(e.target.result);
    };

    reader.onerror = () => {
      setError("이미지 미리보기 생성에 실패했습니다.");
      setPreview(null);
    };

    reader.readAsDataURL(selectedFile);
  }, []);

  /**
   * 이미지 선택 핸들러
   */
  const handleImageSelect = useCallback(
    selectedFile => {
      setError(null);
      setUploadProgress(0);

      if (!selectedFile) {
        setFile(null);
        setPreview(null);
        return;
      }

      // 파일 유효성 검사
      const validation = validateFile(selectedFile);

      if (!validation.isValid) {
        setError(validation.error);
        setFile(null);
        setPreview(null);
        return;
      }

      // 파일 설정 및 미리보기 생성
      setFile(selectedFile);
      createPreview(selectedFile);
    },
    [validateFile, createPreview],
  );

  /**
   * 파일 입력 변경 핸들러
   */
  const handleFileInputChange = useCallback(
    e => {
      const selectedFile = e.target.files?.[0];
      handleImageSelect(selectedFile);
    },
    [handleImageSelect],
  );

  /**
   * 드래그 앤 드롭 핸들러
   */
  const handleDragOver = useCallback(e => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }, []);

  const handleDrop = useCallback(
    e => {
      e.preventDefault();
      const selectedFile = e.dataTransfer.files?.[0];

      if (selectedFile && selectedFile.type.startsWith("image/")) {
        handleImageSelect(selectedFile);
      } else {
        setError("이미지 파일만 업로드 가능합니다.");
      }
    },
    [handleImageSelect],
  );

  /**
   * 이미지 제거
   */
  const removeImage = useCallback(() => {
    // FileReader 정리
    if (fileReaderRef.current) {
      fileReaderRef.current.abort();
      fileReaderRef.current = null;
    }

    setFile(null);
    setPreview(null);
    setError(null);
    setUploadProgress(0);
    setUploading(false);
  }, []);

  /**
   * 파일 업로드 (실제 서버 업로드)
   */
  const uploadImage = useCallback(
    async (uploadFunction, options = {}) => {
      if (!file) {
        setError("업로드할 파일이 없습니다.");
        return { success: false, error: "업로드할 파일이 없습니다." };
      }

      setUploading(true);
      setUploadProgress(0);
      setError(null);

      try {
        // 업로드 진행률 시뮬레이션 (실제 업로드 함수에서 진행률을 제공하지 않는 경우)
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return prev;
            }
            return prev + 10;
          });
        }, 200);

        const result = await uploadFunction(file, options);

        clearInterval(progressInterval);
        setUploadProgress(100);

        if (result.success) {
          return {
            success: true,
            url: result.url,
            path: result.path,
            file: file,
          };
        } else {
          setError(result.error || "업로드에 실패했습니다.");
          return {
            success: false,
            error: result.error || "업로드에 실패했습니다.",
          };
        }
      } catch (error) {
        setError(error.message || "업로드 중 오류가 발생했습니다.");
        return {
          success: false,
          error: error.message || "업로드 중 오류가 발생했습니다.",
        };
      } finally {
        setUploading(false);
      }
    },
    [file],
  );

  /**
   * 이미지 크기 조정 (리사이징)
   */
  const resizeImage = useCallback(
    (maxWidth = 800, maxHeight = 600, quality = 0.8) => {
      return new Promise((resolve, reject) => {
        if (!file) {
          reject(new Error("리사이징할 파일이 없습니다."));
          return;
        }

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        img.onload = () => {
          // 원본 비율 유지하며 최대 크기 계산
          let { width, height } = img;

          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }

          // 캔버스 크기 설정
          canvas.width = width;
          canvas.height = height;

          // 이미지 그리기
          ctx.drawImage(img, 0, 0, width, height);

          // Blob으로 변환
          canvas.toBlob(
            blob => {
              if (blob) {
                // 파일 객체 생성
                const resizedFile = new File([blob], file.name, {
                  type: file.type,
                  lastModified: Date.now(),
                });
                resolve(resizedFile);
              } else {
                reject(new Error("이미지 리사이징에 실패했습니다."));
              }
            },
            file.type,
            quality,
          );
        };

        img.onerror = () => {
          reject(new Error("이미지 로드에 실패했습니다."));
        };

        img.src = preview;
      });
    },
    [file, preview],
  );

  /**
   * 이미지 회전
   */
  const rotateImage = useCallback(
    (degrees = 90) => {
      return new Promise((resolve, reject) => {
        if (!preview) {
          reject(new Error("회전할 이미지가 없습니다."));
          return;
        }

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        img.onload = () => {
          const { width, height } = img;

          // 90도 또는 270도 회전 시 너비와 높이 교체
          if (degrees === 90 || degrees === 270) {
            canvas.width = height;
            canvas.height = width;
            ctx.translate(height / 2, width / 2);
          } else {
            canvas.width = width;
            canvas.height = height;
            ctx.translate(width / 2, height / 2);
          }

          // 회전 적용
          ctx.rotate((degrees * Math.PI) / 180);
          ctx.drawImage(img, -width / 2, -height / 2);

          // 새로운 미리보기 생성
          canvas.toBlob(blob => {
            if (blob) {
              const rotatedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });

              // 상태 업데이트
              setFile(rotatedFile);
              setPreview(canvas.toDataURL());
              resolve(rotatedFile);
            } else {
              reject(new Error("이미지 회전에 실패했습니다."));
            }
          }, file.type);
        };

        img.onerror = () => {
          reject(new Error("이미지 로드에 실패했습니다."));
        };

        img.src = preview;
      });
    },
    [file, preview],
  );

  /**
   * 이미지 정보 가져오기
   */
  const getImageInfo = useCallback(() => {
    if (!file) return null;

    return {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      sizeInMB: (file.size / 1024 / 1024).toFixed(2),
    };
  }, [file]);

  /**
   * 파일 크기 포맷팅
   */
  const formatFileSize = useCallback(bytes => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }, []);

  /**
   * 정리 함수 (컴포넌트 언마운트 시)
   */
  const cleanup = useCallback(() => {
    if (fileReaderRef.current) {
      fileReaderRef.current.abort();
      fileReaderRef.current = null;
    }

    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }
  }, [preview]);

  // 상태 및 유틸리티 정보
  const imageState = {
    hasFile: !!file,
    hasPreview: !!preview,
    isUploading: uploading,
    hasError: !!error,
    progress: uploadProgress,
    info: getImageInfo(),
  };

  return {
    // 상태
    file,
    preview,
    uploading,
    uploadProgress,
    error,
    imageState,

    // 핸들러
    handleImageSelect,
    handleFileInputChange,
    handleDragOver,
    handleDrop,
    removeImage,
    uploadImage,

    // 유틸리티 함수
    resizeImage,
    rotateImage,
    getImageInfo,
    formatFileSize,
    validateFile,
    cleanup,

    // 설정
    maxSize,
    allowedTypes,
  };
};
