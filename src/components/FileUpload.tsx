import { useRef, useState } from 'react';
import clsx from 'clsx';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
}

const FileUpload = ({ onFilesSelected }: FileUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    onFilesSelected(Array.from(files));
  };

  return (
    <div
      className={clsx(
        'border-2 border-dashed rounded-2xl p-8 text-center transition',
        isDragging ? 'border-accent-400 bg-base-800/70' : 'border-base-600 bg-base-800/40'
      )}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        handleFiles(event.dataTransfer.files);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/json"
        multiple
        className="hidden"
        onChange={(event) => handleFiles(event.target.files)}
      />
      <div className="space-y-3">
        <h3 className="text-xl font-semibold">Upload your Spotify JSON exports</h3>
        <p className="text-sm text-slate-300">
          Drag & drop or click to select one or more <span className="font-medium">StreamingHistory</span> or
          <span className="font-medium"> endsong</span> JSON files.
        </p>
        <button
          className="px-4 py-2 rounded-full bg-accent-500 text-base-900 font-semibold shadow-glow hover:bg-accent-400 transition"
          onClick={() => inputRef.current?.click()}
        >
          Select files
        </button>
      </div>
    </div>
  );
};

export default FileUpload;
