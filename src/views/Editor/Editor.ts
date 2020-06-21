import { Component, Vue, Watch } from 'vue-property-decorator'

import Konva from 'konva'
import { KonvaEventObject } from 'konva/types/Node'
import { RectangleService } from './services/Rectangle'
import { Layer } from 'konva/types/Layer'
import { Stage } from 'konva/types/Stage'
import { EllipseService } from './services/Ellipse'

enum Mode {
  Select = 0,
  DrawRectangle = 1,
  DrawEllipse = 2
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
