# Sass/SCSS

![sass-1](/public/images/frontend/sass_scss/sass-1.png)

## 何謂 Sass/SCSS ?

Sass/SCSS 為`CSS預處理器`的一種，使用時須要透過編譯成CSS，瀏覽器才能夠看得懂。

Sass 是一款強化 CSS 的`輔助工具`，它在 CSS 語法的基礎上增加了`變量 (variables)`、`嵌套 (nested rules)`、`混合 (mixins)`、`導入 (inline imports)` 等功能。

## Sass 與 SCSS 的區別

兩者本質上是一樣的東西，差別在於其兩者`語法結構`的不同。

|         Sass         |       SCSS       |
| :------------------: | :--------------: |
|    語法類似 Ruby     |   語法類似 CSS   |
| 縮排代替大括號、分號 | 使用大括號、分號 |

### Sass 語法結構
```sass
.list
  display: flex
```

### SCSS 語法結構
```scss
.list {
  display: flex;
}
```

## Sass/SCSS 基本語法

- 參數與結構化 CSS
  - `Nesting` 巢狀語法
  - `Variables` 變數
- 模組化 CSS
  - `Import` 引入檔案，用來分別進行管理
  - `Extend` 繼承，處理共同樣式
  - `Mixin` 混入，打包常用功能，替換局部變數
  - `Functions` 函式
- 自動化 CSS
  - `Condition` 條件判斷
  - `Loop` 跑迴圈：例如使用 @each 搭配 array、@each 搭配 map、for 迴圈

## 參數與結構化 CSS

### `Nesting` 巢狀語法

Sass 允許 CSS樣式使用嵌套方式。

```scss
      /* scss */
      .nav {
        background: #eee;
        li {
            display: inline-block;
        }
       }
```

::: details 編譯後
```css
      /* css */
      .nav {
        background: #eee;
      }
      .nav li {
        display: inline-block;
      }       
```
:::

#### 父選擇器 `&`
>在嵌套CSS 規則時，有時也需要直接使用嵌套外層的父選擇器。
>可以用 `&` 代表嵌套規則外層的父選擇器。

```scss
      /* scss */
      a {
        font-weight: bold;
        text-decoration: none;
        &:hover { text-decoration: underline; }
        body.firefox & { font-weight: normal; }
      }
```

::: details 編譯後
```css
      /* css */
      a {
        font-weight: bold;
        text-decoration: none;
      }
      a:hover {
        text-decoration: underline;
      }
      body.firefox a {
        font-weight: normal;
      }
```
:::

#### 屬性嵌套
>有些 CSS 屬性遵循相同的 `命名空間(namespace)`，
>比如 `font-family`, `font-size`, `font-weight` 都以 `font` 作為屬性的命名空間。
>為了便於管理這樣的屬性，同時也為了避免了重複輸入，Sass 允許將屬性嵌套在 `命名空間` 中。
  
```scss
      /* scss */
      .funky {
        font: {
          family: fantasy;
          size: 30em;
          weight: bold;
        }
      }
```

::: details 編譯後
```css
      /* css */
      .funky {
        font-family: fantasy;
        font-size: 30em;
        font-weight: bold;
      }
```
:::


### `Variables` 變數

Sass變數，以 `$` 開頭，可以在任何地方聲明。
    
變數可以減少重複、進行複雜的運算。

```scss
    /* scss */
    $base-color: #c6538c;
    $border-dark: rgba($base-color, 0.88);
    .alert {
      border: 1px solid $border-dark;
    }
```

::: details 編譯後
```css
    /* css */
    .alert {
      border: 1px solid rgba(198, 83, 140, 0.88);
    }
```
:::

 #### 默認值
>當變數賦值時，如果該變數已經有一個值，舊值將被覆蓋。
>Sass 提供了 `!default` 標誌。僅當該變數 `未定義` 或其值為 `null` ，才使用新值。

```scss
        /* scss */
        $content: "First content";
        $content: "Second content?" !default;
        #main {
          content: $content;
        }
```

::: details 編譯後
```css
        /* css */
        #main {
          content: "First content";
        }
```
:::

>`使用規則：` `!default` 加載模塊時可以配置定義的變數。
>要加載帶有配置的模塊，請編寫 `@use <url> with (<variable>: <value>)` ，
>配置的值將 `覆蓋` 變數的默認值。
>只能配置在樣式表頂層編寫的帶有 `!default` 標誌的變數。

```scss
        // _library.scss
        $border-radius: 0.25rem !default;
        code {
          border-radius: $border-radius;
        }
```
```scss
        // style.scss
        @use 'library' with (
          $border-radius: 0.1rem
        );
```

::: details 編譯後
```css
        /* css */
        code {
          border-radius: 0.1rem;
        }
```
:::

#### 作用域 (區域變數、全域變數)
>當 `區域變數` 與 `全域變數` 同名時，不受全域變數影響。
```scss
      /* scss */
      $variable: "global value";
      .content {
        $variable: "local value";
        value: $variable;
      }
      .sidebar {
        value: $variable;
      }
```

::: details 編譯後
```css
      /* css */
      .content {
        value: "local value";
      }
      .sidebar {
        value: "global value";
      }
```
:::

## 模組化 CSS

### `Import` 引入檔案，用來分別進行管理

透過 ```@import``` 或 ```@use``` 語法，可將 SCSS 以模組化的形式，從其他 SCSS 檔案引入需要的樣式。
>需注意的是，要作為```模組```載入的 SCSS 檔案，名稱必須帶有```底線```，例如 ```_base.scss```

```scss
      // _base.scss
      $font-stack:    Helvetica, sans-serif;
      $primary-color: #333;

      body {
        font: 100% $font-stack;
        color: $primary-color;
      }
```

```@import```：會```全部```導入樣式，有可能產生```命名衝突```的狀況
```scss
      // style.scss
      @import 'base';
```

```@use```：會參照```部分```樣式，只載入需要使用的樣式，可降低衝突的可能性
```scss
      // style.scss
      @use 'base';
      
    .inverse {
      background-color: base.$primary-color;
      color: white;
    }
```

::: details 編譯後
```css
      /* css */
      body {
        font: 100% Helvetica, sans-serif;
        color: #333;
      }

      .inverse {
        background-color: #333;
        color: white;
      }
```
:::


### `Extend` 繼承，處理共同樣式

當許多選擇器具有相同樣式時，可透過```% ```佔位符號宣告，將所有相同樣式內容```合併```，在以 ```@extend``` 來引入使用。
>使用```%```佔位符號的class，在被編譯```不會產生實體css```，而是在它被```@extend```時才會被編譯出來。

```scss
      /* scss */
      /* 有被extend的class */
      %red-block {
        border: 1px solid red;
        padding: 20px;
      }

      /* 沒有被extend的class */
      %blue-block {
        background-color: blue;
        color: white;
        padding: 100px;
      }

      .error {
        @extend %red-block;
      }

      .success {
        @extend %red-block;
        border-color: green;
      }
```

::: details 編譯後
```css
      /* css */
      .error, .success{
        border: 1px solid red;
        padding: 20px;
      }

      .success {
        border-color: green;
      }
```
:::


### `Mixin` 混入，打包常用功能，替換局部變數

將經常被重複使用的程式碼獨立撰寫，以 ```@mixin``` 語法包裝起來，需要時透過 ```@include``` 引用，即可根據不同參數來設定相似的樣式，常用於 width、height、flex-center 等。

#### RWD上使用
```scss
      /* scss */
      // 經常重複使用的樣式
      // @content 會將寫在＠include 中的樣式複製到 mixin 裡，再透過編譯呈現
      @mixin pad{
        @media(max-width:768px){
          @content;
        }
      }
      @mixin mobile{
        @media(max-width:375px){
          @content;
        }
      }

      .box{
        width: 100px;
        height: 100px;
        background: black;
        @include pad{
          background:blue;
        }
        @include mobile{
          background:red;
        }
      }
```

::: details 編譯後
```css
      /* css */
      .box{
        width: 100px;
        height: 100px;
        background: black;
      }
      @media(max-width:768px){
        .box{
          background:blue;
        }
      }
      @media(max-width:375px){
        .box{
          background:red;
        }
      }
```
:::

#### ```@mixin```不只可以使用在樣式
>```@mixin```不只可以包裝 CSS 樣式，嚴格來講可以包裝 CSS 和 SCSS 中的任何有效內容。

```scss
      /* scss */
      @mixin font-reset {
        font-family: Arial, Helvetica, sans-serif;
      }

      @mixin text-error {
        color: red;
        @include font-reset;
      }

      .span {
        @include text-error;
      }
```

::: details 編譯後
```css
      /* css */
      .span {
        color: red;
        font-family: Arial, Helvetica, sans-serif;
      }
```
:::

#### 傳入參數
>```@mixin``` 也被允許可以有傳入參數。
```scss
      /* scss */
      @mixin size($num1, $num2) {
        width: $num1;
        height: $num2;
      }

      .box {
        @include size(200px, 300px);
      }
```

::: details 編譯後
```css
      /* css */
      .box{
        width: 200px;
        height: 300px;
      }
```
:::

#### 可選參數
>傳入參數也被允許有預設值，可以避免未完整傳入全部參數導致編譯錯誤。
```scss
      /* scss */
      @mixin size($num1: 150px, $num2: 150px) {
        width: $num1;
        height: $num2;
      }

      .box1 {
        @include size(200px);
      }

      .box2 {
        @include size($num2: 200px);
      }
```

::: details 編譯後
```css
      /* css */
      .box1{
        width: 200px;
        height: 150px;
      }

      .box2{
        width: 150px;
        height: 200px;
      }
```
:::

#### ```@mixin``` 與 ```@extend``` 的使用時機
>```@mixin```的使用上較容易產生大量重複的程式碼，```@extend```則相對不會。
>```@mixin```可使用```傳入參數```、```@content```，```@extend```則沒有。

該使用何者可以從幾個方向思考
- 是否需傳遞參數
- 是否需考慮編譯後 CSS 大小


### `Functions` 函式
與 `@mixin` 不同的地方在於 `@function` 無法直接將 CSS 樣式加載至當前所在的 CSS 塊內，反而是透過 `@return` 將函式內處理的結果返回給呼叫的對象後續再進行相關處理。
>`@mixin`負責包裝CSS樣式；`@function`則負責包裝需透過處理使的對象。

```scss
      /* scss */
      // _variables.scss
      $theme-colors: map-merge(
        (
          'primary': #007bff,
          'secondary': #6c757d,
          'success': #28a745,
        ),
        ()
      );

      // _functions.scss
      @function theme-color($key) {
        @return map-get($theme-colors, $key);
      }

      .text-primary {
        color: theme-color(primary);
      }
```

::: details 編譯後
```css
      /* css */
      .text-primary {
        color: #007bff;
      }
```
:::

#### 可選參數
>即預設參數，傳入參數即使不傳入也還是可以直接取預設值

```scss
      /* scss */
      @function getUrl($fileName, $ext: 'png') {
        $baseUrl: '/src/assets/img/';
        @return $baseUrl + $fileName + '.' + $ext;
      }

      .logo {
        background-image: url(getUrl('logo'));
      }

      .icon {
        background-image: url(getUrl('facebook', 'svg'));
      }
```

::: details 編譯後
```css
      /* css */
      .logo {
        background-image: url('/src/assets/img/logo.png');
      }

      .icon {
        background-image: url('/src/assets/img/facebook.svg');
      }
```
:::

## 自動化 CSS

### `Condition` 條件判斷
Sass中提供了`@if`、`@else if`、`@else`條件判斷式。
邏輯運算子則有`==`、`!=`、`>=`、`<=`、`and`、`or`、`not`等...
>不同於javascript沒有`===`的運算子或是`switch`的條件判斷式

```scss
      /* scss */
      $device: mobile;

      p {
        @if $device == desktop {
          font-size: 1.5rem;
        } 
        @else if $device == pad {
          font-size: 1.25rem;
        } 
        @else {
          font-size: 1rem;
        }
        color: red;
      }
```

::: details 編譯後
```css
      /* css */
      p {
        font-size: 1rem;
        color: red;
      }
```
:::


### `Loop` 迴圈

Sass裡迴圈可以使用`@for`、`@each`、`@while`等語法

#### `@for`語法

```scss
      /* scss */
      /*
          $i 變量 (即let i)
          start 起始值
          end 結束值
      */
      @for $i from <start> through <end> // 包含end
      @for $i from <start> to <end> // 不包含end
```

##### trough (start <= end)

```scss
      /* scss */
      @for $i from 1 through 3 {
        .item-#{$i} { width: 2em * $i; }
      }
```

::: details 編譯後
```css
      /* css */
      .item-1 {
        width: 2em;
      }

      .item-2 {
        width: 4em;
      }

      .item-3 {
        width: 6em;
      }
```
:::

##### to (start < end)

```scss
      /* scss */
      @for $i from 1 to 3 {
        .item-#{$i} { width: 2em * $i; }
      }
```

::: details 編譯後
```css
      /* css */
      .item-1 {
        width: 2em;
      }

      .item-2 {
        width: 4em;
      }
```
:::

#### `@each`語法
`@each`語法大多會用於遍歷`map`或是`array`

```scss
      /* scss */
      $theme-colors: (
        primary: #0000ff,
        success: #008000,
        warning: #ffff00,
        danger: #ff0000,
      );

      @each $key, $value in $theme-colors {
        .text-#{$key} {
          color: $value;
        }
      }
```

::: details 編譯後
```css
      /* css */
      .text-primary {
        color: #0000ff;
      }

      .text-success {
        color: #008000;
      }

      .text-warning {
        color: #ffff00;
      }

      .text-danger {
        color: #ff0000;
      }
```
:::

#### `@while`語法

```scss
      /* scss */
      $i: 1;

      @while $i <= 3 {
        .pt-#{$i} {
          padding-top: $i * 10px;
        }
        $i: $i + 1;
      }
```

::: details 編譯後
```css
      /* css */
      .pt-1 {
        padding-top: 10px;
      }

      .pt-2 {
        padding-top: 20px;
      }

      .pt-3 {
        padding-top: 30px;
      }
```
:::