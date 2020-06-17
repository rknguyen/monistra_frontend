const DEFAULT_CANVAS_RATIO = 0.8

const NORMAL_NODE = 'normal'
const ELLIPSE_MODE = 'ellipse'
const RECTANGLE_MODE = 'rectangle'

import { Component, Vue } from 'vue-property-decorator'

import { fabric } from 'fabric'
import { Rectangle } from './services/rectangle'
import { Ellipse } from './services/circle'

@Component
export default class Editor extends Vue {
  private canvas: any = null
  private objectList: any[] = []

  private isMouseDown = false

  public NORMAL = NORMAL_NODE
  public ELLIPSE = ELLIPSE_MODE
  public RECTANGLE = RECTANGLE_MODE

  private currentMode = NORMAL_NODE

  public canvasSize = {
    width: 0,
    height: 0
  }

  public mouse = {
    x: 0,
    y: 0,
    startX: 0,
    startY: 0
  }

  public element: HTMLElement | null = null

  private stabiliseCanvasSize() {
    this.$nextTick(() => {
      const { innerWidth, innerHeight } = window
      this.canvasSize.width = innerWidth * DEFAULT_CANVAS_RATIO
      this.canvasSize.height = innerHeight * DEFAULT_CANVAS_RATIO
    })
  }

  private initializeCanvas() {
    this.canvas = new fabric.Canvas('editor')
    this.initializeCanvasEvent()
  }

  private initializeCanvasEvent() {
    if (this.canvas !== null) {
      this.canvas.on('mouse:down', this.onMouseDownCanvas)
      this.canvas.on('mouse:move', this.onMouseMoveCanvas)
      this.canvas.on('mouse:up', this.onMouseUpCanvas)
    }
  }

  private onMouseDownCanvas(event: any) {
    if (this.currentMode !== NORMAL_NODE) {
      console.log('created')
      const { x: left, y: top } = this.canvas.getPointer(event.e)
      this.isMouseDown = true

      let newObject = null
      switch (this.currentMode) {
        case RECTANGLE_MODE:
          newObject = new Rectangle({ top, left })
          break
        case ELLIPSE_MODE:
          newObject = new Ellipse({ top, left })
          break
        default:
          break
      }

      if (newObject !== null) {
        this.objectList.push(newObject)
        this.canvas.add(newObject.getInstance())
      }
    }
  }

  private onMouseMoveCanvas(event: any) {
    if (this.isMouseDown) {
      const { x: left, y: top } = this.canvas.getPointer(event.e)
      const object = this.objectList[this.objectList.length - 1]
      object.update({ top, left })
      this.canvas.renderAll()
    }
  }

  private onMouseUpCanvas(obj: any) {
    if (this.isMouseDown) {
      this.isMouseDown = false
      this.canvas.renderAll()
    }
  }

  public changeMode(mode: string) {
    this.currentMode = mode
  }

  public isModeActive(mode: string) {
    return this.currentMode === mode
  }

  public created() {
    window.addEventListener('resize', this.stabiliseCanvasSize)
  }

  public mounted() {
    this.stabiliseCanvasSize()
    this.initializeCanvas()
  }
}
