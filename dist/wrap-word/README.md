# Wrap Word

## Objective

Dynamically wrap a specific word within an element so that it can be individually styled. Supports first and last words.

## How to Use

1. Load the script by adding `<script src="https://magrathea.guide/bracca/dist/wrap-word/wrap-word.js" defer></script>` to the site's HTML
    - We recommend that you add this script to the specific pages it'll be used on, as high up on that page as possible. Ideally, within the `<head>` tag. (Note that this script does **not** need to be placed just before the closing `</body>` tag [thanks to the `defer` keyword](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps/What_is_JavaScript#script_loading_strategies).)
1. Specify the parent elements containing words that should be wrapped by adding `data-js-trigger-word-wrap="first last"`, removing any modes that you do not want to use
    - For example, if you only want to wrap the last word, use `data-js-trigger-word-wrap="last"`
1. Add CSS styles. Words will be wrapped in spans which will all use the class `js-wrapped-word`. Based on which word is wrapped, there will be an additional custom data attribute like `data-word="last"`

## Before and After

If you start with the following HTML:

```html
<p data-js-trigger-word-wrap="first last">This is a demo.</p>
```

Then after this script runs, you'll end up with:

```html
<p data-js-trigger-word-wrap="first">
    <span class="js-wrapped-word" data-word="first">This</span> is a
    <span class="js-wrapped-word" data-word="last">demo.</span>
</p>
```

Note that all word wrappers share a common class and then have additional custom data attributes based on the word's position. This enables you to style all the wrapped words the same, or to style first and last words differently from each other, or some mix thereof.

For example, given the above, the following CSS would then cause that first word ("This") to have a pink background and the last word ("demo.") to have a light blue background:

```css
.js-wrapped-word[data-word="first"] {
    background-color: pink;
}

.js-wrapped-word[data-word="last"] {
    background-color: lightblue;
}
```

If you instead wanted all the words wrapped by this script to be styled the same, you could do:

```css
.js-wrapped-word {
    background-color: plum;
}
```

## Testing the Script

A [`_test.html`](_test.html) is included herein. This is not meant to be used on your site. It's for testing changes to the script to make sure that it still works as intended in a variety of possible circumstances.
