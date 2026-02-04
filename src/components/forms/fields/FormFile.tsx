import React, { useCallback, useState, useEffect, useRef } from 'react';
import { Form, ProgressBar, Button } from 'react-bootstrap';
import { useFormField } from '../FormField';
import { FormError } from './FormError';
import { useLocalization } from '../../../localization/LocalizationContext';
import {
  AiOutlineFile,
  AiOutlineUpload,
  AiOutlineFilePdf,
  AiOutlineFileWord,
  AiOutlineFilePpt,
  AiOutlineFileText,
} from "react-icons/ai";
import { FaTimes } from 'react-icons/fa';

export interface FileRef {
  path: string;        // Server path (for form submission)
  name: string;
  size: number;
  previewUrl: string;  // Local blob URL (for display)
}

export interface UploadResult {
  path: string;        // Server path returned from upload
}

export type UploadProgressCallback = (progress: number) => void;

export type UploadFunction = (
  file: File,
  onProgress: UploadProgressCallback
) => Promise<UploadResult>;

interface UploadingFile {
  progress: number;
  previewUrl: string;
  name: string;
  error?: string;
}

export interface FormFileProps {
  name: string;
  label?: React.ReactElement | string;
  multiple?: boolean;
  accept?: string;
  maxSize?: number;
  onUpload: UploadFunction;
}

export const FormFile = (props: FormFileProps) => {
  const { value, onChange, isInvalid, error, label, required, formId, className } = useFormField(props);
  const { multiple = true, accept, maxSize, onUpload } = props;
  const { strings } = useLocalization();
  const inputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState<Record<string, UploadingFile>>({});
  const files = (value as unknown as FileRef[] | null) || [];

  // Keep a ref to the latest files to avoid stale closure issues
  const filesRef = useRef(files);
  filesRef.current = files;

  // Track all blob URLs for cleanup on unmount
  const blobUrlsRef = useRef<Set<string>>(new Set());

  // Cleanup all blob URLs on unmount
  useEffect(() => {
    return () => {
      blobUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  // Process files (shared by input change and drag & drop)
  const processFiles = useCallback(async (selectedFiles: File[]) => {
    for (const file of selectedFiles) {
      const tempId = `${Date.now()}-${file.name}`;

      // Check file size and show error if too large
      if (maxSize && file.size > maxSize) {
        setUploading(prev => ({
          ...prev,
          [tempId]: { progress: 0, previewUrl: '', name: file.name, error: strings.getString('error_file_too_large') }
        }));
        continue;
      }

      const previewUrl = URL.createObjectURL(file);
      blobUrlsRef.current.add(previewUrl);

      setUploading(prev => ({
        ...prev,
        [tempId]: { progress: 0, previewUrl, name: file.name }
      }));

      try {
        const result = await onUpload(file, (progress) => {
          setUploading(prev => ({
            ...prev,
            [tempId]: { ...prev[tempId], progress }
          }));
        });

        // Upload successful - add to files
        const fileRef: FileRef = {
          path: result.path,
          name: file.name,
          size: file.size,
          previewUrl,
        };

        setUploading(prev => {
          const { [tempId]: _, ...rest } = prev;
          return rest;
        });

        onChange([...filesRef.current, fileRef] as unknown as string);
      } catch (err) {
        // Upload failed - revoke URL and show error
        URL.revokeObjectURL(previewUrl);
        blobUrlsRef.current.delete(previewUrl);
        setUploading(prev => ({
          ...prev,
          [tempId]: { ...prev[tempId], previewUrl: '', error: err instanceof Error ? err.message : strings.getString('error_file_upload_failed') }
        }));
      }
    }
  }, [maxSize, onUpload, onChange, strings]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    // Reset input immediately so same file can be selected again
    e.target.value = '';
    processFiles(selectedFiles);
  }, [processFiles]);

  const handleRemove = useCallback((index: number) => {
    const fileToRemove = files[index];
    URL.revokeObjectURL(fileToRemove.previewUrl);
    blobUrlsRef.current.delete(fileToRemove.previewUrl);
    const newFiles = files.filter((_, i) => i !== index);
    onChange(newFiles as unknown as string);
  }, [files, onChange]);

  const handleDismissError = useCallback((id: string) => {
    setUploading(prev => {
      const upload = prev[id];
      if (upload?.previewUrl) {
        URL.revokeObjectURL(upload.previewUrl);
        blobUrlsRef.current.delete(upload.previewUrl);
      }
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const isImage = (name: string) => /\.(jpg|jpeg|png|gif|webp|svg|bmp|heic)$/i.test(name);

  const getFileIcon = (name: string, className: string) => {
    const lower = name.toLowerCase();
    if (lower.endsWith('.pdf')) return <AiOutlineFilePdf className={className} />;
    if (lower.endsWith('.doc') || lower.endsWith('.docx')) return <AiOutlineFileWord className={className} />;
    if (lower.endsWith('.ppt') || lower.endsWith('.pptx')) return <AiOutlineFilePpt className={className} />;
    if (/\.(txt|rtf|csv|md|json|xml|html|css|js|ts)$/i.test(lower)) return <AiOutlineFileText className={className} />;
    return <AiOutlineFile className={className} />;
  };

  return (
    <Form.Group controlId={`${formId}-${props.name}`} className={className}>
      {label && <Form.Label>{label}{required && ' *'}</Form.Label>}
      {isInvalid && <FormError error={error} />}

      {/* Uploaded files */}
      {files.length > 0 && (
        <div className="mb-2">
          {files.map((file, index) => (
            <div key={index} className="d-flex align-items-center gap-2 p-2 border rounded mb-1">
              {isImage(file.name) ? (
                <img src={file.previewUrl} alt={file.name} className="form-file-thumbnail" />
              ) : (
                getFileIcon(file.name, "form-file-icon")
              )}
              <span className="flex-grow-1 text-truncate">{file.name}</span>
              <Button variant="link" size="sm" onClick={() => handleRemove(index)}>
                <FaTimes />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Uploading files with progress */}
      {Object.entries(uploading).map(([id, upload]) => (
        <div key={id} className="d-flex align-items-center gap-2 p-2 border rounded mb-1">
          {upload.previewUrl && isImage(upload.name) ? (
            <img src={upload.previewUrl} alt={upload.name} className="form-file-thumbnail-uploading" />
          ) : (
            getFileIcon(upload.name, "form-file-icon-uploading")
          )}
          <div className="flex-grow-1">
            <div className="text-truncate small">{upload.name}</div>
            {upload.error ? (
              <div className="text-danger small">{upload.error}</div>
            ) : (
              <ProgressBar now={upload.progress} className="form-file-progress" />
            )}
          </div>
          {upload.error && (
            <Button variant="link" size="sm" onClick={() => handleDismissError(id)}>
              <FaTimes />
            </Button>
          )}
        </div>
      ))}

      {/* Drop zone with hidden input */}
      <div
        role="button"
        aria-label={strings.getString('file_upload')}
        className={`form-file-dropzone border rounded p-3 text-center ${isInvalid ? 'border-danger' : 'border-secondary'}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          e.currentTarget.classList.add('bg-light');
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.currentTarget.classList.remove('bg-light');
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.currentTarget.classList.remove('bg-light');
          if (e.dataTransfer.files.length > 0) {
            processFiles(Array.from(e.dataTransfer.files));
          }
        }}
      >
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleFileSelect}
          className="d-none"
        />
        <AiOutlineUpload className="form-file-dropzone-icon mb-2" />
        <div className="text-muted small">{strings.getString('file_upload')}</div>
      </div>
    </Form.Group>
  );
};
