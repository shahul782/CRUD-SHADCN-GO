export function useToast() {
    return {
      toast: ({ title, description, variant }) => {
        alert(`${title}: ${description}`); // Simplified fallback logic
      },
    };
  }
  