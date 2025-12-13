declare module 'react-to-print' {
  interface UseReactToPrintOptions {
    content: () => HTMLElement | null;
    documentTitle?: string;
    onBeforeGetContent?: () => Promise<any> | void;
    onBeforePrint?: () => Promise<any> | void;
    onAfterPrint?: () => void;
    removeAfterPrint?: boolean;
    print?: (target: HTMLIFrameElement) => Promise<any> | void;
  }

  export function useReactToPrint(options: UseReactToPrintOptions): () => void;
}