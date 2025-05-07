import React from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { EditIcon, SaveIcon, XIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface INutritionNotesProps {
  notes: string;
  isLoading?: boolean;
  onChange: (newNotes: string) => Promise<boolean>;
}

export const NutritionNotes: React.FC<INutritionNotesProps> = ({
  notes,
  isLoading = false,
  onChange,
}) => {
  const [editedNotes, setEditedNotes] = React.useState<string>(notes);
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const [isSaving, setIsSaving] = React.useState<boolean>(false);

  React.useEffect(() => {
    setEditedNotes(notes);
  }, [notes]);

  const handleEdit = () => {
    setEditedNotes(notes);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedNotes(notes);
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onChange(editedNotes);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save notes:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="w-20" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Notes</span>
          {!isEditing && (
            <Button variant="outline" size="sm" onClick={handleEdit}>
              <EditIcon className="mr-2" />
              {notes ? 'Edit' : 'Add Notes'}
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Textarea
            value={editedNotes}
            onChange={(e) => setEditedNotes(e.target.value)}
            placeholder="Add your notes here..."
            className="resize-none"
          />
        ) : (
          <div>
            {notes ? (
              <p className="whitespace-pre-wrap">{notes}</p>
            ) : (
              <p className="text-muted-foreground italic">
                No notes added yet.
              </p>
            )}
          </div>
        )}
      </CardContent>
      {isEditing && (
        <CardFooter className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            disabled={isSaving}
          >
            <XIcon className="mr-1" />
            Cancel
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
          >
            <SaveIcon className="mr-1" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
