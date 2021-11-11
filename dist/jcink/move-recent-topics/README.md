# Move Recent Topics

## Objective

It's common on Jcink sites to move the "Recent Topic Activity" list away from its default location, most often into the Board Stats. This script does just that.

## How to Use

1. Load the script by adding `<script src="https://magrathea.guide/bracca/dist/move-recent-topics/move-recent-topics.js" defer></script>` to the site's HTML, someplace that includes both the recent topics **and** the parent you'd like to move them to
    - We recommend that you load the script in the Board Stats HTML Template. If not there, then another of the HTML Templates will also suffice.
    - We **do not** recommend you load the script in the Wrapper, as this will cause it to fire on _every_ page of the site, even those that do not have recent topics showing, filling your console with unnecessary error messages.
1. Specify where to move the Recent Topics to by adding `id="js-recent-topics-parent"` to the element that should become the new parent
