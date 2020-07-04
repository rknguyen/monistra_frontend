import Konva from "konva";
import { KonvaEventObject } from 'konva/types/Node';
import { Vector2d } from 'konva/types/types';

export const ELLIPSE_CONFIG_DEFAULT = {
  stroke: 'red',
  strokeWidth: 3,
  draggable: false,
  radiusX: 0,
  radiusY: 0
}

export interface EllipseConstructor {
  useTranformer: Function,
  useIsDrawingMode: Function
}

export class EllipseService {
  private ellip?: Konva.Ellipse
  private useTranformer: Function
  private useIsDrawingMode: Function
  private startingPoint?: Vector2d

  public isDestroyed = false

  constructor({ useTranformer, useIsDrawingMode }: EllipseConstructor) {
    this.useTranformer = useTranformer
    this.useIsDrawingMode = useIsDrawingMode
  }

  private activeTransformer() {
    this.useTranformer((transformer: Konva.Transformer) => {
      transformer.detach()
      transformer.nodes([this.ellip as Konva.Ellipse])
    })
  }

  private initEvent(layer: Konva.Layer) {
    this.ellip?.on('click', (event: KonvaEventObject<MouseEvent>) => {
      this.useIsDrawingMode((isDrawing: boolean) => {
        if (!isDrawing) {
          // this.activeTransformer()
        }
      })
    })
    this.ellip?.on('mousedown', (event: KonvaEventObject<MouseEvent>) => {
      this.useIsDrawingMode((isDrawing: boolean) => {
        if (!isDrawing) {
          // this.activeTransformer()
        }
      })
    })
  }

  private addToLayer(stage: Konva.Stage, layer: Konva.Layer) {
    layer.add(this.ellip as Konva.Ellipse)
    stage.add(layer)
    layer.draw()
  }

  public stopDraggable() {
    this.ellip?.draggable(false)
  }

  public resumeDraggable() {
    this.ellip?.draggable(true)
  }

  public onMouseDown(stage: Konva.Stage, layer: Konva.Layer, event: KonvaEventObject<MouseEvent>) {
    const cursor = stage.getPointerPosition()
    this.startingPoint = cursor as Vector2d
    const ellipOptions = Object.assign(ELLIPSE_CONFIG_DEFAULT, {
      x: cursor?.x,
      y: cursor?.y
    })
    this.ellip = new Konva.Ellipse(ellipOptions)
    this.addToLayer(stage, layer)
    this.initEvent(layer)
  }

  public onMouseMove(stage: Konva.Stage, layer: Konva.Layer, event: KonvaEventObject<MouseEvent>) {
    const cursor = stage?.getPointerPosition() as Vector2d
    const x = this.startingPoint?.x || 0
    const y = this.startingPoint?.y || 0
    const radiusX = (cursor.x - x) / 2
    const radiusY = (cursor.y - y) / 2
    this.ellip
      ?.x(x + radiusX)
      .y(y + radiusY)
      .radiusX(radiusX)
      .radiusY(radiusY)
    layer.draw()
  }

  public onMouseUp(stage: Konva.Stage, layer: Konva.Layer, event: KonvaEventObject<MouseEvent>) {
    if (this.ellip?.radiusX() === 0 && this.ellip?.radiusY() === 0) {
      this.isDestroyed = true
      this.ellip?.destroy()
      layer.draw()
    }
  }
}