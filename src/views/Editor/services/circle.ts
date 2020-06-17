import { fabric } from 'fabric'

export interface EllipseOptions {
  top: number
  left: number
}

const _defaultOptions = {
  stroke: 'red',
  strokeWidth: 1,
  fill: 'transparent'
}

export class Ellipse {
  private instance: fabric.Ellipse

  constructor({ top, left }: EllipseOptions) {
    this.instance = new fabric.Ellipse({
      top,
      left,
      ..._defaultOptions
    })
  }

  getInstance() {
    return this.instance
  }

  update({ top, left }: EllipseOptions) {
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

    this.instance.set('rx', Math.abs(left - currentLeft) / 2)
    this.instance.set('ry', Math.abs(top - currentTop) / 2)
  }
}
