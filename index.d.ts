type POSITIONS = 'left' | 'center' | 'right'
type BUTTON = boolean | string | object

interface caConfig {
  text?: string | object
  html?: string | object
  title?: string | object
  footer?: string | object
  form?: object
  timer?: number
  confirmButton?: BUTTON
  cancelButton?: BUTTON
  backdropPostion?: POSITIONS
  iconPosition?: POSITIONS
  contentPosition?: POSITIONS
  icon?: 'success' | 'error' | 'info' | 'warning' | 'question'
  /**
   * This will style the modal
   * @example
   * calert({
   *    modal: {
   *      background: "yellow"
   *    }
   * })
   */
  modal?: object

  /**
   * This will style the overlay
   * @example
   * calert({
   *    backdrop: {
   *      background: "rgba(20,20,20,0.6)"
   *    }
   * })
   */
  backdrop?: object
  /**
   * This will trigger before the calert popups
   */
  preConfirm?: Function
  /**
   * This will add an image you can also add styling
   * @example
   * calert({
   *  image: {
   *    src: "https://picsum.photos/200/300",
   *    alt: "random photo",
   *  }
   * })
   */
  image?: object
  /**
   * This will add custom buttons
   * @example
   * calert({
   *  buttons: {
   *    try: "Try", // or
   *    try2: {
   *      innerText: "Try2",
   *      className: "custom-btn"
   *    }
   *  }
   * })
   */
  buttons?: { [key: string]: BUTTON }
  /**
   * This will animate the modal box
   * @example
   * calert({
   *  inputs: {
   *    username: {
   *      type: "password"
   *    }
   *  }
   * })
   */
  inputs?: { [key: string]: object }
  /**
   * This will animate the modal box
   * @example
   * animation: "fade .3s ease-in-out"
   */
  animation?: string
}

interface result {
  inputs?: object
  buttons?: object
  isCanceled?: boolean
  isConfirmed?: boolean
}

type config = string | caConfig
interface calert {
  (...params: config[]): Promise<result>
  utils: {
    tag: (tag: string | HTMLElement, options?: object) => Node
    styles: (element: HTMLElement, options?: object) => Node
    edit: (element: HTMLElement, options?: object) => any
    queryAll: (selector: string) => NodeList
    createPromise: () => object
  }
}

declare const calert: calert
export default calert
