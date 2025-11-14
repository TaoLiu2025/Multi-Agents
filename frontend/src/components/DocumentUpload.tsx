import React, { useRef,useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Upload, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  size: string;
  status: 'uploaded' | 'processing' | 'completed' | 'error';
  progress: number;
}

// export function DocumentUpload() {
//   const [document, setDocument] = useState<Document | null>({
//     id: '1', 
//     name: 'Quality_Guidelines_v2.pdf', 
//     size: '2.4 MB', 
//     status: 'completed', 
//     progress: 100
//   });

type Props = {
  onUploadStarted?: () => void;
  onUploaded?: (sessionId: string) => void;
};

export function DocumentUpload({ onUploadStarted,onUploaded }: Props) {
  const [document, setDocument] = useState<Document | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handlePickFile: React.MouseEventHandler<HTMLButtonElement> = () => {
    if (!isUploading) inputRef.current?.click();
  };

  const handleFileUpload: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const extOK = /\.(pdf|docx?|txt)$/i.test(file.name);
    const sizeOK = file.size <= 50 * 1024 * 1024;
    if (!extOK) {
      alert('Unsupported file type. Please upload PDF, DOC, DOCX, or TXT.');
      event.currentTarget.value = '';
      return;
    }
    if (!sizeOK) {
      alert('File too large. Max 50 MB.');
      event.currentTarget.value = '';
      return;
    }

    const newDoc: Document = {
      id: Date.now().toString(),
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      status: 'uploaded',
      progress: 0
    };
    setDocument(newDoc);
    setIsUploading(true);
    onUploadStarted?.();

    try {
      // Begin upload -> show progress UI
      setDocument((d) => d && { ...d, status: 'processing', progress: 0 });

      // Use XHR to track progress (fetch doesn’t expose upload progress)
      const form = new FormData();
      form.append('file', file);

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/upload'); // your FastAPI endpoint
        xhr.responseType = 'json';

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const pct = Math.round((e.loaded / e.total) * 100);
            setDocument((d) => d && { ...d, progress: pct });
          }
        };

        xhr.upload.onload = () => setDocument((d) => d && { ...d, progress: 100 });

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const sid = (xhr.response?.session_id as string) || null;
            setDocument((d) => d && { ...d, status: 'completed', progress: 100 });
            if (sid) {
              localStorage.setItem('sessionId', sid);
              onUploaded?.(sid);
            }   // hand session_id to parent / Extraction tab
            resolve();
          } else {
            let msg = `Upload failed: ${xhr.status}`;
            try { if (xhr.response?.detail) msg = xhr.response.detail; } catch {}
            console.error(msg);
            setDocument((d) => d && { ...d, status: 'error' });
            reject(new Error(msg));
          }
        };

        xhr.onerror = () => reject(new Error('Network error'));
        xhr.send(form);
      });
    } catch (err) {
      console.error(err);
      setDocument((d) => d && { ...d, status: 'error' });
    } finally {
      setIsUploading(false);
      // Clear input so selecting the same file again re-triggers onChange
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  // const handleFileUpload = () => {
  //   // Simulate file upload
  //   const newDoc: Document = {
  //     id: Date.now().toString(),
  //     name: 'New_Document.pdf',
  //     size: '1.5 MB',
  //     status: 'uploaded',
  //     progress: 0
  //   };
  //   setDocument(newDoc);
  // };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'processing': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'default',
      processing: 'secondary',
      uploaded: 'outline',
      error: 'destructive'
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Document Upload</CardTitle>
          <CardDescription>
            Upload guideline documents for processing and structured extraction
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg mb-2">Drop files here or click to upload</p>
            <p className="text-sm text-gray-500 mb-4">Supports PDF, DOCX, TXT files up to 10MB</p>
            
            <Button onClick={handlePickFile} disabled={isUploading}>
              <Upload className="w-4 h-4 mr-2" />
              {isUploading ? 'Uploading…' : 'Choose Files'}
            </Button>
            {/* Hidden file input */}
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        </CardContent>
      </Card>

      {document && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Document</CardTitle>
            <CardDescription>
              Current document status and processing information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 p-4 border rounded-lg">
              {getStatusIcon(document.status)}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{document.name}</p>
                <p className="text-sm text-gray-500">{document.size}</p>
                {(document.status === 'processing' || isUploading) && (
                  <Progress value={document.progress} className="w-full mt-2" />
                )}
              </div>
              {getStatusBadge(document.status)}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}