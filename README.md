# Custom-Alert

Custom-alert is a lightweight alternative for sweetalert.

> This library doest not support IE

This library inspire by [sweetalert](https://sweetalert.js.org/)

Checkout the [Documentation](https://calert.vercel.app)

# Installation

NPM

```bash
npm i calerts
```

Unpkg (9kb)

```html
<script src="https://unpkg.com/calerts"></script>
```

Unpkg Unbabel Version (8kb)

```html
<script src="https://unpkg.com/calerts@latest/dist/calert.unbabel.min.js"></script>
```

# Usage

```javascript
calert('Error', 'Something error occured', 'error')
```

![sample](https://github.com/darkcris1/calerts/blob/master/images/sample.png?raw=true)

## sample 2

```javascript
calert({
  icon: 'question',
  title: 'Do you have any questions ?',
  confirmButton: 'Yes',
  cancelButton: 'Nothing',
}))
```

![sample](https://github.com/darkcris1/calerts/blob/master/images/sample3.png?raw=true)

## sample 3

```javascript
calert({
  icon: "warning",
  text: "You must login first",
  inputs: {
    username: {
      type: "text",
      placeholder: "Username"
    },
    password: {
      type: "password",
      placeholder: "Password",
    }
  }
  confirmButton: "Login"
})
```

![sample](https://github.com/darkcris1/calerts/blob/master/images/sample2.png?raw=true)
