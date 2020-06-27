import { Component, Vue, Watch } from 'vue-property-decorator'

import Konva from 'konva'
import { KonvaEventObject } from 'konva/types/Node'
import { RectangleService } from './services/Rectangle'
import { Layer } from 'konva/types/Layer'
import { Stage } from 'konva/types/Stage'
import { EllipseService } from './services/Ellipse'
import { Vector2d } from 'konva/types/types'

enum Mode {
  Select = 0,
  DrawRectangle = 1,
  DrawEllipse = 2,
  DrawPolygon = 3
}

type Service = RectangleService | EllipseService

@Component
export default class Editor extends Vue {
  private stage?: Konva.Stage
  private layer?: Konva.Layer

  private isDrawing = false
  private transformer = new Konva.Transformer()
  private Services: Service[] = []

  public editorMode = Mode.Select

  private isDrawingPolygon = false
  private lines: Konva.Line[] = []
  private points: Konva.Rect[] = []
  private groups: Konva.Group[] = []
  private isFinishPolygon = false

  get topService() {
    return this.Services[this.Services.length - 1]
  }

  private initKonva() {
    this.stage = new Konva.Stage({
      container: 'konva-stage',
      width: 700,
      height: 600
    })
    this.layer = new Konva.Layer()
    this.layer.add(this.transformer)
  }

  public useTransformer(func: Function) {
    func(this.transformer)
    this.layer?.draw()
  }

  public useIsDrawingMode(func: Function) {
    func(this.isDrawingMode(this.editorMode))
  }

  private isDrawingMode(mode: number): boolean {
    return Mode.DrawRectangle <= mode && mode <= Mode.DrawEllipse
  }

  private isSelectionMode(mode: number): boolean {
    return mode === Mode.Select
  }

  private detachTransformer() {
    this.transformer.detach()
    this.layer?.draw()
  }

  private initEvent() {
    this.stage?.on('mousedown', (event: KonvaEventObject<MouseEvent>) => {
      if (this.isDrawingMode(this.editorMode)) {
        this.isDrawing = true
        switch (this.editorMode) {
          case Mode.DrawRectangle:
            this.Services.push(new RectangleService({ useTranformer: this.useTransformer, useIsDrawingMode: this.useIsDrawingMode }))
            break
          case Mode.DrawEllipse:
            this.Services.push(new EllipseService({ useTranformer: this.useTransformer, useIsDrawingMode: this.useIsDrawingMode }))
            break
          default:
            break
        }
        this.topService.onMouseDown(this.stage as Stage, this.layer as Layer, event)
      } else
        if (this.isSelectionMode(this.editorMode)) {
          if (event.target === this.stage) {
            this.detachTransformer()
          }
        }
    })
    this.stage?.on('mousemove', (event: KonvaEventObject<MouseEvent>) => {
      if (this.isDrawingMode(this.editorMode) && this.isDrawing) {
        this.topService.onMouseMove(this.stage as Stage, this.layer as Layer, event)
      }
      if (this.editorMode === Mode.DrawPolygon && this.isDrawingPolygon) {
        const cursor = (this.stage as Stage).getPointerPosition() as Vector2d
        const line = this.lines[this.lines.length - 1] as Konva.Line
        if (line.zIndex() > 0) {
          this.points[0].zIndex(line.zIndex())
        }
        line.zIndex(0)
        const points = line.points()
        points[2] = cursor.x
        points[3] = cursor.y
        line.points(points)
        this.layer?.draw()
      }
    })
    this.stage?.on('mouseup', (event: KonvaEventObject<MouseEvent>) => {
      if (this.isDrawingMode(this.editorMode) && this.isDrawing) {
        this.isDrawing = false
        this.topService.onMouseUp(this.stage as Stage, this.layer as Layer, event)
        if (this.topService.isDestroyed) {
          this.Services.pop()
        }
      }
    })
    this.stage?.on('click', (event: KonvaEventObject<MouseEvent>) => {
      if (this.editorMode === Mode.DrawPolygon) {
        const cursor = (this.stage as Stage).getPointerPosition() as Vector2d

        let isStartingPoint = false
        if (this.isDrawingPolygon) {
          const line = this.lines[this.lines.length - 1] as Konva.Line
          const points = line.points()
          points[2] = cursor.x
          points[3] = cursor.y
          line.points(points)
          this.layer?.draw()
        } else {
          if (!this.isFinishPolygon) {
            this.isDrawingPolygon = true
            isStartingPoint = true
            this.groups.push(new Konva.Group())
          }
        }

        if (this.isFinishPolygon) {
          this.isFinishPolygon = false;
        } else {
          const group = this.groups[this.groups.length - 1]
          const popts = { x: cursor.x - 3, y: cursor.y - 3, width: 6, height: 6, stroke: 'red', fill: 'red' }
          this.points.push(new Konva.Rect(popts))
          const point = this.points[this.points.length - 1]
          group.add(point)
          if (isStartingPoint) {
            point.hitStrokeWidth(12)
            point.on('mouseover', (event: KonvaEventObject<MouseEvent>) => {
              if (this.points.length >= 3) {
                point.scale({ x: 2, y: 2 })
              }
            })
            point.on('mouseout', (event: KonvaEventObject<MouseEvent>) => {
              point.scale({ x: 1, y: 1 })
            })
            point.on('click', (event: KonvaEventObject<MouseEvent>) => {
              if (this.points.length >= 3) {
                this.isDrawingPolygon = false
                this.points[0].scale({ x: 1, y: 1 })
                this.points = []
                event.evt.preventDefault()
                this.isFinishPolygon = true
              }
            })
          }
          const line = new Konva.Line({ points: [cursor.x, cursor.y, cursor.x, cursor.y], stroke: 'black', strokeWidth: 5 })
          group.add(line)
          this.lines.push(line)
          this.layer?.add(group)
          this.stage?.add(this.layer)
          this.layer?.draw()
        }
      }
    })
  }

  @Watch('editorMode')
  onEditorModeChanged(value: number, oldValue: number) {
    if (this.isSelectionMode(value) && this.isDrawingMode(oldValue)) {
      this.Services.forEach((service) => {
        service.resumeDraggable()
      })
    } else
      if (this.isDrawingMode(value) && this.isSelectionMode(oldValue)) {
        this.detachTransformer()
        this.Services.forEach((service) => {
          service.stopDraggable()
        })
      }
  }

  public created() {
    this.$nextTick(() => {
      this.initKonva()
      this.initEvent()
    })
  }
}
