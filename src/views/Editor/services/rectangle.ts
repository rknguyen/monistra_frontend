import Konva from "konva";
import { KonvaEventObject } from 'konva/types/Node';
import { Vector2d } from 'konva/types/types';

export const RECT_CONFIG_DEFAULT = {
  stroke: 'red',
  strokeWidth: 3,
  draggable: false
}

export interface RectangleConstructor {
  useTranformer: Function,
  useIsDrawingMode: Function
}

export class RectangleService {
  private rect?: Konva.Rect
  private useTranformer: Function
  private useIsDrawingMode: Function

  public isDestroyed = false

  constructor({ useTranformer, useIsDrawingMode }: RectangleConstructor) {
    this.useTranformer = useTranformer
    this.useIsDrawingMode = useIsDrawingMode
  }

  private activeTransformer() {
    this.useTranformer((transformer: Konva.Transformer) => {
      transformer.detach()
      transformer.nodes([this.rect as Konva.Rect])
    })
  }

  private initEvent() {
    this.rect?.on('click', (event: KonvaEventObject<MouseEvent>) => {
      this.useIsDrawingMode((isDrawing: boolean) => {
        if (!isDrawing) {
          this.activeTransformer()
        }
      })
    })
    this.rect?.on('mousedown', (event: KonvaEventObject<MouseEvent>) => {
      this.useIsDrawingMode((isDrawing: boolean) => {
        if (!isDrawing) {
          this.activeTransformer()
        }
      })
    })
  }

  private addToLayer(stage: Konva.Stage, layer: Konva.Layer) {
    layer.add(this.rect as Konva.Rect)
    stage.add(layer)
    layer.draw()
  }

  public stopDraggable() {
    this.rect?.draggable(false)
  }

  public resumeDraggable() {
    this.rect?.draggable(true)
  }

  public onMouseDown(stage: Konva.Stage, layer: Konva.Layer, event: KonvaEventObject<MouseEvent>) {
    const cursor = stage.getPointerPosition()
    const rectOptions = Object.assign(RECT_CONFIG_DEFAULT, {
      x: cursor?.x,
      y: cursor?.y
    })

    this.rect = new Konva.Rect(rectOptions)
    this.addToLayer(stage, layer)
    this.initEvent()
  }

  public onMouseMove(stage: Konva.Stage, layer: Konva.Layer, event: KonvaEventObject<MouseEvent>) {
    const cursor = stage?.getPointerPosition() as Vector2d
    this.rect
      ?.width(cursor.x - this.rect.x())
      .height(cursor.y - this.rect.y())
    layer.draw()
  }

  public onMouseUp(stage: Konva.Stage, layer: Konva.Layer, event: KonvaEventObject<MouseEvent>) {
    if (this.rect?.height() === 0 && this.rect?.width() === 0) {
      this.isDestroyed = true
      this.rect?.destroy()
      layer.draw()
    }
  }
}