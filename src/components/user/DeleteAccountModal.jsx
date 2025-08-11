// src/components/user/DeleteAccountModal.jsx
import React, { useState } from "react";
import { deleteAccount } from "../../api/auth";
import styles from "./DeleteAccountMadal.module.css";

const DeleteAccountModal = ({ isOpen, onClose, user, onDeleteSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (confirmText !== "회원탈퇴") {
      setError('정확히 "회원탈퇴"라고 입력해주세요.');
      return;
    }

    setLoading(true);
    setError("");

    try {
      await deleteAccount(user.id);
      onDeleteSuccess();
    } catch (err) {
      setError("회원탈퇴 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setConfirmText("");
      setError("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>회원탈퇴</h2>
          <button
            className={styles.closeBtn}
            onClick={handleClose}
            disabled={loading}
          >
            ×
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.warningSection}>
            <div className={styles.warningIcon}>⚠️</div>
            <h3>정말로 탈퇴하시겠습니까?</h3>
            <p className={styles.warningText}>
              탈퇴 시 다음 데이터들이 영구적으로 삭제됩니다:
            </p>
            <ul className={styles.warningList}>
              <li>프로필 정보</li>
              <li>작성한 모든 꿈 기록</li>
              <li>감정 일기 데이터</li>
              <li>기타 개인 설정</li>
            </ul>
            <p className={styles.warningNote}>
              <strong>이 작업은 되돌릴 수 없습니다.</strong>
            </p>
          </div>

          <div className={styles.confirmSection}>
            <label htmlFor="confirmInput">
              탈퇴를 진행하려면 <strong>회원탈퇴</strong>라고 입력해주세요:
            </label>
            <input
              id="confirmInput"
              type="text"
              value={confirmText}
              onChange={e => setConfirmText(e.target.value)}
              placeholder="회원탈퇴"
              disabled={loading}
              className={styles.confirmInput}
            />
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}
        </div>

        <div className={styles.modalFooter}>
          <button
            className={styles.cancelBtn}
            onClick={handleClose}
            disabled={loading}
          >
            취소
          </button>
          <button
            className={styles.deleteBtn}
            onClick={handleDelete}
            disabled={loading || confirmText !== "회원탈퇴"}
          >
            {loading ? (
              <>
                <span className={styles.spinner}></span>
                탈퇴 중...
              </>
            ) : (
              "탈퇴하기"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
