# Wrap Word

## Objective

Dynamically wrap a specific word within an element so that it can be individually styled. Supports first and last words.

## How to Use

1. Load the script by adding `<script src="https://coding-camp-wiki.github.io/jcink-utility-scripts/dist/wrap-word/wrap-word.js" defer></script>` to the site's HTML
    - We recommend that you add this script to the specific pages it'll be used on, as high up on that page as possible. Ideally, within the `<head>` tag. (Note that this script does **not** need to be placed just before the closing `</body>` tag [thanks to the `defer` keyword](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps/What_is_JavaScript#script_loading_strategies).)
1. Specify the parent elements containing words that should be wrapped by adding `data-trigger-word-wrap="first last"`, removing any modes that you do not want to use
1. Add CSS styles. Words will be wrapped in spans which will all use the class `js-wrapped-word`. Based on which word is wrapped, there will be an additional class like `--first-word`

## Before and After

If you start with the following HTML:

```html
<p data-trigger-word-wrap="first">This is a demo.</p>
```

Then after this script runs, you'll end up with:

```html
<p data-trigger-word-wrap="first">
    <span class="js-wrapped-word --first-word">This</span> is a demo.
</p>
```

The following CSS would then cause that first word ("This") to have a pink background:

```css
.js-wrapped-word.--first-word {
    background: pink;
}
```

Note that all word wrappers share a common class and then have additional modifier classes based on the word's position. This enables you to style all the wrapped words the same, or to style first and last words differently from each other, or some mix thereof.

## Testing the Script

A [`_test.html`](/_test.html) is included herein. This is not meant to be used on your site. It's for testing changes to the script to make sure that it still works as intended in a variety of possible circumstances.
