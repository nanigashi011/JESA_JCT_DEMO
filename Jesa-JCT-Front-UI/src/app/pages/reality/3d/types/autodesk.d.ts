/**
 * Autodesk Viewer Type Declarations
 */

// THREE.js types used by Autodesk Viewer
declare namespace THREE {
  class Vector4 {
    constructor(x?: number, y?: number, z?: number, w?: number);
    x: number;
    y: number;
    z: number;
    w: number;
  }
}

// Extend Window to include THREE
interface Window {
  THREE: typeof THREE;
}

declare namespace Autodesk {
  namespace Viewing {
    interface InitializerOptions {
      env: string;
      getAccessToken: (onTokenReady: (token: string, expires: number) => void) => void;
      api?: string;
    }

    function Initializer(options: InitializerOptions, callback: () => void): void;

    class GuiViewer3D {
      constructor(container: HTMLElement, config?: object);
      start(): number;
      finish(): void;
      loadDocumentNode(
        doc: Document,
        node: BubbleNode,
        options?: object
      ): Promise<Model>;
      addEventListener(event: string, callback: (event: any) => void): void;
      removeEventListener(event: string, callback: (event: any) => void): void;
      getProperties(
        dbId: number,
        onSuccess: (result: PropertyResult) => void,
        onError?: (error: any) => void
      ): void;
      search(
        text: string,
        onSuccess: (dbIds: number[]) => void,
        onError?: (error: any) => void,
        attributeNames?: string[]
      ): void;
      isolate(dbIds?: number | number[]): void;
      showAll(): void;
      fitToView(dbIds?: number[]): void;
      getAllModels(): Model[];
      unloadModel(model: Model): void;
      loadExtension(extensionId: string, options?: object): Promise<Extension>;
      unloadExtension(extensionId: string): boolean;
      // Color theming methods
      setThemingColor(dbId: number, color: THREE.Vector4, model?: Model, recursive?: boolean): void;
      clearThemingColors(model?: Model): void;
      // Visibility methods
      hide(dbIds: number | number[], model?: Model): void;
      show(dbIds: number | number[], model?: Model): void;
      model: Model;
      navigation?: {
        setZoomFactor(factor: number): void;
      };
    }

    class Document {
      static load(
        urn: string,
        onSuccess: (doc: Document) => void,
        onError: (errorCode: number, errorMsg: string, messages?: any) => void
      ): void;
      getRoot(): BubbleNode;
    }

    interface BubbleNode {
      getDefaultGeometry(): BubbleNode;
      name(): string;
    }

    interface Model {
      getInstanceTree(): InstanceTree;
    }

    interface InstanceTree {
      getRootId(): number;
      getNodeName(nodeId: number): string;
      getChildCount(nodeId: number): number;
      enumNodeChildren(
        nodeId: number,
        callback: (childId: number) => void,
        recursive?: boolean
      ): void;
    }

    interface PropertyResult {
      dbId: number;
      name: string;
      externalId: string;
      properties: Property[];
    }

    interface Property {
      displayName: string;
      displayValue: string | number;
      displayCategory: string;
      type: number;
      units: string;
    }

    interface Extension {}

    const SELECTION_CHANGED_EVENT: string;
    const PROGRESS_UPDATE_EVENT: string;
    const GEOMETRY_LOADED_EVENT: string;
  }
}
