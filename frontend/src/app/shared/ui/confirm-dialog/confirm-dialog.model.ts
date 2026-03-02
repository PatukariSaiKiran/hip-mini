// Purpose: Strong typing for dialog inputs (what UI should show).
export interface ConfirmDialogOptions {
    title?: string;              // e.g. "Discard changes?"
    message: string;             // main text
    confirmText?: string;        // e.g. "Yes, discard"
    cancelText?: string;         // e.g. "No"
    danger?: boolean;            // true => confirm button looks red
    closeOnBackdropClick?: boolean; // UX choice
  }
  
  export interface ConfirmDialogRequest {
    options: ConfirmDialogOptions;
  
    // Purpose: host will resolve this observable when user clicks Confirm/Cancel
    resolve: (result: boolean) => void;
  }
  