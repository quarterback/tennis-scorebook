
import React from "react";
import { Button } from "@/components/ui/button";

interface MatchFileInputProps {
  fileInputRef: React.RefObject<HTMLInputElement>;
  loading: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const MatchFileInput: React.FC<MatchFileInputProps> = ({ fileInputRef, loading, onFileChange }) => (
  <div className="my-3">
    <input
      ref={fileInputRef}
      type="file"
      accept=".json,.csv"
      className="mb-2"
      disabled={loading}
      onChange={onFileChange}
    />
    <Button onClick={() => fileInputRef.current?.click()} disabled={loading}>
      Choose File
    </Button>
    <div className="text-xs mt-2 text-gray-500">
      After importing, records and APR will be updated automatically.
    </div>
  </div>
);

export default MatchFileInput;
