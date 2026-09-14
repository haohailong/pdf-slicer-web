import React, { useState, useCallback, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, Loader2, Download, AlertCircle } from 'lucide-react';
import { processPDF } from './utils/pdfProcessor';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = async (selectedFile: File) => {
    if (selectedFile.type !== 'application/pdf') {
      setStatus('error');
      setMessage('Please upload a valid PDF file.');
      return;
    }
    
    setFile(selectedFile);
    setStatus('processing');
    setProgress(0);
    setMessage('Starting...');
    setResultUrl(null);

    try {
      const pdfBytes = await processPDF(selectedFile, (p, msg) => {
        setProgress(p);
        setMessage(msg);
      });
      
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      setStatus('success');
      setMessage('PDF split successfully!');
    } catch (error) {
      console.error(error);
      setStatus('error');
      setMessage('An error occurred while processing the PDF.');
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="z-10 w-full max-w-2xl animate-slide-up">
        <div className="text-center mb-10 flex flex-col items-center">
          <img src="/favicon.png" alt="PDF Slicer Icon" className="w-24 h-24 mb-6 rounded-2xl shadow-2xl shadow-blue-500/20" />
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4 tracking-tight">
            PDF Slicer
          </h1>
          <p className="text-slate-400 text-lg">
            Split dual-page scans into single pages. 100% locally in your browser.
          </p>
        </div>

        <div className="glass rounded-3xl p-8 sm:p-12 text-center transition-all duration-300">
          {status === 'idle' || status === 'error' ? (
            <div 
              className={`border-2 border-dashed rounded-2xl p-12 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[300px]
                ${isDragging ? 'border-blue-400 bg-blue-500/10 scale-[1.02]' : 'border-slate-600 hover:border-slate-400 hover:bg-slate-800/50'}
                ${status === 'error' ? 'border-red-500/50 bg-red-500/5' : ''}
              `}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                className="hidden" 
                ref={fileInputRef} 
                accept="application/pdf"
                onChange={handleFileChange}
              />
              
              {status === 'error' ? (
                <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
              ) : (
                <UploadCloud className={`w-16 h-16 mb-4 transition-colors ${isDragging ? 'text-blue-400' : 'text-slate-400'}`} />
              )}
              
              <h3 className="text-xl font-semibold mb-2">
                {isDragging ? 'Drop it here!' : 'Click or drag PDF here'}
              </h3>
              <p className="text-slate-400 text-sm">
                {status === 'error' ? message : 'Files are processed locally and never sent to a server.'}
              </p>
            </div>
          ) : status === 'processing' ? (
            <div className="flex flex-col items-center justify-center min-h-[300px] animate-fade-in">
              <Loader2 className="w-16 h-16 text-blue-400 animate-spin mb-6" />
              <h3 className="text-2xl font-semibold mb-2">{message}</h3>
              <div className="w-full max-w-md bg-slate-700/50 rounded-full h-3 mt-4 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-400 to-purple-500 h-3 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-slate-400 mt-4 text-sm font-medium">{Math.round(progress)}%</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[300px] animate-fade-in">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse" />
                <CheckCircle2 className="w-20 h-20 text-green-400 relative z-10" />
              </div>
              <h3 className="text-2xl font-semibold mb-2 text-white">All Done!</h3>
              <p className="text-slate-400 mb-8">{file?.name} has been successfully split.</p>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setStatus('idle')}
                  className="px-6 py-3 rounded-xl font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  Process Another
                </button>
                {resultUrl && (
                  <a 
                    href={resultUrl} 
                    download={`${file?.name.replace('.pdf', '')}_split.pdf`}
                    className="px-6 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 transition-colors shadow-lg shadow-blue-500/25 flex items-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Download PDF
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
