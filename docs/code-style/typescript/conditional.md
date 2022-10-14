# Conditional statements

Code blocks might contain multiple nested code blocks which complicates code readability. Having conditions inside the code will complicate the readability which is why it is recommended to use an _early exit check_. This pattern will increase readability of the code when there are multiple statements after the early exit.

DO:

```ts
function good() {
  if (something) {
    return doThis();
  }

  doThat();
  andEvenThat();
  plusThis();
}
```

DON'T:

```ts
function bad() {
  if (something) {
    doThis();
  } else {
    doThat();
    andEvenThat();
    plusThis();
  }
}
```

However, if you have a simple toggle condition that is tightly coupled to each other, it is recommended to use an if/else condition block. In this case, the toggle is very readable.
As soon as there are multiple code statements involved, it is better to use the early exit check.

Optionally you may extract that logic into a function/method to make if/else block slim and readable.

DO:

```ts
function good() {
  if (disabled) {
    enable();
  } else {
    disable();
  }
}
```

DON'T:

```ts
function bad() {
  if (disabled) {
    return enable();
  }

  disable();
}
```
