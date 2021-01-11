type POSITIONS = 'left' | 'center' | 'right'
type BUTTON = boolean | string | object

interface caConfig {
  text?: string | object
  html?: string | object
  title?: string | object
  footer?: string | object
  form?: object
  confirmButton?: BUTTON
  cancelButton?: BUTTON
  backdropPostion?: POSITIONS
  iconPosition?: POSITIONS
  contentPosition?: POSITIONS
  modalBox?: object
  backdrop?: object
  preConfirm?: Function
  image?: object
  buttons?: { [key: string]: BUTTON }
  inputs?: { [key: string]: object }
  icon?: 'success' | 'error' | 'info' | 'warning' | 'question'
}

type tag = string | HTMLElement
interface caFunction {
  (...params: caConfig | string): Promise<any>
  utils: {
    tag: (tag: tag, options?: object) => Node
    styles: (element: HTMLElement, options?: object) => Node
    edit: (element: HTMLElement, options?: object) => any
    queryAll: (selector: string) => NodeList
    createPromise: () => object
  }
}
declare const ca: caFunction
export default ca
