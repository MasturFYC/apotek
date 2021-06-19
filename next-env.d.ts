/// <reference types="next" />
/// <reference types="next/types/global" />
/// <reference types="next-images" />

declare module '*.svg' {
    const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
    export default ReactComponent;
  }