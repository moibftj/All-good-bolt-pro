import React from 'react';
import { Download, Eye } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Letter } from '../../types';

interface LetterPreviewProps {
  letter: Letter;
  onDownload?: () => void;
  onView?: () => void;
}

export function LetterPreview({ letter, onDownload, onView }: LetterPreviewProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'generated': return 'bg-green-100 text-green-800';
      case 'downloaded': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="p-6 hover:shadow-material-2 transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-2">{letter.title}</h3>
          <p className="text-sm text-gray-600 mb-2">
            Created on {formatDate(letter.created_at)}
          </p>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(letter.status)}`}>
            {letter.status.charAt(0).toUpperCase() + letter.status.slice(1)}
          </span>
        </div>
        <div className="flex space-x-2 ml-4">
          {onView && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onView}
            >
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
          )}
          {onDownload && (
            <Button
              variant="primary"
              size="sm"
              onClick={onDownload}
            >
              <Download className="w-4 h-4 mr-1" />
              Download
            </Button>
          )}
        </div>
      </div>
      
      <div className="text-sm text-gray-600 line-clamp-3">
        {letter.content.substring(0, 150)}...
      </div>
    </Card>
  );
}