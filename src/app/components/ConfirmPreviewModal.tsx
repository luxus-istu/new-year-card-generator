import { useState, useEffect, useRef } from 'react';
import './ConfirmPreviewModal.css';

interface ConfirmPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (image: string) => Promise<void>;
  formData: {
    senderName: string;
    recipientName: string;
    recipientEmail: string;
    templateId: string;
    message: string;
    captchaToken: string | null;
  };
}

export default function ConfirmPreviewModal({
  isOpen,
  onClose,
  onConfirm,
  formData
}: ConfirmPreviewModalProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [image, setImage] = useState<string>("");
  const contentRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadPreview();
      document.body.style.overflow = 'hidden';
      // Прокручиваем контент в начало при открытии
      if (contentRef.current) {
        contentRef.current.scrollTop = 0;
      }
    } else {
      // Отменяем текущий запрос при закрытии
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
        setImageUrl(null);
      }
      setError(null);
      setIsLoading(false);
      document.body.style.overflow = 'unset';
    }

    return () => {
      // Отменяем запрос при размонтировании
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  const loadPreview = async () => {
    if (!isOpen) return;

    // Отменяем предыдущий запрос, если он существует
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Создаем новый AbortController
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setError(null);

    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
      setImageUrl(null);
    }

    try {
      const response = await fetch("/api/preview-card", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify({
          sender: formData.senderName.trim(),
          recipient: formData.recipientName.trim(),
          email: formData.recipientEmail,
          templateId: formData.templateId,
          message: formData.message.trim(),
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Не удалось загрузить предпросмотр');
      }

      const bufferJson = await response.json();

      if (!bufferJson.data || !Array.isArray(bufferJson.data)) {
        throw new Error('Некорректный формат ответа от сервера');
      }
      setImage(bufferJson)

      const buffer = Buffer.from(bufferJson);
      const blob = new Blob([buffer], { type: 'image/webp' });
      const url = URL.createObjectURL(blob);
      setImageUrl(url);

    } catch (err: any) {
      // Игнорируем ошибки отмены запроса
      if (err.name === 'AbortError') {
        console.log('Запрос предпросмотра отменен');
        return;
      }
      setError(err.message || 'Ошибка при загрузке предпросмотра');
      console.error('Preview error:', err);
    } finally {
      if (abortControllerRef.current) {
        abortControllerRef.current = null;
      }
      setIsLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!formData.captchaToken) {
      setError('Отсутствует токен капчи');
      return;
    }

    setIsSending(true);
    try {
      await onConfirm(image);
      onClose();
    } catch (err) {
      console.error('Send error in modal:', err);
      setError('Ошибка при отправке открытки');
    } finally {
      setIsSending(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node) && !isSending) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="confirm-modal-backdrop" onClick={handleBackdropClick}>
      <div ref={modalRef} className="confirm-modal">
        <button
          className="confirm-modal-close"
          onClick={onClose}
          disabled={isSending}
          aria-label="Закрыть"
        >
          &times;
        </button>

        <div className="confirm-modal-header">
          <h2>Предпросмотр открытки</h2>
          <p>
            От: <strong>{formData.senderName}</strong> → Для: <strong>{formData.recipientName}</strong>
          </p>
          <p>
            Будет отправлено на: <strong>{formData.recipientEmail}</strong>
          </p>
        </div>

        <div className="confirm-modal-content" ref={contentRef}>
          {isLoading && (
            <div className="loading-container">
              <div className="loading-spinner" />
              <p className="loading-text">Загрузка предпросмотра...</p>
            </div>
          )}

          {error && (
            <div className="error-container">
              <p className="error-message">{error}</p>
              <button
                onClick={loadPreview}
                disabled={isLoading}
                className="retry-button"
              >
                Попробовать снова
              </button>
            </div>
          )}

          {imageUrl && !isLoading && !error && (
            <div className="preview-image-container">
              <img
                src={imageUrl}
                alt="Предпросмотр открытки"
                className="preview-image"
                loading="lazy"
              />
            </div>
          )}
        </div>

        <div className="confirm-modal-footer">
          <div className="message-container">
            <p>
              <strong>Сообщение:</strong> {formData.message || <em>Без дополнительного сообщения</em>}
            </p>
          </div>

          <div className="buttons-container">
            <button
              onClick={onClose}
              disabled={isSending}
              className="cancel-button"
            >
              Закрыть
            </button>
            <button
              onClick={handleConfirm}
              disabled={isSending || isLoading || !formData.captchaToken}
              className="confirm-button"
            >
              {isSending ? 'Отправка...' : 'Отправить открытку'}
              {isSending && <span className="shimmer-effect" />}
            </button>
          </div>

          <p className="footer-note">
            Нажав "Отправить открытку", вы подтверждаете отправку данных формы. Изображение будет сгенерировано на сервере.
          </p>
        </div>
      </div>
    </div>
  );
}
