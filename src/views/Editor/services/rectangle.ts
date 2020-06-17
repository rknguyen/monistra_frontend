import { fabric } from 'fabric'

export interface RectOptions {
  top: number
  left: number
}

const _defaultOptions = {
  stroke: 'red',
  strokeWidth: 1,
  fill: 'transparent'
}

export class Rectangle {
  private instance: fabric.Rect

  constructor({ top, left }: RectOptions) {
    this.instance = new fabric.Rect({
      top,
      left,
      ..._defaultOptions
    })
  }

  getInstance() {
    return this.instance
  }

  update({ top, left }: RectOptions) {
    const {
      top: currentTop,
      left: currentLeft
    } = this.instance.getBoundingRect()

    if (currentTop > top) {
      this.instance.set('top', top)
    }

    if (currentLeft > left) {
      this.instance.set('left', left)
    }

    this.instance.set('width', Math.abs(left - currentLeft))
    this.instance.set('height', Math.abs(top - currentTop))
  }
}
