'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload } from 'lucide-react';
import { useMarketingDialog } from './provider';
import { toast, useToast } from '@/hooks/use-toast';

export function MarketingDialog() {
  const { dialogState, closeDialog } = useMarketingDialog();
  const { toast } = useToast();

  const [message, setMessage] = useState('');
  const [url, setUrl] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setMediaFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    } else {
      setMediaFile(null);
      setFileName('');
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      closeDialog();
      // Reset form state when dialog closes
      setMessage('');
      setUrl('');
      setMediaFile(null);
      setFileName('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('authToken');
    if (!token) {
      toast({
        title: 'Error',
        description: 'Authentication token not found.',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('source', dialogState.source);
    formData.append('message', message);
    formData.append('url', url);
    if (mediaFile) {
      formData.append('media_file', mediaFile);
    }
    formData.append('create_id', '2'); // Always create new record for now

    //console.log("Submitting form data:", formData); // Log form data
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/marketing/update/`, {
        method: 'POST',
        headers: {
          Authorization: `Token ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      toast({
        title: 'Success',
        description: result.message || 'Marketing record created successfully!',
      });

      // Clear form and close dialog
      handleOpenChange(false); // This will also reset state

    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create marketing record.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog open={dialogState.isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-lg w-[calc(100vw-2rem)]">
            <DialogHeader>
                <DialogTitle className="text-xl">Marketing - {dialogState.title}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}> {/* Wrapped in form tag */}
                <div className="grid gap-6 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="message" className="font-medium">
                        Message
                        </Label>
                        <Textarea
                        id="message"
                        placeholder="Enter Message"
                        className="min-h-[100px] resize-none"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="url" className="font-medium">
                        URL
                        </Label>
                        <Input 
                            id="url" 
                            placeholder="Enter url" 
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="media-file" className="font-medium">
                        Media File
                        </Label>
                        <div className="flex items-center gap-2">
                            <Label htmlFor="media-file-input" className={
                                "cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                            }>
                                <Upload className="mr-2 h-4 w-4"/>
                                Choose file
                            </Label>
                            <Input id="media-file-input" type="file" className="hidden" onChange={handleFileChange} />
                            {fileName ? (
                                <span className="text-sm text-muted-foreground truncate max-w-xs" title={fileName}>{fileName}</span>
                            ) : (
                                <span className="text-sm text-muted-foreground">No file chosen</span>
                            )}
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="outline" disabled={loading}>
                        Cancel
                        </Button>
                    </DialogClose>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Saving...' : 'Save changes'}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
  );
}