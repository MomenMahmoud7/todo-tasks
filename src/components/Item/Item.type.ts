export interface ItemPropsT {
  note: string;
  completed: boolean;
  onComplete: () => void;
  onEdit: (text: string) => void;
  onDelete: () => void;
}
